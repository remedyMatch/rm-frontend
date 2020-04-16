import React, {useState} from "react";
import {Answers} from "../QuestionsStepper/QuestionsStepper";
import {NavigationDialogue} from "../QuestionsStepper/NavigationDialogue";
import {Artikel} from "../../../../Domain/Artikel";
import {ChunkedCardsFromOptions} from "../utils/ChunkedCardsFromOptions";
import {DetailsCard} from "./DetailsCard";

export const QuestionsProductDetails: React.FC<{
    answers: Answers, setAnswers: (answers: Answers) => void,
    currentStep: number, setCurrentStep: (step: number) => void,
}> =
    ({
         answers, setAnswers,
         currentStep, setCurrentStep,
     }) => {

        const [filledItems, setFilledItems] = useState<Artikel[]>([]);

        if (answers.artikel === undefined) {
            return <div>Kein Artikel ausgewählt!</div>
        }
        if (answers.variant === undefined || answers.variant.length === 0) {
            return <div>Kein Varianten ausgewählt!</div>
        }


        const chunkSize = 2;

        return (
            <NavigationDialogue currentStep={currentStep} setCurrentStep={setCurrentStep}>
                <ChunkedCardsFromOptions optionsArray={answers.variant} type={"Details"} chunkSize={chunkSize}
                                         answers={answers} setAnswers={setAnswers} currentStep={currentStep}
                                         setCurrentStep={setCurrentStep}>
                    <DetailsCard itemVariant={null} currentStep={currentStep}
                                 setCurrentStep={setCurrentStep} answers={answers} setAnswers={setAnswers}/>
                </ChunkedCardsFromOptions>
            </NavigationDialogue>
        );
    };
