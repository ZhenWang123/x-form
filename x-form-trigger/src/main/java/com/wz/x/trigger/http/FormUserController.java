package com.wz.x.trigger.http;

import com.wz.x.api.form.request.FormSubmitRequest;
import com.wz.x.api.form.response.FormRecordResponse;
import com.wz.x.api.form.response.FormResponse;
import com.wz.x.api.response.Response;
import com.wz.x.domain.form.model.entity.FormEntity;
import com.wz.x.domain.form.model.entity.FormRecordEntity;
import com.wz.x.domain.form.service.IFormService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
@RestController
@RequestMapping("/api/forms")
public class FormUserController {

    @Resource
    private IFormService formService;

    @GetMapping("/{formId}")
    public Response<FormResponse> queryForm(@PathVariable Long formId) {
        FormEntity entity = formService.queryFormById(formId);
        FormResponse response = new FormResponse();
        response.setId(entity.getId());
        response.setTitle(entity.getTitle());
        response.setDescription(entity.getDescription());
        response.setSchema(entity.getSchema());
        return Response.<FormResponse>builder().code("0000").info("success").data(response).build();
    }

    @PostMapping("/{formId}/submit")
    public Response<Boolean> submit(@PathVariable Long formId, @RequestBody FormSubmitRequest request) {
        formService.submitForm(formId, request.getPayload());
        return Response.<Boolean>builder().code("0000").info("success").data(Boolean.TRUE).build();
    }
}
