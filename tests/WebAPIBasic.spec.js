import { test, expect, request } from '@playwright/test';

let token;
let orderId;
const loginPayload = { userEmail: "vicky05naidu@gmail.com", userPassword: "Password@12345" };
const orderPayload = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
test.beforeAll(async () => {
   const apiContext = await request.newContext();
   const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
      {
         data: loginPayload
      }

   );
   await expect(loginResponse.ok()).toBeTruthy();
   const loginResponseJson = await loginResponse.json();
   token = loginResponseJson.token;


   // Order APi call
   const OrderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
      {
         data: orderPayload,
         headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
         }
      });
   const OrderResponseJson = await OrderResponse.json();
   orderId = OrderResponseJson.orders[0];

});

test('Client App login API', async ({ page }) => {

   await page.addInitScript(value => {
      window.localStorage.setItem('token', value);
   }, token);
   await page.goto("https://rahulshettyacademy.com/client", { waitUntil: 'domcontentloaded' });
   await page.locator("button[routerlink*='myorders']").click();
   await page.locator("tbody").waitFor();
   const rows =  page.locator("tbody tr");


   for (let i = 0; i < await rows.count(); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (orderId.includes(rowOrderId)) {
         await rows.nth(i).locator("button").first().click();
         break;
      }
   }
   const orderIdDetails = await page.locator(".col-text").textContent();
   expect(orderId.includes(orderIdDetails)).toBeTruthy();

});
