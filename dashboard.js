// PRAVAAH Approval Dashboard - Frontend only interactions

document.addEventListener('DOMContentLoaded', function() {
    // Date range selector
    const dateRangeSelect = document.getElementById('dateRangeSelect');
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', function() {
            console.log('Date range changed:', this.value);
        });
    }

    // Filter button and panel
    const filterBtn = document.getElementById('filterBtn');
    const filterPanel = document.getElementById('filterPanel');
    const filterPanelClose = document.getElementById('filterPanelClose');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');

    if (filterBtn && filterPanel) {
        filterBtn.addEventListener('click', function() {
            filterPanel.classList.toggle('active');
            filterPanel.setAttribute('aria-hidden', filterPanel.classList.contains('active') ? 'false' : 'true');
        });
    }

    if (filterPanelClose && filterPanel) {
        filterPanelClose.addEventListener('click', function() {
            filterPanel.classList.remove('active');
            filterPanel.setAttribute('aria-hidden', 'true');
        });
    }

    // Filter applications table
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            const checked = Array.from(document.querySelectorAll('#filterPanel input[type="checkbox"]:checked'))
                .map(cb => cb.value);
            const rows = document.querySelectorAll('#applicationsTable tbody tr');
            rows.forEach(row => {
                const status = row.getAttribute('data-status');
                if (checked.length === 0 || checked.includes(status)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            if (filterPanel) {
                filterPanel.classList.remove('active');
                filterPanel.setAttribute('aria-hidden', 'true');
            }
        });
    }

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function() {
            document.querySelectorAll('#filterPanel input[type="checkbox"]').forEach(cb => {
                cb.checked = true;
            });
            const rows = document.querySelectorAll('#applicationsTable tbody tr');
            rows.forEach(row => {
                row.style.display = '';
            });
        });
    }

    // Application detail modal
    const appDetailModal = document.getElementById('appDetailModal');
    const appDetailBackdrop = document.getElementById('appDetailBackdrop');
    const appDetailClose = document.getElementById('appDetailClose');
    const detailId = document.getElementById('detailId');
    const detailInst = document.getElementById('detailInst');
    const detailStage = document.getElementById('detailStage');
    const detailAction = document.getElementById('detailAction');
    const detailDue = document.getElementById('detailDue');
    const detailStatus = document.getElementById('detailStatus');

    const appData = {
        'APP-2026-0142': { inst: 'Western Institute of Technology', stage: 'Document Review', action: 'Missing supporting document', due: '28 Oct 2026', status: 'Action Required' },
        'APP-2026-0187': { inst: 'Deccan College of Engineering', stage: 'Compliance Review', action: 'Undertaking submission pending', due: '29 Oct 2026', status: 'Due Soon' },
        'APP-2026-0214': { inst: 'National Technical Institute', stage: 'Initial Scrutiny', action: 'Reviewer action pending', due: '31 Oct 2026', status: 'Under Review' },
        'APP-2026-0238': { inst: 'Sahyadri Institute of Technology', stage: 'Document Review', action: 'Document validity check', due: '26 Oct 2026', status: 'Action Required' },
        'APP-2026-0251': { inst: 'Central Institute of Engineering', stage: 'Compliance Review', action: 'Compliance response pending', due: '30 Oct 2026', status: 'Due Soon' }
    };

    document.querySelectorAll('.table-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const appId = this.getAttribute('data-app');
            const data = appData[appId] || {};
            if (detailId) detailId.textContent = appId;
            if (detailInst) detailInst.textContent = data.inst || '-';
            if (detailStage) detailStage.textContent = data.stage || '-';
            if (detailAction) detailAction.textContent = data.action || '-';
            if (detailDue) detailDue.textContent = data.due || '-';
            if (detailStatus) detailStatus.textContent = data.status || '-';
            if (appDetailModal) {
                appDetailModal.classList.add('active');
                appDetailModal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    if (appDetailClose && appDetailModal) {
        appDetailClose.addEventListener('click', function() {
            appDetailModal.classList.remove('active');
            appDetailModal.setAttribute('aria-hidden', 'true');
        });
    }
    if (appDetailBackdrop && appDetailModal) {
        appDetailBackdrop.addEventListener('click', function() {
            appDetailModal.classList.remove('active');
            appDetailModal.setAttribute('aria-hidden', 'true');
        });
    }

    // Quick actions - navigate to existing sidebar sections
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const navTarget = this.getAttribute('data-nav');
            if (!navTarget) return;
            // Try to click nav item
            const navItems = document.querySelectorAll('.nav__item[data-page="' + navTarget + '"]');
            if (navItems.length > 0) {
                navItems[0].click();
            }
        });
    });

    // Download report - client side demo export
    const downloadBtn = document.getElementById('downloadReportBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const reportData = [
                ['Application ID', 'Institution', 'Current Stage', 'Pending Action', 'Due Date', 'Status'],
                ['APP-2026-0142', 'Western Institute of Technology', 'Document Review', 'Missing supporting document', '28 Oct 2026', 'Action Required'],
                ['APP-2026-0187', 'Deccan College of Engineering', 'Compliance Review', 'Undertaking submission pending', '29 Oct 2026', 'Due Soon'],
                ['APP-2026-0214', 'National Technical Institute', 'Initial Scrutiny', 'Reviewer action pending', '31 Oct 2026', 'Under Review'],
                ['APP-2026-0238', 'Sahyadri Institute of Technology', 'Document Review', 'Document validity check', '26 Oct 2026', 'Action Required'],
                ['APP-2026-0251', 'Central Institute of Engineering', 'Compliance Review', 'Compliance response pending', '30 Oct 2026', 'Due Soon']
            ];
            const csv = reportData.map(row => row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\r\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'PRAVAAH-Approval-Dashboard-Demo-Report.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            alert('Demo export downloaded (client-side). This is illustrative mock data only.');
        });
    }

    // Make date range selector functional
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', function() {
            console.log('Date range selected:', this.options[this.selectedIndex].text);
        });
    }
});