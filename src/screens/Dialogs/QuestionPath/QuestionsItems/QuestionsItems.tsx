import React, {useState} from "react";
import {Card, Checkbox, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Answers, Item} from "../QuestionsStepper/QuestionsStepper";
import {NavigationDialogue} from "../QuestionsStepper/NavigationDialogue";

export const QuestionsItems: React.FC<{
    answers: Answers, setAnswers: (answers: Answers) => void,
    currentStep: number, setCurrentStep: (step: number) => void,
    items: Item[]
}> =
    ({
         answers, setAnswers,
         currentStep, setCurrentStep,
         items
     }) => {
        const [checked, setChecked] = useState<Item[]>([]);
        return (
            <NavigationDialogue currentStep={currentStep} setCurrentStep={setCurrentStep}>
                <Card>
                    <List>
                        {items.map((item) => {
                            return (
                                <ListItem key={item.itemName} button onClick={handleClick(item)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            checked={checked.indexOf(item) !== -1}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={item.itemName}/>
                                </ListItem>
                            );
                        })}
                    </List>
                </Card>
            </NavigationDialogue>
        );

        function handleClick(item: Item): () => void {
            return () => {
                let tmpChecked = checked;
                if (checked.indexOf(item) === -1) {
                    tmpChecked = checked.concat([item])
                } else {
                    tmpChecked = checked.filter((listItem) => listItem !== item)
                }
                setChecked(tmpChecked);
                setAnswers({
                    isDonor: answers.isDonor,
                    category: answers.category,
                    exactType: tmpChecked.length ? tmpChecked : undefined,
                    number: answers.number,
                    location: answers.location,
                });
            }
        }
    };
