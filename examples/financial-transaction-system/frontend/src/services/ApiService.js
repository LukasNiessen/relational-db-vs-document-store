import axios from "axios";

const API_URL = "http://localhost:8080/api";

const ApiService = {
  // Account endpoints
  getAllAccounts: async () => {
    const response = await axios.get(`${API_URL}/accounts`);
    return response.data;
  },

  getAccountById: async (id) => {
    const response = await axios.get(`${API_URL}/accounts/${id}`);
    return response.data;
  },

  getAccountsByCustomerId: async (customerId) => {
    const response = await axios.get(
      `${API_URL}/accounts/customer/${customerId}`
    );
    return response.data;
  },

  createAccount: async (accountData) => {
    const response = await axios.post(`${API_URL}/accounts`, accountData);
    return response.data;
  },

  updateAccount: async (id, accountData) => {
    const response = await axios.put(`${API_URL}/accounts/${id}`, accountData);
    return response.data;
  },

  // Transfer endpoints
  transferFunds: async (transferData) => {
    const response = await axios.post(`${API_URL}/transfers`, transferData);
    return response.data;
  },

  getTransactionHistory: async (accountId) => {
    const response = await axios.get(
      `${API_URL}/transfers/account/${accountId}`
    );
    return response.data;
  },
};

export default ApiService;
