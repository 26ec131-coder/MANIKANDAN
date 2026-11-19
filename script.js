const ORGANS=["Kidney","Liver","Heart","Lung","Pancreas","Cornea","Skin"];
const BLOODS=["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const donors=[
 {name:"Arun Kumar",age:34,blood:"O+",organ:"Kidney",city:"Chennai",phone:"9876543210"},
 {name:"Divya Raj",age:29,blood:"B+",organ:"Liver",city:"Coimbatore",phone:"9123456780"},
 {name:"Meena S",age:41,blood:"A+",organ:"Cornea",city:"Chennai",phone:"9988776655"},
 {name:"Karthik R",age:37,blood:"AB+",organ:"Kidney",city:"Madurai",phone:"9090909090"},
 {name:"Nisha P",age:26,blood:"O-",organ:"Skin",city:"Trichy",phone:"9345612780"}];
const requests=[{id:1,name:"Sample Patient",organ:"Kidney",blood:"O+",city:"Chennai",urgency:"Urgent"}];
const $=id=>document.getElementById(id);
const opts=(el,list,first)=>{el.innerHTML=`<option value="">${first}</option>`+list.map(x=>`<option>${x}</option>`).join("")};
["dOrgan","rOrgan"].forEach(i=>opts($(i),ORGANS,"Select"));
["dBlood","rBlood"].forEach(i=>opts($(i),BLOODS,"Select"));
opts($("fOrgan"),ORGANS,"Any organ");opts($("fBlood"),BLOODS,"Any blood group");

function show(id){
  document.querySelectorAll(".view").forEach(v=>v.hidden=v.id!==id);
  document.querySelectorAll("nav [data-go]").forEach(b=>b.classList.toggle("on",b.dataset.go===id));
  if(id==="home")stats();if(id==="find")renderFind();if(id==="records")renderReq();
}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function stats(){$("sDonors").textContent=donors.length;$("sReq").textContent=requests.length;$("sOrgans").textContent=new Set(donors.map(d=>d.organ)).size}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

document.querySelectorAll("nav [data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go));

$("loginForm").onsubmit=e=>{e.preventDefault();
  const em=$("lEmail").value.trim(),pw=$("lPass").value;
  if(!/^\S+@\S+\.\S+$/.test(em)){$("lErr").textContent="Enter a valid email address.";return}
  if(pw.length<6){$("lErr").textContent="Password must be at least 6 characters.";return}
  $("lErr").textContent="";$("top").hidden=false;show("home");toast("Logged in successfully.")};
$("logout").onclick=()=>{$("top").hidden=true;show("logoutView")};
$("backLogin").onclick=()=>{$("loginForm").reset();show("login")};

$("donorForm").onsubmit=e=>{e.preventDefault();
  const d={name:$("dName").value.trim(),age:+$("dAge").value,blood:$("dBlood").value,organ:$("dOrgan").value,city:$("dCity").value.trim(),phone:$("dPhone").value.trim()};
  let m="";
  if(!/^[A-Za-z .]{3,}$/.test(d.name))m="Enter a valid name (letters only, at least 3 characters).";
  else if(!(d.age>=18&&d.age<=65))m="Age must be between 18 and 65.";
  else if(!d.blood||!d.organ)m="Select a blood group and an organ.";
  else if(!d.city)m="Enter the city.";
  else if(!/^\d{10}$/.test(d.phone))m="Contact number must be exactly 10 digits.";
  else if(!$("dConsent").checked)m="Please tick the confirmation box.";
  $("dErr").textContent=m;if(m)return;
  donors.push(d);e.target.reset();toast("Donor registered successfully.")};

function renderFind(){
  const o=$("fOrgan").value,b=$("fBlood").value,c=$("fCity").value.trim().toLowerCase();
  const r=donors.filter(d=>(!o||d.organ===o)&&(!b||d.blood===b)&&(!c||d.city.toLowerCase().includes(c)));
  $("fCount").textContent=r.length?`${r.length} donor(s) found.`:"No donors match these filters. Try removing one filter.";
  $("fBody").innerHTML=r.map(d=>`<tr><td>${esc(d.name)}</td><td>${d.age}</td><td>${d.blood}</td><td>${d.organ}</td><td>${esc(d.city)}</td><td>${esc(d.phone)}</td></tr>`).join("");
}
["fOrgan","fBlood"].forEach(i=>$(i).onchange=renderFind);$("fCity").oninput=renderFind;

$("reqForm").onsubmit=e=>{e.preventDefault();
  const r={id:requests.length+1,name:$("rName").value.trim(),organ:$("rOrgan").value,blood:$("rBlood").value,city:$("rCity").value.trim(),urgency:$("rUrgency").value};
  let m="";
  if(!/^[A-Za-z .]{3,}$/.test(r.name))m="Enter a valid patient name.";
  else if(!r.organ||!r.blood||!r.urgency)m="Select organ, blood group and urgency.";
  else if(!r.city)m="Enter the city.";
  $("rErr").textContent=m;if(m)return;
  requests.push(r);e.target.reset();toast("Request submitted successfully.");show("records")};
function renderReq(){$("rBody").innerHTML=requests.map(r=>`<tr><td>${r.id}</td><td>${esc(r.name)}</td><td>${r.organ}</td><td>${r.blood}</td><td>${esc(r.city)}</td><td>${r.urgency}</td></tr>`).join("")}

show("login");
