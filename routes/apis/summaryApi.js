import * as reportService from '../../services/reportService.js'

const lastWeek = async({response}) => {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.body = await reportService.getSummaryBetween(Date.now() - 604800000, Date.now())
  if(Object.keys(response.body).length === 0){ response.status = 400 }
}

const day = async({response, params}) => {
  response.headers.set('Access-Control-Allow-Origin', '*')
  const date = `${params.year}-${params.month}-${params.day}`
  response.body = await reportService.getDaySummary(date)
  if(Object.keys(response.body).length === 0){ response.status = 400 }
}


export { day, lastWeek }
