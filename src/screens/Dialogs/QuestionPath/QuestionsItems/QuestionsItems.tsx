import React, {useEffect, useState} from "react";
import {Card, Checkbox, CircularProgress, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Answers} from "../QuestionsStepper/QuestionsStepper";
import {NavigationDialogue} from "../QuestionsStepper/NavigationDialogue";
import {useDispatch, useSelector} from "react-redux";
import {getArtikel} from "../../../../State/Selectors/ArtikelSelector";
import {loadArtikel} from "../../../../State/ArtikelState";
import {Artikel} from "../../../../Domain/Artikel";

export const QuestionsItems: React.FC<{
    answers: Answers, setAnswers: (answers: Answers) => void,
    currentStep: number, setCurrentStep: (step: number) => void,
}> =
    ({
         answers, setAnswers,
         currentStep, setCurrentStep,
     }) => {
        const [checked, setChecked] = useState<Artikel[]>([]);
        const dispatch = useDispatch();
        const items = useSelector(getArtikel)?.filter((item) => {
            console.log(item.artikelKategorieId)
            console.log(answers.category?.id)
            return item.artikelKategorieId === answers.category?.id
        }) || undefined

        useEffect(() => {
            dispatch(loadArtikel())
        }, [dispatch])

        if (items === undefined) {
            return <CircularProgress/>
        }

        return (
            <NavigationDialogue currentStep={currentStep} setCurrentStep={setCurrentStep}>
                <Card>
                    <List>
                        {items.map((item) => {
                            return (
                                <ListItem key={item.id} button onClick={handleClick(item)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            checked={checked.indexOf(item) !== -1}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={item.name}/>
                                </ListItem>
                            );
                        })}
                    </List>
                </Card>
            </NavigationDialogue>
        );

        function handleClick(item: Artikel): () => void {
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
