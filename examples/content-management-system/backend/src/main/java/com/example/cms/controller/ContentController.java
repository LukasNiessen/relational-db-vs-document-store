package com.example.cms.controller;

import com.example.cms.model.ContentItem;
import com.example.cms.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Content Controller", description = "APIs for content management")
public class ContentController {

    private final ContentService contentService;

    @Autowired
    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    @Operation(summary = "Get all content", description = "Retrieves a list of all content items")
    public ResponseEntity<List<ContentItem>> getAllContent() {
        return ResponseEntity.ok(contentService.getAllContent());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get content by ID", description = "Retrieves a content item by its ID")
    public ResponseEntity<ContentItem> getContentById(@PathVariable String id) {
        return ResponseEntity.ok(contentService.getContentById(id));
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get content by type", description = "Retrieves all content items of a specific type")
    public ResponseEntity<List<ContentItem>> getContentByType(@PathVariable String type) {
        return ResponseEntity.ok(contentService.getContentByType(type));
    }

    @GetMapping("/published/{type}")
    @Operation(summary = "Get published content by type", description = "Retrieves all published content items of a specific type")
    public ResponseEntity<List<ContentItem>> getPublishedContentByType(@PathVariable String type) {
        return ResponseEntity.ok(contentService.getPublishedContentByType(type));
    }

    @GetMapping("/tag/{tag}")
    @Operation(summary = "Get content by tag", description = "Retrieves all content items that contain a specific tag")
    public ResponseEntity<List<ContentItem>> getContentByTag(@PathVariable String tag) {
        return ResponseEntity.ok(contentService.getContentByTag(tag));
    }

    @GetMapping("/search")
    @Operation(summary = "Search content by title", description = "Searches for content items by title")
    public ResponseEntity<List<ContentItem>> searchContentByTitle(@RequestParam String title) {
        return ResponseEntity.ok(contentService.searchContentByTitle(title));
    }

    @PostMapping
    @Operation(summary = "Create new content", description = "Creates a new content item with the given details")
    public ResponseEntity<ContentItem> createContent(@RequestBody Map<String, Object> request) {
        String type = (String) request.get("type");
        String authorId = (String) request.get("authorId");
        @SuppressWarnings("unchecked")
        Map<String, Object> data = (Map<String, Object>) request.get("data");
        
        ContentItem createdContent = contentService.createContent(type, data, authorId);
        return new ResponseEntity<>(createdContent, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update content", description = "Updates an existing content item with the given details")
    public ResponseEntity<ContentItem> updateContent(@PathVariable String id, @RequestBody Map<String, Object> data) {
        return ResponseEntity.ok(contentService.updateContent(id, data));
    }

    @PutMapping("/{id}/publish")
    @Operation(summary = "Publish or unpublish content", description = "Changes the published status of a content item")
    public ResponseEntity<ContentItem> publishContent(@PathVariable String id, @RequestParam boolean published) {
        return ResponseEntity.ok(contentService.publishContent(id, published));
    }

    @PostMapping("/{id}/comments")
    @Operation(summary = "Add a comment", description = "Adds a comment to a content item")
    public ResponseEntity<ContentItem> addComment(@PathVariable String id, @RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String text = request.get("text");
        
        return ResponseEntity.ok(contentService.addComment(id, userId, text));
    }

    @PostMapping("/{contentId}/comments/{commentId}/replies")
    @Operation(summary = "Add a reply to a comment", description = "Adds a reply to an existing comment")
    public ResponseEntity<ContentItem> addReplyToComment(
            @PathVariable String contentId,
            @PathVariable String commentId,
            @RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String text = request.get("text");
        
        return ResponseEntity.ok(contentService.addReplyToComment(contentId, commentId, userId, text));
    }

    @PutMapping("/{id}/metadata")
    @Operation(summary = "Add or update metadata", description = "Adds or updates metadata for a content item")
    public ResponseEntity<ContentItem> addMetadata(@PathVariable String id, @RequestBody Map<String, Object> request) {
        String key = (String) request.get("key");
        Object value = request.get("value");
        
        return ResponseEntity.ok(contentService.addMetadata(id, key, value));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete content", description = "Deletes a content item by its ID")
    public ResponseEntity<Void> deleteContent(@PathVariable String id) {
        contentService.deleteContent(id);
        return ResponseEntity.noContent().build();
    }
}
