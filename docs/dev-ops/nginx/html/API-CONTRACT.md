# x-form 前端接口契约

## 管理端

### 1. 模拟登录
- `POST /api/admin/auth/login`
- 请求：
```json
{ "account": "admin", "password": "123456" }
```
- 响应：
```json
{ "success": true, "data": { "token": "mock-token" } }
```

### 2. 查询表单列表
- `GET /api/admin/forms`
- 响应：
```json
{ "success": true, "data": [{ "id": 1, "title": "报名表", "description": "活动报名", "schema": [] }] }
```

### 3. 创建表单
- `POST /api/admin/forms`
- 请求：
```json
{ "title": "报名表", "description": "活动报名", "schema": [{ "name": "username", "label": "姓名", "type": "text", "required": true }] }
```
- 响应：
```json
{ "success": true, "data": { "id": 1, "title": "报名表" } }
```

### 4. 查询填写记录
- `GET /api/admin/records?formId=1`
- 响应：
```json
{ "success": true, "data": [{ "id": 101, "formId": 1, "userName": "张三", "createTime": "2026-07-23 16:00:00", "payload": { "username": "张三" } }] }
```

## 用户端

### 5. 查询表单详情
- `GET /api/forms/{formId}`
- 响应：
```json
{ "success": true, "data": { "id": 1, "title": "报名表", "description": "活动报名", "schema": [{ "name": "username", "label": "姓名", "type": "text", "required": true }] } }
```

### 6. 提交表单
- `POST /api/forms/{formId}/submit`
- 请求：
```json
{ "payload": { "username": "张三" } }
```
- 响应：
```json
{ "success": true, "data": true }
```
