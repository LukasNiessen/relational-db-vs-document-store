import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Chip,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import ApiService from "../services/ApiService";

function ContentDetails({ content, onEdit, onDelete, onAddComment }) {
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);

  React.useEffect(() => {
    // Load users for comment author selection
    const fetchUsers = async () => {
      try {
        const data = await ApiService.getAllUsers();
        setUsers(data);
        if (data.length > 0) {
          setUserId(data[0].id);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  if (!content) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Select a content item to view details or create a new one.
        </Typography>
      </Box>
    );
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim() || !userId) return;

    onAddComment(content.id, userId, comment);
    setComment("");
  };

  const renderArticleContent = () => {
    const article = content.data;
    return (
      <>
        <Typography variant="h5" gutterBottom>
          {article.title || "Untitled Article"}
        </Typography>

        <Box sx={{ my: 2 }}>
          {(article.tags || []).map((tag, index) => (
            <Chip key={index} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>

        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {article.content || "No content"}
        </Typography>

        {article.metadata && (
          <Box
            sx={{ mt: 3, p: 2, bgcolor: "background.paper", borderRadius: 1 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Metadata
            </Typography>
            <Typography variant="body2">
              Views: {article.metadata.viewCount || 0}
            </Typography>
            <Typography variant="body2">
              Likes: {article.metadata.likeCount || 0}
            </Typography>
            <Typography variant="body2">
              Read time: {article.metadata.estimatedReadTime || 0} mins
            </Typography>
          </Box>
        )}
      </>
    );
  };

  const renderProductContent = () => {
    const product = content.data;
    return (
      <>
        <Typography variant="h5" gutterBottom>
          {product.name || "Untitled Product"}
        </Typography>

        <Typography variant="h6" color="primary" gutterBottom>
          ${parseFloat(product.price || 0).toFixed(2)}
        </Typography>

        <Box sx={{ my: 2 }}>
          {(product.categories || []).map((category, index) => (
            <Chip
              key={index}
              label={category}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>

        {product.variants && product.variants.length > 0 && (
          <Box sx={{ my: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Variants
            </Typography>
            {product.variants.map((variant, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{variant.color}</Typography>
                  <Typography variant="body2">SKU: {variant.sku}</Typography>
                  <Typography variant="body2">
                    In Stock: {variant.inStock}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {product.specifications &&
          Object.keys(product.specifications).length > 0 && (
            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Specifications
              </Typography>
              <List dense>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <ListItem key={key}>
                    <ListItemText
                      primary={key.charAt(0).toUpperCase() + key.slice(1)}
                      secondary={value}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
      </>
    );
  };

  const renderComments = () => {
    if (!content.comments || content.comments.length === 0) {
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ my: 2 }}
        >
          No comments yet.
        </Typography>
      );
    }

    return (
      <List>
        {content.comments.map((comment) => (
          <ListItem
            key={comment.id}
            alignItems="flex-start"
            sx={{ flexDirection: "column", py: 2 }}
          >
            <Box sx={{ display: "flex", width: "100%" }}>
              <ListItemAvatar>
                <Avatar>{comment.userName ? comment.userName[0] : "?"}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle2">
                      {comment.userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(comment.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                }
                secondary={comment.text}
              />
            </Box>

            {comment.replies && comment.replies.length > 0 && (
              <Box sx={{ ml: 8, width: "calc(100% - 64px)" }}>
                {comment.replies.map((reply) => (
                  <Box
                    key={reply.id}
                    sx={{
                      mt: 1,
                      p: 1,
                      bgcolor: "background.paper",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2">
                      {reply.userName}{" "}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {new Date(reply.timestamp).toLocaleString()}
                      </Typography>
                    </Typography>
                    <Typography variant="body2">{reply.text}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {content.type === "article" ? (
            <ArticleIcon sx={{ mr: 1 }} />
          ) : (
            <ShoppingBasketIcon sx={{ mr: 1 }} />
          )}
          <Typography variant="body2" color="text.secondary">
            {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
          </Typography>
          <Chip
            label={content.published ? "Published" : "Draft"}
            size="small"
            color={content.published ? "success" : "warning"}
            sx={{ ml: 1 }}
          />
        </Box>

        <Box>
          <Button
            startIcon={<EditIcon />}
            onClick={() => onEdit(content)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(content.id)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Created by {content.author?.name || "Unknown"} on{" "}
          {new Date(content.createdAt).toLocaleDateString()}
        </Typography>
      </Box>

      {content.type === "article"
        ? renderArticleContent()
        : renderProductContent()}

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" gutterBottom>
          <CommentIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Comments
        </Typography>

        {renderComments()}

        <Box sx={{ mt: 2 }}>
          <form onSubmit={handleCommentSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                select
                label="Comment as"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                sx={{ flexGrow: 1 }}
                SelectProps={{
                  native: true,
                }}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </TextField>

              <TextField
                label="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                multiline
                rows={2}
                fullWidth
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!comment.trim() || !userId}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default ContentDetails;
