import axios from "axios";

const API_URL = "http://localhost:8081/api";

const ApiService = {
  // Content endpoints
  getAllContent: async () => {
    const response = await axios.get(`${API_URL}/content`);
    return response.data;
  },

  getContentById: async (id) => {
    const response = await axios.get(`${API_URL}/content/${id}`);
    return response.data;
  },

  getContentByType: async (type) => {
    const response = await axios.get(`${API_URL}/content/type/${type}`);
    return response.data;
  },

  getPublishedContentByType: async (type) => {
    const response = await axios.get(`${API_URL}/content/published/${type}`);
    return response.data;
  },

  getContentByTag: async (tag) => {
    const response = await axios.get(`${API_URL}/content/tag/${tag}`);
    return response.data;
  },

  searchContent: async (title) => {
    const response = await axios.get(
      `${API_URL}/content/search?title=${title}`
    );
    return response.data;
  },

  createContent: async (contentData) => {
    const response = await axios.post(`${API_URL}/content`, contentData);
    return response.data;
  },

  updateContent: async (id, contentData) => {
    const response = await axios.put(`${API_URL}/content/${id}`, contentData);
    return response.data;
  },

  publishContent: async (id, published) => {
    const response = await axios.put(
      `${API_URL}/content/${id}/publish?published=${published}`
    );
    return response.data;
  },

  addComment: async (id, commentData) => {
    const response = await axios.post(
      `${API_URL}/content/${id}/comments`,
      commentData
    );
    return response.data;
  },

  addReply: async (contentId, commentId, replyData) => {
    const response = await axios.post(
      `${API_URL}/content/${contentId}/comments/${commentId}/replies`,
      replyData
    );
    return response.data;
  },

  addMetadata: async (id, metadataData) => {
    const response = await axios.put(
      `${API_URL}/content/${id}/metadata`,
      metadataData
    );
    return response.data;
  },

  deleteContent: async (id) => {
    await axios.delete(`${API_URL}/content/${id}`);
  },

  // User endpoints
  getAllUsers: async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    await axios.delete(`${API_URL}/users/${id}`);
  },
};

export default ApiService;
