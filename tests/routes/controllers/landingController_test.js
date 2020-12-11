import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import app from "../../../app.js";


Deno.test({
  name: "GET / returns HTML", 
  async fn() {
      const testClient = await superoak(app);
      await testClient.get("/").expect(200).expect("Content-Type", "text/html; charset=utf-8");
  },
  sanitizeResources: false,
  sanitizeOps: false
});
