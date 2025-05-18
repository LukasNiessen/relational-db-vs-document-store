import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import ApiService from "../services/ApiService";

function ContentEditor({ content, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    type: "article",
    data: {},
    authorId: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load users for author selection
    const fetchUsers = async () => {
      try {
        const data = await ApiService.getAllUsers();
        setUsers(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, authorId: data[0].id }));
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (content) {
      setFormData({
        type: content.type,
        data: { ...content.data }, // Clone to avoid direct state mutation
        authorId: content.author ? content.author.id : "",
      });
    }
  }, [content]);

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData({
      ...formData,
      type: newType,
      data:
        newType === "article"
          ? { title: "", content: "", tags: [] }
          : {
              name: "",
              price: 0,
              categories: [],
              variants: [],
              specifications: {},
            },
    });
  };

  const handleAuthorChange = (e) => {
    setFormData({
      ...formData,
      authorId: e.target.value,
    });
  };

  // Handle changes for article data
  const handleArticleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      data: {
        ...formData.data,
        [field]:
          field === "tags" ? value.split(",").map((tag) => tag.trim()) : value,
      },
    });
  };

  // Handle changes for product data
  const handleProductChange = (field) => (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      data: {
        ...formData.data,
        [field]:
          field === "categories"
            ? value.split(",").map((cat) => cat.trim())
            : field === "price"
            ? parseFloat(value)
            : value,
      },
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.authorId) {
      newErrors.authorId = "Author is required";
    }

    if (formData.type === "article") {
      if (!formData.data.title) {
        newErrors.title = "Title is required";
      }
      if (!formData.data.content) {
        newErrors.content = "Content is required";
      }
    } else if (formData.type === "product") {
      if (!formData.data.name) {
        newErrors.name = "Product name is required";
      }
      if (formData.data.price <= 0) {
        newErrors.price = "Price must be greater than 0";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      onSave(formData);
    } catch (err) {
      console.error("Error saving content:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {content ? "Edit Content" : "Create New Content"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth disabled={content !== null}>
            <InputLabel>Content Type</InputLabel>
            <Select
              value={formData.type}
              label="Content Type"
              onChange={handleTypeChange}
            >
              <MenuItem value="article">Article</MenuItem>
              <MenuItem value="product">Product</MenuItem>
            </Select>
            <FormHelperText>
              Content type cannot be changed after creation
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!errors.authorId}>
            <InputLabel>Author</InputLabel>
            <Select
              value={formData.authorId}
              label="Author"
              onChange={handleAuthorChange}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </MenuItem>
              ))}
            </Select>
            {errors.authorId && (
              <FormHelperText>{errors.authorId}</FormHelperText>
            )}
          </FormControl>

          {formData.type === "article" && (
            <>
              <TextField
                label="Title"
                value={formData.data.title || ""}
                onChange={handleArticleChange("title")}
                error={!!errors.title}
                helperText={errors.title}
                fullWidth
              />

              <TextField
                label="Content"
                value={formData.data.content || ""}
                onChange={handleArticleChange("content")}
                multiline
                rows={8}
                error={!!errors.content}
                helperText={errors.content}
                fullWidth
              />

              <TextField
                label="Tags (comma-separated)"
                value={(formData.data.tags || []).join(", ")}
                onChange={handleArticleChange("tags")}
                fullWidth
              />
            </>
          )}

          {formData.type === "product" && (
            <>
              <TextField
                label="Product Name"
                value={formData.data.name || ""}
                onChange={handleProductChange("name")}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
              />

              <TextField
                label="Price"
                type="number"
                value={formData.data.price || 0}
                onChange={handleProductChange("price")}
                error={!!errors.price}
                helperText={errors.price}
                fullWidth
              />

              <TextField
                label="Categories (comma-separated)"
                value={(formData.data.categories || []).join(", ")}
                onChange={handleProductChange("categories")}
                fullWidth
              />
            </>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
          >
            <Button onClick={onCancel}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

export default ContentEditor;
