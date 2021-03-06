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
    "& svg": {
      cursor: "pointer",
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
    background: theme.palette.primary.main,
  },
  deposit_token_p: {
    color: theme.palette.grey[100],
    fontSize: 14,
    height: 24,
  },
  choose_deposit_token: {
    background: theme.palette.common.white,
    borderRadius: 8,
    cursor: "pointer",
    margin: "8px 0",
    color: theme.palette.grey[900],
    fontSize: 14,
    padding: "0 10px",
    height: 48,
    "& img": {
      width: 24,
    },
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
  bg_primary: {
    background: theme.palette.primary.main,
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

    "& div.paper": {
      padding: "40px 0 0",
      textAlign: "center",
      position: "relative",
      boxShadow: "none",
      borderRadius: 8,
      // maxWidth: 375,
      margin: "0 auto",
      color: theme.palette.grey[700],
      "& p": {
        color: theme.palette.common.black,
        textAlign: "center",
        fontSize: 16,
        padding: "8px 20px",
        margin: "0 0 4px",
        "&.qrcode_desc": {
          color: theme.palette.grey[500],
          fontSize: 12,
          padding: 4,
          margin: 0,
        },
      },
    },
    "& div.paper2": {
      padding: "20px 0 0",
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
      textAlign: "center",
      margin: "8px 0 10px",
      lineHeight: "20px",
      fontSize: 12,
      fontWeight: 400,
      color: theme.palette.grey[700],
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
      width: 150,
    },
    "& em": {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
  },
  collect_fee_tip: {
    margin: "24px 0 4px",
    "& strong": {
      lineHeight: "18px",
      fontSize: 12,
    },
  },
  accept_tip: {
    color: theme.palette.common.white,
    fontSize: 12,
    margin: "24px 0",
    lineHeight: "20px",
    "& em": {
      color: theme.palette.common.white,
    },
    "& strong": {
      lineHeight: "24px",
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
    padding: "22px 24px 24px",
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
  delegate: {
    minHeight: "100vh",
    background:
      "linear-gradient(180.67deg, #316BFA 190px, rgba(255, 255, 255, 0) 290px)",
  },
  back3: {
    color: theme.palette.common.white,
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
    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0,0,0,0)",
    },
  },
  nodata: {
    textAlign: "center",
    color: theme.palette.grey[500],
    padding: "20px 0",
    width: "100%",
  },
  delegate_title: {
    fontSize: 16,
    padding: "0 16px",
    margin: "30px 0 16px",
    color: theme.palette.common.white,
    "& .address": {
      cursor: "pointer",
      height: 24,
      background: helper.hex_to_rgba(theme.palette.grey[900], 0.2),
      borderRadius: 12,
      color: helper.hex_to_rgba(theme.palette.common.white, 1),
      padding: "3px 10px",
      display: "flex",
      alignItems: "center",
      fontSize: 12,
      "& img": {},
    },
  },
  delegate_info: {
    margin: "0 16px",
    boxShadow: "0px 3px 12px rgba(51, 117, 224, 0.12)",
    borderRadius: 10,
    padding: "16px 16px 0",
    "& span": {
      fontSize: 12,
      color: theme.palette.grey[500],
    },
    "& button": {
      "& span": {
        fontSize: 12,
        color: theme.palette.common.white,
        whiteSpace: "nowrap",
      },
    },
    "& .MuiButton-root": {
      padding: 6,
    },
    "& em": {
      fontSize: 14,
      color: theme.palette.grey[900],
      display: "block",
      height: 24,
      margin: "2px 0 16px",
    },
  },
  delegate_tabs: {
    margin: "32px 16px 20px",
    height: 32,
    display: "flex",
    "& span": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "center",
      lineHeight: "30px",
      cursor: "pointer",
      margin: "0 18px 0 0",
      color: theme.palette.grey[500],
      "& i": {
        width: 16,
        height: 3,
        display: "block",
        opacity: 0,
        background:
          "linear-gradient(90deg, #3375E0 0%, rgba(51, 117, 224, 0) 100%)",
      },
      "&.on": {
        color: theme.palette.grey[900],
        "& i": {
          opacity: 1,
        },
      },
    },
  },
  delegate_node: {
    boxShadow: "0px 2px 8px rgba(51, 117, 224, 0.12)",
    borderRadius: 10,
    margin: "0 16px 16px",
    padding: 16,
    "& strong": {
      fontSize: 16,
      color: theme.palette.grey[900],
      fontWeight: 500,
      lineHeight: "32px",
      margin: "0 0 8px",
      display: "block",
    },
    "& span": {
      color: theme.palette.grey[500],
      fontSize: 12,
      lineHeight: "16px",
    },
    "& em": {
      display: "block",
      fontSize: 14,
      color: theme.palette.grey[900],
    },
    "& i": {
      width: 16,
      height: 16,
      display: "block",
      position: "relative",
      borderRadius: 8,
      background: helper.hex_to_rgba("#51D372", 0.2),
      "& i": {
        width: 8,
        height: 8,
        borderRadius: 4,
        background: "#51D372",
        position: "absolute",
        left: 4,
        top: 4,
      },
      "&.no": {
        background: helper.hex_to_rgba("#6E8196", 0.2),
        "& i": {
          background: "#6E8196",
        },
      },
    },
  },
  delegate_node_name: {
    padding: "16px",
    "& strong": {
      fontSize: 16,
      fontWeight: 500,
      color: theme.palette.grey[900],
      wordBreak: "break-all",
      maxWidth: 230,
    },
    "& .on": {
      display: "flex",
      alignItems: "center",
      height: 32,
      padding: "0 10px",
      borderRadius: 16,
      fontSize: 12,
      color: "#51D372",
      background: theme.palette.grey[50],
      "& i": {
        width: 16,
        height: 16,
        display: "block",
        position: "relative",
        borderRadius: 8,
        background: helper.hex_to_rgba("#51D372", 0.2),
        "& i": {
          width: 8,
          height: 8,
          borderRadius: 4,
          background: "#51D372",
          position: "absolute",
          left: 4,
          top: 4,
        },
      },
    },
    "& .no": {
      display: "flex",
      height: 32,
      alignItems: "center",
      padding: "0 10px",
      borderRadius: 16,
      fontSize: 12,
      color: theme.palette.grey[700],
      background: theme.palette.grey[50],
      "& i": {
        width: 16,
        height: 16,
        display: "block",
        position: "relative",
        borderRadius: 8,
        background: helper.hex_to_rgba("#6E8196", 0.2),
        "& i": {
          width: 8,
          height: 8,
          borderRadius: 4,
          background: "#6E8196",
          position: "absolute",
          left: 4,
          top: 4,
        },
      },
    },
  },
  delegate_node_info: {
    padding: "0 16px",
    lineHeight: "32px",
    color: theme.palette.grey[900],
    "& span": {
      color: theme.palette.grey[700],
    },
    "& hr": {
      margin: "16px 0 12px",
    },
    "& p": {
      wordBreak: "break-all",
      margin: "0 0 50px",
    },
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
    height: 70,
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
    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0,0,0,0)",
    },
  },
  outline_input: {
    padding: "16px 0 16px 16px",
  },
  outline_outline: {
    borderColor: theme.palette.grey[50],
  },
  delegate_desc: {
    border: `2px solid ${theme.palette.grey[100]}`,
    borderRadius: 10,
    margin: "16px 0 24px",
    padding: "10px 16px",
    color: theme.palette.grey[700],
    fontSize: 12,
    lineHeight: "20px",
  },
  swap: {
    margin: "20px 20px 0",
    boxShadow: `0px 0px 16px 0px ${helper.hex_to_rgba("#3375E0", 0.12)}`,
    padding: 16,
    "& .amount": {
      fontSize: 14,
      color: theme.palette.grey[500],
      height: 22,
      margin: "0 0 6px",
    },
    "& .symbol": {
      display: "flex",
      alignItems: "center",
      background: theme.palette.grey[50],
      height: 40,
      width: 128,
      margin: "0 8px 0 0",
      cursor: "pointer",
      padding: "0 10px",
      justifyContent: "space-between",
      "& span": {
        flex: 1,
        display: "flex",
        justifyContent: "space-between",
        padding: "0 0 0 6px",
      },
    },
    "& .input": {
      flex: 1,
      "& em": {
        whiteSpace: "nowrap",
        color: theme.palette.primary.main,
        cursor: "pointer",
      },
    },
    "& .btn": {
      margin: "24px 0 0",
    },
    "& .exchange": {
      width: 24,
      height: 24,
      margin: "24px 0",
      borderRadius: 4,
      background: theme.palette.grey[50],
      cursor: "pointer",
      "& img": {
        width: 24,
      },
    },
    "& img": {
      width: 24,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.grey[50],
    },
    "& .MuiOutlinedInput-adornedEnd": {
      padding: "0 10px 0 0",
    },
    "& .MuiOutlinedInput-root": {
      background: theme.palette.grey[50],
    },
    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0,0,0,0)",
    },
    "& input": {
      "&:nth-child(2n)": {
        textAlign: "right",
      },
    },
  },
  swap_tokens: {
    fontSize: 16,
    padding: "30px 8px 24px",
    color: theme.palette.grey[900],
    "& div": {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    },
    "& img": {
      width: 24,
      margin: "0 5px 0 0",
    },
    "& i": {
      color: theme.palette.grey[500],
      margin: "0 0 0 6px",
    },
  },
  swap_input: {
    height: 40,
    background: theme.palette.grey[50],
    "& .MuiOutlinedInput-input": {
      padding: "12px 14px",
    },
  },
  swap_rate: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 8px 0",
    "& span": {
      fontSize: 14,
      color: theme.palette.grey[700],
      margin: "0 8px 0 0",
    },
    "& p": {
      flex: 1,
      fontSize: 16,
      color: theme.palette.grey[900],
    },
    "& i": {
      width: 16,
      height: 16,
      display: "block",
      position: "relative",
      borderRadius: 8,
      background: helper.hex_to_rgba("#51D372", 0.2),
      "& i": {
        width: 8,
        height: 8,
        borderRadius: 4,
        background: "#51D372",
        position: "absolute",
        left: 4,
        top: 4,
      },
    },
    "& em": {
      position: "absolute",
      width: 16,
      height: 16,
      background: theme.palette.grey[50],
      borderRadius: 8,
      display: "block",
      top: -10,
      "&:nth-child(2n+1)": {
        left: -16,
      },
      "&:nth-child(2n)": {
        right: -16,
      },
    },
  },
});
