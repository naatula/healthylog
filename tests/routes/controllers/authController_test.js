import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import app from "../../../app.js";
import * as userService from "../../../services/userService.js";

Deno.test({
  name: "GET /auth/login returns HTML", 
  async fn() {
      const testClient = await superoak(app);
      await testClient.get("/auth/login").expect(200).expect("Content-Type", "text/html; charset=utf-8");
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "GET /auth/logout returns HTML", 
  async fn() {
      const testClient = await superoak(app);
      await testClient.get("/auth/logout").expect(200).expect("Content-Type", "text/html; charset=utf-8");
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "POST /auth/login with invalid email returns 400", 
  async fn() {
      const testClient = await superoak(app);
      const email = `${Math.random().toString(36).substr(2)}@test.example.org`
      await testClient.post("/auth/login").send(`email=${email}&password=secretfoobar`).expect(400);
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "POST /auth/login with invalid password returns 400", 
  async fn() {
      const testClient = await superoak(app);
      const email = `${Math.random().toString(36).substr(2)}@test.example.org`
      await userService.add(email, Math.random().toString(36).substr(2))
      await testClient.post("/auth/login").send(`email=${email}&password=secretfoobar`).expect(400);
  },
  sanitizeResources: false,
  sanitizeOps: false
});
