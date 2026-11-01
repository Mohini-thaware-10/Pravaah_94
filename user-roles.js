// PRAVAAH User & Role Management - Frontend only, illustrative demo data

const URM_TODAY = new Date(2026, 9, 23);

const urmInitialUsers = [
    { id: 'U-001', name: 'Portal Administrator', email: 'administrator@example.com', role: 'Portal Administrator', dept: 'Administration Sample', status: 'Active', last: '23 Oct 2026' },
    { id: 'U-002', name: 'Ravi Kumar', email: 'ravi.kumar@example.com', role: 'Authorized Official', dept: 'Approvals Sample', status: 'Active', last: '23 Oct 2026' },
    { id: 'U-003', name: 'Meera Singh', email: 'meera.singh@example.com', role: 'Compliance Reviewer', dept: 'Compliance Sample', status: 'Active', last: '22 Oct 2026' },
    { id: 'U-004', name: 'Anil Desai', email: 'anil.desai@example.com', role: 'Read-Only Viewer', dept: 'Reports Sample', status: 'Invited', last: '21 Oct 2026' }
];

const urmRoles = [
    { role: 'Portal Administrator', caps: ['View dashboard','View applications','Review documents','Review compliance items','View reports','View audit trail','Configure demo workflow','Manage demo users'] },
    { role: 'Authorized Official', caps: ['View dashboard','View applications','Review documents','Review compliance items','View reports','View audit trail'] },
    { role: 'Compliance Reviewer', caps: ['View dashboard','View applications','Review documents','Review compliance items','View reports'] },
    { role: 'Read-Only Viewer', caps: ['View dashboard','View applications','View reports'] }
];

let urmUsers = urmInitialUsers.map(u => Object.assign({}, u));
let urmSearch = '';
let urmRoleFilter = 'all';
let urmStatusFilter = 'all';
let urmSort = 'name-asc';
let urmSelectedId = null;

function urmEsc(t) { const d = document.createElement('div'); d.textContent = String(t); return d.innerHTML; }

function urmGetFiltered() {
    let data = urmUsers.slice();
    if (urmSearch) {
        const s = urmSearch.toLowerCase();
        data = data.filter(u => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.dept.toLowerCase().includes(s));
    }
    if (urmRoleFilter !== 'all') data = data.filter(u => u.role === urmRoleFilter);
    if (urmStatusFilter !== 'all') data = data.filter(u => u.status === urmStatusFilter);
    data.sort((a,b) => {
        if (urmSort === 'name-desc') return b.name.localeCompare(a.name);
        if (urmSort === 'role-asc') return a.role.localeCompare(b.role);
        return a.name.localeCompare(b.name);
    });
    return data;
}

function urmRenderSummary() {
    const grid = document.getElementById('urmSummaryGrid');
    if (!grid) return;
    const active = urmUsers.filter(u => u.status === 'Active').length;
    const pending = urmUsers.filter(u => u.status === 'Invited').length;
    const cards = [
        { label: 'Demo Users', value: urmUsers.length, cls: 'navy' },
        { label: 'Active Demo Profiles', value: active, cls: 'green' },
        { label: 'Demo Roles', value: urmRoles.length, cls: 'amber' },
        { label: 'Pending Invitations', value: pending, cls: 'red' }
    ];
    grid.innerHTML = cards.map(c => `
        <article class="urm-card urm-card--${c.cls}">
            <div class="urm-card__label">${urmEsc(c.label)}</div>
            <div class="urm-card__value">${c.value}</div>
            <div class="urm-card__demo">Illustrative</div>
        </article>
    `).join('');
}

function urmRenderUsers() {
    const body = document.getElementById('urmUsersBody');
    if (!body) return;
    const data = urmGetFiltered();
    body.innerHTML = data.map(u => `
        <tr data-urm="${u.id}">
            <td><button class="urm-row-btn" data-urm="${u.id}">${urmEsc(u.name)}</button></td>
            <td>${urmEsc(u.email)}</td>
            <td>${urmEsc(u.role)}</td>
            <td>${urmEsc(u.dept)}</td>
            <td><span class="urm-badge urm-badge--${u.status === 'Active' ? 'ok' : 'warn'}">${u.status}</span></td>
            <td>${urmEsc(u.last)}</td>
            <td><button class="urm-link" data-urm-view="${u.id}">View</button></td>
        </tr>
    `).join('');
}

function urmRenderRoles() {
    const grid = document.getElementById('urmRolesGrid');
    if (!grid) return;
    grid.innerHTML = urmRoles.map(r => `
        <article class="urm-role-card">
            <div class="urm-role-card__head">
                <div class="urm-role-card__title">${urmEsc(r.role)}</div>
            </div>
            <ul class="urm-cap-list">
                ${r.caps.map(c => `<li>${urmEsc(c)}</li>`).join('')}
            </ul>
            <p class="urm-footnote">Conceptual only.</p>
        </article>
    `).join('');
}

function urmOpenDrawer(id) {
    const u = urmUsers.find(x => x.id === id);
    if (!u) return;
    urmSelectedId = id;
    document.getElementById('urmDrawerName').textContent = u.name;
    document.getElementById('urmDrawerEmail').textContent = u.email;
    document.getElementById('urmDrawerRole').textContent = u.role;
    document.getElementById('urmDrawerDept').textContent = u.dept;
    document.getElementById('urmDrawerStatus').textContent = u.status;
    document.getElementById('urmDrawerLast').textContent = u.last;
    const sel = document.getElementById('urmRoleChangeSelect');
    if (sel) {
        sel.innerHTML = urmRoles.map(r => `<option value="${urmEsc(r.role)}">${urmEsc(r.role)}</option>`).join('');
        sel.value = u.role;
    }
    const drawer = document.getElementById('urmUserDrawer');
    if (drawer) { drawer.classList.add('active'); drawer.setAttribute('aria-hidden','false'); }
}

function urmCloseDrawer() {
    const drawer = document.getElementById('urmUserDrawer');
    if (drawer) { drawer.classList.remove('active'); drawer.setAttribute('aria-hidden','true'); }
}

function urmToast(msg) {
    const t = document.getElementById('urmToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('active');
    setTimeout(() => t.classList.remove('active'), 2400);
}

document.addEventListener('DOMContentLoaded', function() {
    urmRenderSummary();
    urmRenderUsers();
    urmRenderRoles();

    document.getElementById('urmUserSearch')?.addEventListener('input', function(){ urmSearch = this.value; urmRenderUsers(); });
    document.getElementById('urmRoleFilter')?.addEventListener('change', function(){ urmRoleFilter = this.value; urmRenderUsers(); });
    document.getElementById('urmStatusFilter')?.addEventListener('change', function(){ urmStatusFilter = this.value; urmRenderUsers(); });
    document.getElementById('urmSort')?.addEventListener('change', function(){ urmSort = this.value; urmRenderUsers(); });

    document.getElementById('urmUsersBody')?.addEventListener('click', function(e){
        const btn = e.target.closest('.urm-row-btn, [data-urm-view]');
        if (btn) urmOpenDrawer(btn.getAttribute('data-urm') || btn.getAttribute('data-urm-view'));
    });

    document.getElementById('urmDrawerClose')?.addEventListener('click', urmCloseDrawer);
    document.getElementById('urmDrawerCloseBtn')?.addEventListener('click', urmCloseDrawer);
    document.querySelector('#urmUserDrawer .urm-drawer__backdrop')?.addEventListener('click', urmCloseDrawer);

    document.getElementById('urmRoleChangeBtn')?.addEventListener('click', function(){
        const sel = document.getElementById('urmRoleChangeSelect');
        const u = urmUsers.find(x => x.id === urmSelectedId);
        if (u && sel) {
            if (confirm('Change role assignment? This affects only the current demonstration.')) {
                u.role = sel.value;
                urmRenderUsers();
                urmRenderSummary();
                document.getElementById('urmDrawerRole').textContent = u.role;
                urmToast('Role assignment changed locally.');
            }
        }
    });

    document.getElementById('urmAddUserBtn')?.addEventListener('click', function(){
        document.getElementById('urmAddModal').classList.add('active');
        document.getElementById('urmAddModal').setAttribute('aria-hidden','false');
        document.getElementById('urmNewName').value='';
        document.getElementById('urmNewEmail').value='';
        document.getElementById('urmNewDept').value='';
        document.getElementById('urmNewRole').value='Read-Only Viewer';
        document.getElementById('urmNewStatus').value='Active';
        ['urmErrName','urmErrEmail','urmErrDept'].forEach(id=>{const e=document.getElementById(id); if(e}e.textContent='';});
    });
    document.getElementById('urmAddModalClose')?.addEventListener('click', function(){ document.getElementById('urmAddModal').classList.remove('active'); });
    document.getElementById('urmAddCancel')?.addEventListener('click', function(){ document.getElementById('urmAddModal').classList.remove('active'); });
    document.querySelector('#urmAddModal .urm-modal__backdrop')?.addEventListener('click', function(){ document.getElementById('urmAddModal').classList.remove('active'); });

    document.getElementById('urmAddSave')?.addEventListener('click', function(){
        const name = document.getElementById('urmNewName').value.trim();
        const email = document.getElementById('urmNewEmail').value.trim();
        const dept = document.getElementById('urmNewDept').value.trim();
        const role = document.getElementById('urmNewRole').value;
        const status = document.getElementById('urmNewStatus').value;
        let ok=true;
        document.getElementById('urmErrName').textContent = name ? '' : 'Required';
        document.getElementById('urmErrEmail').textContent = (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ? '' : 'Valid email required';
        document.getElementById('urmErrDept').textContent = dept ? '' : 'Required';
        if(!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !dept) ok=false;
        if(!ok) return;
        urmUsers.push({ id: 'U-' + String(Date.now()).slice(-4), name, email, role, dept, status, last: URM_TODAY.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) });
        document.getElementById('urmAddModal').classList.remove('active');
        urmRenderUsers();
        urmRenderSummary();
        urmToast('Demo user added locally. No account or login credentials were created.');
    });

    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { urmCloseDrawer(); document.getElementById('urmAddModal').classList.remove('active'); } });
});