import { expect } from '@playwright/test';

class salesforcePage {
    constructor(page) {
        this.page = page;
        this.userName = page.locator('#username');
        this.password = page.locator('#password');
        this.loginButton = page.locator('#Login');
        this.continueButton = page.locator("button[type='button']");
        this.bioConnectApp = page.locator("div span[title='BioConnect']");
        this.tabBar = page.locator('ul.tabBarItems.slds-grid');
        this.closeTabButtons = this.tabBar.locator('button[title^="Close "]');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.searchBox = page.getByRole('searchbox', { name: 'Search...' });
        this.caseSearchResult = page.getByRole('listbox').locator(
            "lightning-formatted-rich-text[class='primary slds-truncate slds-rich-text-editor__output']"
        ).first();
        this.detailsTab = page.getByRole('tab', { name: 'Details' });
        this.relatedCasesLink = page.getByRole('link', { name: 'Related Cases (2)' });
        this.productComplaintLink = page.getByRole('link', { name: 'Product Complaint Management' });
        this.safetyReportLink = page.getByRole('link', { name: 'Safety Report' });
    }

    async login(url, username, password) {
        await this.page.goto(url);
        await this.userName.fill(username);
        await this.loginButton.click();
        await this.password.fill(password);
        await this.loginButton.click();
        await this.continueButton.waitFor({ state: 'visible' });
        await this.continueButton.click();
        await this.bioConnectApp.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(5000);
        await this.closeOpenTabs();
    }

    async openCase(caseNumber) {
        await this.searchButton.click();
        await this.searchBox.pressSequentially(caseNumber, { delay: 50 });

        try {
            await this.caseSearchResult.waitFor({ state: 'visible', timeout: 15000 });
        } catch (error) {
            if (error.name !== 'TimeoutError') {
                throw error;
            }
        }

        if (await this.caseSearchResult.isVisible()) {
            await this.caseSearchResult.click();
            return;
        }

        console.log('Case is not visible. Refreshing Salesforce.');
        await this.page.reload();
        await this.bioConnectApp.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(5000);
        await this.closeOpenTabs();
        await this.searchButton.click();
        await this.searchBox.pressSequentially(caseNumber, { delay: 50 });
        await this.searchBox.press('Enter');
        await this.page.reload({ waitUntil: 'domcontentloaded' });
        await this.page.reload({ waitUntil: 'domcontentloaded' });
        await this.page.reload({ waitUntil: 'domcontentloaded' });
        await this.page.locator(
            "div h2 a[class*='slds-card__header-title slds-text-link slds-show--inline-block uiOutputURL']"
        ).first().click();
        await this.page.locator(
            "th a[class*='slds-truncate outputLookupLink slds-truncate outputLookupLink-']"
        ).first().click();
        await this.page.getByRole('button', { name: `Close ${caseNumber} - Search` }).click();
    }

    async validateRelatedCases() {
        await this.detailsTab.waitFor({ state: 'visible' });
        await this.relatedCasesLink.click();
        await expect(this.productComplaintLink).toBeVisible();
        await expect(this.safetyReportLink).toBeVisible();
    }

    async closeOpenTabs() {
        while (await this.closeTabButtons.count() > 0) {
            await this.closeTabButtons.first().click();
            await this.page.waitForTimeout(1000);
        }
    }
}

export default salesforcePage;
