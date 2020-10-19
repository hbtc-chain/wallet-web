import { ClickAwayListener } from "@material-ui/core";
import helper from "../../util/helper";
export default (theme) => ({
  paper: {
    margin: "50px 0 0",
    width: 340,
    padding: 20,
    textAlign: "center",
    "& h2": {
      margin: "20px 0",
    },
    "& p": {
      margin: "20px 0",
      color: theme.palette.grey[500],
    },
  },
  nav: {
    height: 42,
    margin: "0 0 18px",
    fontSize: 16,
    lineHeight: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.grey[900],
    position: "relative",
    fontWeight: 500,
    padding: "0 16px",
    "& svg": {
      position: "absolute",
      left: 16,
    },
  },
  logo: {
    width: 80,
    // height: 80,
    borderRadius: 16,
    margin: "34px auto 16px",
    display: "block",
  },
  button: {
    ...theme.typography.button,
    "&.Mui-disabled": {
      color: theme.palette.common.white,
      background: theme.palette.grey[100],
    },
  },
  tit: {
    fontSize: 26,
    fontWeight: 500,
    lineHeight: "38px",
    color: theme.palette.grey[900],
    margin: "0 0 8px",
    textAlign: "left",
  },
  desc: {
    fontSize: 14,
    lineHeight: "22px",
    color: theme.palette.grey[700],
    textAlign: "left",
    margin: "0 0 16px",
  },
  index: {
    padding: "0 16px 8px",
    margin: "0 auto",
    textAlign: "center",
    "& h1": {
      margin: "16px 0 190px",
      textAlign: "center",
      fontSize: 24,
      lineHeight: "36px",
      fontWeight: "bold",
      color: theme.palette.grey[700],
    },
    "& button": {
      marginBottom: 24,
    },
  },
  grey300: {
    color: theme.palette.grey[300],
  },
  lang: {
    ...theme.typography.body1,
    display: "flex",
    height: 72,
    padding: "24px 18px 24px 0",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  step2: {
    margin: "0 auto",
    textAlign: "center",
    color: theme.palette.grey[900],
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh)",
  },
  step2_con_bg: {
    flex: 1,
    overflow: "hidden",
  },
  step2_con: {
    height: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    padding: "0 16px 8px",
    "& h1": {
      fontSize: 20,
      lineHeight: "29px",
      margin: "24px 0 0",
      minHeight: 32,
    },
    "& p": {
      fontSize: 12,
      LineHeight: "17px",
      minHeight: 24,
      color: theme.palette.grey[500],
    },
    "& ul": {
      margin: "16px 0",
      textAlign: "left",
      fontSize: 12,
      lineHeight: "19px",
    },
    "& li": {
      margin: "0 0 10px",
    },
  },
  footer: {
    padding: "16px 16px 24px",
    background: theme.palette.common.white,
    boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.12)",
    zIndex: 10,
    "& button": {
      marginTop: 8,
    },
    "& label": {
      marginBottom: 8,
      fontSize: 12,
      lineHeight: "17px",
      color: theme.palette.grey[700],
    },
    "& .MuiRadio-root": {
      padding: 1,
      color: `${helper.hex_to_rgba(theme.palette.primary.main, 0.3)}`,
      minHeight: 24,
    },
  },
  step3: {
    // width: 360,
    margin: "0 auto",
    textAlign: "center",
    padding: "0 16px 8px",
    "& button": {
      margin: "16px 0 0",
    },
  },
  step3_import: {
    // width: 360,
    padding: "0 16px 8px",
    margin: "0 auto",
    "& h2": {
      fontSize: 20,
      lineHeight: "24px",
      fontWeight: 500,
      color: theme.palette.grey[900],
    },
    // "& p": {
    //   margin: "0 0 20px",
    //   color: theme.palette.grey[800],
    //   fontSize: 14,
    // },
  },
  import_list: {
    margin: "24px 0",
    "& li": {
      border: `2px solid ${theme.palette.primary.main}`,
      borderRadius: 6,
      marginBottom: 16,
      "& .MuiListItem-root": {
        padding: "16px 48px 16px 16px",
      },
      "& .MuiAvatar-root": {
        width: 56,
        height: 56,
        background: "rgba(51, 117, 224, 0.08)",
        borderRadius: 6,
        marginRight: 16,
        color: theme.palette.primary.main,
        "& svg, & i": {
          fontSize: 26,
          color: theme.palette.primary.main,
        },
      },
      "& .MuiListItemText-root": {
        fontWeight: 500,
        margin: 0,
        "& span": {
          fontSize: 16,
          lineHeight: "24px",
          color: theme.palette.grey[900],
        },
        "& p": {
          fontSize: 12,
          lineHeight: "17px",
          minHeight: 24,
          display: "flex",
          alignItems: "center",
          color: theme.palette.grey[300],
        },
      },
      "& svg": {
        fontSize: 28,
        color: theme.palette.grey[200],
      },
    },
  },
  back: {
    cursor: "pointer",
  },
  form: {
    margin: "0 0 8px",
  },
  item: {
    minHeight: 80,
    textAlign: "left",
    "& .tip": {
      margin: "6px 0",
    },
    "& p": {
      color: theme.palette.grey[500],
      fontSize: 14,
      lineHeight: "20px",
    },
  },
  input_root: {
    height: 48,
    background: theme.palette.grey[50],
    borderRadius: 4,
    "&::before, &::after": {
      display: "none",
    },
    "& input": {
      height: 24,
      padding: "12px 10px",
      color: theme.palette.grey[900],
      fontSize: 20,
      "&::placeholder": {
        opacity: 1,
        color: theme.palette.grey[500],
        fontSize: 14,
      },
    },
    "& svg": {
      margin: "0 10px 0 0",
      fontSize: 16,
    },
  },
  right: {
    color: `${theme.palette.primary.main} !important`,
  },
  error: {
    color: `${theme.palette.error.main} !important`,
  },
  Checkbox: {
    padding: 0,
  },
  checkform: {
    padding: "20px 0 30px",
    color: theme.palette.grey[800],
  },
  checkform2: {
    padding: "0px 0 30px",
    color: theme.palette.grey[800],
  },
  seed: {
    // maxWidth: 400,
    padding: "0 16px 8px",
    margin: "0 auto",
    "& strong": {
      fontSize: 18,
      lineHeight: 2,
      textAlign: "center",
      display: "block",
      padding: 20,
    },
    "& button": {
      margin: "32px 0 0",
    },
  },
  seed_item: {
    height: 56,
    width: "100%",
    background: theme.palette.grey[50],
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    color: theme.palette.grey[900],
    position: "relative",
    "& em": {
      position: "absolute",
      top: 8,
      left: 8,
      color: theme.palette.grey[500],
      fontSize: 12,
      transform: "scale(0.83)",
    },
    "& p": {
      padding: 14,
      width: "100%",
      margin: 0,
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  seed_select: {
    borderRadius: 6,
    overflow: "hidden",
    margin: "0 0 16px",
    border: `1px solid ${theme.palette.grey[100]}`,
  },
  seed_input: {
    borderRight: `1px solid ${theme.palette.grey[100]}`,
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    height: 48,
    background: theme.palette.common.white,
    "& >div": {
      width: "100%",
      height: "100%",
    },
    "&:nth-of-type(3n)": {
      borderRight: 0,
    },
    "&:nth-of-type(12n+10), &:nth-of-type(12n+11), &:nth-of-type(12n)": {
      borderBottom: 0,
    },
    "& em": {
      top: 6,
    },
    "& p": {
      padding: "10px 14px",
    },
    "& svg": {
      display: "none",
      position: "absolute",
      right: 5,
      top: 6,
      color: theme.palette.grey[500],
      cursor: "pointer",
    },
    "&:hover": {
      "& svg": { display: "block" },
    },
    "&.error": {
      "& p": {
        color: theme.palette.error.main,
      },
      "& svg": {
        display: "block",
        color: theme.palette.error.main,
      },
    },
  },
  blur: {
    filter: "blur(5px)",
  },
  seed_word: {
    margin: "20px 0",
    minHeight: 114,
    position: "relative",
    "& div": {
      width: "100%",
      height: "100%",
      position: "absolute",
      left: 0,
      top: 0,
      background: "rgba(0,0,0,.6)",
      color: theme.palette.common.white,
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      cursor: "pointer",
    },
  },
  // seed_confirm: {
  //   padding: "50px 0 0 ",
  //   "& h1": {
  //     margin: "20px 0",
  //   },
  // },
  error_msg: {
    color: theme.palette.error.main,
    margin: "20px 0 0",
  },
  seed_options: {
    height: 48,
    cursor: "pointer",
    "&.disabled p": {
      color: theme.palette.grey[300],
    },
  },
  btn_seed: {
    textTransform: "lowercase",
  },
  btn_large: {
    padding: "12px 70px",
  },
  emoji: {
    fontSize: 80,
    margin: "20px 0 0",
  },
  step_done: {
    padding: "0 16px 8px",
    margin: "26px auto 0",
    textAlign: "center",
    color: theme.palette.grey[900],
    "& img": {
      margin: "0 0 16px",
      width: 72,
    },
    "& h2": {
      fontWeight: 500,
      margin: "16px 0 35px",
      fontSize: 16,
      lineHeight: "23px",
    },
  },
  tip: {
    padding: 16,
    margin: "35px 0",
    border: `1px solid ${theme.palette.grey[100]}`,
    boxSizing: "border-box",
    borderRadius: 6,
    textAlign: "left",
    "& h4": {
      fontSize: 14,
      lineHeight: "20px",
      marginBottom: 10,
    },
    "& li": {
      fontSize: 14,
      lineHeight: "20px",
      color: theme.palette.grey[500],
    },
  },
  seed_import: {
    padding: "0 16px 8px",
    margin: "0 auto",
  },
  textarea: {
    minHeight: 140,
    "& .MuiFormHelperText-contained": {
      fontSize: 14,
      lineHeight: "16px",
      margin: "8px 0 0",
    },
    "& .MuiInputBase-root": {
      background: theme.palette.grey[50],
      padding: "14px 16px",
      "& fieldset": {
        borderColor: theme.palette.grey[50],
        borderWidth: "1px !important",
      },
    },
    "& textarea": {
      color: theme.palette.grey[900],
      "&::placeholder": {
        color: theme.palette.grey[500],
        opacity: 1,
      },
    },
  },
  input: {
    height: 48,
    background: theme.palette.grey[50],
    borderRadius: 4,
    "& ::before, & ::after": {
      display: "none",
    },
    "& input": {
      height: 24,
      padding: "12px 16px",
      color: theme.palette.grey[900],
      fontSize: 14,
      "&::placeholder": {
        opacity: 1,
        color: theme.palette.grey[500],
      },
    },
    "& .MuiFormHelperText-root": {
      margin: "8px 0 0",
      fontSize: 14,
      lineHeight: "16px",
    },
    "& fieldset": {
      borderColor: "transparent",
      borderWidth: "1px !important",
    },
  },
  account_select: {
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh)",
  },
  account_con_bg: {
    flex: 1,
    overflow: "hidden",
  },
  account_con: {
    height: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    padding: "0 16px 8px",
    "& ul": {
      padding: 0,
    },
  },
  account_list: {
    "& li": {
      padding: 16,
      borderRadius: 4,
      background: theme.palette.grey[50],
      overflow: "hidden",
      margin: "0 0 16px",
      "& .MuiListItemAvatar-root": {
        minWidth: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        right: 8,
      },
      "& .MuiListItemText-root": {
        fontWeight: 500,
        margin: 0,
        "& span": {
          fontSize: 16,
          lineHeight: "24px",
          color: theme.palette.grey[900],
        },
        "& p": {
          fontSize: 14,
          lineHeight: "16px",
          margin: "8px 0 0",
          display: "flex",
          alignItems: "center",
          color: theme.palette.grey[500],
          overflow: "hidden",
        },
      },
      "& em": {
        display: "flex",
        width: 16,
        height: 16,
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${helper.hex_to_rgba(
          theme.palette.primary.main,
          0.3
        )}`,
        borderRadius: "100%",
        overflow: "hidden",
        cursor: "pointer",
      },
      "& svg": {
        display: "none",
        color: theme.palette.primary.main,
        marginLeft: -1,
        fontSize: 18,
      },
      "&.select": {
        "& em": {
          display: "none",
        },
        "& svg": {
          display: "block",
        },
      },
    },
  },
  set_account: {
    "& label": {
      display: "block",
      margin: "8px 0",
      fontSize: 14,
      lineHeight: "22px",
      color: theme.palette.grey[700],
      textAlign: "left",
    },
    "& button": {
      marginTop: 0,
    },
  },
});
