const AEPCTestData = {
    AEPCURL: "https://www.dev.amgenaepcextreporting.com/",
    PatFN: "TestPatient",
    PatLN: "User",
    PatPhone: "1234567890",
    PatEmail: "pattest@email.com",
    PatAddress: "test address patient",
    PatState: "Alabama",
    PatCity: "TestCity",
    PatPostalCode: "54321 MTH",
    PatDOBYear: "2000",
    PatDOBMonth: "Jan",
    PatDOBDay: "05",
    PatGender: "Male",
    HCPFN: "TestHCP",
    HCPLN: "UserHCP",
    HCPPhone: "5432154321",
    HCPEmail: "hcptest@email.com",
    HCPType: "Physician",
    Product: "Enbrel",
    DosageForm: "Sureclick autoinjector 1.5",
    ProductStopYear: "2026",
    ProductStopMonth: "Jan",
    ProductStopDay: "05",
    LotBatchNumber: "1011763",
    AEDescription: "Demo of AEPC submission -- AE",
    PCDescription: `1) What is the issue, including a full description and when it was observed (during preparation, during administration or after use): Testing of PC Section
2) How many units are involved (if multiple units include the lot/serial# if different lots were used): Testing of PC Section
3) Who attempted the administration, HCP/Patient/Caregiver/unknown:Testing of PC Section
4) User experience with the product/delivery system (first time,1-3 mon, 4-6 mon, 7-9 mon, 10-12 mon,> 12 mon, unknown):Testing of PC Section
    If first time user, how were they trained and by whom?Testing of PC Section
    For SureClick Autoinjector/pre-filled pen: If use < 6 months, did the administrator have previous experience with an auto injector/pre-filled pen type of device?Testing of PC Section
5) Did the administrator follow the instructions of use? If no, clarify:Testing of PC Section
6) Was the package/carton received sealed, if no provide details:Testing of PC Section`,
    EventDateYear: "2026",
    EventDateMonth: "Jan",
    EventDateDay: "05"
};

export default AEPCTestData;
