let chart;
let currentFilter = "all";

// PAGE SWITCH
function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");
  document.getElementById("title").innerText = page;

  if(page === "analytics"){
    load();
  }
}

// ADD ITEM
function addItem(){
  let name = document.getElementById("name").value.trim();
  let mfg = document.getElementById("mfg").value;
  let exp = document.getElementById("exp").value;
  let category = document.getElementById("category").value.trim();

  if(!name || !mfg || !exp || !category){
    showToast("Fill all fields");
    return;
  }

  let items = JSON.parse(localStorage.getItem("foods")) || [];
  items.push({name, mfg, exp, category});
  localStorage.setItem("foods", JSON.stringify(items));

  document.getElementById("name").value="";
  document.getElementById("mfg").value="";
  document.getElementById("exp").value="";
  document.getElementById("category").value="";

  load(); // Only load, notifications handled in load()
}

// FILTER
function filterItems(type){
  currentFilter = type;
  load();
}

// 🔔 BELL
function showExpiring(){
  currentFilter = "expiring";
  showPage("dashboard");
  load();
}

// LOAD
function load(){
  let items = JSON.parse(localStorage.getItem("foods")) || [];

  let list = document.getElementById("list");
  let recipes = document.getElementById("recipes");

  if(!list) return;

  list.innerHTML="";
  recipes.innerHTML="";

  let safe=0, expiring=0, expired=0;
  let safeItemsList = [];
  let expiringItemsList = [];
  let expiredItemsList = [];

  let today = new Date();
  today.setHours(0,0,0,0);

  items.forEach((i,index)=>{

    let expDate = new Date(i.exp);
    expDate.setHours(0,0,0,0);

    let diff = Math.floor((expDate - today)/(1000*60*60*24));

    let status="";

    if(diff < 0){
      status="expired";
      expired++;
      expiredItemsList.push(i.name);
    }
    else if(diff <= 3){
      status="expiring";
      expiring++;
      expiringItemsList.push(i.name);
    }
    else{
      status="safe";
      safe++;
      safeItemsList.push(i.name);
    }

    // FILTER
    if(currentFilter !== "all" && currentFilter !== status){
      return;
    }

    let daysText = "";
    if(diff > 1) daysText = `⏳ ${diff} days left`;
    else if(diff === 1) daysText = `⏳ 1 day left`;
    else if(diff === 0) daysText = `⚠️ Expiring today`;
    else daysText = `❌ ${Math.abs(diff)} days over`;

    let colorClass = status==="safe" ? "safeText" :
                     status==="expiring" ? "expiringText" :
                     "expiredText";

    let statusText = status==="safe" ? "✅ Safe" :
                     status==="expiring" ? "⚠️ Expiring" :
                     "❌ Expired";

    // Recipe only for expiring
    if(status==="expiring"){
      let link = `https://www.youtube.com/results?search_query=${i.name}+recipe`;
      recipes.innerHTML += `
      <div class="recipe-card">
        <h4>${i.name}</h4>
        <a href="${link}" target="_blank">▶️ Recipe</a>
      </div>`;
    }

    list.innerHTML += `
      <li>
        <b>${i.name}</b> (${i.category}) <br>
        📅 MFG: ${i.mfg} <br>
        ⏳ EXP: ${i.exp} <br>
        <span class="${colorClass}">${statusText} - ${daysText}</span>
        <button onclick="removeItem(${index})">❌</button>
      </li>`;
  });

  // COUNT
  document.getElementById("safe").innerText = safe;
  document.getElementById("expiring").innerText = expiring;
  document.getElementById("expired").innerText = expired;

  // CHART
  let chartCanvas = document.getElementById("chart");
  if(chartCanvas){
    loadChart(safe,expiring,expired);
  }

  // 🔔 Notifications for each status
  if(items.length === 0) return;

  expiredItemsList.forEach(name => showToast(`❌ Expired: ${name}`));
  expiringItemsList.forEach(name => showToast(`⚠️ Expiring: ${name}`));
  safeItemsList.forEach(name => showToast(`✅ Safe: ${name}`));
}

// REMOVE
function removeItem(index){
  let items = JSON.parse(localStorage.getItem("foods")) || [];
  items.splice(index,1);
  localStorage.setItem("foods", JSON.stringify(items));
  load();
}

// CHART
function loadChart(safe,expiring,expired){
  let ctx = document.getElementById("chart");

  if(chart) chart.destroy();

  chart = new Chart(ctx,{
    type:'bar',
    data:{
      labels:["Safe","Expiring","Expired"],
      datasets:[{
        data:[safe,expiring,expired]
      }]
    }
  });
}

// TOAST
function showToast(msg){
  let t = document.getElementById("toast");
  t.innerText = msg;
  t.style.display = "block";

  setTimeout(()=>{
    t.style.display = "none";
  },2500);
}

// ✅ Persistent load
load();