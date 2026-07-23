package com.wz.x.domain.form.service;

import com.wz.x.domain.form.model.entity.FormEntity;
import com.wz.x.domain.form.model.entity.FormRecordEntity;

import java.util.List;
import java.util.Map;

public interface IFormService {

    Long createForm(String title, String description, List<Map<String, Object>> schema);

    List<FormEntity> queryForms();

    FormEntity queryFormById(Long formId);

    void submitForm(Long formId, Map<String, Object> payload);

    List<FormRecordEntity> queryRecords(Long formId);

}
