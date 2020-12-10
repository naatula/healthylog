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

const getDaySummary = async(date, user_id = null) => {
  let data;
  if(user_id) {
    data = {
      sleep_duration: (await executeQuery('SELECT AVG(sleep_duration) FROM morning_reports WHERE date = $1 AND user_id = $2', date, user_id)).rows[0]?.[0],
      sleep_quality: (await executeQuery('SELECT AVG(sleep_quality) FROM morning_reports WHERE date = $1 AND user_id = $2', date, user_id)).rows[0]?.[0],
      exercise: (await executeQuery('SELECT AVG(exercise) FROM evening_reports WHERE date = $1 AND user_id = $2', date, user_id)).rows[0]?.[0],
      studying: (await executeQuery('SELECT AVG(studying) FROM evening_reports WHERE date = $1 AND user_id = $2', date, user_id)).rows[0]?.[0],
      eating: (await executeQuery('SELECT AVG(eating) FROM evening_reports WHERE date = $1 AND user_id = $2', date, user_id)).rows[0]?.[0],
      mood: await getAvgMood(date, user_id)
    }
  } else {
    data = {
      sleep_duration: (await executeQuery('SELECT AVG(sleep_duration) FROM morning_reports WHERE date = $1', date)).rows[0]?.[0],
      sleep_quality: (await executeQuery('SELECT AVG(sleep_quality) FROM morning_reports WHERE date = $1', date)).rows[0]?.[0],
      exercise: (await executeQuery('SELECT AVG(exercise) FROM evening_reports WHERE date = $1', date)).rows[0]?.[0],
      studying: (await executeQuery('SELECT AVG(studying) FROM evening_reports WHERE date = $1', date)).rows[0]?.[0],
      eating: (await executeQuery('SELECT AVG(eating) FROM evening_reports WHERE date = $1', date)).rows[0]?.[0],
      mood: await getAvgMood(date)
    }
  }

  return data;
}

const getWeekSummary = async(date, user_id = null) => {
  const ref = new Date(date)
  const day = ref.getDay()
  const firstDay = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() + (day == 0?-6:1)-day )
  const lastDay = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() + (day == 0?0:7)-day )

  console.log(firstDay, lastDay)

  let data;
  if(user_id) {
    data = {
      sleep_duration: (await executeQuery('SELECT AVG(sleep_duration) FROM morning_reports WHERE date BETWEEN $1 AND $2 AND user_id = $3', firstDay, lastDay, user_id)).rows[0]?.[0],
      sleep_quality: (await executeQuery('SELECT AVG(sleep_quality) FROM morning_reports WHERE date BETWEEN $1 AND $2 AND user_id = $3', firstDay, lastDay, user_id)).rows[0]?.[0],
      exercise: (await executeQuery('SELECT AVG(exercise) FROM evening_reports WHERE date BETWEEN $1 AND $2 AND user_id = $3', firstDay, lastDay, user_id)).rows[0]?.[0],
      studying: (await executeQuery('SELECT AVG(studying) FROM evening_reports WHERE date BETWEEN $1 AND $2 AND user_id = $3', firstDay, lastDay, user_id)).rows[0]?.[0],
      eating: (await executeQuery('SELECT AVG(eating) FROM evening_reports WHERE date BETWEEN $1 AND $2 AND user_id = $3', firstDay, lastDay, user_id)).rows[0]?.[0],
      mood: (await executeQuery('SELECT AVG(mood) FROM (SELECT mood FROM morning_reports WHERE DATE BETWEEN $1 AND $2 AND user_id = $3 UNION ALL SELECT mood FROM evening_reports WHERE DATE BETWEEN $1 AND $2 AND user_id = $3) AS t', firstDay, lastDay, user_id)).rows[0]?.[0]
    }
  } else {
    data = {
      sleep_duration: (await executeQuery('SELECT AVG(sleep_duration) FROM morning_reports WHERE date BETWEEN $1 AND $2', firstDay, lastDay)).rows[0]?.[0],
      sleep_quality: (await executeQuery('SELECT AVG(sleep_quality) FROM morning_reports WHERE date BETWEEN $1 AND $2', firstDay, lastDay)).rows[0]?.[0],
      exercise: (await executeQuery('SELECT AVG(exercise) FROM evening_reports WHERE date BETWEEN $1 AND $2', firstDay, lastDay)).rows[0]?.[0],
      studying: (await executeQuery('SELECT AVG(studying) FROM evening_reports WHERE date BETWEEN $1 AND $2', firstDay, lastDay)).rows[0]?.[0],
      eating: (await executeQuery('SELECT AVG(eating) FROM evening_reports WHERE date BETWEEN $1 AND $2', firstDay, lastDay)).rows[0]?.[0],
      mood: (await executeQuery('SELECT AVG(mood) FROM (SELECT mood FROM morning_reports WHERE DATE BETWEEN $1 AND $2 UNION ALL SELECT mood FROM evening_reports WHERE DATE BETWEEN $1 AND $2) AS t', firstDay, lastDay)).rows[0]?.[0]
    }
  }

  return data;
}

const getMonthSummary = async(date, user_id = null) => {
  console.log(date)
  const ref = new Date(date);
  const firstDay = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const lastDay = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
  
  let data;
  if(user_id) {
    data = {
      sleep_duration: (await executeQuery('SELECT AVG(sleep_duration) FROM morning_reports WHERE date BETWEEN $1 AND $2 AND user_id = $3', firstDay, lastDay, user_id)).rows[0]?.[0],
      sleep_quality: (await executeQuery('SELECT AVG(sleep_quality) FROM morning_reports WHERE date BETWEEN $1 AND $2 AND user_id = $3', firstDay, lastDay, user_id)).rows[0]?.[0],
      exercise: (await executeQuery('SELECT AVG(exercise) FROM evening_reports WHERE date BETWEEN $1 AND $2 AND user_id = $3', firstDay, lastDay, user_id)).rows[0]?.[0],
      studying: (await executeQuery('SELECT AVG(studying) FROM evening_reports WHERE date BETWEEN $1 AND $2 AND user_id = $3', firstDay, lastDay, user_id)).rows[0]?.[0],
      eating: (await executeQuery('SELECT AVG(eating) FROM evening_reports WHERE date BETWEEN $1 AND $2 AND user_id = $3', firstDay, lastDay, user_id)).rows[0]?.[0],
      mood: (await executeQuery('SELECT AVG(mood) FROM (SELECT mood FROM morning_reports WHERE DATE BETWEEN $1 AND $2 AND user_id = $3 UNION ALL SELECT mood FROM evening_reports WHERE DATE BETWEEN $1 AND $2 AND user_id = $3) AS t', firstDay, lastDay, user_id)).rows[0]?.[0]
    }
  } else {
    data = {
      sleep_duration: (await executeQuery('SELECT AVG(sleep_duration) FROM morning_reports WHERE date BETWEEN $1 AND $2', firstDay, lastDay)).rows[0]?.[0],
      sleep_quality: (await executeQuery('SELECT AVG(sleep_quality) FROM morning_reports WHERE date BETWEEN $1 AND $2', firstDay, lastDay)).rows[0]?.[0],
      exercise: (await executeQuery('SELECT AVG(exercise) FROM evening_reports WHERE date BETWEEN $1 AND $2', firstDay, lastDay)).rows[0]?.[0],
      studying: (await executeQuery('SELECT AVG(studying) FROM evening_reports WHERE date BETWEEN $1 AND $2', firstDay, lastDay)).rows[0]?.[0],
      eating: (await executeQuery('SELECT AVG(eating) FROM evening_reports WHERE date BETWEEN $1 AND $2', firstDay, lastDay)).rows[0]?.[0],
      mood: (await executeQuery('SELECT AVG(mood) FROM (SELECT mood FROM morning_reports WHERE DATE BETWEEN $1 AND $2 UNION ALL SELECT mood FROM evening_reports WHERE DATE BETWEEN $1 AND $2) AS t', firstDay, lastDay)).rows[0]?.[0]
    }
  }

  return data;
}

const getAvgMood = async(date, user_id = null) => {
  var r;
  if(user_id){
    r = await executeQuery('SELECT AVG(mood) FROM (SELECT mood FROM morning_reports WHERE DATE = $1 AND user_id = $2 UNION ALL SELECT mood FROM evening_reports WHERE DATE = $1 AND user_id = $2) AS t', date, user_id)
  } else {
    r = await executeQuery('SELECT AVG(mood) FROM (SELECT mood FROM morning_reports WHERE DATE = $1 UNION ALL SELECT mood FROM evening_reports WHERE DATE = $1) AS t', date)
  }
  return r.rows[0]?.[0];
}

export { addMorning, addEvening, find, getDaySummary, getWeekSummary, getMonthSummary, getAvgMood }
