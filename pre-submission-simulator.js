// PRAVAAH Pre-Submission Failure Simulator
// Interactive readiness-testing tool for applicant application review

const SIM_TODAY = new Date(2026, 9, 23);

// Simulation checks configuration
function getSimulationChecks() {
    return [
        {
            id: 'FS-001',
            title: 'Required Application Fields Present',
            category: 'Completeness',
            severity: 'High',
            check: function(app) {
                // Check that essential fields exist and have values
                if (!app || !app.id) return 'unable_to_verify';
                if (!app.institution || app.institution.trim() === '') return { status: 'open', reason: 'Institution name is missing' };
                if (!app.type || app.type.trim() === '') return { status: 'open', reason: 'Institution type is missing' };
                if (!app.submitted || app.submitted.trim() === '') return { status: 'open', reason: 'Submission date is missing' };
                if (!app.stage || app.stage.trim() === '') return { status: 'open', reason: 'Current stage is missing' };
                if (!app.deadline || app.deadline.trim() === '') return { status: 'open', reason: 'Application deadline is missing' };
                return { status: 'passed' };
            },
            description: 'All essential application fields must be populated for a valid submission.',
            action: 'Populate missing application fields before submitting.'
        },
        {
            id: 'FS-002',
            title: 'Mandatory Checklist Items Complete',
            category: 'Completeness',
            severity: 'High',
            check: function(app) {
                if (!app || !app.checklist) return 'unable_to_verify';
                const incomplete = app.checklist.filter(c => c.status !== 'received');
                if (incomplete.length === 0) return { status: 'passed' };
                return { status: 'open', items: incomplete, reason: `${incomplete.length} checklist item${incomplete.length !== 1 ? 's' : ''} incomplete` };
            },
            description: 'All mandatory checklist items must be marked as received.',
            action: 'Complete or link all mandatory checklist items before submission.'
        },
        {
            id: 'FS-003',
            title: 'Document Expiry Validation',
            category: 'Document Validity',
            severity: 'Critical',
            check: function(app) {
                if (!app || !app.documents) return 'unable_to_verify';
                const expired = app.documents.filter(d => d.expiry && new Date(d.expiry) < SIM_TODAY);
                if (expired.length > 0) {
                    return {
                        status: 'open',
                        documents: expired,
                        reason: `${expired.length} document${expired.length !== 1 ? 's' : ''} expired${expired.length > 1 ? '' : ' (expires today)'}`,
                        details: expired.map(d => `${d.name}: expired ${d.expiry}`).join(', ')
                    };
                }
                return { status: 'passed' };
            },
            description: 'Documents with expiry dates before the current demo date are flagged as expired.',
            action: 'Renew expired documents or submit updated versions before application review.'
        },
        {
            id: 'FS-004',
            title: 'Document Metadata Consistency',
            category: 'Document Validity',
            severity: 'Medium',
            check: function(app) {
                if (!app || !app.documents) return 'unable_to_verify';
                const conflicts = app.documents.filter(d => {
                    if (!d.expiry) return false;
                    // Check if expiry is unreasonably soon after submission
                    const subDate = parseAppDate(app.submitted);
                    const expDate = new Date(d.expiry);
                    if (!subDate) return false;
                    const daysBetween = Math.round((expDate - subDate) / 86400000);
                    return daysBetween < 7; // Expiry within 7 days of submission is suspicious
                });
                if (conflicts.length > 0) {
                    return {
                        status: 'open',
                        reason: `${conflicts.length} document${conflicts.length !== 1 ? 's' : ''} have metadata conflicts${conflicts.length > 1 ? '' : ' (expiry within 7 days of submission)'}`,
                        details: conflicts.map(d => `${d.name}: expiry ${d.expiry} is very close to submission ${app.submitted}`).join(', ')
                    };
                }
                return { status: 'passed' };
            },
            description: 'Document expiry dates that are too close to the submission date may indicate metadata errors.',
            action: 'Review and correct document metadata to ensure reasonable expiry durations.'
        },
        {
            id: 'FS-005',
            title: 'Evidence Linked to Requirements',
            category: 'Evidence Linkage',
            severity: 'High',
            check: function(app) {
                if (!app || !app.checklist) return 'unable_to_verify';
                const unlinked = app.checklist.filter(c => c.relatedRequirement && c.status !== 'received');
                const receivedButUnlinked = app.checklist.filter(c => c.status === 'received' && !c.relatedRequirement);
                if (unlinked.length > 0) {
                    return {
                        status: 'open',
                        items: unlinked,
                        reason: `${unlinked.length} checklist item${unlinked.length !== 1 ? 's' : ''} linked to a requirement but still incomplete`,
                        details: unlinked.map(c => `${c.id}: ${c.label}`).join(', ')
                    };
                }
                if (receivedButUnlinked.length > 0) {
                    return {
                        status: 'open',
                        items: receivedButUnlinked,
                        reason: `${receivedButUnlinked.length} received item${receivedButUnlinked.length !== 1 ? 's' : ''} not linked to a requirement`,
                        details: receivedButUnlinked.map(c => `${c.id}: ${c.label}`).join(', ')
                    };
                }
                return { status: 'passed' };
            },
            description: 'Each checklist item should be linked to a relevant requirement and be in received status.',
            action: 'Link incomplete checklist items to their corresponding requirements.'
        },
        {
            id: 'FS-006',
            title: 'Review Stage Progress',
            category: 'Workflow',
            severity: 'Medium',
            check: function(app) {
                if (!app || !app.reviewStages) return 'unable_to_verify';
                const incomplete = app.reviewStages.filter(s => !s.completed);
                if (incomplete.length === 0) return { status: 'passed' };
                const currentStage = app.stage;
                const currentIdx = app.stage ? ['Application Submitted', 'Initial Scrutiny', 'Document Review', 'Compliance Review', 'Final Decision'].indexOf(currentStage) : -1;
                const pendingLater = incomplete.filter((s, idx) => idx > Math.max(0, currentIdx));
                const pendingCurrent = incomplete.filter((s, idx) => idx <= Math.max(0, currentIdx));
                return {
                    status: 'open',
                    reason: `${incomplete.length} review stage${incomplete.length !== 1 ? 's' : ''} not yet completed`,
                    details: `Current stage: ${currentStage}. Pending: ${incomplete.map(s => s.stage).join(', ')}`
                };
            },
            description: 'All review stages in the workflow must be marked as completed before final submission.',
            action: 'Progress all pending review stages through the workflow before submitting.'
        },
        {
            id: 'FS-007',
            title: 'Deadline Awareness',
            category: 'Deadline',
            severity: 'High',
            check: function(app) {
                if (!app || !app.deadline) return 'unable_to_verify';
                const due = parseAppDate(app.deadline);
                if (!due) return { status: 'passed' };
                const diffDays = Math.round((due - SIM_TODAY) / 86400000);
                if (diffDays < 0) {
                    return {
                        status: 'open',
                        reason: `Application deadline ${app.deadline} has already passed`,
                        details: `The deadline was ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago.`
                    };
                }
                if (diffDays <= 7) {
                    return {
                        status: 'open',
                        reason: `Application deadline approaching in ${diffDays} day${diffDays !== 1 ? 's' : ''}`,
                        details: `The deadline is in the next ${diffDays} day${diffDays !== 1 ? 's' : ''}.`
                    };
                }
                return { status: 'passed' };
            },
            description: 'Application deadlines that have passed or are within 7 days are flagged.',
            action: 'Ensure all pending actions are completed before the application deadline.'
        },
        {
            id: 'FS-008',
            title: 'Prerequisite Tasks Resolved',
            category: 'Workflow',
            severity: 'Medium',
            check: function(app) {
                if (!app || !app.prerequisites) return 'unable_to_verify';
                const unresolved = app.prerequisites.filter(p => p.status !== 'received');
                if (unresolved.length === 0) return { status: 'passed' };
                return {
                    status: 'open',
                    reason: `${unresolved.length} prerequisite${unresolved.length !== 1 ? 's' : ''} remain unresolved`,
                    details: unresolved.map(p => `${p.id}: ${p.label} (blocks ${p.dependentStage})`).join('; ')
                };
            },
            description: 'Prerequisite tasks that feed into later stages must be resolved.',
            action: 'Resolve all prerequisite tasks before advancing to dependent stages.'
        },
        {
            id: 'FS-009',
            title: 'Inconsistent Record Values',
            category: 'Data Integrity',
            severity: 'Medium',
            check: function(app) {
                if (!app) return 'unable_to_verify';
                // Check for contradictions within the application data
                // Example: status says "Completed" but review stages show unfinished steps
                if (app.status === 'Completed') {
                    const unfinished = app.reviewStages.filter(s => !s.completed);
                    if (unfinished.length > 0) {
                        return {
                            status: 'open',
                            reason: 'Application marked as Completed but some review stages are not completed',
                            details: `${unfinished.length} stage${unfinished.length !== 1 ? 's' : ''} still pending: ${unfinished.map(s => s.stage).join(', ')}`
                        };
                    }
                }
                if (app.status === 'Action Required' && !app.action) {
                    return {
                        status: 'open',
                        reason: 'Application has Action Required status but no pending action specified'
                    };
                }
                return { status: 'passed' };
            },
            description: 'Internal record inconsistencies are flagged for reviewer attention.',
            action: 'Review and resolve any data inconsistencies before submission.'
        },
        {
            id: 'FS-010',
            title: 'Unresolved Reviewer Finding',
            category: 'Review',
            severity: 'High',
            check: function(app) {
                if (!app) return 'unable_to_verify';
                // If the application has a finding-related action mention, flag it
                if (app.action && app.action.toLowerCase().includes('finding') || app.action.toLowerCase().includes('review')) {
                    return {
                        status: 'open',
                        reason: 'Application action references an unresolved finding or review item',
                        details: `Pending action: "${app.action}"`
                    };
                }
                // Check if any document has "needs review" status pattern
                if (app.documents) {
                    const needsReview = app.documents.filter(d => d.status && d.status.toLowerCase().includes('needs') || d.status && d.status.toLowerCase().includes('pending'));
                    if (needsReview.length > 0) {
                        return {
                            status: 'open',
                            reason: `${needsReview.length} document${needsReview.length !== 1 ? 's' : ''} pending review`,
                            details: needsReview.map(d => `${d.name}: ${d.status}`).join(', ')
                        };
                    }
                }
                return { status: 'passed' };
            },
            description: 'Any unresolved reviewer findings or pending review items are flagged.',
            action: 'Resolve all pending reviewer findings before application submission.'
        }
    ];
}

// Run simulation on selected application
function runSimulation(appId) {
    const app = applicationsData.find(a => a.id === appId);
    if (!app) return null;

    const checks = getSimulationChecks();
    const findings = [];
    let passedCount = 0;
    let openCount = 0;
    let unableToVerifyCount = 0;

    checks.forEach(check => {
        const result = check.check(app);
        if (result === 'passed') {
            passedCount++;
        } else if (result === 'unable_to_verify') {
            unableToVerifyCount++;
            findings.push({
                id: check.id,
                title: check.title,
                category: check.category,
                severity: 'Low',
                status: 'Unable to Verify',
                detected: `Unable to verify - insufficient data for check: ${check.title}`,
                whyItMatters: check.description,
                supportingRecord: 'Application data',
                correctiveAction: check.action,
                applicationSection: 'General',
                navigateText: 'Application Details'
            });
        } else {
            openCount++;
            let detected = check.title;
            let whyItMatters = check.description;
            let supportingRecord = 'Application data';
            let recommendedAction = check.action;
            let relevantSection = 'General';

            if (result.items && result.items.length > 0) {
                detected += `: ${result.items.length} item${result.items.length !== 1 ? 's' : ''} ${result.reason.includes('incomplete') ? 'incomplete' : result.reason}`;
                supportingRecord = 'Checklist items';
            } else if (result.documents && result.documents.length > 0) {
                detected += `: ${result.documents.length} document${result.documents.length !== 1 ? 's' : ''} ${result.reason}`;
                supportingRecord = 'Documents';
            } else {
                detected += `: ${result.reason}`;
                supportingRecord = 'Application data';
            }

            findings.push({
                id: check.id,
                title: check.title,
                category: check.category,
                severity: check.severity,
                status: 'Open',
                detected: detected,
                whyItMatters: whyItMatters,
                supportingRecord: supportingRecord,
                correctiveAction: recommendedAction,
                applicationSection: relevantSection,
                navigateText: 'Application Details'
            });
        }
    });

    // Calculate readiness score - deterministic, not claimed as official
    const totalChecks = checks.length;
    const criticalOpen = findings.filter(f => f.severity === 'Critical' && f.status === 'Open').length;
    const highOpen = findings.filter(f => f.severity === 'High' && f.status === 'Open').length;
    const readinessScore = Math.round(((passedCount / totalChecks) * 100) * 100) / 100; // 2 decimal places

    return {
        appId,
        appName: app ? app.institution : 'Unknown',
        simulationDate: new Date().toISOString(),
        totalChecks,
        passedCount,
        openCount,
        unableToVerifyCount,
        criticalOpen,
        highOpen,
        readinessScore,
        findings,
        application: app
    };
}

// Render simulation UI
function renderSimulationUI(simulationResult) {
    if (!simulationResult) {
        document.getElementById('simSummaryGrid').innerHTML = '';
        document.getElementById('simFindingsPanel').innerHTML = '';
        document.getElementById('simActionsPanel').innerHTML = '';
        document.getElementById('simHistoryPanel').innerHTML = '';
        return;
    }

    const { appId, appName, totalChecks, passedCount, openCount, unableToVerifyCount, criticalOpen, highOpen, readinessScore, findings, application } = simulationResult;

    // Render summary grid
    const summaryGrid = document.getElementById('simSummaryGrid');
    summaryGrid.innerHTML = `
        <div class="sim-summary-card sim-card--critical">
            <div class="sim-summary-card__label">Critical Issues</div>
            <div class="sim-summary-card__value">${criticalOpen}</div>
        </div>
        <div class="sim-summary-card sim-card--high">
            <div class="sim-summary-card__label">High Severity</div>
            <div class="sim-summary-card__value">${highOpen}</div>
        </div>
        <div class="sim-summary-card sim-card--medium">
            <div class="sim-summary-card__label">Medium Severity</div>
            <div class="sim-summary-card__value">${openCount - criticalOpen - highOpen}</div>
        </div>
        <div class="sim-summary-card sim-card--passed">
            <div class="sim-summary-card__label">Checks Passed</div>
            <div class="sim-summary-card__value">${passedCount} of ${totalChecks}</div>
        </div>
        <div class="sim-summary-card sim-card--unable">
            <div class="sim-summary-card__label">Unable to Verify</div>
            <div class="sim-summary-card__value">${unableToVerifyCount}</div>
        </div>
        <div class="sim-summary-card sim-card--readiness">
            <div class="sim-summary-card__label">Readiness Score</div>
            <div class="sim-summary-card__value">${readinessScore}%</div>
            <div class="sim-summary-card__sub">Based on implemented checks only; not an official AICTE eligibility percentage.</div>
        </div>
    `;

    // Render findings panel
    const findingsPanel = document.getElementById('simFindingsPanel');
    const openFindings = findings.filter(f => f.status === 'Open');
    const unableFindings = findings.filter(f => f.status === 'Unable to Verify');

    if (openFindings.length === 0 && unableFindings.length === 0) {
        findingsPanel.innerHTML = '<p class="sim-no-findings">No issues detected. Application appears ready for submission.</p>';
    } else {
        findingsPanel.innerHTML = '';
        // Open findings first
        openFindings.forEach(finding => {
            const card = document.createElement('div');
            card.className = `sim-finding-card sim-finding-card--${finding.severity.toLowerCase()}`;
            card.innerHTML = `
                <div class="sim-finding-card__header">
                    <span class="sim-finding-card__id">${finding.id}</span>
                    <span class="sim-finding-card__title">${finding.title}</span>
                    <span class="sim-finding-card__severity sim-finding-card__severity--${finding.severity.toLowerCase()}">${finding.severity}</span>
                </div>
                <div class="sim-finding-card__category">${finding.category}</div>
                <div class="sim-finding-card__status sim-finding-card__status--${finding.status.toLowerCase().replace(' ', '-')}">
                    ${finding.status}
                </div>
                <div class="sim-finding-card__detected">
                    <strong>What was detected:</strong> ${finding.detected}
                </div>
                <div class="sim-finding-card__why-it-matters">
                    <strong>Why it matters:</strong> ${finding.whyItMatters}
                </div>
                <div class="sim-finding-card__supporting">
                    <strong>Supporting record/evidence:</strong> ${finding.supportingRecord}
                </div>
                <div class="sim-finding-card__corrective">
                    <strong>Recommended corrective action:</strong> ${finding.correctiveAction}
                </div>
                <div class="sim-finding-card__section">
                    <strong>Relevant application section:</strong> ${finding.applicationSection}
                </div>
                <button class="sim-finding-card__nav nav-btn" data-nav-section="application">Navigate to Section</button>
            `;
            findingsPanel.appendChild(card);
        });
        // Unable to verify findings
        unableFindings.forEach(finding => {
            const card = document.createElement('div');
            card.className = `sim-finding-card sim-finding-card--unable`;
            card.innerHTML = `
                <div class="sim-finding-card__header">
                    <span class="sim-finding-card__id">${finding.id}</span>
                    <span class="sim-finding-card__title">${finding.title}</span>
                    <span class="sim-finding-card__severity sim-finding-card__severity--low">Low</span>
                </div>
                <div class="sim-finding-card__category">${finding.category}</div>
                <div class="sim-finding-card__status sim-finding-card__status--unable-to-verify">
                    ${finding.status}
                </div>
                <div class="sim-finding-card__detected">
                    <strong>What was detected:</strong> ${finding.detected}
                </div>
                <div class="sim-finding-card__why-it-matters">
                    <strong>Why it matters:</strong> ${finding.whyItMatters}
                </div>
                <div class="sim-finding-card__supporting">
                    <strong>Supporting record/evidence:</strong> ${finding.supportingRecord}
                </div>
                <div class="sim-finding-card__corrective">
                    <strong>Recommended corrective action:</strong> ${finding.correctiveAction}
                </div>
            `;
            findingsPanel.appendChild(card);
        });
    }

    // Render corrective actions panel
    const actionsPanel = document.getElementById('simActionsPanel');
    const uniqueActions = [...new Set(findings.filter(f => f.status === 'Open').map(f => f.correctiveAction))];
    
    if (uniqueActions.length === 0) {
        actionsPanel.innerHTML = '<p class="sim-no-actions">No corrective actions needed - all checks passed.</p>';
    } else {
        actionsPanel.innerHTML = '';
        uniqueActions.forEach(action => {
            const div = document.createElement('div');
            div.className = 'sim-action-item';
            div.innerHTML = `<p>${action}</p>`;
            actionsPanel.appendChild(div);
        });
    }

    // Render history (in-memory, using localStorage if available)
    let history = JSON.parse(localStorage.getItem('simulationHistory') || '[]');
    history.unshift({
        id: Date.now().toString(),
        appId: appId,
        appName: appName,
        date: new Date().toISOString(),
        readinessScore: readinessScore,
        openCount: openCount,
        findingCount: findings.filter(f => f.status === 'Open').length
    });
    history = history.slice(0, 10); // Keep last 10
    localStorage.setItem('simulationHistory', JSON.stringify(history));

    renderSimulationHistory(history);
}

// Render simulation history
function renderSimulationHistory(history) {
    const historyPanel = document.getElementById('simHistoryPanel');
    if (history.length === 0) {
        historyPanel.innerHTML = '<p class="sim-no-history">No previous simulations.</p>';
        return;
    }
    historyPanel.innerHTML = '';
    history.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'sim-history-entry';
        div.innerHTML = `
            <div class="sim-history-entry__app">${entry.appName} (${entry.appId})</div>
            <div class="sim-history-entry__meta">${entry.date.substring(0, 10)} • Readiness: ${entry.readinessScore}%</div>
            <div class="sim-history-entry__issues">${entry.findingCount} issue${entry.findingCount !== 1 ? 's' : ''} detected</div>
        `;
        historyPanel.appendChild(div);
    });
}

// Export simulation report
function exportSimulationReport(simulationResult) {
    if (!simulationResult) return false;

    const { appId, appName, totalChecks, passedCount, openCount, unableToVerifyCount, criticalOpen, highOpen, readinessScore, findings, application } = simulationResult;

    // Generate CSV content
    let csv = 'PRAVAAH Pre-Submission Simulation Report\n';
    csv += `Application ID: ${appId}\n`;
    csv += `Institution: ${appName}\n`;
    csv += `Simulation Date: ${new Date().toISOString()}\n`;
    csv += `Total Checks: ${totalChecks}\n`;
    csv += `Checks Passed: ${passedCount}\n`;
    csv += `Open Issues: ${openCount}\n`;
    csv += `Critical Open: ${criticalOpen}\n`;
    csv += `High Severity Open: ${highOpen}\n`;
    csv += `Unable to Verify: ${unableToVerifyCount}\n`;
    csv += `Readiness Score: ${readinessScore}%\n`;
    csv += `---.\n`;
    csv += 'Check ID,Check Title,Category,Severity,Status,Detected,Corrective Action,Application Section\n';

    findings.forEach(finding => {
        const safeDetected = `"${finding.detected.replace(/"/g, '""')}"`;
        const safeAction = `"${finding.correctiveAction.replace(/"/g, '""')}"`;
        const safeSection = `"${finding.applicationSection.replace(/"/g, '""')}"`;
        csv += `${finding.id},${finding.title},${finding.category},${finding.severity},${finding.status},${safeDetected},${safeAction},${safeSection}\n`;
    });

    // Trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pre-submission-simulation-${appId}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
}

// Initialize simulator page
function initSimulatorPage() {
    const simAppSelect = document.getElementById('simAppSelect');
    if (!simAppSelect) return;

    // Populate application selector
    applicationsData.forEach(app => {
        const opt = document.createElement('option');
        opt.value = app.id;
        opt.textContent = `${app.id} - ${app.institution}`;
        simAppSelect.appendChild(opt);
    });

    // Initialize with first application
    let currentSimulation = null;

    simAppSelect.addEventListener('change', function() {
        const appId = this.value;
        currentSimulation = runSimulation(appId);
        renderSimulationUI(currentSimulation);
    });

    // Run simulation on page load with first app
    if (simAppSelect.value) {
        simAppSelect.dispatchEvent(new Event('change'));
    }

    // Export button
    const exportBtn = document.querySelector('.sim-export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            if (currentSimulation) {
                const success = exportSimulationReport(currentSimulation);
                if (success) {
                    alert('Simulation report exported successfully (CSV download).');
                }
            }
        });
    }

    // Reset simulation button logic would go here
}

// Export the functions for use by app shell
window.SIM_TODAY = SIM_TODAY;
window.runSimulation = runSimulation;
window.renderSimulationUI = renderSimulationUI;
window.exportSimulationReport = exportSimulationReport;
window.initSimulatorPage = initSimulatorPage;
window.getSimulationChecks = getSimulationChecks;