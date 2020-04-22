import {ArtikelKategorie} from "../../../../Domain/ArtikelKategorie";
import {Grid} from "@material-ui/core";
import {uuidv4} from "./uuid";
import {CardButton} from "./CardButton";
import React from "react";
import {Artikel} from "../../../../Domain/Artikel";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Answers, OneToTwelve} from "../QuestionsStepper/QuestionsStepper";
import {chunkArray} from "./chunkArray";
import {ArtikelVariante} from "../../../../Domain/ArtikelVariante";
import {DonorSeeker} from "../QuestionsDonorSeeker/QuestionsDonorSeeker";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        questionGridContainer: {
            width: "100%",
            position: "relative",
        },
        questionGridItem: {
            width: "100%",
            paddingTop: "100%",
            position: "relative",
        },
    }));

export const ChunkedCardsFromOptions: React.FC<{
    optionsArray: (ArtikelKategorie | Artikel | ArtikelVariante | DonorSeeker)[],
    type: "ArtikelKategorie" | "Artikel" | "Details" | "DonorSeeker",
    chunkSize: OneToTwelve,
    answers: Answers,
    setAnswers: (answers: Answers) => void,
    currentStep: number,
    setCurrentStep: (step: number) => void,
}> = ({children, optionsArray, type, chunkSize, answers, setAnswers, currentStep, setCurrentStep}) => {
    const classes = useStyles();

    // @ts-ignore
    const space: OneToTwelve = Math.floor(12 / chunkSize);
    const chunkedArray = chunkArray(optionsArray, chunkSize);

    return (
        <div>
            {chunkedArray.map(
                (chunk) => {
                    return <Grid key={uuidv4()} container spacing={10} className={classes.questionGridContainer}>
                        {chunk.map((option) => {
                            return <Grid key={option.id} className={classes.questionGridItem} item
                                         xs={space}>
                                {type === "DonorSeeker" ?
                                    <CardButton onClick={() => {
                                        setAnswers({
                                            isDonor: option.isDonor,
                                            category: undefined,
                                            artikel: undefined,
                                            variant: undefined,
                                            details: undefined,
                                        });
                                        setCurrentStep(currentStep + 1)
                                    }}>
                                        <div>
                                            {option.name}
                                        </div>
                                    </CardButton>
                                    : (type === "Artikel" || type === "ArtikelKategorie") ? <CardButton onClick={() => {
                                            if (type === "ArtikelKategorie") {
                                                setAnswers({
                                                    isDonor: answers.isDonor,
                                                    category: option as ArtikelKategorie,
                                                    artikel: undefined,
                                                    variant: undefined,
                                                    details: undefined,
                                                });
                                            } else if (type === "Artikel") {
                                                setAnswers({
                                                    isDonor: answers.isDonor,
                                                    category: answers.category,
                                                    artikel: option as Artikel,
                                                    variant: undefined,
                                                    details: undefined,
                                                });
                                            }
                                            setCurrentStep(currentStep + 1)
                                        }}>
                                            {option.name}
                                        </CardButton>
                                        : <div>
                                            {React.Children.map(children, child => {
                                                if (React.isValidElement(child)) {
                                                    return React.cloneElement(child, {itemVariant: option})
                                                } else {
                                                    return <></>
                                                }
                                            })}
                                        </div>}
                            </Grid>
                        })}
                    </Grid>
                }
            )}
        </div>
    )
}