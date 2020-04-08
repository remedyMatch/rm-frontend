import React, {useState} from "react";
import {Checkbox, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Answers, Item} from "./QuestionStepper";

export const QuestionsItems: React.FC<{ answers: Answers, setAnswers: (answers: Answers) => void, items: Item[] }> =
    ({answers, setAnswers, items}) => {
        const [checked, setChecked] = useState<Item[]>([]);
        return (
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
