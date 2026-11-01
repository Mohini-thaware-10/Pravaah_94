// PRAVAAH Compliance Monitoring Centre - Frontend only, illustrative demo data

const cmpItems = [
    { reqId: 'REQ-2026-0101', appId: 'APP-2026-0238', category: 'Supporting Documentation', evidence: 'Supporting evidence review', status: 'Upcoming Deadline', due: '26 Oct 2026', priority: 'High', description: 'Supporting institutional evidence is awaiting review in this demonstration record.' },
    { reqId: 'REQ-2026-0102', appId: 'APP-2026-0142', category: 'Document Validity Review', evidence: 'Document validity review', status: 'Pending Review', due: '28 Oct 2026', priority: 'Medium', description: 'A sample document date is listed for review; no validity conclusion has been recorded.' },
    { reqId: 'REQ-2026-0103', appId: 'APP-2026-0187', category: 'Required Undertaking', evidence: 'Undertaking follow-up', status: 'Pending Review', due: '29 Oct 2026', priority: 'Medium', description: 'A pending undertaking is represented in this sample record for follow-up demonstration.' },
    { reqId: 'REQ-2026-0104', appId: 'APP-2026-0251', category: 'Compliance Response', evidence: 'Compliance response review', status: 'Upcoming Deadline', due: '30 Oct 2026', priority: 'High', description: 'A sample compliance response is shown as awaiting review in this demonstration.' },
    { reqId: 'REQ-2026-0105', appId: 'APP-2026-0278', category: 'Supporting Documentation', evidence: 'Supporting document review', status: 'Upcoming Deadline', due: '31 Oct 2026', priority: 'Medium', description: 'A supporting document is listed for an illustrative review before the demo due date.' },
    { reqId: 'REQ-2026-0106', appId: 'APP-2026-0302', category: 'Compliance Response', evidence: 'Pending clarification', status: 'Action Required', due: '21 Oct 2026', priority: 'High', description: 'This sample record represents a clarification request awaiting an authorized response.' },
    { reqId: 'REQ-2026-0107', appId: 'APP-2026-0289', category: 'Institutional Record', evidence: 'Supporting record review', status: 'Action Required', due: '22 Oct 2026', priority: 'High', description: 'An institutional record is shown as requiring review in this demo; no finding is implied.' },
    { reqId: 'REQ-2026-0108', appId: 'APP-2026-0214', category: 'Reviewer Follow-up', evidence: 'Reviewer follow-up on checklist', status: 'Pending Review', due: '27 Oct 2026', priority: 'Routine', description: 'A reviewer follow-up note is pending in this illustrative checklist record.' },
    { reqId: 'REQ-2026-0109', appId: 'APP-2026-0265', category: 'Required Undertaking', evidence: 'Undertaking confirmation', status: 'Under Review', due: '03 Nov 2026', priority: 'Routine', description: 'A sample undertaking is under ordinary review; no conclusion has been recorded.' },
    { reqId: 'REQ-2026-0110', appId: 'APP-2026-0142', category: 'Supporting Documentation', evidence: 'Supporting document list', status: 'Marked Compliant', due: '20 Oct 2026', priority: 'Routine', description: 'Sample supporting documents are marked as received for this illustrative record.' },
    { reqId: 'REQ-2026-0111', appId: 'APP-2026-0187', category: 'Institutional Record', evidence: 'Institutional record verification', status: 'Marked Compliant', due: '19 Oct 2026', priority: 'Routine', description: 'A sample institutional record is marked as reviewed for demonstration purposes.' },
    { reqId: 'REQ-2026-0112', appId: 'APP-2026-0238', category: 'Document Validity Review', evidence: 'Document date validity review', status: 'Marked Compliant', due: '18 Oct 2026', priority: 'Routine', description: 'An illustrative document date check is marked complete in this demo.' },
    { reqId: 'REQ-2026-0113', appId: 'APP-2026-0251', category: 'Compliance Response', evidence: 'Compliance response completeness', status: 'Marked Compliant', due: '17 Oct 2026', priority: 'Routine', description: 'A sample compliance response is marked as reviewed for this demonstration.' },
    { reqId: 'REQ-2026-0114', appId: 'APP-2026-0278', category: 'Reviewer Follow-up', evidence: 'Reviewer clarification follow-up', status: 'Action Required', due: '24 Oct 2026', priority: 'High', description: 'A sample reviewer clarification remains outstanding in this demonstration record.' },
    { reqId: 'REQ-2026-0115', appId: 'APP-2026-0302', category: 'Required Undertaking', evidence: 'Undertaking status check', status: 'Pending Review', due: '29 Oct 2026', priority: 'Medium', description: 'An illustrative undertaking status is awaiting reviewer action.' },
    { reqId: 'REQ-2026-0116', appId: 'APP-2026-0289', category: 'Supporting Documentation', evidence: 'Supporting evidence completeness', status: 'Under Review', due: '01 Nov 2026', priority: 'Routine', description: 'Supporting evidence is under ordinary review in this sample record.' }
];

const CMP_TODAY = new Date(2026, 9, 23);
const CMP_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const cmpFilters = {
    search: '',
    status: 'all',
    category: 'all',
    stage: 'all',
    deadline: 'all',
    attention: 'all'
};
let cmpSort = 'due-asc';
let cmpPage = 1;
let cmpRows = 8;
let cmpActiveKpi = 'total';
let cmpLastFocus = null;
let cmpWsSelectedApp = null;
let cmpWsSelectedReq = null;
let cmpToastTimer = null;
const cmpDemoState = {};

function cmpEsc(text) {
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function cmpApp(appId) {
    return applicationsData.find(a => a.id === appId) || {
        id: appId,
        institution: 'Sample Institution',
        type: 'Engineering College',
        stage: 'Compliance Review'
    };
}

function cmpParseDate(str) {
    if (typeof parseAppDate === 'function') return parseAppDate(str);
    const p = String(str).trim().split(' ');
    if (p.length !== 3) return null;
    return new Date(parseInt(p[2], 10), CMP_MONTHS.indexOf(p[1]), parseInt(p[0], 10));
}

function cmpFormatDate(date) {
    return date.getDate() + ' ' + CMP_MONTHS[date.getMonth()] + ' ' + date.getFullYear();
}

function cmpDaysUntil(dueStr) {
    const due = cmpParseDate(dueStr);
    if (!due) return null;
    return Math.round((due - CMP_TODAY) / 86400000);
}

function cmpIsOverdue(item) {
    const days = cmpDaysUntil(item.due);
    return days !== null && days < 0 && item.status !== 'Marked Compliant';
}

function cmpStatusClass(status) {
    if (status === 'Marked Compliant') return 'compliant';
    if (status === 'Pending Review') return 'pending';
    if (status === 'Action Required') return 'action';
    if (status === 'Upcoming Deadline') return 'deadline';
    if (status === 'Under Review') return 'review';
    return 'default';
}

function cmpPriorityClass(priority) {
    if (priority === 'High') return 'high';
    if (priority === 'Medium') return 'medium';
    return 'routine';
}

function cmpDemoLabel(state) {
    if (state === 'reviewed') return 'Reviewed (Demo)';
    if (state === 'flagged') return 'Flagged (Demo)';
    return '';
}

function cmpFilteredItems() {
    const search = cmpFilters.search.toLowerCase();
    return cmpItems.filter(item => {
        const app = cmpApp(item.appId);
        if (cmpFilters.attention !== 'all' && cmpAttentionGroup(item) !== cmpFilters.attention) return false;
        if (cmpFilters.status !== 'all' && item.status !== cmpFilters.status) return false;
        if (cmpFilters.category !== 'all' && item.category !== cmpFilters.category) return false;
        if (cmpFilters.stage !== 'all' && app.stage !== cmpFilters.stage) return false;
        if (cmpFilters.deadline !== 'all') {
            const days = cmpDaysUntil(item.due);
            if (days === null) return false;
            if (cmpFilters.deadline === 'overdue' && (days >= 0 || item.status === 'Marked Compliant')) return false;
            if (cmpFilters.deadline === '7days' && (days < 0 || days > 7)) return false;
            if (cmpFilters.deadline === '30days' && (days < 0 || days > 30)) return false;
        }
        if (search) {
            const haystack = [item.reqId, item.appId, app.institution, item.category, item.evidence].join(' ').toLowerCase();
            if (!haystack.includes(search)) return false;
        }
        return true;
    });
}

function cmpSortedItems(data) {
    const sorted = data.slice();
    const priorityRank = { High: 0, Medium: 1, Routine: 2 };
    const key = cmpSort.split('-')[0];
    const dir = cmpSort.split('-')[1] === 'desc' ? -1 : 1;
    sorted.sort((a, b) => {
        if (key === 'priority') {
            const diff = priorityRank[a.priority] - priorityRank[b.priority];
            return dir === -1 ? diff : -diff;
        }
        let av;
        let bv;
        if (key === 'req') {
            av = a.reqId;
            bv = b.reqId;
        } else if (key === 'institution') {
            av = cmpApp(a.appId).institution.toLowerCase();
            bv = cmpApp(b.appId).institution.toLowerCase();
        } else if (key === 'status') {
            av = a.status.toLowerCase();
            bv = b.status.toLowerCase();
        } else {
            av = (cmpParseDate(a.due) || new Date(0)).getTime();
            bv = (cmpParseDate(b.due) || new Date(0)).getTime();
        }
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
    });
    return sorted;
}

function cmpUpdateKpiState() {
    document.querySelectorAll('.cmp-kpi').forEach(btn => {
        const on = btn.getAttribute('data-kpi') === cmpActiveKpi;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
}

function cmpRenderSortIndicators() {
    const key = cmpSort.split('-')[0];
    const dir = cmpSort.split('-')[1];
    document.querySelectorAll('.cmp-sort-btn').forEach(btn => {
        const ind = btn.querySelector('.cmp-sort-ind');
        const th = btn.closest('th');
        const active = btn.getAttribute('data-sort') === key;
        btn.classList.toggle('active', active);
        if (ind) ind.textContent = active ? (dir === 'asc' ? '\u2191' : '\u2193') : '\u2195';
        if (th) th.setAttribute('aria-sort', active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none');
    });
}

function cmpRenderRegister() {
    const filtered = cmpSortedItems(cmpFilteredItems());
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / cmpRows));
    if (cmpPage > pages) cmpPage = pages;
    const start = (cmpPage - 1) * cmpRows;
    const pageData = filtered.slice(start, start + cmpRows);
    const tbody = document.getElementById('cmpTableBody');
    const table = document.getElementById('cmpTable');
    const empty = document.getElementById('cmpEmpty');
    if (!tbody) return;

    tbody.innerHTML = pageData.map(item => {
        const app = cmpApp(item.appId);
        const cls = cmpStatusClass(item.status);
        const overdue = cmpIsOverdue(item);
        const demo = cmpDemoLabel(cmpDemoState[item.reqId]);
        return `
            <tr>
                <td>
                    <div class="cmp-req-cell">
                        <button type="button" class="cmp-req-link" data-req="${item.reqId}">${item.reqId}</button>
                        <span class="cmp-sample-tag">Sample</span>
                    </div>
                </td>
                <td><button type="button" class="cmp-app-link" data-app="${item.appId}">${item.appId}</button></td>
                <td class="cmp-inst-cell">${cmpEsc(app.institution)}</td>
                <td class="cmp-cat-cell">${cmpEsc(item.category)}</td>
                <td class="cmp-evidence-cell">${cmpEsc(item.evidence)}</td>
                <td>
                    <span class="cmp-badge cmp-badge--${cls}">${cmpEsc(item.status)}</span>
                    ${demo ? `<span class="cmp-demo-tag">${cmpEsc(demo)}</span>` : ''}
                </td>
                <td><span class="cmp-due${overdue ? ' cmp-due--overdue' : ''}"${overdue ? ' title="Illustrative due date has passed"' : ''}>${item.due}${overdue ? '<span class="cmp-overdue-tag">Overdue (Demo)</span>' : ''}</span></td>
                <td><span class="cmp-priority cmp-priority--${cmpPriorityClass(item.priority)}">${item.priority}</span></td>
                <td><button type="button" class="cmp-review-btn" data-req="${item.reqId}">Review Details</button></td>
            </tr>
        `;
    }).join('');

    const count = document.getElementById('cmpResultsCount');
    if (count) {
        if (total === 0) {
            count.textContent = 'No sample items match the current filters';
        } else {
            count.textContent = `Showing ${start + 1}\u2013${Math.min(start + cmpRows, total)} of ${total} sample items`;
        }
    }
    const pageInfo = document.getElementById('cmpPageInfo');
    if (pageInfo) pageInfo.textContent = `Page ${cmpPage} of ${pages}`;
    const prev = document.getElementById('cmpPrevPage');
    const next = document.getElementById('cmpNextPage');
    if (prev) prev.disabled = cmpPage <= 1;
    if (next) next.disabled = cmpPage >= pages;
    if (table) table.style.display = total === 0 ? 'none' : '';
    if (empty) empty.hidden = total !== 0;
    cmpRenderSortIndicators();
    cmpUpdateKpiState();
}

function cmpAttentionGroup(item) {
    const days = cmpDaysUntil(item.due);
    if (item.status === 'Marked Compliant') return 'none';
    if (item.status === 'Action Required' || (days !== null && days < 0)) return 'high';
    if (item.status === 'Pending Review' || item.status === 'Upcoming Deadline') return 'medium';
    if (item.status === 'Under Review') return 'routine';
    return 'none';
}

function cmpRenderAttention() {
    const groups = {
        high: { title: 'High Attention', desc: 'Overdue sample item or missing supporting evidence.', items: [] },
        medium: { title: 'Medium Attention', desc: 'Pending review or approaching illustrative deadline.', items: [] },
        routine: { title: 'Routine Review', desc: 'Record awaiting ordinary review.', items: [] }
    };
    cmpItems.forEach(item => {
        const group = cmpAttentionGroup(item);
        if (groups[group]) groups[group].items.push(item);
    });
    Object.keys(groups).forEach(key => {
        groups[key].items.sort((a, b) => (cmpParseDate(a.due) || new Date(0)) - (cmpParseDate(b.due) || new Date(0)));
    });

    const grid = document.getElementById('cmpAttentionGrid');
    if (!grid) return;
    grid.innerHTML = Object.keys(groups).map(key => {
        const group = groups[key];
        const shown = group.items.slice(0, 3);
        const itemsHtml = shown.length ? shown.map(item => {
            const reason = key === 'high'
                ? (cmpIsOverdue(item) ? 'Illustrative due date has passed.' : 'Supporting evidence or clarification is marked as pending.')
                : key === 'medium'
                    ? (item.status === 'Upcoming Deadline' ? 'Illustrative due date is approaching.' : 'Review action is marked pending.')
                    : 'Awaiting ordinary review.';
            return `
                <li class="cmp-attention-item">
                    <div class="cmp-attention-item__top">
                        <span class="cmp-attention-item__app">${item.appId}</span>
                        <span class="cmp-attention-item__req">${cmpEsc(item.evidence)}</span>
                    </div>
                    <div class="cmp-attention-item__reason"><span class="cmp-attention-item__key">Reason</span>${cmpEsc(reason)}</div>
                    <div class="cmp-attention-item__follow"><span class="cmp-attention-item__key">Follow-up</span>${cmpEsc(cmpFollowUp(item))}</div>
                    <button type="button" class="cmp-attention-view" data-req="${item.reqId}">Review Details</button>
                </li>
            `;
        }).join('') : `<li class="cmp-attention-empty">No sample items in this category.</li>`;
        return `
            <div class="cmp-attention-card cmp-attention-card--${key}">
                <div class="cmp-attention-card__head">
                    <div>
                        <h3 class="cmp-attention-card__title">${group.title}</h3>
                        <p class="cmp-attention-card__desc">${group.desc}</p>
                    </div>
                    <span class="cmp-attention-card__count">${group.items.length}</span>
                </div>
                <ul class="cmp-attention-list">${itemsHtml}</ul>
                <button type="button" class="cmp-link-btn cmp-attention-all" data-group="${key}">View all in register</button>
            </div>
        `;
    }).join('');
}

function cmpChecklistFor(item) {
    const labels = ['Supporting document received', 'Required information present', 'Document date requires review', 'Additional clarification pending'];
    const maps = {
        'Marked Compliant': ['Received', 'Received', 'Not Applicable', 'Not Applicable'],
        'Pending Review': ['Received', 'Needs Review', 'Pending', 'Not Applicable'],
        'Action Required': ['Pending', 'Pending', 'Needs Review', 'Pending'],
        'Upcoming Deadline': ['Received', 'Received', 'Needs Review', 'Not Applicable'],
        'Under Review': ['Received', 'Needs Review', 'Needs Review', 'Pending']
    };
    const states = maps[item.status] || ['Pending', 'Pending', 'Pending', 'Pending'];
    return labels.map((label, i) => ({ label, state: states[i] }));
}

function cmpChecklistClass(state) {
    if (state === 'Received') return 'received';
    if (state === 'Needs Review') return 'review';
    if (state === 'Not Applicable') return 'na';
    return 'pending';
}

function cmpChecklistHtml(item) {
    return cmpChecklistFor(item).map(entry => `
        <li class="cmp-checklist__item">
            <span class="cmp-checklist__state cmp-checklist__state--${cmpChecklistClass(entry.state)}">${cmpEsc(entry.state)}</span>
            <span class="cmp-checklist__label">${cmpEsc(entry.label)}</span>
        </li>
    `).join('');
}

function cmpActivityFor(item) {
    const due = cmpParseDate(item.due) || CMP_TODAY;
    const offsets = [12, 9, 5, 1];
    const texts = [
        'Requirement record created (sample)',
        'Supporting evidence listed (sample)',
        'Review action marked pending (sample)',
        'Follow-up noted (sample)'
    ];
    return offsets.map((offset, i) => {
        const d = new Date(due.getFullYear(), due.getMonth(), due.getDate() - offset);
        return { date: cmpFormatDate(d), text: texts[i] };
    });
}

function cmpActivityHtml(item) {
    return cmpActivityFor(item).map(entry => `
        <li class="cmp-mock-timeline__item">
            <span class="cmp-mock-timeline__dot" aria-hidden="true"></span>
            <div>
                <div class="cmp-mock-timeline__text">${cmpEsc(entry.text)}</div>
                <div class="cmp-mock-timeline__date">${entry.date}</div>
            </div>
        </li>
    `).join('');
}

function cmpFollowUp(item) {
    if (item.category === 'Required Undertaking') return 'Review the pending undertaking status through the appropriate authorized process.';
    if (item.category === 'Document Validity Review') return 'Review the supporting document date for this sample record.';
    if (item.category === 'Compliance Response') return 'Review the pending compliance response and request clarification if needed.';
    if (item.category === 'Institutional Record') return 'Check the institutional record associated with this application type.';
    if (item.category === 'Reviewer Follow-up') return 'Review the reviewer follow-up note and continue the ordinary review.';
    if (item.status === 'Marked Compliant') return 'No further review action is suggested for this illustrative record.';
    return 'Review the associated supporting document before the illustrative due date.';
}

function cmpOpenDrawer(reqId) {
    const item = cmpItems.find(i => i.reqId === reqId);
    if (!item) return;
    const app = cmpApp(item.appId);
    const cls = cmpStatusClass(item.status);
    cmpLastFocus = document.activeElement;

    document.getElementById('cmpDrawerId').textContent = item.reqId;
    document.getElementById('cmpDrawerInst').textContent = app.institution;
    document.getElementById('cmpDrawerReq').textContent = item.reqId;
    document.getElementById('cmpDrawerInst2').textContent = app.institution;
    document.getElementById('cmpDrawerCategory').textContent = item.category;
    document.getElementById('cmpDrawerDue').textContent = item.due;
    document.getElementById('cmpDrawerDescription').textContent = item.description;
    document.getElementById('cmpDrawerFollowUp').textContent = cmpFollowUp(item);

    const statusBadge = document.getElementById('cmpDrawerStatus');
    statusBadge.className = 'cmp-badge cmp-badge--' + cls;
    statusBadge.textContent = item.status;
    document.getElementById('cmpDrawerStatus2').textContent = item.status;

    const priority = document.getElementById('cmpDrawerPriority');
    priority.className = 'cmp-priority cmp-priority--' + cmpPriorityClass(item.priority);
    priority.textContent = item.priority;

    const appBtn = document.getElementById('cmpDrawerApp');
    appBtn.textContent = item.appId;
    appBtn.setAttribute('data-req-app', item.appId);
    appBtn.setAttribute('aria-label', 'View application ' + item.appId);

    const reviewBtn = document.getElementById('cmpDrawerReview');
    const flagBtn = document.getElementById('cmpDrawerFlag');
    const appActionBtn = document.getElementById('cmpDrawerAppBtn');
    reviewBtn.setAttribute('data-req', item.reqId);
    flagBtn.setAttribute('data-req', item.reqId);
    appActionBtn.setAttribute('data-app', item.appId);

    document.getElementById('cmpDrawerChecklist').innerHTML = cmpChecklistHtml(item);
    document.getElementById('cmpDrawerTimeline').innerHTML = cmpActivityHtml(item);
    cmpUpdateDrawerState(item.reqId);

    const drawer = document.getElementById('complianceDrawer');
    if (drawer) {
        drawer.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
    }
    document.getElementById('cmpDrawerClose').focus();
}

function cmpUpdateDrawerState(reqId) {
    const state = cmpDemoState[reqId];
    const tag = document.getElementById('cmpDrawerDemoState');
    if (tag) {
        tag.textContent = cmpDemoLabel(state);
        tag.hidden = !state;
    }
    const reviewBtn = document.getElementById('cmpDrawerReview');
    const flagBtn = document.getElementById('cmpDrawerFlag');
    if (reviewBtn) reviewBtn.setAttribute('aria-pressed', state === 'reviewed' ? 'true' : 'false');
    if (flagBtn) flagBtn.setAttribute('aria-pressed', state === 'flagged' ? 'true' : 'false');
}

function cmpCloseDrawer() {
    const drawer = document.getElementById('complianceDrawer');
    if (!drawer || !drawer.classList.contains('active')) return;
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    if (cmpLastFocus && typeof cmpLastFocus.focus === 'function') cmpLastFocus.focus();
}

function cmpShowToast(message) {
    const toast = document.getElementById('cmpToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('active');
    clearTimeout(cmpToastTimer);
    cmpToastTimer = setTimeout(() => toast.classList.remove('active'), 2800);
}

function cmpSetDemoState(reqId, state) {
    if (!reqId) return;
    cmpDemoState[reqId] = state;
    cmpUpdateDrawerState(reqId);
    cmpRenderRegister();
    cmpRenderWorkspace();
    const message = state === 'reviewed'
        ? 'Demo state updated — item marked reviewed locally only.'
        : 'Demo state updated — item flagged for follow-up locally only.';
    cmpShowToast(message);
    const confirm = document.getElementById('cmpWsConfirm');
    if (confirm) confirm.textContent = reqId + ': ' + (state === 'reviewed' ? 'marked reviewed (demo).' : 'flagged for follow-up (demo).');
}

function cmpOpenApplication(appId) {
    const nav = document.querySelector('.nav__item[data-page="applications"]');
    if (nav) nav.click();
    setTimeout(() => {
        if (typeof openAppDrawer === 'function') openAppDrawer(appId);
    }, 60);
}

function cmpWsApps(search) {
    const seen = {};
    const list = [];
    cmpItems.forEach(item => {
        if (seen[item.appId]) return;
        seen[item.appId] = true;
        list.push(cmpApp(item.appId));
    });
    const term = (search || '').toLowerCase();
    return list
        .filter(app => !term || app.id.toLowerCase().includes(term) || app.institution.toLowerCase().includes(term))
        .sort((a, b) => a.id.localeCompare(b.id));
}

function cmpWsSummaryHtml(items) {
    const counts = {
        total: items.length,
        compliant: items.filter(i => i.status === 'Marked Compliant').length,
        awaiting: items.filter(i => i.status === 'Pending Review' || i.status === 'Under Review').length,
        action: items.filter(i => i.status === 'Action Required').length,
        deadline: items.filter(i => i.status === 'Upcoming Deadline').length
    };
    return `
        <div class="cmp-ws-summary__head">
            <h3 class="cmp-ws-summary__title">Review summary</h3>
            <span class="cmp-demo-tag">Local demo state</span>
        </div>
        <div class="cmp-ws-summary__grid">
            <div class="cmp-ws-summary__item"><span>Sample items</span><strong>${counts.total}</strong></div>
            <div class="cmp-ws-summary__item"><span>Marked Compliant</span><strong>${counts.compliant}</strong></div>
            <div class="cmp-ws-summary__item"><span>Awaiting Review</span><strong>${counts.awaiting}</strong></div>
            <div class="cmp-ws-summary__item"><span>Action Required</span><strong>${counts.action}</strong></div>
            <div class="cmp-ws-summary__item"><span>Upcoming Deadline</span><strong>${counts.deadline}</strong></div>
        </div>
        <p class="cmp-ws-summary__note">Counts describe illustrative sample items for the selected application only.</p>
    `;
}

function cmpWsDetailsHtml(item) {
    if (!item) {
        return '<div class="cmp-ws-placeholder">Select a sample compliance item to view its details.</div>';
    }
    const app = cmpApp(item.appId);
    const demo = cmpDemoLabel(cmpDemoState[item.reqId]);
    return `
        <div class="cmp-ws-details__head">
            <div>
                <div class="cmp-ws-details__id">${item.reqId}</div>
                <div class="cmp-ws-details__category">${cmpEsc(item.category)}</div>
            </div>
            <div class="cmp-ws-details__badges">
                <span class="cmp-badge cmp-badge--${cmpStatusClass(item.status)}">${cmpEsc(item.status)}</span>
                ${demo ? `<span class="cmp-demo-tag">${cmpEsc(demo)}</span>` : ''}
            </div>
        </div>
        <div class="cmp-ws-details__grid">
            <div class="cmp-drawer-item"><span class="cmp-drawer-label">Application ID</span><span class="cmp-drawer-value">${item.appId}</span></div>
            <div class="cmp-drawer-item"><span class="cmp-drawer-label">Workflow stage</span><span class="cmp-drawer-value">${cmpEsc(app.stage)}</span></div>
            <div class="cmp-drawer-item"><span class="cmp-drawer-label">Illustrative due date</span><span class="cmp-drawer-value">${item.due}</span></div>
            <div class="cmp-drawer-item"><span class="cmp-drawer-label">Priority</span><span class="cmp-drawer-value"><span class="cmp-priority cmp-priority--${cmpPriorityClass(item.priority)}">${item.priority}</span></span></div>
        </div>
        <h4 class="cmp-ws-details__subtitle">Evidence checklist <span class="cmp-drawer-section__hint">Illustrative state only</span></h4>
        <ul class="cmp-checklist">${cmpChecklistHtml(item)}</ul>
        <h4 class="cmp-ws-details__subtitle">Suggested follow-up</h4>
        <p class="cmp-ws-details__text">${cmpEsc(cmpFollowUp(item))}</p>
        <div class="cmp-ws-details__actions">
            <button type="button" class="cmp-btn cmp-btn--primary" data-ws-action="review" data-ws-req="${item.reqId}">Mark Reviewed (Demo)</button>
            <button type="button" class="cmp-btn cmp-btn--secondary" data-ws-action="flag" data-ws-req="${item.reqId}">Flag for Follow-up (Demo)</button>
            <button type="button" class="cmp-btn cmp-btn--secondary" data-ws-action="app" data-ws-app="${item.appId}">View Application</button>
        </div>
    `;
}

function cmpWorkspaceItemsHtml(items) {
    if (!items.length) {
        return '<div class="cmp-ws-empty">No sample compliance items are associated with this application.</div>';
    }
    return items.map(item => {
        const demo = cmpDemoLabel(cmpDemoState[item.reqId]);
        return `
            <button type="button" class="cmp-ws-item${item.reqId === cmpWsSelectedReq ? ' active' : ''}" data-ws-req="${item.reqId}" aria-pressed="${item.reqId === cmpWsSelectedReq ? 'true' : 'false'}">
                <span class="cmp-ws-item__top">
                    <span class="cmp-ws-item__id">${item.reqId}</span>
                    <span class="cmp-badge cmp-badge--${cmpStatusClass(item.status)}">${cmpEsc(item.status)}</span>
                </span>
                <span class="cmp-ws-item__evidence">${cmpEsc(item.evidence)}</span>
                <span class="cmp-ws-item__meta">${cmpEsc(item.category)} &middot; Due ${item.due}</span>
                ${demo ? `<span class="cmp-demo-tag">${cmpEsc(demo)}</span>` : ''}
            </button>
        `;
    }).join('');
}

function cmpRenderWorkspace() {
    const select = document.getElementById('cmpWsAppSelect');
    const meta = document.getElementById('cmpWsAppMeta');
    const itemsEl = document.getElementById('cmpWsItems');
    const summaryEl = document.getElementById('cmpWsSummary');
    const detailsEl = document.getElementById('cmpWsDetails');
    if (!select) return;

    const search = document.getElementById('cmpWsSearch')?.value || '';
    const apps = cmpWsApps(search);
    select.innerHTML = apps.length
        ? apps.map(app => `<option value="${app.id}">${app.id} \u2014 ${cmpEsc(app.institution)}</option>`).join('')
        : '<option value="">No sample applications</option>';

    if (!apps.find(app => app.id === cmpWsSelectedApp)) {
        cmpWsSelectedApp = apps.length ? apps[0].id : null;
        cmpWsSelectedReq = null;
    }
    select.value = cmpWsSelectedApp || '';

    if (!cmpWsSelectedApp) {
        if (meta) meta.textContent = 'No sample applications match this search.';
        if (itemsEl) itemsEl.innerHTML = '<div class="cmp-ws-empty">No sample applications to display.</div>';
        if (summaryEl) summaryEl.innerHTML = cmpWsSummaryHtml([]);
        if (detailsEl) detailsEl.innerHTML = cmpWsDetailsHtml(null);
        return;
    }

    const app = cmpApp(cmpWsSelectedApp);
    if (meta) meta.innerHTML = `<strong>${app.id}</strong> &middot; ${cmpEsc(app.institution)} &middot; Stage: ${cmpEsc(app.stage)}`;

    const items = cmpItems.filter(item => item.appId === cmpWsSelectedApp);
    if (!items.find(item => item.reqId === cmpWsSelectedReq)) {
        cmpWsSelectedReq = items.length ? items[0].reqId : null;
    }
    if (itemsEl) itemsEl.innerHTML = cmpWorkspaceItemsHtml(items);
    if (summaryEl) summaryEl.innerHTML = cmpWsSummaryHtml(items);
    const selected = items.find(item => item.reqId === cmpWsSelectedReq) || null;
    if (detailsEl) detailsEl.innerHTML = cmpWsDetailsHtml(selected);
}

function cmpApplyKpi(kpi) {
    const map = {
        total: 'all',
        compliant: 'Marked Compliant',
        pending: 'Pending Review',
        action: 'Action Required',
        deadline: 'Upcoming Deadline'
    };
    cmpActiveKpi = kpi;
    cmpFilters.attention = 'all';
    cmpFilters.status = map[kpi] || 'all';
    cmpFilters.search = '';
    cmpFilters.category = 'all';
    cmpFilters.stage = 'all';
    cmpFilters.deadline = 'all';
    const controls = {
        cmpSearch: '',
        cmpStatusFilter: cmpFilters.status,
        cmpCategoryFilter: 'all',
        cmpStageFilter: 'all',
        cmpDeadlineFilter: 'all'
    };
    Object.keys(controls).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = controls[id];
    });
    cmpPage = 1;
    cmpRenderRegister();
    const register = document.getElementById('cmpRegister');
    if (register) register.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cmpResetFilters() {
    cmpFilters.search = '';
    cmpFilters.status = 'all';
    cmpFilters.category = 'all';
    cmpFilters.stage = 'all';
    cmpFilters.deadline = 'all';
    cmpFilters.attention = 'all';
    cmpActiveKpi = 'total';
    const values = {
        cmpSearch: '',
        cmpStatusFilter: 'all',
        cmpCategoryFilter: 'all',
        cmpStageFilter: 'all',
        cmpDeadlineFilter: 'all'
    };
    Object.keys(values).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = values[id];
    });
    cmpPage = 1;
    cmpRenderRegister();
}

function cmpSyncFiltersFromControls() {
    cmpFilters.search = document.getElementById('cmpSearch')?.value || '';
    cmpFilters.status = document.getElementById('cmpStatusFilter')?.value || 'all';
    cmpFilters.category = document.getElementById('cmpCategoryFilter')?.value || 'all';
    cmpFilters.stage = document.getElementById('cmpStageFilter')?.value || 'all';
    cmpFilters.deadline = document.getElementById('cmpDeadlineFilter')?.value || 'all';
    cmpFilters.attention = 'all';
    cmpActiveKpi = null;
    cmpPage = 1;
    cmpRenderRegister();
}

document.addEventListener('DOMContentLoaded', function() {
    // KPI cards
    document.querySelectorAll('.cmp-kpi').forEach(btn => {
        btn.addEventListener('click', function() {
            cmpApplyKpi(this.getAttribute('data-kpi'));
        });
    });

    // Register filters
    document.getElementById('cmpSearch')?.addEventListener('input', cmpSyncFiltersFromControls);
    ['cmpStatusFilter', 'cmpCategoryFilter', 'cmpStageFilter', 'cmpDeadlineFilter'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', cmpSyncFiltersFromControls);
    });

    document.getElementById('cmpSortSelect')?.addEventListener('change', function() {
        cmpSort = this.value;
        cmpPage = 1;
        cmpRenderRegister();
    });

    document.getElementById('cmpResetFilters')?.addEventListener('click', cmpResetFilters);

    document.getElementById('cmpRowsPerPage')?.addEventListener('change', function() {
        cmpRows = parseInt(this.value, 10) || 8;
        cmpPage = 1;
        cmpRenderRegister();
    });

    document.getElementById('cmpPrevPage')?.addEventListener('click', function() {
        if (cmpPage > 1) {
            cmpPage--;
            cmpRenderRegister();
        }
    });

    document.getElementById('cmpNextPage')?.addEventListener('click', function() {
        const total = cmpFilteredItems().length;
        if (cmpPage < Math.ceil(total / cmpRows)) {
            cmpPage++;
            cmpRenderRegister();
        }
    });

    document.querySelectorAll('.cmp-sort-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.getAttribute('data-sort');
            const parts = cmpSort.split('-');
            let dir;
            if (parts[0] === key) {
                dir = parts[1] === 'asc' ? 'desc' : 'asc';
            } else {
                dir = key === 'priority' ? 'desc' : 'asc';
            }
            if (key === 'priority' && parts[0] !== 'priority' && dir === 'asc') dir = 'desc';
            cmpSort = key + '-' + dir;
            const select = document.getElementById('cmpSortSelect');
            if (select && Array.from(select.options).some(opt => opt.value === cmpSort)) {
                select.value = cmpSort;
            }
            cmpPage = 1;
            cmpRenderRegister();
        });
    });

    // Register and secondary Review Details actions
    document.addEventListener('click', function(e) {
        const clear = e.target.closest('[data-cmp-clear]');
        if (clear) {
            cmpResetFilters();
            return;
        }

        const attentionAll = e.target.closest('.cmp-attention-all');
        if (attentionAll) {
            cmpFilters.search = '';
            cmpFilters.category = 'all';
            cmpFilters.stage = 'all';
            cmpFilters.deadline = 'all';
            cmpFilters.status = 'all';
            cmpFilters.attention = attentionAll.getAttribute('data-group') || 'all';
            cmpActiveKpi = null;
            const statusSel = document.getElementById('cmpStatusFilter');
            if (statusSel) statusSel.value = 'all';
            const searchInput = document.getElementById('cmpSearch');
            if (searchInput) searchInput.value = '';
            const catSel = document.getElementById('cmpCategoryFilter');
            if (catSel) catSel.value = 'all';
            const stageSel = document.getElementById('cmpStageFilter');
            if (stageSel) stageSel.value = 'all';
            const deadlineSel = document.getElementById('cmpDeadlineFilter');
            if (deadlineSel) deadlineSel.value = 'all';
            cmpPage = 1;
            cmpRenderRegister();
            document.getElementById('cmpRegister')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        const reqBtn = e.target.closest('.cmp-req-link, .cmp-review-btn, .cmp-deadline-item .cmp-link-btn, .cmp-attention-view');
        if (reqBtn) {
            const reqId = reqBtn.getAttribute('data-req');
            if (reqId) cmpOpenDrawer(reqId);
            return;
        }

        const appBtn = e.target.closest('.cmp-app-link');
        if (appBtn) {
            cmpOpenApplication(appBtn.getAttribute('data-app'));
            return;
        }

        const wsItem = e.target.closest('.cmp-ws-item');
        if (wsItem) {
            cmpWsSelectedReq = wsItem.getAttribute('data-ws-req');
            cmpRenderWorkspace();
            return;
        }

        const wsAction = e.target.closest('[data-ws-action]');
        if (wsAction) {
            const reqId = wsAction.getAttribute('data-ws-req');
            const appId = wsAction.getAttribute('data-ws-app');
            if (wsAction.getAttribute('data-ws-action') === 'review') cmpSetDemoState(reqId, 'reviewed');
            if (wsAction.getAttribute('data-ws-action') === 'flag') cmpSetDemoState(reqId, 'flagged');
            if (wsAction.getAttribute('data-ws-action') === 'app' && appId) cmpOpenApplication(appId);
            return;
        }
    });

    // Workspace selector
    document.getElementById('cmpWsSearch')?.addEventListener('input', cmpRenderWorkspace);
    document.getElementById('cmpWsAppSelect')?.addEventListener('change', function() {
        cmpWsSelectedApp = this.value;
        cmpWsSelectedReq = null;
        cmpRenderWorkspace();
    });

    // Drawer controls
    document.getElementById('cmpDrawerClose')?.addEventListener('click', cmpCloseDrawer);
    document.getElementById('cmpDrawerCloseBtn')?.addEventListener('click', cmpCloseDrawer);
    document.querySelector('#complianceDrawer .cmp-drawer__backdrop')?.addEventListener('click', cmpCloseDrawer);
    document.getElementById('cmpDrawerReview')?.addEventListener('click', function() {
        cmpSetDemoState(this.getAttribute('data-req'), 'reviewed');
    });
    document.getElementById('cmpDrawerFlag')?.addEventListener('click', function() {
        cmpSetDemoState(this.getAttribute('data-req'), 'flagged');
    });
    document.getElementById('cmpDrawerAppBtn')?.addEventListener('click', function() {
        const appId = this.getAttribute('data-app');
        cmpCloseDrawer();
        if (appId) cmpOpenApplication(appId);
    });
    document.getElementById('cmpDrawerApp')?.addEventListener('click', function() {
        const appId = this.getAttribute('data-req-app');
        cmpCloseDrawer();
        if (appId) cmpOpenApplication(appId);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') cmpCloseDrawer();
    });

    // Initial renders
    cmpRenderRegister();
    cmpRenderAttention();
    cmpRenderWorkspace();
});
