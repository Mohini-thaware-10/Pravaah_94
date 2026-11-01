(function () {
    'use strict';

    var ARTICLES = [
        {
            id: 'getting-started',
            category: 'Getting Started',
            title: 'Getting started with the PRAVAAH demo',
            summary: 'Understand what this workspace is, what it contains, and how to explore it safely.',
            keywords: 'start introduction overview demo workspace guide first steps',
            body: '<p>PRAVAAH is a front-end demonstration of an approval, compliance and document-intelligence workspace. Everything you see is built from local mock data bundled with the application.</p><ul><li>Use the left sidebar to move between modules. Section labels group related pages.</li><li>Every module works entirely in the browser — there is no server, database or authentication layer.</li><li>Illustrative data is labelled throughout. Nothing here is an official AICTE record or decision.</li><li>Start with the <strong>Overview</strong> page, then explore <strong>Applications</strong> and <strong>Document Verification</strong>.</li></ul>'
        },
        {
            id: 'navigation',
            category: 'Navigation',
            title: 'Navigating the workspace',
            summary: 'How the sidebar, header, global search and mobile drawer work.',
            keywords: 'sidebar menu collapse search notifications profile mobile drawer header',
            body: '<p>The application shell contains the sidebar, top bar and page area.</p><ul><li><strong>Collapse the sidebar</strong> with the collapse control to widen the content area. Section labels hide automatically when collapsed.</li><li><strong>Global search</strong> opens an overlay for quickly jumping to pages and records.</li><li><strong>Notifications</strong> and the <strong>profile menu</strong> are demo overlays with fictional content.</li><li>On small screens the sidebar becomes a drawer; use the menu button in the top bar to open it.</li></ul>'
        },
        {
            id: 'overview',
            category: 'Modules',
            title: 'Reading the Overview and Approval Dashboard',
            summary: 'Interpret KPIs, attention items, filters and activity lists.',
            keywords: 'overview dashboard kpi metrics attention activity filters approvals',
            body: '<p>The Overview and Approval Dashboard summarise the demo portfolio.</p><ul><li><strong>KPI cards</strong> show counts for pending, approved, rejected and attention items.</li><li><strong>Attention items</strong> highlight applications that need reviewer action.</li><li><strong>Activity</strong> lists recent illustrative events.</li><li>KPI cards are clickable where they act as shortcuts to filtered views.</li></ul>'
        },
        {
            id: 'applications',
            category: 'Modules',
            title: 'Working with Applications',
            summary: 'Browse, search, filter, sort and open application records.',
            keywords: 'applications list search filter sort detail record institution status',
            body: '<p>The Applications page is the shared demo dataset used by several other modules.</p><ul><li>Search by application ID or institution name.</li><li>Filter by status, stage and institution, then sort columns.</li><li>Open a record to view its details and available demo actions.</li><li>Actions change local demo state only and are not persisted to a backend.</li></ul>'
        },
        {
            id: 'workflow',
            category: 'Modules',
            title: 'Understanding Workflow Tracking',
            summary: 'Read the pipeline visualization, stage details and bottleneck view.',
            keywords: 'workflow tracking pipeline stages bottleneck progress',
            body: '<p>Workflow Tracking visualises where applications sit in the approval pipeline.</p><ul><li>The pipeline shows stage-by-stage distribution.</li><li>Select a stage to inspect the applications currently within it.</li><li>The bottleneck panel highlights the stage with the largest backlog.</li></ul>'
        },
        {
            id: 'documents',
            category: 'Modules',
            title: 'Document Verification',
            summary: 'Use filters, document analysis, and the simulated upload panel.',
            keywords: 'documents verification checklist upload analyse analysis status institution',
            body: '<p>Document Verification provides a checklist-style view of demo documents.</p><ul><li>Filter by verification status and institution, and search by document or application.</li><li>Clicking a KPI card filters the table to that status.</li><li>Select <strong>Analyse</strong> to open a simulated analysis panel.</li><li>The upload area accepts a local file for demonstration only; nothing is uploaded to a server.</li></ul>'
        },
        {
            id: 'compliance',
            category: 'Modules',
            title: 'Compliance Monitoring',
            summary: 'Review the demo compliance register and workspace.',
            keywords: 'compliance monitoring register obligations review status',
            body: '<p>Compliance Monitoring presents a conceptual register of obligations and their review state.</p><ul><li>Use the register to explore compliance items and their statuses.</li><li>Open an item to view its review workspace.</li><li>All entries are illustrative and are not legal or regulatory determinations.</li></ul>'
        },
        {
            id: 'deadlines',
            category: 'Modules',
            title: 'Deadline and Alerts',
            summary: 'Explore alerts, the calendar view and notification preferences.',
            keywords: 'deadline alerts calendar reminders notification preferences due',
            body: '<p>Deadline &amp; Alerts shows illustrative due dates and reminders.</p><ul><li>Review upcoming and overdue items in the alerts list.</li><li>The calendar view highlights demo due dates.</li><li>Notification preferences are stored locally for the session.</li></ul>'
        },
        {
            id: 'reports',
            category: 'Modules',
            title: 'Reports and Analytics',
            summary: 'Build reports, preview them, and export from local demo data.',
            keywords: 'reports analytics report centre export pdf pptx csv preview filters library',
            body: '<p>Reports &amp; Analytics is a report centre built on the shared demo dataset.</p><ul><li>Choose a reporting period and filters, then generate a preview.</li><li>The library lists available report templates.</li><li><strong>PDF</strong> and <strong>PPTX</strong> exports use client-side libraries loaded from a CDN.</li><li>Exports reflect local demo data only and are not official submissions.</li></ul>'
        },
        {
            id: 'approval-stages',
            category: 'Modules',
            title: 'Configuring Approval Stages',
            summary: 'Add, reorder, edit and preview demo approval stages.',
            keywords: 'approval stages configure reorder preview stepper workflow stages',
            body: '<p>Approval Stages lets you explore how a workflow could be configured.</p><ul><li>Add or edit demo stages and assign descriptions.</li><li>Reorder stages to see the sequence update.</li><li>The preview panel shows the resulting stepper on desktop and mobile.</li><li>Changes are local to the session.</li></ul>'
        },
        {
            id: 'audit',
            category: 'Modules',
            title: 'Audit Trail',
            summary: 'Filter the illustrative activity log, open details and export CSV.',
            keywords: 'audit trail log activity filter details csv export pagination',
            body: '<p>The Audit Trail shows a fictional activity log.</p><ul><li>Filter by category, actor and result, and search the log.</li><li>Select a row to open the detail drawer.</li><li>Export the filtered log to CSV from local demo data.</li><li>Events are generated illustrations, not verified system records.</li></ul>'
        },
        {
            id: 'roles',
            category: 'Modules',
            title: 'User and Role Management',
            summary: 'Explore demo users, roles and the capability matrix.',
            keywords: 'users roles permissions capabilities matrix access governance',
            body: '<p>User &amp; Role Management demonstrates a conceptual access model.</p><ul><li>Browse demo users and their assigned roles.</li><li>Open a user to view role details and capabilities.</li><li>Role changes affect local demo state only — real authorization requires a backend.</li></ul>'
        },
        {
            id: 'simulator',
            category: 'Modules',
            title: 'Pre-Submission Failure Simulator',
            summary: 'Select an application to surface avoidable issues and corrective actions.',
            keywords: 'simulator pre-submission readiness failure findings actions history',
            body: '<p>The simulator helps applicants spot avoidable problems before submission.</p><ul><li>Select an application from the header dropdown.</li><li>Review the readiness summary, findings and corrective actions.</li><li>Past runs appear in the simulation history panel.</li><li>Results are a demonstration, not an official eligibility decision.</li></ul>'
        },
        {
            id: 'trace',
            category: 'Modules',
            title: 'Evidence-to-Decision Trace Graph',
            summary: 'Explore how sources, requirements, evidence, findings and decisions connect.',
            keywords: 'trace graph evidence decision node relationships source requirement finding',
            body: '<p>The trace graph visualises relationships between records for a selected application.</p><ul><li>Choose an application to generate the graph.</li><li>Click a node to inspect its fields and relationships in the details panel.</li><li>The trace completeness panel summarises relationship coverage.</li><li>Node colours indicate record type; validity must still be verified.</li></ul>'
        },
        {
            id: 'impact',
            category: 'Modules',
            title: 'Regulatory Change Impact Map',
            summary: 'See how a change scenario could affect requirements, evidence and tasks.',
            keywords: 'regulatory change impact map scenario requirements evidence applications tasks acknowledgment',
            body: '<p>The Impact Map analyses a selected regulatory change scenario.</p><ul><li>Choose a change scenario to render its details and impact summary.</li><li>Review affected requirements, evidence records, applications and dependent tasks.</li><li>Use the acknowledgment panel to record a local review note.</li><li>Always verify the official source before taking real action.</li></ul>'
        },
        {
            id: 'settings',
            category: 'Modules',
            title: 'Settings and Profile',
            summary: 'Adjust local preferences, appearance, accessibility and demo profile.',
            keywords: 'settings profile preferences appearance accessibility density language privacy',
            body: '<p>Settings groups local preferences into categories.</p><ul><li>Use the settings navigation to switch categories.</li><li>Appearance and accessibility options apply immediately to this session.</li><li>The profile card is fictional and used for demonstration only.</li><li>Preferences are not synced to a server.</li></ul>'
        },
        {
            id: 'demo-data',
            category: 'Data & Demo Scope',
            title: 'What is demo data?',
            summary: 'Why figures, records and statuses are illustrative.',
            keywords: 'demo data mock illustrative fictional scope disclaimer official',
            body: '<p>All records, counts, names and statuses are fictional and bundled for demonstration.</p><ul><li>Numbers are designed to show realistic-looking screens, not real statistics.</li><li>Institutions, users and IDs are invented.</li><li>Never treat demo output as an official AICTE decision or compliance finding.</li></ul>'
        },
        {
            id: 'exports',
            category: 'Data & Demo Scope',
            title: 'Exports and downloads',
            summary: 'How CSV, PDF and PPTX exports behave in this demo.',
            keywords: 'export download csv pdf pptx file report generate',
            body: '<p>Several modules can export the data currently shown.</p><ul><li><strong>CSV</strong> exports are generated locally in the browser.</li><li><strong>PDF</strong> and <strong>PPTX</strong> exports rely on CDN-loaded libraries and require an internet connection.</li><li>If an export library fails to load, use the CSV option or refresh the page.</li><li>Exported files contain demo data only.</li></ul>'
        },
        {
            id: 'reset',
            category: 'Data & Demo Scope',
            title: 'Resetting the demo',
            summary: 'How to restore local demo state.',
            keywords: 'reset restore clear reload refresh defaults local state',
            body: '<p>Many modules include a <strong>Reset</strong> action that restores their default demo state.</p><ul><li>Reset buttons affect only the current page or session.</li><li>Refreshing the browser also restores bundled demo data for modules that do not persist.</li><li>Some preference toggles may persist in browser storage depending on the module.</li></ul>'
        },
        {
            id: 'troubleshooting',
            category: 'Troubleshooting',
            title: 'Troubleshooting common issues',
            summary: 'Fix empty panels, missing exports and layout problems.',
            keywords: 'troubleshooting problem empty blank export error layout mobile fix',
            body: '<ul><li><strong>Empty simulator, trace or impact panels:</strong> select an application or change scenario from the header dropdown.</li><li><strong>Export does nothing:</strong> the PDF/PPTX libraries load from a CDN — check your connection, or use CSV.</li><li><strong>Layout looks cramped:</strong> collapse the sidebar or resize the window; pages are responsive down to mobile widths.</li><li><strong>Stale content:</strong> refresh the page to restore bundled demo data.</li></ul>'
        },
        {
            id: 'accessibility',
            category: 'Getting Started',
            title: 'Keyboard and accessibility',
            summary: 'Keyboard shortcuts and accessibility options.',
            keywords: 'keyboard accessibility focus screen reader contrast large text reduced motion',
            body: '<p>The interface supports keyboard navigation and includes accessibility preferences.</p><ul><li>Use <strong>Tab</strong> and <strong>Shift+Tab</strong> to move between controls; <strong>Enter</strong> or <strong>Space</strong> activates buttons.</li><li>Open <strong>Settings → Accessibility</strong> to enable reduced motion, higher contrast, larger text or enhanced focus outlines.</li><li>Dialogs and drawers can be dismissed with their close controls.</li></ul>'
        }
    ];

    var FAQS = [
        { q: 'Is any of this data saved to a server?', a: 'No. The application is front-end only. Data is bundled locally and, where a module mentions persistence, it is stored in the browser only.' },
        { q: 'Are the approvals, compliance results or decisions official?', a: 'No. Every record, status and result is an illustration for demonstration. Official decisions must come from the relevant authority.' },
        { q: 'Why is a panel empty until I select something?', a: 'The simulator, trace graph and impact map render after you choose an application or change scenario from the dropdown in the page header.' },
        { q: 'Can I create real users or roles?', a: 'No. User and role management is a conceptual demonstration. Real authentication and authorization require a backend.' },
        { q: 'Do PDF and PPTX exports work offline?', a: 'They use libraries loaded from a CDN, so they need an internet connection. CSV exports are generated locally and work without one.' },
        { q: 'How do I restore the original demo data?', a: 'Use the Reset action on a module where available, or refresh the browser to reload the bundled demo dataset.' }
    ];

    var state = { q: '', category: 'All', openId: null };

    function byId(id) {
        return document.getElementById(id);
    }

    function getCategories() {
        var seen = {};
        var list = ['All'];
        ARTICLES.forEach(function (a) {
            if (!seen[a.category]) {
                seen[a.category] = true;
                list.push(a.category);
            }
        });
        return list;
    }

    function matches(article) {
        if (state.category !== 'All' && article.category !== state.category) return false;
        if (!state.q) return true;
        var haystack = (article.title + ' ' + article.summary + ' ' + article.category + ' ' + article.keywords + ' ' + article.body).toLowerCase();
        return haystack.indexOf(state.q) !== -1;
    }

    function renderCategories() {
        var host = byId('hlpCats');
        if (!host) return;
        host.innerHTML = getCategories().map(function (cat) {
            var active = cat === state.category ? ' active' : '';
            return '<button type="button" class="hlp-cat' + active + '" data-cat="' + cat + '" aria-pressed="' + (cat === state.category) + '">' + cat + '</button>';
        }).join('');
    }

    function renderList() {
        var host = byId('hlpArticles');
        var empty = byId('hlpEmpty');
        var count = byId('hlpResultCount');
        if (!host) return;
        var list = ARTICLES.filter(matches);
        if (empty) empty.hidden = list.length !== 0;
        host.hidden = list.length === 0;
        if (count) {
            count.textContent = list.length + (list.length === 1 ? ' article' : ' articles') + (state.q ? ' for "' + state.q + '"' : '') + ' in ' + state.category;
        }
        host.innerHTML = list.map(function (a) {
            return '<button type="button" class="hlp-card" data-article="' + a.id + '">' +
                '<span class="hlp-card__cat">' + a.category + '</span>' +
                '<span class="hlp-card__title">' + a.title + '</span>' +
                '<span class="hlp-card__summary">' + a.summary + '</span>' +
                '<span class="hlp-card__more">Read article <span aria-hidden="true">&rarr;</span></span>' +
                '</button>';
        }).join('');
    }

    function openArticle(id) {
        var article = ARTICLES.filter(function (a) { return a.id === id; })[0];
        if (!article) return;
        state.openId = id;
        var detail = byId('hlpDetail');
        var list = byId('hlpArticles');
        var empty = byId('hlpEmpty');
        if (!detail) return;
        detail.innerHTML = '<article class="hlp-article">' +
            '<button type="button" class="hlp-back" id="hlpBack">&larr; Back to all topics</button>' +
            '<span class="hlp-card__cat">' + article.category + '</span>' +
            '<h2 class="hlp-article__title">' + article.title + '</h2>' +
            '<p class="hlp-article__summary">' + article.summary + '</p>' +
            '<div class="hlp-article__body">' + article.body + '</div>' +
            '</article>';
        detail.hidden = false;
        if (list) list.hidden = true;
        if (empty) empty.hidden = true;
        var back = byId('hlpBack');
        if (back) back.addEventListener('click', closeArticle);
        detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function closeArticle() {
        state.openId = null;
        var detail = byId('hlpDetail');
        if (detail) {
            detail.hidden = true;
            detail.innerHTML = '';
        }
        renderList();
    }

    function renderFaq() {
        var host = byId('hlpFaq');
        if (!host) return;
        host.innerHTML = FAQS.map(function (f, i) {
            return '<div class="hlp-faq__item">' +
                '<button type="button" class="hlp-faq__q" aria-expanded="false" aria-controls="hlpFaqA' + i + '">' +
                '<span>' + f.q + '</span><span class="hlp-faq__icon" aria-hidden="true">+</span>' +
                '</button>' +
                '<div class="hlp-faq__a" id="hlpFaqA' + i + '" hidden>' + f.a + '</div>' +
                '</div>';
        }).join('');
    }

    function onFaqClick(e) {
        var btn = e.target.closest('.hlp-faq__q');
        if (!btn) return;
        var item = btn.parentNode;
        var answer = item.querySelector('.hlp-faq__a');
        var isOpen = item.classList.contains('active');
        var container = byId('hlpFaq');
        if (container) {
            container.querySelectorAll('.hlp-faq__item.active').forEach(function (openItem) {
                openItem.classList.remove('active');
                var openAnswer = openItem.querySelector('.hlp-faq__a');
                var openBtn = openItem.querySelector('.hlp-faq__q');
                if (openAnswer) openAnswer.hidden = true;
                if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
            });
        }
        if (!isOpen && answer) {
            item.classList.add('active');
            answer.hidden = false;
            btn.setAttribute('aria-expanded', 'true');
        }
    }

    function init() {
        if (!byId('hlpArticles')) return;

        renderCategories();
        renderList();
        renderFaq();

        var search = byId('hlpSearch');
        if (search) {
            search.addEventListener('input', function () {
                state.q = this.value.trim().toLowerCase();
                closeArticle();
            });
        }

        var cats = byId('hlpCats');
        if (cats) {
            cats.addEventListener('click', function (e) {
                var btn = e.target.closest('.hlp-cat');
                if (!btn) return;
                state.category = btn.getAttribute('data-cat');
                closeArticle();
                renderCategories();
                renderList();
            });
        }

        var articles = byId('hlpArticles');
        if (articles) {
            articles.addEventListener('click', function (e) {
                var card = e.target.closest('.hlp-card');
                if (card) openArticle(card.getAttribute('data-article'));
            });
        }

        var faq = byId('hlpFaq');
        if (faq) faq.addEventListener('click', onFaqClick);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
