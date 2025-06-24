import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import HeaderPDf from "./HeaderPDf";

const Page7 = ({ formData, truckDriverData }) => {
  return (
    <Page size="A4" style={styles.page}>
      {/* <HeaderPDf /> */}

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          I have the right to make a request to DAC, upon proper identification,
          to request the nature and substance of all information in the time of
          my request, including the sources of information; and the recipients
          of any reports on which DAC has previous the two year period preceding
          my request. I hereby consent to your obtaining the above information
          from DAC, and I agree that which DAC has or obtains, and my employment
          history with you if I am hired, will be supplied by DAC to other
          companies DAC Services. In conformity with 49 C.F.R. Part 40, I hereby
          authorize the carriers (Company/School) listed below to furnish to DAC
          on-behalf off listed above (Company), the following information
          concerning drug and alcohol tests: DOT drug and alcohol testing
          violations employment tests during the past two years: (I) the dates
          on which I tested positive for drugs and the drugs involved; (II) the
          results tested .04 or greater for alcohol and the test result level;
          (III) the dates on which I refused (including verified adulterated or
          to be tested for drugs and/or alcohol; (IV) and other violations of
          DOT drug and alcohol testing regulations; and (V) any information have
          received regarding violations of drug/alcohol testing regulations from
          my previous employers covered by DOT / fully understand that the
          information I authorize DAC to receive involves tests which were
          required by the Department of T if any carrier (company/school) listed
          below furnishes DAC with information concerning items (I) through (V)
          above, I also authorize (company/school) to release and furnish: (VI)
          the dates of my negative drug and/or alcohol tests and/or tests with
          results below two -year period; and (VII) the name and phone number of
          any substance abuse professional who evaluated me during the past.
          {`${truckDriverData?.selectedCompany?.name || `Freight For All`}`}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Applicant: Read the following statement, then sign and date
          Application Form
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          By signing below, I certify that I have read and fully understand this
          release that prior to signing I was given an opportunity to have those
          questions answered to my satisfaction, and that I executed this
          release voluntarily and with the knowledge that being released could
          affect my being hired. I further certify that all of the information
          that I have furnished on this form is true, and that I have listed
          every company for which I worked as a driver during the past three
          years, and every company for which I did drug and/or alcohol test
          during the past three years.
        </Text>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Applicant Name:</Text>
        <Text style={styles.input}>
          {formData?.form1?.applicantName?.value}
        </Text>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Social Security #:</Text>
        {/* <View style={styles.inputLine} />

         */}
        <Text style={styles.input}>{formData?.form1?.ssn?.value}</Text>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Date:</Text>
        <View style={styles.inputLine} />
      </View>

      <View style={styles.signatureSection}>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureLabel}>Applicant's Signature</Text>
      </View>

      {/* <Text style={styles.pageNumber}>8</Text> */}
    </Page>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "white",
    fontFamily: "Helvetica",
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#F59E0B",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  address: {
    fontSize: 16,
  },
  section: {
    marginTop: 10,

    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderBottom: 1,
    borderBottomColor: "black",
    fontSize: 13,
    marginRight: 10,
    maxWidth: "30%",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  signatureSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "black",
    marginBottom: 2,
    marginTop: 2,
    width: "50%",
  },
  signatureLabel: {
    fontSize: 10,
    marginTop: 5,
  },
  label: {
    fontSize: 10,
    marginRight: 5,
    width: 100,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 0,
    left: 0,
    textAlign: "center",
    fontSize: 12,
  },
  formField: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  inputLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    marginLeft: 5,
    paddingBottom: 2,
    maxWidth: "30%",
  },
  // signatureSection: {
  //   marginTop: 30,
  // },
});

export default Page7;
