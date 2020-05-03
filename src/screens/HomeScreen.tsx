import {Typography} from "@material-ui/core";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import React, {Component} from "react";
import {connect, ConnectedProps} from "react-redux";
import EntryTable from "../components/Table/EntryTable";
import MatchTable from "../components/Table/MatchTable";
import RequestTable from "../components/Table/RequestTable";
import {Artikel} from "../domain/artikel/Artikel";
import {ArtikelKategorie} from "../domain/artikel/ArtikelKategorie";
import {loadAngebote} from "../state/angebot/AngeboteState";
import {loadArtikelKategorien} from "../state/artikel/ArtikelKategorienState";
import {loadArtikel} from "../state/artikel/ArtikelState";
import {loadBedarfe} from "../state/bedarf/BedarfeState";
import {loadMatches} from "../state/match/MatchesState";
import {RootDispatch, RootState} from "../state/Store";
import {WithStylesPublic} from "../util/WithStylesPublic";
import DemandDetailsDialog from "./Dialogs/Demand/DemandDetailsDialog";
import CancelEntryDialog from "./Dialogs/Home/CancelEntryDialog";
import CancelSentRequestDialog from "./Dialogs/Home/CancelSentRequestDialog";
import OfferDetailsDialog from "./Dialogs/Offer/OfferDetailsDialog";

interface Props extends WithStylesPublic<typeof styles>, PropsFromRedux {
}

interface State {
    cancelSentRequestId?: string;
    deleteEntry?: {
        isDemand: boolean;
        name: string;
        amount: number;
        id: string;
    };
    info?: {
        id: string;
        isOffer: boolean;
        article?: Artikel;
        category?: ArtikelKategorie;
    };
}

const styles = (theme: Theme) =>
    createStyles({
        subtitle: {
            fontWeight: 500,
            marginTop: "24px",
            marginBottom: "8px"
        }
    });

class HomeScreen extends Component<Props, State> {
    state: State = {};

    render() {
        const classes = this.props.classes!;
        const institutionId = ""; // TODO

        return (
            <>

                <Typography variant="subtitle1" className={classes.subtitle}>Meine Matches</Typography>

                <MatchTable
                    articles={this.props.artikel || []}
                    matches={this.props.matches || []}/>

                <Typography variant="subtitle1" className={classes.subtitle}>Meine Anfragen</Typography>

                <RequestTable
                    erhalten={/* TODO */ []}
                    gesendet={/* TODO */ []}
                    showType
                    artikel={this.props.artikel || []}
                    onCancel={this.onCancelSentRequest}/>

                <Typography variant="subtitle1" className={classes.subtitle}>Meine Anzeigen</Typography>

                <EntryTable
                    hideDistance
                    useSimplePagination
                    artikel={this.props.artikel || []}
                    artikelKategorien={this.props.artikelKategorien || []}
                    angebote={this.filterOffer()}
                    bedarfe={this.filterDemand()}
                    delete={{
                        onDelete: this.onDeleteEntry,
                        eigeneInstitutionId: institutionId
                    }}
                    details={{
                        onClick: this.onDetailsClicked,
                        eigeneInstitutionId: institutionId
                    }}/>

                <OfferDetailsDialog
                    open={!!this.state.info && this.state.info.isOffer}
                    onDone={this.onDetailsDone}
                    angebot={this.props.angebote?.find(item => item.id === this.state.info?.id)}
                    artikel={this.props.artikel || []}
                    artikelKategorien={this.props.artikelKategorien || []}/>

                <DemandDetailsDialog
                    open={!!this.state.info && !this.state.info.isOffer}
                    onDone={this.onDetailsDone}
                    bedarf={this.props.bedarfe?.find(item => item.id === this.state.info?.id)}
                    artikel={this.props.artikel || []}
                    artikelKategorien={this.props.artikelKategorien || []}/>

                <CancelSentRequestDialog
                    open={!!this.state.cancelSentRequestId}
                    requestId={this.state.cancelSentRequestId}
                    isDemand={/*TODO*/ false}
                    institutionName={/*TODO*/ "Keiner"}
                    onNo={this.onCancelSentRequestNo}
                    onYes={this.onCancelSentRequestYes}/>

                <CancelEntryDialog
                    open={!!this.state.deleteEntry}
                    onNo={this.onDeleteEntryNo}
                    onYes={this.onDeleteEntryYes}
                    isDemand={this.state.deleteEntry?.isDemand}
                    articleName={this.state.deleteEntry?.name}
                    amount={this.state.deleteEntry?.amount}
                    requestId={this.state.deleteEntry?.id}/>

            </>
        )
    }

    componentDidMount = async () => {
        this.props.loadArtikel();
        this.props.loadArtikelKategorien();
        this.props.loadAngebote();
        this.props.loadBedarfe();
        this.props.loadMatches();
    };

    private onCancelSentRequest = (id?: string) => {
        if (id) {
            this.setState({
                cancelSentRequestId: id
            });
        }
    };

    private onCancelSentRequestNo = () => {
        this.setState({
            cancelSentRequestId: undefined
        });
    };

    private onCancelSentRequestYes = () => {
        this.setState({
            cancelSentRequestId: undefined
        });
    };

    private onDetailsDone = () => {
        this.setState({
            info: undefined
        });
    };

    private onDetailsClicked = (id: string) => {
        if (!this.props.angebote) {
            return;
        }

        const offer = this.props.angebote?.find(angebot => angebot.id === id);
        const demand = this.props.bedarfe?.find(bedarf => bedarf.id === id);
        const isOffer = !!offer;
        const article = this.props.artikel?.find(artikel => artikel.id === offer?.artikelId || demand?.artikelId || "");
        const category = this.props.artikelKategorien?.find(kategorie => kategorie.id === article?.artikelKategorieId);

        this.setState({
            info: {isOffer, article, category, id}
        });
    };

    private filterDemand = () => {
        return (this.props.bedarfe || []); // TODO: FILTER
    };

    private onDeleteEntry = (id: string) => {
        const demand = this.props.bedarfe?.find(bedarf => bedarf.id === id);
        const offer = this.props.angebote?.find(angebot => angebot.id === id);
        const article = this.props.artikel?.find(artikel => artikel.id === demand?.artikelId || offer?.artikelId);

        this.setState({
            deleteEntry: {
                id: id,
                isDemand: !!demand,
                name: article?.name || "",
                amount: demand?.verfuegbareAnzahl || 0
            }
        });
    };

    private onDeleteEntryYes = () => {
        this.setState({
            deleteEntry: undefined
        });
        this.props.loadAngebote();
        this.props.loadBedarfe();
    };

    private onDeleteEntryNo = () => {
        this.setState({
            deleteEntry: undefined
        });
    };

    private filterOffer = () => {
        return (this.props.angebote || []); // TODO: Filter
    };
}

const mapStateToProps = (state: RootState) => ({
    angebote: state.angebote.value,
    artikel: state.artikel.value,
    artikelKategorien: state.artikelKategorien.value,
    bedarfe: state.bedarfe.value,
    matches: state.matches.value
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadAngebote: () => dispatch(loadAngebote()),
    loadArtikel: () => dispatch(loadArtikel()),
    loadArtikelKategorien: () => dispatch(loadArtikelKategorien()),
    loadBedarfe: () => dispatch(loadBedarfe()),
    loadMatches: () => dispatch(loadMatches())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withStyles(styles)(HomeScreen));
