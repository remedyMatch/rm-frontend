import React, {useState} from "react";
import {Answers} from "../QuestionsStepper/QuestionsStepper";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {ArtikelVariante} from "../../../../Domain/ArtikelVariante";
import {Card, TextareaAutosize, TextField} from "@material-ui/core";
import {FormLocationPicker} from "../../../../components/Form/FormLocationPicker";
import {useSelector} from "react-redux";
import {getInstitution} from "../../../../State/Selectors/InstitutionSelector";
import {InstitutionStandort} from "../../../../Domain/InstitutionStandort";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        questionGrid: {
            height: 500,
            paddingTop: "100%",
            position: "relative",
        },
        questionCard: {
            position: "relative",
            height: "100%",
            width: "100%",
        },
        formRow: {
            marginTop: "16px"
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
        },
        caption: {
            textAlign: "right",
            marginTop: "8px"
        },
        popup: {
            border: "1px solid #CCC",
            borderRadius: "4px",
            backgroundColor: "#FCFCFC"
        },
    }));

export const DetailsCard: React.FC<{
    itemVariant: ArtikelVariante | null,
    currentStep: number, setCurrentStep: (step: number) => void,
    answers: Answers, setAnswers: (answers: Answers) => void,
}> =
    ({
         itemVariant,
         currentStep, setCurrentStep,
         answers, setAnswers
     }) => {
        const classes = useStyles();
        const chunkSize = 2;

        const [amount, setAmount] = useState<number>(1)

        const institution = useSelector(getInstitution)
        const availableSites = ([] as InstitutionStandort[]).concat(institution?.hauptstandort || []).concat(
            institution?.standorte || [])
        const [selectedSite, setSelectedSite] = useState<InstitutionStandort | null>(institution?.hauptstandort || null)

        const [comment, setComment] = useState<string>("")

        const sizes = ["S", "M", "L", "XL", "UNI"];
        const [bestByDate, setBestByDate] = useState<Date | null>(null);

        const [isSterile, setIsSterile] = useState<boolean>(false);

        const [isOriginalPackaging, setIsOriginalPackaging] = useState<boolean>(false);
        const [isMedical, setIsMedical] = useState<boolean>(false);
        if (answers.variant === undefined) {

            return <div>Keine Artikelvariante ausgewählt.</div>
        }

        if (itemVariant === null) {
            return <div>This crashed here.</div>
        }

        return (
            <Card>
                <TextField
                    label="Anzahl"
                    type="number"
                    variant="outlined"
                    size="small"
                    onChange={(event) => {
                        let tmpAmount = parseFloat(event.target.value)
                        tmpAmount = Math.floor(tmpAmount)
                        setAmount(tmpAmount)
                    }}
                    InputProps={{inputProps: {min: 1}}}
                    className={classes.formRow}
                    value={amount}/>
                <FormLocationPicker
                    options={availableSites}
                    onSelect={(site) => setSelectedSite(site)}
                    className={classes.formRow}
                    valueId={selectedSite?.id || undefined}/>
                <TextareaAutosize
                    rowsMin={3}
                    rowsMax={8}
                    placeholder="Kommentar"
                    value={comment}
                    className={classes.comment}
                    onChange={(event) => {
                        setComment(event.target.value)
                    }}/>
            </Card>
        );
    };
