"use strict";
// PRAVAAH Reports & Analytics - Full Report Centre with PDF and PPTX exports (frontend only, demo)

const RPT_DEMO_TODAY = new Date();
const RPT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const RPT_DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const rptKpi = [
    { id: "processed", label: "Total Applications Processed", value: 1248, delta: "+5.2%", trend: "up", icon: "apps", note: "Illustrative vs previous demo period" },
    { id: "pending", label: "Currently Pending", value: 186, delta: "-3.8%", trend: "down", icon: "clock", note: "Illustrative vs previous demo period" },
    { id: "avg", label: "Average Processing Time", value: "18.4 Days", delta: "-1.7 days", trend: "down", icon: "time", note: "Illustrative comparison" },
    { id: "compliance", label: "Compliance Reviews Pending", value: 72, delta: "+6.0%", trend: "up", icon: "shield", note: "Illustrative vs previous demo period" },
    { id: "overdue", label: "Overdue Workflow Actions", value: 18, delta: "-12.0%", trend: "down", icon: "alert", note: "Illustrative vs previous demo period" }
];

const rptTrend = [
    { period: "Day", data: { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], submitted: [42,38,46,39,51,12,18], processed: [35,41,38,44,47,14,16] } },
    { period: "Week", data: { labels: ["Week 1","Week 2","Week 3","Week 4"], submitted: [198,212,206,224], processed: [186,198,194,206] } },
    { period: "Month", data: { labels: ["Jun","Jul","Aug","Sep","Oct"], submitted: [782,806,824,842,876], processed: [734,762,784,802,832] } }
];

const rptStage = [
    { stage: "Application Submitted", count: 126 },
    { stage: "Initial Scrutiny", count: 324 },
    { stage: "Document Review", count: 278 },
    { stage: "Compliance Review", count: 186 },
    { stage: "Awaiting Final Decision", count: 94 },
    { stage: "Completed", count: 518 }
];

const rptPendency = [
    { stage: "Initial Scrutiny", pending: 324 },
    { stage: "Document Review", pending: 278 },
    { stage: "Compliance Review", pending: 186 },
    { stage: "Awaiting Final Decision", pending: 94 },
    { stage: "Application Submitted", pending: 42 }
];

const rptTime = [
    { stage: "Application Submitted", days: 2.4 },
    { stage: "Initial Scrutiny", days: 6.8 },
    { stage: "Document Review", days: 7.6 },
    { stage: "Compliance Review", days: 9.4 },
    { stage: "Awaiting Final Decision", days: 4.2 }
];

const rptAge = [
    { label: "0-7 days", count: 86 },
    { label: "8-15 days", count: 62 },
    { label: "16-30 days", count: 28 },
    { label: "More than 30 days", count: 10 }
];

const rptCompliance = [
    { label: "Marked Complete (Demo)", value: 371 },
    { label: "Awaiting Review", value: 72 },
    { label: "Requiring Attention", value: 24 },
    { label: "Upcoming Deadlines", value: 19 },
    { label: "Overdue Actions", value: 12 }
];

const rptDeadlineTrend = [
    { month: "Jun", upcoming: 14, overdue: 9 },
    { month: "Jul", upcoming: 16, overdue: 11 },
    { month: "Aug", upcoming: 18, overdue: 12 },
    { month: "Sep", upcoming: 19, overdue: 13 },
    { month: "Oct", upcoming: 22, overdue: 12 }
];

const rptInstitutions = [
    { id: "INST-001", name: "Western Institute of Technology", total: 248, pending: 38, completed: 210, compliance: 6, oldest: "18 Oct 2026", status: "Active (Demo)" },
    { id: "INST-002", name: "Deccan College of Engineering", total: 214, pending: 32, completed: 182, compliance: 4, oldest: "19 Oct 2026", status: "Active (Demo)" },
    { id: "INST-003", name: "National Technical Institute", total: 198, pending: 28, completed: 170, compliance: 5, oldest: "20 Oct 2026", status: "Active (Demo)" },
    { id: "INST-004", name: "Sahyadri Institute of Technology", total: 186, pending: 26, completed: 160, compliance: 7, oldest: "17 Oct 2026", status: "Active (Demo)" },
    { id: "INST-005", name: "Central Institute of Engineering", total: 164, pending: 24, completed: 140, compliance: 4, oldest: "21 Oct 2026", status: "Active (Demo)" },
    { id: "INST-006", name: "Eastern Polytechnic College", total: 142, pending: 18, completed: 124, compliance: 2, oldest: "22 Oct 2026", status: "Active (Demo)" },
    { id: "INST-007", name: "Western Technical Campus", total: 128, pending: 16, completed: 112, compliance: 3, oldest: "23 Oct 2026", status: "Active (Demo)" },
    { id: "INST-008", name: "Coastal Institute of Technology", total: 116, pending: 14, completed: 102, compliance: 2, oldest: "15 Oct 2026", status: "Active (Demo)" }
];

const rptLibrary = [
    { id: "LIB-001", name: "Application Processing Summary", desc: "Overview of submissions, processing and turnaround from the PRAVAAH demo dataset.", generated: "" },
    { id: "LIB-002", name: "Workflow Pendency Report", desc: "Stage-wise pendency and bottleneck identification for illustrative records.", generated: "" },
    { id: "LIB-003", name: "Compliance Obligations Report", desc: "Illustrative compliance obligations and items requiring attention.", generated: "" },
    { id: "LIB-004", name: "Deadline & Alerts Report", desc: "Upcoming deadlines and overdue sample actions from the demo set.", generated: "" },
    { id: "LIB-005", name: "Institution-wise Application Report", desc: "Fictional institution-wise application snapshot from mock data.", generated: "" },
    { id: "LIB-006", name: "Executive Overview Report", desc: "Aggregated executive summary for demo reporting.", generated: "" }
];

let rptTrendPeriod = "Day";
let rptInstSort = "name-asc";
let rptInstPage = 1;
let rptInstPerPage = 5;
let rptInstSearch = "";
let rptDetailLibId = null;
let rptExporting = false;

function rptEsc(s){ const d=document.createElement("div"); d.textContent=String(s); return d.innerHTML; }
function rptFormatNum(n){ if(typeof n==="number") return n.toLocaleString(); return n; }
function rptFmtDate(d){ return d.getDate()+" "+RPT_MONTHS[d.getMonth()]+" "+d.getFullYear(); }
function rptGenFileDate(d){ const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,"0"); const dd=String(d.getDate()).padStart(2,"0"); return y+"-"+m+"-"+dd; }

function rptShowToast(msg, type){
    const t = document.getElementById("rptToast");
    if(!t) return;
    t.textContent = msg;
    t.classList.remove("rpt-toast--show","rpt-toast--error");
    if(type==="error") t.classList.add("rpt-toast--error");
    t.classList.add("rpt-toast--show");
    setTimeout(()=>t.classList.remove("rpt-toast--show"), 2500);
}

function rptRenderKpi(){
    const grid = document.getElementById("rptKpiGrid");
    if(!grid) return;
    grid.innerHTML = rptKpi.map(k=>{
        const icon = k.icon==="apps" ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 8h7M3 12h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
            : k.icon==="clock" ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.5v3.8l2.2 1.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
            : k.icon==="time" ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M8 5v3l1.8 1.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
            : k.icon==="shield" ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2.5L3 4v4.5c0 3 2.1 5.8 5 6.5 2.9-.7 5-3.5 5-6.5V4L8 2.5z" stroke="currentColor" stroke-width="1.5"/><path d="M6.5 8l1.2 1.2L10 6.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            : '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M8 5v3.5M8 10.8v.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
        const trendClass = k.trend==="up"?"up":k.trend==="down"?"down":"neutral";
        const arrow = k.trend==="up"?"\u2191":k.trend==="down"?"\u2193":"\u2192";
        return `<article class="rpt-kpi"><div class="rpt-kpi__head"><span class="rpt-kpi__icon">${icon}</span><span class="rpt-kpi__demo">Illustrative</span></div><div class="rpt-kpi__value">${rptFormatNum(k.value)}</div><div class="rpt-kpi__label">${rptEsc(k.label)}</div><div class="rpt-kpi__footer"><span class="rpt-kpi__delta rpt-kpi__delta--${trendClass}">${arrow} ${rptEsc(k.delta)}</span><span class="rpt-kpi__note">${rptEsc(k.note)}</span></div></article>`;
    }).join("");
}

function rptGetFiltersText(){
    const period = document.getElementById("rptPeriodSel")?.value || "Last 30 Days (Demo)";
    const type = document.getElementById("rptTypeSel")?.value || "All Types";
    const stage = document.getElementById("rptStageSel")?.value || "All Stages";
    const inst = document.getElementById("rptInstSel")?.value || "All Institutions";
    const status = document.getElementById("rptStatusSel")?.value || "All Status";
    return `Period: ${period}; Type: ${type}; Stage: ${stage}; Institution: ${inst}; Status: ${status}`;
}

function rptRenderLibrary(){
    const grid = document.getElementById("rptLibraryGrid");
    if(!grid) return;
    grid.innerHTML = rptLibrary.map(lib=>{
        const gen = lib.generated || rptFmtDate(RPT_DEMO_TODAY);
        if(!lib.generated) lib.generated = gen;
        return `<article class="rpt-lib-card" data-lib="${rptEsc(lib.id)}"><div class="rpt-lib-card__head"><h3 class="rpt-lib-card__title">${rptEsc(lib.name)}</h3><span class="rpt-lib-card__tag">Template</span></div><p class="rpt-lib-card__desc">${rptEsc(lib.desc)}</p><div class="rpt-lib-card__meta"><span>Coverage: Demo dataset</span><span>Last generated (demo): ${rptEsc(lib.generated)}</span></div><div class="rpt-lib-card__formats"><span class="rpt-fmt">PDF</span><span class="rpt-fmt">PPTX</span></div><div class="rpt-lib-card__actions"><button type="button" class="rpt-btn rpt-btn--secondary" data-lib-act="preview" data-lib-id="${rptEsc(lib.id)}">Preview Report</button><button type="button" class="rpt-btn rpt-btn--primary" data-lib-act="pdf" data-lib-id="${rptEsc(lib.id)}">Download PDF</button><button type="button" class="rpt-btn rpt-btn--primary" data-lib-act="pptx" data-lib-id="${rptEsc(lib.id)}">Download PPTX</button></div></article>`;
    }).join("");
    grid.querySelectorAll("[data-lib-act]").forEach(btn=>{
        btn.addEventListener("click", ()=>{
            const act = btn.getAttribute("data-lib-act");
            const id = btn.getAttribute("data-lib-id");
            const lib = rptLibrary.find(x=>x.id===id);
            if(!lib) return;
            if(act==="preview") rptOpenPreview(lib);
            if(act==="pdf") rptDownloadPDF(lib);
            if(act==="pptx") rptDownloadPPTX(lib);
        });
    });
}

function rptOpenPreview(lib){
    const modal = document.getElementById("rptModal");
    if(!modal) return;
    const title = document.getElementById("rptModalTitle");
    const range = document.getElementById("rptModalRange");
    const filters = document.getElementById("rptModalFilters");
    const gen = document.getElementById("rptModalGen");
    const body = document.getElementById("rptModalTableBody");
    const libGen = lib.generated || rptFmtDate(RPT_DEMO_TODAY);
    lib.generated = libGen;
    if(title) title.textContent = lib.name;
    if(range) range.textContent = document.getElementById("rptPeriodSel")?.value || "Last 30 Days (Demo)";
    if(filters) filters.textContent = rptGetFiltersText();
    if(gen) gen.textContent = libGen + " (Illustrative)";
    if(body){
        body.innerHTML = `
            <tr><td>Processed Applications</td><td>1,248</td><td>Illustrative - demo dataset</td></tr>
            <tr><td>Currently Pending</td><td>186</td><td>Illustrative - demo dataset</td></tr>
            <tr><td>Compliance Pending</td><td>72</td><td>Illustrative - demo dataset</td></tr>
            <tr><td>Overdue Actions</td><td>18</td><td>Illustrative - demo dataset</td></tr>
            <tr><td>Avg. Processing Time</td><td>18.4 Days</td><td>Illustrative comparison</td></tr>
        `;
    }
    rptDetailLibId = lib.id;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden","false");
}

function rptClosePreview(){
    const modal = document.getElementById("rptModal");
    if(!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden","true");
}

function rptDownloadPDF(lib){
    if(rptExporting) { rptShowToast("Export in progress, please wait.", "error"); return; }
    rptExporting = true;
    try {
        const jsPDF = window.jspdf && window.jspdf.jsPDF ? window.jspdf.jsPDF : (window.jsPDF || null);
        if(!jsPDF){
            rptShowToast("PDF library not available. Please refresh.", "error");
            rptExporting = false;
            return;
        }
        const doc = new jsPDF({ unit:"pt", format:"a4" });
        const pageW = doc.internal.pageSize.getWidth();
        const margin = 40;
        let y = 50;
        doc.setFontSize(18);
        doc.text("PRAVAAH", margin, y);
        y += 22;
        doc.setFontSize(14);
        doc.text(lib.name, margin, y);
        y += 16;
        doc.setFontSize(10);
        doc.text("DEMONSTRATION REPORT � ILLUSTRATIVE DATA", margin, y);
        y += 12;
        doc.text("Not an official AICTE report. All figures are from local demo data.", margin, y);
        y += 16;
        doc.text("Reporting period: " + (document.getElementById("rptPeriodSel")?.value || "Last 30 Days (Demo)"), margin, y);
        y += 12;
        doc.text("Filters: " + rptGetFiltersText(), margin, y);
        y += 18;
        doc.setFontSize(12);
        doc.text("KPI Summary (Illustrative)", margin, y);
        y += 14;
        doc.setFontSize(10);
        const kpis = [
            ["Total Applications Processed", "1,248", "+5.2%"],
            ["Currently Pending", "186", "-3.8%"],
            ["Average Processing Time", "18.4 Days", "-1.7 days"],
            ["Compliance Reviews Pending", "72", "+6.0%"],
            ["Overdue Workflow Actions", "18", "-12.0%"]
        ];
        kpis.forEach(k=>{
            doc.text(k[0], margin, y);
            doc.text(k[1], pageW-180, y);
            doc.text(k[2], pageW-margin-40, y, {align:"right"});
            y += 12;
            if(y > 740){ doc.addPage(); y = 50; }
        });
        y += 10;
        doc.setFontSize(12);
        doc.text("Key Metrics Table (Illustrative)", margin, y);
        y += 14;
        doc.setFontSize(10);
        const rows = [
            ["Metric","Value","Note"],
            ["Processed Applications","1,248","Demo dataset"],
            ["Pending Applications","186","Demo dataset"],
            ["Compliance Pending","72","Demo dataset"],
            ["Overdue Actions","18","Demo dataset"],
            ["Avg. Processing Time","18.4 Days","Demo dataset"]
        ];
        rows.forEach(r=>{
            doc.text(r[0], margin, y);
            doc.text(r[1], margin+200, y);
            doc.text(r[2], margin+320, y);
            y += 12;
            if(y > 740){ doc.addPage(); y = 50; }
        });
        y += 20;
        doc.setFontSize(8);
        doc.text("Generated: " + rptFmtDate(RPT_DEMO_TODAY) + " | PRAVAAH (Demo) | Page " + doc.internal.getNumberOfPages(), margin, pageW > 400 ? 820 : 780);
        const fname = "PRAVAAH_" + lib.name.replace(/[^A-Za-z0-9]+/g,"_") + "_" + rptGenFileDate(RPT_DEMO_TODAY) + ".pdf";
        doc.save(fname);
        if(!lib.generated) lib.generated = rptFmtDate(RPT_DEMO_TODAY);
        rptShowToast("PDF downloaded (illustrative).");
        rptExporting = false;
        rptRenderLibrary();
    } catch(e){
        console.error(e);
        rptShowToast("PDF generation failed.", "error");
        rptExporting = false;
    }
}

function rptDownloadPPTX(lib){
    if(rptExporting) { rptShowToast("Export in progress, please wait.", "error"); return; }
    rptExporting = true;
    try {
        if(typeof PptxGenJS === "undefined"){
            rptShowToast("PPTX library not available. Please refresh.", "error");
            rptExporting = false;
            return;
        }
        let pptx = new PptxGenJS();
        pptx.layout = "LAYOUT_WIDE";
        pptx.author = "PRAVAAH (Demo)";
        pptx.company = "PRAVAAH Demo";
        pptx.subject = "PRAVAAH Report";
        pptx.title = lib.name;

        // Slide 1
        let slide1 = pptx.addSlide();
        slide1.addText("PRAVAAH", { x:0.5, y:0.5, w:9, h:0.6, fontSize:32, bold:true, color:"0B1F44" });
        slide1.addText(lib.name, { x:0.5, y:1.2, w:9, h:0.8, fontSize:28, bold:true });
        slide1.addText("DEMONSTRATION REPORT � ILLUSTRATIVE DATA", { x:0.5, y:2.1, w:9, h:0.4, fontSize:14, color:"B45309" });
        slide1.addText("Reporting Period: " + (document.getElementById("rptPeriodSel")?.value || "Last 30 Days (Demo)"), { x:0.5, y:2.7, w:9, h:0.3, fontSize:12 });
        slide1.addText("All data is fictional/demo. Not an official AICTE report.", { x:0.5, y:4.8, w:9, h:0.3, fontSize:10, color:"64748B" });

        // Slide 2
        let slide2 = pptx.addSlide();
        slide2.addText("Executive Summary", { x:0.5, y:0.4, w:9, h:0.6, fontSize:24, bold:true, color:"0B1F44" });
        slide2.addTable([
            ["Metric", "Value", "Trend/Note"],
            ["Total Applications Processed", "1,248", "+5.2% (Illustrative)"],
            ["Currently Pending", "186", "-3.8% (Illustrative)"],
            ["Avg. Processing Time", "18.4 Days", "-1.7 days (Illustrative)"],
            ["Compliance Reviews Pending", "72", "+6.0% (Illustrative)"],
            ["Overdue Workflow Actions", "18", "-12.0% (Illustrative)"]
        ], { x:0.5, y:1.2, w:9, h:2.8, border:{pt:1, color:"E2E8F0"}, fill:{color:"F8FAFC"}, fontSize:12 });

        // Slide 3
        let slide3 = pptx.addSlide();
        slide3.addText("Application Processing Overview", { x:0.5, y:0.4, w:9, h:0.6, fontSize:24, bold:true, color:"0B1F44" });
        slide3.addTable([
            ["Stage", "Count"],
            ["Application Submitted", "126"],
            ["Initial Scrutiny", "324"],
            ["Document Review", "278"],
            ["Compliance Review", "186"],
            ["Awaiting Final Decision", "94"],
            ["Completed", "518"]
        ], { x:0.5, y:1.2, w:4.2, h:3.0, border:{pt:1,color:"E2E8F0"}, fontSize:11 });
        slide3.addText("(Illustrative demo data)", { x:0.5, y:4.4, w:4, h:0.3, fontSize:9, color:"64748B" });

        // Slide 4
        let slide4 = pptx.addSlide();
        slide4.addText("Workflow Pendency", { x:0.5, y:0.4, w:9, h:0.6, fontSize:24, bold:true, color:"0B1F44" });
        slide4.addTable([
            ["Stage", "Pending"],
            ["Initial Scrutiny", "324"],
            ["Document Review", "278"],
            ["Compliance Review", "186"],
            ["Awaiting Final Decision", "94"],
            ["Application Submitted", "42"]
        ], { x:0.5, y:1.2, w:4.2, h:2.6, border:{pt:1,color:"E2E8F0"}, fontSize:11 });
        slide4.addText("(Illustrative demo data)", { x:0.5, y:4.0, w:4, h:0.3, fontSize:9, color:"64748B" });

        // Slide 5
        let slide5 = pptx.addSlide();
        slide5.addText("Compliance Obligations", { x:0.5, y:0.4, w:9, h:0.6, fontSize:24, bold:true, color:"0B1F44" });
        slide5.addTable([
            ["Category", "Count"],
            ["Marked Complete (Demo)", "371"],
            ["Awaiting Review", "72"],
            ["Requiring Attention", "24"],
            ["Upcoming Deadlines", "19"],
            ["Overdue Actions", "12"]
        ], { x:0.5, y:1.2, w:4.5, h:2.8, border:{pt:1,color:"E2E8F0"}, fontSize:11 });
        slide5.addText("(Illustrative demo data)", { x:0.5, y:4.2, w:4, h:0.3, fontSize:9, color:"64748B" });

        // Slide 6
        let slide6 = pptx.addSlide();
        slide6.addText("Deadline & Alerts Overview", { x:0.5, y:0.4, w:9, h:0.6, fontSize:24, bold:true, color:"0B1F44" });
        slide6.addTable([
            ["Month", "Upcoming", "Overdue"],
            ["Jun", "14", "9"],
            ["Jul", "16", "11"],
            ["Aug", "18", "12"],
            ["Sep", "19", "13"],
            ["Oct", "22", "12"]
        ], { x:0.5, y:1.2, w:4.5, h:2.6, border:{pt:1,color:"E2E8F0"}, fontSize:11 });
        slide6.addText("(Illustrative demo data)", { x:0.5, y:4.0, w:4, h:0.3, fontSize:9, color:"64748B" });

        // Slide 7
        let slide7 = pptx.addSlide();
        slide7.addText("Institution-wise Summary (Demo)", { x:0.5, y:0.4, w:9, h:0.6, fontSize:24, bold:true, color:"0B1F44" });
        slide7.addTable([
            ["Institution", "Total", "Pending", "Completed"],
            ["Western Institute of Technology", "248", "38", "210"],
            ["Deccan College of Engineering", "214", "32", "182"],
            ["National Technical Institute", "198", "28", "170"],
            ["Sahyadri Institute of Technology", "186", "26", "160"],
            ["Central Institute of Engineering", "164", "24", "140"]
        ], { x:0.5, y:1.2, w:9, h:2.8, border:{pt:1,color:"E2E8F0"}, fontSize:10 });
        slide7.addText("(Illustrative demo data)", { x:0.5, y:4.2, w:4, h:0.3, fontSize:9, color:"64748B" });

        // Slide 8
        let slide8 = pptx.addSlide();
        slide8.addText("Methodology & Demonstration Data Disclaimer", { x:0.5, y:0.4, w:9, h:0.8, fontSize:22, bold:true, color:"0B1F44" });
        slide8.addText([
            { text: "This presentation is generated from the PRAVAAH frontend demonstration dataset only. ", options:{ fontSize:14 } },
            { text: "All records, figures, institutions, and statuses are fictional and labelled as illustrative. ", options:{ fontSize:14 } },
            { text: "PRAVAAH is not officially integrated with AICTE. No backend services were used for this export. ", options:{ fontSize:14 } },
            { text: "This content is intended for UI demonstration and evaluation purposes only.", options:{ fontSize:14 } }
        ], { x:0.5, y:1.4, w:9, h:2.8, bullet:true, fontSize:14 });

        const fname = "PRAVAAH_" + lib.name.replace(/[^A-Za-z0-9]+/g,"_") + "_" + rptGenFileDate(RPT_DEMO_TODAY) + ".pptx";
        pptx.writeFile({ fileName: fname });
        if(!lib.generated) lib.generated = rptFmtDate(RPT_DEMO_TODAY);
        rptShowToast("PPTX downloaded (illustrative, editable).");
        rptExporting = false;
        rptRenderLibrary();
    } catch(e){
        console.error(e);
        rptShowToast("PPTX generation failed.", "error");
        rptExporting = false;
    }
}

document.addEventListener("DOMContentLoaded", function(){
    rptRenderKpi();
    rptRenderLibrary();
    // Wire modal close
    const close1 = document.getElementById("rptModalClose");
    const close2 = document.getElementById("rptModalCloseBtn");
    const back = document.querySelector("#rptModal .rpt-modal__backdrop");
    if(close1) close1.addEventListener("click", rptClosePreview);
    if(close2) close2.addEventListener("click", rptClosePreview);
    if(back) back.addEventListener("click", rptClosePreview);
    const dlBtn = document.getElementById("rptModalDownload");
    if(dlBtn){
        dlBtn.addEventListener("click", function(){
            const lib = rptLibrary.find(x=>x.id===rptDetailLibId);
            if(lib) rptDownloadPDF(lib); else rptDownloadPDF(rptLibrary[0]);
        });
    }
    // Clear filters
    const clear = document.getElementById("rptClearFilters");
    if(clear){
        clear.addEventListener("click", function(){
            const sels = document.querySelectorAll("#page-reports-analytics .rpt-filter-select");
            sels.forEach(s=>{ if(s.options.length>0) s.selectedIndex=0; });
            rptShowToast("Filters reset (demo).");
        });
    }
    const gen = document.getElementById("rptGenerateBtn");
    if(gen){
        gen.addEventListener("click", function(){
            rptShowToast("Report scope updated from current filters (demo).");
            rptRenderLibrary();
        });
    }
    // Filter change handlers - update filter text and re-render library
    const filterSelects = document.querySelectorAll("#page-reports-analytics .rpt-filter-select");
    filterSelects.forEach(s=>{ s.onchange=()=>{ rptShowToast("Filter updated (demo)."); rptRenderLibrary(); }; });
});

function rptRenderTrend(){
    const bars = document.getElementById("rptTrendBars");
    const legend = document.getElementById("rptTrendLegend");
    if(!bars) return;
    const set = rptTrend.find(t=>t.period===rptTrendPeriod) || rptTrend[0];
    const d = set.data;
    const max = Math.max.apply(null, d.submitted.concat(d.processed).concat([1]));
    bars.innerHTML = d.labels.map((label,i)=>{
        const sh = Math.max(3, Math.round((d.submitted[i]/max)*112));
        const ph = Math.max(3, Math.round((d.processed[i]/max)*112));
        return `<div class="rpt-bar-group" title="${rptEsc(label)}: ${d.submitted[i]} submitted, ${d.processed[i]} processed">
            <div class="rpt-bar-col">
                <div class="rpt-bar rpt-bar--submitted" style="height:${sh}px"></div>
                <div class="rpt-bar rpt-bar--processed" style="height:${ph}px"></div>
            </div>
            <span class="rpt-bar__label">${rptEsc(label)}</span>
        </div>`;
    }).join("");
    if(legend){
        legend.innerHTML = '<span class="rpt-legend-item"><span class="rpt-legend-dot"></span>Submitted</span><span class="rpt-legend-item"><span class="rpt-legend-dot rpt-legend-dot--processed"></span>Processed</span>';
    }
    document.querySelectorAll("#page-reports-analytics .rpt-trend-btn").forEach(b=>{
        const on = b.getAttribute("data-period")===rptTrendPeriod;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", on ? "true":"false");
    });
}

function rptBarRow(name, value, max, suffix){
    const pct = Math.max(2, Math.round((value/(max||1))*100));
    return `<div class="rpt-stage-row"><span class="rpt-stage-row__name">${rptEsc(name)}</span><span class="rpt-stage-row__bar"><span class="rpt-stage-row__fill" style="width:${pct}%"></span></span><span class="rpt-stage-row__val">${rptFormatNum(value)}${suffix||""}</span></div>`;
}

function rptRenderStage(){
    const host = document.getElementById("rptStageList");
    if(!host) return;
    const max = Math.max.apply(null, rptStage.map(s=>s.count).concat([1]));
    host.innerHTML = rptStage.map(s=>rptBarRow(s.stage, s.count, max)).join("");
}

function rptRenderPendency(){
    const host = document.getElementById("rptPendencyList");
    if(!host) return;
    const max = Math.max.apply(null, rptPendency.map(s=>s.pending).concat([1]));
    host.innerHTML = rptPendency.map(s=>rptBarRow(s.stage, s.pending, max)).join("");
}

function rptRenderTime(){
    const host = document.getElementById("rptTimeList");
    if(!host) return;
    const max = Math.max.apply(null, rptTime.map(s=>s.days).concat([1]));
    host.innerHTML = rptTime.map(s=>rptBarRow(s.stage, s.days, max, " d")).join("");
}

function rptRenderAge(){
    const host = document.getElementById("rptAgeList");
    if(!host) return;
    const max = Math.max.apply(null, rptAge.map(s=>s.count).concat([1]));
    host.innerHTML = rptAge.map(s=>rptBarRow(s.label, s.count, max)).join("");
}

function rptRenderCompliance(){
    const host = document.getElementById("rptComplianceList");
    if(!host) return;
    host.innerHTML = rptCompliance.map(s=>`<div class="rpt-stat-row"><span class="rpt-stat-row__label">${rptEsc(s.label)}</span><span class="rpt-stat-row__value">${rptFormatNum(s.value)}</span></div>`).join("");
}

function rptRenderDeadline(){
    const host = document.getElementById("rptDeadlineTrend");
    const legend = document.getElementById("rptDeadlineLegend");
    if(!host) return;
    const max = Math.max.apply(null, rptDeadlineTrend.map(s=>Math.max(s.upcoming, s.overdue)).concat([1]));
    host.innerHTML = '<div class="rpt-trend-bars rpt-trend-bars--deadline">' + rptDeadlineTrend.map(s=>{
        const uh = Math.max(3, Math.round((s.upcoming/max)*112));
        const oh = Math.max(3, Math.round((s.overdue/max)*112));
        return `<div class="rpt-bar-group" title="${s.month}: ${s.upcoming} upcoming, ${s.overdue} overdue">
            <div class="rpt-bar-col">
                <div class="rpt-bar rpt-bar--upcoming" style="height:${uh}px"></div>
                <div class="rpt-bar rpt-bar--overdue" style="height:${oh}px"></div>
            </div>
            <span class="rpt-bar__label">${s.month}</span>
        </div>`;
    }).join("") + "</div>";
    if(legend){
        legend.innerHTML = '<span class="rpt-legend-item"><span class="rpt-legend-dot"></span>Upcoming</span><span class="rpt-legend-item"><span class="rpt-legend-dot rpt-legend-dot--overdue"></span>Overdue</span>';
    }
}

function rptParseDate(str){
    const parts = String(str).trim().split(/\s+/);
    if(parts.length < 3) return 0;
    const mi = RPT_MONTHS.indexOf(parts[1]);
    const d = new Date(Number(parts[2]), mi < 0 ? 0 : mi, Number(parts[0]));
    return d.getTime() || 0;
}

function rptGetInstSorted(){
    const list = rptInstitutions.slice();
    const s = rptInstSort;
    list.sort((a,b)=>{
        if(s==="name-asc") return a.name.localeCompare(b.name);
        if(s==="name-desc") return b.name.localeCompare(a.name);
        if(s==="total-desc") return b.total - a.total;
        if(s==="pending-desc") return b.pending - a.pending;
        if(s==="completed-desc") return b.completed - a.completed;
        if(s==="compliance-desc") return b.compliance - a.compliance;
        if(s==="oldest-asc") return rptParseDate(a.oldest) - rptParseDate(b.oldest);
        return 0;
    });
    return list;
}

function rptRenderInst(){
    const body = document.getElementById("rptInstBody");
    if(!body) return;
    const all = rptGetInstSorted();
    const per = Math.max(1, Number(rptInstPerPage) || 5);
    const pages = Math.max(1, Math.ceil(all.length / per));
    if(rptInstPage > pages) rptInstPage = pages;
    if(rptInstPage < 1) rptInstPage = 1;
    const start = (rptInstPage - 1) * per;
    const rows = all.slice(start, start + per);
    body.innerHTML = rows.map(inst=>`<tr data-inst="${rptEsc(inst.id)}" tabindex="0" role="button" aria-label="Open ${rptEsc(inst.name)} summary">
        <td><span class="rpt-inst-name">${rptEsc(inst.name)}</span><span class="rpt-inst-id">${rptEsc(inst.id)}</span></td>
        <td>${rptFormatNum(inst.total)}</td>
        <td>${rptFormatNum(inst.pending)}</td>
        <td>${rptFormatNum(inst.completed)}</td>
        <td>${rptFormatNum(inst.compliance)}</td>
        <td>${rptEsc(inst.oldest)}</td>
        <td><span class="rpt-status-chip">${rptEsc(inst.status)}</span></td>
    </tr>`).join("") || '<tr><td colspan="7">No institutions to display.</td></tr>';
    const info = document.getElementById("rptInstPageInfo");
    if(info) info.textContent = "Page " + rptInstPage + " of " + pages + " (Demo)";
    const prev = document.getElementById("rptInstPrev");
    if(prev) prev.disabled = rptInstPage <= 1;
    const next = document.getElementById("rptInstNext");
    if(next) next.disabled = rptInstPage >= pages;
}

function rptOpenInstDrawer(id){
    const inst = rptInstitutions.find(x=>x.id===id);
    if(!inst) return;
    const set = (elId,val)=>{ const el=document.getElementById(elId); if(el) el.textContent = val; };
    set("rptInstDrawerTitle", inst.name);
    set("rptInstDrawerId", "ID: " + inst.id);
    set("rptInstDrawerTotal", rptFormatNum(inst.total));
    set("rptInstDrawerPending", rptFormatNum(inst.pending));
    set("rptInstDrawerCompleted", rptFormatNum(inst.completed));
    set("rptInstDrawerCompliance", rptFormatNum(inst.compliance));
    set("rptInstDrawerOldest", inst.oldest);
    set("rptInstDrawerStatus", inst.status);
    const d = document.getElementById("rptInstDrawer");
    if(d){ d.classList.add("active"); d.setAttribute("aria-hidden","false"); }
}

function rptCloseInstDrawer(){
    const d = document.getElementById("rptInstDrawer");
    if(d){ d.classList.remove("active"); d.setAttribute("aria-hidden","true"); }
}

function rptInitAnalytics(){
    rptRenderTrend();
    rptRenderStage();
    rptRenderPendency();
    rptRenderTime();
    rptRenderAge();
    rptRenderCompliance();
    rptRenderDeadline();
    rptRenderInst();

    document.querySelectorAll("#page-reports-analytics .rpt-trend-btn").forEach(b=>{
        b.addEventListener("click", function(){
            rptTrendPeriod = b.getAttribute("data-period") || "Day";
            rptRenderTrend();
        });
    });

    const sort = document.getElementById("rptInstSort");
    if(sort) sort.addEventListener("change", function(){ rptInstSort = sort.value; rptInstPage = 1; rptRenderInst(); });
    const per = document.getElementById("rptInstPerPage");
    if(per) per.addEventListener("change", function(){ rptInstPerPage = Number(per.value) || 5; rptInstPage = 1; rptRenderInst(); });
    const prev = document.getElementById("rptInstPrev");
    if(prev) prev.addEventListener("click", function(){ if(rptInstPage > 1){ rptInstPage--; rptRenderInst(); } });
    const next = document.getElementById("rptInstNext");
    if(next) next.addEventListener("click", function(){ rptInstPage++; rptRenderInst(); });

    const body = document.getElementById("rptInstBody");
    if(body){
        body.addEventListener("click", function(e){
            const tr = e.target.closest("tr[data-inst]");
            if(tr) rptOpenInstDrawer(tr.getAttribute("data-inst"));
        });
        body.addEventListener("keydown", function(e){
            if(e.key === "Enter" || e.key === " "){
                const tr = e.target.closest("tr[data-inst]");
                if(tr){ e.preventDefault(); rptOpenInstDrawer(tr.getAttribute("data-inst")); }
            }
        });
    }
    const dc = document.getElementById("rptInstDrawerClose");
    if(dc) dc.addEventListener("click", rptCloseInstDrawer);
    const dcb = document.getElementById("rptInstDrawerCloseBtn");
    if(dcb) dcb.addEventListener("click", rptCloseInstDrawer);
    const db = document.querySelector("#rptInstDrawer .rpt-drawer__backdrop");
    if(db) db.addEventListener("click", rptCloseInstDrawer);

    const vc = document.getElementById("rptViewCompliance");
    if(vc) vc.addEventListener("click", function(){ const n = document.querySelector('.nav__item[data-page="compliance-monitoring"]'); if(n) n.click(); });
    const vd = document.getElementById("rptViewDeadline");
    if(vd) vd.addEventListener("click", function(){ const n = document.querySelector('.nav__item[data-page="deadline-alerts"]'); if(n) n.click(); });

    const gen = document.getElementById("rptGenerateBtn");
    if(gen) gen.addEventListener("click", function(){
        rptOpenPreview({ id:"FILTERED", name:"Filtered Report Preview", desc:rptGetFiltersText(), generated:rptFmtDate(RPT_DEMO_TODAY) });
    });
}

document.addEventListener("DOMContentLoaded", rptInitAnalytics);
