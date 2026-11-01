(function () {
    'use strict';

    var NOTIFICATIONS = [
        { id: 'NF-001', type: 'action', title: 'Additional documents required', text: 'APP-2026-0142 requires a valid fee payment receipt before scrutiny can continue.', time: '2 hours ago', unread: true, action: true, page: 'document-verification' },
        { id: 'NF-002', type: 'deadline', title: 'Compliance review due in 3 days', text: 'Deccan College of Engineering has an approaching compliance review deadline.', time: '5 hours ago', unread: true, action: true, page: 'deadline-alerts' },
        { id: 'NF-003', type: 'update', title: 'Application moved to Initial Scrutiny', text: 'APP-2026-0214 advanced to the Initial Scrutiny stage.', time: '1 day ago', unread: true, action: false, page: 'workflow-tracking' },
        { id: 'NF-004', type: 'system', title: 'Demo data refreshed', text: 'Illustrative application data was reloaded for this demonstration session.', time: '2 days ago', unread: false, action: false, page: 'settings' },
        { id: 'NF-005', type: 'action', title: 'Undertaking submission pending', text: 'Deccan College of Engineering has an outstanding undertaking letter.', time: '3 days ago', unread: false, action: true, page: 'applications' },
        { id: 'NF-006', type: 'deadline', title: 'Document expiry warning', text: 'The application form for APP-2026-0142 expires on 28 Oct 2026.', time: '4 days ago', unread: false, action: true, page: 'document-verification' }
    ];

    var ICONS = {
        update: '<path d="M3 9a6 6 0 106-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9 1.5V5H5.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
        deadline: '<circle cx="9" cy="9" r="6.5" stroke="currentColor" stroke-width="1.6"/><path d="M9 5v4l2.5 1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
        action: '<path d="M9 2.5l6 11.5H3L9 2.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 7v3M9 12v.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
        system: '<circle cx="9" cy="9" r="6.5" stroke="currentColor" stroke-width="1.6"/><path d="M9 6v4M9 12v.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
    };

    function esc(value) {
        return String(value).replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    }

    function goTo(page) {
        var item = document.querySelector('.sidebar__nav .nav__item[data-page="' + page + '"]') ||
            document.querySelector('.nav__item[data-page="' + page + '"]');
        if (item) item.click();
    }

    function init() {
        var list = document.getElementById('nfList');
        var empty = document.getElementById('nfEmpty');
        var count = document.getElementById('nfCount');
        var filters = document.getElementById('nfFilters');
        var markAll = document.getElementById('nfMarkAll');
        var kpiUnread = document.getElementById('nfKpiUnread');
        var kpiAction = document.getElementById('nfKpiAction');
        var kpiDeadline = document.getElementById('nfKpiDeadline');
        if (!list) return;

        var activeFilter = 'all';

        function matches(item) {
            if (activeFilter === 'unread') return item.unread;
            if (activeFilter === 'action') return item.action;
            if (activeFilter === 'deadline') return item.type === 'deadline';
            return true;
        }

        function updateKpis() {
            var unread = NOTIFICATIONS.filter(function (n) { return n.unread; }).length;
            var action = NOTIFICATIONS.filter(function (n) { return n.action; }).length;
            var deadline = NOTIFICATIONS.filter(function (n) { return n.type === 'deadline'; }).length;
            if (kpiUnread) kpiUnread.textContent = unread;
            if (kpiAction) kpiAction.textContent = action;
            if (kpiDeadline) kpiDeadline.textContent = deadline;
            if (markAll) {
                markAll.disabled = unread === 0;
                markAll.textContent = unread === 0 ? 'All caught up' : 'Mark all as read';
            }
        }

        function render() {
            var visible = NOTIFICATIONS.filter(matches);
            list.innerHTML = visible.map(function (n) {
                var unreadClass = n.unread ? ' nf-item--unread' : '';
                var newBadge = n.unread ? '<span class="nf-item__badge nf-item__badge--unread">New</span>' : '';
                var actionBadge = n.action ? '<span class="nf-item__badge">Action</span>' : '';
                var readBtn = n.unread ? '<button class="nf-read-btn" type="button" data-read="' + esc(n.id) + '">Mark read</button>' : '';
                return '<article class="nf-item' + unreadClass + '" data-id="' + esc(n.id) + '">' +
                    '<div class="nf-item__icon nf-item__icon--' + esc(n.type) + '" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' + (ICONS[n.type] || ICONS.update) + '</svg></div>' +
                    '<div class="nf-item__body">' +
                        '<div class="nf-item__top"><span class="nf-item__title">' + esc(n.title) + '</span>' + newBadge + actionBadge + '</div>' +
                        '<div class="nf-item__text">' + esc(n.text) + '</div>' +
                        '<div class="nf-item__meta"><span>' + esc(n.time) + '</span><span>Demo notification</span></div>' +
                    '</div>' +
                    '<div class="nf-item__actions">' + readBtn +
                        '<button class="nf-view-btn" type="button" data-view="' + esc(n.id) + '">View</button>' +
                    '</div>' +
                '</article>';
            }).join('');
            if (empty) empty.hidden = visible.length > 0;
            if (count) count.textContent = visible.length + ' of ' + NOTIFICATIONS.length + ' notifications';
            updateKpis();
        }

        if (filters) {
            filters.addEventListener('click', function (event) {
                var btn = event.target.closest('.nf-filter');
                if (!btn) return;
                activeFilter = btn.getAttribute('data-filter') || 'all';
                filters.querySelectorAll('.nf-filter').forEach(function (b) {
                    var on = b === btn;
                    b.classList.toggle('active', on);
                    b.setAttribute('aria-pressed', on ? 'true' : 'false');
                });
                render();
            });
        }

        list.addEventListener('click', function (event) {
            var readBtn = event.target.closest('[data-read]');
            if (readBtn) {
                var readId = readBtn.getAttribute('data-read');
                var target = NOTIFICATIONS.find(function (n) { return n.id === readId; });
                if (target) target.unread = false;
                render();
                return;
            }
            var viewBtn = event.target.closest('[data-view]');
            if (viewBtn) {
                var viewId = viewBtn.getAttribute('data-view');
                var item = NOTIFICATIONS.find(function (n) { return n.id === viewId; });
                if (item) {
                    item.unread = false;
                    render();
                    goTo(item.page);
                }
            }
        });

        if (markAll) {
            markAll.addEventListener('click', function () {
                NOTIFICATIONS.forEach(function (n) { n.unread = false; });
                render();
            });
        }

        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
