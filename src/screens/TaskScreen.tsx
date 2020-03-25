import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../util/WithStylesPublic";
import {apiGet} from "../util/ApiUtils";
import {FormTextInput} from "../components/FormTextInput";
import {Bedarf} from "../Model/Bedarf";
import {Aufgabe} from "../Model/Aufgabe";
import {Angebot} from "../Model/Angebot";
import TaskTable from "../components/TaskTable";
import EditTaskDialog from "./Dialogs/Task/EditTaskDialog";

interface Props extends WithStylesPublic<typeof styles> {
}

interface State {
    angebote?: Angebot[];
    bedarf?: Bedarf[];
    tasks?: Aufgabe[];
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
                    offers={this.state.angebote}
                    demands={this.state.bedarf}
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
        this.loadAufgaben();
    };

    private setFilter = (value: string) => {
        this.setState({searchFilter: value});
    };

    private filter = () => {
        return (this.state.tasks || [])
            .filter(task => (task.taskName.toLowerCase() + task.displayName.toLowerCase()).indexOf(this.state.searchFilter.toLowerCase()) !== -1);
    };

    componentDidMount = async () => {
        this.loadAufgaben();
        this.loadBedarf();
        this.loadAngebote();
    };

    private loadAufgaben = async () => {
        const result = await apiGet<Aufgabe[]>("/remedy/aufgabe");
        if (!result.error) {
            this.setState({
                tasks: result.result
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

    private loadBedarf = async () => {
        const result = await apiGet<Angebot[]>("/remedy/bedarf");
        if (!result.error) {
            this.setState({
                bedarf: result.result
            });
        }
    };
}

export default withStyles(styles)(TaskScreen);
