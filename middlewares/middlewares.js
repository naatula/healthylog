import { send } from '../deps.js';

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const requestLoggingMiddleware = async({ request }, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${request.method} ${request.url.pathname} - TODO: USER ID - ${ms} ms`);
}

const authenticationMiddleware = async({request, response, session, params}, next) => {
  if(!['/auth', '/api'].every((a) => !request.url.pathname.startsWith(a)) || request.url.pathname === '/'){
    console.log('authenticationMiddleware: whitelist')
    await next();
  } else {
    const authenticated = await session.get('authenticated')
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
      root: `${Deno.cwd()}/static`
    });
  
  } else {
    await next();
  }
}

export { errorMiddleware, authenticationMiddleware, requestLoggingMiddleware, serveStaticFilesMiddleware }
