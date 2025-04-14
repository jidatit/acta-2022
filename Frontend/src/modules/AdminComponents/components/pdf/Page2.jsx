import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Circle,
} from "@react-pdf/renderer";
import HeaderPDf from "./HeaderPDf";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "white",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
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
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  address: {
    fontSize: 16,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    marginTop: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginTop: 5,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.3,
  },
  tableContainer: {
    // marginHorizontal: 10,
  },
  table: {
    width: "100%",
    marginBottom: 30,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#666",
    paddingVertical: 6,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 6,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
    paddingHorizontal: 4,
  },
  tableCell: {
    fontSize: 12,
    flex: 1,
    paddingHorizontal: 4,
  },
  employmentSection: {
    // marginHorizontal: 10,
    marginBottom: 20,
  },
  employmentContainer: {
    marginTop: 30,
    marginBottom: 30,
    paddingBottom: 10,
  },
  subheader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  formGrid: {
    flexDirection: "row",
    marginVertical: 8,
  },
  formColumn: {
    flex: 1,
    paddingRight: 15,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    width: 100,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#666",
    fontSize: 13,
    paddingBottom: 2,
  },
  question: {
    fontSize: 12,
    marginBottom: 6,
    lineHeight: 1.3,
  },
  radioGroup: {
    flexDirection: "row",
    marginTop: 6,
    marginBottom: 6,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "black",
    marginLeft: 4,
  },
  checkedBox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "black",
    marginLeft: 4,
  },
  radioLabel: {
    fontSize: 12,
    marginRight: 2,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 12,
  },
});

// Create Document Component
const Page2 = ({ formData }) => (
  <Page size="A4" style={styles.page}>
    {/* Header */}
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
    {/* <HeaderPDf /> */}

    {/* Previous Addresses Section */}
    <View
      style={{
        marginBottom: 30,
        marginTop: 30,
      }}
    >
      <Text style={styles.sectionTitle}>Previous Addresses</Text>
      <View style={styles.tableContainer}>
        <Text
          style={[
            styles.paragraph,
            { fontWeight: 700, marginBottom: 15, marginTop: 15 },
          ]}
        >
          List all address in previous 3 years
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>Street</Text>
            <Text style={styles.tableCell}>City</Text>
            <Text style={styles.tableCell}>State</Text>
            <Text style={styles.tableCell}>ZIP</Text>
            <Text style={styles.tableCell}>How Long</Text>
          </View>
          {formData?.form2?.previousAddresses?.map((address, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>
                {address?.street12?.value || ""}{" "}
                {address?.street22?.value ? `, ${address.street22.value}` : ""}
              </Text>
              <Text style={styles.tableCell}>
                {address?.city22?.value || ""}
              </Text>
              <Text style={styles.tableCell}>
                {address?.state22?.value || ""}
              </Text>
              <Text style={styles.tableCell}>
                {address?.zipCode22?.value || ""}
              </Text>
              <Text style={styles.tableCell}></Text>
            </View>
          ))}
        </View>
      </View>
    </View>

    {/* Employment History Section */}
    <View style={styles.employmentSection}>
      <Text style={styles.sectionTitle}>Employment History</Text>
      {formData?.form3?.EmploymentHistory?.map((job, index) => (
        <View key={index} style={styles.employmentContainer}>
          <Text style={styles.subheader}>Employer/Lessor</Text>
          <View style={styles.formGrid}>
            <View style={styles.formColumn}>
              <View style={styles.formRow}>
                <Text style={styles.label}>Company Name:</Text>
                <Text style={styles.input}>
                  {job?.companyName31?.value || ""}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Street:</Text>
                <Text style={styles.input}>{job?.street31?.value || ""}</Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>City, State:</Text>
                <Text style={styles.input}>
                  {job?.city31?.value || ""}, {job?.zipCode31?.value || ""}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>ZIP Code:</Text>
                <Text style={styles.input}>{job?.zipCode31?.value || ""}</Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Contact Person:</Text>
                <Text style={styles.input}>
                  {job?.contactPerson?.value || ""}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Phone #:</Text>
                <Text style={styles.input}>{job?.phone31?.value || ""}</Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>FAX #:</Text>
                <Text style={styles.input}>{job?.fax1?.value || ""}</Text>
              </View>
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.question}>
                  Were you subject to the FMCSRs* while employed?
                </Text>
                <View style={styles.radioGroup}>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>Yes</Text>
                    <View
                      style={
                        job?.subjectToFMCSRs?.value === "yes"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>No</Text>
                    <View
                      style={
                        job?.subjectToFMCSRs?.value === "no"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.formColumn}>
              <View style={styles.formRow}>
                <Text style={styles.label}>From:</Text>
                <Text style={styles.input}>{job?.from31?.value || ""}</Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>To:</Text>
                <Text style={styles.input}>{job?.to31?.value || ""}</Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Position:</Text>
                <Text style={styles.input}>{job?.position?.value || ""}</Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Salary:</Text>
                <Text style={styles.input}>{job?.salary?.value || ""}</Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Reason for leaving:</Text>
                <Text style={styles.input}>
                  {job?.leavingReason?.value || ""}
                </Text>
              </View>
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.question}>
                  Was your job designated as a safety-sensitive function in any
                  DOT-regulated mode subject to the drug and alcohol testing
                  requirements?
                </Text>
                <View style={styles.radioGroup}>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>Yes</Text>
                    <View
                      style={
                        job?.jobDesignatedAsSafetySensitive?.value === "yes"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>No</Text>
                    <View
                      style={
                        job?.jobDesignatedAsSafetySensitive?.value === "no"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
    {/* <Text style={styles.pageNumber}>2</Text> */}
  </Page>
);

export default Page2;
