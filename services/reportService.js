import { executeQuery } from "../database/database.js";

const addMorning = async(user_id, date, sleep_duration, sleep_quality, mood) => {
  await executeQuery('DELETE FROM morning_reports WHERE user_id = $1 AND date = $2', user_id, date)
  await executeQuery('INSERT INTO morning_reports (user_id, date, sleep_duration, sleep_quality, mood) VALUES ($1, $2, $3, $4, $5)', user_id, date, sleep_duration, sleep_quality, mood)
  return;
}

const addEvening = async(user_id, date, exercise, studying, eating, mood) => {
  await executeQuery('DELETE FROM evening_reports WHERE user_id = $1 AND date = $2', user_id, date)
  await executeQuery('INSERT INTO evening_reports (user_id, date, exercise, studying, eating, mood) VALUES ($1, $2, $3, $4, $5, $6)', user_id, date, exercise, studying, eating, mood)
  return;
}

const find = async(user_id, date) => {
  const report = {}
  const m = await executeQuery('SELECT * FROM morning_reports WHERE user_id = $1 AND date = $2 LIMIT 1', user_id, date)
  const e = await executeQuery('SELECT * FROM evening_reports WHERE user_id = $1 AND date = $2 LIMIT 1', user_id, date)
  const morning = m.rowsOfObjects()
  const evening = e.rowsOfObjects()
  if(morning.length > 0){
    report.morning = morning[0]
  }
  if(evening.length > 0){
    report.evening = evening[0]
  }
  return report;
}

const getWeekSummary = async(week, user_id = null) => {
  return {};
}

const getMonthSummary = async(month, user_id = null) => {
  return {};
}

const getAverageMood = async(date, user_id = null) => {
  
  return 5.0;
}

export { addMorning, addEvening, find, getWeekSummary, getMonthSummary, getAverageMood }
