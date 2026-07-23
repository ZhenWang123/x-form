const UserPage = (() => {
  const api = window.XFormApi;
  const formId = new URLSearchParams(location.search).get('formId');

  function showMessage(message, isError = false) {
    const node = document.getElementById('message');
    if (!node) return;
    node.innerText = message || '';
    node.style.color = isError ? '#dc2626' : '#2563eb';
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
        await api.submitForm(formId, { payload });
        showMessage('提交成功');
        form.reset();
      } catch (e) {
        showMessage(e.message, true);
      }
    };
  }

  async function init() {
    if (!formId) return showMessage('缺少 formId 参数', true);
    try {
      const res = await api.getFormDetail(formId);
      const data = res.data || {};
      document.getElementById('title').innerText = data.title || '未命名表单';
      document.getElementById('description').innerText = data.description || '';
      renderSchema(data.schema || []);
    } catch (e) {
      showMessage(e.message, true);
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', UserPage.init);
