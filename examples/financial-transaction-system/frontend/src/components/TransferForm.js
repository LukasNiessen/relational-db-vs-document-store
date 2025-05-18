import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from "@mui/material";
import ApiService from "../services/ApiService";

function TransferForm({ accounts, onTransferSuccess, selectedAccount }) {
  const [fromAccount, setFromAccount] = useState(
    selectedAccount ? selectedAccount.accountId : ""
  );
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState({ message: "", severity: "" });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (selectedAccount) {
      setFromAccount(selectedAccount.accountId);
    }
  }, [selectedAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fromAccount || !toAccount || !amount) {
      setStatus({
        message: "Please fill in all fields",
        severity: "error",
      });
      return;
    }

    if (fromAccount === toAccount) {
      setStatus({
        message: "Source and destination accounts cannot be the same",
        severity: "error",
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setStatus({
        message: "Please enter a valid positive amount",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await ApiService.transferFunds({
        fromAccountId: fromAccount,
        toAccountId: toAccount,
        amount: amount,
      });

      setStatus({
        message: "Transfer successful!",
        severity: "success",
      });

      setAmount("");
      onTransferSuccess();
    } catch (err) {
      console.error("Error during transfer:", err);
      setStatus({
        message:
          err.response?.data?.message || "Transfer failed. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Transfer Funds
      </Typography>

      {status.message && (
        <Alert severity={status.severity} sx={{ mb: 2 }}>
          {status.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>From Account</InputLabel>
            <Select
              value={fromAccount}
              label="From Account"
              onChange={(e) => setFromAccount(e.target.value)}
              disabled={loading}
            >
              {accounts.map((account) => (
                <MenuItem key={account.accountId} value={account.accountId}>
                  {account.accountType} (ID: {account.accountId}) - $
                  {parseFloat(account.balance).toFixed(2)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>To Account</InputLabel>
            <Select
              value={toAccount}
              label="To Account"
              onChange={(e) => setToAccount(e.target.value)}
              disabled={loading}
            >
              {accounts
                .filter((account) => account.accountId !== fromAccount)
                .map((account) => (
                  <MenuItem key={account.accountId} value={account.accountId}>
                    {account.accountType} (ID: {account.accountId}) - $
                    {parseFloat(account.balance).toFixed(2)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !fromAccount || !toAccount || !amount}
            sx={{ mt: 1 }}
          >
            {loading ? "Processing..." : "Transfer"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default TransferForm;
