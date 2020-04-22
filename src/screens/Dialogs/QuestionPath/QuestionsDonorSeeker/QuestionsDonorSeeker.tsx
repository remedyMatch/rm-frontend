import React from "react";
import {Answers} from "../QuestionsStepper/QuestionsStepper";
import {ChunkedCardsFromOptions} from "../utils/ChunkedCardsFromOptions";

export interface DonorSeeker {
    name: string;
    isDonor: boolean;
}

export const QuestionsDonorSeeker: React.FC<{
    answers: Answers,
    setAnswers: (answers: Answers) => void,
    currentStep: number,
    setCurrentStep: (currentStep: number) => void,
}> =
    ({answers, setAnswers, currentStep, setCurrentStep}) => {

        return (
            <ChunkedCardsFromOptions
                optionsArray={[{name: "Anbieten", isDonor: true}, {name: "Suchen", isDonor: false}]}
                type={"DonorSeeker"}
                chunkSize={2} answers={answers} setAnswers={setAnswers} currentStep={currentStep}
                setCurrentStep={setCurrentStep}/>

        );
    };
