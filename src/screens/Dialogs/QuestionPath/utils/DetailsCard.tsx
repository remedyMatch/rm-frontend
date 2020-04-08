import React, {useState} from "react";
import {uuidv4} from "./uuid";
import {Card, Grid, Input} from "@material-ui/core";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {Item} from "../QuestionStepper";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {OneToTwelve} from "../QuestionsNumbersProductDetails";
import {FormCheckbox} from "../../../../components/Form/FormCheckbox";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        questionGrid: {
            height: 500,
            paddingTop: "100%",
            position: "relative",
        },
        questionCard: {
            position: "relative",
            height: "100%",
            width: "100%",
        },
    }));
export const DetailsCard: React.FC<{ item: Item, space: OneToTwelve }> = ({item, space}) => {
    const classes = useStyles();

    const [checkedSize, setCheckedSize] = useState<string[]>([]);
    const sizes = ["S", "M", "L", "XL", "UNI"];

    const [bestByDate, setBestByDate] = useState<Date | null>(null);

    const [isSterile, setIsSterile] = useState<boolean>(false);
    const [isOriginalPackaging, setIsOriginalPackaging] = useState<boolean>(false);
    const [isMedical, setIsMedical] = useState<boolean>(false);


    return (
        <Grid key={uuidv4()} className={classes.questionGrid} item
              xs={space}>
            <Card className={classes.questionCard}>
                <div>
                    {item.itemName}
                </div>
                <ToggleButtonGroup color="primary"
                                   aria-label="outlined primary button group">
                    {sizes.map((size) => {
                        return (
                            <ToggleButton
                                key={uuidv4()}
                                value={size}
                                onClick={handleClick(size)}
                                selected={checkedSize.indexOf(size) !== -1}
                            >
                                {size}
                            </ToggleButton>
                        )
                    })}
                </ToggleButtonGroup>

                <div>
                    <div>
                        Anzahl
                    </div>
                    {checkedSize.map((size: string) => <div key={uuidv4()}>
                        Anzahl für Größe {size}:
                        <Input type={"number"}/>
                    </div>)}
                </div>
                <div>
                    <div>
                        Mindeshaltbarkeitsdatum
                    </div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            variant="inline"
                            format="dd/MM/yyyy"
                            label="Midesthaltbarkeitsdatum"
                            value={bestByDate}
                            onChange={handleDateChange}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <FormCheckbox checked={isSterile} onChange={() => {
                    setIsSterile(!isSterile)
                }} label={"Steril"}/>
                <FormCheckbox checked={isMedical} onChange={() => {
                    setIsMedical(!isMedical)
                }}
                              label={"Medizinischer Artikel"}/>
                <FormCheckbox checked={isOriginalPackaging} onChange={() => {
                    setIsOriginalPackaging(!isOriginalPackaging)
                }}
                              label={"Originalverpackt"}/>
            </Card>
        </Grid>
    );

    function handleClick(size: string): () => void {
        return () => {
            let tmpChecked: string[];
            if (checkedSize.indexOf(size) === -1) {
                tmpChecked = checkedSize.concat([size])
            } else {
                tmpChecked = checkedSize.filter((listItem) => listItem !== size)
            }
            tmpChecked = sizes.filter((size: string) => tmpChecked.indexOf(size) !== -1);
            setCheckedSize(tmpChecked);
        }
    }

    function handleDateChange(date: Date | null) {
        setBestByDate(date)
    }
};
