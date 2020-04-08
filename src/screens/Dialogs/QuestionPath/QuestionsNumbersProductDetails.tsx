import React from "react";
import {Answers, Item} from "./QuestionStepper";
import {Grid} from "@material-ui/core";
import {uuidv4} from "./utils/uuid";
import {chunkArray} from "./utils/chunkArray";
import {DetailsCard} from "./utils/DetailsCard";

export type OneToTwelve = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const QuestionsNumbersProductDetails: React.FC<{ answers: Answers, setAnswers: (answers: Answers) => void, }> =
    ({answers, setAnswers}) => {

        if (answers.exactType === undefined) {
            return <div>Keine Artikel ausgewählt!</div>

        }


        const chunkSize = 2;
        // @ts-ignore
        const space: OneToTwelve = Math.floor(12 / chunkSize);
        const chunkedItems = chunkArray(answers.exactType, chunkSize);

        return (
            <div>
                {chunkedItems.map(
                    (itemChunk: Item[]) => {
                        return <Grid key={uuidv4()} container spacing={3}>
                            {itemChunk.map((item) => {
                                return (
                                    <DetailsCard key={uuidv4()} item={item} space={space}/>
                                )
                            })}
                        </Grid>
                    }
                )}
            </div>
        );

    };
