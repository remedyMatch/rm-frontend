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
                    onCancelled={() => {
                    }}
                    onSaved={() => {
                    }}
                    artikel={this.state.artikel || []}/>
            </>
        )
    }

    componentDidMount = async () => {
        const result = await apiGet<Artikel[]>("/remedy/artikel/suche");
        if (!result.error) {
            this.setState({
                artikel: result.result
            });
        }
    }
}

export default withStyles(styles)(StockScreen);
