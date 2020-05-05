import {makeStyles, Theme} from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import Stepper from "../Stepper/Stepper";
import FlowPage from "./FlowPage";

export interface FinishedFlowPageDescription {
    content: React.ReactNode;
    title: string;
    subtitle?: string;
    icon?: string;
    iconAlt?: string;
    action?: string;
    onActionClicked?: () => void;
    contentClass?: string;
}

export interface FlowPageDescription extends FinishedFlowPageDescription {
    flowPageName: string;
    disabled?: boolean;
}

interface Props {
    finishedPage: FinishedFlowPageDescription;
    pages: FlowPageDescription[];
    currentPage: number;
    onPreviousStepClicked: (index: number) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    stepper: {
        marginTop: "6em",
        marginBottom: "6em",
        transition: theme.transitions.create("margin", {
            duration: 1000
        })
    },
    stepperFinished: {
        marginTop: "1em",
        marginBottom: "4em"
    },
    stepContentContainer: {
        display: "grid"
    },
    stepContent: {
        gridRow: 1,
        gridColumn: 1
    }
}));

const Flow: React.FC<Props> = props => {
    const classes = useStyles();

    const finished = props.currentPage >= props.pages.length;

    return (
        <>
            <Stepper
                className={clsx(classes.stepper, finished && classes.stepperFinished)}
                steps={props.pages.map(page => ({
                    title: page.flowPageName,
                    disabled: page.disabled
                }))}
                currentStep={props.currentPage}
                finished={finished}
                onPreviousStepClicked={props.onPreviousStepClicked}/>

            <div className={classes.stepContentContainer}>

                {props.pages.map((page, index) => (
                    <FlowPage
                        active={props.currentPage === index}
                        className={classes.stepContent}
                        icon={page.icon}
                        iconAlt={page.iconAlt}
                        title={page.title}
                        subtitle={page.subtitle}
                        action={page.action}
                        onActionClicked={page.onActionClicked}
                        contentClass={page.contentClass}>
                        {page.content}
                    </FlowPage>
                ))}

                <FlowPage
                    active={finished}
                    className={classes.stepContent}
                    icon={props.finishedPage.icon}
                    iconAlt={props.finishedPage.iconAlt}
                    title={props.finishedPage.title}
                    subtitle={props.finishedPage.subtitle}
                    action={props.finishedPage.action}
                    onActionClicked={props.finishedPage.onActionClicked}
                    contentClass={props.finishedPage.contentClass}>
                    {props.finishedPage.content}
                </FlowPage>

            </div>
        </>
    )
};

export default Flow;