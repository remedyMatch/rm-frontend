import {DialogContentText} from "@material-ui/core";
import React, {useCallback, useState} from "react";
import PopupDialog from "../../../../components/Dialog/PopupDialog";
import {apiDelete} from "../../../../util/ApiUtils";
import {defined, validate} from "../../../../util/ValidationUtils";

interface Props {
    open: boolean;
    onNo: () => void;
    onYes: () => void;

    requestId?: string;
    isDemand?: boolean;
    institutionName?: string;
}

interface State {
    disabled: boolean;
    error?: string;
}

const CancelSentOfferDialog: React.FC<Props> = props => {
    const {onNo, onYes, requestId, isDemand, institutionName} = props;

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
            defined(institutionName, "Institutionsname nicht gesetzt!"),
        );

        if (error) {
            setError(error);
            return;
        }

        setError(undefined);
        setDisabled(true);

        const result = await apiDelete("/remedy/" + (isDemand ? "bedarf" : "angebot") + "/anfrage/" + requestId);

        setDisabled(false);
        if (result.error) {
            setError(result.error);
        } else {
            onYes();
        }
    }, [onYes, isDemand, requestId, institutionName]);

    return (
        <PopupDialog
            open={props.open}
            error={error}
            title="Anfrage stornieren"
            disabled={disabled}
            firstTitle="Abbrechen"
            secondTitle="Stornieren"
            onFirst={onNoClicked}
            onSecond={onYesClicked}
            onCloseError={onCloseError}>

            <DialogContentText>
                Soll die Anfrage an {props.institutionName} wirklich storniert werden?
            </DialogContentText>

        </PopupDialog>
    );
};

export default CancelSentOfferDialog;