const summaryInputs = f('#summary input')
if(summaryInputs.length === 2){
  const inputs = { "week": summaryInputs[0], "month": summaryInputs[1] }

  function updateWeek(){
    const input = inputs.week.value.split('-W')
    if(input.length != 2){ return; }
    const week = getDateOfISOWeek(input[1], input[0])
    const from = week.toISOString().slice(0,10)
    const to = new Date(week.getTime() + 518400000).toISOString().slice(0,10)
     
    updateValues(from, to, 'week')
  }

  function updateMonth(){
    const input = inputs.month.value.split('-')
    if(input.length != 2){ return; }
    const from = `${input[0]}-${input[1]}-01`
    const to = `${input[0]}-${input[1]}-${getDaysInMonth(parseInt(input[1]), parseInt(input[0]))}`

    updateValues(from, to, 'month')
  }

  async function updateValues(from, to, period){
    const url =`/behavior/api/${from}/${to}`
    const res = await fetch(url)
    const data = await res.json();

    ['mood', 'sleep_duration', 'sleep_quality', 'exercise', 'studying', 'eating'].forEach((field) => {
      element = f(`#${period}_${field}`)[0]
      if(element && data[field]){
        element.innerText = parseFloat(data[field]).toFixed(1)
      } else {
        element.innerHTML = '–'
      }
    })
    
  }

  updateWeek()
  updateMonth()

  inputs.week.addEventListener('change', updateWeek)
  inputs.month.addEventListener('change', updateMonth)
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
