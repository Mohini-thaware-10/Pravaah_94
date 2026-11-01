// PRAVAAH Copilot - Frontend only demo assistant

const copilotSuggestions = [
    { id: 'wf', text: 'Explain the application workflow' },
    { id: 'pending', text: 'Find applications pending review' },
    { id: 'docs', text: 'Explain document verification' },
    { id: 'comp', text: 'Show compliance items needing attention' },
    { id: 'dead', text: 'Summarize upcoming demo deadlines' },
    { id: 'rep', text: 'Explain the Reports & Analytics page' },
    { id: 'stages', text: 'Explain approval stages' },
    { id: 'audit', text: 'How do I use the Audit Trail?' }
];

let copilotHistory = [];

function copilotEsc(t){ const d=document.createElement('div'); d.textContent=String(t); return d.innerHTML; }

function copilotRenderChips(){
    const wrap = document.getElementById('copilotChips');
    if(!wrap) return;
    wrap.innerHTML = copilotSuggestions.map(s => `<button type="button" class="copilot-chip" data-copilot="${s.id}">${copilotEsc(s.text)}</button>`).join('');
}

function copilotAddMsg(role, html){
    const msgs = document.getElementById('copilotMessages');
    if(!msgs) return;
    const div = document.createElement('div');
    div.className = 'copilot-msg copilot-msg--' + role;
    div.innerHTML = html;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function copilotWelcome(){
    const html = `
        <div class="copilot-msg__role">PRAVAAH Copilot <span class="copilot-msg__tag">Demo Assistant — Not Connected to a Live AI System</span></div>
        <p>Hello! I’m PRAVAAH Copilot, your guide to the PRAVAAH demonstration portal.</p>
        <p>I can help you explore application workflows, understand demo statuses, review illustrative compliance checklists and locate deadline or reporting screens.</p>
        <p>I use predefined demonstration responses and sample data only. I’m not connected to AICTE systems and cannot verify official requirements or make approval decisions.</p>
        <p><strong>What would you like to explore?</strong></p>
    `;
    copilotAddMsg('assistant', html);
}

function copilotRespond(q){
    const lower = q.toLowerCase();
    if(lower.includes('workflow')){
        copilotAddMsg('assistant', `
            <div class="copilot-msg__role">PRAVAAH Copilot</div>
            <p><strong>Illustrative workflow sequence:</strong></p>
            <ol>
                <li>Application Submitted</li>
                <li>Initial Scrutiny</li>
                <li>Document Review</li>
                <li>Compliance Review</li>
                <li>Final Decision</li>
            </ol>
            <p>This demonstrates a proposed workflow — not a confirmed official AICTE procedure. Final approval and statutory scrutiny remain with authorized officials.</p>
            <div class="copilot-actions">
                <button class="copilot-act" data-nav="workflow-tracking">View Workflow Tracking</button>
            </div>
        `);
        return;
    }
    if(lower.includes('pending')){
        copilotAddMsg('assistant', `
            <div class="copilot-msg__role">PRAVAAH Copilot</div>
            <p>To find pending demo applications, go to <strong>Applications Management</strong> and use filters (Status: Pending/In Review, etc.).</p>
            <p>Any counts shown are from local mock data and are clearly labelled as illustrative.</p>
            <div class="copilot-actions">
                <button class="copilot-act" data-nav="applications">Open Applications</button>
            </div>
        `);
        return;
    }
    if(lower.includes('document')){
        copilotAddMsg('assistant', `
            <div class="copilot-msg__role">PRAVAAH Copilot</div>
            <p>The <strong>Document Verification</strong> demo shows a checklist with states like Received, Pending, Review Required.</p>
            <p>The interface does not perform actual OCR, signature verification or document authentication.</p>
            <div class="copilot-actions">
                <button class="copilot-act" data-nav="document-verification">Open Document Verification</button>
            </div>
        `);
        return;
    }
    if(lower.includes('compliance')){
        copilotAddMsg('assistant', `
            <div class="copilot-msg__role">PRAVAAH Copilot</div>
            <p>Use <strong>Compliance Monitoring Centre</strong> to review illustrative compliance items, checklists and local demo actions.</p>
            <p>The Copilot does not interpret official regulations, certify compliance or replace authorized review.</p>
            <div class="copilot-actions">
                <button class="copilot-act" data-nav="compliance-monitoring">Open Compliance Centre</button>
            </div>
        `);
        return;
    }
    if(lower.includes('deadline') || lower.includes('alert')){
        copilotAddMsg('assistant', `
            <div class="copilot-msg__role">PRAVAAH Copilot</div>
            <p><strong>Deadline &amp; Alerts Centre</strong> shows a demo calendar, alert feed and deadline queue.</p>
            <p>No actual email, SMS, push notification or automated escalation is sent.</p>
            <div class="copilot-actions">
                <button class="copilot-act" data-nav="deadline-alerts">Open Deadline Centre</button>
            </div>
        `);
        return;
    }
    if(lower.includes('report')){
        copilotAddMsg('assistant', `
            <div class="copilot-msg__role">PRAVAAH Copilot</div>
            <p><strong>Reports &amp; Analytics</strong> includes illustrative charts, pendency analysis and local CSV export.</p>
            <p>Reports use local demonstration data rather than official operational statistics.</p>
            <div class="copilot-actions">
                <button class="copilot-act" data-nav="reports-analytics">Open Reports &amp; Analytics</button>
            </div>
        `);
        return;
    }
    if(lower.includes('stage')){
        copilotAddMsg('assistant', `
            <div class="copilot-msg__role">PRAVAAH Copilot</div>
            <p><strong>Approval Stages</strong> lets you configure demo stages, reorder them and preview workflows locally.</p>
            <p>Changing stages in the demonstration does not alter any official approval process.</p>
            <div class="copilot-actions">
                <button class="copilot-act" data-nav="approval-stages">Open Approval Stages</button>
            </div>
        `);
        return;
    }
    if(lower.includes('audit')){
        copilotAddMsg('assistant', `
            <div class="copilot-msg__role">PRAVAAH Copilot</div>
            <p><strong>Audit Trail</strong> shows a chronological demo log with search, filters, details and CSV export.</p>
            <p>Entries are not verified official audit records.</p>
            <div class="copilot-actions">
                <button class="copilot-act" data-nav="audit-trail">Open Audit Trail</button>
            </div>
        `);
        return;
    }
    copilotAddMsg('assistant', `
        <div class="copilot-msg__role">PRAVAAH Copilot</div>
        <p>I can currently help with the PRAVAAH demonstration’s applications, workflow, documents, compliance screens, deadlines, reports, approval stages and audit trail. I’m not connected to a live AI system.</p>
        <p>Please choose one of these topics or use a suggested prompt.</p>
    `);
}

document.addEventListener('DOMContentLoaded', function(){
    copilotRenderChips();
    const panel = document.getElementById('copilotPanel');
    const launcher = document.getElementById('copilotLauncher');
    const minBtn = document.getElementById('copilotMin');
    const newBtn = document.getElementById('copilotNewConv');
    const input = document.getElementById('copilotInput');
    const send = document.getElementById('copilotSend');
    const chips = document.getElementById('copilotChips');
    const msgs = document.getElementById('copilotMessages');

    if(launcher) launcher.addEventListener('click', function(){
        panel.classList.add('active');
        panel.setAttribute('aria-hidden','false');
        if(msgs && msgs.children.length === 0) copilotWelcome();
        setTimeout(()=> input && input.focus(), 50);
    });
    if(minBtn) minBtn.addEventListener('click', function(){
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden','true');
    });
    if(newBtn) newBtn.addEventListener('click', function(){
        if(msgs) msgs.innerHTML = '';
        copilotWelcome();
    });

    function doSend(){
        if(!input) return;
        const val = input.value.trim();
        if(!val) return;
        copilotAddMsg('user', `<div class="copilot-msg__role">You</div><p>${copilotEsc(val)}</p>`);
        input.value = '';
        setTimeout(()=> copilotRespond(val), 150);
    }
    if(send) send.addEventListener('click', doSend);
    if(input) input.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); doSend(); } });

    if(chips) chips.addEventListener('click', function(e){
        const btn = e.target.closest('.copilot-chip');
        if(!btn) return;
        const id = btn.getAttribute('data-copilot');
        const map = { wf:'Explain the application workflow', pending:'Find applications pending review', docs:'Explain document verification', comp:'Show compliance items needing attention', dead:'Summarize upcoming demo deadlines', rep:'Explain the Reports & Analytics page', stages:'Explain approval stages', audit:'How do I use the Audit Trail?' };
        copilotAddMsg('user', `<div class="copilot-msg__role">You</div><p>${copilotEsc(map[id]||'')}</p>`);
        setTimeout(()=> copilotRespond(map[id]||''), 150);
    });

    if(msgs) msgs.addEventListener('click', function(e){
        const act = e.target.closest('.copilot-act');
        if(act){
            const nav = act.getAttribute('data-nav');
            if(nav){
                const item = document.querySelector(`.nav__item[data-page="${nav}"]`);
                if(item){ item.click(); panel.classList.remove('active'); }
            }
        }
    });

    if(msgs && msgs.children.length === 0) copilotWelcome();
});
