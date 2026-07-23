# 前端本地静态调试说明

当前 `admin` / `user` 页面支持直接通过本地静态服务器打开，例如：
- `http://localhost:63342/...`
- `http://localhost:5500/...`
- `http://localhost:3000/...`

## 默认接口转发规则
当页面运行在上述本地端口时，`common-api.js` 会自动把接口地址指向：

```text
http://127.0.0.1:8091/api
```

也就是说：
- 登录接口会请求：`http://127.0.0.1:8091/api/admin/auth/login`
- 表单列表接口会请求：`http://127.0.0.1:8091/api/admin/forms`

## 自定义接口地址方式
支持三种方式覆盖：

### 1. URL 参数
```text
/user/index.html?apiBase=http://127.0.0.1:8091/api
```

### 2. localStorage
浏览器控制台执行：
```javascript
localStorage.setItem('x_form_api_base', 'http://127.0.0.1:8091/api')
```

### 3. 全局变量
在页面加载前注入：
```javascript
window.__X_FORM_API_BASE__ = 'http://127.0.0.1:8091/api'
```

## 当前页面可见提示
管理端和用户端页面顶部都会显示：
- `当前接口地址：http://127.0.0.1:8091/api`

如果看到的仍然是 `/api`，说明当前页面更适合放到 nginx 反向代理环境中访问，而不是直接由本地静态服务器打开。
