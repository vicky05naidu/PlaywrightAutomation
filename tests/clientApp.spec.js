
const {test} = require('@playwright/test');
const {loginPage} = require('../pageobjects/loginPage'); 
const {dashboardPage} = require('../pageobjects/dashboardPage');
const {cartPage} = require('../pageobjects/cartPage');
const {orderHistoryPage} = require('../pageobjects/orderHistoryPage');

test('@Webst Client App login', async ({ page }) => {

    //Parameters
    const URL= "https://rahulshettyacademy.com/client";
    const username = "vicky05naidu@gmail.com";
    const password = "Password@12345";
    const productName = 'ZARA COAT 3';

    //POM
    const loginpage = new loginPage(page);
    await loginpage.clientAppURL(URL);
    await loginpage.validLogin(username,password);
    const dashboardpage = new dashboardPage(page);
    await dashboardpage.AddProductToCart(productName);
    await dashboardpage.CartPage();
    const cartpage = new cartPage(page);
    await cartpage.checkoutprocess(username);
    const orderhistorypage = new orderHistoryPage(page);
    await orderhistorypage.orderHistoryValidation();
    
});
