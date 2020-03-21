import { ClassNameMap, Styles } from "@material-ui/core/styles/withStyles";
import { ClassKeyOfStyles } from "@material-ui/styles/withStyles";
import { Theme } from "@material-ui/core";

export type WithStylesPublic<
  StylesOrClassKey extends string | Styles<any, any, any> = string,
  IncludeTheme extends boolean | undefined = false
> = (IncludeTheme extends true ? { theme: Theme } : {}) & {
  classes?: ClassNameMap<ClassKeyOfStyles<StylesOrClassKey>>;
};