import { executeQuery } from "../database/database.js";
import { bcrypt } from "../deps.js";

const add = async(email, password) => {
  const emailAvailable = (await executeQuery('SELECT 1 FROM users WHERE email = $1', email)).rowCount === 0
  if(emailAvailable){
    const hash = await bcrypt.hash(password)
    const r = await executeQuery('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email', email.toLowerCase(), hash)
    const userId = r.rows[0][0]
    const savedEmail = r.rows[0][1]
    return { success: true, id: userId, email: savedEmail };
  } else {
    return { success: false };
  }
}

const find = async(value, column = 'id') => {
  const r = await executeQuery(`SELECT (id, email) FROM users WHERE ${column} = $1 LIMIT 1`, value)
  const rows = r.rowsOfObjects()
  if(rows.length > 0){
    const user = rows[0]
    return user;
  } else {
    return {};
  }
}

const auth = async(email, password)  => {
  const r = await executeQuery('SELECT * FROM USERS WHERE email = $1 LIMIT 1', email.toLowerCase())
  const rows = r.rowsOfObjects()
  if(rows.length > 0){
    const user = rows[0]
    const pass = await bcrypt.compare(password, user.password)
    if(pass){
      return { success: true, id: user.id, email: user.email }
    } else {
      return { success: false, invalidPassword: true }
    }
  }
  return { success: false, invalidEmail: true }
}

export { add, find, auth }
