import { Router } from "../deps.js";
import * as landing from "./controllers/landingController.js"
import * as user from "./controllers/userController.js"
import * as auth from "./controllers/authController.js"
import * as behavior from "./controllers/behaviorController.js"
import * as summaryApi from "./apis/summaryApi.js"
import * as behaviorApi from "./apis/behaviorApi.js"

const router = new Router();

router
.get('/', landing.index)
.get('/auth/login', auth.form)
.post('/auth/login', auth.login)
.get('/auth/logout', auth.logout)
.post('/auth/logout', auth.logout)
.get('/auth/registration', user.form)
.post('/auth/registration', user.register)
.get('/behavior/reporting', behavior.form)
.post('/behavior/reporting', behavior.create)
.get('/behavior/summary', behavior.summary)
.get('/behavior/api/:from/:to', behaviorApi.getDataBetween) // For ajax in behavior/summary
.get('/behavior/api/:date', behaviorApi.getDataOn)
.get('/api/summary', summaryApi.lastWeek)
.get('/api/summary/:year/:month/:day', summaryApi.day)

export { router };
