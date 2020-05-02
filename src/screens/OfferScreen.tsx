import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import React, {Component} from "react";
import {connect, ConnectedProps} from "react-redux";
import {FormButton} from "../components/Form/FormButton";
import {FormTextInput} from "../components/Form/FormTextInput";
import EntryTable from "../components/Table/EntryTable";
import {loadAngebote} from "../state/old/AngeboteState";
import {loadArtikelKategorien} from "../state/old/ArtikelKategorienState";
import {loadArtikel} from "../state/old/ArtikelState";
import {loadEigeneInstitution} from "../state/EigeneInstitutionState";
import {loadPerson} from "../state/old/PersonState";
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
        const institutionId = this.props.eigeneInstitution?.id || "";

        const offerItem = this.props.angebote?.find(item => item.id === this.state.infoId);
        const article = this.props.artikel?.find(article => article.id === offerItem?.artikelId);
        const category = this.props.artikelKategorien?.find(category => category.id === article?.artikelKategorieId);

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
                    hideType
                    angebote={this.filter()}
                    artikel={this.props.artikel || []}
                    artikelKategorien={this.props.artikelKategorien || []}
                    bedarfe={[]}
                    details={{onClick: this.onDetailsClicked, eigeneInstitutionId: institutionId}}/>
                <AddOfferDialog
                    open={this.state.addDialogOpen}
                    onCancelled={this.onAddCancelled}
                    onSaved={this.onAddSaved}
                    person={this.props.person}
                    artikel={this.props.artikel || []}
                    artikelKategorien={this.props.artikelKategorien || []}/>
                <OfferDetailsDialog
                    open={!!this.state.infoId}
                    onDone={this.onDetailsDone}
                    item={offerItem}
                    artikel={article}
                    artikelKategorie={category}
                    onContact={this.onDetailsContact}
                    eigeneInstitutionIds={this.props.person?.institutionen.map(institution => institution.institution.id) || []}/>
                <RespondOfferDialog
                    open={!!this.state.contactId}
                    onCancelled={this.onContactCancelled}
                    onSaved={this.onContactSaved}
                    angebot={this.props.angebote?.find(item => item.id === this.state.contactId)}
                    eigeneInstitutionIds={this.props.person?.institutionen.map(institution => institution.institution.id) || []}/>
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
