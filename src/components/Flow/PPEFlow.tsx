import {CircularProgress, WithStyles} from "@material-ui/core";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import React, {Component} from "react";
import {connect, ConnectedProps} from "react-redux";
import Flow from "../../components/Flow/Flow";
import CountBadge from "../Content/CountBadge";
import {Angebot} from "../../domain/angebot/Angebot";
import {Artikel} from "../../domain/artikel/Artikel";
import {ArtikelKategorie} from "../../domain/artikel/ArtikelKategorie";
import {ArtikelVariante} from "../../domain/artikel/ArtikelVariante";
import {Bedarf} from "../../domain/bedarf/Bedarf";
import kategorie_behelfsmaske from "../../resources/kategorie_behelfsmaske.svg";
import kategorie_desinfektion from "../../resources/kategorie_desinfektion.svg";
import kategorie_schutzkleidung from "../../resources/kategorie_schutzkleidung.svg";
import kategorie_schutzmaske from "../../resources/kategorie_schutzmaske.svg";
import kategorie_sonstiges from "../../resources/kategorie_sonstiges.svg";
import {loadArtikelKategorien} from "../../state/artikel/ArtikelKategorienState";
import {loadArtikel} from "../../state/artikel/ArtikelState";
import {RootDispatch, RootState} from "../../state/Store";
import {apiGet, logApiError} from "../../util/ApiUtils";
import ResultList from "../List/ResultList";

interface CountEntry {
    id: string;
    anzahl: number;
}

interface Props extends WithStyles<typeof styles>, PropsFromRedux {
    flowType: "offer" | "demand";

    articleCategoryPageTitle: string;
    articlePageTitle: string;
    articleVariantPageTitle: string;

    getLoadingPageTitle: (selectedArticle?: Artikel, selectedVariant?: ArtikelVariante) => string;
    getResultsPageSubtitle: (resultCount: number) => string;
    getResultsPageTitle: (resultCount: number, selectedArticle?: Artikel, selectedVariant?: ArtikelVariante) => string;

    onCreateAdActionClicked: (variantId: string) => void;

    getLoadCategoryCountsUrl: () => string;
    getLoadArticleCountsUrl: (categoryId: string) => string;
    getLoadVariantCountsUrl: (articleId: string) => string;
    getLoadResultsUrl: (variantId: string) => string;
}

interface State {
    currentPage: number;

    selectedCategory?: ArtikelKategorie;
    selectedArticle?: Artikel;
    selectedVariant?: ArtikelVariante;
    variantSkipped?: boolean;

    resultsLoading: boolean;
    results: (Angebot | Bedarf)[];

    categoryCounts: CountEntry[];
    articleCounts: CountEntry[];
    variantCounts: CountEntry[];
}

const styles = (theme: Theme) =>
    createStyles({
        elementContainer: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "left",
            flexDirection: "row"
        },
        categoryContainer: {
            margin: "2em -1.5em"
        },
        category: {
            cursor: "pointer",
            margin: "1.5em",
            width: "calc((100% - 9em) / 3)",
            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            display: "flex",
            position: "relative",
            flexDirection: "column",
            justifyContent: "center",
            padding: "3em",
            transition: theme.transitions.create(["border", "box-shadow"]),
            border: "1px solid white",
            "&:hover": {
                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.3)",
                border: "1px solid #CCC"
            }
        },
        categoryIcon: {
            color: "#333"
        },
        categoryLabel: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "16px",
            color: "#333",
            lineHeight: 1.5,
            marginTop: "1em",
            textAlign: "center"
        },
        articleContainer: {
            margin: "2em -1em"
        },
        article: {
            height: "80px",
            cursor: "pointer",
            width: "calc((100% - 6em) / 3)",
            margin: "1em",
            color: "#666",
            border: "2px solid #666",
            borderRadius: "8px",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            padding: "1em 3em",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: theme.transitions.create(["border-color", "color"]),
            position: "relative",
            "&:hover": {
                color: "#53284f",
                borderColor: "#53284f"
            }
        },
        results: {
            marginTop: "4em"
        },
        countBadge: {
            position: "absolute",
            top: "8px",
            left: "8px"
        }
    });

class PPEFlow extends Component<Props, State> {
    state: State = {
        currentPage: 0,

        results: [],
        resultsLoading: false,

        categoryCounts: [],
        articleCounts: [],
        variantCounts: []
    };

    render() {
        return (
            <Flow
                currentPage={this.state.currentPage}
                onPreviousStepClicked={this.onPreviousStepClicked}
                pages={[
                    this.getArticleCategoryPage(),
                    this.getArticlePage(),
                    this.getArticleVariantPage()
                ]}
                finishedPage={this.getFinishedPage()}/>
        );
    }

    componentDidMount = () => {
        this.props.loadArtikel();
        this.props.loadArtikelKategorien();
        this.loadCategoryCounts();
    };

    private getArticleCategoryPage = () => {
        return {
            flowPageName: "Kategorie",
            title: this.props.articleCategoryPageTitle,
            contentClass: clsx(this.props.classes.elementContainer, this.props.classes.categoryContainer),
            content: this.props.artikelKategorien?.map(category => (
                <div
                    className={this.props.classes.category}
                    onClick={() => this.onCategorySelected(category)}>
                    <CountBadge
                        className={this.props.classes.countBadge}
                        count={this.state.categoryCounts.find(count => count.id === category.id)?.anzahl}/>
                    <img
                        className={this.props.classes.categoryIcon}
                        alt={"Kategorie " + category.name}
                        src={this.getIcon(category.name)}/>
                    <span className={this.props.classes.categoryLabel}>
                        {category.name}
                    </span>
                </div>
            ))
        };
    };

    private getArticlePage = () => {
        const icon = this.getIcon(this.state.selectedCategory?.name || "");
        const iconAlt = "Kategorie " + this.state.selectedCategory?.name;
        const articles = this.props.artikel?.filter(artikel => artikel.artikelKategorieId === this.state.selectedCategory?.id);
        const className = clsx(this.props.classes.elementContainer, this.props.classes.articleContainer);

        return {
            flowPageName: "Artikel",
            title: this.props.articlePageTitle,
            icon: icon,
            iconAlt: iconAlt,
            contentClass: className,
            content: articles?.map(article => {
                const count = this.state.articleCounts.find(count => count.id === article.id)?.anzahl;

                return (
                    <div
                        className={this.props.classes.article}
                        onClick={() => this.onArticleSelected(article)}>
                        <CountBadge
                            className={this.props.classes.countBadge}
                            count={count}/>
                        {article.name}
                    </div>
                );
            })
        };
    };

    private getArticleVariantPage = () => {
        const name = this.state.variantSkipped ? "Größe (übersprungen)" : "Größe"
        const icon = this.getIcon(this.state.selectedCategory?.name || "");
        const iconAlt = "Kategorie " + this.state.selectedCategory?.name;
        const className = clsx(this.props.classes.elementContainer, this.props.classes.articleContainer);
        const variants = this.state.selectedArticle?.varianten;

        return {
            flowPageName: name,
            disabled: this.state.variantSkipped,
            title: this.props.articleVariantPageTitle,
            icon: icon,
            iconAlt: iconAlt,
            contentClass: className,
            content: variants?.map(variant => {
                const count = this.state.variantCounts.find(count => count.id === variant.id)?.anzahl;

                return (
                    <div
                        className={this.props.classes.article}
                        onClick={() => this.onVariantSelected(variant)}>
                        <CountBadge
                            className={this.props.classes.countBadge}
                            count={count}/>
                        {variant.variante}
                    </div>
                );
            })
        };
    };

    private getFinishedPage = () => {
        const icon = this.getIcon(this.state.selectedCategory?.name || "");
        const iconAlt = "Kategorie " + this.state.selectedCategory?.name;

        if (this.state.resultsLoading) {
            return {
                title: this.props.getLoadingPageTitle(this.state.selectedArticle, this.state.variantSkipped ? undefined : this.state.selectedVariant),
                subtitle: "Bitte warten Sie einen Moment.",
                icon: icon,
                iconAlt: iconAlt,
                content: <CircularProgress variant="indeterminate" color="secondary"/>
            };
        }

        return {
            title: this.props.getResultsPageTitle(this.state.results.length, this.state.selectedArticle, this.state.variantSkipped ? undefined : this.state.selectedVariant),
            subtitle: this.props.getResultsPageSubtitle(this.state.results.length),
            action: "Inserat erstellen",
            onActionClicked: () => this.props.onCreateAdActionClicked(this.state.selectedVariant?.id || ""),
            icon: icon,
            iconAlt: iconAlt,
            content: (
                <ResultList
                    results={this.mapResults()}
                    resultsType={this.props.flowType === "offer" ? "demands" : "offers"}/>
            )
        };
    };

    private mapResults = () => {
        return this.state.results.map(result => ({
            id: result.id,
            icon: this.getIcon(this.state.selectedCategory?.name || ""),
            articleName: result.artikel.name,
            variantName: this.state.variantSkipped ? undefined : this.state.selectedVariant?.variante,
            location: result.ort,
            distance: result.entfernung,
            amount: result.verfuegbareAnzahl
        }));
    };

    private loadCategoryCounts = async () => {
        const result = await apiGet<CountEntry[]>(this.props.getLoadCategoryCountsUrl());
        if (result.error) {
            logApiError(result, "Beim Laden der verfügbaren Inserate für die Artikel-Kategorien ist ein Fehler aufgetreten");
        } else {
            this.setState({
                categoryCounts: result.result || []
            });
        }
    };

    private loadArticleCounts = async (categoryId?: string) => {
        if (!categoryId) {
            return;
        }

        const result = await apiGet<CountEntry[]>(this.props.getLoadArticleCountsUrl(categoryId));
        if (result.error) {
            logApiError(result, "Beim Laden der verfügbaren Inserate für die Artikel ist ein Fehler aufgetreten");
        } else {
            this.setState({
                articleCounts: result.result || []
            });
        }
    };

    private loadVariantCounts = async (articleId?: string) => {
        if (!articleId) {
            return;
        }

        const result = await apiGet<CountEntry[]>(this.props.getLoadVariantCountsUrl(articleId));
        if (result.error) {
            logApiError(result, "Beim Laden der verfügbaren Inserate für die Artikel-Varianten ist ein Fehler aufgetreten");
        } else {
            this.setState({
                variantCounts: result.result || []
            });
        }
    };

    private loadResults = async (variantId: string) => {
        this.setState({
            resultsLoading: true
        });

        const result = await apiGet<(Angebot | Bedarf)[]>(this.props.getLoadResultsUrl(variantId));

        this.setState({
            results: result.result || [],
            resultsLoading: false
        });
    };

    private onCategorySelected = (selectedCategory: ArtikelKategorie) => {
        this.setState({
            selectedCategory: selectedCategory,
            currentPage: 1,
            results: []
        });
        this.loadArticleCounts(selectedCategory.id);
    };

    private onArticleSelected = (selectedArticle: Artikel) => {
        if (selectedArticle.varianten.length > 1) {
            this.setState({
                selectedArticle: selectedArticle,
                currentPage: 2,
                results: []
            });
            this.loadVariantCounts(selectedArticle.id);
        } else {
            this.setState({
                selectedArticle: selectedArticle,
                selectedVariant: selectedArticle.varianten[0],
                variantSkipped: true,
                currentPage: 3,
                results: []
            });
            this.loadResults(selectedArticle.varianten[0].id);
        }
    };

    private onVariantSelected = (selectedVariant: ArtikelVariante) => {
        this.setState({
            selectedVariant: selectedVariant,
            variantSkipped: false,
            currentPage: 3,
            results: []
        });
        this.loadResults(selectedVariant.id);
    };

    private getIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case "desinfektion": {
                return kategorie_desinfektion;
            }
            case "hygiene": {
                return kategorie_sonstiges;
            }
            case "schutzmasken": {
                return kategorie_schutzmaske;
            }
            case "schutzkleidung": {
                return kategorie_schutzkleidung;
            }
            case "probenentnahme": {
                return kategorie_sonstiges;
            }
            case "behelfs-maske": {
                return kategorie_behelfsmaske;
            }
            default: {
                return kategorie_sonstiges;
            }
        }
    };

    private onPreviousStepClicked = (index: number) => {
        switch (index) {
            case 0: {
                this.setState({
                    currentPage: 0,
                    selectedCategory: undefined,
                    selectedArticle: undefined,
                    selectedVariant: undefined,
                    variantSkipped: undefined
                });
                this.loadCategoryCounts();
                break;
            }
            case 1: {
                this.setState({
                    currentPage: 1,
                    selectedArticle: undefined,
                    selectedVariant: undefined,
                    variantSkipped: undefined
                });
                this.loadArticleCounts(this.state.selectedCategory?.id);
                break;
            }
            case 2: {
                this.setState({
                    currentPage: 2,
                    selectedVariant: undefined,
                    variantSkipped: undefined
                });
                this.loadVariantCounts(this.state.selectedArticle?.id);
                break;
            }
        }
    };
}

const mapStateToProps = (state: RootState) => ({
    artikel: state.artikel.value,
    artikelKategorien: state.artikelKategorien.value
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadArtikel: () => dispatch(loadArtikel()),
    loadArtikelKategorien: () => dispatch(loadArtikelKategorien())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withStyles(styles)(PPEFlow));
