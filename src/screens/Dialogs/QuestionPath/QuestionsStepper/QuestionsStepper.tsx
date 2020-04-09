import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import {QuestionsDonorSeeker} from "../QuestionsDonorSeeker/QuestionsDonorSeeker";
import {QuestionsCategory} from "../QuestionsCategory/QuestionsCategory";
import {QuestionsItems} from "../QuestionsItems/QuestionsItems";
import {QuestionsProductDetails} from "../QuestionsProductDetails/QuestionsProductDetails";
import {StepButton} from "@material-ui/core";
import {uuidv4} from "../utils/uuid";
import {QuestionsSummary} from "../QuestionsSummary/QuestionsSummary";

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
    validOptions: ValidOptions;
    options: Options;
}

export interface Options {
    bestByDate: Date | undefined;
    isSterile: boolean | undefined;
    isOriginalPackaging: boolean | undefined;
    isMedical: boolean | undefined;
    note: string | undefined;
}

export interface ValidOptions {
    isValidBestByDate: boolean;
    isValidSterile: boolean;
    isValidOriginalPackaging: boolean;
    isValidMedical: boolean;
}

export const QuestionsStepper: React.FC<{}> = () => {
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
                    <div className={classes.instructions}>Hier kommen die Ergebnisse rein</div>
                ) : (
                    <div className={classes.instructions}>{getStepContent(currentStep)}</div>
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
                return (
                    <QuestionsDonorSeeker answers={answers}
                                          setAnswers={setAnswers}
                                          currentStep={currentStep}
                                          setCurrentStep={setCurrentStep}
                    />);
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
                                           currentStep={currentStep}
                                           setCurrentStep={setCurrentStep}
                                           items={answers.category.items}/>;
                } else {
                    return <div>Wähle zuerst eine Kategorie aus.</div>
                }
            case 3:
                return <QuestionsProductDetails answers={answers}
                                                setAnswers={setAnswers}
                                                currentStep={currentStep}
                                                setCurrentStep={setCurrentStep}
                />;
            case 4:
                return <QuestionsSummary answers={answers}
                                         currentStep={currentStep}
                                         setCurrentStep={setCurrentStep}/>;
            default:
                return <div>Hoppla, da ist etwas schief gegangen.</div>;
        }
    }
};

function getStepNames() {
    return ["Anbieter oder Suchender?", "Kategorie", "Artikel", "Anzahl und Produktdetails", "Zusammenfassung"];
}

const sampleCategories: Category[] = [
    {
        categoryName: "mask",
        items: [{
            itemName: "Essener Modell",
            validOptions: {
                isValidBestByDate: true,
                isValidSterile: true,
                isValidOriginalPackaging: true,
                isValidMedical: true,
            },
            options: {
                bestByDate: undefined,
                isSterile: undefined,
                isMedical: undefined,
                isOriginalPackaging: undefined,
                note: undefined,
            }
        }, {
            itemName: "OP Maske",
            validOptions: {
                isValidBestByDate: true,
                isValidSterile: true,
                isValidOriginalPackaging: true,
                isValidMedical: true,
            },
            options: {
                bestByDate: undefined,
                isSterile: undefined,
                isMedical: undefined,
                isOriginalPackaging: undefined,
                note: undefined,
            }
        }]
    },
];
