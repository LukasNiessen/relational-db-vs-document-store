package com.example.cms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Document(collection = "content")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContentItem {
    @Id
    private String id;
    private String type;
    private Map<String, Object> data;

    // Common fields
    private boolean published;
    private Date createdAt;
    private Date updatedAt;
    private User author;
    private List<Comment> comments = new ArrayList<>();
}
