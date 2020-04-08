import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Button from '@material-ui/core/Button';
import {QuestionsDonorSeeker} from "./QuestionsDonorSeeker";
import {QuestionsCategory} from "./QuestionsCategory";
import {QuestionsItems} from "./QuestionsItems";
import {QuestionsNumbersProductDetails} from "./QuestionsNumbersProductDetails";
import {StepButton} from "@material-ui/core";
import {uuidv4} from "./utils/uuid";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        backButton: {
            marginRight: theme.spacing(1),
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        button: {
            transition: theme.transitions.create("background-color"),
            backgroundColor: "white",
            color: "black",
            margin: "4px 8px",
            "&:hover": {
                backgroundColor: "rgba(255,255,255,0.8)"
            }
        }
    }),
);

export interface Answers {
    isDonor: boolean | undefined;
    category: Category | undefined;
    exactType: Item[] | undefined;
    number: number | undefined;
    location: string | undefined;
}


export interface Category {
    categoryName: "mask" | "disinfectant" | "gloves" | "facemask";
    items: Item[];
}

export interface Item {
    itemName: string;
    validOptions: Options;
}

export interface Options {
    bestByDate: Date | undefined;
    isSterile: boolean | undefined;
    isOriginalPackaging: boolean | undefined;
    isMedical: boolean | undefined;
    note: string | undefined;
}

export const QuestionStepper: React.FC<{}> = () => {
    const classes = useStyles();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const steps = getStepNames();

    const initialAnswers: Answers = {
        isDonor: undefined,
        category: undefined,
        exactType: undefined,
        number: undefined,
        location: undefined,
    };
    const [answers, setAnswers] = useState<Answers>(initialAnswers);



    return (
        <div className={classes.root}>
            <Stepper activeStep={currentStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={uuidv4()}>
                        <StepButton onClick={handleGoToStep(index)}>{label}</StepButton>
                    </Step>
                ))}
            </Stepper>
            <div>
                {currentStep === steps.length ? (
                    <div>
                        <div className={classes.instructions}>Hier kommen die Ergebnisse rein</div>
                        <Button onClick={handleReset}>Weitere Artikel suchen/ anbieten</Button>
                    </div>
                ) : (
                    <div>
                        <div className={classes.instructions}>{getStepContent(currentStep)}</div>
                        <div>
                            <Button
                                disabled={currentStep === 0}
                                onClick={handleBack}
                                className={classes.button}
                            >
                                Back
                            </Button>
                            <Button className={classes.button} onClick={handleNext}>
                                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    function handleNext() {
        setCurrentStep(currentStep + 1);
    }

    function handleBack() {
        setCurrentStep(currentStep - 1);
    }

    function handleReset() {
        setCurrentStep(0);
    }

    function handleGoToStep(step: number): () => void {
        return () => {
            setCurrentStep(step)
        }
    }

    function getStepContent(stepIndex: number) {
        switch (stepIndex) {
            case 0:
                return <QuestionsDonorSeeker answers={answers}
                                             setAnswers={setAnswers}
                                             currentStep={currentStep}
                                             setCurrentStep={setCurrentStep}
                />;
            case 1:
                return <QuestionsCategory answers={answers}
                                          setAnswers={setAnswers}
                                          currentStep={currentStep}
                                          setCurrentStep={setCurrentStep}
                                          categories={sampleCategories}
                />;
            case 2:
                if (answers.category !== undefined) {
                    return <QuestionsItems answers={answers}
                                           setAnswers={setAnswers}
                                           items={answers.category.items}/>;
                } else {
                    return <div>Wähle zuerst eine Kategorie aus.</div>
                }
            case 3:
                return <QuestionsNumbersProductDetails answers={answers} setAnswers={setAnswers}/>;
            default:
                return 'Unknown stepIndex';
        }
    }
};

function getStepNames() {
    return ["Anbieter oder Suchender?", "Kategorie", "Artikel", "Anzahl und Produktdetails"];
}

const sampleCategories: Category[] = [
    {
        categoryName: "mask",
        items: [{
            itemName: "Essener Modell",
            validOptions: {
                bestByDate: undefined,
                isSterile: undefined,
                isOriginalPackaging: undefined,
                isMedical: undefined,
                note: undefined,
            }
        }, {
            itemName: "OP Maske", validOptions: {
                bestByDate: undefined,
                isSterile: undefined,
                isOriginalPackaging: undefined,
                isMedical: undefined,
                note: undefined,
            }
        }]
    },
];
