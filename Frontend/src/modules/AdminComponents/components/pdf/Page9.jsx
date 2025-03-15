import React from "react";
import { Page, Text, View, StyleSheet, Document } from "@react-pdf/renderer";
import HeaderPDf from "./HeaderPDf";

const Page9 = ({ formData }) => (
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

    <View style={[styles.section, { marginTop: 30 }]}>
      <Text style={styles.sectionTitle}>Certification Of Violations</Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.paragraph}>
        Each driver shall furnish the list required in accordance with paragraph
        (a) of this section. If the driver has not been convicted of, or
        forfeited bond or collateral on account of, any violation which must be
        listed he/she shall so certify.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.paragraph}>
        I certify that the following is a true and complete list of traffic
        violations (other than parking violations) for which I have been
        convicted or forfeited bond or collateral during the past 12 months.
      </Text>
    </View>

    <View
      style={[
        styles.section,
        { display: "flex", alignItems: "center", justifyContent: "center" },
      ]}
    >
      <Text style={styles.sectionTitle}>§391.27 Record of violations</Text>
      <Text style={styles.sectionTitle}>DRIVER'S CERTIFICATION</Text>
    </View>

    {/* Table header */}
    <View style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.tableHeaderText}>Date</Text>
      </View>
      <View style={[styles.tableCell, { flex: 2 }]}>
        <Text style={styles.tableHeaderText}>Offense</Text>
      </View>
      <View style={[styles.tableCell, { flex: 2 }]}>
        <Text style={styles.tableHeaderText}>Location</Text>
      </View>
      <View style={[styles.tableCell, { flex: 2 }]}>
        <Text style={styles.tableHeaderText}>Type of Vehicle Operated</Text>
      </View>
    </View>

    {/* Table rows - empty or filled from data */}
    {formData?.form6?.noViolations
      ? // If no violations, show empty rows
        Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text></Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text></Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text></Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text></Text>
            </View>
          </View>
        ))
      : // If there are violations, map them
        (formData?.form6?.violationRecords || []).map((violation, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>
                {violation.date
                  ? new Date(violation.date).toLocaleDateString()
                  : ""}
              </Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text>{violation.offense || ""}</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text>{violation.location || ""}</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text>{violation.vehicleType || ""}</Text>
            </View>
          </View>
        ))}

    <View style={styles.signatureSection}>
      <View style={styles.signatureLine} />
      <Text style={styles.signatureLabel}>Driver's Signature and Date</Text>
    </View>

    <View style={styles.officeUseSection}>
      <Text style={styles.officeUseText}>Office Use Only</Text>
    </View>

    <View style={[styles.reviewSection, { marginTop: 40 }]}>
      <View style={styles.reviewRow}>
        <View style={styles.signatureLine} />
        <View style={[styles.signatureLine, { marginLeft: 50 }]} />
      </View>
      <View style={styles.reviewRow}>
        <Text style={styles.signatureLabel}>Reviewed By: Signature</Text>
        <Text style={[styles.signatureLabel, { marginLeft: 198 }]}>Title</Text>
      </View>
    </View>

    <Text style={styles.pageNumber}>10</Text>
  </Page>
);

// Styles extended to include table styles
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

export default Page9;
