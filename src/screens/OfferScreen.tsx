import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../util/WithStylesPublic";
import {Artikel} from "../Model/Artikel";
import {Angebot} from "../Model/Angebot";
import {Institution} from "../Model/Institution";
import Table from "../components/Table";
import {FormTextInput} from "../components/FormTextInput";
import {FormButton} from "../components/FormButton";
import AddOfferDialog from "./Dialogs/AddOfferDialog";
import {apiDelete, apiGet} from "../util/ApiUtils";
import AddDemandDialog from "./Dialogs/AddDemandDialog";
import InfoDialog from "./Dialogs/InfoDialog";

interface Props extends WithStylesPublic<typeof styles> {
}

interface State {
    infoId?: string;
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
                <Table
                    rows={this.filter()}
                    delete={{onDelete: this.onDelete, institutionId: this.state.ownInstitution?.id || ""}}
                    details={{onClick: this.onDetailsClicked}}/>
                <AddOfferDialog
                    open={this.state.addDialogOpen}
                    onCancelled={this.onAddCancelled}
                    onSaved={this.onAddSaved}
                    artikel={this.state.artikel || []}/>
                <InfoDialog
                    open={!!this.state.infoId}
                    onDone={this.onDetailsDone}
                    item={this.state.angebote?.find(item => item.id === this.state.infoId)!}
                    onContact={this.onDetailsContact}/>
            </>
        )
    }

    private onDetailsDone = () => {
        this.setState({
            infoId: undefined
        });
    };

    private onDetailsContact = () => {
        this.setState({
            infoId: undefined
        });
    };

    private onDetailsClicked = (id: string) => {
        this.setState({
            infoId: id
        });
    };

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
