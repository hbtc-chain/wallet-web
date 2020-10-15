import util from "../../util/util";
export default (theme) => ({
  indexpaper: {
    //height: "calc(100vh - 75px)",
  },
  address_title: {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    margin: "0 0 20px",
    position: "relative",
  },
  address: {
    maxWidth: 200,
    margin: "0px auto",
    textAlign: "center",
    borderRadius: 4,
    padding: 10,
    "&:hover": {
      background: theme.palette.grey[100],
    },
    "& strong": {
      fontSize: 14,
      display: "block",
      whiteSpace: "nowrap",
    },
    "& em": {},
  },
  listItem: {
    minHeight: 90,
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    "& img": {
      width: 32,
      margin: "0 10px 0 0",
    },
    "& strong": {
      display: "block",
    },
    "& em": {
      color: theme.palette.grey[500],
    },
  },
  token: {
    textAlign: "center",
    padding: "30px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    "& img": {
      width: 50,
      margin: "0 0 20px",
    },
    "& strong": {
      fontSize: 30,
      fontWeight: 400,
    },
    "& em": {
      fontSize: 14,
      color: theme.palette.grey[800],
      margin: "0 0 30px",
    },
  },
  nodata: {
    textAlign: "center",
    color: theme.palette.grey[500],
    padding: "20px 0",
    width: "100%",
  },
  btn_large: {
    padding: "12px 30px",
  },
  closebtn: {
    position: "absolute",
    right: 5,
    top: 5,
  },
  sites: {
    width: 240,
    "& em": {
      color: theme.palette.grey[500],
      padding: "20px 0",
    },
    "& p": {
      maxWidth: 260,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
  },
  site_item: {
    padding: "10px 0",
  },
  private_key_tip: {
    color: theme.palette.error.main,
    padding: 10,
    background: theme.palette.grey[100],
  },
  private_key: {
    fontSize: 14,
    wordBreak: "break-all",
    padding: 10,
    background: theme.palette.grey[100],
  },
  mask: {
    width: "100vw",
    height: "100vh",
    position: "absolute",
    zIndex: 100,
    left: 0,
    top: 0,
    background: "rgba(255,255,255,.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& i": {
      fontSize: 30,
    },
  },
  grey: {
    color: theme.palette.grey[500],
  },
  external_address: {
    height: 600,
    maxWidth: 360,
    padding: "0 10px 20px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
  },
  chain: {
    width: 336,
    margin: "0 auto",
    position: "relative",
  },
  avatar: {
    color: theme.palette.common.white,
    background: "#3E3A50",
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
      fontSize: 18,
      lineHeight: "18px",
      fontWeight: 500,
    },
    "& p": {
      color: theme.palette.grey[300],
      fontSize: 12,
    },
    "& i": {
      display: "inline-block",
      padding: 2,
      fontSize: 14,
      margin: "0 0 0 6px",
      lineheight: "18px",
      background: theme.palette.grey[200],
      color: theme.palette.grey[500],
      "&.native": {
        background: "rgba(81,211,114,.2)",
        color: theme.palette.success.main,
      },
    },
  },
  chain_address: {
    padding: "14px 0 6px",
    margin: "0 16px",
    color: theme.palette.grey[500],
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    fontSize: 14,
    "& span": {
      color: util.hex_to_rgba(theme.palette.grey[700], 0.5),
    },
    "& i": {},
    "& em": {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
    "& p": {
      lineHeight: "24px",
    },
  },
  chain_symbol: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: 4,
    padding: "0 16px 10px",
    "& h2": {
      height: 32,
      lineHeight: "32px",
      fontSize: 20,
      padding: "8px 0 8px",
      margin: "0 0 10px",
    },
    "& svg": {
      width: 20,
    },
  },
  symbol: {
    width: 336,
    margin: "0 auto",
    position: "relative",
  },
  back: {
    height: 44,
    margin: "0 0 12px",
    "& h2": {
      fontSize: 16,
    },
  },
  external_content: {
    margin: "20px 0 0",
    flex: 1,
  },
  external_label: {
    display: "block",
    margin: "20px 0 10px",
  },
  form: {
    padding: "0 0 30px 0",
  },
  form_label: {
    fontSize: 14,
    color: theme.palette.grey[700],
    lineheight: "20px",
    margin: "0 0 4px",
  },
  form_input: {
    height: 80,
  },
  outline: {
    color: theme.palette.grey[500],
    border: 0,
    padding: 0,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.grey[50],
    },
    "& .MuiOutlinedInput-adornedEnd": {
      padding: "0 10px 0 0",
    },
    "& .MuiOutlinedInput-root": {
      background: theme.palette.grey[50],
    },
  },
  outline_input: {
    padding: "16px 0 16px 16px",
  },
  outline_outline: {
    borderColor: theme.palette.grey[50],
  },
  btn_all: {
    textAlign: "right",
    color: theme.palette.primary.main,
    minWidth: 60,
    cursor: "pointer",
  },
  submit: {
    height: 48,
    position: "fixed",
    bottom: 10,
    width: 336,
  },
  drawer: {
    position: "relative",
    padding: "70px 24px 32px",
    "& h2": {
      fontSize: 20,
      color: theme.palette.grey[900],
      textAlign: "center",
    },
    "& img": {
      width: 260,
      display: "block",
      margin: "0 auto 10px",
    },
    "& p": {
      textAlign: "center",
      color: theme.palette.grey[500],
      margin: "0 0 30px",
    },
  },
  icon_close: {
    position: "absolute",
    right: 10,
    top: 10,
    cursor: "pointer",
  },
  drawer_paper: {
    overflowY: "initial",
  },
  drawer_title: {
    background: theme.palette.common.white,
    width: 84,
    height: 84,
    borderRadius: 42,
    padding: 6,
    position: "absolute",
    left: "50%",
    top: "-30px",
    margin: "0 0 0 -42px",
    "& img": {
      width: 72,
      borderRadius: 36,
    },
    "& div": {
      width: 72,
      height: 72,
      borderRadius: 36,
      background: "#3E3A50",
      fontSize: 44,
      textAlign: "center",
      lineHeight: "72px",
    },
  },
});
