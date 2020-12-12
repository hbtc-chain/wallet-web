export default (theme) => ({
  container: {
    width: 280,
    position: "relative",
    "& .MuiFormControl-root": {
      opacity: 0,
    },
    "& .MuiInputBase-input": {
      height: 43,
    },
  },
  inputs: {
    position: "absolute",
    left: 0,
    top: 0,
    "& div": {
      width: 40,
      height: 56,
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&.active": {
        border: `1px solid ${theme.palette.primary.main}`,
      },
    },
    "& span": {
      fontSize: 28,
      transition: "all ease-in-out .3s",
      animation: "$lightCircle infinite 1.2s",
      color: theme.palette.common.text,
    },
    "& i": {
      display: "block",
      width: 10,
      height: 10,
      borderRadius: 5,
      background: theme.palette.grey[800],
    },
  },
  "@keyframes lightCircle": {
    "0%": {
      opacity: 1,
    },
    "50%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
});
