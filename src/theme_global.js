export default (theme) => ({
  "@global": {
    a: {
      color: theme.palette.primary.main,
      "&:hover": {},
    },
    ".MuiListItemIcon-root": {
      minWidth: 30,
    },
    ".MuiButton-root": {
      boxShadow: "none",
      height: 40,
    },
    ".MuiButton-contained:hover": {
      boxShadow: "none",
    },
    ".MuiInputBase-input": {
      padding: "12px 14px !important",
    },
    ".MuiMenuItem-root": {
      minHeight: 40,
    },
  },
});
