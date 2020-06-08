import { makeStyles, Theme } from "@material-ui/core/styles";
import React, { useCallback, useState } from "react";
import PopupDialog from "../../components/Dialog/PopupDialog";
import Checkbox from "../../components/Form/Checkbox";
import CheckboxGroup from "../../components/Form/CheckboxGroup";
import NumberInput from "../../components/Form/NumberInput";
import TextArea from "../../components/Form/TextArea";
import { Bedarf } from "../../domain/bedarf/Bedarf";
import { InstitutionBedarf } from "../../domain/bedarf/InstitutionBedarf";
import { apiPost, logApiError } from "../../util/ApiUtils";
import {
  defined,
  numberSize,
  stringLength,
  validate,
} from "../../util/ValidationUtils";

interface Props {
  open: boolean;
  onCreated: (created: InstitutionBedarf) => void;
  onCancelled: () => void;
  variantId?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  rowEntry: {
    minWidth: "260px",
    flexGrow: 1,
    width: "calc((100% - 4.5em) / 2)",
    margin: "0px auto",
  },
  formRow: {
    minWidth: "260px",
    flexGrow: 1,
    margin: "1.5em 0em",
  },
}));

const CreateDemandDialog: React.FC<Props> = (props) => {
  const classes = useStyles();

  const { onCancelled, onCreated, variantId } = props;

  const [amount, setAmount] = useState<number | undefined>(0);
  const [publicDemand, setPublicDemand] = useState<boolean>(true);
  const [sterile, setSterile] = useState<boolean>(false);
  const [medical, setMedical] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  const [disabled, setDisabled] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const onCloseError = useCallback(() => setError(undefined), []);

  const onCreate = useCallback(async () => {
    const error = validate(
      defined(variantId, "Es wurde keine Variante ausgewählt!"),
      defined(amount, "Es wurde keine Anzahl ausgewählt!"),
      numberSize(amount!, "Die benötigte Anzahl", 1),
      stringLength(comment, "Ihre Nachricht", 1, 1024)
    );

    if (error) {
      setError(error);
      return;
    }

    setError(undefined);
    setDisabled(true);

    const result = await apiPost<Bedarf>("/remedy/bedarf", {
      artikelVarianteId: variantId,
      anzahl: amount,
      kommentar: comment,
      steril: sterile,
      medizinisch: medical,
      oeffentlich: publicDemand,
    });

    setDisabled(false);
    if (result.error) {
      logApiError(
        result,
        "Beim Anlegen des Angebots ist ein Fehler aufgetreten"
      );
      setError(
        "Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es erneut."
      );
    } else {
      setAmount(0);
      setPublicDemand(true);
      setSterile(false);
      setMedical(false);
      setComment("");
      onCreated({ anfragen: [], ...result.result! });
    }
  }, [onCreated, variantId, amount, comment, sterile, medical, publicDemand]);

  const onCancel = useCallback(() => {
    setError(undefined);
    onCancelled();
  }, [onCancelled]);

  return (
    <>
      <PopupDialog
        open={props.open}
        error={error}
        onCloseError={onCloseError}
        firstTitle="Abbrechen"
        onFirst={onCancel}
        secondTitle="Erstellen"
        onSecond={onCreate}
        title="Inserat erstellen"
        subtitle="Um ein Inserat zu erstellen, benötigen wir noch ein paar weitere Informationen von Ihnen."
      >
        <div className={classes.dialogContent}>
          <div className={classes.row}>
            <NumberInput
              label="Wie viele benötigen Sie?"
              disabled={disabled}
              onChange={setAmount}
              className={classes.rowEntry}
              value={amount}
            />

            <CheckboxGroup
              className={classes.rowEntry}
              label="Wie soll der Zustand sein?"
            >
              <Checkbox
                disabled={disabled}
                checked={sterile}
                onChange={setSterile}
                label="Steril"
              />

              <Checkbox
                disabled={disabled}
                checked={medical}
                onChange={setMedical}
                label="Medizinisch"
              />
            </CheckboxGroup>
          </div>

          <TextArea
            label="Ihre Nachricht"
            onChange={setComment}
            className={classes.formRow}
            disabled={disabled}
            minLines={4}
            maxLines={4}
            placeholder="Bitte eintippen..."
            value={comment}
          />

          <CheckboxGroup
            className={classes.formRow}
            label="Möchten Sie Anfragen zu diesem Bedarf erhalten?"
          >
            <Checkbox
              disabled={disabled}
              checked={publicDemand}
              onChange={setPublicDemand}
              label="Bedarf ist öffentlich"
            />
          </CheckboxGroup>
        </div>
      </PopupDialog>
    </>
  );
};

export default CreateDemandDialog;
