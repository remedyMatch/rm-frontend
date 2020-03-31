import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../util/WithStylesPublic";
import {apiDelete} from "../util/ApiUtils";
import {FormTextInput} from "../components/FormTextInput";
import {FormButton} from "../components/FormButton";
import AddDemandDialog from "./Dialogs/Demand/AddDemandDialog";
import EntryTable from "../components/EntryTable";
import DemandDetailsDialog from "./Dialogs/Demand/DemandDetailsDialog";
import RespondDemandDialog from "./Dialogs/Demand/RespondDemandDialog";
import {RootDispatch, RootState} from "../State/Store";
import {loadArtikel} from "../State/ArtikelState";
import {loadBedarfe} from "../State/BedarfeState";
import {loadEigeneInstitution} from "../State/EigeneInstitutionState";
import {connect, ConnectedProps} from "react-redux";

interface Props extends WithStylesPublic<typeof styles>, PropsFromRedux {
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
            marginTop: "16px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between"
        },
        searchInput: {
            width: "40%",
            minWidth: "200px"
        },
        button: {
            margin: "8px 0px"
        }
    });

class DemandScreen extends Component<Props, State> {
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
                        label="Bedarf durchsuchen..."
                        changeListener={this.setFilter}
                        value={this.state.searchFilter}/>
                    <FormButton
                        className={classes.button}
                        onClick={() => this.setState(state => ({addDialogOpen: !state.addDialogOpen}))}>
                        Bedarf anlegen
                    </FormButton>
                </div>
                <EntryTable
                    rows={this.filter()}
                    delete={{onDelete: this.onDelete, institutionId: this.props.eigeneInstitution?.id || ""}}
                    details={{onClick: this.onDetailsClicked}}/>
                <AddDemandDialog
                    open={this.state.addDialogOpen}
                    onCancelled={this.onAddCancelled}
                    onSaved={this.onAddSaved}
                    artikel={this.props.artikel || []}/>
                <DemandDetailsDialog
                    open={!!this.state.infoId}
                    onDone={this.onDetailsDone}
                    item={this.props.bedarfe?.find(item => item.id === this.state.infoId)!}
                    onContact={this.onDetailsContact}/>
                <RespondDemandDialog
                    open={!!this.state.contactId}
                    onCancelled={this.onContactCancelled}
                    onSaved={this.onContactSaved}
                    demandId={this.state.contactId}
                    standort={this.props.bedarfe?.find(d => d.id === this.state.infoId)?.standort} />
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
        await apiDelete("/remedy/bedarf/" + id);
        this.props.loadBedarfe();
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

    componentDidMount = async () => {
        this.props.loadArtikel();
        this.props.loadBedarfe();
        this.props.loadEigeneInstitution();
    };
}

const mapStateToProps = (state: RootState) => ({
    artikel: state.artikel.value,
    bedarfe: state.bedarfe.value,
    eigeneInstitution: state.eigeneInstitution.value
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadArtikel: () => dispatch(loadArtikel()),
    loadBedarfe: () => dispatch(loadBedarfe()),
    loadEigeneInstitution: () => dispatch(loadEigeneInstitution())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withStyles(styles)(DemandScreen));
