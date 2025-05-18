package com.example.cms.service;

import com.example.cms.exception.ContentNotFoundException;
import com.example.cms.model.Comment;
import com.example.cms.model.ContentItem;
import com.example.cms.model.Reply;
import com.example.cms.model.User;
import com.example.cms.repository.ContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ContentService {
    private final ContentRepository contentRepository;
    private final UserService userService;

    @Autowired
    public ContentService(ContentRepository contentRepository, UserService userService) {
        this.contentRepository = contentRepository;
        this.userService = userService;
    }

    public List<ContentItem> getAllContent() {
        return contentRepository.findAll();
    }

    public ContentItem getContentById(String id) {
        return contentRepository.findById(id)
                .orElseThrow(() -> new ContentNotFoundException("Content not found with id: " + id));
    }

    public List<ContentItem> getContentByType(String type) {
        return contentRepository.findByType(type);
    }

    public List<ContentItem> getPublishedContentByType(String type) {
        return contentRepository.findByTypeAndPublishedTrue(type);
    }

    public List<ContentItem> getContentByTag(String tag) {
        return contentRepository.findByDataTagsContaining(tag);
    }
    
    public List<ContentItem> searchContentByTitle(String title) {
        return contentRepository.findByTitleContainingIgnoreCase(title);
    }

    public ContentItem createContent(String type, Map<String, Object> data, String authorId) {
        User author = userService.getUserById(authorId);
        
        ContentItem content = new ContentItem();
        content.setType(type);
        content.setData(data);
        content.setAuthor(author);
        content.setCreatedAt(new Date());
        content.setUpdatedAt(new Date());
        content.setPublished(false);
        content.setComments(new ArrayList<>());
        
        return contentRepository.save(content);
    }

    public ContentItem updateContent(String id, Map<String, Object> data) {
        ContentItem content = getContentById(id);
        
        content.setData(data);
        content.setUpdatedAt(new Date());
        
        return contentRepository.save(content);
    }

    public ContentItem publishContent(String id, boolean published) {
        ContentItem content = getContentById(id);
        
        content.setPublished(published);
        content.setUpdatedAt(new Date());
        
        return contentRepository.save(content);
    }

    public ContentItem addComment(String contentId, String userId, String text) {
        ContentItem content = getContentById(contentId);
        User user = userService.getUserById(userId);
        
        Comment comment = new Comment();
        comment.setId(UUID.randomUUID().toString());
        comment.setUserId(user.getId());
        comment.setUserName(user.getName());
        comment.setText(text);
        comment.setTimestamp(new Date());
        comment.setReplies(new ArrayList<>());
        
        if (content.getComments() == null) {
            content.setComments(new ArrayList<>());
        }
        
        content.getComments().add(comment);
        content.setUpdatedAt(new Date());
        
        return contentRepository.save(content);
    }

    public ContentItem addReplyToComment(String contentId, String commentId, String userId, String text) {
        ContentItem content = getContentById(contentId);
        User user = userService.getUserById(userId);
        
        boolean commentFound = false;
        for (Comment comment : content.getComments()) {
            if (comment.getId().equals(commentId)) {
                Reply reply = new Reply();
                reply.setId(UUID.randomUUID().toString());
                reply.setUserId(user.getId());
                reply.setUserName(user.getName());
                reply.setText(text);
                reply.setTimestamp(new Date());
                
                if (comment.getReplies() == null) {
                    comment.setReplies(new ArrayList<>());
                }
                
                comment.getReplies().add(reply);
                commentFound = true;
                break;
            }
        }
        
        if (!commentFound) {
            throw new ContentNotFoundException("Comment not found with id: " + commentId);
        }
        
        content.setUpdatedAt(new Date());
        
        return contentRepository.save(content);
    }

    public ContentItem addMetadata(String contentId, String key, Object value) {
        ContentItem content = getContentById(contentId);
        
        Map<String, Object> data = content.getData();
        if (data == null) {
            data = new HashMap<>();
        }
        
        data.put(key, value);
        content.setData(data);
        content.setUpdatedAt(new Date());
        
        return contentRepository.save(content);
    }

    public void deleteContent(String id) {
        ContentItem content = getContentById(id);
        contentRepository.delete(content);
    }
}
