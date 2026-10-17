import { test, expect } from '@playwright/test';
import patientFlowPage from '../pageobjects/patientFlowPage';
import salesforcePage from '../pageobjects/salesforcePage';
import AEPCTestData from '../data/AEPCTestData';

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
    const SalesforcePage = new salesforcePage(page1);
    await SalesforcePage.login(SFURL, SFUsername, SFPassword);
    await SalesforcePage.searchAndOpenCase(AEPC_CaseNumber);
    await SalesforcePage.validateSRPCCreation(AEPC_CaseNumber);
    // await SalesforcePage.closeopenCases();
});
