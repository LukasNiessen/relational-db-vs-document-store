package com.example.cms.repository;

import com.example.cms.model.ContentItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepository extends MongoRepository<ContentItem, String> {
    List<ContentItem> findByType(String type);
    
    List<ContentItem> findByTypeAndPublishedTrue(String type);
    
    @Query("{'data.tags': ?0}")
    List<ContentItem> findByDataTagsContaining(String tag);
    
    @Query("{'data.title': {$regex: ?0, $options: 'i'}}")
    List<ContentItem> findByTitleContainingIgnoreCase(String title);
}
