import { Pool } from "../deps.js";
import { config } from "../config/config.js";

const connectionPool = new Pool(config.database, 2);

const executeQuery = async(query, ...params) => {
  const client = await connectionPool.connect();
  const start = Date.now();
  try {
      return await client.query(query, ...params);
  } catch (e) {
      console.log(e);  
  } finally {
      client.release();
      const ms = Date.now() - start;
      console.log(`(${ms} ms) ${query} [${[ ...params ]}]`)
  }
  
  return null;
};

export { executeQuery };
