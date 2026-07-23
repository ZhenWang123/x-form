window.XFormApi = (() => {
  const API_BASE = '/api';
  let token = localStorage.getItem('x_form_admin_token') || '';

  function setToken(value) {
    token = value || '';
    if (token) localStorage.setItem('x_form_admin_token', token);
    else localStorage.removeItem('x_form_admin_token');
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

    const data = await response.json().catch(() => ({ success: false, message: '接口返回不是合法 JSON' }));
    if (!response.ok) {
      throw new Error(data.message || `请求失败: ${response.status}`);
    }
    return data;
  }

  return {
    setToken,
    getToken: () => token,
    request,
    adminLogin: (payload) => request('/admin/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    queryForms: () => request('/admin/forms'),
    createForm: (payload) => request('/admin/forms', { method: 'POST', body: JSON.stringify(payload) }),
    queryRecords: (formId = '') => request('/admin/records' + (formId ? `?formId=${encodeURIComponent(formId)}` : '')),
    getFormDetail: (formId) => request(`/forms/${formId}`),
    submitForm: (formId, payload) => request(`/forms/${formId}/submit`, { method: 'POST', body: JSON.stringify(payload) })
  };
})();
