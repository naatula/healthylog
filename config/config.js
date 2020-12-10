let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
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

export { config }; 
