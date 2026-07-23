package com.wz.x.infrastructure.adapter.repository;

import com.wz.x.domain.form.adapter.repository.IFormRepository;
import com.wz.x.domain.form.model.entity.FormEntity;
import com.wz.x.domain.form.model.entity.FormRecordEntity;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class FormRepository implements IFormRepository {

    private final AtomicLong formIdSeq = new AtomicLong(1);
    private final AtomicLong recordIdSeq = new AtomicLong(1001);
    private final Map<Long, FormEntity> formStore = new ConcurrentHashMap<>();
    private final List<FormRecordEntity> recordStore = Collections.synchronizedList(new ArrayList<>());

    @Override
    public Long saveForm(FormEntity formEntity) {
        Long id = formIdSeq.getAndIncrement();
        formEntity.setId(id);
        formStore.put(id, formEntity);
        return id;
    }

    @Override
    public List<FormEntity> queryForms() {
        List<FormEntity> list = new ArrayList<>(formStore.values());
        list.sort((a, b) -> Long.compare(b.getId(), a.getId()));
        return list;
    }

    @Override
    public FormEntity queryFormById(Long formId) {
        return formStore.get(formId);
    }

    @Override
    public void saveRecord(FormRecordEntity recordEntity) {
        recordEntity.setId(recordIdSeq.getAndIncrement());
        recordEntity.setCreateTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        recordStore.add(recordEntity);
    }

    @Override
    public List<FormRecordEntity> queryRecords(Long formId) {
        if (formId == null) {
            return new ArrayList<>(recordStore);
        }
        List<FormRecordEntity> list = new ArrayList<>();
        synchronized (recordStore) {
            for (FormRecordEntity item : recordStore) {
                if (formId.equals(item.getFormId())) {
                    list.add(item);
                }
            }
        }
        return list;
    }

}
