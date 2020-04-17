import React, {useEffect, useState} from "react";
import {Answers, Details} from "../QuestionsStepper/QuestionsStepper";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {ArtikelVariante} from "../../../../Domain/ArtikelVariante";
import {Card, TextareaAutosize, TextField} from "@material-ui/core";
import {FormLocationPicker} from "../../../../components/Form/FormLocationPicker";
import {useSelector} from "react-redux";
import {getInstitution} from "../../../../State/Selectors/InstitutionSelector";
import {InstitutionStandort} from "../../../../Domain/InstitutionStandort";
import {FormCheckbox} from "../../../../components/Form/FormCheckbox";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {de} from "date-fns/locale";

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
            width: "100%",
            marginTop: "16px"
        },
        comment: {
            display: "block",
            width: "100%",
            marginTop: "16px",
            resize: "none",
            fontSize: "14px",
            padding: "16px",
            "&:focus": {
                outline: "none",
                border: "2px solid " + theme.palette.primary.main
            }
        },
        checkbox: {
            display: "block",
            marginRight: "auto"
        }
    }));

export const DetailsCard: React.FC<{
    itemVariant: ArtikelVariante | null,
    currentStep: number, setCurrentStep: (step: number) => void,
    answers: Answers, setAnswers: (answers: Answers) => void,
}> =
    ({
         itemVariant,
         answers, setAnswers
     }) => {
        const classes = useStyles();

        const [amount, setAmount] = useState<number>(1)

        const institution = useSelector(getInstitution)
        const availableSites = ([] as InstitutionStandort[]).concat(institution?.hauptstandort || []).concat(
            institution?.standorte || [])
        const [selectedSite, setSelectedSite] = useState<InstitutionStandort | null>(institution?.hauptstandort || null)

        const [comment, setComment] = useState<string>("")

        const [bestByDate, setBestByDate] = useState<Date | null>(new Date());

        const [isSterile, setIsSterile] = useState<boolean>(false);

        const [isOriginalPackaging, setIsOriginalPackaging] = useState<boolean>(false);
        const [isMedical, setIsMedical] = useState<boolean>(false);

        useEffect(() => {
            if (answers.details === undefined) {
                setAnswers(Object.assign(answers, {details: [] as Details[]}))
            }
            if (itemVariant !== undefined && itemVariant !== null && selectedSite !== null) {
                const newDetails: Details = {
                    variantId: itemVariant.id,
                    isSterile: isSterile,
                    isMedical: isMedical,
                    isOriginalPackaging: isOriginalPackaging,
                    location: selectedSite,
                    bestByDate: answers.isDonor ? (bestByDate !== null ? bestByDate : undefined) : undefined,
                    amount: amount,
                };
                const findDetails = answers.details?.find((detail: Details) => detail.variantId === newDetails.variantId);
                if (answers.details !== undefined) {
                    if (!findDetails) {
                        const answersWithDetails = Object.assign(answers, {details: answers.details.concat([newDetails])});
                        setAnswers(answersWithDetails)
                    } else {
                        const indexOldValue = answers.details.map((detail) => detail.variantId).indexOf(itemVariant.id);
                        answers.details.splice(indexOldValue, 1, newDetails)
                        setAnswers(answers)
                    }
                }
            }
        }, [isSterile, isMedical, isOriginalPackaging, selectedSite, bestByDate, amount, answers, setAnswers, itemVariant])

        if (answers.variant === undefined) {
            return <div>Keine Artikelvariante ausgewählt.</div>
        }

        if (itemVariant === null) {
            return <></>
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

                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de}>
                    {answers.isDonor ?
                        <KeyboardDatePicker
                            variant="inline"
                            minDate={new Date()}
                            format="dd.MM.yyyy"
                            margin="normal"
                            label="Haltbarkeitsdatum"
                            inputVariant="outlined"
                            value={bestByDate}
                            size="small"
                            className={classes.formRow}
                            onChange={setBestByDate}
                        /> : <></>}
                </MuiPickersUtilsProvider>

                <FormCheckbox
                    className={classes.checkbox}
                    checked={isSterile}
                    onChange={setIsSterile}
                    label={answers.isDonor ? "Produkt ist steril" : "Produkt muss steril sein"}
                />

                {answers.isDonor ?
                    <FormCheckbox
                        className={classes.checkbox}
                        checked={isOriginalPackaging}
                        onChange={setIsOriginalPackaging}
                        label={"Produkt ist originalverpackt"}
                    /> : <></>}

                <FormCheckbox
                    className={classes.checkbox}
                    disabled={itemVariant.medizinischAuswaehlbar}
                    checked={isMedical}
                    onChange={setIsMedical}
                    label={answers.isDonor ? "Produkt ist medizinisch" : "Produkt muss medizinisch sein"}
                />

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
