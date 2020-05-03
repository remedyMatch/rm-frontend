import {DialogContentText} from "@material-ui/core";
import React, {useCallback, useState} from "react";
import PopupDialog from "../../../components/Dialog/PopupDialog";
import {apiPost} from "../../../util/ApiUtils";
import {defined, validate} from "../../../util/ValidationUtils";

interface Props {
    open: boolean;
    onNo: () => void;
    onYes: () => void;

    requestId?: string;
    isDemand?: boolean;
    amount?: number;
    articleName?: string;
}

const CancelEntryDialog: React.FC<Props> = props => {
    const {onNo, onYes, requestId, isDemand, amount, articleName} = props;

    const [disabled, setDisabled] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const onCloseError = useCallback(() => setError(undefined), []);

    const onNoClicked = useCallback(() => {
        setError(undefined);
        onNo();
    }, [onNo]);

    const onYesClicked = useCallback(async () => {
        const error = validate(
            defined(requestId, "Anfrage nicht gesetzt!"),
            defined(isDemand, "Anfrage-Typ nicht gesetzt!"),
            defined(amount, "Anzahl nicht gesetzt!"),
            defined(articleName, "Artikel-Name nicht gesetzt!")
        );

        if (error) {
            setError(error);
            return;
        }

        setError(undefined);
        setDisabled(true);

        const result = await apiPost("/remedy/" + (isDemand ? "bedarf/" : "angebot/") + requestId + "/schliessen");

        setDisabled(false);
        if (result.error) {
            setError(result.error);
        } else {
            onYes();
        }
    }, [onYes, isDemand, requestId, amount, articleName]);

    return (
        <PopupDialog
            open={props.open}
            error={error}
            title={isDemand ? "Bedarf schließen" : "Angebot schließen"}
            disabled={disabled}
            firstTitle="Abbrechen"
            secondTitle="Löschen"
            onFirst={onNoClicked}
            onSecond={onYesClicked}
            onCloseError={onCloseError}>

            <DialogContentText>
                Soll
                {isDemand && " der Bedarf nach "}
                {!isDemand && " das Angebot über "}
                {amount + " "}
                {articleName + " "}
                wirklich geschlossen werden?
            </DialogContentText>

        </PopupDialog>
    );
};

export default CancelEntryDialog;