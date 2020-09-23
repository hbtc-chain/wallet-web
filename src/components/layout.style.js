export default (theme) => ({
  g_headerBox: {
    width: "100%",
  },
  g_contentbox: {
    width: "100%",
    margin: "0 auto",
  },
  g_header_box: {
    width: "100%",
    background: theme.palette.grey[100],
  },
  g_header: {
    padding: "20px 10px",
    maxWidth: 700,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    "& img": {
      height: 30,
      margin: "0 10px 0 0",
    },
  },
  menuitem: {
    width: 200,
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
  "@media (max-width : 500px)": {
    logoname: {
      display: "none",
    },
    logo: {
      maxWidth: 80,
    },
  },
});
