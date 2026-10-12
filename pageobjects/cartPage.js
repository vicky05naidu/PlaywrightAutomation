const { expect } = require('@playwright/test');
class cartPage {
    constructor(page) {
        this.page = page;
        this.loadElement = page.locator("div li");
        this.productInCart = page.locator("h3:has-text('ZARA COAT 3')");
        this.checkoutButton = page.locator("text=Checkout");
        this.country = page.locator("[placeholder*='Country']");
        this.dropdown = page.locator(".ta-results");
        this.placeOrderButton = page.locator(".action__submit");

    }

    async checkoutprocess(username) {
        await this.loadElement.first().waitFor();
        const bool = await this.productInCart.isVisible();
        expect(bool).toBeTruthy();
        await this.checkoutButton.click();
        await this.country.pressSequentially("ind", { delay: 150 });
        await this.dropdown.waitFor();
        const optionsCount = await this.dropdown.locator("button").count();
        for (let i = 0; i < optionsCount; ++i) {
            const text = await this.dropdown.locator("button").nth(i).textContent();
            if (text === " India") {
                await this.dropdown.locator("button").nth(i).click();
                break;
            }
        }

        expect(this.page.locator(".user__name [type='text']").first()).toHaveText(username);
        await this.placeOrderButton.click();

    }

}
module.exports = {cartPage}