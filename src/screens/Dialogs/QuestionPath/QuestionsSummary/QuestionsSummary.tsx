import React from "react";
import {Answers} from "../QuestionsStepper/QuestionsStepper";
import {Button} from "@material-ui/core";
import EntryTable from "../../../../components/Table/EntryTable";
import {useSelector} from "react-redux";
import {getInstitution} from "../../../../State/Selectors/InstitutionSelector";
import {Bedarf} from "../../../../Domain/Bedarf";
import {Angebot} from "../../../../Domain/Angebot";

export const QuestionsSummary: React.FC<{
    answers: Answers,
    currentStep: number, setCurrentStep: (step: number) => void,
}> =
    ({answers, currentStep, setCurrentStep}) => {

        const myInstitution = useSelector(getInstitution);

        if (answers.isDonor === undefined) {

            return <Button onClick={() => {
                setCurrentStep(0)
            }}>Neue Anfrage oder Angebot</Button>
        }
        if (answers.category === undefined) {
            return <Button onClick={() => {
                setCurrentStep(1)
            }}>Kategorie auswählen.</Button>
        }
        if (answers.artikel === undefined) {
            return <Button onClick={() => {
                setCurrentStep(2)
            }}>Artikel auswählen.</Button>
        }
        if (answers.variant === undefined) {
            return <Button onClick={() => {
                setCurrentStep(3)
            }}>Variante auswählen.</Button>
        }
        if (answers.details === undefined) {
            return <Button onClick={() => {
                setCurrentStep(4)
            }}>Details eingeben.</Button>
        }
        if (myInstitution === undefined || myInstitution.hauptstandort === undefined) {
            return <div>Kein Standort angegeben.</div>
        }


        if (!answers.isDonor) {
            const bedarfe = answers.variant.map((variant) => {
                const correspondingDetails = answers.details?.find((detail) => detail.variantId === variant.id) || undefined;
                return {
                    id: variant.id,
                    artikelId: answers.artikel?.id || "keyMissing",
                    artikelVarianteId: variant.id,
                    anzahl: correspondingDetails?.amount || 0,
                    rest: correspondingDetails?.amount || 0,
                    institutionId: myInstitution?.institutionKey || "keyMissing",
                    standort: correspondingDetails?.location || myInstitution.hauptstandort,
                    steril: correspondingDetails?.isSterile || false,
                    medizinisch: correspondingDetails?.isMedical || false,
                    kommentar: "",
                    entfernung: 0,
                }
            })

            return (
                <EntryTable artikel={[answers.artikel]} artikelKategorien={[answers.category]} angebote={[]}
                            bedarfe={bedarfe as Bedarf[]}/>
            )
        }

        const angebote = answers.variant.map((variant) => {
            const correspondingDetails = answers.details?.find((detail) => detail.variantId === variant.id) || undefined;
            return {
                id: variant.id,
                artikelId: answers.artikel?.id || "keyMissing",
                artikelVarianteId: variant.id,
                anzahl: correspondingDetails?.amount || 0,
                institutionId: myInstitution?.institutionKey || "keyMissing",
                standort: correspondingDetails?.location || myInstitution.hauptstandort,
                steril: correspondingDetails?.isSterile || false,
                originalverpackt: correspondingDetails?.isOriginalPackaging || false,
                medizinisch: correspondingDetails?.isMedical || false,
                kommentar: "",
                entfernung: 0,
            }
        })

        return (
            <EntryTable artikel={[answers.artikel]} artikelKategorien={[answers.category]} angebote={angebote as Angebot[]}
                        bedarfe={[]}/>
        )
    };