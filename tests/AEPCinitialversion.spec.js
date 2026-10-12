import { test, expect } from '@playwright/test';
// import {patientFlowPage} from '../pageobjects/patientFlowPage';

test('AEPCPublicPortal', async ({ browser }) => {
    test.setTimeout(90000);
    //parameters
    const AEPCURL = "https://www.dev.amgenaepcextreporting.com/";
    const SFURL = "https://amgenbioconnect--fullcopy1.sandbox.my.salesforce.com/";
    const SFUsername= "yvenka01@amgen.com.fullcopy1";
    const SFPassword = "Fullcopy.01";


    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(AEPCURL);
    await page.waitForSelector("div[class*='text'] h1");
    await expect(page.locator("div[class*='text'] h1")).toBeVisible();
    await page.locator(".language-selector__button-menu").click();
    await page.locator("//span[normalize-space()='English']").click();
    await page.locator("button[aria-label='Country of Event occurrence']").click();
    await page.locator("span[title='United States of America']").click();
    await page.getByRole('radiogroup').getByText('Patient').click();
    await page.getByRole('button', { name: "Next" }).click();
    //await page.getByRole('heading', { name: 'Patient Information' }).getByText('Yes').check();
    //await page.getByText('Do we have your consent to contact you if we have additional questions?').getByText('Yes').check();
    await page.getByText('Yes').first().click();
    await page.locator("input[name='patFirstName']").fill('Test Patient');
    await page.locator("input[name='patLastName']").fill('User');
    await page.getByLabel('*Phone Number (numbers only)').fill('1234567890');
    await page.locator("input[name='patEmailId']").fill('pattest@email.com');
    await page.getByLabel('*Address Line').fill('test address patient');
    await page.getByLabel('*City').fill('test city patient');
    await page.getByRole('combobox', { name: 'State/Province' }).click();
    await page.getByRole('option', { name: 'Alabama' }).click();
    //await page.getByLabel('State/Province').selectOption('Alabama');
    await page.getByLabel('*Postal Code').fill('54321 MTH');
    await page.locator("button[name='patyearofbirth']").click();
    await page.locator("span[title='2000']").click();
    await page.locator("button[name='patmonthofbirth']").click();
    await page.locator("span[title='Jan']").click();
    await page.locator("button[name='patdayofbirth']").click();
    await page.locator("span[title='05']").click();
    await page.getByRole('combobox', { name: 'Gender' }).click();
    await page.getByText('Male').nth(0).click();
    //HCP Section
    await page.getByText('Yes').nth(1).click();
    await page.locator("input[name='FirstNameHCP']").fill('Test HCP');
    await page.locator("input[name='LastNameHCP']").fill('Tester');
    await page.getByRole('combobox', { name: 'HCP Type' }).click();
    await page.getByText('Physician').nth(0).click();
    await page.getByLabel('*Phone Number (numbers only)').nth(1).fill('5432167890');
    await page.locator("input[name='hcpEmailId']").fill('hcptest@email.com');

    //Product section
    await page.getByRole('combobox', { name: "Product" }).click();
    await page.getByText('Enbrel', { exact: true }).click();
    await page.locator("button[name='Delivery Method/Dosage Form']").click();
    await page.getByText('Sureclick autoinjector 1.5', { exact: true }).click();
    await page.locator('input[name="prodstartunknpcheckbox"]').click();
    // await page.locator("input[name='fnunknpcheckbox']").click();
    await page.locator('button[name="productyearofstopdate"]').click();
    // await page.getByText('2026',{exact: true}).click();
    // await page.locator('lightning-base-combobox-item[data-value="2026"]').click();
    await page.getByRole('listbox').getByText('2026', { exact: true }).click();
    await page.locator('button[name="productmonthofstopdate"]').click();
    await page.getByRole('listbox').getByText('Jan', { exact: true }).click();
    await page.locator('button[name="productDayofstopdate"]').click();
    await page.getByRole('listbox').getByText('05', { exact: true }).click();
    await page.locator("input[name='Lot/BatchNumbers']").fill('1011763');
    await page.locator("lightning-layout-item lightning-button-icon button[type='button']").click();
    // const lotBatchMessage = await page.waitForSelector("h2 slot[name='message']");
    // await lotBatchMessage.toBeVisible();
    await page.getByText('Success! You entered a valid Lot/Batch Number', { exact: false }).waitFor({ state: 'visible' });
    //await page.getByLabel("Indication/Diagnosis/ICD").locator("input[name='fnunknpcheckbox']").check();
    await page.locator('div.fieldPadding_left').filter({ hasText: 'Indication/Diagnosis/ICD' }).locator('input[name="fnunknpcheckbox"]').click();
    await page.locator('div.fieldPadding_left').filter({ hasText: 'Dose/Frequency' }).locator('input[name="fnunknpcheckbox"]').click();

    //Adverse Event
    // Adverse Event
    await page.getByText('Yes').nth(2).click();
    // const adverseEvent = page.locator('lightning-radio-group').filter({ hasText: 'Do you want to report an adverse event?' });
    // await adverseEvent.getByText('Yes', { exact: true }).click();
    //await page.locator("lightning-radio-group input[name='Do you want to report an adverse event?']").nth(0).click();
    await page.locator('lightning-textarea[data-field="aedescriptionvalue"] div textarea').fill("Demo of AEPC submission -- AE");

    //Product Complaint
    await page.getByText('Yes').nth(3).click();

    // const productcomplaint = page.locator('lightning-radio-group').filter({ hasText: 'Do you want to report a product quality complaint?' });
    // await productcomplaint.getByText('Yes', { exact: true }).click();

    const pcDescription = `1) What is the issue, including a full description and when it was observed (during preparation, during administration or after use): Testing of PC Section
2) How many units are involved (if multiple units include the lot/serial# if different lots were used): Testing of PC Section
3) Who attempted the administration, HCP/Patient/Caregiver/unknown:Testing of PC Section
4) User experience with the product/delivery system (first time,1-3 mon, 4-6 mon, 7-9 mon, 10-12 mon,> 12 mon, unknown):Testing of PC Section
    If first time user, how were they trained and by whom?Testing of PC Section
    For SureClick Autoinjector/pre-filled pen: If use < 6 months, did the administrator have previous experience with an auto injector/pre-filled pen type of device?Testing of PC Section
5) Did the administrator follow the instructions of use? If no, clarify:Testing of PC Section
6) Was the package/carton received sealed, if no provide details:Testing of PC Section`;

    //await page.locator("lightning-radio-group input[name='Do you want to report a product quality complaint?']").nth(0).click();
    await page.locator('div.adverseTextArea textarea').last().fill(pcDescription);
    await page.locator('button[name="yearofeventdate"]').click();
    await page.getByRole('listbox').getByText('2026', { exact: true }).click();
    await page.locator('button[name="monthofeventdate"]').click();
    await page.getByRole('listbox').getByText('Jan', { exact: true }).click();
    await page.locator('button[name="Dayofeventdate"]').click();
    await page.getByRole('listbox').getByText('05', { exact: true }).click();
    await page.getByRole('button', { name: "Submit" }).click();
    // await page.waitForTimeout(30000);
    const successModal = page.locator("div p[class='slds-text-align_center slds-p-bottom_medium']");
    await successModal.waitFor({ state: 'visible', timeout: 60000 });
    const caseNumber = await page.locator("div p[class='slds-text-align_center slds-p-bottom_medium']").textContent();
    const AEPC_CaseNumber = caseNumber.match(/\d{2}-\d{7}/)[0];
    console.log("AEPC Case Number:", AEPC_CaseNumber);


    // 
    // const PatientFlowPage = new patientFlowPage();
    // await PatientFlowPage.AEPCdevURL(AEPCURL);
    

    //Salesforce Application
    const page1 = await context.newPage();
    await page1.goto(SFURL);
    await page1.locator("#username").fill(SFUsername);
    await page1.locator("#Login").click();
    await page1.locator("#password").fill(SFPassword);
    await page1.locator("#Login").click();
    await page1.waitForSelector("button[type='button']");
    await page1.locator("button[type='button']").click();
    await page1.waitForSelector("div span[title='BioConnect']");
    await page1.waitForTimeout(5000);
    const tabBar = page1.locator('ul.tabBarItems.slds-grid');
    const closeButtons = tabBar.locator('button[title^="Close "]');
    while (await closeButtons.count() > 0) {
        await closeButtons.first().click();
        await page1.waitForTimeout(1000);
    
    }
    await page1.getByRole('button', { name: 'Search' }).click();
    const searchBox = page1.getByRole('searchbox', { name: 'Search...' });
    await searchBox.fill(AEPC_CaseNumber);
    await searchBox.press('Enter');
    await page1.waitForTimeout(2000);
    await page1.waitForSelector("h2[class='recordTitle slds-page-header__title slds-card__header-link slds-truncate slds-m-vertical_xxx-small']");
    await page1.locator("h2 a[data-refid='recordId']").nth(0).click();
    await page1.getByRole('tab', { name: 'Details' }).waitFor({ state: 'visible' });

    await closeButtons.first().click();
    await page1.getByRole('link', { name: 'Related Cases (2)' }).click();
    await expect(page1.getByRole('link', { name: 'Product Complaint Management' })).toBeVisible();
    await expect(page1.getByRole('link', { name: 'Safety Report' })).toBeVisible();
});