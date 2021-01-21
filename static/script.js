Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  var week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

Date.prototype.getWeekYear = function() {
  var date = new Date(this.getTime());
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  return date.getFullYear();
}

var cache = {}

const summaryInputs = f('input#summary-date-input')
if(summaryInputs.length === 1){
  var field = summaryInputs[0]
  var currentDay;
  var currentWeek;
  var currentMonth;

  function update(){
    const date = new Date(field.value)
    if(isNaN(date)){ return; }

    let day = date.toISOString().slice(0,10)
    if(currentDay != day){
      currentDay = day
      const title = date.toLocaleString('sv-FI')
      updateValues(day, null, 'day')
    }

    let week = getDateOfISOWeek(date.getWeek(), date.getWeekYear())
    if(currentWeek != week.valueOf()){
      currentWeek = week.valueOf()
      const from = week.toISOString().slice(0,10)
      const to = new Date(week.getTime() + 518400000).toISOString().slice(0,10)
      const title = `Week ${date.getWeek()}`
      updateValues(from, to, 'week', title)
    }

    let month = date.toISOString().slice(0,7)
    if(currentMonth != month){
      currentMonth = month
      const from = `${month}-01`
      const to = `${month}-${getDaysInMonth(date.getMonth() + 1, date.getFullYear())}`
      const title = date.toLocaleString('default', { month: 'long' })
      updateValues(from, to, 'month', title)
    }
  }

  async function updateValues(from, to, period, title = null){
    const url = to ? `/behavior/api/${from}/${to}` : `/behavior/api/${from}`
    var data = cache[url]
    if(!data){
      const res = await fetch(url)
      data = await res.json();
      cache[url] = data;
    }
  
    if(title){ f(`#title-${period}`)[0].innerText = title };
    ['mood', 'sleep_duration', 'sleep_quality', 'exercise', 'studying', 'eating'].forEach((field) => {
      element = f(`#${period}-${field}`)[0]
      if(element && data[field]){
        element.innerText = parseFloat(data[field]).toFixed(1)
      } else {
        element.innerHTML = '–'
      }
    })    
  }

  update()
  field.addEventListener('change', update)
}

var logoutButton = document.querySelector('button.btn-logout');
var logoutShown = false;
if(logoutButton){
  logoutButton.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    if(!logoutShown){
      e.preventDefault();
      logoutShown = true;
      logoutButton.classList.add('touched');
    } else {
      window.location.href = logoutButton.dataset.href
    }
  })
  logoutButton.addEventListener('click', (e) => {
    window.location.href = logoutButton.dataset.href
  })
  document.addEventListener('touchstart', (e) => {
    if(logoutShown && !e.target.closest('button.btn-logout')){
      logoutShown = false;
      logoutButton.classList.remove('touched');
    }
  })
}


function f(selector){
  return document.querySelectorAll(selector)
}

function getDateOfISOWeek(w, y) {
  var simple = new Date(Date.UTC(y, 0, 1 + (w - 1) * 7));
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

function getDaysInMonth(m, y) {
  return m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);
}
