package com.wz.x.infrastructure.dao.po;

import lombok.Data;

import java.util.Date;

@Data
public class FormRecordPO {

    private Long id;
    private Long formId;
    private String userName;
    private String payloadJson;
    private Date createTime;

}
