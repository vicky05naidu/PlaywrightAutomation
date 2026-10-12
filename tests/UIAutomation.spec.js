import { test, expect } from '@playwright/test';

test('FirstTestCase',async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    const productName = "Banana - 1 Kg";
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/");
    await expect(page.locator(".greenLogo")).toBeVisible();
    const products = page.locator(".product");
    const productCount =  await products.count();
    for(let i=0;i<productCount; ++i)
    {
        const pName= await page.locator(".product h4.product-name").nth(i).textContent();
        if(productName === pName)
        {
            await page.locator(".product button[type='button']").nth(i).click();
            break;
        }
    }
    await page.waitForSelector("img[alt='Cart']");
    await page.locator("img[alt='Cart']").click();
    await page.locator("button:has-text('PROCEED TO CHECKOUT')").click();
    await page.waitForSelector("td .product-name");
    const cartProductName = await page.locator("td .product-name").textContent();
    if(cartProductName === productName)
    {
        console.log(cartProductName);
        
    }
    await page.locator("button:has-text('Place Order')").click();
    await page.waitForSelector("div select[style*='width']");
    await page.locator("div select[style*='width']").selectOption("India");
    await page.locator("input[type='checkbox']").check();
    await page.locator("button:has-text('Proceed')").click();

});

