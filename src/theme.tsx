import {blueGrey, grey, indigo} from "@material-ui/core/colors";
import {createMuiTheme, responsiveFontSizes, Theme} from "@material-ui/core/styles";
import {PaletteType} from "@material-ui/core";

const lightTheme = responsiveFontSizes(
    createMuiTheme({
        palette: {
            primary: { main: blueGrey[50] },
            secondary: { main: indigo[500] },
            type: "light"
        }
    })
);
const darkTheme = responsiveFontSizes(
    createMuiTheme({
        palette: {
            primary: { main: blueGrey[700] },
            secondary: { main: grey[200] },
            type: "dark"
        }
    })
);

const themes: { [key in PaletteType]: Theme } = {
    light: lightTheme,
    dark: darkTheme
};

export default themes;
