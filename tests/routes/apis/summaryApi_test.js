import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import app from "../../../app.js";

Deno.test({
  name: "GET /api/summary returns JSON", 
  async fn() {
      const testClient = await superoak(app);
      await testClient.get("/api/summary").expect(200).expect('Content-Type', 'application/json; charset=utf-8')
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "GET /api/summary/2020/12/31 returns JSON", 
  async fn() {
      const testClient = await superoak(app);
      await testClient.get("/api/summary/2020/01/30").expect(200).expect('Content-Type', 'application/json; charset=utf-8')
  },
  sanitizeResources: false,
  sanitizeOps: false
});
