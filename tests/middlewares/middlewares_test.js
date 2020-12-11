import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import app from "../../app.js";


Deno.test({
  name: "GET /behavior/summary returns 200 (authenticationMiddleware)", 
  async fn() {
      const testClient = await superoak(app);
      await testClient.get("/behavior/summary").expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "GET /static/file_that_does_not_exist returns 404 (staticFilesMiddleware)", 
  async fn() {
      const testClient = await superoak(app);
      await testClient.get("/static/file_that_does_not_exist").expect(404);
  },
  sanitizeResources: false,
  sanitizeOps: false
});
