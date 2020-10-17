export default (theme) => ({
  logo: {
    width: 80,
    borderRadius: 16,
    margin: "34px auto 16px",
    display: "block",
  },
  button: {
    ...theme.typography.button,
    "&.Mui-disabled": {
      color: theme.palette.common.white,
      background: theme.palette.grey[100],
    },
  },
  index: {
    padding: "0 16px 8px",
    margin: "0 auto",
    textAlign: "center",
    "& h1": {
      margin: "16px 0 62px",
      textAlign: "center",
      fontSize: 24,
      lineHeight: "36px",
      fontWeight: "bold",
      color: theme.palette.grey[700],
    },
    "& p": {
      fontSize: 16,
      lineHeight: "25px",
      fontWeight: 500,
    },
    "& button": {
      margin: "70px 0 24px",
    },
  },
});
