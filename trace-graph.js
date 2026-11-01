// PRAVAAH Evidence-to-Decision Trace Graph
// Interactive graph visualizing relationships between source, requirement, evidence, finding, decision and follow-up action

// Build the trace graph data for a selected application
function buildTraceGraph(appId) {
    const app = applicationsData.find(a => a.id === appId);
    if (!app) return null;

    // Extract record types from the application data
    const nodes = [];
    const edges = [];

    // 1. Source nodes - inferred from application origin/regulatory body
    // In demo data, we infer sources from the application context
    const sourceNode = {
        id: `SRC-${appId}`,
        type: 'Source',
        title: 'AICTE Approval Source',
        description: 'All India Council for Technical Education (AICTE) approval requirements',
        status: 'Available',
        fields: {
            recordId: `SRC-${appId}`,
            recordType: 'Source',
            title: 'AICTE Approval Source',
            description: 'All India Council for Technical Education (AICTE) approval requirements',
            currentStatus: 'Available',
            relatedApplication: appId,
            sourceReference: 'AICTE Operational Guidelines',
            created: '2024-01-01'
        },
        relatedNodes: []
    };
    nodes.push(sourceNode);

    // 2. Requirement nodes - from checklist relatedRequirements and stage metadata
    let reqId = 1;
    if (app.checklist) {
        app.checklist.forEach(check => {
            if (check.relatedRequirement) {
                const reqNode = {
                    id: check.relatedRequirement,
                    type: 'Requirement',
                    title: check.label,
                    description: `Checklist item: ${check.label}`,
                    status: check.status,
                    fields: {
                        recordId: check.relatedRequirement,
                        recordType: 'Requirement',
                        title: check.label,
                        description: `Checklist item: ${check.label}`,
                        currentStatus: check.status,
                        relatedApplication: appId,
                        sourceReference: `REQ-${appId}-${reqId}`,
                        created: new Date().toISOString().split('T')[0]
                    },
                    relatedNodes: []
                };
                nodes.push(reqNode);

                // Edge: Source defines/informs Requirement
                edges.push({
                    id: `E${sourceNode.id}-${reqNode.id}`,
                    source: sourceNode.id,
                    target: reqNode.id,
                    type: 'defines',
                    title: 'Source defines requirement',
                    description: 'The AICTE source defines this requirement for the application'
                });

                reqId++;
            }
        });
    }

    // If no checklist has relatedRequirements, add a default requirement
    if (reqId === 1) {
        const defaultReq = {
            id: `REQ-${appId}-01`,
            type: 'Requirement',
            title: 'Application Completeness',
            description: 'All required application fields and documents must be submitted',
            status: app.status,
            fields: {
                recordId: `REQ-${appId}-01`,
                recordType: 'Requirement',
                title: 'Application Completeness',
                description: 'All required application fields and documents must be submitted',
                currentStatus: app.status,
                relatedApplication: appId,
                sourceReference: 'AICTE Standard Requirements',
                created: new Date().toISOString().split('T')[0]
            },
            relatedNodes: []
        };
        nodes.push(defaultReq);

        edges.push({
            id: `E${sourceNode.id}-${defaultReq.id}`,
            source: sourceNode.id,
            target: defaultReq.id,
            type: 'defines',
            title: 'Source defines requirement',
            description: 'The AICTE source defines this requirement for the application'
        });
    }

    // 3. Evidence nodes - from documents
    if (app.documents) {
        app.documents.forEach((doc, docIdx) => {
            const evidenceNode = {
                id: `EV-${appId}-${docIdx}`,
                type: 'Evidence',
                title: doc.name,
                description: `Document: ${doc.name}`,
                status: doc.status,
                fields: {
                    recordId: `EV-${appId}-${docIdx}`,
                    recordType: 'Evidence',
                    title: doc.name,
                    description: `Document: ${doc.name}`,
                    currentStatus: doc.status,
                    relatedApplication: appId,
                    sourceReference: `OBL-${appId}-${docIdx}`,
                    receivedDate: doc.receivedDate,
                    expiry: doc.expiry
                },
                relatedNodes: []
            };
            nodes.push(evidenceNode);

            // Edge: Requirement is supported by Evidence
            // Link to the first requirement
            const firstReq = nodes.find(n => n.type === 'Requirement');
            if (firstReq) {
                edges.push({
                    id: `E${firstReq.id}-${evidenceNode.id}`,
                    source: firstReq.id,
                    target: evidenceNode.id,
                    type: 'supports',
                    title: 'Requirement supported by evidence',
                    description: 'The evidence item supports the linked requirement'
                });
            }

            // Edge: Source informs evidence
            edges.push({
                id: `E${sourceNode.id}-${evidenceNode.id}`,
                source: sourceNode.id,
                target: evidenceNode.id,
                type: 'informs',
                title: 'Source informs evidence requirement',
                description: 'The AICTE source specifies this evidence requirement'
            });
        });
    }

    // If no documents, add a placeholder evidence node
    if (!app.documents || app.documents.length === 0) {
        const placeholderEv = {
            id: `EV-${appId}-00`,
            type: 'Evidence',
            title: 'No Documents Uploaded',
            description: 'No evidence documents linked to this application',
            status: 'unavailable',
            fields: {
                recordId: `EV-${appId}-00`,
                recordType: 'Evidence',
                title: 'No Documents Uploaded',
                description: 'No evidence documents linked to this application',
                currentStatus: 'unavailable',
                relatedApplication: appId,
                sourceReference: 'N/A',
                created: 'N/A'
            },
            relatedNodes: []
        };
        nodes.push(placeholderEv);
    }

    // 4. Reviewer Finding nodes - from application action and stage status
    let findingId = 1;
    if (app.action) {
        const findingTitle = app.action.includes('Document') || app.action.includes('document')
            ? 'Document Validity Finding'
            : app.action.includes('Compliance') || app.action.includes('compliance')
                ? 'Compliance Finding'
                : app.action.includes('Undertaking') || app.action.includes('undertaking')
                    ? 'Undertaking Finding'
                    : 'Review Finding';

        const findingNode = {
            id: `FIND-${appId}-${findingId}`,
            type: 'Reviewer Finding',
            title: findingTitle,
            description: `Finding: ${app.action}`,
            status: getFindingStatus(app),
            fields: {
                recordId: `FIND-${appId}-${findingId}`,
                recordType: 'Reviewer Finding',
                title: findingTitle,
                description: `Finding: ${app.action}`,
                currentStatus: getFindingStatus(app),
                relatedApplication: appId,
                sourceReference: `FR-${appId}-${findingId}`,
                discovered: new Date().toISOString().split('T')[0]
            },
            relatedNodes: []
        };
        nodes.push(findingNode);

        // Edge: Evidence supports/contradicts Finding
        const firstEvidence = nodes.find(n => n.type === 'Evidence' && n.id.startsWith('EV-'));
        if (firstEvidence) {
            const relationship = app.action.toLowerCase().includes('valid') || app.action.toLowerCase().includes('receiv')
                ? 'supports'
                : 'contradicts';
            edges.push({
                id: `E${firstEvidence.id}-${findingNode.id}`,
                source: firstEvidence.id,
                target: findingNode.id,
                type: relationship,
                title: `${relationship} relationship`,
                description: `Evidence ${relationship} this finding`
            });
        }

        // Edge: Finding informs Decision
        edges.push({
            id: `E${findingNode.id}-${sourceNode.id}`,
            source: findingNode.id,
            target: sourceNode.id,
            type: 'informs',
            title: 'Finding informs source/decision',
            description: 'The reviewer finding influences the decision process'
        });

        findingId++;
    }

    // If no finding from action, add one based on stage/status
    if (!app.action || app.action.trim() === '') {
        const stageFinding = getStageBasedFinding(app.stage);
        const findingNode = {
            id: `FIND-${appId}-${findingId}`,
            type: 'Reviewer Finding',
            title: stageFinding.title,
            description: stageFinding.description,
            status: stageFinding.status,
            fields: {
                recordId: `FIND-${appId}-${findingId}`,
                recordType: 'Reviewer Finding',
                title: stageFinding.title,
                description: stageFinding.description,
                currentStatus: stageFinding.status,
                relatedApplication: appId,
                sourceReference: 'AICTE Stage Guidelines',
                discovered: new Date().toISOString().split('T')[0]
            },
            relatedNodes: []
        };
        nodes.push(findingNode);

        // Edge: Finding informs Decision
        edges.push({
            id: `E${findingNode.id}-${sourceNode.id}`,
            source: findingNode.id,
            target: sourceNode.id,
            type: 'informs',
            title: 'Finding informs decision',
            description: 'The reviewer finding influences the decision process'
        });
    }

    // 5. Decision node - based on application stage and status
    const decisionStatus = getDecisionStatus(app.stage, app.status);
    const decisionNode = {
        id: `DECISION-${appId}`,
        type: 'Decision',
        title: decisionStatus.title,
        description: decisionStatus.description,
        status: decisionStatus.status,
        fields: {
            recordId: `DECISION-${appId}`,
            recordType: 'Decision',
            title: decisionStatus.title,
            description: decisionStatus.description,
            currentStatus: decisionStatus.status,
            relatedApplication: appId,
            sourceReference: 'AICTE Decision Criteria',
            decisionDate: new Date().toISOString().split('T')[0],
            relatedFinding: findingId > 0 ? `FIND-${appId}-${findingId - 1}` : 'N/A'
        },
        relatedNodes: []
    };
    nodes.push(decisionNode);

    // Edge: Finding informs Decision
    const lastFinding = nodes.find(n => n.type === 'Reviewer Finding');
    if (lastFinding && lastFinding.type === 'Reviewer Finding') {
        edges.push({
            id: `E${lastFinding.id}-${decisionNode.id}`,
            source: lastFinding.id,
            target: decisionNode.id,
            type: 'informs',
            title: 'Finding informs proposed decision',
            description: 'The reviewer finding supports or contradicts the proposed decision'
        });
    }

    // Edge: Decision creates Follow-up Action
    const followUp = getFollowUpAction(app.stage, app.status);
    if (followUp) {
        const followUpNode = {
            id: `ACTION-${appId}`,
            type: 'Follow-up Action',
            title: followUp.title,
            description: followUp.description,
            status: followUp.status,
            fields: {
                recordId: `ACTION-${appId}`,
                recordType: 'Follow-up Action',
                title: followUp.title,
                description: followUp.description,
                currentStatus: followUp.status,
                relatedApplication: appId,
                sourceReference: 'AICTE Follow-up Requirements',
                created: new Date().toISOString().split('T')[0],
                relatedDecision: `DECISION-${appId}`
            },
            relatedNodes: []
        };
        nodes.push(followUpNode);

        // Edge: Decision creates/requires Follow-up Action
        edges.push({
            id: `E${decisionNode.id}-${followUpNode.id}`,
            source: decisionNode.id,
            target: followUpNode.id,
            type: 'creates',
            title: 'Decision creates follow-up action',
            description: 'The proposed decision requires or creates this follow-up action'
        });
    }

    // If no follow-up action found, add a default one
    if (!followUp) {
        const defaultActionNode = {
            id: `ACTION-${appId}`,
            type: 'Follow-up Action',
            title: 'No Pending Follow-up',
            description: 'No follow-up action required at this stage',
            status: 'completed',
            fields: {
                recordId: `ACTION-${appId}`,
                recordType: 'Follow-up Action',
                title: 'No Pending Follow-up',
                description: 'No follow-up action required at this stage',
                currentStatus: 'completed',
                relatedApplication: appId,
                sourceReference: 'AICTE Standard Closure',
                created: new Date().toISOString().split('T')[0],
                relatedDecision: `DECISION-${appId}`
            },
            relatedNodes: []
        };
        nodes.push(defaultActionNode);

        edges.push({
            id: `E${decisionNode.id}-${defaultActionNode.id}`,
            source: decisionNode.id,
            target: defaultActionNode.id,
            type: 'creates',
            title: 'Decision creates follow-up action',
            description: 'The proposed decision creates this follow-up action'
        });
    }

    return { nodes, edges, application: app };
}

// Helper: get finding status based on app data
function getFindingStatus(app) {
    if (app.stage === 'Final Decision' && app.status === 'Completed') return 'Resolved';
    if (app.status === 'Completed') return 'Resolved';
    if (app.status === 'Action Required') return 'Open';
    if (app.status === 'Due Soon') return 'Open';
    if (app.status === 'Compliance Pending') return 'Open';
    if (app.status === 'Awaiting Decision') return 'Open';
    return 'Open';
}

// Helper: get decision status based on app data
function getDecisionStatus(stage, status) {
    if (stage === 'Final Decision' && status === 'Completed') {
        return { title: 'Application Approved', description: 'Final decision recorded - application approved', status: 'Completed' };
    }
    if (stage === 'Final Decision' && status === 'Awaiting Decision') {
        return { title: 'Awaiting Final Decision', description: 'Final review in progress', status: 'Open' };
    }
    if (status === 'Action Required') {
        return { title: 'Review Required', description: 'Application requires additional review or documentation', status: 'Open' };
    }
    if (status === 'Due Soon') {
        return { title: 'Decision Pending', description: 'Decision pending within timeline', status: 'Open' };
    }
    if (status === 'Compliance Pending') {
        return { title: 'Compliance Review', description: 'Compliance review pending before decision', status: 'Open' };
    }
    if (status === 'Submitted') {
        return { title: 'Under Initial Review', description: 'Application under initial review process', status: 'Open' };
    }
    return { title: 'Decision Pending', description: 'Decision status pending', status: 'Open' };
}

// Helper: get follow-up action based on app data
function getFollowUpAction(stage, status) {
    // Map stage/status to illustrative follow-up
    if (stage === 'Application Submitted' && status === 'Submitted') {
        return { title: 'Assign Review Officer', description: 'Assign a review officer to the application', status: 'pending' };
    }
    if (stage === 'Initial Scrutiny' && status === 'Under Review') {
        return { title: 'Complete Checklist Review', description: 'Complete the initial scrutiny checklist review', status: 'pending' };
    }
    if (stage === 'Document Review' && (status === 'Action Required' || status === 'Due Soon')) {
        return { title: 'Review Missing Documents', description: 'Review and address missing or invalid supporting documents', status: 'pending' };
    }
    if (stage === 'Compliance Review' && (status === 'Due Soon' || status === 'Compliance Pending')) {
        return { title: 'Submit Compliance Response', description: 'Submit pending compliance response or undertaking', status: 'pending' };
    }
    if (stage === 'Final Decision' && status === 'Awaiting Decision') {
        return { title: 'Prepare Decision Summary', description: 'Prepare decision summary for authorized official review', status: 'pending' };
    }
    if (status === 'Completed') {
        return { title: 'Close Application Record', description: 'Close the application record and archive documents', status: 'completed' };
    }
    // Default
    return { title: 'Review Application Status', description: 'Review the current application status and next steps', status: 'pending' };
}

// Helper: get stage-based finding
function getStageBasedFinding(stage) {
    const findings = {
        'Application Submitted': {
            title: 'Application Submitted',
            description: 'Application has been submitted and is awaiting initial assignment',
            status: 'Open'
        },
        'Initial Scrutiny': {
            title: 'Checklist Review Pending',
            description: 'Required checklist items are pending review',
            status: 'Open'
        },
        'Document Review': {
            title: 'Document Validity Check',
            description: 'Document validity and completeness requires review',
            status: 'Open'
        },
        'Compliance Review': {
            title: 'Compliance Response Pending',
            description: 'Compliance response or undertaking is pending',
            status: 'Open'
        },
        'Final Decision': {
            title: 'Decision Recorded',
            description: 'Final decision awaits authorized official approval',
            status: 'Open'
        }
    };
    return findings[stage] || { title: 'Review Finding', description: 'Pending review item', status: 'Open' };
}

// Render the trace graph as SVG
function renderTraceGraph(nodes, edges, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    container.innerHTML = '';

    const width = container.clientWidth || 800;
    const height = 500;
    const nodeRadius = 16;
    const padding = 40;

    // Calculate positions using simple layered layout
    const nodeTypes = { Source: 0, Requirement: 1, Evidence: 2, 'Reviewer Finding': 3, Decision: 4, 'Follow-up Action': 5 };
    const typeOrder = ['Source', 'Requirement', 'Evidence', 'Reviewer Finding', 'Decision', 'Follow-up Action'];
    const typeColors = {
        Source: '#2563EB',
        Requirement: '#1d4ed8',
        Evidence: '#059669',
        'Reviewer Finding': '#dc2626',
        Decision: '#7c3aed',
        'Follow-up Action': '#ea580c'
    };

    // Position nodes in layers horizontally, spaced vertically
    const layerPositions = {};
    typeOrder.forEach((type, idx) => {
        layerPositions[type] = { x: 100 + idx * 160, y: 100 };
    });

    // Assign x positions based on node type, spread y positions
    nodes.forEach((node, idx) => {
        const type = node.type;
        if (layerPositions[type]) {
            node.x = layerPositions[type].x;
            // Spread vertically within layer
            node.y = layerPositions[type].y + (idx % 6) * 50;
        } else {
            node.x = 100 + (nodeTypes[type] || 0) * 160;
            node.y = 100 + (idx % 4) * 60;
        }
    });

    // Calculate overall dimensions for zooming/pan
    const allX = nodes.map(n => n.x);
    const allY = nodes.map(n => n.y);
    const minX = Math.min(0, Math.min(...allX) - padding);
    const maxX = Math.max(width, Math.max(...allX) + padding + nodeRadius);
    const minY = Math.min(padding, Math.min(...allY) - padding);
    const maxY = Math.max(height, Math.max(...allY) + padding + nodeRadius);

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `${minX} ${minY} ${maxX - minX} ${maxY - minY}`);
    svg.setAttribute('style', 'background-color: #fff;');
    svg.setAttribute('role', 'graphics');
    svg.setAttribute('aria-label', 'Evidence-to-Decision trace graph');

    // Draw edges (links) first
    edges.forEach(edge => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);

        if (sourceNode && targetNode) {
            const x1 = sourceNode.x;
            const y1 = sourceNode.y;
            const x2 = targetNode.x;
            const y2 = targetNode.y;

            // Calculate control point for curved link
            const midX = (x1 + x2) / 2;
            const controlY = Math.min(y1, y2) - 50;

            path.setAttribute('d', `M ${x1} ${y1} C ${midX} ${controlY} ${midX} ${controlY} ${x2} ${y2}`);
            path.setAttribute('stroke', '#64748b');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('class', 'tg-edge');

            // Add arrowhead
            const markerId = `marker-${edge.id}`;
            if (!document.getElementById(markerId)) {
                const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
                marker.setAttribute('id', markerId);
                marker.setAttribute('markerWidth', '10');
                marker.setAttribute('markerHeight', '10');
                marker.setAttribute('refX', '10');
                marker.setAttribute('refY', '5');
                marker.setAttribute('orient', 'auto');
                marker.setAttribute('stroke', '#64748b');
                marker.setAttribute('fill', '#64748b');

                const markerPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                markerPath.setAttribute('d', 'M0,0 L0,10 L10,5 Z');
                marker.appendChild(markerPath);
                svg.appendChild(marker);
            }

            path.setAttribute('marker-end', `url(#${markerId})`);
            svg.appendChild(path);
        }
    });

    // Draw nodes
    nodes.forEach(node => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', nodeRadius);

        // Color by type
        circle.setAttribute('fill', typeColors[node.type] || '#64748b');
        circle.setAttribute('stroke', '#1e293b');
        circle.setAttribute('stroke-width', '2');

        // Make nodes clickable
        circle.setAttribute('cursor', 'pointer');
        circle.setAttribute('data-node-id', node.id);
        circle.setAttribute('role', 'button');
        circle.setAttribute('tabindex', '0');

        // Tooltip/description
        circle.setAttribute('title', `${node.title}\n${node.description}`);

        svg.appendChild(circle);

        // Node label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', node.x);
        label.setAttribute('y', node.y + 5);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', '#fff');
        label.setAttribute('font-size', '10');
        label.setAttribute('font-weight', '600');
        label.setAttribute('style', 'pointer-events: none;');
        label.setAttribute('data-node-id', node.id);
        label.textContent = node.title.substring(0, 12);
        svg.appendChild(label);
    });

    // Draw connections/arrows as separate elements for interactivity
    // Add click handlers via event delegation
    svg.addEventListener('click', function(e) {
        const target = e.target;
        if (target.tagName === 'circle' || target.tagName === 'text') {
            const nodeId = target.getAttribute('data-node-id');
            if (nodeId) {
                selectNode(nodeId, nodes, edges);
            }
        }
    });

    // Add hover tooltips
    svg.addEventListener('mouseover', function(e) {
        const target = e.target;
        if (target.hasAttribute('data-node-id')) {
            const nodeId = target.getAttribute('data-node-id');
            const node = nodes.find(n => n.id === nodeId);
            if (node) showNodeDetails(node, svg);
        }
    });

    svg.addEventListener('mouseout', function() {
        // Hide details - could be improved
    });

    container.appendChild(svg);

    // Add legend
    const legend = document.createElement('div');
    legend.className = 'tg-legend';
    let legendHTML = '<h4>Node Types</h4>';
    typeOrder.forEach(type => {
        const color = typeColors[type] || '#64748b';
        legendHTML += `<div class="tg-legend-item"><span class="tg-legend-color" style="background: ${color};"></span> ${type}</div>`;
    });
    legend.innerHTML = legendHTML;
    container.appendChild(legend);

    // Add controls
    const controls = document.createElement('div');
    controls.className = 'tg-controls';
    controls.innerHTML = `
        <button class="tg-control-btn" id="tgFitBtn">Fit to View</button>
        <button class="tg-control-btn" id="tgResetBtn">Reset Selection</button>
    `;
    container.appendChild(controls);

    // Fit button
    const fitBtn = document.getElementById('tgFitBtn');
    if (fitBtn) {
        fitBtn.addEventListener('click', function() {
            svg.setAttribute('viewBox', `${minX} ${minY} ${maxX - minX} ${maxY - minY}`);
        });
    }

    // Reset button
    const resetBtn = document.getElementById('tgResetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            deselectNode();
            renderTraceGraph(nodes, edges, containerId);
        });
    }

    return { svg, nodes, edges };
}

// Node selection state
let selectedNodeId = null;

function selectNode(nodeId, nodes, edges) {
    selectedNodeId = nodeId;
    // Visual feedback - increase size and add border
    document.querySelectorAll('.tg-node-circle').forEach(c => c.classList.remove('tg-node--selected'));
    const selectedCircle = document.querySelector(`circle[data-node-id="${nodeId}"]`);
    if (selectedCircle) {
        selectedCircle.classList.add('tg-node--selected');
    }

    // Show details panel
    showNodeDetailsById(nodeId, nodes, edges);
}

function deselectNode() {
    selectedNodeId = null;
    document.querySelectorAll('.tg-node--selected').forEach(c => c.classList.remove('tg-node--selected'));
    const detailsPanel = document.getElementById('tgDetailsPanel');
    if (detailsPanel) {
        detailsPanel.innerHTML = '<p class="tg-empty">Click a node to inspect its details</p>';
    }
    const summaryPanel = document.getElementById('tgTraceSummary');
    if (summaryPanel) {
        summaryPanel.innerHTML = '<p>No relationships selected</p>';
    }
}

function showNodeDetailsById(nodeId, nodes, edges) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const detailsPanel = document.getElementById('tgDetailsPanel');
    if (!detailsPanel) return;

    // Build details HTML from actual fields
    const fields = node.fields || {};
    let detailsHTML = `
        <div class="tg-node-detail">
            <div class="tg-detail-header">
                <span class="tg-detail-id">ID: ${node.id}</span>
                <span class="tg-detail-type">${node.type}</span>
            </div>
            <div class="tg-detail-title">${escapeHtml(node.title)}</div>
        </div>
        <div class="tg-detail-fields">
    `;

    // Add available fields
    const fieldOrder = ['recordId', 'recordType', 'title', 'description', 'currentStatus', 'relatedApplication', 'sourceReference'];
    fieldOrder.forEach(field => {
        if (fields[field] !== undefined && fields[field] !== null) {
            detailsHTML += `
                <div class="tg-detail-row">
                    <span class="tg-detail-label">${field.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span class="tg-detail-value">${escapeHtml(String(fields[field]))}</span>
                </div>
            `;
        }
    });

    // Add related nodes info
    const related = node.relatedNodes || [];
    if (related.length > 0) {
        detailsHTML += `<div class="tg-detail-row"><span class="tg-detail-label">Related Nodes</span><span class="tg-detail-value">${related.length} related record${related.length !== 1 ? 's' : ''}</span></div>`;
    }

    detailsHTML += `</div>`;

    // Show relationship info if this node has connections
    const relatedEdges = edges.filter(e => e.source === nodeId || e.target === nodeId);
    if (relatedEdges.length > 0) {
        detailsHTML += `<div class="tg-detail-section"><h5>Relationships (${relatedEdges.length})</h5>`;
        detailsHTML += `<ul>`;
        relatedEdges.forEach(edge => {
            const otherId = edge.source === nodeId ? edge.target : edge.source;
            const otherNode = nodes.find(n => n.id === otherId);
            const relType = edge.type || 'related';
            detailsHTML += `<li><strong>${escapeHtml(edge.title)}</strong> → ${otherNode ? escapeHtml(otherNode.title) : 'Unknown node'} <span class="tg-edge-type">${relType}</span></li>`;
        });
        detailsHTML += `</ul></div>`;
    }

    detailsHTML += `</div>`;
    detailsPanel.innerHTML = detailsHTML;
}

// Show trace completeness summary
function renderTraceSummary(nodes, edges, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Analyze relationships
    const totalNodes = nodes.length;
    const totalEdges = edges.length;

    // Check for issues
    const evidenceNodes = nodes.filter(n => n.type === 'Evidence');
    const requirementNodes = nodes.filter(n => n.type === 'Requirement');
    const findingNodes = nodes.filter(n => n.type === 'Reviewer Finding');
    const decisionNodes = nodes.filter(n => n.type === 'Decision');
    const followUpNodes = nodes.filter(n => n.type === 'Follow-up Action');

    // Issues detection
    let issues = [];
    let issuesCount = 0;

    // Evidence with no linked requirement
    const evWithReq = evidenceNodes.some(ev => {
        const linkedReq = nodes.find(n => n.type === 'Requirement' && n.id === ev.relatedRequirement);
        return !linkedReq;
    });
    if (evWithReq) {
        issues.push({ title: 'Evidence with no linked requirement', severity: 'High' });
        issuesCount++;
    }

    // Findings with no supporting evidence
    const findingWithEv = findingNodes.some(finding => {
        const hasEvidenceConnection = edges.some(e => e.target === finding.id || e.source === finding.id);
        return !hasEvidenceConnection;
    });
    if (findingWithEv && findingNodes.length > 0) {
        issues.push({ title: 'Finding with no supporting evidence', severity: 'High' });
        issuesCount++;
    }

    // Proposed decisions with no linked findings
    const decisionWithFinding = decisionNodes.some(dec => {
        const linkedFinding = edges.find(e => e.target === dec.id && 
            nodes.find(n => n.id === e.source && n.type === 'Reviewer Finding')
        );
        return !linkedFinding;
    });
    if (decisionWithFinding && decisionNodes.length > 0) {
        issues.push({ title: 'Proposed decision with no linked finding', severity: 'Medium' });
        issuesCount++;
    }

    // Follow-up actions with no linked decision
    const followUpWithDec = followUpNodes.some(fu => {
        const linkedDec = edges.find(e => e.target === fu.id && 
            nodes.find(n => n.id === e.source && n.type === 'Decision')
        );
        return !linkedDec;
    });
    if (followUpWithDec && followUpNodes.length > 0) {
        issues.push({ title: 'Follow-up action with no linked decision', severity: 'Medium' });
        issuesCount++;
    }

    // Missing source references
    const sourceNodes = nodes.filter(n => n.type === 'Source');
    if (sourceNodes.length === 0) {
        issues.push({ title: 'No source reference found', severity: 'Medium' });
        issuesCount++;
    }

    const passedChecks = totalNodes + totalEdges - issuesCount;
    const totalChecks = totalNodes + totalEdges;
    const completenessScore = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

    container.innerHTML = `
        <div class="tg-summary-grid">
            <div class="tg-summary-card tg-card--total">
                <div class="tg-summary-card__label">Total Nodes</div>
                <div class="tg-summary-card__value">${totalNodes}</div>
            </div>
            <div class="tg-summary-card tg-card--edges">
                <div class="tg-summary-card__label">Relationships</div>
                <div class="tg-summary-card__value">${totalEdges}</div>
            </div>
            <div class="tg-summary-card tg-card--completeness">
                <div class="tg-summary-card__label">Trace Completeness</div>
                <div class="tg-summary-card__value">${completenessScore}%</div>
                <div class="tg-summary-card__sub">${totalChecks > 0 ? `${passedChecks} of ${totalChecks} relationships represented` : 'No relationships'}</div>
            </div>
            ${issuesCount > 0 ? `
            <div class="tg-summary-card tg-card--issue">
                <div class="tg-summary-card__label">Issues Identified</div>
                <div class="tg-summary-card__value">${issuesCount}</div>
                <div class="tg-summary-card__sub">Relationship gaps detected</div>
            </div>
            ` : ''}
        </div>

        ${issuesCount > 0 ? `
        <div class="tg-issues-list">
            <h5>Trace Issues</h5>
            ${issues.map(issue => `<div class="tg-issue-item"><span class="tg-issue-severity ${issue.severity.toLowerCase()}">${issue.severity}</span> ${issue.title}</div>`).join('')}
        </div>
        ` : ''}
    `;
}

// Escape HTML special characters
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text || '');
    return div.innerHTML;
}

// Initialize trace graph page
function initTraceGraphPage() {
    const tgAppSelect = document.getElementById('tgAppSelect');
    const graphContainer = document.getElementById('tgGraphContainer');
    const detailsPanel = document.getElementById('tgDetailsPanel');
    const traceSummary = document.getElementById('tgTraceSummary');

    if (!tgAppSelect || !graphContainer || !detailsPanel) return;

    // Populate application selector
    applicationsData.forEach(app => {
        const opt = document.createElement('option');
        opt.value = app.id;
        opt.textContent = `${app.id} - ${app.institution}`;
        tgAppSelect.appendChild(opt);
    });

    let currentGraphData = null;

    tgAppSelect.addEventListener('change', function() {
        const appId = this.value;
        currentGraphData = buildTraceGraph(appId);
        if (currentGraphData) {
            renderTraceGraph(currentGraphData.nodes, currentGraphData.edges, 'tgGraphContainer');
            renderTraceSummary(currentGraphData.nodes, currentGraphData.edges, 'tgTraceSummary');
        }
    });

    // Initialize with first application
    if (tgAppSelect.value) {
        tgAppSelect.dispatchEvent(new Event('change'));
    }

    // Reset button
    const resetBtn = document.getElementById('tgResetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            deselectNode();
            if (tgAppSelect.value) {
                tgAppSelect.dispatchEvent(new Event('change'));
            }
        });
    }
}

// Export for window access
window.buildTraceGraph = buildTraceGraph;
window.renderTraceGraph = renderTraceGraph;
window.initTraceGraphPage = initTraceGraphPage;
window.escapeHtml = escapeHtml;