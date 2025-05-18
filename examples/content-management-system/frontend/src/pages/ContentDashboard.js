import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";
import ContentList from "../components/ContentList";
import ContentEditor from "../components/ContentEditor";
import ContentDetails from "../components/ContentDetails";
import ApiService from "../services/ApiService";

function ContentDashboard() {
  const [contentType, setContentType] = useState("all");
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    setLoading(true);
    try {
      let data;
      if (contentType === "all") {
        data = await ApiService.getAllContent();
      } else {
        data = await ApiService.getContentByType(contentType);
      }
      setContents(data);
      setSelectedContent(null);
      setError(null);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Failed to load content items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [contentType]);

  const handleContentSelect = (content) => {
    setSelectedContent(content);
    setIsEditing(false);
  };

  const handleContentTypeChange = (event, newValue) => {
    setContentType(newValue);
  };

  const handleCreateNew = () => {
    setSelectedContent(null);
    setIsEditing(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (contentData) => {
    try {
      if (selectedContent) {
        await ApiService.updateContent(selectedContent.id, contentData);
      } else {
        await ApiService.createContent(contentData);
      }
      fetchContent();
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving content:", err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    try {
      await ApiService.deleteContent(id);
      fetchContent();
      setSelectedContent(null);
    } catch (err) {
      console.error("Error deleting content:", err);
    }
  };

  const handleAddComment = async (contentId, userId, text) => {
    try {
      const updatedContent = await ApiService.addComment(contentId, {
        userId,
        text,
      });
      setSelectedContent(updatedContent);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Content Management System
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          A demonstration of a document-oriented database-powered CMS
        </Typography>

        <Box sx={{ mt: 2, mb: 4 }}>
          <Tabs
            value={contentType}
            onChange={handleContentTypeChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab value="all" label="All Content" />
            <Tab value="article" label="Articles" />
            <Tab value="product" label="Products" />
          </Tabs>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
                <ContentList
                  contents={contents}
                  onSelectContent={handleContentSelect}
                  selectedContent={selectedContent}
                  loading={loading}
                  error={error}
                  onCreateNew={handleCreateNew}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 2 }}>
                {isEditing ? (
                  <ContentEditor
                    content={selectedContent}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                ) : (
                  <ContentDetails
                    content={selectedContent}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddComment={handleAddComment}
                  />
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default ContentDashboard;
