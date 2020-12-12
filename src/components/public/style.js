export default (theme) => ({
  title: {
    "& h2": {
      display: "flex",
      alignItems: "center",
    },
    "& em": {
      flex: 1,
      textAlign: "center",
    },
  },
  error_msg: {
    padding: "6px 0",
    fontSize: 12,
    color: theme.palette.error.main,
    height: 24,
  },
});
