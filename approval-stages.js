// PRAVAAH Approval Stages - Frontend only, illustrative demo data

const AST_TODAY = new Date(2026, 9, 23);

const astInitialStages = [
    { id: 'AST-001', order: 1, name: 'Application Submitted', desc: 'Application received and logged in demo system.', role: 'Demo Intake Officer', duration: '1 day', req: 'Required', status: 'Active' },
    { id: 'AST-002', order: 2, name: 'Initial Scrutiny', desc: 'Basic eligibility and completeness check (illustrative).', role: 'Demo Scrutiny Officer', duration: '2–3 days', req: 'Required', status: 'Active' },
    { id: 'AST-003', order: 3, name: 'Document Review', desc: 'Supporting documents verified against demo checklist.', role: 'Demo Document Reviewer', duration: '3–4 days', req: 'Required', status: 'Active' },
    { id: 'AST-004', order: 4, name: 'Compliance Review', desc: 'Sample compliance items assessed (illustrative).', role: 'Demo Compliance Officer', duration: '2–4 days', req: 'Required', status: 'Active' },
    { id: 'AST-005', order: 5, name: 'Final Decision', desc: 'Consolidated review and demo decision recommendation.', role: 'Demo Approving Authority', duration: '1–2 days', req: 'Required', status: 'Active' }
];

let astStages = astInitialStages.map(s => Object.assign({}, s));
let astSearch = '';
let astStatusFilter = 'all';
let astReqFilter = 'all';
let astSort = 'order-asc';
let astEditId = null;
let astPreviewStage = 'Document Review';

function astEsc(t) { const d = document.createElement('div'); d.textContent = String(t); return d.innerHTML; }

function astGetFiltered() {
    let data = astStages.slice();
    if (astSearch) {
        const s = astSearch.toLowerCase();
        data = data.filter(st => st.name.toLowerCase().includes(s) || st.role.toLowerCase().includes(s) || st.desc.toLowerCase().includes(s));
    }
    if (astStatusFilter !== 'all') data = data.filter(st => st.status === astStatusFilter);
    if (astReqFilter !== 'all') data = data.filter(st => st.req === astReqFilter);
    data.sort((a,b) => {
        if (astSort === 'order-desc') return b.order - a.order;
        if (astSort === 'name-asc') return a.name.localeCompare(b.name);
        if (astSort === 'name-desc') return b.name.localeCompare(a.name);
        return a.order - b.order;
    });
    return data;
}

function astRenderSummary() {
    const grid = document.getElementById('astSummaryGrid');
    if (!grid) return;
    const active = astStages.filter(s => s.status === 'Active').length;
    const optional = astStages.filter(s => s.req === 'Optional').length;
    const cards = [
        { label: 'Total Workflow Stages', value: astStages.length, cls: 'navy' },
        { label: 'Active Demo Stages', value: active, cls: 'green' },
        { label: 'Optional Stages', value: optional, cls: 'amber' },
        { label: 'Applications Represented in Demo', value: '1,248', cls: 'navy' }
    ];
    grid.innerHTML = cards.map(c => `
        <article class="ast-card ast-card--${c.cls}">
            <div class="ast-card__label">${astEsc(c.label)}</div>
            <div class="ast-card__value">${c.value}</div>
            <div class="ast-card__demo">Illustrative</div>
        </article>
    `).join('');
}

function astRenderStepper() {
    const desk = document.getElementById('astStepperDesktop');
    const mob = document.getElementById('astStepperMobile');
    const ordered = astStages.slice().sort((a,b)=>a.order-b.order);
    if (desk) {
        desk.innerHTML = ordered.map((st, idx) => `
            <div class="ast-step">
                <div class="ast-step__head">
                    <div class="ast-step__num">${st.order}</div>
                    <div class="ast-step__name">${astEsc(st.name)}</div>
                </div>
                <div class="ast-step__desc">${astEsc(st.desc)}</div>
                <div class="ast-step__meta"><span>Role:</span> ${astEsc(st.role)}</div>
                <div class="ast-step__meta"><span>Duration:</span> ${astEsc(st.duration)}</div>
                <div class="ast-step__tags">
                    <span class="ast-tag">${st.req}</span>
                    <span class="ast-tag ast-tag--${st.status === 'Active' ? 'ok' : 'muted'}">${st.status}</span>
                </div>
                <div class="ast-step__actions">
                    <button class="ast-link" data-move="up" data-id="${st.id}" ${idx===0?'disabled':''}>↑ Move Up</button>
                    <button class="ast-link" data-move="down" data-id="${st.id}" ${idx===ordered.length-1?'disabled':''}>↓ Move Down</button>
                    <button class="ast-link" data-edit="${st.id}">Edit</button>
                    <button class="ast-link ast-link--warn" data-toggle="${st.id}">${st.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                </div>
            </div>
            ${idx < ordered.length-1 ? '<div class="ast-step__arrow">→</div>' : ''}
        `).join('');
    }
    if (mob) {
        mob.innerHTML = ordered.map((st, idx) => `
            <div class="ast-step-mob">
                <div class="ast-step-mob__head">
                    <div class="ast-step-mob__num">${st.order}</div>
                    <div class="ast-step-mob__name">${astEsc(st.name)}</div>
                </div>
                <div class="ast-step-mob__desc">${astEsc(st.desc)}</div>
                <div class="ast-step-mob__row"><span>Role</span><span>${astEsc(st.role)}</span></div>
                <div class="ast-step-mob__row"><span>Duration</span><span>${astEsc(st.duration)}</span></div>
                <div class="ast-step-mob__row"><span>Req / Status</span><span>${st.req} / ${st.status}</span></div>
                <div class="ast-step-mob__actions">
                    <button class="ast-link" data-move="up" data-id="${st.id}" ${idx===0?'disabled':''}>↑</button>
                    <button class="ast-link" data-move="down" data-id="${st.id}" ${idx===ordered.length-1?'disabled':''}>↓</button>
                    <button class="ast-link" data-edit="${st.id}">Edit</button>
                    <button class="ast-link ast-link--warn" data-toggle="${st.id}">${st.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                </div>
                ${idx < ordered.length-1 ? '<div class="ast-step-mob__arrow">↓</div>' : ''}
            </div>
        `).join('');
    }
}

function astRenderTable() {
    const body = document.getElementById('astConfigBody');
    if (!body) return;
    const data = astGetFiltered();
    body.innerHTML = data.map(st => `
        <tr>
            <td>${st.order}</td>
            <td>${astEsc(st.name)}</td>
            <td>${astEsc(st.desc)}</td>
            <td>${astEsc(st.role)}</td>
            <td>${astEsc(st.duration)}</td>
            <td>${st.req}</td>
            <td><span class="ast-badge ast-badge--${st.status === 'Active' ? 'ok' : 'muted'}">${st.status}</span></td>
            <td class="ast-actions">
                <button class="ast-link" data-move="up" data-id="${st.id}">↑</button>
                <button class="ast-link" data-move="down" data-id="${st.id}">↓</button>
                <button class="ast-link" data-edit="${st.id}">Edit</button>
                <button class="ast-link ast-link--warn" data-toggle="${st.id}">${st.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
            </td>
        </tr>
    `).join('');
}

function astRenderPreview() {
    const sel = document.getElementById('astPreviewStage');
    const stepper = document.getElementById('astPreviewStepper');
    const cur = document.getElementById('astPreviewCurrent');
    if (cur) cur.textContent = astPreviewStage;
    const ordered = astStages.slice().sort((a,b)=>a.order-b.order).filter(s=>s.status==='Active');
    if (sel) {
        sel.innerHTML = ordered.map(s => `<option value="${astEsc(s.name)}">${astEsc(s.name)}</option>`).join('');
        sel.value = astPreviewStage;
    }
    if (stepper) {
        stepper.innerHTML = ordered.map((st, idx) => {
            const state = st.name === astPreviewStage ? 'current' : (ordered.findIndex(x=>x.name===astPreviewStage) > idx ? 'done' : 'upcoming');
            return `
                <div class="ast-pstep ast-pstep--${state}">
                    <div class="ast-pstep__dot">${idx+1}</div>
                    <div class="ast-pstep__info">
                        <div class="ast-pstep__name">${astEsc(st.name)}</div>
                        <div class="ast-pstep__state">${state === 'done' ? 'Completed (demo)' : state === 'current' ? 'Current (demo)' : 'Upcoming'}</div>
                    </div>
                </div>
                ${idx < ordered.length-1 ? '<div class="ast-pstep__line"></div>' : ''}
            `;
        }).join('');
    }
}

function astToast(msg) {
    const t = document.getElementById('astToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('active');
    setTimeout(() => t.classList.remove('active'), 2400);
}

function astOpenModal(edit) {
    const modal = document.getElementById('astStageModal');
    const idInp = document.getElementById('astModalId');
    const name = document.getElementById('astModalName');
    const desc = document.getElementById('astModalDesc');
    const order = document.getElementById('astModalOrder');
    const role = document.getElementById('astModalRole');
    const dur = document.getElementById('astModalDuration');
    const req = document.getElementById('astModalReq');
    const status = document.getElementById('astModalStatus');
    const eyebrow = document.getElementById('astModalEyebrow');
    const title = document.getElementById('astModalTitle');
    ['astErrName','astErrDesc','astErrOrder','astErrRole','astErrDur'].forEach(id => { const e=document.getElementById(id); if(e) e.textContent=''; });
    if (edit) {
        const st = astStages.find(s => s.id === edit);
        astEditId = edit;
        eyebrow.textContent = 'Edit Stage';
        title.textContent = 'Edit Stage';
        if (idInp) idInp.value = st.id;
        if (name) name.value = st.name;
        if (desc) desc.value = st.desc;
        if (order) order.value = st.order;
        if (role) role.value = st.role;
        if (dur) dur.value = st.duration;
        if (req) req.value = st.req;
        if (status) status.value = st.status;
    } else {
        astEditId = null;
        eyebrow.textContent = 'Add Stage';
        title.textContent = 'Add Stage';
        if (name) name.value = '';
        if (desc) desc.value = '';
        if (order) order.value = astStages.length + 1;
        if (role) role.value = '';
        if (dur) dur.value = '';
        if (req) req.value = 'Required';
        if (status) status.value = 'Active';
    }
    if (modal) { modal.classList.add('active'); modal.setAttribute('aria-hidden','false'); }
}

function astCloseModal() {
    const modal = document.getElementById('astStageModal');
    if (modal) { modal.classList.remove('active'); modal.setAttribute('aria-hidden','true'); }
}

function astRefreshAll() {
    astRenderSummary();
    astRenderStepper();
    astRenderTable();
    astRenderPreview();
}

document.addEventListener('DOMContentLoaded', function() {
    astRefreshAll();

    document.getElementById('astStageSearch')?.addEventListener('input', function(){ astSearch = this.value; astRenderTable(); });
    document.getElementById('astStatusFilter')?.addEventListener('change', function(){ astStatusFilter = this.value; astRenderTable(); });
    document.getElementById('astReqFilter')?.addEventListener('change', function(){ astReqFilter = this.value; astRenderTable(); });
    document.getElementById('astSort')?.addEventListener('change', function(){ astSort = this.value; astRenderTable(); });

    document.getElementById('astAddStageBtn')?.addEventListener('click', function(){ astOpenModal(null); });
    document.getElementById('astModalClose')?.addEventListener('click', astCloseModal);
    document.getElementById('astModalCancel')?.addEventListener('click', astCloseModal);
    document.querySelector('#astStageModal .ast-modal__backdrop')?.addEventListener('click', astCloseModal);

    document.getElementById('astModalSave')?.addEventListener('click', function(){
        const name = document.getElementById('astModalName').value.trim();
        const desc = document.getElementById('astModalDesc').value.trim();
        const order = parseInt(document.getElementById('astModalOrder').value);
        const role = document.getElementById('astModalRole').value.trim();
        const dur = document.getElementById('astModalDuration').value.trim();
        const req = document.getElementById('astModalReq').value;
        const status = document.getElementById('astModalStatus').value;
        let ok = true;
        document.getElementById('astErrName').textContent = name ? '' : 'Required';
        document.getElementById('astErrDesc').textContent = desc ? '' : 'Required';
        document.getElementById('astErrOrder').textContent = (order && order > 0) ? '' : 'Valid order required';
        document.getElementById('astErrRole').textContent = role ? '' : 'Required';
        document.getElementById('astErrDur').textContent = dur ? '' : 'Required';
        if (!name || !desc || !order || order < 1 || !role || !dur) ok = false;
        const dup = astStages.some(s => s.order === order && s.id !== astEditId);
        if (dup) { document.getElementById('astErrOrder').textContent = 'Display order must be unique'; ok = false; }
        if (!ok) return;
        if (astEditId) {
            const st = astStages.find(s => s.id === astEditId);
            if (st) { st.name=name; st.desc=desc; st.order=order; st.role=role; st.duration=dur; st.req=req; st.status=status; }
            astToast('Demo configuration updated locally.');
        } else {
            astStages.push({ id: 'AST-' + String(Date.now()).slice(-6), order, name, desc, role, duration: dur, req, status });
            astToast('Demo stage added locally.');
        }
        astCloseModal();
        astRefreshAll();
    });

    document.getElementById('astStepperDesktop')?.addEventListener('click', function(e){
        const move = e.target.closest('[data-move]');
        if (move) {
            const id = move.getAttribute('data-id');
            const dir = move.getAttribute('data-move');
            const idx = astStages.findIndex(s => s.id === id);
            if (dir === 'up' && idx > 0) { const t = astStages[idx].order; astStages[idx].order = astStages[idx-1].order; astStages[idx-1].order = t; }
            if (dir === 'down' && idx < astStages.length-1) { const t = astStages[idx].order; astStages[idx].order = astStages[idx+1].order; astStages[idx+1].order = t; }
            astRefreshAll(); return;
        }
        const edit = e.target.closest('[data-edit]');
        if (edit) { astOpenModal(edit.getAttribute('data-edit')); return; }
        const tog = e.target.closest('[data-toggle]');
        if (tog) {
            const id = tog.getAttribute('data-toggle');
            const st = astStages.find(s => s.id === id);
            if (st) {
                if (st.status === 'Active') {
                    if (confirm('Deactivate this demo stage? This affects only local demonstration.')) {
                        st.status = 'Inactive'; astToast('Demo stage deactivated locally.'); astRefreshAll();
                    }
                } else {
                    st.status = 'Active'; astToast('Demo stage activated locally.'); astRefreshAll();
                }
            }
        }
    });

    document.getElementById('astStepperMobile')?.addEventListener('click', function(e){
        const move = e.target.closest('[data-move]');
        if (move) {
            const id = move.getAttribute('data-id');
            const dir = move.getAttribute('data-move');
            const idx = astStages.findIndex(s => s.id === id);
            if (dir === 'up' && idx > 0) { const t = astStages[idx].order; astStages[idx].order = astStages[idx-1].order; astStages[idx-1].order = t; }
            if (dir === 'down' && idx < astStages.length-1) { const t = astStages[idx].order; astStages[idx].order = astStages[idx+1].order; astStages[idx+1].order = t; }
            astRefreshAll(); return;
        }
        const edit = e.target.closest('[data-edit]');
        if (edit) { astOpenModal(edit.getAttribute('data-edit')); return; }
        const tog = e.target.closest('[data-toggle]');
        if (tog) {
            const id = tog.getAttribute('data-toggle');
            const st = astStages.find(s => s.id === id);
            if (st) {
                if (st.status === 'Active') {
                    if (confirm('Deactivate this demo stage? This affects only local demonstration.')) {
                        st.status = 'Inactive'; astToast('Demo stage deactivated locally.'); astRefreshAll();
                    }
                } else {
                    st.status = 'Active'; astToast('Demo stage activated locally.'); astRefreshAll();
                }
            }
        }
    });

    document.getElementById('astConfigBody')?.addEventListener('click', function(e){
        const move = e.target.closest('[data-move]');
        if (move) {
            const id = move.getAttribute('data-id');
            const dir = move.getAttribute('data-move');
            const idx = astStages.findIndex(s => s.id === id);
            if (dir === 'up' && idx > 0) { const t = astStages[idx].order; astStages[idx].order = astStages[idx-1].order; astStages[idx-1].order = t; }
            if (dir === 'down' && idx < astStages.length-1) { const t = astStages[idx].order; astStages[idx].order = astStages[idx+1].order; astStages[idx+1].order = t; }
            astRefreshAll(); return;
        }
        const edit = e.target.closest('[data-edit]');
        if (edit) { astOpenModal(edit.getAttribute('data-edit')); return; }
        const tog = e.target.closest('[data-toggle]');
        if (tog) {
            const id = tog.getAttribute('data-toggle');
            const st = astStages.find(s => s.id === id);
            if (st) {
                if (st.status === 'Active') {
                    if (confirm('Deactivate this demo stage? This affects only local demonstration.')) {
                        st.status = 'Inactive'; astToast('Demo stage deactivated locally.'); astRefreshAll();
                    }
                } else {
                    st.status = 'Active'; astToast('Demo stage activated locally.'); astRefreshAll();
                }
            }
        }
    });

    document.getElementById('astPreviewStage')?.addEventListener('change', function(){ astPreviewStage = this.value; astRenderPreview(); });
    document.getElementById('astResetDemo')?.addEventListener('click', function(){
        if (confirm('Reset demo configuration to initial state? This affects only local demonstration.')) {
            astStages = astInitialStages.map(s => Object.assign({}, s));
            astSearch=''; astStatusFilter='all'; astReqFilter='all'; astSort='order-asc';
            document.getElementById('astStageSearch').value='';
            document.getElementById('astStatusFilter').value='all';
            document.getElementById('astReqFilter').value='all';
            document.getElementById('astSort').value='order-asc';
            astRefreshAll();
            astToast('Demo configuration reset to initial state.');
        }
    });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') astCloseModal(); });
});
