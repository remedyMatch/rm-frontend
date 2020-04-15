import React, {useState} from "react";
import {Card, Checkbox, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Answers} from "../QuestionsStepper/QuestionsStepper";
import {NavigationDialogue} from "../QuestionsStepper/NavigationDialogue";
import {ArtikelVariante} from "../../../../Domain/ArtikelVariante";

export const QuestionsVariant: React.FC<{
    answers: Answers, setAnswers: (answers: Answers) => void,
    currentStep: number, setCurrentStep: (step: number) => void,
}> =
    ({
         answers, setAnswers,
         currentStep, setCurrentStep,
     }) => {
        const [checked, setChecked] = useState<ArtikelVariante[]>([]);

        if (answers.artikel === undefined) {
            return <div>Kein Artikel ausgewählt.</div>
        }

        if (answers.artikel.varianten === undefined) {
            return <div>Für diesen Artikel gibt es keine Varianten. Gehen Sie zum nächsten Schritt.</div>
        }

        return (
            <NavigationDialogue currentStep={currentStep} setCurrentStep={setCurrentStep}>
                <Card>
                    <List>
                        {answers.artikel.varianten.map((variante) => {
                            return (
                                <ListItem key={variante.id} button onClick={handleClick(variante)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            checked={checked.indexOf(variante) !== -1}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={variante.variante}/>
                                </ListItem>
                            );
                        })}
                    </List>
                </Card>
            </NavigationDialogue>
        );

        function handleClick(variante: ArtikelVariante): () => void {
            return () => {
                let tmpChecked = checked;
                if (checked.indexOf(variante) === -1) {
                    tmpChecked = checked.concat([variante])
                } else {
                    tmpChecked = checked.filter((listItem) => listItem !== variante)
                }
                setChecked(tmpChecked);
                setAnswers({
                    isDonor: answers.isDonor,
                    category: answers.category,
                    artikel: answers.artikel,
                    variant: tmpChecked,
                    details: undefined,
                    location: undefined,
                });
            }
        }
    };

