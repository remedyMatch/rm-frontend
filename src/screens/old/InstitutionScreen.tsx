import {Typography, WithStyles} from "@material-ui/core";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import React, {Component} from "react";
import {connect, ConnectedProps} from "react-redux";
import InstitutionTable from "../../components/Table/old/InstitutionTable";
import {Person2Institution} from "../../domain/person/Person2Institution";
import {loadPerson} from "../../state/person/PersonState";
import {RootDispatch, RootState} from "../../state/Store";

interface Props extends WithStyles<typeof styles>, PropsFromRedux {
}

interface State {
}

const styles = (theme: Theme) =>
    createStyles({
        content: {
            width: "calc(100vw - 32px)",
            maxWidth: "800px",
            placeSelf: "center",
            display: "flex",
            flexDirection: "column"
        },
        container: {
            margin: "8px 0px",
            backgroundColor: "white",
            border: "1px solid #CCC",
            padding: "16px",
            borderRadius: "4px",
            textAlign: "center"
        },
        subtitle: {
            fontWeight: 500,
            marginBottom: "16px",
            textAlign: "center"
        },
        row: {
            display: "flex"
        },
        left: {
            width: "100px",
            textAlign: "right",
            padding: "4px 16px"
        },
        right: {
            width: "calc(100% - 100px)",
            fontWeight: 500,
            padding: "4px 16px",
            textAlign: "left"
        },
        footer: {
            textAlign: "right",
            marginTop: "16px"
        },
        additionalAddress: {
            margin: "16px 0px"
        },
        address: {
            "& > p": {
                margin: "0px"
            }
        }
    });

class InstitutionScreen extends Component<Props, State> {
    state: State = {};

    render() {
        const classes = this.props.classes;

        return (
            <div className={classes.content}>

                <div className={classes.container}>

                    <Typography
                        variant="subtitle1"
                        className={classes.subtitle}>
                        Mein Konto
                    </Typography>

                    <div className={classes.row}>
                        <span className={classes.left}>Username:</span>
                        <span className={classes.right}>{this.props.person?.username}</span>
                    </div>

                    <div className={classes.row}>
                        <span className={classes.left}>Name:</span>
                        <span
                            className={classes.right}>{this.props.person?.vorname + " " + this.props.person?.nachname}</span>
                    </div>

                    <div className={classes.row}>
                        <span className={classes.left}>E-Mail:</span>
                        <span className={classes.right}>{this.props.person?.email}</span>
                    </div>

                    <div className={classes.row}>
                        <span className={classes.left}>Telefon:</span>
                        <span className={classes.right}>{this.props.person?.telefon}</span>
                    </div>

                </div>

                <div className={classes.container}>

                    <Typography
                        variant="subtitle1"
                        className={classes.subtitle}>
                        Ausgewählte Institution
                    </Typography>

                    <div className={classes.address}>
                        <p>{this.props.person?.aktuelleInstitution.institution.name}</p>
                        <p>{this.props.person?.aktuelleInstitution.standort.name}</p>
                        <p>{this.props.person?.aktuelleInstitution.standort.strasse} {this.props.person?.aktuelleInstitution.standort.hausnummer}</p>
                        <p>{this.props.person?.aktuelleInstitution.standort.plz} {this.props.person?.aktuelleInstitution.standort.ort}</p>
                        <p>{this.props.person?.aktuelleInstitution.standort.land}</p>
                    </div>

                </div>

                <div className={classes.container}>

                    <Typography
                        variant="subtitle1"
                        className={classes.subtitle}>
                        Institutionen
                    </Typography>

                    <InstitutionTable
                        rows={this.props.person?.institutionen || []}
                        onEditClicked={(inst: Person2Institution) => console.log(inst)}/>

                </div>

            </div>
        )
    }

    componentDidMount = async () => {
        this.props.loadPerson();
    };
}

const mapStateToProps = (state: RootState) => ({
    person: state.person.value
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadPerson: () => dispatch(loadPerson())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withStyles(styles)(InstitutionScreen));
