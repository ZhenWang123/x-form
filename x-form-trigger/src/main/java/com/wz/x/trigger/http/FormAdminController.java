package com.wz.x.trigger.http;

import com.wz.x.api.form.request.FormCreateRequest;
import com.wz.x.api.form.response.FormRecordResponse;
import com.wz.x.api.form.response.FormResponse;
import com.wz.x.api.response.Response;
import com.wz.x.domain.form.model.entity.FormEntity;
import com.wz.x.domain.form.model.entity.FormRecordEntity;
import com.wz.x.domain.form.service.IFormService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class FormAdminController {

    @Resource
    private IFormService formService;

    @PostMapping("/auth/login")
    public Response<Object> login(@RequestBody java.util.Map<String, Object> request) {
        return Response.<Object>builder().code("0000").info("success").data(java.util.Map.of("token", "mock-token")).build();
    }

    @GetMapping("/forms")
    public Response<List<FormResponse>> queryForms() {
        List<FormResponse> result = formService.queryForms().stream().map(this::toResponse).toList();
        return Response.<List<FormResponse>>builder().code("0000").info("success").data(result).build();
    }

    @PostMapping("/forms")
    public Response<FormResponse> createForm(@RequestBody FormCreateRequest request) {
        Long formId = formService.createForm(request.getTitle(), request.getDescription(), request.getSchema());
        FormEntity entity = formService.queryFormById(formId);
        return Response.<FormResponse>builder().code("0000").info("success").data(toResponse(entity)).build();
    }

    @GetMapping("/records")
    public Response<List<FormRecordResponse>> queryRecords(@RequestParam(value = "formId", required = false) Long formId) {
        List<FormRecordResponse> result = formService.queryRecords(formId).stream().map(this::toRecordResponse).toList();
        return Response.<List<FormRecordResponse>>builder().code("0000").info("success").data(result).build();
    }

    private FormResponse toResponse(FormEntity entity) {
        FormResponse response = new FormResponse();
        response.setId(entity.getId());
        response.setTitle(entity.getTitle());
        response.setDescription(entity.getDescription());
        response.setSchema(entity.getSchema());
        return response;
    }

    private FormRecordResponse toRecordResponse(FormRecordEntity entity) {
        FormRecordResponse response = new FormRecordResponse();
        response.setId(entity.getId());
        response.setFormId(entity.getFormId());
        response.setUserName(entity.getUserName());
        response.setCreateTime(entity.getCreateTime());
        response.setPayload(entity.getPayload());
        return response;
    }
}
