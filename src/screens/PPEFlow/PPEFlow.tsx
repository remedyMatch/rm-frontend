import {CircularProgress, WithStyles} from "@material-ui/core";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import React, {Component} from "react";
import {connect, ConnectedProps} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router-dom";
import CountBadge from "../../components/Content/CountBadge";
import Flow from "../../components/Flow/Flow";
import ResultList, {ResultListDataRow} from "../../components/List/ResultList";
import {Angebot} from "../../domain/angebot/Angebot";
import {InstitutionAngebot} from "../../domain/angebot/InstitutionAngebot";
import {Artikel} from "../../domain/artikel/Artikel";
import {ArtikelKategorie} from "../../domain/artikel/ArtikelKategorie";
import {ArtikelVariante} from "../../domain/artikel/ArtikelVariante";
import {Bedarf} from "../../domain/bedarf/Bedarf";
import {InstitutionBedarf} from "../../domain/bedarf/InstitutionBedarf";
import kategorie_behelfsmaske from "../../resources/kategorie_behelfsmaske.svg";
import kategorie_desinfektion from "../../resources/kategorie_desinfektion.svg";
import kategorie_probenentnahme from "../../resources/kategorie_probenentnahme.svg";
import kategorie_schutzkleidung from "../../resources/kategorie_schutzkleidung.svg";
import kategorie_schutzmaske from "../../resources/kategorie_schutzmaske.svg";
import kategorie_sonstiges from "../../resources/kategorie_sonstiges.svg";
import {loadInstitutionAngebote} from "../../state/angebot/InstitutionAngeboteState";
import {loadArtikelKategorien} from "../../state/artikel/ArtikelKategorienState";
import {loadArtikel} from "../../state/artikel/ArtikelState";
import {loadInstitutionBedarfe} from "../../state/bedarf/InstitutionBedarfeState";
import {RootDispatch, RootState} from "../../state/Store";
import {apiGet, logApiError} from "../../util/ApiUtils";
import ChooseAdDialog from "./ChooseAdDialog";
import ContactEntryDialog from "./ContactEntryDialog";
import CreateDemandDialog from "./CreateDemandDialog";
import CreateOfferDialog from "./CreateOfferDialog";

interface CountEntry {
    id: string;
    anzahl: number;
}

interface Props extends WithStyles<typeof styles>, PropsFromRedux, RouteComponentProps {
    flowType: "offer" | "demand";

    initialCategoryId?: string;
    initialArticleId?: string;
    initialVariantId?: string;

    articleCategoryPageTitle: string;
    articlePageTitle: string;
    articleVariantPageTitle: string;

    getLoadingPageTitle: (selectedArticle?: Artikel, selectedVariant?: ArtikelVariante) => string;
    getResultsPageSubtitle: (resultCount: number) => string;
    getResultsPageTitle: (resultCount: number, selectedArticle?: Artikel, selectedVariant?: ArtikelVariante) => string;

    getLoadCategoryCountsUrl: () => string;
    getLoadArticleCountsUrl: (categoryId: string) => string;
    getLoadVariantCountsUrl: (articleId: string) => string;
    getLoadResultsUrl: (variantId: string) => string;
}

interface State {
    currentPage: number;
    initialCategoryProcessed: boolean;
    initialArticleAndVariantProcessed: boolean;

    selectedAd?: InstitutionAngebot | InstitutionBedarf;
    selectedEntry?: Angebot | Bedarf;

    createAdDialogOpen: boolean;
    chooseAdDialogOpen: boolean;
    contactEntryDialogOpen: boolean;

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
            height: "8em",
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
        initialCategoryProcessed: false,
        initialArticleAndVariantProcessed: false,

        chooseAdDialogOpen: false,
        createAdDialogOpen: false,
        contactEntryDialogOpen: false,

        results: [],
        resultsLoading: false,

        categoryCounts: [],
        articleCounts: [],
        variantCounts: []
    };

    render() {
        return (
            <>
                <Flow
                    currentPage={this.state.currentPage}
                    onPreviousStepClicked={this.onPreviousStepClicked}
                    pages={[
                        this.getArticleCategoryPage(),
                        this.getArticlePage(),
                        this.getArticleVariantPage()
                    ]}
                    finishedPage={this.getFinishedPage()}/>

                {this.props.flowType === "offer" && (
                    <CreateOfferDialog
                        variantId={this.state.selectedVariant?.id}
                        open={this.state.createAdDialogOpen}
                        onCancelled={this.onCreateAdDialogCancelled}
                        onCreated={this.onCreateAdDialogCreated}/>
                )}

                {this.props.flowType === "demand" && (
                    <CreateDemandDialog
                        variantId={this.state.selectedVariant?.id}
                        open={this.state.createAdDialogOpen}
                        onCancelled={this.onCreateAdDialogCancelled}
                        onCreated={this.onCreateAdDialogCreated}/>
                )}

                <ContactEntryDialog
                    open={this.state.contactEntryDialogOpen}
                    onContacted={this.onContactDialogContacted}
                    onCancelled={this.onContactDialogCancelled}
                    selectedAd={this.state.selectedAd}
                    selectedEntry={this.state.selectedEntry}
                    type={this.props.flowType}/>

                <ChooseAdDialog
                    categoryIcon={this.getIcon(this.state.selectedCategory?.name || "")}
                    open={this.state.chooseAdDialogOpen}
                    onChosen={this.onChooseAdDialogChosen}
                    onCreateClicked={this.onChooseAdDialogCreateClicked}
                    onCancelled={this.onChooseAdDialogCancelled}
                    institutionEntries={(this.props.flowType === "offer" ? this.props.institutionAngebote : this.props.institutionBedarfe) || []}
                    flowType={this.props.flowType}
                    variantId={this.state.selectedVariant?.id}/>
            </>
        );
    }

    componentDidMount = () => {
        this.props.loadArtikel();
        this.props.loadArtikelKategorien();
        this.loadCategoryCounts();

        if (this.props.flowType === "offer") {
            this.props.loadInstitutionAngebote();
        } else {
            this.props.loadInstitutionBedarfe();
        }

        if (this.props.initialCategoryId && this.props.initialArticleId && this.props.initialVariantId) {
            this.setState({
                currentPage: 3
            });
            this.loadResults(this.props.initialVariantId);
        } else if (this.props.initialCategoryId && this.props.initialArticleId) {
            this.setState({
                currentPage: 2
            });
        } else if (this.props.initialCategoryId) {
            this.setState({
                currentPage: 1
            });
        }
    };

    componentDidUpdate() {
        if (this.props.initialCategoryId && this.props.artikelKategorien && !this.state.initialCategoryProcessed) {
            const category = this.props.artikelKategorien.find(k => k.id === this.props.initialCategoryId);
            if (category) {
                this.setState({
                    selectedCategory: category,
                    initialCategoryProcessed: true
                });
            } else {
                this.setState({
                    currentPage: 0,
                    initialCategoryProcessed: true
                });
            }
        }

        if (this.props.initialArticleId && this.props.artikel && !this.state.initialArticleAndVariantProcessed) {
            const article = this.props.artikel.find(a => a.id === this.props.initialArticleId);
            if (article) {
                if (this.props.initialVariantId) {
                    const variant = article.varianten.find(v => v.id === this.props.initialVariantId);
                    if (variant) {
                        this.setState({
                            selectedArticle: article,
                            selectedVariant: variant,
                            variantSkipped: article.varianten.length === 1,
                            initialArticleAndVariantProcessed: true
                        });
                    } else {
                        this.setState({
                            currentPage: 0,
                            initialArticleAndVariantProcessed: true
                        });
                    }
                } else {
                    this.setState({
                        selectedArticle: article,
                        initialArticleAndVariantProcessed: true
                    });
                }
            } else {
                this.setState({
                    currentPage: 0,
                    initialArticleAndVariantProcessed: true
                });
            }
        }
    }

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
            onActionClicked: this.onCreateAdDialogClicked,
            icon: icon,
            iconAlt: iconAlt,
            content: (
                <ResultList
                    onButtonClicked={this.onContactClicked}
                    results={this.mapResults()}/>
            )
        };
    };

    private onContactClicked = (entry: ResultListDataRow) => {
        if (!this.state.selectedAd) {
            this.setState({
                selectedEntry: entry.original,
                chooseAdDialogOpen: true
            });
        } else {
            this.setState({
                selectedEntry: entry.original,
                contactEntryDialogOpen: true
            });
        }
    };

    private onContactDialogContacted = () => {
        this.setState({
            selectedEntry: undefined,
            contactEntryDialogOpen: false
        });
    }

    private onContactDialogCancelled = () => {
        this.setState({
            selectedEntry: undefined,
            contactEntryDialogOpen: false
        });
    }

    private onChooseAdDialogChosen = (ad: InstitutionAngebot | InstitutionBedarf) => {
        this.setState({
            chooseAdDialogOpen: false,
            selectedAd: ad,
            contactEntryDialogOpen: true
        });
    };

    private onChooseAdDialogCreateClicked = () => {
        this.setState({
            chooseAdDialogOpen: false,
            createAdDialogOpen: true
        });
    };

    private onChooseAdDialogCancelled = () => {
        this.setState({
            chooseAdDialogOpen: false
        });
    };

    private onCreateAdDialogClicked = () => {
        this.setState({
            createAdDialogOpen: true
        });
    };

    private onCreateAdDialogCancelled = () => {
        this.setState({
            createAdDialogOpen: false
        });
    };

    private onCreateAdDialogCreated = (ad: InstitutionAngebot | InstitutionBedarf) => {
        this.setState({
            selectedAd: ad,
            createAdDialogOpen: false,
            contactEntryDialogOpen: !!this.state.selectedEntry
        });
    };

    private mapResults = () => {
        return this.state.results.map(result => ({
            id: result.id,
            icon: this.getIcon(this.state.selectedCategory?.name || ""),
            articleName: result.artikel.name,
            variantName: this.state.variantSkipped ? undefined : this.state.selectedVariant?.variante,
            location: result.standort,
            distance: result.entfernung,
            amount: result.verfuegbareAnzahl,
            comment: result.kommentar,
            sealed: ("originalverpackt" in result && result.originalverpackt) || undefined,
            sterile: result.steril,
            medical: result.medizinisch,
            useBefore: ("haltbarkeit" in result && !!result.haltbarkeit && new Date(result.haltbarkeit)) || undefined,
            original: result,
            type: this.props.flowType === "offer" ? "demand" as const : "offer" as const,
            buttonText: this.props.flowType === "offer" ? "Empfänger kontaktieren" : "Spender kontaktieren"
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
        }, this.updateRoute);
        this.loadArticleCounts(selectedCategory.id);
    };

    private onArticleSelected = (selectedArticle: Artikel) => {
        if (selectedArticle.varianten.length > 1) {
            this.setState({
                selectedArticle: selectedArticle,
                currentPage: 2,
                results: []
            }, this.updateRoute);
            this.loadVariantCounts(selectedArticle.id);
        } else {
            this.setState({
                selectedArticle: selectedArticle,
                selectedVariant: selectedArticle.varianten[0],
                variantSkipped: true,
                currentPage: 3,
                results: []
            }, this.updateRoute);

            this.loadResults(selectedArticle.varianten[0].id);
        }
    };

    private onVariantSelected = (selectedVariant: ArtikelVariante) => {
        this.setState({
            selectedVariant: selectedVariant,
            variantSkipped: false,
            currentPage: 3,
            results: []
        }, this.updateRoute);
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
                return kategorie_probenentnahme;
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
                }, this.updateRoute);
                this.loadCategoryCounts();
                break;
            }
            case 1: {
                this.setState({
                    currentPage: 1,
                    selectedArticle: undefined,
                    selectedVariant: undefined,
                    variantSkipped: undefined
                }, this.updateRoute);
                this.loadArticleCounts(this.state.selectedCategory?.id);
                break;
            }
            case 2: {
                this.setState({
                    currentPage: 2,
                    selectedVariant: undefined,
                    variantSkipped: undefined
                }, this.updateRoute);
                this.loadVariantCounts(this.state.selectedArticle?.id);
                break;
            }
        }
    };

    private updateRoute = () => {
        const prefix = this.props.flowType === "offer" ? "/angebot" : "/bedarf";
        if (this.state.currentPage === 0) {
            this.props.history.push(`${prefix}`);
        } else if (this.state.currentPage === 1) {
            this.props.history.push(`${prefix}/${this.state.selectedCategory?.id}`);
        } else if (this.state.currentPage === 2) {
            this.props.history.push(`${prefix}/${this.state.selectedCategory?.id}/${this.state.selectedArticle?.id}`);
        } else if (this.state.currentPage === 3) {
            this.props.history.push(`${prefix}/${this.state.selectedCategory?.id}/${this.state.selectedArticle?.id}/${this.state.selectedVariant?.id}`);
        }
    }
}

const mapStateToProps = (state: RootState) => ({
    artikel: state.artikel.value,
    artikelKategorien: state.artikelKategorien.value,
    institutionAngebote: state.institutionAngebote.value,
    institutionBedarfe: state.institutionBedarfe.value
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadArtikel: () => dispatch(loadArtikel()),
    loadArtikelKategorien: () => dispatch(loadArtikelKategorien()),
    loadInstitutionAngebote: () => dispatch(loadInstitutionAngebote()),
    loadInstitutionBedarfe: () => dispatch(loadInstitutionBedarfe())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter((withStyles(styles)(PPEFlow))));
