import React, {useEffect} from "react";
import {CircularProgress} from "@material-ui/core";
import {Answers} from "../QuestionsStepper/QuestionsStepper";
import {useDispatch, useSelector} from "react-redux";
import {getArtikel} from "../../../../State/Selectors/ArtikelSelector";
import {loadArtikel} from "../../../../State/ArtikelState";
import {Artikel} from "../../../../Domain/Artikel";
import {ChunkedCardsFromOptions} from "../utils/ChunkedCardsFromOptions";

export const QuestionsItems: React.FC<{
    answers: Answers, setAnswers: (answers: Answers) => void,
    currentStep: number, setCurrentStep: (step: number) => void,
}> =
    ({
         answers, setAnswers,
         currentStep, setCurrentStep,
     }) => {
        const dispatch = useDispatch();
        const chunkSize = 2;
        const items = useSelector(getArtikel)?.filter((item) => {
            return item.artikelKategorieId === answers.category?.id
        }) || undefined

        useEffect(() => {
            dispatch(loadArtikel())
        }, [dispatch])

        if (items === undefined) {
            return <CircularProgress/>
        }

        return (
            <ChunkedCardsFromOptions optionsArray={items} type={"Artikel"} chunkSize={chunkSize} answers={answers}
                                     setAnswers={setAnswers} currentStep={currentStep} setCurrentStep={setCurrentStep}/>
        );
    };
