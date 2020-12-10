import * as reportService from '../../services/reportService.js'

const index = async({response, render, session}) => {
  const data = {}
  const yesterday = new Date(Date.now()-3600*24*1000).toISOString().slice(0,10)
  const today = new Date().toISOString().slice(0,10)
  data.loggedInAs = await session.get('email')
  data.mood = {today: await reportService.getAvgMood(today), yesterday: await reportService.getAvgMood(yesterday)}
  render('index.ejs', { data: data });
}

export { index }
