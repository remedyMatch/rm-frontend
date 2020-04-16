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
import {useSelector} from "react-redux";
import {getBedarfe} from "../../../../State/Selectors/BedarfeSelector";
import {getAngebote} from "../../../../State/Selectors/AngeboteSelector";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        questionGrid: {
            height: 500,
            paddingTop: "100%",
            position: "relative",
        },
    }));

export const ChunkedCardsFromOptions: React.FC<{
    optionsArray: (ArtikelKategorie | Artikel | ArtikelVariante)[],
    type: "ArtikelKategorie" | "Artikel" | "Details",
    chunkSize: OneToTwelve,
    answers: Answers,
    setAnswers: (answers: Answers) => void,
    currentStep: number,
    setCurrentStep: (step: number) => void,
}> = ({children, optionsArray, type, chunkSize, answers, setAnswers, currentStep, setCurrentStep}) => {
    const classes = useStyles();
    const bedarfe = useSelector(getBedarfe);
    const angebote = useSelector(getAngebote);
    console.log(bedarfe)
    console.log(angebote)

    // @ts-ignore
    const space: OneToTwelve = Math.floor(12 / chunkSize);
    const chunkedArray = chunkArray(optionsArray, chunkSize);

    return (
        <div>
            {chunkedArray.map(
                (chunk) => {
                    return <Grid key={uuidv4()} container spacing={3}>
                        {chunk.map((option) => {
                            return <Grid key={uuidv4()} className={classes.questionGrid} item
                                         xs={space}>
                                {(type === "Artikel" || type === "ArtikelKategorie") ? <CardButton onClick={() => {
                                        if (type === "ArtikelKategorie") {
                                            setAnswers({
                                                isDonor: answers.isDonor,
                                                category: option as ArtikelKategorie,
                                                artikel: undefined,
                                                variant: undefined,
                                                details: undefined,
                                                location: undefined,
                                            });
                                        } else if (type === "Artikel") {
                                            setAnswers({
                                                isDonor: answers.isDonor,
                                                category: answers.category,
                                                artikel: option as Artikel,
                                                variant: undefined,
                                                details: undefined,
                                                location: undefined,
                                            });
                                        }
                                        setCurrentStep(currentStep + 1)
                                    }}>
                                        {option.name}
                                    </CardButton>
                                    : <div>
                                        {React.Children.map(children, child => {
                                            console.log(children)
                                            if (React.isValidElement(child)) {
                                                return React.cloneElement(child, {itemVariant: option})
                                            } else {
                                                console.log("Not a valid child!")
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