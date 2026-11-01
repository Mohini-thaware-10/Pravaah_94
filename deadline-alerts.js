"use strict";
// PRAVAAH Deadline & Alerts Centre
const DA_TODAY = new Date(2026,9,24);
const DA_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const daAlerts = [
  {id:"DA-001",title:"Document validity expires soon",category:"Compliance",priority:"High",status:"Open",appId:"APP-2026-0142",due:"2026-10-28",responsible:"Institution Liaison",description:"Sample document validity approaching deadline.",linked:"OBL-0142-001",read:false,created:"2026-10-21"},
  {id:"DA-002",title:"Undertaking submission pending",category:"Workflow",priority:"High",status:"Open",appId:"APP-2026-0187",due:"2026-10-29",responsible:"Compliance Cell",description:"Undertaking response pending.",linked:"OBL-0187-002",read:false,created:"2026-10-22"},
  {id:"DA-003",title:"Reviewer action overdue",category:"Review",priority:"Critical",status:"Open",appId:"APP-2026-0238",due:"2026-10-26",responsible:"Demo Reviewer",description:"Sample review action past due.",linked:"OBL-0238-001",read:false,created:"2026-10-20"},
  {id:"DA-004",title:"Evidence upload pending",category:"Compliance",priority:"Normal",status:"Open",appId:"APP-2026-0214",due:"2026-10-31",responsible:"Institution Liaison",description:"Illustrative evidence pending submission.",linked:"OBL-0214-001",read:true,created:"2026-10-23"},
  {id:"DA-005",title:"Site inspection readiness",category:"Workflow",priority:"Normal",status:"In Progress",appId:"APP-2026-0251",due:"2026-11-02",responsible:"Demo Officer",description:"Demo checklist review in progress.",linked:"REQ-0251-001",read:true,created:"2026-10-19"},
  {id:"DA-006",title:"Compliance closure checklist",category:"Compliance",priority:"High",status:"Open",appId:"APP-2026-0142",due:"2026-10-27",responsible:"Compliance Cell",description:"Illustrative closure items pending.",linked:"OBL-0142-002",read:false,created:"2026-10-21"},
  {id:"DA-007",title:"Scrutiny clarification provided",category:"Review",priority:"Normal",status:"Resolved",appId:"APP-2026-0187",due:"2026-10-25",responsible:"Demo Reviewer",description:"Demo clarification reviewed.",linked:"OBL-0187-001",read:true,created:"2026-10-18"}
];
let daFilter={priority:"all",status:"all",category:"all",search:""};
let daSort="due"; let daAlertDrawerId=null; let daActiveTab="all";
function daDaysDiff(due){ if(!due)return null; const d=new Date(due+"T00:00:00"); const diff=Math.ceil((d-DA_TODAY)/(1000*60*60*24)); return diff; }
function daEsc(s){ const div=document.createElement("div"); div.textContent=String(s); return div.innerHTML; }
function daToast(msg){ const t=document.getElementById("daToast"); if(!t)return; t.textContent=msg; t.classList.add("da-toast--show"); setTimeout(()=>t.classList.remove("da-toast--show"),2000); }
function daUpdateKpi(){
  const total=daAlerts.length, high=daAlerts.filter(a=>a.priority==="High"||a.priority==="Critical").length;
  let within7=0,overdue=0,resolved=0;
  daAlerts.forEach(a=>{ if(a.status==="Resolved")resolved++; const d=daDaysDiff(a.due); if(d!==null){ if(d<0)overdue++; else if(d>=0&&d<=7)within7++; }});
  const set=(id,v)=>{const el=document.getElementById(id); if(el)el.textContent=v;};
  set("daKpiTotal",total); set("daKpiHigh",high); set("daKpi7",within7); set("daKpiOverdue",overdue); set("daKpiResolved",resolved);
}
function daRenderTabs(){ const tabs=document.querySelectorAll(".da-tab"); tabs.forEach(t=>{ t.onclick=()=>{ tabs.forEach(x=>x.classList.remove("active")); t.classList.add("active"); daActiveTab=t.getAttribute("data-tab")||"all"; daRenderAlerts(); };}); }
function daRenderAlerts(){
  daUpdateKpi();
  const list=document.getElementById("daAlertList"); const count=document.getElementById("daAlertCount");
  if(!list)return;
  let items=daAlerts.slice();
  if(daActiveTab==="open") items=items.filter(a=>a.status!=="Resolved");
  if(daActiveTab==="unread") items=items.filter(a=>!a.read);
  if(daActiveTab==="high") items=items.filter(a=>a.priority==="High"||a.priority==="Critical");
  if(daActiveTab==="resolved") items=items.filter(a=>a.status==="Resolved");
  items=items.filter(a=>{
    if(daFilter.priority!=="all"&&a.priority!==daFilter.priority)return false;
    if(daFilter.status!=="all"&&a.status!==daFilter.status)return false;
    if(daFilter.category!=="all"&&a.category!==daFilter.category)return false;
    if(daFilter.search){ const s=daFilter.search.toLowerCase(); if(!(a.title.toLowerCase().includes(s)||a.appId.toLowerCase().includes(s)||a.id.toLowerCase().includes(s)||a.linked.toLowerCase().includes(s)))return false; }
    return true;
  });
  items.sort((x,y)=>{ if(daSort==="due"){ const dx=daDaysDiff(x.due),dy=daDaysDiff(y.due); const vx=dx===null?999:dx,vy=dy===null?999:dy; return vx-vy; } if(daSort==="priority"){ const pmap={"Critical":0,"High":1,"Normal":2}; return (pmap[x.priority]??9)-(pmap[y.priority]??9); } return 0; });
  if(count) count.textContent=items.length+" alerts";
  if(items.length===0){ list.innerHTML='<div class="da-empty">No alerts match current filters.</div>'; return; }
  list.innerHTML=items.map(a=>{
    const diff=daDaysDiff(a.due); let dueLabel="Due "+a.due;
    if(diff!==null){ if(diff<0) dueLabel="Overdue by "+Math.abs(diff)+" days ("+a.due+")"; else if(diff===0) dueLabel="Due today ("+a.due+")"; else if(diff===1) dueLabel="Due tomorrow ("+a.due+")"; else if(diff<=7) dueLabel="Due in "+diff+" days ("+a.due+")"; else dueLabel="Due in "+diff+" days ("+a.due+")"; }
    const prioClass=a.priority==="Critical"?"critical":a.priority==="High"?"high":"normal";
    const statClass=a.status==="Resolved"?"resolved":"open";
    const readClass=a.read?"":"da-alert--unread";
    return `<article class="da-alert ${readClass}" data-id="${a.id}"><div class="da-alert__main"><div class="da-alert__head"><span class="da-badge da-badge--prio da-badge--${prioClass}">${daEsc(a.priority)}</span><span class="da-badge da-badge--cat">${daEsc(a.category)}</span><span class="da-badge da-badge--stat da-badge--${statClass}">${daEsc(a.status)}</span>${!a.read?'<span class="da-badge da-badge--new">New</span>':''}</div><div class="da-alert__title">${daEsc(a.title)}</div><div class="da-alert__meta"><span>App: ${a.appId}</span><span>•</span><span>Linked: ${a.linked}</span><span>•</span><span>Resp: ${a.responsible}</span></div><div class="da-alert__due">${dueLabel}</div></div><div class="da-alert__actions"><button class="da-btn da-btn--ghost" data-act="view">View details</button><button class="da-btn da-btn--ghost" data-act="toggle">${a.read?"Mark unread":"Mark read"}</button><button class="da-btn da-btn--ghost" data-act="dismiss">${a.status==="Resolved"?"Reopen":"Mark resolved"}</button></div></article>`;
  }).join("");
  list.querySelectorAll(".da-alert").forEach(card=>{ card.querySelectorAll("button").forEach(btn=>{ btn.onclick=(e)=>{ e.stopPropagation(); const act=btn.getAttribute("data-act"); const id=card.getAttribute("data-id"); const a=daAlerts.find(x=>x.id===id); if(!a)return; if(act==="view")daOpenAlertDrawer(id); if(act==="toggle"){a.read=!a.read; daRenderAlerts(); daToast(a.read?"Marked as read (demo).":"Marked as unread (demo).");} if(act==="dismiss"){a.status=a.status==="Resolved"?"Open":"Resolved"; if(a.status==="Resolved")a.read=true; daRenderAlerts(); daToast(a.status==="Resolved"?"Marked as resolved (demo).":"Reopened (demo).");}}; }); });
}
function daOpenAlertDrawer(id){
  const a=daAlerts.find(x=>x.id===id); if(!a)return; daAlertDrawerId=id;
  const drawer=document.getElementById("daAlertDrawer"); const body=document.getElementById("daDrawerBody");
  const diff=daDaysDiff(a.due); let dueTxt=a.due;
  if(diff!==null){ if(diff<0) dueTxt=a.due+" ("+Math.abs(diff)+" days overdue)"; else if(diff===0) dueTxt=a.due+" (due today)"; else if(diff===1) dueTxt=a.due+" (due tomorrow)"; else dueTxt=a.due+" (due in "+diff+" days)"; }
  if(body){ body.innerHTML=`<div class="da-dsec"><div class="da-dsec__title">Alert</div><div class="da-drow"><span>ID</span><span>${daEsc(a.id)}</span></div><div class="da-drow"><span>Title</span><span>${daEsc(a.title)}</span></div><div class="da-drow"><span>Description</span><span>${daEsc(a.description)}</span></div><div class="da-drow"><span>Category/Priority/Status</span><span>${daEsc(a.category)} / ${daEsc(a.priority)} / ${daEsc(a.status)}</span></div></div><div class="da-dsec"><div class="da-dsec__title">Context</div><div class="da-drow"><span>Linked Application</span><span>${daEsc(a.appId)}</span></div><div class="da-drow"><span>Linked Item</span><span>${daEsc(a.linked)}</span></div><div class="da-drow"><span>Responsible</span><span>${daEsc(a.responsible)}</span></div><div class="da-drow"><span>Due</span><span>${daEsc(dueTxt)}</span></div><div class="da-drow"><span>Created</span><span>${daEsc(a.created)}</span></div><div class="da-drow"><span>Read</span><span>${a.read?"Yes":"No"}</span></div></div><div class="da-dsec"><div class="da-dsec__title">Timeline (demo)</div><div class="da-tl"><div class="da-tl__item"><div class="da-tl__dot"></div><div><div class="da-tl__time">${daEsc(a.created)}</div><div class="da-tl__text">Alert created (illustrative).</div></div></div><div class="da-tl__item"><div class="da-tl__dot"></div><div><div class="da-tl__time">2026-10-24</div><div class="da-tl__text">Review requested by responsible party (demo).</div></div></div></div></div><div class="da-dsec"><div class="da-dsec__title">Proposed next step (demo)</div><div class="da-next">Review linked item and evidence, update status locally. No real notifications sent.</div></div>`; }
  if(drawer){ drawer.classList.add("active"); drawer.setAttribute("aria-hidden","false"); }
}
function daCloseAlertDrawer(){ const drawer=document.getElementById("daAlertDrawer"); if(drawer){ drawer.classList.remove("active"); drawer.setAttribute("aria-hidden","true"); } }
function daRenderQueue(){
  const q=document.getElementById("daPriorityQueue"); if(!q)return;
  const items=daAlerts.filter(a=>a.status!=="Resolved").sort((x,y)=>{ const pmap={"Critical":0,"High":1,"Normal":2}; const dx=daDaysDiff(x.due),dy=daDaysDiff(y.due); const vx=dx===null?999:dx,vy=dy===null?999:dy; if((pmap[x.priority]??9)!==(pmap[y.priority]??9)) return (pmap[x.priority]??9)-(pmap[y.priority]??9); return vx-vy; }).slice(0,5);
  if(items.length===0){ q.innerHTML='<div class="da-empty">No open priority items.</div>'; return; }
  q.innerHTML=items.map(a=>{ const diff=daDaysDiff(a.due); let due=""; if(diff<0) due="Overdue"; else if(diff<=3) due="Due soon"; const prio=a.priority==="Critical"?"critical":a.priority==="High"?"high":"normal"; return `<button class="da-qitem" data-id="${a.id}"><div class="da-qitem__row"><span class="da-dot da-dot--${prio}"></span><span class="da-qitem__title">${daEsc(a.title)}</span></div><div class="da-qitem__meta">${a.appId} • ${a.linked} • ${due||a.due}</div></button>`; }).join("");
  q.querySelectorAll(".da-qitem").forEach(b=>{ b.onclick=()=>{ daOpenAlertDrawer(b.getAttribute("data-id")); }; });
}
function daRenderCalendar(){
  const cal=document.getElementById("daCalendar"); if(!cal)return;
  const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  let html=`<div class="da-cal__head"><div>Timeline (demo)</div><div>${DA_MONTHS[DA_TODAY.getMonth()]} ${DA_TODAY.getFullYear()}</div></div><div class="da-cal__grid">`;
  days.forEach(d=>html+=`<div class="da-cal__dow">${d}</div>`);
  const first=new Date(DA_TODAY.getFullYear(),DA_TODAY.getMonth(),1); const last=new Date(DA_TODAY.getFullYear(),DA_TODAY.getMonth()+1,0);
  for(let i=0;i<first.getDay();i++) html+=`<div class="da-cal__cell"></div>`;
  for(let day=1;day<=last.getDate();day++){ const has=daAlerts.some(a=>{ const ad=new Date(a.due+"T00:00:00"); return ad.getFullYear()===DA_TODAY.getFullYear()&&ad.getMonth()===DA_TODAY.getMonth()&&ad.getDate()===day&&a.status!=="Resolved"; }); const isToday=day===DA_TODAY.getDate(); html+=`<div class="da-cal__cell ${isToday?"da-cal__cell--today":""}">${day}${has?'<span class="da-cal__dot"></span>':''}</div>`; }
  html+=`</div>`; cal.innerHTML=html;
}
document.addEventListener("DOMContentLoaded", function(){
  daUpdateKpi(); daRenderTabs();
  const ps=document.getElementById("daPrioritySel"); const ss=document.getElementById("daStatusSel"); const cs=document.getElementById("daCategorySel"); const si=document.getElementById("daSearchInput"); const so=document.getElementById("daSortSel");
  if(ps) ps.onchange=()=>{daFilter.priority=ps.value; daRenderAlerts();};
  if(ss) ss.onchange=()=>{daFilter.status=ss.value; daRenderAlerts();};
  if(cs) cs.onchange=()=>{daFilter.category=cs.value; daRenderAlerts();};
  if(si) si.oninput=()=>{daFilter.search=si.value; daRenderAlerts();};
  if(so) so.onchange=()=>{daSort=so.value; daRenderAlerts();};
  const rv=document.getElementById("daReviewPriority"); if(rv) rv.onclick=()=>{ document.querySelector('.da-tab[data-tab="high"]')?.click(); daToast("Showing high priority alerts."); };
  const db=document.getElementById("daDrawerBackdrop"); const dc=document.getElementById("daDrawerClose"); const dm=document.getElementById("daDrawerMarkRead"); const daBtn=document.getElementById("daDrawerViewApp");
  if(db) db.onclick=daCloseAlertDrawer; if(dc) dc.onclick=daCloseAlertDrawer;
  if(dm) dm.onclick=()=>{ const a=daAlerts.find(x=>x.id===daAlertDrawerId); if(a){ a.read=!a.read; daRenderAlerts(); daOpenAlertDrawer(daAlertDrawerId); daToast(a.read?"Marked as read (demo).":"Marked as unread (demo)."); }};
  if(daBtn) daBtn.onclick=()=>{ const a=daAlerts.find(x=>x.id===daAlertDrawerId); if(a){ const nav=document.querySelector('.nav__item[data-page="applications"]'); if(nav)nav.click(); daCloseAlertDrawer(); daToast("Opened related application view (demo)."); }};
  document.addEventListener("keydown",e=>{ if(e.key==="Escape") daCloseAlertDrawer(); });
  daRenderAlerts(); daRenderQueue(); daRenderCalendar();
});
