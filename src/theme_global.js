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
    },
  },
});
