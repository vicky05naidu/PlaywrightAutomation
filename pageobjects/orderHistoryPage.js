const { expect } = require('@playwright/test');
class orderHistoryPage {

    constructor(page) {
        this.page = page;
        this.thankyouText = page.locator(".hero-primary");
        this.IDorder = page.locator(".em-spacer-1 .ng-star-inserted");
        this.orderPage = page.locator("button[routerlink*='myorders']");
        this.loadElements = page.locator("tbody");
        this.orderIDDetails = page.locator(".col-text");


    }

    async orderHistoryValidation() {
        await expect(this.thankyouText).toHaveText(" Thankyou for the order. ");
        const orderId = await this.IDorder.textContent();
        console.log(orderId);

        await this.orderPage.click();
        await this.loadElements.waitFor();
        const rows = await this.page.locator("tbody tr");


        for (let i = 0; i < await rows.count(); ++i) {
            const rowOrderId = await rows.nth(i).locator("th").textContent();
            if (orderId.includes(rowOrderId)) {
                await rows.nth(i).locator("button").first().click();
                break;
            }
        }
        const orderIdDetails = await this.orderIDDetails.textContent();
        expect(orderId.includes(orderIdDetails)).toBeTruthy();

    }
}

module.exports = { orderHistoryPage }