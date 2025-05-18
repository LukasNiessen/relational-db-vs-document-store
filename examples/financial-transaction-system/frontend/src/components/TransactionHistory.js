import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function TransactionHistory({ transactions, accounts, selectedAccount }) {
  if (!selectedAccount) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Transaction History
        </Typography>
        <Typography variant="body2">
          Select an account to view transaction history.
        </Typography>
      </Box>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Transaction History: Account {selectedAccount.accountId}
        </Typography>
        <Typography variant="body2">
          No transactions found for this account.
        </Typography>
      </Box>
    );
  }

  // Helper function to get account info by id
  const getAccountInfo = (id) => {
    const account = accounts.find((acc) => acc.accountId === id);
    return account
      ? `${account.accountType} (${account.accountId})`
      : `Account ${id}`;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Transaction History: Account {selectedAccount.accountId}
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => {
              const isDebit =
                transaction.fromAccount &&
                transaction.fromAccount.accountId === selectedAccount.accountId;

              return (
                <TableRow
                  key={transaction.transactionId}
                  sx={{
                    backgroundColor: isDebit
                      ? "rgba(244, 67, 54, 0.08)"
                      : "rgba(76, 175, 80, 0.08)",
                  }}
                >
                  <TableCell>
                    {new Date(transaction.createdAt).toLocaleDateString()}{" "}
                    {new Date(transaction.createdAt).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>{transaction.referenceNumber}</TableCell>
                  <TableCell>
                    {transaction.fromAccount
                      ? getAccountInfo(transaction.fromAccount.accountId)
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {transaction.toAccount
                      ? getAccountInfo(transaction.toAccount.accountId)
                      : "N/A"}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: isDebit ? "error.main" : "success.main",
                    }}
                  >
                    {isDebit ? "-" : "+"}$
                    {parseFloat(transaction.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor:
                          transaction.status === "COMPLETED"
                            ? "success.light"
                            : "warning.light",
                      }}
                    >
                      {transaction.status}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TransactionHistory;
