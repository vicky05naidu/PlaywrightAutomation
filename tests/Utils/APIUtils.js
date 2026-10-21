//This file was created by Copilot
const { expect } = require('@playwright/test');

class APIUtils {
    constructor(apiContext, loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
        this.token = null;
    }

    async gettoken() {
        // Authenticate once and retain the token for subsequent API requests.
        const loginResponse = await this.apiContext.post(
            'https://rahulshettyacademy.com/api/ecom/auth/login',
            { data: this.loginPayload }
        );
        expect(loginResponse.ok()).toBeTruthy();

        const loginResponseJson = await loginResponse.json();
        expect(loginResponseJson.token).toBeTruthy();
        this.token = loginResponseJson.token;

        return this.token;
    }

    async createOrder(orderPayload) {
        // Reuse the login token, or authenticate if this is the first API call.
        const token = this.token || await this.gettoken();
        const orderResponse = await this.apiContext.post(
            'https://rahulshettyacademy.com/api/ecom/order/create-order',
            {
                data: orderPayload,
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                }
            }
        );
        expect(orderResponse.ok()).toBeTruthy();

        const orderResponseJson = await orderResponse.json();
        // Return the first created order ID for the UI validation.
        expect(orderResponseJson.orders?.[0]).toBeTruthy();

        return orderResponseJson.orders[0];
    }
}

module.exports = { APIUtils };
