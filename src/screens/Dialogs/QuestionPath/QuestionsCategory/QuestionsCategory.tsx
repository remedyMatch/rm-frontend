import React, {useEffect} from "react";
import {CircularProgress} from "@material-ui/core";
import {Answers} from "../QuestionsStepper/QuestionsStepper";
import {loadArtikelKategorien} from "../../../../State/ArtikelKategorienState";
import {useDispatch, useSelector} from "react-redux";
import {getArtikelKategorien} from "../../../../State/Selectors/ArtikelKategorienSelector";
import {ChunkedCardsFromOptions} from "../utils/ChunkedCardsFromOptions";
import {loadAngebote} from "../../../../State/AngeboteState";
import {loadBedarfe} from "../../../../State/BedarfeState";
import {loadNumberOfferCategory} from "../../../../State/NumberOfferCategoryState";
import {getNumberOfferCategory} from "../../../../State/Selectors/NumberCategorySelector";


export const QuestionsCategory: React.FC<{
    answers: Answers,
    setAnswers: (answers: Answers) => void,
    currentStep: number,
    setCurrentStep: (currentStep: number) => void,
}> =
    ({answers, setAnswers, currentStep, setCurrentStep,}) => {
        const dispatch = useDispatch();
        const chunkSize = 3;
        const categories = useSelector(getArtikelKategorien);
        const numberOfferCategories = useSelector(getNumberOfferCategory);

        console.log(numberOfferCategories)

        useEffect(() => {
            dispatch(loadArtikelKategorien());
            dispatch(loadAngebote());
            dispatch(loadBedarfe());
            dispatch(loadNumberOfferCategory())
        }, [dispatch]);

        if (categories === undefined) {
            return <CircularProgress/>
        }

        return (
            <ChunkedCardsFromOptions optionsArray={categories} type={"ArtikelKategorie"} chunkSize={chunkSize}
                                     answers={answers}
                                     setAnswers={setAnswers} currentStep={currentStep} setCurrentStep={setCurrentStep}/>
        )
    };

