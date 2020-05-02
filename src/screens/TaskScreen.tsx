import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../util/WithStylesPublic";
import {FormTextInput} from "../components/Form/FormTextInput";
import {Aufgabe} from "../domain/old/Aufgabe";
import TaskTable from "../components/Table/TaskTable";
import EditTaskDialog from "./Dialogs/Task/EditTaskDialog";
import {RootDispatch, RootState} from "../state/Store";
import {loadAngebote} from "../state/old/AngeboteState";
import {loadBedarfe} from "../state/old/BedarfeState";
import {connect, ConnectedProps} from "react-redux";
import {loadAufgaben} from "../state/old/AufgabenState";
import {loadErhalteneAnfragen} from "../state/old/ErhalteneAnfragenState";
import {AngebotAnfrage} from "../domain/Anfrage";
import {Bedarf} from "../domain/old/Bedarf";
import {Angebot} from "../domain/old/Angebot";
import {Match} from "../domain/old/Match";
import {loadMatches} from "../state/old/MatchesState";
import {loadArtikel} from "../state/old/ArtikelState";
import {Artikel} from "../domain/old/Artikel";

interface Props extends WithStylesPublic<typeof styles>, PropsFromRedux {
}

interface State {
    searchFilter: string;
    editTask?: Aufgabe;
    editRequest?: AngebotAnfrage;
    editItem?: Angebot | Bedarf;
    editMatch?: Match;
    editArticle?: Artikel;
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

class TaskScreen extends Component<Props, State> {
    state: State = {
        searchFilter: ""
    };

    render() {
        const classes = this.props.classes!;

        return (
            <>
                <div className={classes.tableHeader}>
                    <FormTextInput
                        className={classes.searchInput}
                        label="Aufgaben durchsuchen..."
                        changeListener={this.setFilter}
                        value={this.state.searchFilter}/>
                </div>
                <TaskTable
                    rows={this.filter()}
                    offers={this.props.angebote}
                    demands={this.props.bedarfe}
                    onEditClicked={this.onEditClicked}/>
                <EditTaskDialog
                    open={!!this.state.editTask}
                    task={this.state.editTask}
                    item={this.state.editItem}
                    match={this.state.editMatch}
                    article={this.state.editArticle}
                    request={this.state.editRequest}
                    onCancelled={this.onEditCancelled}
                    onFinished={this.onEditFinished}/>
            </>
        )
    }

    private onEditClicked = (task: Aufgabe) => {
        const request = this.props.erhalteneAnfragen?.find(anfrage => anfrage.id === task.objektId);
        const id = request?.bedarfId || request?.angebotId;
        const item = ([] as (Angebot | Bedarf)[])
            .concat(this.props.bedarfe || [])
            .concat(this.props.angebote || [])
            .find(item => item.id === id) ;
        const match = this.props.matches?.find(match => match.id === task.objektId);
        const article = this.props.artikel?.find(artikel => artikel.id === match?.artikelId);
        this.setState({
            editTask: task,
            editRequest: request,
            editItem: item,
            editMatch: match,
            editArticle: article
        });
    };

    private onEditCancelled = () => {
        this.setState({
            editTask: undefined
        });
    };

    private onEditFinished = () => {
        this.setState({
            editTask: undefined
        });
        this.props.loadAufgaben();
    };

    private setFilter = (value: string) => {
        this.setState({searchFilter: value});
    };

    private filter = () => {
        return (this.props.aufgaben || [])
            .filter(task => (task.taskName.toLowerCase() + task.displayName.toLowerCase()).indexOf(this.state.searchFilter.toLowerCase()) !== -1);
    };

    componentDidMount = async () => {
        this.props.loadAufgaben();
        this.props.loadArtikel();
        this.props.loadBedarfe();
        this.props.loadAngebote();
        this.props.loadErhalteneAnfragen();
        this.props.loadMatches();
    };
}

const mapStateToProps = (state: RootState) => ({
    angebote: state.angebote.value,
    artikel: state.artikel.value,
    aufgaben: state.aufgaben.value,
    bedarfe: state.bedarfe.value,
    erhalteneAnfragen: state.erhalteneAnfragen.value,
    matches: state.matches.value
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadAngebote: () => dispatch(loadAngebote()),
    loadArtikel: () => dispatch(loadArtikel()),
    loadAufgaben: () => dispatch(loadAufgaben()),
    loadBedarfe: () => dispatch(loadBedarfe()),
    loadErhalteneAnfragen: () => dispatch(loadErhalteneAnfragen()),
    loadMatches: () => dispatch(loadMatches())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withStyles(styles)(TaskScreen));
