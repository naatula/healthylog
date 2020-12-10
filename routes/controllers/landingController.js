import * as reportService from '../../services/reportService.js'

const index = async({response, render}) => {
  await reportService.getDaySummary('2020-12-09')
  render('index.ejs');
}

export { index }
