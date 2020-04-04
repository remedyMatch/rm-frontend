import React, {useState} from "react";
import {Answers, Category} from "./Questions";
import {CardButton} from "./CardButton";
import {Grid} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import AddOfferDialog from "../Offer/AddOfferDialog";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        questionGrid: {
            height: 500,
            paddingTop: "100%",
            position: "relative",
        },
    }));

export const CategoryOptions: React.FC<{ categorys: Category[], answers: Answers, setAnswers: (answers: Answers) => void }> =
    ({categorys, answers, setAnswers}) => {
        const classes = useStyles();
        const [isOpen, setIsOpen] = useState<boolean>(false);
        // @ts-ignore
        const space: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 = Math.floor(12 / categorys.length);

        return (
            <Grid container spacing={3}>
                {
                    categorys.map((category) => {
                            return (
                                <Grid key={category.categoryName} className={classes.questionGrid} item xs={space}>
                                    <CardButton onClick={() => {
                                        setAnswers({
                                            isDonor: answers.isDonor,
                                            category: category.categoryName,
                                            number: answers.number,
                                            exactType: answers.exactType,
                                            location: answers.location,
                                        });
                                        setIsOpen(!isOpen)
                                    }}>
                                        {category.categoryName}
                                    </CardButton>
                                    <AddOfferDialog
                                        open={isOpen}
                                        onCancelled={() => setIsOpen(!isOpen)}
                                        onSaved={() => {
                                            console.log("saved")
                                        }}
                                        artikel={[]}/>
                                </Grid>
                            )
                        }
                    )
                }
            </Grid>
        )
    };