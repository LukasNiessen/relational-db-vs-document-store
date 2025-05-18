import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

function ContentList({
  contents,
  onSelectContent,
  selectedContent,
  loading,
  error,
  onCreateNew,
}) {
  const getContentIcon = (type) => {
    switch (type) {
      case "article":
        return <ArticleIcon />;
      case "product":
        return <ShoppingBasketIcon />;
      default:
        return <ArticleIcon />;
    }
  };

  const getContentTitle = (content) => {
    if (content.type === "article") {
      return content.data.title || "Untitled Article";
    } else if (content.type === "product") {
      return content.data.name || "Untitled Product";
    }
    return "Untitled Content";
  };

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

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Content Items</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreateNew}
        >
          New
        </Button>
      </Box>

      {contents && contents.length > 0 ? (
        <List>
          {contents.map((content) => (
            <React.Fragment key={content.id}>
              <ListItem
                button
                selected={selectedContent && selectedContent.id === content.id}
                onClick={() => onSelectContent(content)}
                sx={{
                  borderRadius: 1,
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    "&:hover": { backgroundColor: "primary.light" },
                  },
                }}
              >
                <IconButton size="small" sx={{ mr: 1 }}>
                  {getContentIcon(content.type)}
                </IconButton>
                <ListItemText
                  primary={getContentTitle(content)}
                  secondary={
                    <React.Fragment>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                      >
                        {content.type.charAt(0).toUpperCase() +
                          content.type.slice(1)}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{
                          ml: 1,
                          px: 1,
                          borderRadius: 1,
                          backgroundColor: content.published
                            ? "success.light"
                            : "warning.light",
                        }}
                      >
                        {content.published ? "Published" : "Draft"}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary" align="center">
          No content items found. Click "New" to create one.
        </Typography>
      )}
    </Box>
  );
}

export default ContentList;
