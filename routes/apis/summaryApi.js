import * as reportService from '../../services/reportService.js'

const week = async({response}) => {
  response.body = await reportService.getWeekSummary(Date.now() - 604800000)
}

const day = async({response, params}) => {
  const date = `${params.year}-${params.month}-${params.day}`
  response.body = await reportService.getDaySummary(date)
}

const month = async({response, params}) => {
  const date = `${params.year}-${params.month}-1`
  response.body = await reportService.getMonthSummary(date)
}

export {month, day, week }
