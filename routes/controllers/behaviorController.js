import * as reportService from '../../services/reportService.js'
import '../../utils/weeknumber.js';

const form = async({response, session, render}) => {
  const user = await session.get('user')
  const data = {}
  data.loggedInAs = await session.get('email')
  data.today = (new Date()).toISOString().slice(0,10)
  data.page = 'reporting'

  const report = await reportService.find(user, data.today)
  data.morning = report.morning
  data.evening = report.evening

  render('reporting.ejs', { data: data })
}

const create = async({response, render, request, session}) => {
  const data = {}
  const user = await session.get('user')
  const errors = []
  const body = request.body()
  const form = await body.value
  const type = form.get('type')
  data.today = (new Date()).toISOString().slice(0,10)
  data.loggedInAs = await session.get('email')
  data.post = type
  data.page = 'reporting'

  const oldReport = await reportService.find(user, data.today)

  if(type === 'morning'){
    data.evening = oldReport.evening
    const date = form.get('date')
    const sleep_duration = Number(form.get('sleep_duration'))
    const sleep_quality = Number(form.get('sleep_quality'))
    const mood = Number(form.get('mood'))

    if(!date.match(/\d{4}-\d{2}-\d{2}/)){ errors.push('Please choose a date') }
    if(sleep_duration > 24 || sleep_duration < 0){ errors.push('Sleep duration must be between 0 and 24 hours') }
    if(sleep_quality < 1 || sleep_quality > 5){ errors.push('Sleep quality must be between 1 and 5') }
    if(mood < 1 || mood > 5){ errors.push('Mood must be between 1 and 5') }

    if(errors.length === 0){
      await reportService.addMorning(user, date, sleep_duration, sleep_quality, mood)
      response.redirect('/behavior/summary')
      return;
    }
    data.morningDate = date
    data.morning = { sleep_duration: sleep_duration, sleep_quality: sleep_quality, mood: mood }
  }else if(type === 'evening'){
    data.morning = oldReport.morning
    const date = form.get('date')
    const exercise = Number(form.get('exercise'))
    const studying = Number(form.get('studying'))
    const eating = Number(form.get('eating'))
    const mood = Number(form.get('mood'))

    if(!date.match(/\d{4}-\d{2}-\d{2}/)){ errors.push('Please choose a date') }
    if(exercise > 24 || exercise < 0){ errors.push('Exercise duration must be between 0 and 24 hours') }
    if(studying > 24 || studying < 0){ errors.push('Studying duration must be between 0 and 24 hours') }
    if(eating < 1 || eating > 5){ errors.push('Quality of eating must be between 1 and 5') }
    if(mood < 1 || mood > 5){ errors.push('Mood must be between 1 and 5') }

    if(errors.length === 0){
      await reportService.addEvening(user, date, exercise, studying, eating, mood)
      response.redirect('/behavior/summary')
      return;
    }
    data.eveningDate = date
    data.evening = { exercise: exercise, studying: studying, eating: eating, mood: mood }
  } else {
    errors.push('Invalid time of day')
  }

  data.errors = errors
  response.status = 400
  render('reporting.ejs', { data: data })
}

const summary = async({response, session, render}) => {
  const data = {}
  data.loggedInAs = await session.get('email')
  console.log(data.loggedInAs)
  data.page = 'summary'
  const date = new Date()
  data.month = `${date.getFullYear()}-${date.getMonth() + 1}`
  data.week = `${date.getWeekYear()}-W${date.getWeek()}`

  render('summary.ejs', { data: data })
}

export { form, create, summary }
