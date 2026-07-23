package com.wz.x.domain.form.service.impl;

import com.wz.x.domain.form.adapter.repository.IFormRepository;
import com.wz.x.domain.form.model.entity.FormEntity;
import com.wz.x.domain.form.model.entity.FormRecordEntity;
import com.wz.x.domain.form.service.IFormService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class FormServiceImpl implements IFormService {

    @Resource
    private IFormRepository formRepository;

    @Override
    public Long createForm(String title, String description, List<Map<String, Object>> schema) {
        FormEntity formEntity = new FormEntity();
        formEntity.setTitle(title);
        formEntity.setDescription(description);
        formEntity.setSchema(schema);
        return formRepository.saveForm(formEntity);
    }

    @Override
    public List<FormEntity> queryForms() {
        return formRepository.queryForms();
    }

    @Override
    public FormEntity queryFormById(Long formId) {
        return formRepository.queryFormById(formId);
    }

    @Override
    public void submitForm(Long formId, Map<String, Object> payload) {
        FormRecordEntity recordEntity = new FormRecordEntity();
        recordEntity.setFormId(formId);
        recordEntity.setUserName(String.valueOf(payload.getOrDefault("userName", "匿名用户")));
        recordEntity.setPayload(payload);
        formRepository.saveRecord(recordEntity);
    }

    @Override
    public List<FormRecordEntity> queryRecords(Long formId) {
        return formRepository.queryRecords(formId);
    }

}
