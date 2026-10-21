import { test, expect, request } from '@playwright/test';
const { APIUtils } = require('./Utils/APIUtils');

let token;
let orderId;
const loginPayload = { userEmail: "vicky05naidu@gmail.com", userPassword: "Password@12345" };
const orderPayload = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
test.beforeAll(async () => {
    // Create the order through the API before validating it in the browser.
    const apiContext = await request.newContext();
    const apiutils = new APIUtils(apiContext, loginPayload);
    token = await apiutils.gettoken();
    console.log("TOKEN = ", token);
    orderId = await apiutils.createOrder(orderPayload);
    console.log("ORDER ID = ", orderId);

});

test('@Web Client App login', async ({ page }) => {
    // Seed the authenticated API token so the client opens as a logged-in user.
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);
    await page.goto("https://rahulshettyacademy.com/client");
    console.log("Current URL:", page.url());
    console.log("Browser Token:", await page.evaluate(() => localStorage.getItem('token')));
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = page.locator("tbody tr");

    // Open the details for the order that was created in the setup step.
    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    // Confirm the order details page shows the expected order ID.
    expect(orderId.includes(orderIdDetails)).toBeTruthy();

});
