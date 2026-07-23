package com.wz.x.infrastructure.dao.po;

import lombok.Data;

import java.util.Date;

@Data
public class FormPO {

    private Long id;
    private String title;
    private String description;
    private String schemaJson;
    private Date createTime;
    private Date updateTime;

}
