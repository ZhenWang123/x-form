window.XFormApi = (() => {
  function resolveApiBase() {
    const queryApiBase = new URLSearchParams(location.search).get('apiBase');
    const localApiBase = localStorage.getItem('x_form_api_base');
    const globalApiBase = window.__X_FORM_API_BASE__;
    if (queryApiBase) return queryApiBase.replace(/\/$/, '');
    if (localApiBase) return localApiBase.replace(/\/$/, '');
    if (globalApiBase) return String(globalApiBase).replace(/\/$/, '');

    const host = location.hostname;
    const port = location.port;

    if (host === 'localhost' || host === '127.0.0.1') {
      if (port === '63342' || port === '5500' || port === '3000') {
        return 'http://127.0.0.1:8091/api';
      }
      if (port === '8091') {
        return 'http://127.0.0.1:8091/api';
      }
    }

    return '/api';
  }

  const API_BASE = resolveApiBase();
  let token = localStorage.getItem('x_form_admin_token') || '';

  function setToken(value) {
    token = value || '';
    if (token) localStorage.setItem('x_form_admin_token', token);
    else localStorage.removeItem('x_form_admin_token');
  }

  function setApiBase(value) {
    if (value) localStorage.setItem('x_form_api_base', value.replace(/\/$/, ''));
    else localStorage.removeItem('x_form_api_base');
  }

  async function request(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(API_BASE + path, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({ code: '5000', info: '接口返回不是合法 JSON', data: null }));
    if (!response.ok) {
      throw new Error(data.info || data.message || `请求失败: ${response.status}`);
    }
    return data;
  }

  return {
    setToken,
    getToken: () => token,
    getApiBase: () => API_BASE,
    setApiBase,
    request,
    adminLogin: (payload) => request('/admin/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    queryForms: () => request('/admin/forms'),
    createForm: (payload) => request('/admin/forms', { method: 'POST', body: JSON.stringify(payload) }),
    queryRecords: (formId = '') => request('/admin/records' + (formId ? `?formId=${encodeURIComponent(formId)}` : '')),
    getFormDetail: (formId) => request(`/forms/${formId}`),
    submitForm: (formId, payload) => request(`/forms/${formId}/submit`, { method: 'POST', body: JSON.stringify(payload) })
  };
})();
