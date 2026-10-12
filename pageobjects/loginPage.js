class loginPage {
    constructor(page) {
        this.page = page;
        this.userName = page.locator("#userEmail");
        this.Password = page.locator("#userPassword");
        this.LoginButton = page.locator("[value='Login']");

    }

    async clientAppURL(URL){
        await this.page.goto(URL);

    }

    async validLogin(username,password) {
        await this.userName.fill(username);
        await this.Password.fill(password);
        await this.LoginButton.click();
        await this.page.waitForLoadState('networkidle');

    }


}
module.exports={loginPage}