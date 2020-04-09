import React from "react";
import {Answers, Item} from "../QuestionsStepper/QuestionsStepper";
import {Button, Card, Grid, List, ListItem} from "@material-ui/core";
import {uuidv4} from "../utils/uuid";

export const QuestionsSummary: React.FC<{
    answers: Answers,
    currentStep: number, setCurrentStep: (step: number) => void,
}> =
    ({answers, currentStep, setCurrentStep}) => {
        if (answers.isDonor === undefined) {
            return <Button onClick={() => {
                setCurrentStep(0)
            }}>Neue Anfrage oder Angebot</Button>
        }
        if (answers.category === undefined) {
            return <Button onClick={() => {
                setCurrentStep(1)
            }}>Kategorie auswählen.</Button>
        }
        if (answers.exactType === undefined) {
            return <Button onClick={() => {
                setCurrentStep(0)
            }}>Artikel auswählen.</Button>
        }

        return (
            <Card>
                <div>
                    Sie {answers.isDonor ? "bieten an:" : "sind auf der Suche nach:"}
                </div>
                <div>
                    <div>{answers.category?.categoryName}</div>
                    <List>
                        {answers.exactType.map((item: Item) => {
                            return (
                                <ListItem key={uuidv4()}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={9}>
                                            {item.itemName}
                                        </Grid>
                                        <Grid item xs={3}>
                                            100
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            )
                        })}

                    </List>
                </div>
            </Card>
        )
    };