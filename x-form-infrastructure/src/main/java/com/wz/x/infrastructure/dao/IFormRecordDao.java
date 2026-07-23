package com.wz.x.infrastructure.dao;

import com.wz.x.infrastructure.dao.po.FormRecordPO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IFormRecordDao {

    void insert(FormRecordPO formRecordPO);

    List<FormRecordPO> queryRecords(@Param("formId") Long formId);

}
