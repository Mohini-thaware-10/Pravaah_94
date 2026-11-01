// PRAVAAH Regulatory Change Impact Map
// Demonstrates how a change in a configured regulatory source or requirement could affect related obligations, evidence records, applications and review tasks

// Demonstration change scenarios - clearly labeled as illustrative
const CHANGE_SCENARIOS = [
    {
        id: 'CH-001',
        title: 'Requirement Description Changed',
        category: 'Requirement Update',
        label: 'Illustrative Demo Scenario',
        version: 'v2026.1 (01 Nov 2026)',
        changedField: 'requirementDescription',
        previousValue: 'All supporting documents must be valid for the duration of the approval cycle.',
        updatedValue: 'All supporting documents must be valid for six months from the date of submission.',
        changeType: 'Description Revision',
        relatedRecords: 'REQ-2026-0142, REQ-2026-0238',
        summary: 'A revision to the documented validity period for supporting evidence.',
        impactClassification: 'Directly affected',
        verified: false,
        verificationNote: 'This is an illustrative demo scenario; no real AICTE circular amended.'
    },
    {
        id: 'CH-002',
        title: 'Document Checklist Item Added',
        category: 'Checklist Update',
        label: 'Illustrative Demo Scenario',
        version: 'v2026.2 (15 Nov 2026)',
        changedField: 'checklistItem',
        previousValue: 'No requirement for climate change compliance statement',
        updatedValue: 'Climate change compliance statement required for all engineering college applications',
        changeType: 'New Item Added',
        relatedRecords: 'CHK-0238-01, CHK-0251-02',
        summary: 'A new checklist item added for climate change compliance evidence.',
        impactClassification: 'Potentially affected',
        verified: false,
        verificationNote: 'This is an illustrative demo scenario; no real AICTE notification issued.'
    },
    {
        id: 'CH-003',
        title: 'Configured Deadline Changed',
        category: 'Deadline Update',
        label: 'Illustrative Demo Scenario',
        version: 'v2026.3 (20 Nov 2026)',
        changedField: 'deadline',
        previousValue: '28 Oct 2026',
        updatedValue: '15 Nov 2026',
        changeType: 'Deadline advancement',
        relatedRecords: 'APP-2026-0142, APP-2026-0238',
        summary: 'Application submission deadline moved forward by two weeks.',
        impactClassification: 'Directly affected',
        verified: false,
        verificationNote: 'This is an illustrative demo scenario; no real AICTE notification date changed.'
    },
    {
        id: 'CH-004',
        title: 'Evidence Requirement Revised',
        category: 'Evidence Update',
        label: 'Illustrative Demo Scenario',
        version: 'v2026.4 (01 Dec 2026)',
        changedField: 'evidenceSpec',
        previousValue: 'Certificate of incorporation from registered office',
        updatedValue: 'Certificate of incorporation and renewed validity certificate',
        changeType: 'Specification Revision',
        relatedRecords: 'EV-2026-0142-001, EV-2026-0238-001',
        summary: 'Additional validity certificate now required for document evidence.',
        impactClassification: 'Potentially affected',
        verified: false,
        verificationNote: 'This is an illustrative demo scenario; no real evidence specification changed.'
    }
];

// Impact analysis data - relationships derived from application data
function analyzeChangeImpact(changeId) {
    const scenario = CHANGE_SCENARIOS.find(s => s.id === changeId);
    if (!scenario) return null;

    // Build impact analysis based on available application data
    const analysis = {
        change: scenario,
        affectedRequirements: [],
        affectedEvidenceRecords: [],
        potentiallyAffectedApplications: [],
        dependentReviewTasks: [],
        impactClassifications: {
            directlyAffected: [],
            potentiallyAffected: [],
            noLinkedImpact: [],
            unableToDetermine: []
        },
        reviewerAcknowledgment: {
            acknowledged: false,
            reviewNotes: '',
            reviewed: false
        }
    };

    // Map change to application data impacts
    // This is deterministic based on the existing application data structure

    // CH-001: Requirement Description Changed
    if (changeId === 'CH-001') {
        // Find applications with requirements that match the changed field
        applicationsData.forEach(app => {
            if (app.checklist) {
                app.checklist.forEach(check => {
                    if (check.relatedRequirement) {
                        // Check if this requirement could be affected by a validity period change
                        if (check.label.toLowerCase().includes('valid') || check.label.toLowerCase().includes('receipt')) {
                            const exists = analysis.affectedRequirements.some(r => r.id === check.relatedRequirement);
                            if (!exists) {
                                analysis.affectedRequirements.push({
                                    id: check.relatedRequirement,
                                    title: check.label,
                                    application: app.institution,
                                    applicationId: app.id,
                                    relationship: 'Checklist item linked to requirement'
                                });
                            }
                        }
                    }
                });
            }
        });

        // Potentially affected applications - those with checklists linked to validity requirements
        const directlyAffectedApps = new Set();
        applicationsData.forEach(app => {
            if (app.checklist) {
                app.checklist.forEach(check => {
                    if (check.relatedRequirement && 
                        (check.label.toLowerCase().includes('valid') || check.label.toLowerCase().includes('receipt'))) {
                        directlyAffectedApps.add(app.id);
                    }
                });
            }
        });

        directlyAffectedApps.forEach(appId => {
            const app = applicationsData.find(a => a.id === appId);
            if (app) {
                analysis.impactClassifications.directlyAffected.push({
                                    id: app.id,
                                    institution: app.institution,
                                    stage: app.stage,
                                    status: app.status
                                });
            }
        });

        // Evidence records linked to these requirements
        applicationsData.forEach(app => {
            if (app.documents) {
                app.documents.forEach(doc => {
                    // Check if document expiry could be affected
                    if (doc.expiry) {
                        const exists = analysis.affectedEvidenceRecords.some(r => r.id === doc.name);
                        if (!exists) {
                            analysis.affectedEvidenceRecords.push({
                                id: doc.name,
                                title: doc.name,
                                application: app.institution,
                                applicationId: app.id,
                                relationship: 'Document expiry may be affected by requirement change'
                            });
                        }
                    }
                });
            }
        });

        // Dependent review tasks
        analysis.dependentReviewTasks.push({
            id: 'TASK-001',
            title: 'Review requirement applicability',
            description: 'Review whether the changed requirement applies to all active applications',
            responsible: 'Review Officer',
            priority: 'High',
            status: 'Pending'
        });

        analysis.dependentReviewTasks.push({
            id: 'TASK-002',
            title: 'Update checklist items',
            description: 'Update or add checklist items to reflect the new requirement description',
            responsible: 'Compliance Cell',
            priority: 'Medium',
            status: 'Pending'
        });
    }

    // CH-002: Document Checklist Item Added
    if (changeId === 'CH-002') {
        // Find applications where this new item would apply
        applicationsData.forEach(app => {
            if (app.type === 'Engineering College') {
                // Engineering colleges would be affected by a new climate change item
                const exists = analysis.affectedRequirements.some(r => 
                    r.institution === app.institution && r.title.includes('Climate'));
                if (!exists) {
                    analysis.affectedRequirements.push({
                        id: `REQ-${app.id}-new`,
                        title: 'Climate change compliance',
                        application: app.institution,
                        applicationId: app.id,
                        relationship: 'New checklist item added for engineering colleges'
                    });
                }
                analysis.impactClassifications.potentiallyAffected.push({
                    id: app.id,
                    institution: app.institution,
                    type: app.type,
                    relationship: 'Engineering college type may be affected by new climate change requirement'
                });
            }
        });

        // Evidence records that might need to be linked to the new requirement
        analysis.affectedEvidenceRecords.push({
            id: 'EV-NEW-001',
            title: 'Climate change compliance statement',
            application: 'All affected institutions',
            applicationId: 'ALL',
            relationship: 'New evidence type required for the added checklist item'
        });

        // Dependent review tasks
        analysis.dependentReviewTasks.push({
            id: 'TASK-003',
            title: 'Assess applicability across institution types',
            description: 'Determine if the new climate change requirement applies to all institution types or only engineering colleges',
            responsible: 'Compliance Reviewer',
            priority: 'High',
            status: 'Pending'
        });
    }

    // CH-003: Configured Deadline Changed
    if (changeId === 'CH-003') {
        // Find applications with deadlines near the changed date
        const changedDeadline = new Date('2026-11-15');
        
        applicationsData.forEach(app => {
            if (app.deadline) {
                const appDeadline = parseAppDate(app.deadline);
                if (appDeadline) {
                    const diffDays = Math.round((appDeadline - changedDeadline) / 86400000);
                    if (Math.abs(diffDays) <= 10) {
                        // Applications with deadlines within 10 days of the changed deadline are directly affected
                        analysis.impactClassifications.directlyAffected.push({
                            id: app.id,
                            institution: app.institution,
                            originalDeadline: app.deadline,
                            relationship: `Application deadline ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} from changed deadline`
                        });
                    }
                }
            }
        });

        // Affected evidence records - documents with expiry near the changed deadline
        applicationsData.forEach(app => {
            if (app.documents) {
                app.documents.forEach(doc => {
                    if (doc.expiry) {
                        const docExpiry = new Date(doc.expiry);
                        const changedDate = new Date('2026-11-15');
                        const diffDays = Math.round((docExpiry - changedDate) / 86400000);
                        if (Math.abs(diffDays) <= 10) {
                            analysis.affectedEvidenceRecords.push({
                                id: doc.name,
                                title: doc.name,
                                application: app.institution,
                                applicationId: app.id,
                                relationship: `Document expiry ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} from changed deadline`
                            });
                        }
                    }
                });
            }
        });

        // Dependent review tasks
        analysis.dependentReviewTasks.push({
            id: 'TASK-004',
            title: 'Re-evaluate pending actions against new deadline',
            description: 'Review all pending actions and their deadlines in light of the revised timeline',
            responsible: 'Review Officer',
            priority: 'High',
            status: 'Pending'
        });

        analysis.dependentReviewTasks.push({
            id: 'TASK-005',
            title: 'Update application records',
            description: 'Update application records with the new deadline date',
            responsible: 'Compliance Cell',
            priority: 'Medium',
            status: 'Pending'
        });
    }

    // CH-004: Evidence Requirement Revised
    if (changeId === 'CH-004') {
        // Find applications with documents that match the evidence type
        applicationsData.forEach(app => {
            if (app.documents) {
                app.documents.forEach(doc => {
                    if (doc.name.toLowerCase().includes('certificate') || doc.name.toLowerCase().includes('incorporation')) {
                        const exists = analysis.affectedEvidenceRecords.some(r => r.id === doc.name);
                        if (!exists) {
                            analysis.affectedEvidenceRecords.push({
                                id: doc.name,
                                title: doc.name,
                                application: app.institution,
                                applicationId: app.id,
                                relationship: 'Document evidence type revised - additional validity certificate now required'
                            });
                        }
                    }
                });
            }
        });

        // Affected requirements
        applicationsData.forEach(app => {
            if (app.checklist) {
                app.checklist.forEach(check => {
                    if (check.label.toLowerCase().includes('certificate') || check.label.toLowerCase().includes('validity')) {
                        const exists = analysis.affectedRequirements.some(r => r.id === check.relatedRequirement);
                        if (!exists) {
                            analysis.affectedRequirements.push({
                                id: check.relatedRequirement || `REQ-${app.id}-01`,
                                title: check.label,
                                application: app.institution,
                                applicationId: app.id,
                                relationship: 'Checklist item linked to revised evidence requirement'
                            });
                        }
                    }
                });
            }
        });

        // Dependent review tasks
        analysis.dependentReviewTasks.push({
            id: 'TASK-006',
            title: 'Verify document validity certificates',
            description: 'Review all submitted validity certificates to ensure they meet the revised requirement',
            responsible: 'Document Reviewer',
            priority: 'High',
            status: 'Pending'
        });

        analysis.dependentReviewTasks.push({
            id: 'TASK-007',
            title: 'Update evidence linking',
            description: 'Update evidence records to reflect the new evidence specification',
            responsible: 'Compliance Cell',
            priority: 'Medium',
            status: 'Pending'
        });
    }

    return analysis;
}

// Classify impact type
function classifyImpact(change, requirement, evidence, application) {
    // Determine classification based on available relationships
    if (requirement && requirement.relationship && requirement.relationship.includes('Checklist item linked')) {
        return 'Directly affected';
    }
    if (requirement && requirement.relationship && requirement.relationship.includes('Engineering college type')) {
        return 'Potentially affected';
    }
    if (evidence && evidence.relationship && evidence.relationship.includes('Document expiry')) {
        return 'Directly affected';
    }
    if (application && application.relationship) {
        return 'Potentially affected';
    }
    return 'No linked impact identified';
}

// Render impact analysis UI
function renderImpactAnalysis(analysis) {
    if (!analysis) return '';

    const { change, affectedRequirements, affectedEvidenceRecords, 
            potentiallyAffectedApplications, dependentReviewTasks,
            impactClassifications, reviewerAcknowledgment } = analysis;

    let html = `
        <div class="im-analysis-section">
            <div class="im-change-header">
                <h2>Change Scenario</h2>
                <div class="im-change-id">Scenario: ${change.title}</div>
                <div class="im-change-version">Version: ${change.version}</div>
                <div class="im-change-summary">${change.summary}</div>
            </div>

            <div class="im-change-details">
                <div class="im-detail-row">
                    <span class="im-detail-label">Changed Field</span>
                    <span class="im-detail-value">${change.changedField}</span>
                </div>
                <div class="im-detail-row">
                    <span class="im-detail-label">Previous Value</span>
                    <span class="im-detail-value im-detail-value--prev">${change.previousValue}</span>
                </div>
                <div class="im-detail-row">
                    <span class="im-detail-label">Updated Value</span>
                    <span class="im-detail-value im-detail-value--new">${change.updatedValue}</span>
                </div>
                <div class="im-detail-row">
                    <span class="im-detail-label">Change Type</span>
                    <span class="im-detail-value">${change.changeType}</span>
                </div>
            </div>
        `;

    // Affected requirements section
    html += `
        <div class="im-analysis-section">
            <h2>Impact Analysis</h2>
            <div class="im-impact-classification ${impactClassifications.directlyAffected.length > 0 ? 'im-class--direct' : ''}">
                <span class="im-class-label">Classification: ${impactClassifications.directlyAffected.length > 0 ? 'Directly affected' : '—'}</span>
            </div>
            <div class="im-impact-classification ${impactClassifications.potentiallyAffected.length > 0 ? 'im-class--potential' : ''}">
                <span class="im-class-label">Potentially affected: ${impactClassifications.potentiallyAffected.length > 0 ? impactClassifications.potentiallyAffected.length + ' items' : '—'}</span>
            </div>
            <div class="im-impact-classification ${impactClassifications.noLinkedImpact.length > 0 ? 'im-class--none' : ''}">
                <span class="im-class-label">No linked impact identified: ${impactClassifications.noLinkedImpact.length > 0 ? impactClassifications.noLinkedImpact.length + ' items' : '—'}</span>
            </div>
            <div class="im-impact-classification ${impactClassifications.unableToDetermine.length > 0 ? 'im-class--unable' : ''}">
                <span class="im-class-label">Unable to determine: ${impactClassifications.unableToDetermine.length > 0 ? impactClassifications.unableToDetermine.length + ' items' : '—'}</span>
            </div>
        `;

    // Affected requirements
    if (affectedRequirements.length > 0) {
        html += `
        <div class="im-requirements-section">
            <h3>Affected Requirements</h3>
            <div class="im-requirements-list">
                ${affectedRequirements.slice(0, 10).map(req => `
                    <div class="im-requirement-item">
                        <div class="im-req-info">
                            <span class="im-req-id">${req.id}</span>
                            <span class="im-req-title">${escapeHtml(req.title)}</span>
                            <span class="im-req-app">${req.application}</span>
                        </div>
                        <div class="im-relationship">${req.relationship}</div>
                    </div>`).join('')}
            </div>
            ${affectedRequirements.length > 10 ? `<p class="im-requirement-note">... and ${affectedRequirements.length - 10} more</p>` : ''}
        </div>
        `;
    }

    // Affected evidence records
    if (affectedEvidenceRecords.length > 0) {
        html += `
        <div class="im-evidence-section">
            <h3>Affected Evidence Records</h3>
            <div class="im-evidence-list">
                ${affectedEvidenceRecords.slice(0, 10).map(ev => `
                    <div class="im-evidence-item">
                        <span class="im-evidence-id">${ev.id}</span>
                        <span class="im-evidence-title">${escapeHtml(ev.title)}</span>
                        <span class="im-evidence-app">${ev.application}</span>
                        <span class="im-evidence-rel">${ev.relationship}</span>
                    </div>`).join('')}
            </div>
            ${affectedEvidenceRecords.length > 10 ? `<p class="im-evidence-note">... and ${affectedEvidenceRecords.length - 10} more</p>` : ''}
        </div>
        `;
    }

    // Potentially affected applications
    if (potentiallyAffectedApplications.length > 0) {
        html += `
        <div class="im-applications-section">
            <h3>Potentially Affected Applications</h3>
            <div class="im-applications-list">
                ${potentiallyAffectedApplications.map(app => `
                    <div class="im-application-item">
                        <span class="im-app-id">${app.id}</span>
                        <span class="im-app-institution">${app.institution}</span>
                        <span class="im-app-stage">${app.stage}</span>
                        <span class="im-app-status app-status--${getStatusClass(app.status)}">${app.status}</span>
                    </div>`).join('')}
            </div>
        </div>
        `;
    }

    // Dependent review tasks
    if (dependentReviewTasks.length > 0) {
        html += `
        <div class="im-review-tasks-section">
            <h3>Dependent Review Tasks</h3>
            <div class="im-tasks-list">
                ${dependentReviewTasks.slice(0, 7).map(task => `
                    <div class="im-task-item">
                        <div class="im-task-header">
                            <span class="im-task-id">${task.id}</span>
                            <span class="im-task-title">${escapeHtml(task.title)}</span>
                            <span class="im-task-priority im-priority--${task.priority.toLowerCase()}">${task.priority}</span>
                        </div>
                        <div class="im-task-description">${task.description}</div>
                        <div class="im-task-responsible">Responsible: ${task.responsible}</div>
                        <div class="im-task-status">${task.status}</div>
                    </div>`).join('')}
            </div>
            ${dependentReviewTasks.length > 7 ? `<p class="im-tasks-note">... and ${dependentReviewTasks.length - 7} more</p>` : ''}
        </div>
        `;
    }

    // Reviewer acknowledgment section
    html += `
        <div class="im-acknowledgment-section">
            <h2>Reviewer Acknowledgment</h2>
            <p>Impact analysis is for reviewer consideration. Consequential decisions remain with the authorized human reviewer.</p>
            <div class="im-ack-fields">
                <div class="im-ack-field">
                    <label class="im-ack-label">Acknowledge for Review</label>
                    <button class="im-ack-btn im-ack-btn--primary ${reviewerAcknowledgment.acknowledged ? 'im-ack-btn--active' : ''}" id="imAcknowledgeBtn">Acknowledge</button>
                </div>
                <div class="im-ack-field">
                    <label class="im-ack-label">Add Review Note</label>
                    <textarea class="im-ack-textarea" id="imReviewNote" placeholder="Add a review note...">${reviewerAcknowledgment.reviewNotes || ''}</textarea>
                </div>
                <button class="im-ack-btn im-ack-btn--secondary ${reviewerAcknowledgment.reviewed ? 'im-ack-btn--active' : ''}" id="imMarkReviewedBtn">Mark Reviewed</button>
            </div>
            <p class="im-ack-note">All acknowledgment actions update local demo state only. No backend persistence.</p>
        </div>
    `;

    return html;
}

// Get status class string for impact map
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

// Initialize impact map page
function initImpactMapPage() {
    const imChangeSelect = document.getElementById('imChangeSelect');
    const imMain = document.querySelector('.im-main');
    if (!imChangeSelect || !imMain) return;

    // Populate change selector
    CHANGE_SCENARIOS.forEach(scenario => {
        const opt = document.createElement('option');
        opt.value = scenario.id;
        opt.textContent = `${scenario.title} (${scenario.version})`;
        imChangeSelect.appendChild(opt);
    });

    let currentAnalysis = null;

    function renderAnalysis() {
        if (!currentAnalysis) return;
        imMain.innerHTML = renderImpactAnalysis(currentAnalysis);

        const acknowledgeBtn = document.getElementById('imAcknowledgeBtn');
        const markReviewedBtn = document.getElementById('imMarkReviewedBtn');
        const reviewNote = document.getElementById('imReviewNote');
        const ack = currentAnalysis.reviewerAcknowledgment;

        if (acknowledgeBtn && ack) {
            acknowledgeBtn.onclick = function() {
                ack.acknowledged = true;
                ack.reviewNotes = reviewNote ? reviewNote.value : (ack.reviewNotes || '');
                renderAnalysis();
            };
        }

        if (markReviewedBtn && ack) {
            markReviewedBtn.onclick = function() {
                ack.reviewed = true;
                ack.reviewNotes = reviewNote ? reviewNote.value : (ack.reviewNotes || '');
                renderAnalysis();
            };
        }
    }

    imChangeSelect.addEventListener('change', function() {
        currentAnalysis = analyzeChangeImpact(this.value);
        renderAnalysis();
    });

    // Initialize with first scenario
    if (imChangeSelect.value) {
        imChangeSelect.dispatchEvent(new Event('change'));
    }
}

// Export for window access
window.CHANGE_SCENARIOS = CHANGE_SCENARIOS;
window.analyzeChangeImpact = analyzeChangeImpact;
window.classifyImpact = classifyImpact;
window.renderImpactAnalysis = renderImpactAnalysis;
window.initImpactMapPage = initImpactMapPage;
window.getStatusClass = getStatusClass;
window.escapeHtml = escapeHtml;