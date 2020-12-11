import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import app from "../../../app.js";
import * as userService from "../../../services/userService.js";

Deno.test({
  name: "GET /auth/registration returns HTML", 
  async fn() {
      const testClient = await superoak(app);
      await testClient.get("/auth/registration").expect(200).expect("Content-Type", "text/html; charset=utf-8");
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "POST /auth/registration with password shorter than 6 returns 400", 
  async fn() {
      const testClient = await superoak(app);
      const email = `${Math.random().toString(36).substr(2)}@test.example.org`
      await testClient.post("/auth/registration").send(`email=${email}&password=12345`).expect(400);
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "POST /auth/registration with invalid email returns 400", 
  async fn() {
      const testClient = await superoak(app);
      const email = `${Math.random().toString(36).substr(2)}@example`
      const pw = Math.random().toString(36).substr(2)
      await testClient.post("/auth/registration").send(`email=${email}&password=${pw}`).expect(400);
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "POST /auth/registration duplicate email returns 400", 
  async fn() {
      const testClient = await superoak(app);
      const email = `${Math.random().toString(36).substr(2)}@test.example.org`
      await userService.add(email, Math.random().toString(36).substr(2));
      const pw = Math.random().toString(36).substr(2)
      await testClient.post("/auth/registration").send(`email=${email}&password=${pw}`).expect(400);
  },
  sanitizeResources: false,
  sanitizeOps: false
});
