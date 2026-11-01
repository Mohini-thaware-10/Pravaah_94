(function () {
    'use strict';

    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var DEMO_TODAY = new Date(2026, 9, 31);
    var completed = new Set();

    function esc(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    }

    function parseDate(str) {
        var parts = String(str || '').trim().split(/\s+/);
        if (parts.length < 3) return null;
        var month = MONTHS.indexOf(parts[1]);
        if (month < 0) return null;
        return new Date(Number(parts[2]), month, Number(parts[0]));
    }

    function daysUntil(str) {
        var date = parseDate(str);
        if (!date) return 999;
        return Math.round((date.getTime() - DEMO_TODAY.getTime()) / 86400000);
    }

    function goTo(page) {
        var item = document.querySelector('.sidebar__nav .nav__item[data-page="' + page + '"]') ||
            document.querySelector('.nav__item[data-page="' + page + '"]');
        if (item) item.click();
    }

    function buildTasks() {
        if (typeof applicationsData === 'undefined' || !Array.isArray(applicationsData)) return [];
        var tasks = [];
        var seen = {};
        applicationsData.forEach(function (app) {
            var days = daysUntil(app.deadline);
            var baseStatus = days < 0 ? 'overdue' : (days <= 3 ? 'due' : 'open');
            var priority = (app.status === 'Action Required' || baseStatus === 'overdue')
                ? 'high'
                : ((baseStatus === 'due' || app.status === 'Due Soon') ? 'medium' : 'low');

            function add(title, page) {
                var key = app.id + '::' + title;
                if (seen[key]) return;
                seen[key] = true;
                tasks.push({
                    id: 'TASK-' + (tasks.length + 1),
                    title: title,
                    appId: app.id,
                    institution: app.institution,
                    stage: app.stage,
                    due: app.deadline,
                    baseStatus: baseStatus,
                    priority: priority,
                    page: page
                });
            }

            (app.documents || []).forEach(function (doc) {
                if (doc.status && doc.status !== 'received') add('Verify ' + doc.name, 'document-verification');
            });
            (app.checklist || []).forEach(function (check) {
                if (check.status === 'pending') add(check.label, 'document-verification');
            });
            (app.prerequisites || []).forEach(function (prereq) {
                if (prereq.status === 'pending') add(prereq.label, 'workflow-tracking');
            });
        });
        return tasks;
    }

    function init() {
        var body = document.getElementById('mtBody');
        if (!body) return;

        var tasks = buildTasks();
        var search = document.getElementById('mtSearch');
        var prioritySel = document.getElementById('mtPriority');
        var statusSel = document.getElementById('mtStatus');
        var count = document.getElementById('mtCount');
        var empty = document.getElementById('mtEmpty');
        var kpiOpen = document.getElementById('mtKpiOpen');
        var kpiDue = document.getElementById('mtKpiDue');
        var kpiOverdue = document.getElementById('mtKpiOverdue');
        var kpiDone = document.getElementById('mtKpiDone');

        function statusOf(task) {
            return completed.has(task.id) ? 'done' : task.baseStatus;
        }

        function updateKpis() {
            var open = 0, due = 0, overdue = 0;
            tasks.forEach(function (task) {
                var status = statusOf(task);
                if (status === 'done') return;
                open += 1;
                if (status === 'due') due += 1;
                if (status === 'overdue') overdue += 1;
            });
            if (kpiOpen) kpiOpen.textContent = open;
            if (kpiDue) kpiDue.textContent = due;
            if (kpiOverdue) kpiOverdue.textContent = overdue;
            if (kpiDone) kpiDone.textContent = completed.size;
        }

        function render() {
            var term = (search ? search.value : '').trim().toLowerCase();
            var priority = prioritySel ? prioritySel.value : 'all';
            var statusFilter = statusSel ? statusSel.value : 'all';

            var visible = tasks.filter(function (task) {
                var status = statusOf(task);
                if (priority !== 'all' && task.priority !== priority) return false;
                if (statusFilter !== 'all' && status !== statusFilter) return false;
                if (!term) return true;
                return [task.title, task.appId, task.institution, task.stage, task.priority, status].join(' ').toLowerCase().indexOf(term) !== -1;
            });

            body.innerHTML = visible.map(function (task) {
                var status = statusOf(task);
                var statusLabel = { open: 'Open', due: 'Due Soon', overdue: 'Overdue', done: 'Completed' }[status];
                var priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
                var doneClass = status === 'done' ? ' mt-task-title--done' : '';
                var doneText = status === 'done' ? 'Undo' : 'Done';
                return '<tr>' +
                    '<td data-label="Task"><span class="mt-task-title' + doneClass + '">' + esc(task.title) + '</span><span class="mt-task-app">' + esc(task.appId) + '</span></td>' +
                    '<td data-label="Institution">' + esc(task.institution) + '</td>' +
                    '<td data-label="Stage">' + esc(task.stage) + '</td>' +
                    '<td data-label="Priority"><span class="mt-badge mt-badge--' + esc(task.priority) + '">' + esc(priorityLabel) + '</span></td>' +
                    '<td data-label="Due">' + esc(task.due) + '</td>' +
                    '<td data-label="Status"><span class="mt-status mt-status--' + esc(status) + '">' + esc(statusLabel) + '</span></td>' +
                    '<td data-label="Actions"><div class="mt-actions">' +
                        '<button class="mt-open-btn" type="button" data-open="' + esc(task.id) + '">Open</button>' +
                        '<button class="mt-done-btn" type="button" data-done="' + esc(task.id) + '">' + doneText + '</button>' +
                    '</div></td>' +
                '</tr>';
            }).join('');

            if (empty) empty.hidden = visible.length > 0;
            if (count) count.textContent = visible.length + ' of ' + tasks.length + ' tasks';
            updateKpis();
        }

        [search, prioritySel, statusSel].forEach(function (el) {
            if (el) {
                el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', render);
            }
        });

        body.addEventListener('click', function (event) {
            var openBtn = event.target.closest('[data-open]');
            if (openBtn) {
                var openId = openBtn.getAttribute('data-open');
                var openTask = tasks.find(function (task) { return task.id === openId; });
                if (openTask) goTo(openTask.page);
                return;
            }
            var doneBtn = event.target.closest('[data-done]');
            if (doneBtn) {
                var doneId = doneBtn.getAttribute('data-done');
                if (completed.has(doneId)) completed.delete(doneId);
                else completed.add(doneId);
                render();
            }
        });

        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
