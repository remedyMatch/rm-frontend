import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {WithStylesPublic} from "../util/WithStylesPublic";
import AddStockDialog from "./StockScreen/AddStockDialog";
import {Artikel} from "../Model/Artikel";
import {apiGet} from "../util/ApiUtils";

interface Props extends WithStylesPublic<typeof styles> {
}

interface State {
    addDialogOpen: boolean;
    artikel?: Artikel[];
}

const styles = (theme: Theme) =>
    createStyles({});

class StockScreen extends Component<Props, State> {
    state: State = {
        addDialogOpen: false
    };

    render() {
        return (
            <>
                <Button
                    onClick={() => this.setState(state => ({addDialogOpen: !state.addDialogOpen}))}>
                    Bestand anlegen
                </Button>
                <AddStockDialog
                    open={this.state.addDialogOpen}
                    onCancelled={this.onAddCancelled}
                    onSaved={this.onAddSaved}
                    artikel={this.state.artikel || []}/>
            </>
        )
    }

    private onAddCancelled = () => {
        this.setState({ addDialogOpen: false });
    };

    private onAddSaved = () => {
        this.setState({ addDialogOpen: false });
        this.loadData();
    };

    private loadData = async () => {
        const result = await apiGet<Artikel[]>("/remedy/artikel/suche");
        if (!result.error) {
            this.setState({
                artikel: result.result
            });
        }
    };

    componentDidMount = () => {
        this.loadData();
    }
}

export default withStyles(styles)(StockScreen);