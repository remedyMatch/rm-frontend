import DateFnsUtils from "@date-io/date-fns";
import {TextareaAutosize} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import React, {useState} from "react";
import PopupDialog from "../../components/Dialog/PopupDialog";
import {FormCheckbox} from "../../components/Form/FormCheckbox";
import {FormNumberInput} from "../../components/Form/FormNumberInput";

interface Props {
    open: boolean;
    onCreate: () => void;
    onCancel: () => void;
}

interface State {
}

const useStyles = makeStyles((theme: Theme) => ({
    dialogContent: {
        display: "flex",
        flexDirection: "column"
    },
    formRow: {
        marginTop: "16px"
    },
    checkbox: {
        marginRight: "auto"
    },
    comment: {
        marginTop: "16px",
        resize: "none",
        fontSize: "14px",
        padding: "16px",
        "&:focus": {
            outline: "none",
            border: "2px solid " + theme.palette.primary.main
        }
    }
}));

const CreateOfferDialog: React.FC<Props> = props => {
    const classes = useStyles();

    const [amount, setAmount] = useState<number>(0);
    const [useBefore, setUseBefore] = useState<Date | null>(null);
    const [sterile, setSterile] = useState<boolean>(false);
    const [sealed, setSealed] = useState<boolean>(false);
    const [medical, setMedical] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");

    const [disabled, setDisabled] = useState<boolean>(false);

    return (
        <>
            <PopupDialog
                open={props.open}
                firstTitle="Abbrechen"
                onFirst={props.onCancel}
                secondTitle="Erstellen"
                onSecond={props.onCreate}
                title="Inserat erstellen"
                subtitle="Um ein Inserat zu erstellen, benötigen wir noch ein paar weitere Informationen von Ihnen.">

                <div className={classes.dialogContent}>

                    <FormNumberInput
                        label="Anzahl"
                        disabled={disabled}
                        onChange={setAmount}
                        className={classes.formRow}
                        value={amount}
                        min={0}/>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            variant="inline"
                            minDate={new Date()}
                            format="dd.MM.yyyy"
                            disabled={disabled}
                            margin="normal"
                            label="Haltbarkeitsdatum"
                            inputVariant="outlined"
                            value={useBefore}
                            size="small"
                            className={classes.formRow}
                            onChange={setUseBefore}
                        />
                    </MuiPickersUtilsProvider>

                    <FormCheckbox
                        className={classes.checkbox}
                        disabled={disabled}
                        checked={sterile}
                        onChange={setSterile}
                        label="Produkt ist steril"
                    />

                    <FormCheckbox
                        className={classes.checkbox}
                        disabled={disabled}
                        checked={sealed}
                        onChange={setSealed}
                        label="Produkt ist originalverpackt"
                    />

                    <FormCheckbox
                        className={classes.checkbox}
                        disabled={disabled}
                        checked={medical}
                        onChange={setMedical}
                        label="Produkt ist medizinisch"
                    />

                    <TextareaAutosize
                        rowsMin={3}
                        rowsMax={8}
                        placeholder="Kommentar"
                        value={comment}
                        disabled={disabled}
                        className={classes.comment}
                        onChange={e => setComment(e.target.value)}/>

                </div>

            </PopupDialog>
        </>
    )
};

export default CreateOfferDialog;
