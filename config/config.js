let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
  config.database = {};
} else {
  config.database = {
    hostname: '',
    database: '',
    user: '',
    password: '',
    port: 5432
  };
}

export { config }; 
