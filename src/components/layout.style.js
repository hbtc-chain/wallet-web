export default (theme) => ({
  g_headerBox: {
    width: "100%",
  },
  g_contentbox: {
    width: "100%",
    margin: "0 auto",
    minHeight: 560,
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
      height: 40,
      margin: "0 10px 0 0",
      borderRadius: 10,
    },
  },
  menuitem: {
    width: 200,
    borderTop: `1px solid ${theme.palette.grey[50]}`,
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
