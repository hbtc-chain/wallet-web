import helper from "../../util/helper";
export default (theme) => ({
  nav: {
    height: 44,
    margin: "0 0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.grey[900],
    position: "relative",
    padding: "0 16px",
    "& h2": {
      fontSize: 16,
      lineHeight: "24px",
      fontWeight: 500,
    },
    "& svg": {
      position: "absolute",
      left: 16,
      top: 11,
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
  button: {
    ...theme.typography.button,
    "&.MuiButton-contained": {
      color: theme.palette.common.white,
    },
    "&.Mui-disabled": {
      color: theme.palette.common.white,
      background: theme.palette.grey[100],
    },
  },
  dialog: {
    "& .MuiDialogTitle-root": {
      padding: 16,
      textAlign: "center",
      fontSize: 20,
      lineHeight: "29px",
      fontWeight: 500,
      color: theme.palette.grey[900],
    },
    "& .MuiDialogContent-root": {
      padding: "8px 20px 0",
      minHeight: 80,
    },
    "& .MuiFormHelperText-root": {
      marginLeft: 0,
    },
    "& .MuiInputBase-root": {
      color: theme.palette.grey[500],
      background: theme.palette.grey[50],
    },
    "& fieldset": {
      borderColor: "transparent",
    },
    "& input": {
      padding: "12px 6px",
      height: 24,
      color: theme.palette.grey[900],
    },
    "& .MuiDialogActions-root": {
      "& button": {
        height: 40,
        lineHeight: "40px",
        color: theme.palette.common.white,
      },
    },
  },
  export_list: {
    "& ul": {
      padding: 0,
      marginTop: 16,
      "& li": {
        color: theme.palette.grey[900],
        fontSize: 14,
        cursor: "pointer",
        "& .MuiListItem-root": {
          padding: "14px 16px",
        },
        "& .MuiSvgIcon-root": {
          fontSize: 24,
          color: theme.palette.grey[200],
        },
      },
    },
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
      fontSize: 14,
    },
  },
  whole: {
    height: 48,
    width: "100%",
    background: theme.palette.grey[50],
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    padding: "16px 0",
    textAlign: "center",
    color: theme.palette.primary.main,
    fontSize: 16,
    lineHeight: "24px",
    margin: "0 0 32px",
    fontWeight: 500,
    "& hr": {
      background: helper.hex_to_rgba(theme.palette.primary.main, 0.3),
    },
  },
  half: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& i": {
      marginRight: 6,
    },
  },
  export: {
    padding: "0 16px 8px",
  },
  con: {
    minHeight: 96,
    width: "100%",
    padding: 16,
    color: theme.palette.grey[900],
    fontSize: 14,
    lineHeight: "24px",
    background: theme.palette.grey[50],
    borderRadius: 4,
    wordBreak: "break-all",
  },
});
