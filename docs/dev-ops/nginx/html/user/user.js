const UserPage = (() => {
  const api = window.XFormApi;
  const formId = new URLSearchParams(location.search).get('formId');

  function showMessage(message, isError = false) {
    const node = document.getElementById('message');
    if (!node) return;
    node.innerText = message || '';
    node.style.color = isError ? '#dc2626' : '#2563eb';
  }

  function showEmptyState(message) {
    const empty = document.getElementById('emptyState');
    const form = document.getElementById('form');
    if (empty) {
      empty.style.display = 'block';
      empty.innerHTML = message || '当前缺少 formId 参数，请从管理端分享链接进入。';
    }
    if (form) form.innerHTML = '';
  }

  function createField(field) {
    const wrap = document.createElement('div');
    const label = document.createElement('label');
    label.innerText = field.label || field.name;
    const input = field.type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
    input.name = field.name;
    input.placeholder = field.placeholder || '';
    input.required = !!field.required;
    if (field.type !== 'textarea') input.type = field.type || 'text';
    wrap.appendChild(label);
    wrap.appendChild(input);
    return wrap;
  }

  function renderSchema(schema) {
    const form = document.getElementById('form');
    const empty = document.getElementById('emptyState');
    if (empty) empty.style.display = 'none';
    form.innerHTML = '';
    schema.forEach(field => form.appendChild(createField(field)));
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.innerText = '提交表单';
    form.appendChild(btn);
    form.onsubmit = async (e) => {
      e.preventDefault();
      const payload = {};
      new FormData(form).forEach((value, key) => payload[key] = value);
      try {
        const res = await api.submitForm(formId, { payload });
        if (res.code && res.code !== '0000') {
          return showMessage(res.info || '提交失败', true);
        }
        showMessage('提交成功');
        form.reset();
      } catch (e) {
        showMessage(e.message || '提交失败', true);
      }
    };
  }

  async function init() {
    if (!formId) {
      showEmptyState();
      showMessage('未进入具体表单页面');
      return;
    }
    try {
      const res = await api.getFormDetail(formId);
      if (res.code && res.code !== '0000') {
        showEmptyState(res.info || '表单不存在');
        return showMessage(res.info || '表单不存在', true);
      }
      const data = res.data || {};
      document.getElementById('title').innerText = data.title || '未命名表单';
      document.getElementById('description').innerText = data.description || '';
      renderSchema(data.schema || []);
    } catch (e) {
      showEmptyState('表单加载失败');
      showMessage(e.message || '表单加载失败', true);
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', UserPage.init);
