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

// test('Client App login API', async ({ page }) => {

//    page.addInitScript(value => {
//       window.localStorage.setItem('token', value);
//    }, token);
//    await page.goto("https://rahulshettyacademy.com/client", { waitUntil: 'domcontentloaded' });
//    await page.locator("button[routerlink*='myorders']").click();
//    await page.locator("tbody").waitFor();
//    const rows = await page.locator("tbody tr");


//    for (let i = 0; i < await rows.count(); ++i) {
//       const rowOrderId = await rows.nth(i).locator("th").textContent();
//       if (orderId.includes(rowOrderId)) {
//          await rows.nth(i).locator("button").first().click();
//          break;
//       }
//    }
//    const orderIdDetails = await page.locator(".col-text").textContent();
//    expect(orderId.includes(orderIdDetails)).toBeTruthy();

// });

test('Client App login API', async ({ page }) => {

   await page.addInitScript(value => {
      window.localStorage.setItem('token', value);
   }, token);

   await page.goto('https://rahulshettyacademy.com/client', {
      waitUntil: 'domcontentloaded'
   });

   // Debug information
   console.log('Current URL:', page.url());
   console.log('Page title:', await page.title());

   const storedToken = await page.evaluate(() =>
      window.localStorage.getItem('token')
   );

   console.log('Token stored in browser:', Boolean(storedToken));

   // Capture the page state before attempting to click
   await page.screenshot({
      path: 'test-results/client-page.png',
      fullPage: true
   });

   const myOrdersButton = page.locator(
      "button[routerlink*='myorders']"
   );

   // Check whether My Orders appears
   try {
      await myOrdersButton.waitFor({
         state: 'visible',
         timeout: 10000
      });

      console.log('My Orders button is visible.');

   } catch (error) {
      console.log('My Orders button was not found.');
      console.log(
         'Page content:',
         (await page.locator('body').innerText()).slice(0, 2000)
      );

      throw error;
   }

   await myOrdersButton.click();

   await page.locator('tbody tr').first().waitFor({
      state: 'visible',
      timeout: 15000
   });

   const rows = page.locator('tbody tr');
   let orderFound = false;

   for (let i = 0; i < await rows.count(); i++) {
      const rowOrderId = await rows.nth(i).locator('th').textContent();

      if (rowOrderId?.trim() === String(orderId).trim()) {
         await rows.nth(i).locator('button').first().click();
         orderFound = true;
         break;
      }
   }

   expect(orderFound).toBeTruthy();

   const orderIdDetails = await page.locator('.col-text').textContent();

   expect(orderIdDetails?.trim()).toBe(String(orderId).trim());
});