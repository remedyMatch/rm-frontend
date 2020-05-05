import {Button, Fade, Typography, WithStyles} from "@material-ui/core";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import React, {Component} from "react";
import {connect, ConnectedProps} from "react-redux";
import Stepper from "../components/Stepper/Stepper";
import EntryTable from "../components/Table/EntryTable";
import {Artikel} from "../domain/artikel/Artikel";
import {ArtikelKategorie} from "../domain/artikel/ArtikelKategorie";
import {ArtikelVariante} from "../domain/artikel/ArtikelVariante";
import {Bedarf} from "../domain/bedarf/Bedarf";
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
    createOfferDialogOpen: boolean;
    currentStep: number;
    selectedCategory?: ArtikelKategorie;
    selectedArticle?: Artikel;
    selectedVariant?: ArtikelVariante;
    variantSkipped?: boolean;
    results: Bedarf[];
}

const styles = (theme: Theme) =>
    createStyles({
        stepper: {
            marginTop: "6em",
            marginBottom: "6em",
            transition: theme.transitions.create("margin", {
                duration: 1000
            })
        },
        stepperFinished: {
            marginTop: "1em",
            marginBottom: "4em"
        },
        stepContentContainer: {
            display: "grid"
        },
        stepContent: {
            gridRow: 1,
            gridColumn: 1
        },
        title: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "24px",
            fontWeight: 600,
            lineHeight: 1.33,
            color: "#333"
        },
        subtitle: {
            marginTop: "12px",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "16px",
            color: "rgba(0, 0, 0, 0.54)"
        },
        titleContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: "-2.5em"
        },
        titleImageContainer: {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            borderRadius: "50%",
            padding: "1em",
            marginRight: "2em"
        },
        titleTextContainer: {
            display: "flex",
            flexDirection: "column",
            flexGrow: 1
        },
        titleButtonContainer: {
            marginLeft: "2em",
            placeSelf: "flex-end",
            paddingBottom: "8px"
        },
        titleImage: {
            height: "5em",
            color: "#333"
        },
        titleButton: {
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            height: "48px",
            textTransform: "none",
            color: "#007c92",
            border: "2px solid #007c92",
            borderRadius: "8px",
            whiteSpace: "nowrap",
            padding: "8px 24px",
            marginTop: "auto"
        },
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

class OfferFlowScreen extends Component<Props, State> {
    state: State = {
        currentStep: 0,
        createOfferDialogOpen: false,
        results: []
    };

    render() {
        const classes = this.props.classes;

        return (
            <>
                <Stepper
                    className={clsx(classes.stepper, this.state.currentStep === 3 && classes.stepperFinished)}
                    steps={[
                        {
                            title: "Kategorie"
                        },
                        {
                            title: "Artikel"
                        },
                        {
                            title: this.state.variantSkipped ? "Größe (übersprungen)" : "Größe",
                            disabled: this.state.variantSkipped
                        }
                    ]}
                    currentStep={this.state.currentStep}
                    finished={this.state.currentStep === 3}
                    onPreviousStepClicked={this.onPreviousStepClicked}/>

                <div className={classes.stepContentContainer}>

                    <Fade in={this.state.currentStep === 0} timeout={1000}>
                        <div className={classes.stepContent}>

                            <Typography className={classes.title}>Über welches Material verfügen Sie?</Typography>

                            <div className={clsx(classes.elementContainer, classes.categoryContainer)}>
                                {this.props.artikelKategorien?.map(kategorie => (
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
                                ))}
                            </div>

                        </div>
                    </Fade>

                    <Fade in={this.state.currentStep === 1} timeout={1000}>
                        <div className={classes.stepContent}>

                            <div className={classes.titleContainer}>
                                <div className={classes.titleImageContainer}>
                                    <img
                                        className={classes.titleImage}
                                        alt={"Kategorie " + this.state.selectedCategory?.name}
                                        src={this.getIcon(this.state.selectedCategory?.name || "")}/>
                                </div>
                                <Typography className={classes.title}>Um was handelt es sich genau?</Typography>
                            </div>

                            <div className={clsx(classes.elementContainer, classes.articleContainer)}>
                                {this.props.artikel?.filter(artikel => artikel.artikelKategorieId === this.state.selectedCategory?.id).map(artikel => (
                                    <div
                                        className={classes.article}
                                        onClick={() => this.onArticleSelected(artikel)}>
                                        {artikel.name}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </Fade>

                    <Fade in={this.state.currentStep === 2} timeout={1000}>
                        <div className={classes.stepContent}>

                            <div className={classes.titleContainer}>
                                <div className={classes.titleImageContainer}>
                                    <img
                                        className={classes.titleImage}
                                        alt={"Kategorie " + this.state.selectedCategory?.name}
                                        src={this.getIcon(this.state.selectedCategory?.name || "")}/>
                                </div>
                                <Typography className={classes.title}>Um welche Größe handelt es sich?</Typography>
                            </div>

                            <div className={clsx(classes.elementContainer, classes.articleContainer)}>
                                {this.state.selectedArticle?.varianten.map(variante => (
                                    <div
                                        className={classes.article}
                                        onClick={() => this.onVariantSelected(variante)}>
                                        {variante.variante}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </Fade>

                    <Fade in={this.state.currentStep === 3} timeout={1000}>
                        <div className={classes.stepContent}>

                            <div className={classes.titleContainer}>
                                <div className={classes.titleImageContainer}>
                                    <img
                                        className={classes.titleImage}
                                        alt={"Kategorie " + this.state.selectedCategory?.name}
                                        src={this.getIcon(this.state.selectedCategory?.name || "")}/>
                                </div>
                                <div className={classes.titleTextContainer}>
                                    <Typography className={classes.title}>Wir haben 4 passende Bedarfe
                                        gefunden.</Typography>
                                    <Typography className={classes.subtitle}>Sie können die gewünschten Empfänger
                                        kontaktieren, um Ihre Artikel anzubieten, oder Sie können ein Inserat erstellen,
                                        damit sich Empfänger bei Ihnen melden können.</Typography>
                                </div>
                                <div className={classes.titleButtonContainer}>
                                    <Button
                                        onClick={this.onCreateOfferClicked}
                                        variant="text"
                                        className={classes.titleButton}>
                                        Inserat erstellen
                                    </Button>
                                </div>
                            </div>

                            <EntryTable
                                className={classes.results}
                                hideType
                                artikel={this.props.artikel || []}
                                artikelKategorien={this.props.artikelKategorien || []}
                                angebote={[]}
                                bedarfe={this.state.results}/>

                        </div>
                    </Fade>

                    <CreateOfferDialog
                        open={this.state.createOfferDialogOpen}
                        onCancel={this.onCancelCreateOfferClicked}
                        onCreate={this.onCancelCreateOfferClicked}/>

                </div>
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
            currentStep: 1,
            results: []
        });
    };

    private onArticleSelected = (selectedArticle: Artikel) => {
        if (selectedArticle.varianten.length > 1) {
            this.setState({
                selectedArticle: selectedArticle,
                currentStep: 2,
                results: []
            });
        } else {
            this.setState({
                selectedArticle: selectedArticle,
                selectedVariant: selectedArticle.varianten[0],
                variantSkipped: true,
                currentStep: 3,
                results: []
            }, this.queryResults);
        }
    };

    private onVariantSelected = (selectedVariant: ArtikelVariante) => {
        this.setState({
            selectedVariant: selectedVariant,
            variantSkipped: false,
            currentStep: 3,
            results: []
        }, this.queryResults);
    };

    private onCreateOfferClicked = () => {
        this.setState({
            createOfferDialogOpen: true
        });
    };

    private onCancelCreateOfferClicked = () => {
        this.setState({
            createOfferDialogOpen: false
        });
    };

    private queryResults = async () => {
        const result = await apiGet<Bedarf[]>("/remedy/bedarf/suche");
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
                    currentStep: 0,
                    selectedCategory: undefined,
                    selectedArticle: undefined,
                    selectedVariant: undefined,
                    variantSkipped: undefined
                });
                break;
            }
            case 1: {
                this.setState({
                    currentStep: 1,
                    selectedArticle: undefined,
                    selectedVariant: undefined,
                    variantSkipped: undefined
                });
                break;
            }
            case 2: {
                this.setState({
                    currentStep: 2,
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

export default connector(withStyles(styles)(OfferFlowScreen));
