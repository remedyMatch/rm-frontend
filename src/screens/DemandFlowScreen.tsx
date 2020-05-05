import {WithStyles} from "@material-ui/core";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import React, {Component} from "react";
import {connect, ConnectedProps} from "react-redux";
import Flow from "../components/Flow/Flow";
import EntryTable from "../components/Table/EntryTable";
import {Angebot} from "../domain/angebot/Angebot";
import {Artikel} from "../domain/artikel/Artikel";
import {ArtikelKategorie} from "../domain/artikel/ArtikelKategorie";
import {ArtikelVariante} from "../domain/artikel/ArtikelVariante";
import kategorie_behelfsmaske from "../resources/kategorie_behelfsmaske.svg";
import kategorie_desinfektion from "../resources/kategorie_desinfektion.svg";
import kategorie_schutzkleidung from "../resources/kategorie_schutzkleidung.svg";
import kategorie_schutzmaske from "../resources/kategorie_schutzmaske.svg";
import kategorie_sonstiges from "../resources/kategorie_sonstiges.svg";
import {loadArtikelKategorien} from "../state/artikel/ArtikelKategorienState";
import {loadArtikel} from "../state/artikel/ArtikelState";
import {RootDispatch, RootState} from "../state/Store";
import {apiGet} from "../util/ApiUtils";
import CreateOfferDialog from "./OfferFlowScreen/CreateOfferDialog";

interface Props extends WithStyles<typeof styles>, PropsFromRedux {
}

interface State {
    createDemandDialogOpen: boolean;
    currentPage: number;
    selectedCategory?: ArtikelKategorie;
    selectedArticle?: Artikel;
    selectedVariant?: ArtikelVariante;
    variantSkipped?: boolean;
    results: Angebot[];
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
            "&:hover": {
                color: "#53284f",
                borderColor: "#53284f"
            }
        },
        results: {
            marginTop: "4em"
        }
    });

class DemandFlowScreen extends Component<Props, State> {
    state: State = {
        currentPage: 0,
        createDemandDialogOpen: false,
        results: []
    };

    render() {
        const classes = this.props.classes;

        return (
            <>
                <Flow
                    currentPage={this.state.currentPage}
                    onPreviousStepClicked={this.onPreviousStepClicked}
                    pages={[
                        {
                            flowPageName: "Kategorie",
                            title: "Welches Material suchen Sie?",
                            contentClass: clsx(classes.elementContainer, classes.categoryContainer),
                            content: this.props.artikelKategorien?.map(kategorie => (
                                <div
                                    className={classes.category}
                                    onClick={() => this.onCategorySelected(kategorie)}>
                                    <img
                                        className={classes.categoryIcon}
                                        alt={"Kategorie " + kategorie.name}
                                        src={this.getIcon(kategorie.name)}/>
                                    <span className={classes.categoryLabel}>
                                        {kategorie.name}
                                    </span>
                                </div>
                            ))
                        },
                        {
                            flowPageName: "Artikel",
                            title: "Was genau benötigen Sie?",
                            icon: this.getIcon(this.state.selectedCategory?.name || ""),
                            iconAlt: "Kategorie " + this.state.selectedCategory?.name,
                            contentClass: clsx(classes.elementContainer, classes.articleContainer),
                            content: this.props.artikel?.filter(artikel => artikel.artikelKategorieId === this.state.selectedCategory?.id).map(artikel => (
                                <div
                                    className={classes.article}
                                    onClick={() => this.onArticleSelected(artikel)}>
                                    {artikel.name}
                                </div>
                            ))
                        },
                        {
                            flowPageName: this.state.variantSkipped ? "Größe (übersprungen)" : "Größe",
                            disabled: this.state.variantSkipped,
                            title: "Welche Größe benötigen Sie?",
                            icon: this.getIcon(this.state.selectedCategory?.name || ""),
                            iconAlt: "Kategorie " + this.state.selectedCategory?.name,
                            contentClass: clsx(classes.elementContainer, classes.articleContainer),
                            content: this.state.selectedArticle?.varianten.map(variante => (
                                <div
                                    className={classes.article}
                                    onClick={() => this.onVariantSelected(variante)}>
                                    {variante.variante}
                                </div>
                            ))
                        }
                    ]}
                    finishedPage={{
                        title: "Wir haben 4 passende Angebote gefunden.",
                        subtitle: "Sie können die gewünschten Spender kontaktieren, um sie auf Ihren Bedarf aufmerksam zu machen, oder Sie können ein Inserat erstellen, damit sich Spender bei Ihnen melden können.",
                        action: "Inserat erstellen",
                        onActionClicked: this.onCreateOfferClicked,
                        icon: this.getIcon(this.state.selectedCategory?.name || ""),
                        iconAlt: "Kategorie " + this.state.selectedCategory?.name,
                        content: (
                            <>
                                <EntryTable
                                    className={classes.results}
                                    hideType
                                    artikel={this.props.artikel || []}
                                    artikelKategorien={this.props.artikelKategorien || []}
                                    angebote={this.state.results}
                                    bedarfe={[]}/>

                                <CreateOfferDialog
                                    variantId={this.state.selectedVariant?.id}
                                    open={this.state.createDemandDialogOpen}
                                    onCancelled={this.onCancelCreateOfferClicked}
                                    onCreated={this.onCancelCreateOfferClicked}/>
                            </>
                        )
                    }}/>
            </>
        )
    }

    componentDidMount = async () => {
        this.props.loadArtikel();
        this.props.loadArtikelKategorien();
    };

    private onCategorySelected = (selectedCategory: ArtikelKategorie) => {
        this.setState({
            selectedCategory: selectedCategory,
            currentPage: 1,
            results: []
        });
    };

    private onArticleSelected = (selectedArticle: Artikel) => {
        if (selectedArticle.varianten.length > 1) {
            this.setState({
                selectedArticle: selectedArticle,
                currentPage: 2,
                results: []
            });
        } else {
            this.setState({
                selectedArticle: selectedArticle,
                selectedVariant: selectedArticle.varianten[0],
                variantSkipped: true,
                currentPage: 3,
                results: []
            }, this.queryResults);
        }
    };

    private onVariantSelected = (selectedVariant: ArtikelVariante) => {
        this.setState({
            selectedVariant: selectedVariant,
            variantSkipped: false,
            currentPage: 3,
            results: []
        }, this.queryResults);
    };

    private onCreateOfferClicked = () => {
        this.setState({
            createDemandDialogOpen: true
        });
    };

    private onCancelCreateOfferClicked = () => {
        this.setState({
            createDemandDialogOpen: false
        });
    };

    private queryResults = async () => {
        const result = await apiGet<Angebot[]>("/remedy/angebot/suche");
        this.setState({
            results: result.result || []
        });
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
                break;
            }
            case 1: {
                this.setState({
                    currentPage: 1,
                    selectedArticle: undefined,
                    selectedVariant: undefined,
                    variantSkipped: undefined
                });
                break;
            }
            case 2: {
                this.setState({
                    currentPage: 2,
                    selectedVariant: undefined,
                    variantSkipped: undefined
                });
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

export default connector(withStyles(styles)(DemandFlowScreen));
