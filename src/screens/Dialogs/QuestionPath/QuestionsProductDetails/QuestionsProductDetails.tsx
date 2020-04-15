import React, {useState} from "react";
import {Answers, Item} from "../QuestionsStepper/QuestionsStepper";
import {Grid} from "@material-ui/core";
import {uuidv4} from "../utils/uuid";
import {chunkArray} from "../utils/chunkArray";
import {DetailsCard} from "./DetailsCard";
import {NavigationDialogue} from "../QuestionsStepper/NavigationDialogue";
import {Artikel} from "../../../../Domain/Artikel";

export type OneToTwelve = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const QuestionsProductDetails: React.FC<{
    answers: Answers, setAnswers: (answers: Answers) => void,
    currentStep: number, setCurrentStep: (step: number) => void,
}> =
    ({
         answers, setAnswers,
         currentStep, setCurrentStep,
     }) => {

        const [filledItems, setFilledItems] = useState<Artikel[]>([]);

        if (answers.exactType === undefined) {
            return <div>Keine Artikel ausgewählt!</div>
        }


        const chunkSize = 2;
        // @ts-ignore
        const space: OneToTwelve = Math.floor(12 / chunkSize);
        const chunkedItems = chunkArray(answers.exactType, chunkSize);

        return (
            <NavigationDialogue currentStep={currentStep} setCurrentStep={setCurrentStep}>
                {chunkedItems.map(
                    (itemChunk: Artikel[]) => {
                        return <Grid key={uuidv4()} container spacing={3}>
                            {itemChunk.map((item) => {
                                return (
                                    <DetailsCard key={item.id} item={item} setItemsOut={setItemsOut} space={space}/>
                                )
                            })}
                        </Grid>
                    }
                )}
            </NavigationDialogue>
        );

        function setItemsOut(item: Item) {
            setFilledItems(filledItems.concat([item]))
        }

    };
