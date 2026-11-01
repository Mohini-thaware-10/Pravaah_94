// PRAVAAH Applications Management - Frontend only

const applicationsData = [
    {
        id: 'APP-2026-0142',
        institution: 'Western Institute of Technology',
        type: 'Engineering College',
        submitted: '18 Oct 2026',
        stage: 'Document Review',
        action: 'Supporting document required',
        deadline: '28 Oct 2026',
        status: 'Action Required',
        // --- Pre-submission simulator fields ---
        documents: [
            { name: 'Application form', status: 'received', receivedDate: '18 Oct 2026', expiry: '28 Oct 2026' },
            { name: 'Institutional profile', status: 'received', receivedDate: '18 Oct 2026', expiry: '18 Oct 2027' },
            { name: 'Curriculum vitae', status: 'received', receivedDate: '18 Oct 2026', expiry: '18 Oct 2027' },
        ],
        checklist: [
            { id: 'CHK-0142-01', label: 'Valid identity proof', status: 'pending', relatedRequirement: 'REQ-0142-01' },
            { id: 'CHK-0142-02', label: 'Valid fee payment receipt', status: 'pending', relatedRequirement: 'REQ-0142-02' },
            { id: 'CHK-0142-03', label: 'Curriculum details', status: 'received', relatedRequirement: 'REQ-0142-03' },
        ],
        reviewStages: [
            { stage: 'Application Submitted', completed: true, date: '18 Oct 2026' },
            { stage: 'Initial Scrutiny', completed: false, date: null },
            { stage: 'Document Review', completed: false, date: null },
            { stage: 'Compliance Review', completed: false, date: null },
            { stage: 'Final Decision', completed: false, date: null }
        ],
        prerequisites: [
            { id: 'PRQ-0142-01', label: 'Fee receipt validity', dependentStage: 'Initial Scrutiny', status: 'pending' },
            { id: 'PRQ-0142-02', label: 'Document expiry check', dependentStage: 'Document Review', status: 'pending' }
        ]
        // end simulator fields
    },
    {
        id: 'APP-2026-0187',
        institution: 'Deccan College of Engineering',
        type: 'Engineering College',
        submitted: '19 Oct 2026',
        stage: 'Compliance Review',
        action: 'Undertaking submission pending',
        deadline: '29 Oct 2026',
        status: 'Due Soon',
        documents: [
            { name: 'Application form', status: 'received', receivedDate: '19 Oct 2026', expiry: '29 Oct 2026' },
            { name: 'Undertaking letter', status: 'pending', receivedDate: null, expiry: '29 Oct 2026' },
            { name: 'Financial statements', status: 'received', receivedDate: '19 Oct 2026', expiry: '19 Oct 2027' },
        ],
        checklist: [
            { id: 'CHK-0187-01', label: 'Undertaking submission', status: 'pending', relatedRequirement: 'REQ-0187-01' },
            { id: 'CHK-0187-02', label: 'Financial compliance', status: 'received', relatedRequirement: 'REQ-0187-02' },
        ],
        reviewStages: [
            { stage: 'Application Submitted', completed: true, date: '19 Oct 2026' },
            { stage: 'Initial Scrutiny', completed: true, date: '20 Oct 2026' },
            { stage: 'Document Review', completed: true, date: '21 Oct 2026' },
            { stage: 'Compliance Review', completed: false, date: null },
            { stage: 'Final Decision', completed: false, date: null }
        ],
        prerequisites: [
            { id: 'PRQ-0187-01', label: 'Undertaking submission', dependentStage: 'Compliance Review', status: 'pending' }
        ]
    },
    {
        id: 'APP-2026-0214',
        institution: 'National Technical Institute',
        type: 'Technical Institution',
        submitted: '20 Oct 2026',
        stage: 'Initial Scrutiny',
        action: 'Reviewer action pending',
        deadline: '31 Oct 2026',
        status: 'Under Review',
        documents: [
            { name: 'Application form', status: 'received', receivedDate: '20 Oct 2026', expiry: '31 Oct 2026' },
            { name: 'Course outline', status: 'received', receivedDate: '20 Oct 2026', expiry: '31 Oct 2027' },
            { name: 'Accreditation certificates', status: 'received', receivedDate: '20 Oct 2026', expiry: '20 Oct 2027' },
        ],
        checklist: [
            { id: 'CHK-0214-01', label: 'Eligibility verification', status: 'pending', relatedRequirement: 'REQ-0214-01' },
            { id: 'CHK-0214-02', label: 'Document completeness', status: 'received', relatedRequirement: 'REQ-0214-02' },
        ],
        reviewStages: [
            { stage: 'Application Submitted', completed: true, date: '20 Oct 2026' },
            { stage: 'Initial Scrutiny', completed: false, date: null },
            { stage: 'Document Review', completed: false, date: null },
            { stage: 'Compliance Review', completed: false, date: null },
            { stage: 'Final Decision', completed: false, date: null }
        ],
        prerequisites: [
            { id: 'PRQ-0214-01', label: 'Eligibility documents', dependentStage: 'Document Review', status: 'pending' }
        ]
    },
    {
        id: 'APP-2026-0238',
        institution: 'Sahyadri Institute of Technology',
        type: 'Engineering College',
        submitted: '17 Oct 2026',
        stage: 'Document Review',
        action: 'Document validity check',
        deadline: '26 Oct 2026',
        status: 'Action Required',
        documents: [
            { name: 'Application form', status: 'received', receivedDate: '17 Oct 2026', expiry: '17 Oct 2027' },
            { name: 'Validity certificate', status: 'expired', receivedDate: '15 Sep 2026', expiry: '25 Oct 2026' },
            { name: 'Lab equipment list', status: 'received', receivedDate: '17 Oct 2026', expiry: '17 Oct 2027' },
        ],
        checklist: [
            { id: 'CHK-0238-01', label: 'Document validity check', status: 'pending', relatedRequirement: 'REQ-0238-01' },
            { id: 'CHK-0238-02', label: 'Supporting document link', status: 'pending', relatedRequirement: 'REQ-0238-02' },
        ],
        reviewStages: [
            { stage: 'Application Submitted', completed: true, date: '17 Oct 2026' },
            { stage: 'Initial Scrutiny', completed: true, date: '18 Oct 2026' },
            { stage: 'Document Review', completed: false, date: null },
            { stage: 'Compliance Review', completed: false, date: null },
            { stage: 'Final Decision', completed: false, date: null }
        ],
        prerequisites: [
            { id: 'PRQ-0238-01', label: 'Validity certificate renewal', dependentStage: 'Document Review', status: 'pending' }
        ]
    },
    {
        id: 'APP-2026-0251',
        institution: 'Central Institute of Engineering',
        type: 'Engineering College',
        submitted: '21 Oct 2026',
        stage: 'Compliance Review',
        action: 'Compliance response pending',
        deadline: '30 Oct 2026',
        status: 'Due Soon',
        documents: [
            { name: 'Application form', status: 'received', receivedDate: '21 Oct 2026', expiry: '30 Oct 2026' },
            { name: 'Compliance certificate', status: 'received', receivedDate: '21 Oct 2026', expiry: '30 Oct 2027' },
            { name: 'Site inspection report', status: 'in progress', receivedDate: '20 Oct 2026', expiry: null },
        ],
        checklist: [
            { id: 'CHK-0251-01', label: 'Compliance response', status: 'pending', relatedRequirement: 'REQ-0251-01' },
            { id: 'CHK-0251-02', label: 'Evidence upload', status: 'pending', relatedRequirement: 'REQ-0251-02' },
        ],
        reviewStages: [
            { stage: 'Application Submitted', completed: true, date: '21 Oct 2026' },
            { stage: 'Initial Scrutiny', completed: true, date: '22 Oct 2026' },
            { stage: 'Document Review', completed: true, date: '23 Oct 2026' },
            { stage: 'Compliance Review', completed: false, date: null },
            { stage: 'Final Decision', completed: false, date: null }
        ],
        prerequisites: [
            { id: 'PRQ-0251-01', label: 'Site inspection completion', dependentStage: 'Final Decision', status: 'pending' }
        ]
    },
    {
        id: 'APP-2026-0265',
        institution: 'Eastern Polytechnic College',
        type: 'Polytechnic',
        submitted: '22 Oct 2026',
        stage: 'Application Submitted',
        action: 'Pending assignment',
        deadline: '03 Nov 2026',
        status: 'Submitted',
        documents: [
            { name: 'Application form', status: 'received', receivedDate: '22 Oct 2026', expiry: '03 Nov 2026' },
            { name: 'Basic particulars', status: 'received', receivedDate: '22 Oct 2026', expiry: '03 Nov 2027' },
        ],
        checklist: [
            { id: 'CHK-0265-01', label: 'Application completeness', status: 'pending', relatedRequirement: 'REQ-0265-01' },
        ],
        reviewStages: [
            { stage: 'Application Submitted', completed: true, date: '22 Oct 2026' },
            { stage: 'Initial Scrutiny', completed: false, date: null },
            { stage: 'Document Review', completed: false, date: null },
            { stage: 'Compliance Review', completed: false, date: null },
            { stage: 'Final Decision', completed: false, date: null }
        ],
        prerequisites: []
    },
    {
        id: 'APP-2026-0278',
        institution: 'Western Technical Campus',
        type: 'Engineering College',
        submitted: '23 Oct 2026',
        stage: 'Initial Scrutiny',
        action: 'Checklist review pending',
        deadline: '01 Nov 2026',
        status: 'Under Review',
        documents: [
            { name: 'Application form', status: 'received', receivedDate: '23 Oct 2026', expiry: '01 Nov 2027' },
            { name: 'Course curriculum', status: 'received', receivedDate: '23 Oct 2026', expiry: '01 Nov 2027' },
        ],
        checklist: [
            { id: 'CHK-0278-01', label: 'Checklist item 1', status: 'pending', relatedRequirement: 'REQ-0278-01' },
            { id: 'CHK-0278-02', label: 'Checklist item 2', status: 'pending', relatedRequirement: 'REQ-0278-02' },
            { id: 'CHK-0278-03', label: 'Checklist item 3', status: 'received', relatedRequirement: 'REQ-0278-03' },
        ],
        reviewStages: [
            { stage: 'Application Submitted', completed: true, date: '23 Oct 2026' },
            { stage: 'Initial Scrutiny', completed: true, date: '23 Oct 2026' },
            { stage: 'Document Review', completed: false, date: null },
            { stage: 'Compliance Review', completed: false, date: null },
            { stage: 'Final Decision', completed: false, date: null }
        ],
        prerequisites: [
            { id: 'PRQ-0278-01', label: 'Checklist completion', dependentStage: 'Document Review', status: 'pending' }
        ]
    },
    {
        id: 'APP-2026-0289',
        institution: 'Coastal Institute of Technology',
        type: 'Engineering College',
        submitted: '15 Oct 2026',
        stage: 'Final Decision',
        action: 'Awaiting final review',
        deadline: '25 Oct 2026',
        status: 'Awaiting Decision',
        documents: [
            { name: 'Application form', status: 'received', receivedDate: '15 Oct 2026', expiry: '15 Oct 2027' },
            { name: 'Final decision memo', status: 'received', receivedDate: '20 Oct 2026', expiry: null },
        ],
        checklist: [
            { id: 'CHK-0289-01', label: 'Decision record', status: 'received', relatedRequirement: 'REQ-0289-01' },
        ],
        reviewStages: [
            { stage: 'Application Submitted', completed: true, date: '15 Oct 2026' },
            { stage: 'Initial Scrutiny', completed: true, date: '16 Oct 2026' },
            { stage: 'Document Review', completed: true, date: '17 Oct 2026' },
            { stage: 'Compliance Review', completed: true, date: '18 Oct 2026' },
            { stage: 'Final Decision', completed: false, date: null }
        ],
        prerequisites: []
    },
    {
        id: 'APP-2026-0295',
        institution: 'Rural Engineering College',
        type: 'Engineering College',
        submitted: '12 Oct 2026',
        stage: 'Final Decision',
        action: 'Decision recorded',
        deadline: '20 Oct 2026',
        status: 'Completed',
        documents: [
            { name: 'Application form', status: 'received', receivedDate: '12 Oct 2026', expiry: '12 Oct 2027' },
            { name: 'Approval letter', status: 'received', receivedDate: '20 Oct 2026', expiry: null },
        ],
        checklist: [
            { id: 'CHK-0295-01', label: 'Final approval', status: 'received', relatedRequirement: 'REQ-0295-01' },
        ],
        reviewStages: [
            { stage: 'Application Submitted', completed: true, date: '12 Oct 2026' },
            { stage: 'Initial Scrutiny', completed: true, date: '13 Oct 2026' },
            { stage: 'Document Review', completed: true, date: '14 Oct 2026' },
            { stage: 'Compliance Review', completed: true, date: '15 Oct 2026' },
            { stage: 'Final Decision', completed: true, date: '20 Oct 2026' }
        ],
        prerequisites: []
    },
    {
        id: 'APP-2026-0302',
        institution: 'Southern Technical Institute',
        type: 'Technical Institution',
        submitted: '16 Oct 2026',
        stage: 'Compliance Review',
        action: 'Response review pending',
        deadline: '27 Oct 2026',
        status: 'Compliance Pending',
        documents: [
            { name: 'Application form', status: 'received', receivedDate: '16 Oct 2026', expiry: '27 Oct 2026' },
            { name: 'Compliance response', status: 'pending', receivedDate: null, expiry: '27 Oct 2026' },
            { name: 'Audit reports', status: 'received', receivedDate: '16 Oct 2026', expiry: '16 Oct 2027' },
        ],
        checklist: [
            { id: 'CHK-0302-01', label: 'Compliance response', status: 'pending', relatedRequirement: 'REQ-0302-01' },
            { id: 'CHK-0302-02', label: 'Audit compliance', status: 'received', relatedRequirement: 'REQ-0302-02' },
        ],
        reviewStages: [
            { stage: 'Application Submitted', completed: true, date: '16 Oct 2026' },
            { stage: 'Initial Scrutiny', completed: true, date: '17 Oct 2026' },
            { stage: 'Document Review', completed: true, date: '18 Oct 2026' },
            { stage: 'Compliance Review', completed: false, date: null },
            { stage: 'Final Decision', completed: false, date: null }
        ],
        prerequisites: [
            { id: 'PRQ-0302-01', label: 'Response submission', dependentStage: 'Final Decision', status: 'pending' }
        ]
    }
];

let currentPage = 1;
let rowsPerPage = 10;
let currentFilters = {
    search: '',
    status: 'all',
    stage: 'all',
    type: 'all',
    date: '',
    deadline: 'all',
    statusTab: 'all'
};
let currentView = 'table';
let currentSort = 'newest';

const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

function parseAppDate(str) {
    const parts = String(str).trim().split(' ');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = MONTHS[parts[1]];
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || month === undefined || isNaN(year)) return null;
    return new Date(year, month, day);
}

// Illustrative reference date for demo deadline comparisons
const DEMO_TODAY = new Date(2026, 9, 23);

function getFilteredData() {
    const filtered = applicationsData.filter(app => {
        // Status tab
        if (currentFilters.statusTab !== 'all') {
            if (currentFilters.statusTab === 'Submitted' && app.status !== 'Submitted') return false;
            if (currentFilters.statusTab === 'Under Review' && app.status !== 'Under Review') return false;
            if (currentFilters.statusTab === 'Compliance Pending' && app.status !== 'Compliance Pending') return false;
            if (currentFilters.statusTab === 'Awaiting Decision' && app.status !== 'Awaiting Decision') return false;
            if (currentFilters.statusTab === 'Completed' && app.status !== 'Completed') return false;
        }
        // Status filter
        if (currentFilters.status !== 'all' && app.status !== currentFilters.status) return false;
        // Stage filter
        if (currentFilters.stage !== 'all' && app.stage !== currentFilters.stage) return false;
        // Type filter
        if (currentFilters.type !== 'all' && app.type !== currentFilters.type) return false;
        // Search
        if (currentFilters.search) {
            const s = currentFilters.search.toLowerCase();
            if (!(app.id.toLowerCase().includes(s) || app.institution.toLowerCase().includes(s) || app.action.toLowerCase().includes(s))) {
                return false;
            }
        }
        // Submission date filter
        if (currentFilters.date) {
            const submitted = parseAppDate(app.submitted);
            const selected = new Date(currentFilters.date + 'T00:00:00');
            if (!submitted || submitted.toDateString() !== selected.toDateString()) return false;
        }
        // Deadline category filter
        if (currentFilters.deadline !== 'all') {
            const due = parseAppDate(app.deadline);
            if (!due) return false;
            const diffDays = Math.round((due - DEMO_TODAY) / 86400000);
            if (currentFilters.deadline === 'overdue' && diffDays >= 0) return false;
            if (currentFilters.deadline === '7days' && (diffDays < 0 || diffDays > 7)) return false;
            if (currentFilters.deadline === '30days' && (diffDays < 0 || diffDays > 30)) return false;
        }
        return true;
    });

    filtered.sort((a, b) => {
        if (currentSort === 'oldest') {
            return (parseAppDate(a.submitted) || 0) - (parseAppDate(b.submitted) || 0);
        }
        if (currentSort === 'due-soon') {
            return (parseAppDate(a.deadline) || 0) - (parseAppDate(b.deadline) || 0);
        }
        return (parseAppDate(b.submitted) || 0) - (parseAppDate(a.submitted) || 0);
    });

    return filtered;
}

function renderFilterChips() {
    const container = document.getElementById('appActiveFilters');
    if (!container) return;
    const chips = [];
    if (currentFilters.statusTab !== 'all') chips.push(['Status tab: ' + currentFilters.statusTab, 'tab']);
    if (currentFilters.status !== 'all') chips.push(['Status: ' + currentFilters.status, 'status']);
    if (currentFilters.stage !== 'all') chips.push(['Stage: ' + currentFilters.stage, 'stage']);
    if (currentFilters.type !== 'all') chips.push(['Type: ' + currentFilters.type, 'type']);
    if (currentFilters.date) chips.push(['Submitted: ' + currentFilters.date, 'date']);
    if (currentFilters.deadline !== 'all') chips.push(['Deadline: ' + currentFilters.deadline, 'deadline']);
    if (currentFilters.search) chips.push(['Search: "' + currentFilters.search + '"', 'search']);
    container.innerHTML = '';
    if (chips.length === 0) return;
    chips.forEach(([label, key]) => {
        const chip = document.createElement('span');
        chip.className = 'app-chip';
        chip.innerHTML = `<span>${escapeHtml(label)}</span><button type="button" class="app-chip__remove" data-clear="${key}" aria-label="Remove filter">&times;</button>`;
        container.appendChild(chip);
    });
    const clearAll = document.createElement('button');
    clearAll.type = 'button';
    clearAll.className = 'app-chip__clear-all';
    clearAll.textContent = 'Clear All';
    clearAll.addEventListener('click', resetAllFilters);
    container.appendChild(clearAll);

    container.querySelectorAll('.app-chip__remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.getAttribute('data-clear');
            if (key === 'search') {
                currentFilters.search = '';
                const el = document.getElementById('appSearchInput');
                if (el) el.value = '';
            } else if (key === 'tab') {
                currentFilters.statusTab = 'all';
                document.querySelectorAll('.app-status-item').forEach(b => b.classList.toggle('active', b.getAttribute('data-status') === 'all'));
            } else {
                currentFilters[key] = 'all';
                const map = { status: 'appStatusFilter', stage: 'appStageFilter', type: 'appTypeFilter', deadline: 'appDeadlineFilter' };
                const el = document.getElementById(map[key]);
                if (el) el.value = 'all';
                if (key === 'date') {
                    currentFilters.date = '';
                    const d = document.getElementById('appDateFilter');
                    if (d) d.value = '';
                }
            }
            currentPage = 1;
            renderApps();
        });
    });
}

function resetAllFilters() {
    currentFilters = { search: '', status: 'all', stage: 'all', type: 'all', date: '', deadline: 'all', statusTab: 'all' };
    const ids = ['appSearchInput', 'appStatusFilter', 'appStageFilter', 'appTypeFilter', 'appDateFilter', 'appDeadlineFilter'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.value = id === 'appSearchInput' ? '' : 'all';
    });
    document.querySelectorAll('.app-status-item').forEach(b => b.classList.toggle('active', b.getAttribute('data-status') === 'all'));
    currentPage = 1;
    renderApps();
}

function renderApps() {
    const data = getFilteredData();
    const total = data.length;
    document.getElementById('appResultsCount').textContent = `Showing ${total} application${total !== 1 ? 's' : ''}`;
    renderFilterChips();

    // Table
    const tbody = document.getElementById('appsTableBody');
    if (tbody) {
        tbody.innerHTML = '';
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = data.slice(start, end);
        if (pageData.length === 0) {
            document.getElementById('appTableEmpty').style.display = 'block';
        } else {
            document.getElementById('appTableEmpty').style.display = 'none';
            pageData.forEach(app => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><button class="app-id-link" data-app="${app.id}">${app.id}</button></td>
                    <td>${escapeHtml(app.institution)}</td>
                    <td>${escapeHtml(app.type)}</td>
                    <td>${escapeHtml(app.submitted)}</td>
                    <td>${escapeHtml(app.stage)}</td>
                    <td class="app-pending">${escapeHtml(app.action)}</td>
                    <td>${escapeHtml(app.deadline)}</td>
                    <td><span class="app-status-badge app-status-badge--${getStatusClass(app.status)}">${escapeHtml(app.status)}</span></td>
                    <td><button class="app-view-btn-sm" data-app="${app.id}">View Details</button></td>
                `;
                tbody.appendChild(tr);
            });
            // attach events
            document.querySelectorAll('#appsTableBody .app-id-link, #appsTableBody .app-view-btn-sm').forEach(btn => {
                btn.addEventListener('click', function() {
                    openAppDrawer(this.getAttribute('data-app'));
                });
            });
        }
    }

    // Cards
    const cardGrid = document.getElementById('appCardGrid');
    if (cardGrid) {
        cardGrid.innerHTML = '';
        if (data.length === 0) {
            document.getElementById('appCardEmpty').style.display = 'block';
        } else {
            document.getElementById('appCardEmpty').style.display = 'none';
            data.forEach(app => {
                const card = document.createElement('div');
                card.className = 'app-card';
                card.innerHTML = `
                    <div class="app-card__header">
                        <button class="app-card__id" data-app="${app.id}">${app.id}</button>
                        <span class="app-status-badge app-status-badge--${getStatusClass(app.status)}">${app.status}</span>
                    </div>
                    <div class="app-card__inst">${escapeHtml(app.institution)}</div>
                    <div class="app-card__row"><span class="app-card__label">Type</span><span>${escapeHtml(app.type)}</span></div>
                    <div class="app-card__row"><span class="app-card__label">Stage</span><span>${escapeHtml(app.stage)}</span></div>
                    <div class="app-card__row"><span class="app-card__label">Pending</span><span class="app-card__pending">${escapeHtml(app.action)}</span></div>
                    <div class="app-card__row"><span class="app-card__label">Deadline</span><span>${escapeHtml(app.deadline)}</span></div>
                    <button class="app-card__view" data-app="${app.id}">View Details</button>
                `;
                cardGrid.appendChild(card);
            });
            document.querySelectorAll('.app-card .app-card__id, .app-card .app-card__view').forEach(btn => {
                btn.addEventListener('click', function() {
                    openAppDrawer(this.getAttribute('data-app'));
                });
            });
        }
    }

    // Pagination
    const pageInfo = document.getElementById('appPageInfo');
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${Math.max(1, Math.ceil(total / rowsPerPage))}`;
    }
}

function getStatusClass(status) {
    if (status === 'Action Required') return 'action';
    if (status === 'Due Soon') return 'due';
    if (status === 'Under Review') return 'review';
    if (status === 'Submitted') return 'submitted';
    if (status === 'Compliance Pending') return 'compliance';
    if (status === 'Awaiting Decision') return 'decision';
    if (status === 'Completed') return 'completed';
    return 'default';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function openAppDrawer(appId) {
    const app = applicationsData.find(a => a.id === appId);
    if (!app) return;
    document.getElementById('drawerAppId').textContent = app.id;
    document.getElementById('drawerAppInst').textContent = app.institution;
    document.getElementById('drawerAppStatus').textContent = app.status;
    document.getElementById('drawerAppStatus').className = 'app-drawer__status app-drawer__status--' + getStatusClass(app.status);
    document.getElementById('drawerAppType').textContent = app.type;
    document.getElementById('drawerAppSubmitted').textContent = app.submitted;
    document.getElementById('drawerAppStage').textContent = app.stage;
    document.getElementById('drawerAppAction').textContent = app.action;
    document.getElementById('drawerAppDue').textContent = app.deadline;

    // Timeline
    const timelineItems = document.querySelectorAll('#drawerTimeline .timeline-item');
    timelineItems.forEach((item, idx) => {
        item.classList.remove('completed', 'current', 'upcoming');
        const stage = item.getAttribute('data-stage');
        if (stage === app.stage) {
            item.classList.add('current');
        } else if (stage === 'Application Submitted') {
            item.classList.add('completed');
        } else if (idx < 1) {
            // simple logic
        }
    });
    // mark based on stage
    if (app.stage === 'Application Submitted') {
        timelineItems[0].classList.add('completed');
        timelineItems[1].classList.add('upcoming');
    } else if (app.stage === 'Initial Scrutiny') {
        timelineItems[0].classList.add('completed');
        timelineItems[1].classList.add('current');
        timelineItems[2].classList.add('upcoming');
    } else if (app.stage === 'Document Review') {
        timelineItems[0].classList.add('completed');
        timelineItems[1].classList.add('completed');
        timelineItems[2].classList.add('current');
        timelineItems[3].classList.add('upcoming');
    } else if (app.stage === 'Compliance Review') {
        timelineItems[0].classList.add('completed');
        timelineItems[1].classList.add('completed');
        timelineItems[2].classList.add('completed');
        timelineItems[3].classList.add('current');
        timelineItems[4].classList.add('upcoming');
    } else if (app.stage === 'Final Decision') {
        timelineItems[0].classList.add('completed');
        timelineItems[1].classList.add('completed');
        timelineItems[2].classList.add('completed');
        timelineItems[3].classList.add('completed');
        timelineItems[4].classList.add('current');
    }

    const drawer = document.getElementById('appDetailDrawer');
    if (drawer) {
        drawer.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
    }
}

function closeAppDrawer() {
    const drawer = document.getElementById('appDetailDrawer');
    if (drawer) {
        drawer.classList.remove('active');
        drawer.setAttribute('aria-hidden', 'true');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Status strip
    document.querySelectorAll('.app-status-item').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.app-status-item').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilters.statusTab = this.getAttribute('data-status');
            currentPage = 1;
            renderApps();
        });
    });

    // Search
    const searchInput = document.getElementById('appSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentFilters.search = this.value;
            currentPage = 1;
            renderApps();
        });
    }

    // Filters
    document.getElementById('appApplyFilter')?.addEventListener('click', function() {
        currentFilters.status = document.getElementById('appStatusFilter').value;
        currentFilters.stage = document.getElementById('appStageFilter').value;
        currentFilters.type = document.getElementById('appTypeFilter').value;
        currentFilters.date = document.getElementById('appDateFilter').value;
        currentFilters.deadline = document.getElementById('appDeadlineFilter').value;
        currentPage = 1;
        renderApps();
    });

    document.getElementById('appResetFilter')?.addEventListener('click', resetAllFilters);

    // Sort
    const sortSelect = document.getElementById('appSortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            currentPage = 1;
            renderApps();
        });
    }

    // Filter button focuses the filter area
    const filterBtn = document.getElementById('appFilterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            const search = document.getElementById('appSearchInput');
            if (search) {
                search.scrollIntoView({ behavior: 'smooth', block: 'center' });
                search.focus();
            }
        });
    }

    // View toggle
    document.querySelectorAll('.appmgr-view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.appmgr-view-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            currentView = this.getAttribute('data-view');
            document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
            if (currentView === 'table') {
                document.getElementById('appTableView').classList.add('active');
            } else {
                document.getElementById('appCardView').classList.add('active');
            }
        });
    });

    // New App
    document.getElementById('newAppBtn')?.addEventListener('click', function() {
        alert('New Application - UI only demonstration. No record created.');
    });

    // Pagination
    document.getElementById('appPrevPage')?.addEventListener('click', function() {
        if (currentPage > 1) { currentPage--; renderApps(); }
    });
    document.getElementById('appNextPage')?.addEventListener('click', function() {
        const total = getFilteredData().length;
        if (currentPage < Math.ceil(total / rowsPerPage)) { currentPage++; renderApps(); }
    });
    document.getElementById('appRowsPerPage')?.addEventListener('change', function() {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        renderApps();
    });

    // Drawer
    document.getElementById('appDrawerClose')?.addEventListener('click', closeAppDrawer);
    document.getElementById('appDrawerBackdrop')?.addEventListener('click', closeAppDrawer);
    document.getElementById('drawerCloseBtn')?.addEventListener('click', closeAppDrawer);
    document.getElementById('drawerWorkflowBtn')?.addEventListener('click', function() {
        alert('View Workflow - Navigate to Workflow Tracking (frontend only placeholder).');
        closeAppDrawer();
        // try to navigate
        const items = document.querySelectorAll('.nav__item[data-page="workflow-tracking"]');
        if (items.length) items[0].click();
    });
    document.getElementById('drawerDocsBtn')?.addEventListener('click', function() {
        alert('Review Documents - Navigate to Document Verification (frontend only placeholder).');
        closeAppDrawer();
        const items = document.querySelectorAll('.nav__item[data-page="document-verification"]');
        if (items.length) items[0].click();
    });

    // Initial render
    renderApps();
});
