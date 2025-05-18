import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Paper, Grid } from "@mui/material";
import AccountList from "../components/AccountList";
import TransferForm from "../components/TransferForm";
import TransactionHistory from "../components/TransactionHistory";
import ApiService from "../services/ApiService";

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAllAccounts();
      setAccounts(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError("Failed to load accounts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (accountId) => {
    if (!accountId) return;

    try {
      const data = await ApiService.getTransactionHistory(accountId);
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount.accountId);
    }
  }, [selectedAccount]);

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  const handleTransferSuccess = () => {
    // Refresh accounts and transactions after a successful transfer
    fetchAccounts();
    if (selectedAccount) {
      fetchTransactions(selectedAccount.accountId);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Financial Transaction System
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          A demonstration of a relational database-powered financial system
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
                <AccountList
                  accounts={accounts}
                  onSelectAccount={handleAccountSelect}
                  selectedAccount={selectedAccount}
                  loading={loading}
                  error={error}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <TransferForm
                      accounts={accounts}
                      onTransferSuccess={handleTransferSuccess}
                      selectedAccount={selectedAccount}
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <TransactionHistory
                      transactions={transactions}
                      accounts={accounts}
                      selectedAccount={selectedAccount}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Dashboard;
