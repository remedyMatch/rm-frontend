import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../util/WithStylesPublic";
import {Artikel} from "../Model/Artikel";
import {apiDelete, apiGet} from "../util/ApiUtils";
import {Angebot} from "../Model/Angebot";
import {Institution} from "../Model/Institution";
import OfferTable from "../components/OfferTable";
import DemandTable from "../components/DemandTable";
import {Bedarf} from "../Model/Bedarf";
import {Typography} from "@material-ui/core";

interface Props extends WithStylesPublic<typeof styles> {
}

interface State {
    artikel?: Artikel[];
    angebote?: Angebot[];
    bedarf?: Bedarf[];
    ownInstitution?: Institution;
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
                <Typography variant="subtitle1" className={classes.subtitle}>Meine Angebote</Typography>
                <OfferTable rows={this.filterOffer()} onDelete={this.onDeleteOffer}
                            ownInstitutionId={this.state.ownInstitution?.id || ""}/>
                <Typography variant="subtitle1" className={classes.subtitle}>Mein Bedarf</Typography>
                <DemandTable rows={this.filterDemand()} onDelete={this.onDeleteDemand}
                             ownInstitutionId={this.state.ownInstitution?.id || ""}/>
            </>
        )
    }

    private onDeleteDemand = async (id: string) => {
        await apiDelete("/remedy/bedarf/" + id);
        this.loadBedarf();
    };

    private filterDemand = () => {
        return (this.state.bedarf || [])
            .filter(bedarf => bedarf.institution.id === this.state.ownInstitution?.id);
    };

    private onDeleteOffer = async (id: string) => {
        await apiDelete("/remedy/angebot/" + id);
        this.loadAngebote();
    };

    private filterOffer = () => {
        return (this.state.angebote || [])
            .filter(angebot => angebot.institution.id === this.state.ownInstitution?.id);
    };

    componentDidMount = async () => {
        this.loadArtikel();
        this.loadAngebote();
        this.loadBedarf();
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
}

export default withStyles(styles)(HomeScreen);
