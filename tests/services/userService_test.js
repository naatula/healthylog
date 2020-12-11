import * as userService from "../../services/userService.js";
import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";

Deno.test({
  name: "userService.add creates a new user successfully", 
    async fn() {
    const email = `${Math.random().toString(36).substr(2)}@test.example.org`
    const user = await userService.add(email, Math.random().toString(36).substr(2))
    console.log(`Created user has id ${user.id}`)
    assertEquals(typeof(user.id), 'number');
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "userService.find returns user object iff user exists", 
    async fn() {
    const email = `${Math.random().toString(36).substr(2)}@test.example.org`;
    const user = await userService.add(email, Math.random().toString(36).substr(2));
    const res = await userService.find(user.id);
    assertEquals(Object.keys(res).length === 0, false);
    const empty = await userService.find(user.id + 1);
    assertEquals(Object.keys(empty).length === 0, true);
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "userService.auth returns { success: true } with valid credentials", 
    async fn() {
    const email = `${Math.random().toString(36).substr(2)}@test.example.org`;
    const pw = Math.random().toString(36).substr(2)
    const user = await userService.add(email, pw);
    const res = await userService.auth(email, pw);
    assertEquals(res.success, true);
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "userService.auth returns { success: fail, invalidEmail: true } with non-existent email", 
    async fn() {
    const email = `${Math.random().toString(36).substr(2)}@test.example.org`;
    const pw = Math.random().toString(36).substr(2);
    const res = await userService.auth(email, pw);
    assertEquals(res.success, false);
    assertEquals(res.invalidEmail, true);
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "userService.auth returns { success: fail, invalidPassword: true } with invalid password", 
    async fn() {
    const email = `${Math.random().toString(36).substr(2)}@test.example.org`;
    const pw = Math.random().toString(36).substr(2);
    const user = await userService.add(email, pw);
    const res = await userService.auth(email, Math.random().toString(36).substr(2));
    assertEquals(res.success, false);
    assertEquals(res.invalidPassword, true);
  },
  sanitizeResources: false,
  sanitizeOps: false
});
