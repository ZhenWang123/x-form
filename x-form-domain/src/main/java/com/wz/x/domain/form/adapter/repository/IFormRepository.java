package com.wz.x.domain.form.adapter.repository;

import com.wz.x.domain.form.model.entity.FormEntity;
import com.wz.x.domain.form.model.entity.FormRecordEntity;

import java.util.List;

public interface IFormRepository {

    Long saveForm(FormEntity formEntity);

    List<FormEntity> queryForms();

    FormEntity queryFormById(Long formId);

    void saveRecord(FormRecordEntity recordEntity);

    List<FormRecordEntity> queryRecords(Long formId);

}
