package com.wz.x.api.form.response;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class FormResponse {

    private Long id;
    private String title;
    private String description;
    private List<Map<String, Object>> schema;

}
