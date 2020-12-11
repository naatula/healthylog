import * as reportService from "../../services/reportService.js";
import * as userService from "../../services/userService.js";
import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { executeQuery } from "../../database/database.js";

const email = `${Math.random().toString(36).substr(2)}@test.example.org`
const pw = Math.random().toString(36).substr(2)
const user = await userService.add(email, pw)

Deno.test({
  name: "reportService.addMorning & reportService.addEvening create reports successfully and reportService.find finds them", 
  async fn() {
    const empty = await reportService.find(user.id, '2020-01-01')
    assertEquals(empty.morning, undefined)
    await reportService.addMorning(user.id, '2000-01-01', 3, 5, 4);
    await reportService.addEvening(user.id, '2000-01-01', 3, 6, 3, 5);
    const r = await reportService.find(user.id, '2000-01-01')
    console.log(r)
    assertEquals(r.morning.mood, 4)
    assertEquals(r.evening.mood, 5)
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "reportService.addMorning & reportService.addEvening overwrite previous reports", 
    async fn() {
    const empty = await reportService.find(user.id, '2020-01-01')
    assertEquals(empty.morning, undefined);
    await reportService.addMorning(user.id, '2000-01-01', 1, 1, 3);
    await reportService.addMorning(user.id, '2000-01-01', 3, 5, 1);
    await reportService.addEvening(user.id, '2000-01-01', 1, 1, 1, 1);
    await reportService.addEvening(user.id, '2000-01-01', 3, 6, 3, 4);
    const r = await reportService.find(user.id, '2000-01-01');
    console.log(r);
    assertEquals(r.morning.mood, 1);
    assertEquals(r.evening.mood, 4);
    const m = await executeQuery('SELECT * FROM morning_reports WHERE user_id = $1 AND date = $2', user.id, "2000-01-01");
    const e = await executeQuery('SELECT * FROM evening_reports WHERE user_id = $1 AND date = $2', user.id, "2000-01-01");
    assertEquals(m.rowCount, 1)
    assertEquals(e.rowCount, 1)
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "reportService.getDaySummary works properly", 
  async fn() {
    await reportService.addMorning(user.id, '2000-01-01', 1, 1, 4);
    await reportService.addEvening(user.id, '2000-01-01', 3, 3, 3, 3);
    const r = await reportService.getDaySummary('2000-01-01', user.id);
    console.log(r)
    assertEquals(Number(r.mood), 3.5)
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "reportService.getSummaryBetween works properly", 
  async fn() {
    await reportService.addMorning(user.id, '2000-01-01', 1, 1, 4);
    await reportService.addEvening(user.id, '2000-01-01', 3, 3, 3, 3);
    await reportService.addEvening(user.id, '2000-01-04', 3, 3, 3, 4);
    await reportService.addMorning(user.id, '2000-01-09', 1, 1, 4);
    await reportService.addEvening(user.id, '2000-01-10', 3, 3, 3, 1);
    const r = await reportService.getSummaryBetween('2000-01-01', '2000-01-09', user.id);
    console.log(r)
    assertEquals(Number(r.mood), 3.75)
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "reportService.getAvgMood works properly", 
  async fn() {
    const empty = await reportService.find(user.id, '2020-01-01')
    assertEquals(empty.morning, undefined)
    await reportService.addMorning(user.id, '2000-01-01', 3, 5, 4);
    await reportService.addEvening(user.id, '2000-01-01', 3, 6, 3, 5);
    const r = await reportService.find(user.id, '2000-01-01')
    console.log(r)
    assertEquals(r.morning.mood, 4)
    assertEquals(r.evening.mood, 5)
  },
  sanitizeResources: false,
  sanitizeOps: false
});
