import { send } from '../deps.js';

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

var requestCount = 0;
const requestLoggingMiddleware = async({ request, session, response }, next) => {
  const start = Date.now();
  var user = await session.get('email')
  if(!user) { user = 'anonymous' }
  requestCount += 1
  const requestNumber = requestCount
  console.log(`Started #${requestNumber} ${request.method} "${request.url.pathname}" for ${ user } at ${new Date().toISOString()}`)
  await next();
  const ms = Date.now() - start;
  console.log(`Completed #${requestNumber} ${request.method} "${request.url.pathname}" with ${ response.status } in ${ms}ms`);
}

const authenticationMiddleware = async({request, response, session, params}, next) => {
  if(!['/auth', '/api', '/static'].every((a) => !request.url.pathname.startsWith(a)) || ['/', '/favicon.ico'].includes(request.url.pathname) ){
    await next();
  } else {
    const authenticated = await session.get('user')
    if(authenticated){
      await next();
    } else {
      response.redirect('/auth/login');
    }
  }
}


const serveStaticFilesMiddleware = async(context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
  
    await send(context, path, {
      root: `${Deno.cwd()}/static`,
      maxage: 86400000
    });
  
  } else {
    await next();
  }
}

export { errorMiddleware, authenticationMiddleware, requestLoggingMiddleware, serveStaticFilesMiddleware }
