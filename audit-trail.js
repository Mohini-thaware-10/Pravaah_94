// PRAVAAH Audit Trail - Frontend only, illustrative demo data

const AUD_TODAY = new Date(2026, 9, 23);

const audInitialLogs = [
    { id: 'AUD-0001', date: '2026-10-23', time: '09:15', datetime: '23 Oct 2026 09:15', activity: 'Application record opened', actor: 'Demo Administrator', role: 'Administrator', related: 'APP-2026-0142', category: 'Application', result: 'Viewed', details: 'Opened fictional application record for preview.' },
    { id: 'AUD-0002', date: '2026-10-23', time: '10:20', datetime: '23 Oct 2026 10:20', activity: 'Document checklist reviewed', actor: 'Demo Reviewer', role: 'Reviewer', related: 'APP-2026-0142', category: 'Document Review', result: 'Review Required', details: 'Reviewed illustrative document checklist items.' },
    { id: 'AUD-0003', date: '2026-10-23', time: '11:05', datetime: '23 Oct 2026 11:05', activity: 'Compliance item marked for review', actor: 'Demo Reviewer', role: 'Reviewer', related: 'APP-2026-0251', category: 'Compliance', result: 'Review Required', details: 'Marked a sample compliance item for follow-up.' },
    { id: 'AUD-0004', date: '2026-10-22', time: '16:40', datetime: '22 Oct 2026 16:40', activity: 'Demo workflow configuration updated', actor: 'Demo Administrator', role: 'Administrator', related: 'WF-CONFIG', category: 'Workflow Configuration', result: 'Demo Update', details: 'Updated illustrative workflow configuration locally.' },
    { id: 'AUD-0005', date: '2026-10-22', time: '14:25', datetime: '22 Oct 2026 14:25', activity: 'Deadline alert viewed', actor: 'Demo Reviewer', role: 'Reviewer', related: 'DA-0005', category: 'Deadline & Alerts', result: 'Viewed', details: 'Viewed illustrative deadline alert.' },
    { id: 'AUD-0006', date: '2026-10-22', time: '12:10', datetime: '22 Oct 2026 12:10', activity: 'Illustrative report preview generated', actor: 'Demo Administrator', role: 'Administrator', related: 'LIB-001', category: 'Reporting', result: 'Preview Generated', details: 'Generated preview of illustrative report.' },
    { id: 'AUD-0007', date: '2026-10-21', time: '09:30', datetime: '21 Oct 2026 09:30', activity: 'Document checklist reviewed', actor: 'Demo Reviewer', role: 'Reviewer', related: 'APP-2026-0238', category: 'Document Review', result: 'Review Required', details: 'Reviewed sample supporting documents.' },
    { id: 'AUD-0008', date: '2026-10-21', time: '15:45', datetime: '21 Oct 2026 15:45', activity: 'Application moved to review', actor: 'Demo Administrator', role: 'Administrator', related: 'APP-2026-0302', category: 'Application', result: 'Demo Update', details: 'Illustrative stage transition applied in demo flow.' }
];

let audLogs = audInitialLogs.map(l => Object.assign({}, l));
let audSearch = '';
let audCategory = 'all';
let audActor = 'all';
let audResult = 'all';
let audDateRange = 'all';
let audSort = 'newest';
let audRecordId = '';
let audPage = 1;
let audPageSize = 10;

function audEsc(t) { const d = document.createElement('div'); d.textContent = String(t); return d.innerHTML; }

function audGetFiltered() {
    let data = audLogs.slice();
    if (audSearch) {
        const s = audSearch.toLowerCase();
        data = data.filter(l => l.activity.toLowerCase().includes(s) || l.actor.toLowerCase().includes(s) || l.related.toLowerCase().includes(s) || l.id.toLowerCase().includes(s));
    }
    if (audCategory !== 'all') data = data.filter(l => l.category === audCategory);
    if (audActor !== 'all') data = data.filter(l => l.actor === audActor);
    if (audResult !== 'all') data = data.filter(l => l.result === audResult);
    if (audRecordId) data = data.filter(l => l.related.toLowerCase().includes(audRecordId.toLowerCase()));
    if (audDateRange === 'today') {
        data = data.filter(l => l.date === '2026-10-23');
    } else if (audDateRange === 'last7') {
        data = data.filter(l => ['2026-10-23','2026-10-22','2026-10-21','2026-10-20','2026-10-19','2026-10-18','2026-10-17'].includes(l.date));
    }
    data.sort((a,b) => {
        if (audSort === 'oldest') return a.datetime.localeCompare(b.datetime);
        return b.datetime.localeCompare(a.datetime);
    });
    return data;
}

function audRenderSummary() {
    const grid = document.getElementById('audSummaryGrid');
    if (!grid) return;
    const total = audLogs.length;
    const today = audLogs.filter(l => l.date === '2026-10-23').length;
    const config = audLogs.filter(l => l.category === 'Workflow Configuration').length;
    const review = audLogs.filter(l => l.category === 'Document Review' || l.category === 'Compliance').length;
    const cards = [
        { label: 'Total Demo Events', value: total, cls: 'navy' },
        { label: 'Today’s Demo Events', value: today, cls: 'green' },
        { label: 'Configuration Activities', value: config, cls: 'amber' },
        { label: 'Review Activities', value: review, cls: 'red' }
    ];
    grid.innerHTML = cards.map(c => `
        <article class="aud-card aud-card--${c.cls}">
            <div class="aud-card__label">${astEsc ? astEsc(c.label) : c.label}</div>
            <div class="aud-card__value">${c.value}</div>
            <div class="aud-card__demo">Illustrative</div>
        </article>
    `).join('');
}

function audRenderLog() {
    const body = document.getElementById('audLogBody');
    if (!body) return;
    const data = audGetFiltered();
    const total = data.length;
    const pages = Math.max(1, Math.ceil(total / audPageSize));
    if (audPage > pages) audPage = pages;
    const start = (audPage - 1) * audPageSize;
    const pageData = data.slice(start, start + audPageSize);
    body.innerHTML = pageData.map(l => `
        <tr data-aud="${l.id}">
            <td><button class="aud-row-btn" data-aud="${l.id}">${audEsc(l.id)}</button></td>
            <td>${audEsc(l.datetime)}</td>
            <td>${audEsc(l.activity)}</td>
            <td>${audEsc(l.actor)} / ${audEsc(l.role)}</td>
            <td>${audEsc(l.related)}</td>
            <td>${audEsc(l.category)}</td>
            <td>${audEsc(l.result)}</td>
        </tr>
    `).join('');
    const info = document.getElementById('audPageInfo');
    if (info) info.textContent = `Page ${audPage} of ${pages} (${total} events)`;
    const prev = document.getElementById('audPrev');
    const next = document.getElementById('audNext');
    if (prev) prev.disabled = audPage <= 1;
    if (next) next.disabled = audPage >= pages;
}

function audOpenDetail(id) {
    const l = audLogs.find(x => x.id === id);
    if (!l) return;
    document.getElementById('audDetailTitle').textContent = l.activity;
    document.getElementById('audDetailId').textContent = l.id;
    document.getElementById('audDetailDate').textContent = l.datetime;
    document.getElementById('audDetailActivity').textContent = l.activity;
    document.getElementById('audDetailActor').textContent = l.actor + ' / ' + l.role;
    document.getElementById('audDetailRecord').textContent = l.related;
    document.getElementById('audDetailCategory').textContent = l.category;
    document.getElementById('audDetailResult').textContent = l.result;
    document.getElementById('audDetailDetails').textContent = l.details;
    const drawer = document.getElementById('audDetailDrawer');
    if (drawer) { drawer.classList.add('active'); drawer.setAttribute('aria-hidden','false'); }
}

function audCloseDetail() {
    const drawer = document.getElementById('audDetailDrawer');
    if (drawer) { drawer.classList.remove('active'); drawer.setAttribute('aria-hidden','true'); }
}

function audToast(msg) {
    const t = document.getElementById('audToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('active');
    setTimeout(() => t.classList.remove('active'), 2400);
}

function audExportCSV() {
    const data = audGetFiltered();
    const rows = [['Event ID','Date & Time','Activity','Actor','Role','Related Record','Category','Result','Details']];
    data.forEach(l => {
        rows.push([l.id, l.datetime, l.activity, l.actor, l.role, l.related, l.category, l.result, l.details]);
    });
    const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g,'""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pravaah-demo-audit-log.csv';
    a.click();
    URL.revokeObjectURL(url);
    audToast('Demo log exported as CSV.');
}

function audResetData() {
    if (confirm('Reset demo audit data to initial state? This affects only local demonstration.')) {
        audLogs = audInitialLogs.map(l => Object.assign({}, l));
        audSearch=''; audCategory='all'; audActor='all'; audResult='all'; audDateRange='all'; audSort='newest'; audRecordId=''; audPage=1; audPageSize=10;
        document.getElementById('audSearch').value='';
        document.getElementById('audRecordId').value='';
        document.getElementById('audCategory').value='all';
        document.getElementById('audActor').value='all';
        document.getElementById('audResult').value='all';
        document.getElementById('audDateRange').value='all';
        document.getElementById('audSort').value='newest';
        document.getElementById('audPageSize').value='10';
        audRenderSummary();
        audRenderLog();
        audToast('Demo audit data reset.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    audRenderSummary();
    audRenderLog();

    document.getElementById('audSearch')?.addEventListener('input', function(){ audSearch = this.value; audPage = 1; audRenderLog(); });
    document.getElementById('audRecordId')?.addEventListener('input', function(){ audRecordId = this.value; audPage = 1; audRenderLog(); });
    document.getElementById('audCategory')?.addEventListener('change', function(){ audCategory = this.value; audPage = 1; audRenderLog(); });
    document.getElementById('audActor')?.addEventListener('change', function(){ audActor = this.value; audPage = 1; audRenderLog(); });
    document.getElementById('audResult')?.addEventListener('change', function(){ audResult = this.value; audPage = 1; audRenderLog(); });
    document.getElementById('audDateRange')?.addEventListener('change', function(){ audDateRange = this.value; audPage = 1; audRenderLog(); });
    document.getElementById('audSort')?.addEventListener('change', function(){ audSort = this.value; audPage = 1; audRenderLog(); });
    document.getElementById('audPageSize')?.addEventListener('change', function(){ audPageSize = parseInt(this.value)||10; audPage = 1; audRenderLog(); });

    document.getElementById('audApplyFilters')?.addEventListener('click', function(){ audPage = 1; audRenderLog(); audToast('Filters applied.'); });
    document.getElementById('audResetFilters')?.addEventListener('click', function(){
        audSearch=''; audCategory='all'; audActor='all'; audResult='all'; audDateRange='all'; audSort='newest'; audRecordId=''; audPage=1;
        document.getElementById('audSearch').value='';
        document.getElementById('audRecordId').value='';
        document.getElementById('audCategory').value='all';
        document.getElementById('audActor').value='all';
        document.getElementById('audResult').value='all';
        document.getElementById('audDateRange').value='all';
        document.getElementById('audSort').value='newest';
        audRenderLog(); audToast('Filters reset.');
    });

    document.getElementById('audLogBody')?.addEventListener('click', function(e){
        const btn = e.target.closest('.aud-row-btn');
        if (btn) audOpenDetail(btn.getAttribute('data-aud'));
    });
    document.getElementById('audDetailClose')?.addEventListener('click', audCloseDetail);
    document.getElementById('audDetailCloseBtn')?.addEventListener('click', audCloseDetail);
    document.querySelector('#audDetailDrawer .aud-drawer__backdrop')?.addEventListener('click', audCloseDetail);

    document.getElementById('audExportBtn')?.addEventListener('click', audExportCSV);
    document.getElementById('audResetBtn')?.addEventListener('click', audResetData);

    document.getElementById('audPrev')?.addEventListener('click', function(){ if (audPage > 1) { audPage--; audRenderLog(); } });
    document.getElementById('audNext')?.addEventListener('click', function(){ audPage++; audRenderLog(); });

    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') audCloseDetail(); });
});
