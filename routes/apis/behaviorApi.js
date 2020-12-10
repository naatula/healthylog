import * as reportService from '../../services/reportService.js'

const getDataBetween = async({response, params, session}) => {
  const user = await session.get('user')
  response.body = await reportService.getSummaryBetween(params.from, params.to, user)
  if(Object.keys(response.body).length === 0){ response.status = 400 }
}

const getDataOn = async({response, params, session}) => {
  const user = await session.get('user')
  response.body = await reportService.getDaySummary(params.date, user)
  if(Object.keys(response.body).length === 0){ response.status = 400 }
}

export { getDataBetween, getDataOn };
