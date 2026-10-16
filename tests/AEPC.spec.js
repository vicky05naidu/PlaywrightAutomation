import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import patientFlowPage from '../pageobjects/patientFlowPage';
import AEPCTestData from '../data/AEPCTestData';

dotenv.config();

test('AEPCPublicPortalPOM', async ({ browser }) => {
    test.setTimeout(300000); // Set test timeout to 5 minutes
    const {
        AEPCURL,
        PatFN,
        PatLN,
        PatPhone,
        PatEmail,
        PatAddress,
        PatState,
        PatCity,
        PatPostalCode,
        PatDOBYear,
        PatDOBMonth,
        PatDOBDay,
        PatGender,
        HCPFN,
        HCPLN,
        HCPPhone,
        HCPEmail,
        HCPType,
        Product,
        DosageForm,
        ProductStopYear,
        ProductStopMonth,
        ProductStopDay,
        LotBatchNumber,
        AEDescription,
        PCDescription,
        EventDateYear,
        EventDateMonth,
        EventDateDay
    } = AEPCTestData;

    //Salesforce
    const SFURL = "https://amgenbioconnect--fullcopy1.sandbox.my.salesforce.com/";
    const SFUsername = process.env.SF_USERNAME;
    const SFPassword = process.env.SF_PASSWORD;

    //TestCase
    const context = await browser.newContext();
    const page = await context.newPage();
    const PatientFlowPage = new patientFlowPage(page, PatState, PatDOBYear, PatDOBMonth, PatDOBDay, PatGender, HCPType, Product, DosageForm, ProductStopYear, ProductStopMonth, ProductStopDay, EventDateYear, EventDateMonth, EventDateDay);
    await PatientFlowPage.AEPCdevURL(AEPCURL);
    await PatientFlowPage.SelectPatientFlow();
    await PatientFlowPage.fillPatientSection(PatFN, PatLN, PatPhone, PatEmail, PatAddress, PatCity, PatPostalCode);
    await PatientFlowPage.fillHCPSection(HCPFN, HCPLN, HCPPhone, HCPEmail);
    await PatientFlowPage.fillProduct(LotBatchNumber);
    await PatientFlowPage.fillAESection(AEDescription);
    await PatientFlowPage.fillPCSection(PCDescription);
    const AEPC_CaseNumber = await PatientFlowPage.submitAEPCformandGetCaseNumber();


    //Salesforce Application
    const page1 = await context.newPage();
    await page1.goto(SFURL);
    await page1.locator("#username").fill(SFUsername);
    await page1.locator("#Login").click();
    await page1.locator("#password").fill(SFPassword);
    await page1.locator("#Login").click();
    await page1.locator("button[type='button']").waitFor({ state: 'visible' });
    await page1.locator("button[type='button']").click();
    await page1.locator("div span[title='BioConnect']").waitFor({ state: 'visible', timeout: 30000 });
    const tabBar = page1.locator('ul.tabBarItems.slds-grid');
    const closeButtons = tabBar.locator('button[title^="Close "]');
    await closeButtons.first().waitFor({ state: 'visible', timeout: 30000 });
    while (await closeButtons.count() > 0) {
        await closeButtons.first().click();
        await page1.waitForTimeout(1000);
    }
    await page1.getByRole('button', { name: 'Search' }).click();
    const searchBox = page1.getByRole('searchbox', { name: 'Search...' });
    await searchBox.pressSequentially(AEPC_CaseNumber, { delay: 50 });
    const salesforceIDnumber = page1.getByRole("listbox").locator(
        "lightning-formatted-rich-text[class='primary slds-truncate slds-rich-text-editor__output']"
    ).nth(0);
    await salesforceIDnumber.waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });

    if (await salesforceIDnumber.isVisible()) {
        console.log(`Case is visible. Clicking the ${salesforceIDnumber}.`);
        await salesforceIDnumber.click();
    } else {
        console.log("Case is not visible. Refreshing Salesforce.");
        await page1.reload({ waitUntil: 'domcontentloaded' });
        await page1.locator("div span[title='BioConnect']").waitFor({ state: 'visible', timeout: 30000 });
        // await closeButtons.first().waitFor({ state: 'visible', timeout: 30000 });
        while (await closeButtons.count() > 0) {
            await closeButtons.first().click();
            await page1.waitForTimeout(1000);
        }
        await page1.getByRole('button', { name: 'Search' }).click();
        const searchBox = page1.getByRole('searchbox', { name: 'Search...' });
        await searchBox.pressSequentially(AEPC_CaseNumber, { delay: 50 });
        await searchBox.press('Enter');
        await page1.locator(
            "div h2 a[class*='slds-card__header-title slds-text-link slds-show--inline-block uiOutputURL']"
        ).first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => { });
        await page1.locator(
            "div h2 a[class*='slds-card__header-title slds-text-link slds-show--inline-block uiOutputURL']"
        ).first().click();
        const caseID = await page1.locator(
            "th a[class*='slds-truncate outputLookupLink slds-truncate outputLookupLink-']"
        ).first().textContent();
        console.log(`Case ID: ${caseID}`);
        await page1.locator(
            "th a[class*='slds-truncate outputLookupLink slds-truncate outputLookupLink-']"
        ).first().click();
        await page1.getByRole('button', { name: `Close ${AEPC_CaseNumber} - Search` }).click();
        await page1.locator(`li a[title="${caseID} | Case"]`).first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
        await page1.locator(`li a[title="${caseID} | Case"]`).first().click();
    }

    await page1.getByRole('tab', { name: 'Details' }).waitFor({ state: 'visible' });
    await page1.getByRole('link', { name: 'Related Cases (2)' }).click();
    await expect(page1.getByRole('link', { name: `${AEPC_CaseNumber}-PC-01` })).toBeVisible();
    await expect(page1.getByRole('link', { name: 'Product Complaint Management' })).toBeVisible();
    await expect(page1.getByRole('link', { name: `${AEPC_CaseNumber}-SR-01` })).toBeVisible();
    await expect(page1.getByRole('link', { name: 'Safety Report' })).toBeVisible();
});
