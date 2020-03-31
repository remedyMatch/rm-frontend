import {ApiResponse} from "./ApiUtils";

interface HandleDialogState {
    error?: string;
    disabled: boolean;
}

type StateHandler = <S extends HandleDialogState>(state: S) => void;

const handleDialogButton = async <S extends HandleDialogState>(
    setState: StateHandler,
    onSuccess: () => void,
    doValidate: () => string | undefined,
    doRequest: () => Promise<ApiResponse<any>>,
    initialState?: S
) => {
    const error = doValidate();
    if (error) {
        return setState({
            error: error,
            disabled: false
        });
    }

    setState({
        disabled: true,
        error: undefined
    });

    const result = await doRequest();

    setState({
        disabled: false,
        error: result.error
    });

    if (!result.error) {
        if(initialState) {
            setState({...initialState});
        }

        onSuccess();
    }
};

export {
    handleDialogButton
};