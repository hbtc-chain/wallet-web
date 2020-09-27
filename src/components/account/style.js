import helper from "../../util/helper";
export default (theme) => ({
  login: {
    width: 300,
    margin: "0 auto",
    textAlign: "center",
    padding: "50px 0 0",
    "& img": {},
    "& h1": {
      color: theme.palette.grey[800],
      margin: "20px 0 10px",
    },
    "& p": {
      color: theme.palette.grey[500],
      fontSize: 16,
    },
  },
  login_form: {
    margin: "30px 0 0",
  },
  connect: {
    width: 350,
    margin: "0 auto",
    textAlign: "center",
    padding: "50px 0 0",
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
    padding: "50px 20px",
    background: theme.palette.grey[50],
    "& h1": {
      fontSize: 36,
    },
    "& span": {
      fontSize: 16,
      color: theme.palette.grey[800],
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
    padding: "30px 10px",
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
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
});
