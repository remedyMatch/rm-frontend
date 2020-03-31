import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../util/WithStylesPublic";
import {FormTextInput} from "../components/FormTextInput";
import {Aufgabe} from "../Domain/Aufgabe";
import TaskTable from "../components/TaskTable";
import EditTaskDialog from "./Dialogs/Task/EditTaskDialog";
import {RootDispatch, RootState} from "../State/Store";
import {loadAngebote} from "../State/AngeboteState";
import {loadBedarfe} from "../State/BedarfeState";
import {connect, ConnectedProps} from "react-redux";
import {loadAufgaben} from "../State/AufgabenState";

interface Props extends WithStylesPublic<typeof styles>, PropsFromRedux {
}

interface State {
    searchFilter: string;
    editTask?: Aufgabe;
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
                    onCancelled={this.onEditCancelled}
                    onFinished={this.onEditFinished}/>
            </>
        )
    }

    private onEditClicked = (task: Aufgabe) => {
        this.setState({
            editTask: task
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
        this.props.loadBedarfe();
        this.props.loadAngebote();
    };
}

const mapStateToProps = (state: RootState) => ({
    angebote: state.angebote.value,
    aufgaben: state.aufgaben.value,
    bedarfe: state.bedarfe.value
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadAngebote: () => dispatch(loadAngebote()),
    loadAufgaben: () => dispatch(loadAufgaben()),
    loadBedarfe: () => dispatch(loadBedarfe()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withStyles(styles)(TaskScreen));
