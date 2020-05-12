import React, {useCallback, useEffect, useState} from "react";
import PopupDialog from "../../components/Dialog/PopupDialog";
import NumberInput from "../../components/Form/NumberInput";
import {apiPost, logApiError} from "../../util/ApiUtils";
import {defined, numberSize, validate} from "../../util/ValidationUtils";

interface Props {
    open: boolean;
    onSaved: () => void;
    onCancelled: () => void;
    currentCount?: number;
    type?: "offer" | "demand";
    adId?: string;
}

const EditCountDialog: React.FC<Props> = props => {
    const {onCancelled, onSaved, type, adId, open, currentCount} = props;

    const [count, setCount] = useState<number | undefined>(undefined);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const onCloseError = useCallback(() => setError(undefined), []);

    useEffect(() => {
        if(currentCount) {
            setCount(currentCount)
        }
    }, [currentCount]);

    const onAccept = useCallback(async () => {
        const error = validate(
            defined(currentCount, "Keine vorherige Anzahl ausgewählt!"),
            defined(type, "Kein Inserat-Typ ausgewählt!"),
            defined(adId, "Kein Inserat ausgewählt!"),
            defined(count, "Keine Anzahl ausgewählt!"),
            numberSize(count!, "Die Anzahl", 0)
        );

        if (error) {
            setError(error);
            return;
        }

        setError(undefined);
        setDisabled(true);

        const result = await apiPost("/remedy/" + (type === "offer" ? "angebot/" : "bedarf/") + adId + "/anzahl", {
            anzahl: count
        });

        setDisabled(false);
        if (result.error) {
            logApiError(result, "Beim Anpassen der Anzahl des Inserats ist ein Fehler aufgetreten");
            setError("Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        } else {
            onSaved();
        }
    }, [onSaved, adId, type, count, currentCount]);

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
            onFirst={onCancel}
            onSecond={onAccept}
            secondTitle="Inserat anpassen"
            firstTitle="Abbrechen"
            title="Inserat anpassen"
            subtitle="Sie können die Artikel-Anzahl des Inserats anpassen. Dies hat Auswirkungen auf alle offenen Anfragen zu diesem Inserat.">
            
            <NumberInput
                label="Artikel-Anzahl"
                onChange={setCount}
                value={count} />
            
        </PopupDialog>
    );
};

export default EditCountDialog;