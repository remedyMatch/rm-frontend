import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import React, {Component} from "react";
import {connect, ConnectedProps} from "react-redux";
import {FormButton} from "../components/Form/FormButton";
import {FormTextInput} from "../components/Form/FormTextInput";
import EntryTable from "../components/Table/EntryTable";
import {loadAngebote} from "../state/angebot/AngeboteState";
import {loadArtikelKategorien} from "../state/artikel/ArtikelKategorienState";
import {loadArtikel} from "../state/artikel/ArtikelState";
import {loadPerson} from "../state/person/PersonState";
import {RootDispatch, RootState} from "../state/Store";
import {WithStylesPublic} from "../util/WithStylesPublic";
import AddOfferDialog from "./Dialogs/Offer/AddOfferDialog";
import OfferDetailsDialog from "./Dialogs/Offer/OfferDetailsDialog";
import RespondOfferDialog from "./Dialogs/Offer/RespondOfferDialog";

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
        const institutionId = ""; // TODO

        const offerItem = this.props.angebote?.find(item => item.id === this.state.infoId);

        return (
            <>

                <div className={classes.tableHeader}>

                    <FormTextInput
                        className={classes.searchInput}
                        label="Angebote durchsuchen..."
                        onChange={this.setFilter}
                        value={this.state.searchFilter}/>

                    <FormButton
                        onClick={() => this.setState(state => ({addDialogOpen: !state.addDialogOpen}))}>
                        Angebot anlegen
                    </FormButton>

                </div>

                <EntryTable
                    hideType
                    artikel={this.props.artikel || []}
                    artikelKategorien={this.props.artikelKategorien || []}
                    angebote={this.filter()}
                    bedarfe={[]}
                    details={{onClick: this.onDetailsClicked, eigeneInstitutionId: institutionId}}/>

                <AddOfferDialog
                    open={this.state.addDialogOpen}
                    onCancelled={this.onAddCancelled}
                    onSaved={this.onAddSaved}
                    artikel={this.props.artikel || []}
                    artikelKategorien={this.props.artikelKategorien || []}/>

                <OfferDetailsDialog
                    open={!!this.state.infoId}
                    onDone={this.onDetailsDone}
                    onContact={this.onDetailsContact}
                    angebot={offerItem}
                    artikel={this.props.artikel || []}
                    artikelKategorien={this.props.artikelKategorien || []}/>

                <RespondOfferDialog
                    open={!!this.state.contactId}
                    onCancelled={this.onContactCancelled}
                    onSaved={this.onContactSaved}
                    angebot={this.props.angebote?.find(d => d.id === this.state.contactId)}/>

            </>
        )
    }

    componentDidMount = async () => {
        this.props.loadArtikel();
        this.props.loadArtikelKategorien();
        this.props.loadAngebote();
        this.props.loadPerson();
    };

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
}

const mapStateToProps = (state: RootState) => ({
    angebote: state.angebote.value,
    artikel: state.artikel.value,
    artikelKategorien: state.artikelKategorien.value,
    person: state.person.value
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadAngebote: () => dispatch(loadAngebote()),
    loadArtikel: () => dispatch(loadArtikel()),
    loadArtikelKategorien: () => dispatch(loadArtikelKategorien()),
    loadPerson: () => dispatch(loadPerson())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withStyles(styles)(OfferScreen));
