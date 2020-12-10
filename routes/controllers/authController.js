import * as userService from '../../services/userService.js'

const form = async({response, session, render}) => {
  const data = {}
  data.loggedInAs = await session.get('email')
  if(await session.get('user')){
    response.redirect('/behavior/summary')
  } else {
    render('login.ejs', { data: data })
  }
}

const login = async({request, response, session, render}) => {
  const data = {}
  const errors = []
  const body = request.body()
  const form = await body.value
  const email = form.get('email')
  const password = form.get('password')
  data.loggedInAs = await session.get('email')

  const res = await userService.auth(email, password)
  if(res.success){
    await session.set('user', res.id)
    await session.set('email', res.email)
    response.redirect('/behavior/summary')
  } else {
    if(res.invalidEmail) { errors.push('The email is not registered') }
    if(res.invalidPassword) { errors.push('Incorrect password') }
    response.status = 400
    data.email = email
    data.errors = errors
    render('login.ejs', { data: data })
  }
}

const logout = async({response, session}) => {
  await session.set('user', null)
  await session.set('email', null)
  response.redirect('/')
}

export { form, login, logout }
