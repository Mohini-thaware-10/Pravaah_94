// PRAVAAH Approval-to-Compliance Continuity (UI-only, local mock data)

const atcApps = [
    { id: 'APP-2026-0142', name: 'Western Institute of Technology' },
    { id: 'APP-2026-0187', name: 'Deccan College of Engineering' },
    { id: 'APP-2026-0214', name: 'National Technical Institute' }
];

const atcLifecycleBase = [
    { key: 'received', label: 'Application Received', status: 'Completed', date: '2026-09-10' },
    { key: 'scrutiny', label: 'Scrutiny', status: 'Completed', date: '2026-09-16' },
    { key: 'decision', label: 'Review & Decision', status: 'Completed', date: '2026-09-22' },
    { key: 'conditions', label: 'Conditions & Obligations', status: 'Active', date: '2026-09-25' },
    { key: 'evidence', label: 'Evidence Submission', status: 'Pending', date: '' },
    { key: 'compliance', label: 'Compliance Review', status: 'Pending', date: '' },
    { key: 'closure', label: 'Closure', status: 'Pending', date: '' }
];

const atcObligations = [
    { id: 'OBL-0142-001', appId: 'APP-2026-0142', desc: 'Submit the illustrative facility documentation.', source: 'Sample obligation (demo)', responsible: 'Institution Liaison', due: '2026-10-28', status: 'Evidence Pending', evidence: ['EV-0142-001'], notes: 'Demo note: verify layout plans as sample.', updated: '2026-09-26' },
    { id: 'OBL-0142-002', appId: 'APP-2026-0142', desc: 'Review the sample faculty documentation.', source: 'Sample obligation (demo)', responsible: 'Faculty Review Cell', due: '2026-10-20', status: 'Under Review', evidence: ['EV-0142-002'], notes: 'Initial sample review started.', updated: '2026-09-28' },
    { id: 'OBL-0187-001', appId: 'APP-2026-0187', desc: 'Provide the demonstration compliance evidence requested for this fictional application.', source: 'Sample obligation (demo)', responsible: 'Compliance Cell', due: '2026-10-15', status: 'Not Started', evidence: ['EV-0187-001'], notes: '', updated: '2026-09-25' },
    { id: 'OBL-0187-002', appId: 'APP-2026-0187', desc: 'Submit the illustrative facility documentation.', source: 'Sample obligation (demo)', responsible: 'Institution Liaison', due: '2026-10-25', status: 'Changes Requested', evidence: ['EV-0187-002'], notes: 'Demo: sample clarification requested.', updated: '2026-09-29' },
    { id: 'OBL-0214-001', appId: 'APP-2026-0214', desc: 'Review the sample faculty documentation.', source: 'Sample obligation (demo)', responsible: 'Faculty Review Cell', due: '2026-10-10', status: 'Not Started', evidence: ['EV-0214-001'], notes: '', updated: '2026-09-24' }
];

const atcEvidence = [
    { id: 'EV-0142-001', oblId: 'OBL-0142-001', appId: 'APP-2026-0142', name: 'Facility Layout Plan (Sample)', category: 'Infrastructure', submitted: '2026-09-30', status: 'Submitted', reviewer: 'Demo Reviewer', comment: 'Received as sample.', version: 'v1.0' },
    { id: 'EV-0142-002', oblId: 'OBL-0142-002', appId: 'APP-2026-0142', name: 'Faculty List (Sample)', category: 'Faculty', submitted: '2026-09-28', status: 'Under Review', reviewer: 'Demo Reviewer', comment: 'Review in progress.', version: 'v1.0' },
    { id: 'EV-0187-001', oblId: 'OBL-0187-001', appId: 'APP-2026-0187', name: 'Compliance Checklist (Sample)', category: 'Compliance', submitted: '', status: 'Pending', reviewer: '-', comment: '', version: 'v0.9' },
    { id: 'EV-0187-002', oblId: 'OBL-0187-002', appId: 'APP-2026-0187', name: 'Facility Layout Plan (Sample)', category: 'Infrastructure', submitted: '2026-09-27', status: 'Changes Requested', reviewer: 'Demo Reviewer', comment: 'Demo: sample clarification needed.', version: 'v1.0' },
    { id: 'EV-0214-001', oblId: 'OBL-0214-001', appId: 'APP-2026-0214', name: 'Faculty List (Sample)', category: 'Faculty', submitted: '', status: 'Pending', reviewer: '-', comment: '', version: 'v0.9' }
];

const atcHistory = [
    { id: 1, date: '2026-09-10 09:00', event: 'Application moved to review.', actor: 'Demo System', appId: 'APP-2026-0142', oblId: '-', evId: '-' },
    { id: 2, date: '2026-09-25 11:00', event: 'Sample condition linked to the application.', actor: 'Demo Officer', appId: 'APP-2026-0142', oblId: 'OBL-0142-001', evId: '-' },
    { id: 3, date: '2026-09-28 14:20', event: 'Supporting evidence marked as received.', actor: 'Demo Liaison', appId: 'APP-2026-0142', oblId: 'OBL-0142-002', evId: 'EV-0142-002' },
    { id: 4, date: '2026-09-29 10:15', event: 'Reviewer requested additional information.', actor: 'Demo Reviewer', appId: 'APP-2026-0187', oblId: 'OBL-0187-002', evId: 'EV-0187-002' },
    { id: 5, date: '2026-09-30 15:00', event: 'Updated evidence submitted in the demo.', actor: 'Demo Liaison', appId: 'APP-2026-0142', oblId: 'OBL-0142-001', evId: 'EV-0142-001' },
    { id: 6, date: '2026-09-28 16:00', event: 'Reviewer completed the sample review (demo).', actor: 'Demo Reviewer', appId: 'APP-2026-0142', oblId: 'OBL-0142-002', evId: 'EV-0142-002' }
];

let atcSelectedApp = atcApps[0].id;
let atcSelectedObl = null;

function atcDaysDiff(due){
    if(!due) return null;
    const today = new Date('2026-10-01');
    const d = new Date(due + 'T00:00:00');
    const diff = Math.ceil((d - today)/(1000*60*60*24));
    return diff;
}

function atcRender(){
    const sel = document.getElementById('atcAppSelect');
    const sum = document.getElementById('atcSummaryGrid');
    const lc = document.getElementById('atcLifecycle');
    const obl = document.getElementById('atcObligations');
    const dl = document.getElementById('atcDeadlines');
    const ev = document.getElementById('atcEvidence');
    const hist = document.getElementById('atcHistory');
    const rev = document.getElementById('atcReview');
    if(!sel || !sum || !lc) return;

    if(sel.options.length === 0){
        atcApps.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.id;
            opt.textContent = a.id + ' — ' + a.name;
            sel.appendChild(opt);
        });
        sel.value = atcSelectedApp;
        sel.addEventListener('change', () => {
            atcSelectedApp = sel.value;
            atcRender();
        });
    } else {
        sel.value = atcSelectedApp;
    }

    const appObls = atcObligations.filter(o => o.appId === atcSelectedApp);
    const appEvs = atcEvidence.filter(e => e.appId === atcSelectedApp);
    const appHist = atcHistory.filter(h => h.appId === atcSelectedApp);

    const linked = appObls.length;
    const evPending = appEvs.filter(e => e.status === 'Pending' || e.status === 'Changes Requested').length;
    const reviewsInProg = appObls.filter(o => o.status === 'Under Review' || o.status === 'Evidence Pending').length;
    const today = new Date('2026-10-01');
    let upcoming=0, overdue=0;
    appObls.forEach(o => {
        const d = atcDaysDiff(o.due);
        if(d === null) return;
        if(d < 0) overdue++;
        else if(d >= 0 && d <= 30) upcoming++;
    });

    sum.innerHTML = `
        <div class="atc-scard"><div class="atc-scard__label">Linked Obligations</div><div class="atc-scard__value">${linked}</div></div>
        <div class="atc-scard"><div class="atc-scard__label">Evidence Pending</div><div class="atc-scard__value">${evPending}</div></div>
        <div class="atc-scard"><div class="atc-scard__label">Reviews In Progress</div><div class="atc-scard__value">${reviewsInProg}</div></div>
        <div class="atc-scard atc-scard--warn"><div class="atc-scard__label">Upcoming Deadlines</div><div class="atc-scard__value">${upcoming}</div></div>
        <div class="atc-scard atc-scard--bad"><div class="atc-scard__label">Overdue Obligations</div><div class="atc-scard__value">${overdue}</div></div>
    `;

    lc.innerHTML = atcLifecycleBase.map(st => {
        let cls = 'atc-lc__item';
        if(st.status === 'Completed') cls += ' atc-lc__item--done';
        else if(st.status === 'Active') cls += ' atc-lc__item--active';
        else if(st.status === 'Pending') cls += ' atc-lc__item--pending';
        return `<div class="${cls}"><div class="atc-lc__name">${st.label}</div><div class="atc-lc__meta"><span>${st.status}</span>${st.date ? '<span>• ' + st.date + '</span>' : ''}<span>• Linked: ${appObls.length}</span></div></div>`;
    }).join('');

    obl.innerHTML = appObls.length ? appObls.map(o => {
        return `<div class="atc-obl"><div class="atc-obl__head"><div><div class="atc-obl__id">${o.id}</div><div class="atc-obl__desc">${o.desc}</div><div class="atc-obl__meta">Source: ${o.source} • Responsible: ${o.responsible} • Due: ${o.due} • Updated: ${o.updated}</div></div><span class="atc-pill">${o.status}</span></div><div class="atc-obl__foot"><button class="atc-btn" data-obl="${o.id}">View Obligation Detail</button></div></div>`;
    }).join('') : '<div class="atc-empty">No sample obligations for this demo application.</div>';

    obl.querySelectorAll('button[data-obl]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-obl');
            const o = atcObligations.find(x => x.id === id);
            if(!o) return;
            atcSelectedObl = o.id;
            const body = document.getElementById('atcOblDrawerBody');
            const evs = atcEvidence.filter(e => e.oblId === o.id);
            if(body){
                body.innerHTML = `
                    <div class="atc-dsec"><div class="atc-dsec__title">Obligation</div><div class="atc-drow"><span>ID</span><span>${o.id}</span></div><div class="atc-drow"><span>App</span><span>${o.appId}</span></div><div class="atc-drow"><span>Description</span><span>${o.desc}</span></div><div class="atc-drow"><span>Source/Rationale</span><span>${o.source}</span></div><div class="atc-drow"><span>Responsible</span><span>${o.responsible}</span></div><div class="atc-drow"><span>Due</span><span>${o.due}</span></div><div class="atc-drow"><span>Status</span><span>${o.status}</span></div><div class="atc-drow"><span>Notes</span><span>${o.notes || '-'}</span></div><div class="atc-drow"><span>Last updated</span><span>${o.updated}</span></div></div>
                    <div class="atc-dsec"><div class="atc-dsec__title">Linked Evidence (Sample)</div>${evs.length ? evs.map(e => `<div class="atc-devid"><div><strong>${e.name}</strong> <span class="atc-pill atc-pill--sm">${e.status}</span></div><div class="atc-devid__meta">${e.category} • Submitted: ${e.submitted||'-'} • Version: ${e.version}</div><div class="atc-devid__meta">Reviewer: ${e.reviewer} • Comment: ${e.comment||'-'}</div></div>`).join('') : '<div class="atc-empty">No linked evidence.</div>'}
                `;
            }
            const drawer = document.getElementById('atcOblDrawer');
            if(drawer){ drawer.classList.add('active'); drawer.setAttribute('aria-hidden','false'); }
            atcRender();
        });
    });

    dl.innerHTML = appObls.map(o => {
        const d = atcDaysDiff(o.due);
        let cls='atc-dl', label='Upcoming', diff = d>=0 ? d+' days remaining' : Math.abs(d)+' days overdue';
        if(d !== null && d < 0){ cls='atc-dl atc-dl--over'; label='Overdue'; }
        else if(d !== null && d >=0 && d <= 30){ cls='atc-dl atc-dl--warn'; label='Upcoming'; }
        return `<div class="${cls}"><div class="atc-dl__head"><div><div class="atc-dl__name">${o.id} — ${o.desc}</div><div class="atc-dl__meta">${o.responsible} • Due ${o.due} • ${diff}</div></div><span class="atc-pill">${o.status}</span></div><div class="atc-dl__foot"><button class="atc-link" data-dl="${o.id}">View Linked Obligation</button> <span class="atc-dl__note">Proposed demo escalation only — no notifications sent.</span></div></div>`;
    }).join('') || '<div class="atc-empty">No deadlines for this application.</div>';

    dl.querySelectorAll('button[data-dl]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-dl');
            const btn2 = obl.querySelector(`button[data-obl="${id}"]`);
            if(btn2) btn2.click();
        });
    });

    ev.innerHTML = appEvs.length ? appEvs.map(e => {
        return `<div class="atc-ev"><div class="atc-ev__head"><div><div class="atc-ev__name">${e.name}</div><div class="atc-ev__meta">${e.category} • Linked to ${e.oblId} • Submitted: ${e.submitted||'-'} • Version: ${e.version} • Reviewer: ${e.reviewer}</div><div class="atc-ev__meta">Review status: ${e.status} • Comment: ${e.comment||'-'}</div></div></div><div class="atc-ev__acts"><button class="atc-btn" data-evview="1">View Sample Evidence</button><button class="atc-btn" data-evact="review" data-evid="${e.id}">Mark as Under Review</button><button class="atc-btn" data-evact="req" data-evid="${e.id}">Request Changes</button><button class="atc-btn" data-evact="done" data-evid="${e.id}">Mark Review Complete</button></div></div>`;
    }).join('') : '<div class="atc-empty">No sample evidence for this application.</div>';

    ev.querySelectorAll('[data-evview]').forEach(b=>b.addEventListener('click',()=>{ const m=document.getElementById('atcEvidenceModal'); if(m){ m.classList.add('active'); m.setAttribute('aria-hidden','false'); }}));
    ev.querySelectorAll('[data-evact]').forEach(b=>{
        b.addEventListener('click',()=>{
            const id = b.getAttribute('data-evid');
            const act = b.getAttribute('data-evact');
            const eobj = atcEvidence.find(x=>x.id===id);
            if(!eobj) return;
            if(act==='review'){ eobj.status='Under Review'; eobj.comment='Demo: marked under review.'; eobj.reviewer='Demo Reviewer'; }
            if(act==='req'){ eobj.status='Changes Requested'; eobj.comment='Demo: sample clarification requested.'; eobj.reviewer='Demo Reviewer'; }
            if(act==='done'){ eobj.status='Reviewed'; eobj.comment='Demo: sample review complete.'; eobj.reviewer='Demo Reviewer'; }
            atcRender();
        });
    });

    hist.innerHTML = appHist.length ? `<div class="atc-tl">${appHist.map(h=>`<div class="atc-tl__item"><div class="atc-tl__dot"></div><div class="atc-tl__body"><div class="atc-tl__time">${h.date}</div><div class="atc-tl__text">${h.event}</div><div class="atc-tl__meta">Actor: ${h.actor} • App: ${h.appId} • Obl: ${h.oblId} • Ev: ${h.evId}</div></div></div>`).join('')}</div>` : '<div class="atc-empty">No history for this application.</div>';

    rev.innerHTML = `
        <div class="atc-rev__note">PRAVAAH supports traceability and review coordination. Official scrutiny and approval decisions remain with the authorized authority.</div>
        <div class="atc-rev__row"><label class="atc-rev__label">Select obligation (demo)</label><select id="atcRevSel" class="cmp-select">${appObls.map(o=>`<option value="${o.id}">${o.id}</option>`).join('')}</select></div>
        <div class="atc-rev__row"><label class="atc-rev__label">Demo review comment</label><textarea id="atcRevComment" class="atc-textarea" rows="3" placeholder="Add a demo review comment..."></textarea></div>
        <div class="atc-rev__row"><label class="atc-rev__label">Review outcome (local demo)</label><select id="atcRevOut" class="cmp-select"><option>Under Review</option><option>Reviewed</option><option>Changes Requested</option><option>Closed</option></select></div>
        <div class="atc-rev__acts"><button class="atc-btn atc-btn--primary" id="atcRevApply">Confirm local demo update</button></div>
    `;

    document.getElementById('atcRevApply').addEventListener('click', () => {
        if(!confirm('Apply local demo review update? This only changes demo state.')) return;
        const sid = document.getElementById('atcRevSel').value;
        const com = document.getElementById('atcRevComment').value;
        const out = document.getElementById('atcRevOut').value;
        const o = atcObligations.find(x=>x.id===sid);
        if(o){ o.status = out; o.notes = com ? com : o.notes; o.updated = '2026-10-01'; }
        const evs = atcEvidence.filter(e=>e.oblId===sid);
        if(evs[0]){ evs[0].status = out==='Changes Requested' ? 'Changes Requested' : (out==='Reviewed'||out==='Closed' ? 'Reviewed' : evs[0].status); evs[0].comment = com || evs[0].comment; evs[0].reviewer='Demo Reviewer'; }
        atcHistory.push({ id: atcHistory.length+1, date: '2026-10-01 12:00', event: 'Reviewer updated demo obligation status/outcome.', actor: 'Demo Reviewer', appId: o?o.appId:atcSelectedApp, oblId: sid, evId: evs[0]?evs[0].id:'-' });
        atcRender();
    });
}

function atcInitDrawers(){
    const d = document.getElementById('atcOblDrawer');
    const db = document.getElementById('atcOblDrawerBackdrop');
    const dc = document.getElementById('atcOblDrawerClose');
    if(db) db.addEventListener('click', ()=>{ if(d){ d.classList.remove('active'); d.setAttribute('aria-hidden','true'); }});
    if(dc) dc.addEventListener('click', ()=>{ if(d){ d.classList.remove('active'); d.setAttribute('aria-hidden','true'); }});
    const m = document.getElementById('atcEvidenceModal');
    const mb = document.getElementById('atcEvidenceModalBackdrop');
    const mc = document.getElementById('atcEvidenceModalClose');
    if(mb) mb.addEventListener('click', ()=>{ if(m){ m.classList.remove('active'); m.setAttribute('aria-hidden','true'); }});
    if(mc) mc.addEventListener('click', ()=>{ if(m){ m.classList.remove('active'); m.setAttribute('aria-hidden','true'); }});
}

document.addEventListener('DOMContentLoaded', function(){
    const page = document.getElementById('page-approval-to-compliance');
    if(page){
        atcInitDrawers();
        atcRender();
    }
});

// Re-render when the approval-to-compliance page becomes active
const atcPage = document.getElementById('page-approval-to-compliance');
if (atcPage) {
    const rerenderIfActive = () => {
        if (atcPage.classList.contains('active')) {
            atcRender();
        }
    };
    const observer = new MutationObserver(rerenderIfActive);
    observer.observe(atcPage, { attributes: true, attributeFilter: ['class'] });
}
