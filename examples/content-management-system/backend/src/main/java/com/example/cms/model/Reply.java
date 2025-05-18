package com.example.cms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reply {
    private String id;
    private String userId;
    private String userName;
    private String text;
    private Date timestamp;
}
