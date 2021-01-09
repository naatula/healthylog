import { executeQuery } from "../database/database.js";

const addMorning = async(user_id, date, sleep_duration, sleep_quality, mood) => {
  await executeQuery('DELETE FROM reports WHERE user_id = $1 AND date = $2 AND type = 1', user_id, date)
  await executeQuery('INSERT INTO reports (user_id, date, sleep_duration, sleep_quality, mood, type) VALUES ($1, $2, $3, $4, $5, 1)', user_id, date, sleep_duration, sleep_quality, mood)
  return;
}

const addEvening = async(user_id, date, exercise, studying, eating, mood) => {
  await executeQuery('DELETE FROM reports WHERE user_id = $1 AND date = $2 AND type = 2', user_id, date)
  await executeQuery('INSERT INTO reports (user_id, date, exercise, studying, eating, mood, type) VALUES ($1, $2, $3, $4, $5, $6, 2)', user_id, date, exercise, studying, eating, mood)
  return;
}

const find = async(user_id, date) => {
  date = new Date(date)
  if(isNaN(date.getTime())){
    return {};
  }
  date = date.toISOString().slice(0,10)

  const report = {}
  const m = await executeQuery('SELECT * FROM reports WHERE user_id = $1 AND date = $2 AND type = 1 LIMIT 1', user_id, date)
  const e = await executeQuery('SELECT * FROM reports WHERE user_id = $1 AND date = $2 AND type = 2 LIMIT 1', user_id, date)
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

const getDaySummary = async(date, user_id = null) => {
  date = new Date(date)
  if(isNaN(date.getTime())){
    return {};
  }
  date = date.toISOString().slice(0,10)

  let data;
  if(user_id) {
    data = (await executeQuery('SELECT AVG(sleep_duration) AS sleep_duration, AVG(sleep_quality) AS sleep_quality, AVG(exercise) AS exercise, AVG(studying) AS studying, AVG(eating) AS eating, AVG(mood) AS mood FROM reports WHERE date = $1 AND user_id = $2', date, user_id)).rowsOfObjects()[0]
  } else {
    data = (await executeQuery('SELECT AVG(sleep_duration) AS sleep_duration, AVG(sleep_quality) AS sleep_quality, AVG(exercise) AS exercise, AVG(studying) AS studying, AVG(eating) AS eating, AVG(mood) AS mood FROM reports WHERE date = $1', date)).rowsOfObjects()[0]
  }
  data.date = date

  return data;
}

const getSummaryBetween = async(firstDay, lastDay, user_id = null) => {
  firstDay = new Date(firstDay)
  lastDay = new Date(lastDay)
  if(isNaN(firstDay.getTime()) || isNaN(lastDay.getTime())){
    return {};
  }
  firstDay = firstDay.toISOString().slice(0,10)
  lastDay = lastDay.toISOString().slice(0,10)

  let data;
  if(user_id) {
    data = (await executeQuery('SELECT AVG(sleep_duration) AS sleep_duration, AVG(sleep_quality) AS sleep_quality, AVG(exercise) AS exercise, AVG(studying) AS studying, AVG(eating) AS eating, AVG(mood) AS mood FROM reports WHERE date BETWEEN $1 AND $2 AND user_id = $3', firstDay, lastDay, user_id)).rowsOfObjects()[0]
  } else {
    data = (await executeQuery('SELECT AVG(sleep_duration) AS sleep_duration, AVG(sleep_quality) AS sleep_quality, AVG(exercise) AS exercise, AVG(studying) AS studying, AVG(eating) AS eating, AVG(mood) AS mood FROM reports WHERE date BETWEEN $1 AND $2', firstDay, lastDay)).rowsOfObjects()[0]
  }
  data.dates = {from: firstDay, to: lastDay}

  return data;
}

const getAvgMood = async(date, user_id = null) => {
  date = new Date(date).toISOString().slice(0,10)
  var r;
  if(user_id){
    r = await executeQuery('SELECT AVG(mood) FROM reports WHERE DATE = $1 AND user_id = $2', date, user_id)
  } else {
    r = await executeQuery('SELECT AVG(mood) FROM reports WHERE DATE = $1', date)
  }
  return r.rows[0]?.[0];
}

export { addMorning, addEvening, find, getDaySummary, getSummaryBetween, getAvgMood }
