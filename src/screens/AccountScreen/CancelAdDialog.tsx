import React, { useCallback, useState } from "react";
import PopupDialog from "../../components/Dialog/PopupDialog";
import { apiPost, logApiError } from "../../util/ApiUtils";
import { defined, validate } from "../../util/ValidationUtils";

interface Props {
  open: boolean;
  onAccepted: () => void;
  onCancelled: () => void;
  type?: "offer" | "demand";
  adId?: string;
}

const CancelAdDialog: React.FC<Props> = (props) => {
  const { onCancelled, onAccepted, type, adId, open } = props;

  const [disabled, setDisabled] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const onCloseError = useCallback(() => setError(undefined), []);

  const onAccept = useCallback(async () => {
    const error = validate(
      defined(type, "Kein Inserat-Typ ausgewählt!"),
      defined(adId, "Kein Inserat ausgewählt!")
    );

    if (error) {
      setError(error);
      return;
    }

    setError(undefined);
    setDisabled(true);

    const result = await apiPost(
      "/remedy/" +
        (type === "offer" ? "angebot/" : "bedarf/") +
        adId +
        "/schliessen"
    );

    setDisabled(false);
    if (result.error) {
      logApiError(
        result,
        "Beim Schließen des Inserats ist ein Fehler aufgetreten"
      );
      setError(
        "Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es erneut."
      );
    } else {
      onAccepted();
    }
  }, [onAccepted, adId, type]);

  const onCancel = useCallback(() => {
    setError(undefined);
    onCancelled();
  }, [onCancelled]);

  return (
    <PopupDialog
      fullWidth={false}
      open={open}
      error={error}
      disabled={disabled}
      onCloseError={onCloseError}
      onSecond={onCancel}
      onFirst={onAccept}
      firstTitle="Inserat stornieren"
      secondTitle="Abbrechen"
      title="Inserat stornieren"
      subtitle="Sind Sie sicher, dass Sie das Inserat stornieren wollen? Dabei werden auch sämtliche offenen Anfragen abgebrochen."
    />
  );
};

export default CancelAdDialog;
