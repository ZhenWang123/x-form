package com.wz.x.api.form.request;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class FormCreateRequest {

    private String title;
    private String description;
    private List<Map<String, Object>> schema;

}
