package com.wz.x.infrastructure.dao;

import com.wz.x.infrastructure.dao.po.FormPO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface IFormDao {

    void insert(FormPO formPO);

    List<FormPO> queryForms();

    FormPO queryById(Long id);

}
