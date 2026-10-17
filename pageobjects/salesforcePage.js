import { expect } from '@playwright/test';

class salesforcePage {
    constructor(page) {
        this.page = page;
        this.tabBar = this.page.locator('ul.tabBarItems.slds-grid');
        this.closeButtons = this.tabBar.locator('button[title^="Close "]');

    }

    async login(SFURL, SFUsername, SFPassword) {
        await this.page.goto(SFURL);
        await this.page.locator("#username").fill(SFUsername);
        await this.page.locator("#Login").click();
        await this.page.locator("#password").fill(SFPassword);
        await this.page.locator("#Login").click();
        await this.page.locator("button[type='button']").waitFor({ state: 'visible' });
        await this.page.locator("button[type='button']").click();
        await this.page.locator("div span[title='BioConnect']").waitFor({ state: 'visible', timeout: 30000 });
        // const tabBar = this.page.locator('ul.tabBarItems.slds-grid');
        await this.tabBar.waitFor({ state: 'visible', timeout: 20000 }).catch(() => { });
        // const closeButtons = tabBar.locator('button[title^="Close "]');
        while (await this.closeButtons.count() > 0) {
                const button = this.closeButtons.first();
                if (await button.isVisible()) {
                await button.click();
                } else {
                break;
                }
                }
    }

    async searchAndOpenCase(AEPC_CaseNumber) {
        await this.page.getByRole('button', { name: 'Search' }).click();
        const searchBox = this.page.getByRole('searchbox', { name: 'Search...' });
        await searchBox.pressSequentially(AEPC_CaseNumber, { delay: 50 });
        const salesforceIDnumber = this.page.getByRole("listbox").locator(
            "lightning-formatted-rich-text[class='primary slds-truncate slds-rich-text-editor__output']"
        ).nth(0);
        await salesforceIDnumber.waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });

        if (await salesforceIDnumber.isVisible()) {
            console.log(`Case is visible. Clicking the ${salesforceIDnumber}.`);
            await salesforceIDnumber.click();
        } else {
            console.log("Case is not visible. Refreshing Salesforce.");
            await this.page.reload({ waitUntil: 'domcontentloaded' });
            await this.page.locator("div span[title='BioConnect']").waitFor({ state: 'visible', timeout: 30000 });
            // this.tabBar = this.page.locator('ul.tabBarItems.slds-grid');
            // this.closeButtons = this.tabBar.locator('button[title^="Close "]');
            // await closeButtons.first().waitFor({ state: 'visible', timeout: 30000 });
            while (await this.closeButtons.count() > 0) {
                const button = this.closeButtons.first();
                if (await button.isVisible()) {
                await button.click();
                } else {
                break;
                }
                }
            await this.page.getByRole('button', { name: 'Search' }).click();
            const searchBox = this.page.getByRole('searchbox', { name: 'Search...' });
            await searchBox.pressSequentially(AEPC_CaseNumber, { delay: 50 });
            await searchBox.press('Enter');
            await this.page.locator(
                "div h2 a[class*='slds-card__header-title slds-text-link slds-show--inline-block uiOutputURL']"
            ).first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => { });
            await this.page.locator(
                "div h2 a[class*='slds-card__header-title slds-text-link slds-show--inline-block uiOutputURL']"
            ).first().click();
            const caseID = await this.page.locator(
                "th a[class*='slds-truncate outputLookupLink slds-truncate outputLookupLink-']"
            ).first().textContent();
            console.log(`Case ID: ${caseID}`);
            await this.page.locator(
                "th a[class*='slds-truncate outputLookupLink slds-truncate outputLookupLink-']"
            ).first().click();
            await this.page.getByRole('button', { name: `Close ${AEPC_CaseNumber} - Search` }).click();
            await this.page.locator(`li a[title="${caseID} | Case"]`).first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
            await this.page.locator(`li a[title="${caseID} | Case"]`).first().click();
        }
    }

    async validateSRPCCreation(AEPC_CaseNumber) {
        await this.page.getByRole('tab', { name: 'Details' }).waitFor({ state: 'visible' });
        await this.page.getByRole('link', { name: 'Related Cases (2)' }).click();
        await expect(this.page.getByRole('link', { name: `${AEPC_CaseNumber}-PC-01` })).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Product Complaint Management' })).toBeVisible();
        await expect(this.page.getByRole('link', { name: `${AEPC_CaseNumber}-SR-01` })).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Safety Report' })).toBeVisible();
    }

    async closeopenCases(){
        while (await this.closeButtons.count() > 0) {
        const button = this.closeButtons.first();

        if (await button.isVisible()) {
            await button.click();
        } else {
            break;
        }
    }
    }
}

export default salesforcePage;
