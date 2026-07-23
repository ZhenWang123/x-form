package com.wz.x.api.form.response;

import lombok.Data;

import java.util.Map;

@Data
public class FormRecordResponse {

    private Long id;
    private Long formId;
    private String userName;
    private String createTime;
    private Map<String, Object> payload;

}
