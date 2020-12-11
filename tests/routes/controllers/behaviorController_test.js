import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import app from "../../../app.js";
import * as userService from "../../../services/userService.js";

Deno.test({
  name: "GET /behavior/summary returns HTML", 
  async fn() {
      const testClient = await superoak(app);
      await testClient.get("/behavior/summary").expect(200).expect("Content-Type", "text/html; charset=utf-8");
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "GET /behavior/reporting returns HTML", 
  async fn() {
      const testClient = await superoak(app);
      await testClient.get("/behavior/reporting").expect(200).expect("Content-Type", "text/html; charset=utf-8");
  },
  sanitizeResources: false,
  sanitizeOps: false
});
