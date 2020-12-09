import * as userService from '../../services/userService.js'

const email_pattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const form = async({response, render, session}) => {
  if(await session.get('user')){
    response.redirect('/behavior/summary')
  } else {
    render('register.ejs', { data: {} })
  }
}

const register = async({response, session, render, request}) => {
  const errors = []
  const body = request.body()
  const form = await body.value
  const email = form.get('email')
  const password = form.get('password')

  if(!email.match(email_pattern)){ errors.push('Please enter a valid email address') }
  if(password.length < 6){ errors.push('Password must be at least 6 characters long') }

  if(errors.length === 0){
    const res = await userService.add(email, password)
    console.log(res)
    if(res.success){
      await session.set('user', res.id)
      response.redirect('/behavior/summary')
      return;
    } else {
      errors.push('The email is already in use.')
    }
  }
  response.status = 400
  render('register.ejs', { data: { email: email, errors: errors } })
}

export { form, register }
