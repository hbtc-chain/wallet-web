import util from "../../util/util";
import helper from "../../util/helper";
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
    minHeight: 72,
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    "& img": {
      width: 32,
      margin: "0 10px 0 0",
    },
    "& strong": {
      display: "flex",
      alignItems: "flex-start",
    },
    "& em": {
      color: theme.palette.grey[500],
    },
    "& span.external": {
      fontSize: 12,
      color: theme.palette.grey[500],
      background: helper.hex_to_rgba(theme.palette.grey[200], 0.2),
      padding: "0 2px",
      margin: "0 0 0 4px",
      borderRadius: 2,
      fontWeight: 400,
      transform: "scale3d(1,1,0.85)",
    },
    "& span.native": {
      fontSize: 12,
      color: theme.palette.grey[500],
      background: helper.hex_to_rgba(theme.palette.grey[200], 0.2),
      padding: "0 2px",
      margin: "0 0 0 4px",
      borderRadius: 2,
      fontWeight: 400,
      transform: "scale3d(1,1,0.85)",
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
    padding: "0 16px",
    margin: "0 auto",
    position: "relative",
  },
  avatar: {
    color: theme.palette.common.white,
    background: "#3E3A50",
  },
  token_list: {
    padding: "10px 0 0",
  },
  withdrawl_tip: {
    margin: "0 auto 20px",
    border: `1px solid ${theme.palette.grey[100]}`,
    padding: "16px 10px",
    borderRadius: 10,
    padding: "10px 10px 10px 30px",
    "& li": {
      listStyle: "initial",
      padding: "3px 0",
      color: theme.palette.grey[700],
      fontSize: 14,
    },
  },
  index_top_content: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: "16px 16px 0",
  },
  index_top: {
    height: 30,
    "& span": {
      display: "inline-flex",
      alignItems: "center",
      background: "rgba(255,255,255,.2)",
      borderRadius: 4,
      padding: "0 4px",
      cursor: "pointer",
      "& em": {
        width: 6,
        height: 6,
        display: "inline-block",
        borderRadius: 6,
        background: "linear-gradient(0deg, #35E5DB, #35E5DB)",
        margin: "0 4px 0 0",
      },
    },
    "& i": {
      cursor: "pointer",
    },
  },
  userinfo: {
    textAlign: "center",
    padding: "16px 0",
    display: "flex",
    height: 120,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    "& span": {
      color: theme.palette.common.white,
      fontSize: 12,
    },
    "& strong": {
      fontSize: 24,
    },
    "& em": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 24,
      lineHeight: "24px",
      background: "rgba(255,255,255,0.2)",
      color: "rgba(255,255,255,.7)",
      borderRadius: 4,
      padding: "0 6px",
      cursor: "pointer",
      "&.copyed": {
        color: theme.palette.common.white,
        minWidth: 194,
        background: "#35E5DB",
        padding: "0 2px",
        "& span:first-of-type": {
          flex: 1,
        },
        "& span:last-of-type": {
          display: "flex",
          alignItems: "center",
          "& hr": {
            height: 12,
            background: `${helper.hex_to_rgba(theme.palette.grey[100], 0.3)}`,
            marginTop: 4,
          },
          "& svg": {
            margin: "0 0 0 5px",
          },
        },
      },
    },
  },
  control_btn: {
    position: "absolute",
    right: 0,
    top: 10,
    width: 24,
    height: 24,
    borderRadius: 4,
    "&:hover": {
      background: `${helper.hex_to_rgba(theme.palette.grey[900], 0.2)}`,
    },
  },
  control_list: {
    minWidth: 200,
    maxWidth: 240,
    "& li": {
      padding: "16px 24px",
      color: theme.palette.grey[900],
      lineHeight: "22px",
      borderBottom: `1px solid ${theme.palette.grey[100]}`,
      "& i": {
        color: theme.palette.grey[200],
      },
      "& .MuiListItemIcon-root": {
        minWidth: 25,
        "& i": { marginRight: 6 },
      },
      "& .MuiListItemText-root": {
        margin: 0,
      },
      "& .MuiTypography-root": {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        wordBreak: "break-all",
      },
    },
  },
  chain_choose_title: {
    height: 72,
    textAlign: "center",
    "& h2": {
      fontSize: 16,
      color: theme.palette.common.text,
    },
  },
  chains: {
    "& li": {
      display: "flex",
      height: 56,
      borderTop: "1px solid rgba(244,247,255,1)",
    },
  },
  index_top_btn: {
    margin: "0 -16px",
    width: "calc(100% + 32px)",
    height: 48,
    padding: "12px 0",
    borderTop: `1px solid rgba(255, 255, 255, 0.2)`,
    "& hr": {
      background: `${helper.hex_to_rgba(theme.palette.grey[100], 0.2)}`,
    },
    "& div:nth-child(5n+1),& div:nth-child(5n+3),& div:nth-child(5n)": {
      flex: 1,
      textAlign: "center",
      fontSize: 14,
      cursor: "pointer",
    },
    "& div:nth-child(5n+2)，& div:nth-child(5n+4)": {
      width: 2,
    },
  },
  message: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 32,
    borderRadius: 16,
    margin: "8px 16px 0",
    color: theme.palette.grey[700],
    padding: "0 10px 0 0",
    background: helper.hex_to_rgba(theme.palette.secondary.main, 0.1),
    "& p": {
      flex: 1,
      padding: "0 10px",
      fontSize: 12,
      overflow: "hidden",
      whiteSpace: "nowrap",
      "& a": {
        color: theme.palette.grey[700],
      },
    },
    "& i": {
      cursor: "pointer",
    },
    "& span": {
      margin: "0 0 0 2px",
      display: "flex",
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      background: helper.hex_to_rgba(theme.palette.secondary.main, 0.15),
      "& i": {
        color: theme.palette.secondary.main,
      },
    },
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
    "& a": {
      color: theme.palette.common.white,
      margin: "0 10px 0 0",
    },
  },
  symbol: {
    padding: "0 16px",
    margin: "0 auto",
    position: "relative",
  },
  symbol_paper: {
    boxShadow: "0px 3px 12px 0px rgba(51,117,224,.12)",
  },
  symbol_amount: {
    position: "relative",
    height: 112,
    padding: 16,
    borderBottom: `1px solid ${theme.palette.grey[50]}`,
    overflow: "hidden",
    "& img": {
      width: 128,
      opacity: 0.1,
      position: "absolute",
      right: 0,
      top: 32,
    },
    "& p": {
      color: theme.palette.grey[500],
      fontSize: 12,
      lineHeight: "20px",
    },
    "& strong": {
      color: theme.palette.grey[900],
      fontSize: 26,
      display: "block",
      lineHeight: "40px",
      height: 40,
      fontWeight: 500,
    },
    "& span": {
      color: theme.palette.grey[500],
      fontSize: 16,
      lineHeight: "20px",
    },
  },
  symbol_amount_item: {
    margin: "8px 0",
    padding: "0 16px",
    height: 20,
    "& div": {
      fontSize: 12,
      "&:nth-child(2n+1)": {
        color: theme.palette.grey[500],
      },
      "&:nth-child(2n)": {
        color: theme.palette.grey[900],
      },
    },
  },
  nodata: {
    padding: "56px 0 74px",
    "& img": {
      width: 48,
      margin: "0 auto 16px",
      display: "block",
    },
    "& p": {
      color: theme.palette.grey[300],
      textAlign: "center",
      fontSize: 16,
    },
  },
  btns: {
    position: "fixed",
    left: 0,
    bottom: 0,
    background: theme.palette.common.white,
    padding: "0 0 10px",
    width: "100%",
    "& div": {
      textAlign: "center",
      cursor: "pointer",
    },
    "& span": {
      boxShadow: "0px 2px 6px 0px rgba(51,117,224,0.16)",
      display: "flex",
      width: 48,
      height: 48,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 18,
      margin: "0 0 8px",
      "&.cross": {
        width: 64,
      },
    },

    "& i": {
      color: theme.palette.common.text,
      fontSize: 12,
    },
  },
  btn_fixed: {
    position: "fixed",
    bottom: 10,
    left: 0,
    right: 0,
    padding: "0 16px",
    maxWidth: 700,
    margin: "0 auto",
  },
  back: {
    height: 44,
    margin: "0 0 12px",
    "& h2": {
      fontSize: 14,
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
    lineHeight: "20px",
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
  search_input: {
    color: theme.palette.grey[500],
    border: 0,
    padding: 0,
    "& i": {
      color: theme.palette.grey[500],
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.grey[50],
    },
    "& .MuiOutlinedInput-inputAdornedStart": {
      padding: "6px 10px 6px 0",
    },
    "& .MuiOutlinedInput-root": {
      background: theme.palette.grey[50],
    },
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
    left: 0,
    right: 0,
    padding: "0 16px",
    maxWidth: 700,
    margin: "0 auto",
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
  menulist: {
    margin: "-12px -16px 0",
    padding: 0,
  },
  menuitem: {
    borderTop: `1px solid ${theme.palette.grey[50]}`,
    padding: "13px 16px",
  },
  network_select: {
    margin: "0 15px 0 0",
  },
  network: {
    padding: "7px 32px 6px 10px",
  },
  network_select_icon: {
    color: theme.palette.success.main,
  },
  borderTop: {
    borderTop: `1px solid ${theme.palette.grey[50]}`,
  },
  option_item: {
    textAlign: "right",
    color: theme.palette.grey[500],
    padding: "0 24px 0 0",
  },
  grey500: {
    color: theme.palette.grey[500],
  },
});
