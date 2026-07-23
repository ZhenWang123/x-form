const AdminPage = (() => {
  const api = window.XFormApi;
  let currentUser = null;

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

  function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.toggle('active', section.id === sectionId);
    });
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });
  }

  function renderForms(list) {
    setText('formCount', list.length);
    setText('latestForm', list[0]?.title || '-');
    document.getElementById('formTable').innerHTML = list.length ? list.map(it => `
      <tr>
        <td>${it.id ?? ''}</td>
        <td>${it.title ?? ''}</td>
        <td>${it.description ?? ''}</td>
        <td><a target="_blank" href="/user/?formId=${it.id}">${location.origin}/user/?formId=${it.id}</a></td>
      </tr>
    `).join('') : '<tr><td colspan="4" class="muted">暂无表单数据</td></tr>';
    document.getElementById('dashboardSummary').innerHTML = list.length
      ? `当前共 ${list.length} 个表单，最近一个表单是「${list[0].title || '-'}」。`
      : '当前还没有创建任何表单，请先到“表单管理”创建表单。';
  }

  function renderRecords(list) {
    setText('recordCount', list.length);
    document.getElementById('recordTable').innerHTML = list.length ? list.map(it => `
      <tr>
        <td>${it.id ?? ''}</td>
        <td>${it.formId ?? ''}</td>
        <td>${it.userName ?? '-'}</td>
        <td>${it.createTime ?? ''}</td>
        <td><pre>${JSON.stringify(it.payload || {}, null, 2)}</pre></td>
      </tr>
    `).join('') : '<tr><td colspan="5" class="muted">暂无填写记录</td></tr>';
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
      if (res.code && res.code !== '0000') {
        return showMessage(res.info || '登录失败', true);
      }
      const token = res.data?.token || '';
      api.setToken(token);
      currentUser = account;
      document.getElementById('loginPanel').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      document.getElementById('userBar').innerText = `当前登录：${account}`;
      showMessage('登录成功');
      await loadForms();
      await loadRecords();
      switchSection('dashboardSection');
    } catch (e) {
      showMessage(e.message || '登录失败', true);
    }
  }

  function logout() {
    api.setToken('');
    currentUser = null;
    document.getElementById('loginPanel').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('userBar').innerText = '';
    showMessage('已退出登录');
  }

  async function createForm() {
    try {
      const title = document.getElementById('title').value.trim();
      const description = document.getElementById('description').value.trim();
      const schemaText = document.getElementById('schema').value.trim();
      if (!title || !schemaText) return showMessage('请填写标题和字段定义', true);
      const schema = JSON.parse(schemaText);
      const res = await api.createForm({ title, description, schema });
      if (res.code && res.code !== '0000') {
        return showMessage(res.info || '创建表单失败', true);
      }
      const form = res.data || {};
      document.getElementById('shareLink').innerHTML = `分享链接：<a target="_blank" href="/user/?formId=${form.id}">${location.origin}/user/?formId=${form.id}</a>`;
      showMessage('表单创建成功');
      await loadForms();
      switchSection('formsSection');
    } catch (e) {
      showMessage(e.message || '创建失败', true);
    }
  }

  function bindNavEvents() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (document.getElementById('dashboard').style.display === 'none') {
          showMessage('请先登录后再查看后台功能', true);
          return;
        }
        switchSection(item.dataset.section);
      });
    });
  }

  function bindEvents() {
    document.getElementById('loginBtn').onclick = login;
    document.getElementById('logoutBtn').onclick = logout;
    document.getElementById('createBtn').onclick = createForm;
    document.getElementById('queryRecordBtn').onclick = loadRecords;
    bindNavEvents();
  }

  async function restoreSession() {
    if (!api.getToken()) return;
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('userBar').innerText = '当前登录：已登录用户';
    await loadForms();
    await loadRecords();
  }

  function init() {
    bindEvents();
    const apiBaseTip = document.getElementById('apiBaseTip');
    if (apiBaseTip) apiBaseTip.innerText = `当前接口地址：${api.getApiBase()}`;
    restoreSession().catch(err => showMessage(err.message || '恢复登录态失败', true));
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', AdminPage.init);
