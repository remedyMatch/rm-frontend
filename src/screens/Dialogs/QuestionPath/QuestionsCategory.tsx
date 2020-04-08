import React from "react";
import {Grid} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CardButton} from "./utils/CardButton";
import {Answers, Category} from "./QuestionStepper";
import {uuidv4} from "./utils/uuid";
import {chunkArray} from "./utils/chunkArray";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        questionGrid: {
            height: 500,
            paddingTop: "100%",
            position: "relative",
        },
    }));

export const QuestionsCategory: React.FC<{
    answers: Answers,
    setAnswers: (answers: Answers) => void,
    currentStep: number,
    setCurrentStep: (currentStep: number) => void,
    categories: Category[],
}> =
    ({answers, setAnswers, currentStep, setCurrentStep, categories}) => {
        const classes = useStyles();
        const chunkSize = 2;
        const chunkedCategories = chunkArray(categories, chunkSize);
        // @ts-ignore
        const space: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 = Math.floor(12 / chunkSize);
        return (
            <div>
                {chunkedCategories.map(
                    (categoryChunk: Category[]) => {
                        return <Grid key={uuidv4()} container spacing={3}>
                            {categoryChunk.map((category) => {
                                return <Grid key={uuidv4()} className={classes.questionGrid} item
                                             xs={space}>
                                    <CardButton onClick={() => {
                                        setAnswers({
                                            isDonor: answers.isDonor,
                                            category: category,
                                            number: answers.number,
                                            exactType: answers.exactType,
                                            location: answers.location,
                                        });
                                        setCurrentStep(currentStep + 1)
                                    }}>
                                        {category.categoryName}
                                    </CardButton>
                                </Grid>
                            })}
                        </Grid>
                    }
                )}
            </div>
        )
    };

