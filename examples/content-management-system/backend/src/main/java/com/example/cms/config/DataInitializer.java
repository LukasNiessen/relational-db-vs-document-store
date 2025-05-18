package com.example.cms.config;

import com.example.cms.model.User;
import com.example.cms.service.ContentService;
import com.example.cms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserService userService, ContentService contentService) {
        return args -> {
            // Create sample users
            User user1 = new User();
            user1.setName("Jane Smith");
            user1.setEmail("jane@example.com");
            user1.setRole("ADMIN");
            userService.createUser(user1);
            
            User user2 = new User();
            user2.setName("John Doe");
            user2.setEmail("john@example.com");
            user2.setRole("EDITOR");
            userService.createUser(user2);
            
            // Create article content
            Map<String, Object> articleData = new HashMap<>();
            articleData.put("title", "Understanding NoSQL Databases");
            articleData.put("content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget urna ultrices ultricies.");
            articleData.put("tags", Arrays.asList("database", "nosql", "tutorial"));
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("viewCount", 1250);
            metadata.put("likeCount", 42);
            metadata.put("featuredImage", "/images/nosql-header.jpg");
            metadata.put("estimatedReadTime", 8);
            articleData.put("metadata", metadata);
            
            contentService.createContent("article", articleData, user1.getId());
            
            // Create product content
            Map<String, Object> productData = new HashMap<>();
            productData.put("name", "Premium Ergonomic Chair");
            productData.put("price", 299.99);
            productData.put("categories", Arrays.asList("furniture", "office", "ergonomic"));
            
            Map<String, Object> blackVariant = new HashMap<>();
            blackVariant.put("color", "black");
            blackVariant.put("sku", "EC-BLK-001");
            blackVariant.put("inStock", 23);
            
            Map<String, Object> grayVariant = new HashMap<>();
            grayVariant.put("color", "gray");
            grayVariant.put("sku", "EC-GRY-001");
            grayVariant.put("inStock", 14);
            
            productData.put("variants", Arrays.asList(blackVariant, grayVariant));
            
            Map<String, Object> specifications = new HashMap<>();
            specifications.put("weight", "15kg");
            specifications.put("dimensions", "65x70x120cm");
            specifications.put("material", "Mesh and aluminum");
            productData.put("specifications", specifications);
            
            contentService.createContent("product", productData, user2.getId());
            
            System.out.println("Sample data initialized successfully!");
        };
    }
}
