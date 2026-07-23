# x-form 正确启动说明

## 当前结论
- 不能在根工程直接执行 `mvn spring-boot:run`
- 根工程是聚合 `pom`，没有 main class，会报：
  - `Unable to find a suitable main class`
- 真正的启动模块是：`x-form-app`
- main class 已在 `x-form-app/pom.xml` 中配置：`com.wz.x.Application`

## 正确启动方式

### 方式一：进入 app 模块启动（推荐）
```bash
cd C:\项目号\x-form\x-form-app
mvn spring-boot:run
```

### 方式二：从根目录指定 app 模块 pom 启动
```bash
cd C:\项目号\x-form
mvn -f x-form-app\pom.xml spring-boot:run
```

### 方式三：先打包再用 java 启动
```bash
cd C:\项目号\x-form
mvn -q -DskipTests package
java -jar x-form-app\target\x-form-app.jar
```

## 当前默认环境
`application.yml` 默认激活：
```yml
spring:
  profiles:
    active: dev
```

## 当前关键注意点
1. 旧的 `frame_case_mapper.xml` 已移除，否则 MyBatis 会启动失败
2. 根 `pom.xml` 仓库地址已改为 `https`，避免 Maven `http blocker`
3. 当前前端本地静态调试会自动转到：
```text
http://127.0.0.1:8091/api
```

## 启动成功后建议验证
- 登录接口：`POST http://127.0.0.1:8091/api/admin/auth/login`
- 表单列表：`GET http://127.0.0.1:8091/api/admin/forms`
- 用户端详情：`GET http://127.0.0.1:8091/api/forms/{formId}`

### 建议测试顺序
1. 先确认端口启动成功：
```bash
curl http://127.0.0.1:8091
```

2. 测试登录接口：
```bash
curl -X POST http://127.0.0.1:8091/api/admin/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"account\":\"admin\",\"password\":\"123456\"}"
```

3. 测试表单列表：
```bash
curl http://127.0.0.1:8091/api/admin/forms
```

4. 打开本地静态页时，确认页面顶部显示：
```text
当前接口地址：http://127.0.0.1:8091/api
```

## PowerShell 验证示例
如果你在 Windows PowerShell 中执行，推荐用：

### 1. 测试登录接口
```powershell
Invoke-RestMethod -Method POST `
  -Uri "http://127.0.0.1:8091/api/admin/auth/login" `
  -ContentType "application/json" `
  -Body '{"account":"admin","password":"123456"}'
```

### 2. 测试表单列表
```powershell
Invoke-RestMethod -Method GET `
  -Uri "http://127.0.0.1:8091/api/admin/forms"
```
