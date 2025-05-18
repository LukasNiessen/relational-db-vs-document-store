import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
  Divider,
  Paper,
} from "@mui/material";

function AccountList({
  accounts,
  onSelectAccount,
  selectedAccount,
  loading,
  error,
}) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!accounts || accounts.length === 0) {
    return <Typography>No accounts found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Accounts
      </Typography>
      <List>
        {accounts.map((account) => (
          <React.Fragment key={account.accountId}>
            <ListItem
              button
              selected={
                selectedAccount &&
                selectedAccount.accountId === account.accountId
              }
              onClick={() => onSelectAccount(account)}
              sx={{
                borderRadius: 1,
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  "&:hover": { backgroundColor: "primary.light" },
                },
              }}
            >
              <ListItemText
                primary={
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1">
                      {account.accountType}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      ${parseFloat(account.balance).toFixed(2)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                    >
                      Account ID: {account.accountId}
                    </Typography>
                    <br />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                    >
                      Customer ID: {account.customerId}
                    </Typography>
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        ml: 1,
                        px: 1,
                        borderRadius: 1,
                        backgroundColor:
                          account.status === "ACTIVE"
                            ? "success.light"
                            : "warning.light",
                      }}
                    >
                      {account.status}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default AccountList;
