import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../util/WithStylesPublic";
import EntryTable from "../components/Table/EntryTable";
import {FormTextInput} from "../components/Form/FormTextInput";
import {FormButton} from "../components/Form/FormButton";
import AddOfferDialog from "./Dialogs/Offer/AddOfferDialog";
import {apiDelete} from "../util/ApiUtils";
import OfferDetailsDialog from "./Dialogs/Offer/OfferDetailsDialog";
import RespondOfferDialog from "./Dialogs/Offer/RespondOfferDialog";
import {RootDispatch, RootState} from "../State/Store";
import {loadAngebote} from "../State/AngeboteState";
import {loadArtikel} from "../State/ArtikelState";
import {loadEigeneInstitution} from "../State/EigeneInstitutionState";
import {connect, ConnectedProps} from "react-redux";

interface Props extends WithStylesPublic<typeof styles>, PropsFromRedux {
}

interface State {
    infoId?: string;
    contactId?: string;
    addDialogOpen: boolean;
    searchFilter: string;
}

const styles = (theme: Theme) =>
    createStyles({
        tableHeader: {
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
                <EntryTable
                    rows={this.filter()}
                    delete={{onDelete: this.onDelete, institutionId: this.props.eigeneInstitution?.id || ""}}
                    details={{onClick: this.onDetailsClicked}}/>
                <AddOfferDialog
                    open={this.state.addDialogOpen}
                    onCancelled={this.onAddCancelled}
                    onSaved={this.onAddSaved}
                    institution={this.props.eigeneInstitution}
                    artikel={this.props.artikel || []}/>
                <OfferDetailsDialog
                    open={!!this.state.infoId}
                    onDone={this.onDetailsDone}
                    item={this.props.angebote?.find(item => item.id === this.state.infoId)!}
                    onContact={this.onDetailsContact}/>
                <RespondOfferDialog
                    open={!!this.state.contactId}
                    onCancelled={this.onContactCancelled}
                    onSaved={this.onContactSaved}
                    angebot={this.props.angebote?.find(item => item.id === this.state.contactId)}
                    eigeneInstitution={this.props.eigeneInstitution}
                    />
            </>
        )
    }

    private onContactCancelled = () => {
        this.setState({
            contactId: undefined
        });
    };

    private onContactSaved = () => {
        this.setState({
            contactId: undefined
        });
    };

    private onDetailsDone = () => {
        this.setState({
            infoId: undefined
        });
    };

    private onDetailsContact = () => {
        this.setState({
            contactId: this.state.infoId
        });
    };

    private onDetailsClicked = (id: string) => {
        this.setState({
            infoId: id
        });
    };

    private onDelete = async (id: string) => {
        await apiDelete("/remedy/angebot/" + id);
        this.props.loadAngebote();
    };

    private setFilter = (value: string) => {
        this.setState({searchFilter: value});
    };

    private filter = () => {
        return (this.props.angebote || [])
            .filter(angebot => JSON.stringify(Object.values(angebot)).toLowerCase().indexOf(this.state.searchFilter.toLowerCase()) !== -1);
    };

    private onAddCancelled = () => {
        this.setState({addDialogOpen: false});
    };

    private onAddSaved = () => {
        this.setState({addDialogOpen: false});
        this.props.loadAngebote();
    };

    componentDidMount = async () => {
        this.props.loadArtikel();
        this.props.loadAngebote();
        this.props.loadEigeneInstitution();
    };
}

const mapStateToProps = (state: RootState) => ({
    angebote: state.angebote.value,
    artikel: state.artikel.value,
    eigeneInstitution: state.eigeneInstitution.value,
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadAngebote: () => dispatch(loadAngebote()),
    loadArtikel: () => dispatch(loadArtikel()),
    loadEigeneInstitution: () => dispatch(loadEigeneInstitution()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withStyles(styles)(OfferScreen));
