import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../util/WithStylesPublic";
import AddStockDialog from "./Dialogs/AddOfferDialog";
import {Artikel} from "../Model/Artikel";
import {apiDelete, apiGet} from "../util/ApiUtils";
import {Angebot} from "../Model/Angebot";
import {Institution} from "../Model/Institution";
import OfferTable from "../components/OfferTable";
import {FormTextInput} from "../components/FormTextInput";
import {FormButton} from "../components/FormButton";

interface Props extends WithStylesPublic<typeof styles> {
}

interface State {
    addDialogOpen: boolean;
    searchFilter: string;
    artikel?: Artikel[];
    angebote?: Angebot[];
    ownInstitution?: Institution;
}

const styles = (theme: Theme) =>
    createStyles({
        tableHeader: {
            marginTop: "64px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between"
        },
        searchInput: {
            width: "40%",
            minWidth: "200px"
        }
    });

class OfferScreen extends Component<Props, State> {
    state: State = {
        addDialogOpen: false,
        searchFilter: ""
    };

    render() {
        const classes = this.props.classes!;

        return (
            <>
                <div className={classes.tableHeader}>
                    <FormTextInput
                        className={classes.searchInput}
                        label="Angebote durchsuchen..."
                        changeListener={this.setFilter}
                        value={this.state.searchFilter}/>
                    <FormButton
                        onClick={() => this.setState(state => ({addDialogOpen: !state.addDialogOpen}))}>
                        Angebot anlegen
                    </FormButton>
                </div>
                <OfferTable rows={this.filter()} onDelete={this.onDelete}
                            ownInstitutionId={this.state.ownInstitution?.id || ""}/>
                <AddStockDialog
                    open={this.state.addDialogOpen}
                    onCancelled={this.onAddCancelled}
                    onSaved={this.onAddSaved}
                    artikel={this.state.artikel || []}/>
            </>
        )
    }

    private onDelete = async (id: string) => {
        await apiDelete("/remedy/angebot/" + id);
        this.loadAngebote();
    };

    private setFilter = (value: string) => {
        this.setState({searchFilter: value});
    };

    private filter = () => {
        return (this.state.angebote || [])
            .filter(angebot => JSON.stringify(Object.values(angebot)).toLowerCase().indexOf(this.state.searchFilter.toLowerCase()) !== -1);
    };

    private onAddCancelled = () => {
        this.setState({addDialogOpen: false});
    };

    private onAddSaved = () => {
        this.setState({addDialogOpen: false});
        this.loadAngebote();
    };

    componentDidMount = async () => {
        this.loadArtikel();
        this.loadAngebote();
        this.loadInstitution();
    };

    private loadArtikel = async () => {
        const result = await apiGet<Artikel[]>("/remedy/artikel/suche");
        if (!result.error) {
            this.setState({
                artikel: result.result
            });
        }
    };

    private loadAngebote = async () => {
        const result = await apiGet<Angebot[]>("/remedy/angebot");
        if (!result.error) {
            this.setState({
                angebote: result.result
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

export default withStyles(styles)(OfferScreen);
