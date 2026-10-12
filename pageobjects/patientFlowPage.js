import { expect } from '@playwright/test';
class patientFlowPage {

    constructor(page, PatState, PatDOBYear, PatDOBMonth, PatDOBDay, PatGender, HCPType, Product, DosageForm, ProductStopYear, ProductStopMonth, ProductStopDay, EventDateYear, EventDateMonth, EventDateDay) {
        this.page = page;
        this.loadAEPChomePage = page.locator("div[class*='text'] h1");
        this.languageMenu = page.locator(".language-selector__button-menu");
        this.languageEnglish = page.locator("//span[normalize-space()='English']");
        this.selectCountryField = page.locator("button[aria-label='Country of Event occurrence']");
        this.countryUSA = page.locator("span[title='United States of America']");
        this.selectPatientRadioButton = page.getByRole('radiogroup').getByText('Patient');
        this.nextButton = page.getByRole('button', { name: "Next" });
        //Patient locators
        this.patientConsentYes = page.getByText('Yes');
        this.patFirstName = page.locator("input[name='patFirstName']");
        this.patLastName = page.locator("input[name='patLastName']");
        this.patPhone = page.getByLabel('*Phone Number (numbers only)');
        this.patEmail = page.locator("input[name='patEmailId']");
        this.patAddress = page.getByLabel('*Address Line');
        this.patCity = page.getByLabel('*City');
        this.patStatefield = page.getByRole('combobox', { name: 'State/Province' });
        this.patStateValue = page.getByRole('option', { name: PatState });
        this.patPostalCode = page.getByLabel('*Postal Code');
        this.patDOBFieldY = page.locator("button[name='patyearofbirth']");
        this.patDOBValueY = page.locator(`span[title='${PatDOBYear}']`);
        this.patDOBFieldM = page.locator("button[name='patmonthofbirth']");
        this.patDOBValueM = page.locator(`span[title='${PatDOBMonth}']`);
        this.patDOBFieldD = page.locator("button[name='patdayofbirth']");
        this.patDOBValueD = page.locator(`span[title='${PatDOBDay}']`);
        this.patGenderField = page.getByRole('combobox', { name: 'Gender' });
        this.patGenderValue = page.getByText(`${PatGender}`);
        //HCP Locators
        this.hcpConsentYes = page.getByText('Yes');
        this.hcpFirstName = page.locator("input[name='FirstNameHCP']");
        this.hcpLastName = page.locator("input[name='LastNameHCP']");
        this.hcpTypeField = page.getByRole('combobox', { name: 'HCP Type' });
        this.hcpTypeValue = page.getByText(`${HCPType}`);
        this.hcpPhone = page.getByLabel('*Phone Number (numbers only)');
        this.hcpEmail = page.locator("input[name='hcpEmailId']");
        //Product Section Locators
        this.productField = page.getByRole('combobox', { name: "Product" });
        this.productValue = page.getByText(`${Product}`, { exact: true });
        this.dosageFormField = page.locator("button[name='Delivery Method/Dosage Form']");
        this.dosageFormValue = page.getByText(`${DosageForm}`, { exact: true });
        this.productStartDate = page.locator('input[name="prodstartunknpcheckbox"]');
        this.productStopDateYF = page.locator('button[name="productyearofstopdate"]');
        this.productStopDateYV = page.getByRole('listbox').getByText(`${ProductStopYear}`, { exact: true });
        this.productStopDateMF = page.locator('button[name="productmonthofstopdate"]');
        this.productStopDateMV = page.getByRole('listbox').getByText(`${ProductStopMonth}`, { exact: true });
        this.productStopDateDF = page.locator('button[name="productDayofstopdate"]');
        this.productStopDateDV = page.getByRole('listbox').getByText(`${ProductStopDay}`, { exact: true });
        this.validLotBatchNumber = page.locator("input[name='Lot/BatchNumbers']");
        this.validateIcon = page.locator("lightning-layout-item lightning-button-icon button[type='button']");
        this.successLotMessage = page.getByText('Success! You entered a valid Lot/Batch Number', { exact: false });
        this.indication = page.locator('div.fieldPadding_left').filter({ hasText: 'Indication/Diagnosis/ICD' }).locator('input[name="fnunknpcheckbox"]');
        this.doseFrequency = page.locator('div.fieldPadding_left').filter({ hasText: 'Dose/Frequency' }).locator('input[name="fnunknpcheckbox"]');
        //AE Section
        this.AEselectionYes = page.getByText('Yes');
        this.AEdescription = page.locator('lightning-textarea[data-field="aedescriptionvalue"] div textarea');
        //PC Section
        this.PCselectionYes = page.getByText('Yes');
        this.PCdescription = page.locator('div.adverseTextArea textarea');
        this.eventYF = page.locator('button[name="yearofeventdate"]');
        this.eventYV = page.getByRole('listbox').getByText(`${EventDateYear}`, { exact: true });
        this.eventMF = page.locator('button[name="monthofeventdate"]');
        this.eventMV = page.getByRole('listbox').getByText(`${EventDateMonth}`, { exact: true });
        this.eventDF = page.locator('button[name="Dayofeventdate"]');
        this.eventDV = page.getByRole('listbox').getByText(`${EventDateDay}`, { exact: true })
        //Submit
        this.submit = page.getByRole('button', { name: "Submit" });
        this.successModal = page.locator("div p[class='slds-text-align_center slds-p-bottom_medium']");
        this.getEntireCaseNumberText = page.locator("div p[class='slds-text-align_center slds-p-bottom_medium']");
    }
    async AEPCdevURL(AEPCURL) {
        await this.page.goto(AEPCURL);
        await expect(this.loadAEPChomePage).toBeVisible();
    }
    async SelectPatientFlow() {
        await this.languageMenu.click();
        await this.languageEnglish.click();
        await this.selectCountryField.click();
        await this.countryUSA.click();
        await this.selectPatientRadioButton.click();
        await this.nextButton.click();
    }
    async fillPatientSection(PatFN, PatLN, PatPhone, PatEmail, PatAddress, PatCity, PatPostalCode) {
        await this.patientConsentYes.first().click();
        await this.patFirstName.fill(PatFN);
        await this.patLastName.fill(PatLN);
        await this.patPhone.fill(PatPhone);
        await this.patEmail.fill(PatEmail);
        await this.patAddress.fill(PatAddress);
        await this.patCity.fill(PatCity);
        await this.patStatefield.click();
        await this.patStateValue.click();
        await this.patPostalCode.fill(PatPostalCode);
        await this.patDOBFieldY.click();
        await this.patDOBValueY.click();
        await this.patDOBFieldM.click();
        await this.patDOBValueM.click();
        await this.patDOBFieldD.click();
        await this.patDOBValueD.click();
        await this.patGenderField.click();
        await this.patGenderValue.nth(0).click();
    }
    async fillHCPSection(HCPFN, HCPLN, HCPPhone, HCPEmail) {
        await this.hcpConsentYes.nth(1).click();
        await this.hcpFirstName.fill(HCPFN);
        await this.hcpLastName.fill(HCPLN);
        await this.hcpTypeField.click();
        await this.hcpTypeValue.nth(0).click();
        await this.hcpPhone.nth(1).fill(HCPPhone);
        await this.hcpEmail.fill(HCPEmail);
    }
    async fillProduct(LotBatchNumber) {
        await this.productField.click();
        await this.productValue.click();
        await this.dosageFormField.click();
        await this.dosageFormValue.click();
        await this.productStartDate.click();
        await this.productStopDateYF.click();
        await this.productStopDateYV.click();
        await this.productStopDateMF.click();
        await this.productStopDateMV.click();
        await this.productStopDateDF.click();
        await this.productStopDateDV.click();
        await this.validLotBatchNumber.fill(LotBatchNumber);
        await this.validateIcon.click();
        await this.successLotMessage.waitFor({ state: 'visible' });
        await this.indication.click();
        await this.doseFrequency.click();
    }
    async fillAESection(AEDescription) {
        await this.AEselectionYes.nth(2).click();
        await this.AEdescription.fill(AEDescription);
    }
    async fillPCSection(PCDescription) {
        await this.PCselectionYes.nth(3).click();
        await this.PCdescription.last().fill(PCDescription);
        await this.eventYF.click();
        await this.eventYV.click();
        await this.eventMF.click();
        await this.eventMV.click();
        await this.eventDF.click();
        await this.eventDV.click();
    }
    async submitAEPCformandGetCaseNumber() {
        await this.submit.click();
        await this.successModal.waitFor({ state: 'visible', timeout: 60000 });
        const aepcCaseNumber = await this.getEntireCaseNumberText.textContent();
        const AEPC_CaseNumber = aepcCaseNumber.match(/\d{2}-\d{7}/)[0];
        console.log("AEPC Case Number:", AEPC_CaseNumber);
        return AEPC_CaseNumber;
    }
}


export default patientFlowPage