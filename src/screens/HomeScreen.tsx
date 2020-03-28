import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../util/WithStylesPublic";
import {Artikel} from "../Model/Artikel";
import {apiDelete, apiGet} from "../util/ApiUtils";
import {Angebot} from "../Model/Angebot";
import {Institution} from "../Model/Institution";
import EntryTable from "../components/EntryTable";
import {Bedarf} from "../Model/Bedarf";
import {Typography} from "@material-ui/core";
import InfoDialog from "./Dialogs/InfoDialog";
import {Anfrage} from "../Model/Anfrage";
import RequestTable from "../components/RequestTable";
import CancelReceivedRequestDialog from "./Dialogs/CancelReceivedRequestDialog";

interface Props extends WithStylesPublic<typeof styles> {
}

interface State {
    cancelId?: string;
    infoId?: string;
    artikel?: Artikel[];
    angebote?: Angebot[];
    bedarf?: Bedarf[];
    ownInstitution?: Institution;
    receivedRequests?: Anfrage[];
    sentRequests?: Anfrage[];
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

        return (
            <>
                <Typography variant="subtitle1" className={classes.subtitle}>Erhaltene Anfragen</Typography>
                <RequestTable
                    rows={this.state.receivedRequests || []}
                    type="received"
                    demands={this.state.bedarf}
                    offers={this.state.angebote}/>
                <Typography variant="subtitle1" className={classes.subtitle}>Gestellte Anfragen</Typography>
                <RequestTable
                    rows={this.state.sentRequests || []}
                    type="sent"
                    demands={this.state.bedarf}
                    offers={this.state.angebote}
                    onCancel={this.onCancelOffer}/>
                <Typography variant="subtitle1" className={classes.subtitle}>Meine Angebote</Typography>
                <EntryTable
                    rows={this.filterOffer()}
                    delete={{
                        onDelete: this.onDeleteOffer,
                        institutionId: this.state.ownInstitution?.id || ""
                    }}
                    details={{onClick: this.onDetailsClicked}}/>
                <Typography variant="subtitle1" className={classes.subtitle}>Mein Bedarf</Typography>
                <EntryTable
                    rows={this.filterDemand()}
                    delete={{
                        onDelete: this.onDeleteDemand,
                        institutionId: this.state.ownInstitution?.id || ""
                    }}
                    details={{onClick: this.onDetailsClicked}}/>
                <InfoDialog
                    open={!!this.state.infoId}
                    onDone={this.onDetailsDone}
                    item={[...this.state.bedarf || [], ...this.state.angebote || []].find(item => item.id === this.state.infoId)!}/>
                <CancelReceivedRequestDialog
                    open={!!this.state.cancelId}
                    request={this.state.sentRequests?.find(sr => (sr.angebotId || sr.bedarfId) === this.state.cancelId)}
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
        this.loadSentRequests();
    };

    private onDetailsDone = () => {
        this.setState({
            infoId: undefined
        });
    };

    private onDetailsClicked = (id: string) => {
        this.setState({
            infoId: id
        });
    };

    private onDeleteDemand = async (id: string) => {
        await apiDelete("/remedy/bedarf/" + id);
        this.loadBedarf();
    };

    private filterDemand = () => {
        return (this.state.bedarf || [])
            .filter(bedarf => bedarf.institutionId === this.state.ownInstitution?.id);
    };

    private onDeleteOffer = async (id: string) => {
        await apiDelete("/remedy/angebot/" + id);
        this.loadAngebote();
    };

    private filterOffer = () => {
        return (this.state.angebote || [])
            .filter(angebot => angebot.institutionId === this.state.ownInstitution?.id);
    };

    componentDidMount = async () => {
        this.loadArtikel();
        this.loadAngebote();
        this.loadBedarf();
        this.loadReceivedRequests();
        this.loadSentRequests();
        this.loadInstitution();
    };

    private loadAngebote = async () => {
        const result = await apiGet<Angebot[]>("/remedy/angebot");
        if (!result.error) {
            this.setState({
                angebote: result.result
            });
        }
    };

    private loadArtikel = async () => {
        const result = await apiGet<Artikel[]>("/remedy/artikel/suche");
        if (!result.error) {
            this.setState({
                artikel: result.result
            });
        }
    };

    private loadBedarf = async () => {
        const result = await apiGet<Angebot[]>("/remedy/bedarf");
        if (!result.error) {
            this.setState({
                bedarf: result.result
            });
        }
    };

    private loadInstitution = async () => {
        const result = await apiGet<Institution>("/remedy/institution/assigned");
        if (!result.error) {
            this.setState({
                ownInstitution: result.result
            });
        }
    };

    private loadReceivedRequests = async () => {
        const result = await apiGet<Anfrage[]>("/remedy/institution/anfragen/erhalten");
        if (!result.error) {
            this.setState({
                receivedRequests: result.result
            });
        }
    };

    private loadSentRequests = async () => {
        const result = await apiGet<Anfrage[]>("/remedy/institution/anfragen/gestellt");
        if (!result.error) {
            this.setState({
                sentRequests: result.result
            });
        }
    };
}

export default withStyles(styles)(HomeScreen);
