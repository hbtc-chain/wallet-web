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
    width: "360px",
    height: "600px",
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
});
