import { ClickAwayListener } from "@material-ui/core";

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
  index: {
    "& h1": {
      margin: "50px 0 20px",
      textAlign: "center",
    },
  },
  step2: {
    "& h1": {
      margin: "50px 0 20px",
    },
    "& ul": {
      margin: "0 0 50px",
    },
    "& li": {
      margin: "0 0 10px",
    },
  },
  step3: {
    width: 360,
    "& h1": {
      margin: "50px 0 30px",
    },
  },
  step3_import: {
    width: 360,
    padding: "30px 0 0",
    "& h1": {
      margin: "30px 0 10px",
    },
    "& p": {
      margin: "0 0 20px",
      color: theme.palette.grey[800],
      fontSize: 14,
    },
  },
  back: {
    cursor: "pointer",
  },
  form: {},
  item: {
    minHeight: 80,
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
    maxWidth: 400,
    "& h1": {
      margin: "50px 0 30px",
    },
    "& p": {
      fontSize: 14,
      color: theme.palette.grey[800],
      margin: "0 0 20px",
    },
    "& strong": {
      fontSize: 18,
      lineHeight: 2,
      textAlign: "center",
      display: "block",
      padding: 20,
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
  seed_confirm: {
    padding: "50px 0 0 ",
    "& h1": {
      margin: "20px 0",
    },
  },
  error_msg: {
    color: theme.palette.error.main,
    margin: "20px 0 0",
  },
  seed_options: {
    margin: "0 -8px 20px",
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
    "& h1": {
      fontSize: 30,
      margin: "10px 0 20px",
    },
    "& p": {
      margin: "0 0 10px",
      fontSize: 14,
    },
    "& h4": {
      fontWeight: 500,
      margin: "20px 0",
      fontSize: 16,
    },
    "& li": {
      listStyle: "inside",
      fontSize: 14,
      margin: "0 0 6px",
    },
    "& ul": {
      margin: "0 0 20px",
    },
  },
});
