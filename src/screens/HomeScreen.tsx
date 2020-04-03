import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../util/WithStylesPublic";
import EntryTable from "../components/Table/EntryTable";
import {Typography} from "@material-ui/core";
import RequestTable from "../components/Table/RequestTable";
import CancelSentRequestDialog from "./Dialogs/Home/CancelSentRequestDialog";
import {RootDispatch, RootState} from "../State/Store";
import {loadArtikel} from "../State/ArtikelState";
import {loadBedarfe} from "../State/BedarfeState";
import {loadEigeneInstitution} from "../State/EigeneInstitutionState";
import {connect, ConnectedProps} from "react-redux";
import {loadAngebote} from "../State/AngeboteState";
import {loadErhalteneAnfragen} from "../State/ErhalteneAnfragenState";
import {loadGesendeteAnfragen} from "../State/GesendeteAnfragenState";
import DemandDetailsDialog from "./Dialogs/Demand/DemandDetailsDialog";
import DeleteEntryDialog from "./Dialogs/Home/DeleteEntryDialog";
import OfferDetailsDialog from "./Dialogs/Offer/OfferDetailsDialog";
import {loadMatches} from "../State/MatchesState";
import MatchTable from "../components/Table/MatchTable";

interface Props extends WithStylesPublic<typeof styles>, PropsFromRedux {
}

interface State {
    cancelSentRequestId?: string;
    deleteEntryId?: string;
    deleteEntryIsDemand: boolean;
    infoId?: string;
    infoIsOffer: boolean;
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
    state: State = {
        infoIsOffer: false,
        deleteEntryIsDemand: false
    };

    render() {
        const classes = this.props.classes!;
        const institutionId = this.props.eigeneInstitution?.id || "";

        return (
            <>
                <Typography variant="subtitle1" className={classes.subtitle}>Meine Matches</Typography>
                <MatchTable
                    articles={this.props.artikel || []}
                    matches={this.props.matches || []}/>
                <Typography variant="subtitle1" className={classes.subtitle}>Meine Anfragen</Typography>
                <RequestTable
                    erhalten={this.props.erhalteneAnfragen || []}
                    gesendet={this.props.gesendeteAnfragen || []}
                    showType
                    artikel={this.props.artikel || []}
                    onCancel={this.onCancelSentRequest}/>
                <Typography variant="subtitle1" className={classes.subtitle}>Meine Anzeigen</Typography>
                <EntryTable
                    hideDistance
                    showDetailedAmount
                    useSimplePagination
                    useAdvancedLocation
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
                    open={!!this.state.infoId && this.state.infoIsOffer}
                    onDone={this.onDetailsDone}
                    eigeneInstitution={this.props.eigeneInstitution}
                    item={this.props.angebote?.find(item => item.id === this.state.infoId)!}/>
                <DemandDetailsDialog
                    open={!!this.state.infoId && !this.state.infoIsOffer}
                    onDone={this.onDetailsDone}
                    eigeneInstitution={this.props.eigeneInstitution}
                    item={this.props.bedarfe?.find(item => item.id === this.state.infoId)!}/>
                <CancelSentRequestDialog
                    open={!!this.state.cancelSentRequestId}
                    request={this.props.gesendeteAnfragen?.find(sr => (sr.angebotId || sr.bedarfId) === this.state.cancelSentRequestId)}
                    onNo={this.onCancelSentRequestNo}
                    onYes={this.onCancelSentRequestYes}/>
                <DeleteEntryDialog
                    open={!!this.state.deleteEntryId}
                    onNo={this.onDeleteEntryNo}
                    onYes={this.onDeleteEntryYes}
                    isDemand={this.state.deleteEntryIsDemand}
                    item={(this.props.bedarfe || []).concat(this.props.angebote || []).find(e => e.id === this.state.deleteEntryId)}
                    requestId={this.state.deleteEntryId}/>
            </>
        )
    }

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
        this.props.loadGesendeteAnfragen();
    };

    private onDetailsDone = () => {
        this.setState({
            infoId: undefined
        });
    };

    private onDetailsClicked = (id: string) => {
        if (!this.props.angebote) {
            return;
        }

        const isOffer = !!this.props.angebote.find(angebot => angebot.id === id);
        this.setState({
            infoId: id,
            infoIsOffer: isOffer
        });
    };

    private filterDemand = () => {
        return (this.props.bedarfe || [])
            .filter(bedarf => bedarf.institutionId === this.props.eigeneInstitution?.id);
    };

    private onDeleteEntry = (id: string) => {
        if (!this.props.bedarfe) {
            return;
        }

        const isDemand = !!this.props.bedarfe.find(bedarf => bedarf.id === id);
        this.setState({
            deleteEntryId: id,
            deleteEntryIsDemand: isDemand
        });

    };

    private onDeleteEntryYes = () => {
        this.setState({
            deleteEntryId: undefined
        });
        this.props.loadAngebote();
        this.props.loadBedarfe();
    };

    private onDeleteEntryNo = () => {
        this.setState({
            deleteEntryId: undefined
        });
    };

    private filterOffer = () => {
        return (this.props.angebote || [])
            .filter(angebot => angebot.institutionId === this.props.eigeneInstitution?.id);
    };

    componentDidMount = async () => {
        this.props.loadArtikel();
        this.props.loadAngebote();
        this.props.loadBedarfe();
        this.props.loadErhalteneAnfragen();
        this.props.loadGesendeteAnfragen();
        this.props.loadEigeneInstitution();
        this.props.loadMatches();
    };
}

const mapStateToProps = (state: RootState) => ({
    angebote: state.angebote.value,
    artikel: state.artikel.value,
    bedarfe: state.bedarfe.value,
    eigeneInstitution: state.eigeneInstitution.value,
    erhalteneAnfragen: state.erhalteneAnfragen.value,
    gesendeteAnfragen: state.gesendeteAnfragen.value,
    matches: state.matches.value
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadAngebote: () => dispatch(loadAngebote()),
    loadArtikel: () => dispatch(loadArtikel()),
    loadBedarfe: () => dispatch(loadBedarfe()),
    loadEigeneInstitution: () => dispatch(loadEigeneInstitution()),
    loadErhalteneAnfragen: () => dispatch(loadErhalteneAnfragen()),
    loadGesendeteAnfragen: () => dispatch(loadGesendeteAnfragen()),
    loadMatches: () => dispatch(loadMatches())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withStyles(styles)(HomeScreen));
