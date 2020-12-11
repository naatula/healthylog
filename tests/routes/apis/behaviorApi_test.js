import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import app from "../../../app.js";


Deno.test({
  name: "GET /behavior/api/2020-12-31 redirects to login if anonymous", 
  async fn() {
      const testClient = await superoak(app);
      await testClient.get("/behavior/api/2020-12-31").expect(200).expect("Content-Type", "text/html; charset=utf-8");
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "GET /behavior/api/2020-01-01/2020-12-31 redirects to login if anonymous", 
  async fn() {
      const testClient = await superoak(app);
      await testClient.get("/behavior/api/2020-01-01/2020-12-31").expect(200).expect("Content-Type", "text/html; charset=utf-8");
  },
  sanitizeResources: false,
  sanitizeOps: false
});
