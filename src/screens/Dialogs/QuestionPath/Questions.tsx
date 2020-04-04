import React, {useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Grid} from "@material-ui/core";
import {CardButton} from "./CardButton";
import {CategoryOptions} from "./CategoryOptions";

export interface Answers {
    isDonor: boolean | undefined;
    category: "mask" | "disinfectant" | "gloves" | "facemask" | undefined;
    exactType: string | undefined;
    number: number | undefined;
    location: string | undefined;
}

export interface Category {
    categoryName: "mask" | "disinfectant" | "gloves" | "facemask";
    items: string[];
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        questionGrid: {
            height: 500,
            paddingTop: "100%",
            position: "relative",
        },
    }));
export const Questions: React.FC = () => {
    const classes = useStyles();
    const initialAnswers: Answers = {
        isDonor: undefined,
        category: undefined,
        exactType: undefined,
        number: undefined,
        location: undefined,
    };
    const [answers, setAnswers] = useState<Answers>(initialAnswers);

    if (answers.isDonor === undefined) {
        return (
            <Grid container spacing={3}>
                <Grid item xs={6} className={classes.questionGrid}>
                    <CardButton onClick={() => {
                        setAnswers({
                            isDonor: true,
                            category: answers.category,
                            exactType: answers.exactType,
                            number: answers.number,
                            location: answers.location,
                        })
                    }}>
                        Anbieten
                    </CardButton>
                </Grid>

                <Grid item xs={6} className={classes.questionGrid}>
                    <CardButton onClick={() => {
                        setAnswers({
                            isDonor: false,
                            category: answers.category,
                            exactType: answers.exactType,
                            number: answers.number,
                            location: answers.location,
                        })
                    }}>
                        Suchen
                    </CardButton>
                </Grid>
            </Grid>
        )
    }

    return (
        <CategoryOptions categorys={[{categoryName: "mask", items: ["mask1", "mask2"]}, {
            categoryName: "facemask",
            items: ["facemask1", "facemask2"]
        }]} answers={answers} setAnswers={setAnswers}/>
    )
};
