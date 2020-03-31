import {createMuiTheme, responsiveFontSizes} from "@material-ui/core/styles";

const defaultTheme = responsiveFontSizes(
    createMuiTheme({
        palette: {
            primary: {
                main: "#09425A",
                light: "#3F6D87",
                dark: "#001C31"
            },
            secondary: {
                main: "#0099BA",
                light: "#5ACAEC",
                dark: "#006B8A"
            },
            type: "light"
        }
    })
);

export default defaultTheme;
