(function () {
    'use strict';

    var MAX_OPEN_GROUPS = 2;

    var GROUP_ICONS = {
        applications: '<path d="M5 3h8l2 2v10H5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 8h5M7 11h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
        shield: '<path d="M9 2l6 3v5c0 3.5-2.5 6-6 7-3.5-1-6-3.5-6-7V5l6-3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 9l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
        network: '<circle cx="9" cy="9" r="2.5" stroke="currentColor" stroke-width="1.5"/><circle cx="3" cy="4" r="1.5" stroke="currentColor" stroke-width="1.5"/><circle cx="15" cy="4" r="1.5" stroke="currentColor" stroke-width="1.5"/><circle cx="3" cy="14" r="1.5" stroke="currentColor" stroke-width="1.5"/><circle cx="15" cy="14" r="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M4.2 5.1l3 2.3M13.8 5.1l-3 2.3M4.2 12.9l3-2.3M13.8 12.9l-3-2.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
        clock: '<circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M9 5v4l2.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
        chart: '<path d="M3 15V4M7.5 15V8M12 15V6M16 15V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
        users: '<circle cx="7" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M2.5 15c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="13" cy="7" r="1.8" stroke="currentColor" stroke-width="1.5"/><path d="M11.5 10.8c2.2 0 4 1.7 4 3.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
        logout: '<path d="M9 18v1M9 3v1m6-3a6 6 0 1 1-12 0 6 6 0 0 1 12 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5 12h14M12 8l-4 4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
    };

    var NAV_GROUPS = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: 'dashboard',
            standalone: true,
            items: [
                { page: 'approval-dashboard', label: 'Dashboard' }
            ]
        },
        {
            key: 'applications',
            label: 'Application Management',
            icon: 'applications',
            items: [
                { page: 'applications', label: 'Applications' },
                { page: 'workflow-tracking', label: 'Workflow Tracking' },
                { page: 'approval-stages', label: 'Approval Stages' }
            ]
        },
        {
            key: 'document-intelligence',
            label: 'Document Intelligence',
            icon: 'shield',
            items: [
                { page: 'document-verification', label: 'Document Verification' },
                { page: 'pre-submission-simulator', label: 'Pre-Submission Failure Simulator' }
            ]
        },
        {
            key: 'compliance-center',
            label: 'Compliance Center',
            icon: 'users',
            items: [
                { page: 'compliance-monitoring', label: 'Compliance Monitoring' },
                { page: 'approval-to-compliance', label: 'Approval-to-Compliance' },
                { page: 'trace-graph', label: 'Evidence-to-Decision Trace Graph' },
                { page: 'impact-map', label: 'Regulatory Change Impact Map' }
            ]
        },
        {
            key: 'tasks-deadlines',
            label: 'Tasks & Deadlines',
            icon: 'clock',
            items: [
                { page: 'deadline-alerts', label: 'Deadline & Alerts' },
                { page: 'my-tasks', label: 'My Tasks' }
            ]
        },
        {
            key: 'reports-analytics',
            label: 'Reports & Analytics',
            icon: 'chart',
            items: [
                { page: 'reports-analytics', label: 'Reports & Analytics' },
                { page: 'audit-trail', label: 'Audit Trail' }
            ]
        },
        {
            key: 'administration',
            label: 'Administration',
            icon: 'users',
            items: [
                { page: 'user-role-management', label: 'User & Role Management' }
            ]
        }
    ];

    var sidebar = document.getElementById('sidebar');
    var nav = document.getElementById('sidebarNav');
    var backdrop = document.getElementById('sidebarBackdrop');
    var collapseBtn = document.getElementById('sidebarCollapse');
    if (!sidebar || !nav) return;

    var openOrder = [];

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (ch) {
            return { '&': '&', '<': '<', '>': '>', '"': '"', "'": "'" }[ch];
        });
    }

    function groupIcon(key) {
        return '<svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + (GROUP_ICONS[key] || GROUP_ICONS.overview) + '</svg>';
    }

    function isDashboardPage(page) {
        return page === 'approval-dashboard';
    }

    function renderDashboardStandalone() {
        var dashboardGroup = nav.querySelector('.sidebar__group[data-group="dashboard"]');
        if (dashboardGroup) {
            dashboardGroup.style.display = 'none';
        }
        var standaloneHtml = '<button class="nav__item nav__item--dashboard active" type="button" data-page="approval-dashboard" title="Dashboard">' +
            '<span class="nav__text">Dashboard</span>' +
            '</button>';
        return standaloneHtml;
    }

    function renderGroups() {
        var dashboardHtml = '';
        var otherGroupsHtml = '';

        NAV_GROUPS.forEach(function (group) {
            if (group.standalone && group.key === 'dashboard') {
                dashboardHtml = renderDashboardStandalone();
            } else {
                var items = group.items.map(function (item) {
                    var active = item.page === 'overview' ? ' active' : '';
                    return '<button class="nav__item' + active + '" type="button" data-page="' + escapeHtml(item.page) + '" title="' + escapeHtml(item.label) + '">' +
                        '<span class="nav__text">' + escapeHtml(item.label) + '</span>' +
                        '</button>';
                }).join('');
                var hasSubmenu = group.items && group.items.length > 0;
                var groupToggleHtml = '';
                if (hasSubmenu) {
                    groupToggleHtml = '<button class="sidebar__group-toggle" type="button" aria-expanded="false" aria-controls="group-' + escapeHtml(group.key) + '" data-tooltip="' + escapeHtml(group.label) + '" aria-label="' + escapeHtml(group.label) + '">' +
                        '<span class="sidebar__group-icon" aria-hidden="true">' + groupIcon(group.icon) + '</span>' +
                        '<span class="sidebar__group-label">' + escapeHtml(group.label) + '</span>' +
                        '<span class="sidebar__group-chevron" aria-hidden="true"><svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
                        '</button>';
                }
                otherGroupsHtml += '<div class="sidebar__group" data-group="' + escapeHtml(group.key) + '">' +
                    groupToggleHtml +
                    '<div class="sidebar__submenu" id="group-' + escapeHtml(group.key) + '" role="group" aria-label="' + escapeHtml(group.label) + '">' +
                    '<div class="sidebar__submenu-inner">' + items + '</div>' +
                    '</div>' +
                '</div>';
            }
        });

        nav.innerHTML = dashboardHtml + otherGroupsHtml;
    }

    function getGroup(key) {
        return nav.querySelector('.sidebar__group[data-group="' + key + '"]');
    }

    function getToggle(group) {
        return group ? group.querySelector('.sidebar__group-toggle') : null;
    }

    function isCollapsed() {
        return sidebar.classList.contains('collapsed');
    }

    function markOpen(group) {
        if (!group) return;
        var key = group.getAttribute('data-group');
        group.classList.add('open');
        var toggle = getToggle(group);
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
        var existing = openOrder.indexOf(key);
        if (existing !== -1) openOrder.splice(existing, 1);
        openOrder.push(key);
        while (openOrder.length > MAX_OPEN_GROUPS) {
            var oldKey = openOrder.shift();
            if (oldKey === key) continue;
            var oldGroup = getGroup(oldKey);
            if (oldGroup) {
                oldGroup.classList.remove('open');
                var oldToggle = getToggle(oldGroup);
                if (oldToggle) oldToggle.setAttribute('aria-expanded', 'false');
            }
        }
    }

    function markClosed(group) {
        if (!group) return;
        var key = group.getAttribute('data-group');
        group.classList.remove('open');
        var toggle = getToggle(group);
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        var index = openOrder.indexOf(key);
        if (index !== -1) openOrder.splice(index, 1);
    }

    function toggleGroup(group) {
        if (!group) return;
        if (isCollapsed()) {
            sidebar.classList.remove('collapsed');
            markOpen(group);
            return;
        }
        if (group.classList.contains('open')) markClosed(group);
        else markOpen(group);
    }

    function syncActive() {
        var activeItem = null;
        nav.querySelectorAll('.nav__item[data-page]').forEach(function (item) {
            if (item.classList.contains('active')) {
                item.setAttribute('aria-current', 'page');
                activeItem = item;
            } else if (item.getAttribute('aria-current') === 'page') {
                item.removeAttribute('aria-current');
            }
        });
        nav.querySelectorAll('.sidebar__group').forEach(function (group) {
            var hasActive = !!group.querySelector('.nav__item.active');
            group.classList.toggle('has-active', hasActive);
        });
        if (activeItem) markOpen(activeItem.closest('.sidebar__group'));
    }

    function syncCollapse() {
        if (!collapseBtn) return;
        var collapsed = isCollapsed();
        collapseBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        collapseBtn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
        collapseBtn.setAttribute('title', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
        sidebar.setAttribute('data-collapsed', collapsed ? 'true' : 'false');
    }

    function syncDrawer() {
        var mobile = window.innerWidth <= 768;
        var open = sidebar.classList.contains('mobile-open');
        if (backdrop) backdrop.classList.toggle('active', mobile && open);
        document.body.classList.toggle('sidebar-open', mobile && open);
        if (mobile && !open) sidebar.setAttribute('aria-hidden', 'true');
        else sidebar.removeAttribute('aria-hidden');
    }

    function closeDrawer() {
        sidebar.classList.remove('mobile-open');
    }

    function applyResponsive() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('collapsed');
        } else if (window.innerWidth <= 1024) {
            sidebar.classList.add('collapsed');
        }
        syncDrawer();
    }

    renderGroups();

    nav.addEventListener('click', function (event) {
        var toggle = event.target.closest('.sidebar__group-toggle');
        if (toggle) {
            event.preventDefault();
            toggleGroup(toggle.closest('.sidebar__group'));
        } else if (event.target.classList.contains('nav__item')) {
            event.preventDefault();
            var page = event.target.getAttribute('data-page');
            if (page) {
                var pageId = page === 'approval-dashboard' ? 'approval-dashboard' : page;
                nav.querySelectorAll('.nav__item').forEach(function (item) {
                    item.classList.remove('active');
                    item.removeAttribute('aria-current');
                });
                event.target.classList.add('active');
                event.target.setAttribute('aria-current', 'page');
                navigateToPage(pageId);
            }
        }
    });

    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    var sidebarObserver = new MutationObserver(function () {
        syncCollapse();
        syncDrawer();
    });
    sidebarObserver.observe(sidebar, { attributes: true, attributeFilter: ['class'] });

    var navObserver = new MutationObserver(function () {
        syncActive();
    });
    nav.querySelectorAll('.nav__item[data-page]').forEach(function (item) {
        navObserver.observe(item, { attributes: true, attributeFilter: ['class'] });
    });

    window.addEventListener('resize', function () {
        applyResponsive();
    });

    window.PRAVAAH_SIDEBAR = {
        groups: NAV_GROUPS,
        syncActive: syncActive,
        toggleCollapse: function () { sidebar.classList.toggle('collapsed'); },
        openMobile: function () { sidebar.classList.add('mobile-open'); },
        closeMobile: closeDrawer
    };

    applyResponsive();
    syncCollapse();
    syncDrawer();
    syncActive();

    document.addEventListener('DOMContentLoaded', function () {
        applyResponsive();
        syncActive();
        setTimeout(syncActive, 0);
        setTimeout(syncActive, 120);
    });

    window.addEventListener('load', function () {
        syncActive();
    });

    function navigateToPage(pageId) {
        var pageTitles = {
            'overview': 'Overview',
            'approval-dashboard': 'Approval Dashboard',
            'applications': 'Applications',
            'workflow-tracking': 'Workflow Tracking',
            'document-verification': 'Document Verification',
            'pre-submission-simulator': 'Pre-Submission Simulator',
            'compliance-monitoring': 'Compliance Monitoring',
            'approval-to-compliance': 'Approval-to-Compliance Continuity',
            'approval-stages': 'Approval Stages',
            'audit-trail': 'Audit Trail',
            'user-role-management': 'User & Role Management',
            'help': 'Help & Guidelines',
            'settings': 'Settings',
            'pre-submission-simulator': 'Pre-Submission Simulator',
            'trace-graph': 'Evidence-to-Decision Trace',
            'impact-map': 'Regulatory Change Impact',
            'notifications': 'Notifications',
            'my-tasks': 'My Tasks'
        };

        var pages = document.querySelectorAll('.page');
        var breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
        var headerSectionTitle = document.getElementById('headerSectionTitle');

        pages.forEach(function (page) {
            if (page.id === 'page-' + pageId) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        if (breadcrumbCurrent) {
            if (pageId === 'applications') {
                breadcrumbCurrent.textContent = 'Applications';
            } else if (pageId === 'approval-dashboard') {
                breadcrumbCurrent.textContent = 'Approval Dashboard';
            } else {
                breadcrumbCurrent.textContent = pageTitles[pageId] || '';
            }
        }
        if (headerSectionTitle) {
            if (pageId === 'applications') {
                headerSectionTitle.textContent = 'Applications';
            } else if (pageId === 'approval-dashboard') {
                headerSectionTitle.textContent = 'Approval Dashboard';
            } else {
                headerSectionTitle.textContent = pageTitles[pageId] || '';
            }
        }

        if (sidebar) {
            sidebar.classList.remove('mobile-open');
        }
    }
})();