import React from "react";
import { Page, Text, View, StyleSheet, Document } from "@react-pdf/renderer";
import HeaderPDf from "./HeaderPDf";

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
    marginBottom: 10,
  },
  signatureSection: {
    marginTop: 30,
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
  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "black",
    marginHorizontal: 10,
  },
  tableCell: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "black",
    minHeight: 25,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  officeUseSection: {
    marginTop: 30,
    backgroundColor: "black",
    padding: 5,
  },
  officeUseText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  reviewSection: {
    marginTop: 30,
  },
  reviewRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});

// Page 9: Certification Of Compliance With Driver License Requirements
const Page8 = ({ formData }) => (
  <Page size="A4" style={styles.page}>
    {/* <View style={styles.header}>
      <View>
        <Text style={styles.companyName}>FFA Inc</Text>
        <Text style={styles.address}>3506 Bristol Ln, Elk Grove</Text>
        <Text style={styles.address}>Village, IL 60007</Text>
      </View>
      <View style={styles.logo}>
        <Text style={styles.logoText}>FFA</Text>
      </View>
    </View> */}
    <HeaderPDf />

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Certification Of Compliance With Driver License Requirements
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.paragraph}>
        DRIVER REQUIREMENTS Parts 383 and 391 of the Federal Motor Carrier
        Safety Regulations contain some requirements that you as a driver must
        comply with. These requirements are in effect as of July 1st, 1987.
      </Text>
      <Text style={styles.paragraph}>They are as follows:</Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.paragraph}>
        1. You, as a commercial vehicle driver, may not posses more than one
        license. The only exception is if a state requires you to have more than
        one license. This exception is allowed until January I, 1990. If you
        currently have more than one license, you should keep the license from
        your state of residence and return the additional licenses to the states
        that issued them. DESTROYING a license does not close the record in the
        state that issued it; you must notify the state. If a multiple license
        has been lost, stolen, or destroyed, you should close your record by
        notifying the state of issuance that you no longer want to be licensed
        by that state.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.paragraph}>
        2. Sections 392.42 and 383.33 of the Federal Motor Carrier Safety
        Regulations require you to notify your employer the NEXT BUSINESS DAY of
        any revocation or suspension of your driver's license. In addition,
        Section 383.31 requires that any time you violate a state or local
        traffic law (other than parking), you must report it to your employing
        motor carrier and the state that issued your license within 30 days.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.paragraph}>
        DRIVER CERTIFICATION: I certify that I have read and understood the
        above requirements.
      </Text>
      <Text style={styles.paragraph}>
        The following license is the only one I will possess:
      </Text>
    </View>

    <View style={styles.formField}>
      <Text style={styles.label}>Driver's Name:</Text>
      <View style={styles.inputLine}>
        <Text>{formData?.form5?.driverLicensePermit?.[0]?.fullName || ""}</Text>
      </View>
    </View>

    <View style={styles.formField}>
      <Text style={styles.label}>Driver's License #:</Text>
      <View style={styles.inputLine}>
        <Text>
          {formData?.form5?.driverLicensePermit?.[0]?.licenseNumber || ""}
        </Text>
      </View>
    </View>

    <View style={styles.formField}>
      <Text style={styles.label}>State:</Text>
      <View style={styles.inputLine}>
        <Text>{formData?.form5?.driverLicensePermit?.[0]?.state || ""}</Text>
      </View>
    </View>

    <View style={styles.formField}>
      <Text style={styles.label}>Date:</Text>
      <View style={styles.inputLine}>
        {/* <Text>
          {formData?.form5?.submittedAt
            ? new Date(
                formData.form5.submittedAt.seconds * 1000
              ).toLocaleDateString()
            : ""}
        </Text> */}
      </View>
    </View>

    <View style={styles.signatureSection}>
      <View style={styles.signatureLine} />
      <Text style={styles.signatureLabel}>Applicant's Signature and Date</Text>
    </View>

    <Text style={styles.pageNumber}>9</Text>
  </Page>
);

export default Page8;
