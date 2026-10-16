import { test } from '@playwright/test';
import patientFlowPage from '../pageobjects/patientFlowPage';
import salesforcePage from '../pageobjects/salesforcePage';

test('AEPCPublicPortalPOM', async ({ browser }) => {
    test.setTimeout(90000);
    //Parameters
    //URL
    const AEPCURL = "https://www.dev.amgenaepcextreporting.com/";
    //Patient
    const PatFN = "TestPatient";
    const PatLN = "User";
    const PatPhone = "1234567890";
    const PatEmail = "pattest@email.com";
    const PatAddress = "test address patient";
    const PatState = "Alabama";
    const PatCity = "TestCity";
    const PatPostalCode = "54321 MTH";
    const PatDOBYear = "2000";
    const PatDOBMonth = "Jan";
    const PatDOBDay = "05";
    const PatGender = "Male";
    //HCP
    const HCPFN = "TestHCP";
    const HCPLN = "UserHCP";
    const HCPPhone = "5432154321";
    const HCPEmail = "hcptest@email.com";
    const HCPType = "Physician";
    //Product
    const Product = "Enbrel";
    const DosageForm = "Sureclick autoinjector 1.5";
    const ProductStopYear = "2026";
    const ProductStopMonth = "Jan";
    const ProductStopDay = "05";
    const LotBatchNumber = "1011763";
    //AE
    const AEDescription = "Demo of AEPC submission -- AE";
    //PC
    const PCDescription = `1) What is the issue, including a full description and when it was observed (during preparation, during administration or after use): Testing of PC Section
2) How many units are involved (if multiple units include the lot/serial# if different lots were used): Testing of PC Section
3) Who attempted the administration, HCP/Patient/Caregiver/unknown:Testing of PC Section
4) User experience with the product/delivery system (first time,1-3 mon, 4-6 mon, 7-9 mon, 10-12 mon,> 12 mon, unknown):Testing of PC Section
    If first time user, how were they trained and by whom?Testing of PC Section
    For SureClick Autoinjector/pre-filled pen: If use < 6 months, did the administrator have previous experience with an auto injector/pre-filled pen type of device?Testing of PC Section
5) Did the administrator follow the instructions of use? If no, clarify:Testing of PC Section
6) Was the package/carton received sealed, if no provide details:Testing of PC Section`;
    const EventDateYear = "2026";
    const EventDateMonth = "Jan";
    const EventDateDay = "05";

    //Salesforce
    const SFURL = "https://amgenbioconnect--fullcopy1.sandbox.my.salesforce.com/";
    const SFUsername = "yvenka01@amgen.com.fullcopy1";
    const SFPassword = "Fullcopy.01";

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


    const page1 = await context.newPage();
    const SalesforcePage = new salesforcePage(page1);
    await SalesforcePage.login(SFURL, SFUsername, SFPassword);
    await SalesforcePage.openCase(AEPC_CaseNumber);
    await SalesforcePage.validateRelatedCases();
});
