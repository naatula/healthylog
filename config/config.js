let config = {};

if (Deno.env.get('DATABASE_URL')) {
  config.database = Deno.env.get('DATABASE_URL');
} else if (Deno.env.get('TEST_ENVIRONMENT')) {
  config.database = {};
} else {
  config.database = {
    // hostname: 'hostname',
    // database: 'database',
    // user: 'user',
    // password: 'password',
    // port: 5432
  };
}

config.port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  config.port = Number(lastArgument);
}

export { config }; 
