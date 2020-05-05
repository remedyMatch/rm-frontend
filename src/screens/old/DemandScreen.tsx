import {WithStyles} from "@material-ui/core";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import React, {Component} from "react";
import {connect, ConnectedProps} from "react-redux";
import {FormButton} from "../../components/Form/FormButton";
import {FormTextInput} from "../../components/Form/FormTextInput";
import EntryTable from "../../components/Table/EntryTable";
import {loadArtikelKategorien} from "../../state/artikel/ArtikelKategorienState";
import {loadArtikel} from "../../state/artikel/ArtikelState";
import {loadBedarfe} from "../../state/bedarf/BedarfeState";
import {loadPerson} from "../../state/person/PersonState";
import {RootDispatch, RootState} from "../../state/Store";
import LoginService from "../../util/LoginService";
import AddDemandDialog from "./Dialogs/Demand/AddDemandDialog";
import DemandDetailsDialog from "./Dialogs/Demand/DemandDetailsDialog";
import RespondDemandDialog from "./Dialogs/Demand/RespondDemandDialog";

interface Props extends WithStyles<typeof styles>, PropsFromRedux {
}

interface State {
    addDialogOpen: boolean;
    contactId?: string;
    infoId?: string;
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

class DemandScreen extends Component<Props, State> {
    state: State = {
        addDialogOpen: false,
        searchFilter: ""
    };

    render() {
        const classes = this.props.classes;
        const demandItem = this.props.bedarfe?.find(item => item.id === this.state.infoId);
        const empfaenger = LoginService.hasRoleEmpfaenger();

        return (
            <>

                <div className={classes.tableHeader}>

                    <FormTextInput
                        className={classes.searchInput}
                        label="Bedarf durchsuchen..."
                        onChange={this.setFilter}
                        value={this.state.searchFilter}/>

                    <FormButton disabled={!empfaenger}
                                onClick={() => this.setState(state => ({addDialogOpen: !state.addDialogOpen}))}>
                        Bedarf anlegen
                    </FormButton>

                </div>

                <EntryTable
                    hideType
                    artikel={this.props.artikel || []}
                    artikelKategorien={this.props.artikelKategorien || []}
                    bedarfe={this.filter()}
                    angebote={[]}
                    details={{onClick: this.onDetailsClicked, eigeneInstitutionId: this.props.person?.aktuelleInstitution.institution.id || ""}}/>

                <AddDemandDialog
                    open={this.state.addDialogOpen}
                    onCancelled={this.onAddCancelled}
                    onSaved={this.onAddSaved}
                    artikel={this.props.artikel || []}
                    artikelKategorien={this.props.artikelKategorien || []}/>

                <DemandDetailsDialog
                    open={!!this.state.infoId}
                    onDone={this.onDetailsDone}
                    onContact={this.onDetailsContact}
                    bedarf={demandItem}
                    artikel={this.props.artikel || []}
                    artikelKategorien={this.props.artikelKategorien || []}/>

                <RespondDemandDialog
                    open={!!this.state.contactId}
                    onCancelled={this.onContactCancelled}
                    onSaved={this.onContactSaved}
                    bedarf={this.props.bedarfe?.find(d => d.id === this.state.contactId)}/>

            </>
        )
    }

    componentDidMount = async () => {
        this.props.loadArtikel();
        this.props.loadArtikelKategorien();
        this.props.loadBedarfe();
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
        return (this.props.bedarfe || [])
            .filter(bedarf => JSON.stringify(Object.values(bedarf)).toLowerCase().indexOf(this.state.searchFilter.toLowerCase()) !== -1);
    };

    private onAddCancelled = () => {
        this.setState({addDialogOpen: false});
    };

    private onAddSaved = () => {
        this.setState({addDialogOpen: false});
        this.props.loadBedarfe();
    };
}

const mapStateToProps = (state: RootState) => ({
    artikel: state.artikel.value,
    artikelKategorien: state.artikelKategorien.value,
    bedarfe: state.bedarfe.value,
    person: state.person.value
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadArtikel: () => dispatch(loadArtikel()),
    loadArtikelKategorien: () => dispatch(loadArtikelKategorien()),
    loadBedarfe: () => dispatch(loadBedarfe()),
    loadPerson: () => dispatch(loadPerson())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withStyles(styles)(DemandScreen));
