package com.wz.x.infrastructure.adapter.repository;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.wz.x.domain.form.adapter.repository.IFormRepository;
import com.wz.x.domain.form.model.entity.FormEntity;
import com.wz.x.domain.form.model.entity.FormRecordEntity;
import com.wz.x.infrastructure.dao.IFormDao;
import com.wz.x.infrastructure.dao.IFormRecordDao;
import com.wz.x.infrastructure.dao.po.FormPO;
import com.wz.x.infrastructure.dao.po.FormRecordPO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Repository;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

@Repository
public class FormRepository implements IFormRepository {

    @Resource
    private IFormDao formDao;
    @Resource
    private IFormRecordDao formRecordDao;

    @Override
    public Long saveForm(FormEntity formEntity) {
        FormPO formPO = new FormPO();
        formPO.setTitle(formEntity.getTitle());
        formPO.setDescription(formEntity.getDescription());
        formPO.setSchemaJson(JSON.toJSONString(formEntity.getSchema()));
        formDao.insert(formPO);
        return formPO.getId();
    }

    @Override
    public List<FormEntity> queryForms() {
        java.util.ArrayList<FormEntity> list = new java.util.ArrayList<>();
        for (FormPO item : formDao.queryForms()) {
            list.add(toEntity(item));
        }
        return list;
    }

    @Override
    public FormEntity queryFormById(Long formId) {
        FormPO formPO = formDao.queryById(formId);
        return formPO == null ? null : toEntity(formPO);
    }

    @Override
    public void saveRecord(FormRecordEntity recordEntity) {
        FormRecordPO recordPO = new FormRecordPO();
        recordPO.setFormId(recordEntity.getFormId());
        recordPO.setUserName(recordEntity.getUserName());
        recordPO.setPayloadJson(JSON.toJSONString(recordEntity.getPayload()));
        formRecordDao.insert(recordPO);
    }

    @Override
    public List<FormRecordEntity> queryRecords(Long formId) {
        java.util.ArrayList<FormRecordEntity> list = new java.util.ArrayList<>();
        for (FormRecordPO item : formRecordDao.queryRecords(formId)) {
            list.add(toRecordEntity(item));
        }
        return list;
    }

    private FormEntity toEntity(FormPO po) {
        FormEntity entity = new FormEntity();
        entity.setId(po.getId());
        entity.setTitle(po.getTitle());
        entity.setDescription(po.getDescription());
        entity.setSchema(JSON.parseObject(po.getSchemaJson(), new TypeReference<List<Map<String, Object>>>() {}));
        return entity;
    }

    private FormRecordEntity toRecordEntity(FormRecordPO po) {
        FormRecordEntity entity = new FormRecordEntity();
        entity.setId(po.getId());
        entity.setFormId(po.getFormId());
        entity.setUserName(po.getUserName());
        entity.setCreateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(po.getCreateTime()));
        entity.setPayload(JSON.parseObject(po.getPayloadJson(), new TypeReference<Map<String, Object>>() {}));
        return entity;
    }

}
