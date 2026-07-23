package com.wz.x.domain.form.model.entity;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class FormEntity {

    private Long id;
    private String title;
    private String description;
    private List<Map<String, Object>> schema;

}
