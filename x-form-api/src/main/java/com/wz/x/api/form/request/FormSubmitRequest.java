package com.wz.x.api.form.request;

import lombok.Data;

import java.util.Map;

@Data
public class FormSubmitRequest {

    private Map<String, Object> payload;

}
