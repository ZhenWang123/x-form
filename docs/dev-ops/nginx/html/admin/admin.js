const AdminPage = (() => {
  const api = window.XFormApi;

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.innerText = value ?? '';
  }

  function showMessage(message, isError = false) {
    const el = document.getElementById('message');
    if (!el) return;
    el.innerText = message || '';
    el.style.color = isError ? '#dc2626' : '#2563eb';
  }

  function renderForms(list) {
    setText('formCount', list.length);
    setText('latestForm', list[0]?.title || '-');
    document.getElementById('formTable').innerHTML = list.map(it => `
      <tr>
        <td>${it.id ?? ''}</td>
        <td>${it.title ?? ''}</td>
        <td>${it.description ?? ''}</td>
        <td><a target="_blank" href="/user/?formId=${it.id}">${location.origin}/user/?formId=${it.id}</a></td>
      </tr>
    `).join('');
  }

  function renderRecords(list) {
    setText('recordCount', list.length);
    document.getElementById('recordTable').innerHTML = list.map(it => `
      <tr>
        <td>${it.id ?? ''}</td>
        <td>${it.formId ?? ''}</td>
        <td>${it.userName ?? '-'}</td>
        <td>${it.createTime ?? ''}</td>
        <td><pre>${JSON.stringify(it.payload || {}, null, 2)}</pre></td>
      </tr>
    `).join('');
  }

  async function loadForms() {
    const data = await api.queryForms();
    renderForms(data.data || []);
  }

  async function loadRecords() {
    const formId = document.getElementById('searchFormId').value.trim();
    const data = await api.queryRecords(formId);
    renderRecords(data.data || []);
  }

  async function login() {
    const account = document.getElementById('account').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!account || !password) return showMessage('请输入账号和密码', true);
    try {
      const res = await api.adminLogin({ account, password });
      api.setToken(res.data?.token || 'mock-token');
      document.getElementById('loginPanel').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      showMessage('登录成功');
      await loadForms();
      await loadRecords();
    } catch (e) {
      showMessage(e.message, true);
    }
  }

  async function createForm() {
    try {
      const title = document.getElementById('title').value.trim();
      const description = document.getElementById('description').value.trim();
      const schemaText = document.getElementById('schema').value.trim();
      if (!title || !schemaText) return showMessage('请填写标题和字段定义', true);
      const schema = JSON.parse(schemaText);
      const res = await api.createForm({ title, description, schema });
      const form = res.data || {};
      document.getElementById('shareLink').innerHTML = `分享链接：<a target="_blank" href="/user/?formId=${form.id}">${location.origin}/user/?formId=${form.id}</a>`;
      showMessage('表单创建成功');
      await loadForms();
    } catch (e) {
      showMessage(e.message, true);
    }
  }

  function bindEvents() {
    document.getElementById('loginBtn').onclick = login;
    document.getElementById('createBtn').onclick = createForm;
    document.getElementById('queryRecordBtn').onclick = loadRecords;
  }

  function init() {
    bindEvents();
    if (api.getToken()) {
      document.getElementById('loginPanel').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      loadForms();
      loadRecords();
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', AdminPage.init);
