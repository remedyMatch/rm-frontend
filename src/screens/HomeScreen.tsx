import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../util/WithStylesPublic";
import {apiDelete} from "../util/ApiUtils";
import EntryTable from "../components/EntryTable";
import {Typography} from "@material-ui/core";
import RequestTable from "../components/RequestTable";
import CancelReceivedRequestDialog from "./Dialogs/CancelReceivedRequestDialog";
import {RootDispatch, RootState} from "../State/Store";
import {loadArtikel} from "../State/ArtikelState";
import {loadBedarfe} from "../State/BedarfeState";
import {loadEigeneInstitution} from "../State/EigeneInstitutionState";
import {connect, ConnectedProps} from "react-redux";
import {loadAngebote} from "../State/AngeboteState";
import {loadErhalteneAnfragen} from "../State/ErhalteneAnfragenState";
import {loadGesendeteAnfragen} from "../State/GesendeteAnfragenState";
import DemandDetailsDialog from "./Dialogs/Demand/DemandDetailsDialog";

interface Props extends WithStylesPublic<typeof styles>, PropsFromRedux {
}

interface State {
    cancelId?: string;
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
        infoIsOffer: false
    };

    render() {
        const classes = this.props.classes!;

        return (
            <>
                <Typography variant="subtitle1" className={classes.subtitle}>Erhaltene Anfragen</Typography>
                <RequestTable
                    rows={this.props.erhalteneAnfragen || []}
                    type="received"
                    demands={this.props.bedarfe}
                    offers={this.props.angebote}/>
                <Typography variant="subtitle1" className={classes.subtitle}>Gestellte Anfragen</Typography>
                <RequestTable
                    rows={this.props.gesendeteAnfragen || []}
                    type="sent"
                    demands={this.props.bedarfe}
                    offers={this.props.angebote}
                    onCancel={this.onCancelOffer}/>
                <Typography variant="subtitle1" className={classes.subtitle}>Meine Angebote</Typography>
                <EntryTable
                    rows={this.filterOffer()}
                    delete={{
                        onDelete: this.onDeleteOffer,
                        institutionId: this.props.eigeneInstitution?.id || ""
                    }}
                    details={{onClick: this.onOfferDetailsClicked}}/>
                <Typography variant="subtitle1" className={classes.subtitle}>Mein Bedarf</Typography>
                <EntryTable
                    rows={this.filterDemand()}
                    delete={{
                        onDelete: this.onDeleteDemand,
                        institutionId: this.props.eigeneInstitution?.id || ""
                    }}
                    details={{onClick: this.onDemandDetailsClicked}}/>
                <DemandDetailsDialog
                    open={!!this.state.infoId && this.state.infoIsOffer}
                    onDone={this.onDetailsDone}
                    item={this.props.angebote?.find(item => item.id === this.state.infoId)!}/>
                <DemandDetailsDialog
                    open={!!this.state.infoId && !this.state.infoIsOffer}
                    onDone={this.onDetailsDone}
                    item={this.props.bedarfe?.find(item => item.id === this.state.infoId)!}/>
                <CancelReceivedRequestDialog
                    open={!!this.state.cancelId}
                    request={this.props.gesendeteAnfragen?.find(sr => (sr.angebotId || sr.bedarfId) === this.state.cancelId)}
                    onNo={this.onCancelNo}
                    onYes={this.onCancelYes}
                />
            </>
        )
    }

    private onCancelOffer = (id?: string) => {
        if (id) {
            this.setState({
                cancelId: id
            });
        }
    };

    private onCancelNo = () => {
        this.setState({
            cancelId: undefined
        });
    };

    private onCancelYes = () => {
        this.setState({
            cancelId: undefined
        });
        this.props.loadGesendeteAnfragen();
    };

    private onDetailsDone = () => {
        this.setState({
            infoId: undefined
        });
    };

    private onOfferDetailsClicked = (id: string) => {
        this.setState({
            infoId: id,
            infoIsOffer: true
        });
    };

    private onDemandDetailsClicked = (id: string) => {
        this.setState({
            infoId: id,
            infoIsOffer: false
        });
    };

    private onDeleteDemand = async (id: string) => {
        await apiDelete("/remedy/bedarf/" + id);
        this.props.loadBedarfe();
    };

    private filterDemand = () => {
        return (this.props.bedarfe || [])
            .filter(bedarf => bedarf.institutionId === this.props.eigeneInstitution?.id);
    };

    private onDeleteOffer = async (id: string) => {
        await apiDelete("/remedy/angebot/" + id);
        this.props.loadAngebote();
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
    };
}

const mapStateToProps = (state: RootState) => ({
    angebote: state.angebote.value,
    artikel: state.artikel.value,
    bedarfe: state.bedarfe.value,
    eigeneInstitution: state.eigeneInstitution.value,
    erhalteneAnfragen: state.erhalteneAnfragen.value,
    gesendeteAnfragen: state.gesendeteAnfragen.value
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadAngebote: () => dispatch(loadAngebote()),
    loadArtikel: () => dispatch(loadArtikel()),
    loadBedarfe: () => dispatch(loadBedarfe()),
    loadEigeneInstitution: () => dispatch(loadEigeneInstitution()),
    loadErhalteneAnfragen: () => dispatch(loadErhalteneAnfragen()),
    loadGesendeteAnfragen: () => dispatch(loadGesendeteAnfragen())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withStyles(styles)(HomeScreen));
