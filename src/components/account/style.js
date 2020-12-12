import helper from "../../util/helper";
export default (theme) => ({
  login: {
    // width: 300,
    margin: "0 auto",
    textAlign: "center",
    padding: "50px 16px 0",
    "& img": {
      width: 80,
      height: 80,
      borderRadius: 16,
      margin: "0 0 16px",
    },
    "& h1": {
      color: theme.palette.grey[700],
      fontSize: 24,
      lineHeight: "36px",
      margin: "16px 0",
      fontWeight: "bold",
    },
    "& p": {
      color: theme.palette.grey[500],
      fontSize: 16,
    },
    "& .Mui-error": {
      marginLeft: 0,
    },
  },
  login_form: {
    margin: "56px 0 0",
  },
  connect: {
    width: 350,
    margin: "0 auto",
    textAlign: "center",
    padding: "50px 0 0",
    position: "relative",
    minHeight: 550,
    "& img": {
      maxWidth: 80,
      maxHeight: 80,
      margin: "0 0 10px",
    },
    "& p": {
      color: theme.palette.grey[500],
    },
    "& h1": {
      margin: "20px 0 10px",
    },
  },
  connect_btns: {
    margin: "100px 0 0",
    position: "absolute",
    bottom: 10,
  },
  btn_large: {
    padding: "15px 50px",
  },
  button: {
    ...theme.typography.button,
    "&.Mui-disabled": {
      color: theme.palette.common.white,
      background: theme.palette.grey[100],
    },
  },
  sign: {
    width: 350,
    margin: "0 auto",
  },
  network: {
    padding: "4px 0 0",
    "& span": {
      display: "flex",
      padding: "0px 4px",
      alignItems: "center",
      borderRadius: 4,
      background: helper.hex_to_rgba(theme.palette.success.light, 0.3),
    },
    "& svg": {
      color: theme.palette.success.main,
      width: 14,
      height: 14,
      margin: "0 5px 0 0",
    },
  },
  address: {
    padding: 6,
    borderTop: `1px solid ${theme.palette.grey[100]}`,
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    "& em": {
      width: "100%",
      display: "block",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
  },
  acount: {
    padding: 20,
    background: theme.palette.grey[50],
    textAlign: "right",
    "& h1": {
      fontSize: 18,
      margin: "10px 0",
    },
    "& span": {
      fontSize: 12,
    },
  },
  detail: {
    margin: "0 0 10px",
    "& em": {
      color: theme.palette.grey[800],
      fontSize: 16,
    },
    "& strong": {
      fontSize: 20,
      display: "block",
    },
  },
  item: {
    padding: "15px 10px",
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    fontSize: 14,
  },
  item_content: {
    wordBreak: "break-all",
    textAlign: "right",
  },
  login_mnemonic: {
    margin: "50px 0 0",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    display: "block",
    fontSize: 14,
    fontWeight: 500,
    textAlign: "left",
  },
  sign_title: {
    textAlign: "center",
    padding: "16px 10px",
    fontSize: 20,
  },
  back: {
    height: 44,
    // maxWidth: 375,
    margin: "0 auto",
    "& h2": {
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  back2: {
    color: theme.palette.common.white,
  },
  accept: {
    minHeight: "100vh",
  },
  accept_by_type_hbc: {
    background: theme.palette.primary.main,
  },
  accept_by_type_: {
    background: theme.palette.grey[700],
  },
  tip: {
    color: helper.hex_to_rgba(theme.palette.common.white),
    margin: "16px auto 0",
    // maxWidth: 375,
    padding: "0 0 20px",
    lineHeight: "20px",
    fontSize: 12,
    textAlign: "center",
    "& img": {
      height: 16,
      width: 132,
    },
  },
  accept_content: {
    // height: "calc(100vh - 44px)",
    background: theme.palette.primary.main,
    position: "relative",
    color: theme.palette.grey[700],
    padding: 24,
    "& h3": {
      margin: "-42px -24px 42px",
      background: helper.hex_to_rgba(theme.palette.secondary.main, 0.2),
      color: theme.palette.secondary.main,
      fontSize: 14,
      lineHeight: 1.5,
      padding: "4px 48px",
    },
    "& h2": {
      fontSize: 12,
      color: theme.palette.grey[500],
    },
    "& p": {
      color: theme.palette.common.white,
      textAlign: "center",
      fontSize: 12,
      padding: "8px 20px",
      margin: "0 0 24px",
    },
    "& div.paper": {
      padding: "40px 0 0",
      textAlign: "center",
      position: "relative",
      borderRadius: 8,
      // maxWidth: 375,
      margin: "0 auto",
      color: theme.palette.grey[700],
    },
    "& img": {
      width: 240,
      display: "block",
      margin: "0 auto",
    },
    "& img.token_logo": {
      width: 56,
      height: 56,
      border: "2px solid #fff",
      borderRadius: 28,
      position: "absolute",
      left: "50%",
      top: -26,
      margin: "0 0 0 -28px",
    },
    "& img.token_logo_small": {
      width: 22,
      height: 22,
      borderRadius: 11,
      position: "absolute",
      left: "50%",
      top: 6,
      margin: "0 0 0 6px",
    },
    "& strong": {
      fontSize: 12,
      display: "block",
      textAlign: "left",
      margin: "8px 0 10px",
      lineHeight: "20px",
      fontSize: 12,
      fontWeight: 400,
      color: theme.palette.grey[300],
    },
    "& span, & a": {
      display: "flex",
      width: "100%",
      height: 24,
      justifyContent: "center",
      alignItems: "center",
      fontSize: 16,
      color: theme.palette.primary.main,
      cursor: "pointer",
      width: 170,
    },
    "& em": {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
  },
  accept_btn: {
    borderTop: `1px dashed ${theme.palette.grey[100]}`,
    height: 64,
    padding: "20px 0 10px",
  },
  input_root: {
    height: 48,
    background: theme.palette.grey[50],
    borderRadius: 4,
    marginTop: "0 !important",
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
    "& fieldset": {
      borderColor: "transparent",
      borderWidth: "1px !important",
    },
  },
  accept_content_type: {
    //height: "calc(100vh - 44px)",
    background: "none",
    padding: "42px 24px 24px",
  },
  token_item: {
    borderBottom: `1px solid ${theme.palette.grey[50]}`,
    "& div": {
      "&:nth-child(3n+2), &:nth-child(3n)": {},
    },
    height: 78,
    "& img": {
      width: 40,
    },
    "& strong": {
      color: theme.palette.grey[900],
      fontSize: 16,
      lineHeight: "18px",
      fontWeight: 500,
    },
    "& p": {
      color: theme.palette.grey[300],
      fontSize: 12,
      margin: "4px 0 0",
    },
    "& i": {
      display: "inline-block",
      padding: 2,
      margin: "0 0 0 6px",
      lineHeight: "18px",
      fontSize: 12,
      color: theme.palette.grey[500],
      background: helper.hex_to_rgba(theme.palette.grey[200], 0.2),
      fontWeight: 400,
      transform: "scale3d(1,1,0.85)",
      "&.native": {
        background: "rgba(81,211,114,.2)",
        color: theme.palette.success.main,
      },
    },
  },
  avatar: {
    color: theme.palette.common.white,
    background: "#3E3A50",
  },
  token_list: {
    padding: "10px 0 0",
  },
  dialog_token: {
    padding: 16,
    height: "calc(100vh)",
    position: "fixed",
    top: 10,
    left: 0,
    zIndex: 100,
    width: "100%",
    overflow: "auto",
    borderRadius: "8px 8px 0 0",
    transition: "all ease-in-out .3s",
    transform: "translate(0,100%)",
  },
  dialog_token_open: {
    transform: "translate(0,0)",
  },
  dialog_token_title: {
    display: "flex",
    margin: "0 0 16px",
    alignItems: "center",
    "& em": {
      flex: 1,
      textAlign: "center",
      fontSize: 20,
      color: theme.palette.grey[900],
    },
    "& i": {
      cursor: "pointer",
    },
  },
  dialog_token_search: {
    height: 48,
    padding: "11px 0 0 10px",
    background: theme.palette.grey[50],
    "& i": {
      color: theme.palette.grey[500],
    },
    "& .MuiInput-underline:after,& .MuiInput-underline:before": {
      display: "none",
    },
  },
  dialog_token_list_title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "24px 0 12px",
    "& span": {
      color: theme.palette.grey[300],
      fontSize: 14,
    },
    "& i": {
      color: theme.palette.grey[900],
      background: theme.palette.grey[50],
      cursor: "pointer",
    },
  },
});
