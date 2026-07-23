package com.wz.x.domain.form.model.entity;

import lombok.Data;

import java.util.Map;

@Data
public class FormRecordEntity {

    private Long id;
    private Long formId;
    private String userName;
    private String createTime;
    private Map<String, Object> payload;

}
