// PRAVAAH Workflow Tracking - Frontend only

const wfStages = ['Application Submitted', 'Initial Scrutiny', 'Document Review', 'Compliance Review', 'Final Decision'];

const wfStageMeta = {
    'Application Submitted': {
        count: 126,
        pending: 'Pending assignment to scrutiny desk',
        avgTime: '—',
        reasons: 'Initial assignment backlog (demo)',
        followup: 'Assign to review officer (demo)'
    },
    'Initial Scrutiny': {
        count: 324,
        pending: 'Reviewer action pending',
        avgTime: '4.2 days',
        reasons: 'Incomplete checklist entries (demo)',
        followup: 'Route to scrutiny reviewer (demo)'
    },
    'Document Review': {
        count: 278,
        pending: 'Supporting document required',
        avgTime: '6.1 days',
        reasons: 'Missing or invalid supporting documents (demo)',
        followup: 'Review missing-document status (demo)'
    },
    'Compliance Review': {
        count: 186,
        pending: 'Compliance response pending',
        avgTime: '5.4 days',
        reasons: 'Undertaking or compliance response pending (demo)',
        followup: 'Check compliance submission (demo)'
    },
    'Final Decision': {
        count: 94,
        pending: 'Awaiting final decision review',
        avgTime: '—',
        reasons: 'Final review queue (demo)',
        followup: 'Prepare decision summary for authorized official (demo)'
    }
};

let wfCurrentStage = 'Application Submitted';
let wfSelectedAppId = 'APP-2026-0142';

function wfGetApps() {
    if (typeof applicationsData !== 'undefined') return applicationsData;
    return [];
}

function wfFilteredApps() {
    const search = (document.getElementById('wfSearchInput')?.value || '').toLowerCase();
    const stage = document.getElementById('wfStageFilter')?.value || 'all';
    const status = document.getElementById('wfStatusFilter')?.value || 'all';
    const range = document.getElementById('wfDateRange')?.value || 'all';
    const today = new Date(2026, 9, 23);
    return wfGetApps().filter(app => {
        if (search && !(app.id.toLowerCase().includes(search) || app.institution.toLowerCase().includes(search))) return false;
        if (stage !== 'all' && app.stage !== stage) return false;
        if (status !== 'all' && app.status !== status) return false;
        if (range !== 'all') {
            const submitted = typeof parseAppDate === 'function' ? parseAppDate(app.submitted) : null;
            if (!submitted) return false;
            const diffDays = Math.round((today - submitted) / 86400000);
            if (diffDays < 0 || diffDays > parseInt(range, 10)) return false;
        }
        return true;
    });
}

function wfRenderStageDetails(stage) {
    const meta = wfStageMeta[stage] || {};
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('wfStageDetailName', stage);
    set('wfStageDetailCount', meta.count != null ? meta.count : '—');
    set('wfStageDetailPending', meta.pending || '—');
    set('wfStageDetailTime', meta.avgTime || '—');
    set('wfStageDetailReasons', meta.reasons || '—');
    set('wfStageDetailFollowup', meta.followup || '—');

    const list = document.getElementById('wfStageApps');
    if (list) {
        const apps = wfGetApps().filter(a => a.stage === stage);
        list.innerHTML = '';
        if (apps.length === 0) {
            const empty = document.createElement('span');
            empty.className = 'wf-stage-apps__empty';
            empty.textContent = 'No sample applications in this stage.';
            list.appendChild(empty);
        } else {
            apps.forEach(app => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'wf-stage-app-link';
                item.setAttribute('data-app', app.id);
                item.textContent = app.id + ' — ' + app.institution;
                list.appendChild(item);
            });
        }
    }
}

function wfProgressPercent(stage) {
    const idx = wfStages.indexOf(stage);
    if (idx < 0) return 0;
    return Math.round(((idx + 1) / wfStages.length) * 100);
}

function wfRenderTimeline(app) {
    const items = document.querySelectorAll('#wfVerticalTimeline .wf-vt-item');
    const currentIdx = wfStages.indexOf(app.stage);
    items.forEach((item, idx) => {
        item.classList.remove('completed', 'current', 'upcoming');
        const statusEl = item.querySelector('.wf-vt-status');
        if (idx < currentIdx) {
            item.classList.add('completed');
            if (statusEl) statusEl.textContent = 'Completed (demo)';
        } else if (idx === currentIdx) {
            item.classList.add('current');
            if (statusEl) statusEl.textContent = 'Current stage (demo)';
        } else {
            item.classList.add('upcoming');
            if (statusEl) statusEl.textContent = 'Upcoming';
        }
    });
}

function wfRenderSelectedApp(appId) {
    const app = wfGetApps().find(a => a.id === appId);
    if (!app) return;
    wfSelectedAppId = appId;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('wfTrackId', app.id);
    set('wfTrackInst', app.institution);
    set('wfTrackStage', app.stage);
    set('wfTrackProgress', wfProgressPercent(app.stage) + '% (illustrative)');
    set('wfTrackSubmit', app.submitted);
    set('wfTrackAction', app.action);
    set('wfTrackDue', app.deadline);
    wfRenderTimeline(app);
}

function wfPopulateAppSelect() {
    const select = document.getElementById('wfAppSelect');
    if (!select) return;
    const apps = wfFilteredApps();
    select.innerHTML = '';
    if (apps.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'No applications match filters';
        select.appendChild(opt);
        return;
    }
    apps.forEach(app => {
        const opt = document.createElement('option');
        opt.value = app.id;
        opt.textContent = `${app.id} — ${app.institution}`;
        select.appendChild(opt);
    });
    if (!apps.some(a => a.id === wfSelectedAppId)) {
        wfSelectedAppId = apps[0].id;
    }
    select.value = wfSelectedAppId;
    wfRenderSelectedApp(wfSelectedAppId);
}

function wfRenderPipelineActive() {
    document.querySelectorAll('.wf-pipeline-step').forEach(step => {
        const active = step.getAttribute('data-stage') === wfCurrentStage;
        step.classList.toggle('active', active);
        step.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
}

function wfResetFilters() {
    const search = document.getElementById('wfSearchInput');
    const stage = document.getElementById('wfStageFilter');
    const status = document.getElementById('wfStatusFilter');
    const dateRange = document.getElementById('wfDateRange');
    if (search) search.value = '';
    if (stage) stage.value = 'all';
    if (status) status.value = 'all';
    if (dateRange) dateRange.value = 'all';
    wfPopulateAppSelect();
}

document.addEventListener('DOMContentLoaded', function() {
    // Initial stage detail
    wfRenderStageDetails(wfCurrentStage);
    wfRenderPipelineActive();
    wfPopulateAppSelect();

    // Pipeline stage selection
    document.querySelectorAll('.wf-pipeline-step').forEach(step => {
        step.setAttribute('role', 'button');
        step.setAttribute('tabindex', '0');
        step.setAttribute('aria-pressed', step.classList.contains('active') ? 'true' : 'false');
        const selectStage = function() {
            wfCurrentStage = step.getAttribute('data-stage');
            wfRenderPipelineActive();
            wfRenderStageDetails(wfCurrentStage);
            // Pre-select stage filter for the tracked application list
            const stageFilter = document.getElementById('wfStageFilter');
            if (stageFilter) {
                stageFilter.value = wfCurrentStage;
                wfPopulateAppSelect();
            }
        };
        step.addEventListener('click', selectStage);
        step.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectStage();
            }
        });
    });

    // Search and filters
    ['wfSearchInput', 'wfStageFilter', 'wfStatusFilter', 'wfDateRange'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const evt = id === 'wfSearchInput' ? 'input' : 'change';
            el.addEventListener(evt, wfPopulateAppSelect);
        }
    });

    const resetBtn = document.getElementById('wfResetFilters');
    if (resetBtn) resetBtn.addEventListener('click', wfResetFilters);

    const appSelect = document.getElementById('wfAppSelect');
    if (appSelect) {
        appSelect.addEventListener('change', function() {
            if (this.value) wfRenderSelectedApp(this.value);
        });
    }

    // Bottleneck / stage application actions - navigate to Applications and open the record
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.wf-link-btn, .wf-view-app-btn, .wf-stage-app-link');
        if (!btn) return;
        const appId = btn.getAttribute('data-app');
        if (!appId) return;
        const navItems = document.querySelectorAll('.nav__item[data-page="applications"]');
        if (navItems.length) navItems[0].click();
        setTimeout(() => {
            if (typeof openAppDrawer === 'function') {
                openAppDrawer(appId);
            }
        }, 50);
    });
});
