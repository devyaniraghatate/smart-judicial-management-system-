const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const initialCases = [
  {id:"SJMS-1001",title:"Property Dispute Case",type:"Civil",plaintiff:"Anita Sharma",advocate:"R. Deshmukh",filedOn:"2026-10-02",priority:"Normal",description:"Dispute regarding ownership of residential property.",status:"Hearing Scheduled"},
  {id:"SJMS-1002",title:"Consumer Complaint",type:"Consumer",plaintiff:"Rahul Patil",advocate:"S. Joshi",filedOn:"2026-10-08",priority:"High",description:"Complaint related to a consumer service issue.",status:"Pending"},
  {id:"SJMS-1003",title:"Family Matter",type:"Family",plaintiff:"Meera Kulkarni",advocate:"A. Khan",filedOn:"2026-10-12",priority:"Normal",description:"Family matter submitted for court review.",status:"Under Review"}
];
const initialHearings = [{caseId:"SJMS-1001",date:"2026-11-05",time:"11:00",room:"Courtroom 2",notes:"Initial hearing"}];
const initialUsers = [
  {name:"Demo Citizen",email:"citizen@example.com",role:"Citizen"},
  {name:"Demo Advocate",email:"advocate@example.com",role:"Advocate"},
  {name:"Demo Judge",email:"judge@example.com",role:"Judge"},
  {name:"Court Admin",email:"admin@example.com",role:"Court Administrator"}
];
function load(key, fallback){try{const value=localStorage.getItem(key);return value?JSON.parse(value):fallback}catch{return fallback}}
let cases = load("sjms_cases", initialCases);
let hearings = load("sjms_hearings", initialHearings);
let judgments = load("sjms_judgments", []);
let users = load("sjms_users", initialUsers);
let currentUser = load("sjms_user", {name:"Demo User",role:"Court Administrator"});

function saveAll(){localStorage.setItem("sjms_cases",JSON.stringify(cases));localStorage.setItem("sjms_hearings",JSON.stringify(hearings));localStorage.setItem("sjms_judgments",JSON.stringify(judgments));localStorage.setItem("sjms_users",JSON.stringify(users));}
function esc(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function prettyDate(date){if(!date)return "—";const d=new Date(date+"T00:00:00");return Number.isNaN(d.getTime())?date:d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});}
function badge(status){let cls="";if(["Judgment Recorded","Closed"].includes(status))cls="green";else if(["Hearing Scheduled","Under Review"].includes(status))cls="blue";else cls="";return `<span class="badge ${cls}">${esc(status)}</span>`;}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600);}
const pageInfo={
 dashboard:["Dashboard","A clear overview of cases and court activities."],
 "file-case":["File a Case","Submit case details for the judicial record."],
 "search-cases":["Search Cases","Find and review registered case records."],
 hearings:["Hearing Schedule","Manage dates, times, and courtroom details."],
 judgments:["Record Judgment","Save a judgment outcome for an existing case."],
 "track-status":["Track Case Status","Look up the latest available case information."],
 "manage-users":["Manage Users","View and manage demo user roles."]
};
function goPage(name){
 if(!pageInfo[name])return;
 $$(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${name}`));
 $$(".nav-item[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
 $("#pageTitle").textContent=pageInfo[name][0];$("#pageCrumb").textContent=pageInfo[name][0];$("#pageDescription").textContent=pageInfo[name][1];
 $("#sidebar").classList.remove("open");
 if(name==="dashboard")renderDashboard();
 if(name==="search-cases")renderCases();
 if(name==="hearings"){fillCaseSelects();renderHearings();}
 if(name==="judgments"){fillCaseSelects();renderJudgments();}
 if(name==="manage-users")renderUsers();
}
function renderDashboard(){
 $("#totalCases").textContent=cases.length;
 $("#pendingCases").textContent=cases.filter(c=>!["Judgment Recorded","Closed"].includes(c.status)).length;
 $("#totalHearings").textContent=hearings.length;
 $("#totalJudgments").textContent=judgments.length;
 const rows=[...cases].slice(-5).reverse();
 $("#recentCasesBody").innerHTML=rows.length?rows.map(c=>`<tr><td class="case-id">${esc(c.id)}</td><td class="case-title">${esc(c.title)}</td><td>${prettyDate(c.filedOn)}</td><td>${badge(c.status)}</td></tr>`).join(""):`<tr><td colspan="4" class="empty-row">No cases yet. File your first case.</td></tr>`;
}
function renderCases(){
 const q=($("#caseSearch")?.value||"").toLowerCase();const filter=$("#statusFilter")?.value||"";
 const filtered=cases.filter(c=>(!filter||c.status===filter)&&[c.id,c.title,c.plaintiff,c.type,c.advocate].join(" ").toLowerCase().includes(q));
 $("#caseCountPill").textContent=`${filtered.length} RECORDS`;
 $("#casesTableBody").innerHTML=filtered.length?filtered.map(c=>`<tr><td class="case-id">${esc(c.id)}</td><td class="case-title">${esc(c.title)}</td><td>${esc(c.plaintiff)}</td><td>${esc(c.type)}</td><td>${prettyDate(c.filedOn)}</td><td>${badge(c.status)}</td><td><button class="table-action" data-track="${esc(c.id)}">Track</button></td></tr>`).join(""):`<tr><td colspan="7" class="empty-row">No matching case records found.</td></tr>`;
}
function fillCaseSelects(){
 ["#hearingCaseSelect","#judgmentCaseSelect"].forEach(sel=>{const el=$(sel);const previous=el.value;el.innerHTML='<option value="">Choose a case</option>'+cases.map(c=>`<option value="${esc(c.id)}">${esc(c.id)} — ${esc(c.title)}</option>`).join("");if(cases.some(c=>c.id===previous))el.value=previous;});
}
function renderHearings(){
 $("#hearingsTableBody").innerHTML=hearings.length?[...hearings].sort((a,b)=>a.date.localeCompare(b.date)).map(h=>{const c=cases.find(x=>x.id===h.caseId);return `<tr><td class="case-id">${esc(h.caseId)}</td><td>${esc(c?.title||"Case record unavailable")}</td><td>${prettyDate(h.date)}</td><td>${esc(h.time)}</td><td>${esc(h.room||"—")}</td><td>${badge("Hearing Scheduled")}</td></tr>`}).join(""):`<tr><td colspan="6" class="empty-row">No hearings scheduled yet.</td></tr>`;
}
function renderJudgments(){
 $("#judgmentsTableBody").innerHTML=judgments.length?[...judgments].reverse().map(j=>{const c=cases.find(x=>x.id===j.caseId);return `<tr><td class="case-id">${esc(j.caseId)}</td><td>${esc(c?.title||"Case record unavailable")}</td><td>${prettyDate(j.date)}</td><td>${esc(j.outcome)}</td><td>${esc(j.judge||"—")}</td></tr>`}).join(""):`<tr><td colspan="5" class="empty-row">No judgments recorded yet.</td></tr>`;
}
function renderUsers(){
 $("#usersTableBody").innerHTML=users.map((u,i)=>`<tr><td class="case-title">${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.role)}</td><td><button class="table-action" data-remove-user="${i}">Remove</button></td></tr>`).join("");
}
function trackCase(id){
 const c=cases.find(x=>x.id.toLowerCase()===id.trim().toLowerCase());const box=$("#trackingResult");
 if(!c){box.className="tracking-result empty-state";box.innerHTML='<div class="empty-icon">!</div><b>Case not found</b><p>Check the case ID and try again.</p>';return;}
 const hearing=hearings.filter(h=>h.caseId===c.id).sort((a,b)=>a.date.localeCompare(b.date))[0];const judgment=judgments.find(j=>j.caseId===c.id);
 box.className="tracking-result";box.innerHTML=`<div class="result-grid"><div class="result-item"><small>CASE ID</small><b>${esc(c.id)}</b></div><div class="result-item"><small>CASE STATUS</small>${badge(c.status)}</div><div class="result-item"><small>CASE TITLE</small><b>${esc(c.title)}</b></div><div class="result-item"><small>CASE TYPE</small><b>${esc(c.type)}</b></div><div class="result-item"><small>PLAINTIFF</small><b>${esc(c.plaintiff)}</b></div><div class="result-item"><small>FILED ON</small><b>${prettyDate(c.filedOn)}</b></div><div class="result-item"><small>NEXT / RECORDED HEARING</small><b>${hearing?`${prettyDate(hearing.date)} at ${esc(hearing.time)}`:"No hearing recorded"}</b></div><div class="result-item"><small>JUDGMENT</small><b>${judgment?esc(judgment.outcome):"Not recorded"}</b></div><div class="result-description"><b>Case description</b><br>${esc(c.description||"No description provided.")}</div></div>`;
}
function setUserUI(){const name=currentUser?.name||"Demo User";$("#topUserName").textContent=name;$("#topUserRole").textContent=currentUser?.role||"Citizen";$("#avatar").textContent=name.trim().charAt(0).toUpperCase()||"U";$$(".admin-only").forEach(el=>el.style.display=currentUser?.role==="Court Administrator"?"flex":"none");}
$("#navigation").addEventListener("click",e=>{const b=e.target.closest("[data-page]");if(b)goPage(b.dataset.page);});
document.addEventListener("click",e=>{
 const go=e.target.closest("[data-go]");if(go)goPage(go.dataset.go);
 const track=e.target.closest("[data-track]");if(track){$("#trackCaseId").value=track.dataset.track;goPage("track-status");trackCase(track.dataset.track);}
 const remove=e.target.closest("[data-remove-user]");if(remove){users.splice(Number(remove.dataset.removeUser),1);saveAll();renderUsers();toast("User removed from demo list.");}
});
$("#caseForm").addEventListener("submit",e=>{
 e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries());
 const idNumber=Math.max(1000,...cases.map(c=>Number(c.id.split("-")[1])||1000))+1;
 cases.push({id:`SJMS-${idNumber}`,title:d.title,type:d.type,plaintiff:d.plaintiff,advocate:d.advocate,filedOn:d.filedOn,priority:d.priority,description:d.description,status:"Pending"});
 saveAll();e.currentTarget.reset();$("#filedOn").value=new Date().toISOString().slice(0,10);renderDashboard();fillCaseSelects();toast("Case filed successfully in this browser.");goPage("search-cases");
});
$("#hearingForm").addEventListener("submit",e=>{
 e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries());hearings.push(d);const c=cases.find(x=>x.id===d.caseId);if(c&&!["Judgment Recorded","Closed"].includes(c.status))c.status="Hearing Scheduled";saveAll();e.currentTarget.reset();renderHearings();renderDashboard();renderCases();toast("Hearing scheduled in demo records.");
});
$("#judgmentForm").addEventListener("submit",e=>{
 e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries());judgments.push(d);const c=cases.find(x=>x.id===d.caseId);if(c)c.status="Judgment Recorded";saveAll();e.currentTarget.reset();renderJudgments();renderDashboard();renderCases();toast("Judgment recorded in demo records.");
});
$("#trackForm").addEventListener("submit",e=>{e.preventDefault();trackCase($("#trackCaseId").value);});
$("#caseSearch").addEventListener("input",renderCases);$("#statusFilter").addEventListener("change",renderCases);
$("#userForm").addEventListener("submit",e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries());if(users.some(u=>u.email.toLowerCase()===d.email.toLowerCase())){toast("That email already exists in the demo list.");return;}users.push(d);saveAll();e.currentTarget.reset();renderUsers();toast("Demo user added.");});
$("#logoutButton").addEventListener("click",()=>{const name=prompt("Enter a demo display name:",currentUser?.name||"Demo User");if(name===null)return;const role=prompt("Enter role: Citizen, Advocate, Judge, or Court Administrator",currentUser?.role||"Citizen");if(role===null)return;const allowed=["Citizen","Advocate","Judge","Court Administrator"];currentUser={name:name.trim()||"Demo User",role:allowed.includes(role.trim())?role.trim():"Citizen"};localStorage.setItem("sjms_user",JSON.stringify(currentUser));setUserUI();goPage("dashboard");toast("Demo profile updated. This is not secure authentication.");});
$("#menuButton").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#filedOn").value=new Date().toISOString().slice(0,10);
$("#todayLabel").textContent=new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).toUpperCase();
setUserUI();renderDashboard();renderCases();fillCaseSelects();renderHearings();renderJudgments();
