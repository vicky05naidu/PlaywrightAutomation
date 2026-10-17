import { test, expect, request } from '@playwright/test';
test('Capture ASRP Login', async ({ page }) => {

    await page.goto('https://www.dev.amgensafetyportal.com/asrp/s/login/?language=en_IN');
    await page.waitForLoadState('networkidle');
    await page.locator('#disable').getByRole('textbox', { name: 'Enter Email Address' }).click();
    await page.locator('#disable').getByRole('textbox', { name: 'Enter Email Address' }).pressSequentially("vicky05naidu@gmail.com", { delay: 50 });
    await page.getByRole('textbox', { name: 'Enter Password' }).click();
    await page.getByRole('textbox', { name: 'Enter Password' }).pressSequentially("Password@1234", { delay: 50 });
    await page.locator('#disable').getByRole('img').click();
    await page.locator('#disable').getByRole('button', { name: 'LOG IN' }).click();
    await page.getByText('Yogaraj').waitFor({state:'visible'});
    await expect(page.getByText('Yogaraj')).toBeVisible();
    
});
