import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import HeaderPDf from "./HeaderPDf";

// Authority to Release Information Page
export const Page21 = ({ formData }) => {
  console.log("formData", formData);
  return (
    <Page size="A4" style={styles.page}>
      {/* <HeaderPDf /> */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Authority to Release Information
        </Text>
      </View>

      <View style={styles.section}>
        {/* Name placed above the blank line */}
        <Text
          style={{
            textAlign: "left",
            fontSize: 14,
            fontWeight: 10,
            marginBottom: -10,
            marginLeft: 10,
          }}
        >
          {formData?.form1?.applicantName?.value || ""}
        </Text>

        {/* Main paragraph with blank line */}
        <Text style={styles.paragraph}>
          I, _________________________________, hereby consent and authorize
          StarPoint Screening or its agents to prepare driving and background
          records that are deemed to have a bearing on my job performance. This
          consumer report will be used for employment purposes as it is defined
          in the Fair Credit Reporting Act and in accordance with Public Law 18
          USC 2721 et. Seq., "Federal Drivers Privacy Protection Act", and is
          intended to constitute "written consent" as required by this Act.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          I am providing the following information for the preparation and
          proper verification of the consumer report:
        </Text>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Full Name:</Text>
        <Text style={styles.fieldValue}>
          {formData?.form1?.applicantName?.value || ""}
        </Text>
      </View>

      <View style={[styles.formField]}>
        <Text style={styles.label}>Current Address:</Text>
        <Text style={styles.fieldValue}>
          {[
            formData?.form1?.street1?.value,
            formData?.form1?.city11?.value,
            formData?.form1?.state11?.value,
          ]
            .filter(Boolean) // removes any undefined/null/empty parts
            .join(", ")}
        </Text>
      </View>

      <View style={(styles.formField, { marginTop: 10 })}>
        <Text style={styles.label}></Text>
        <Text style={styles.fieldValue}></Text>
      </View>

      <View style={[styles.formField, { marginTop: 20 }]}>
        <Text style={styles.label}>Date of Birth:</Text>
        <Text style={styles.fieldValue}>
          {formData?.form1?.DOB?.value
            ? new Date(formData.form1.DOB.value).toISOString().split("T")[0]
            : ""}
        </Text>
      </View>

      <View style={[styles.formField, { marginTop: 20 }]}>
        <Text style={styles.label}>Driver's License number:</Text>
        <Text style={styles.fieldValue}>
          {formData?.form1?.CDL?.value || ""}
        </Text>
      </View>

      <View style={[styles.formField, { marginTop: 20 }]}>
        <Text style={styles.label}>
          State of issuance &nbsp;&nbsp;&nbsp;(DL):
        </Text>
        <Text style={styles.fieldValue}>
          {formData?.form1?.CDLState?.value || ""}
        </Text>
      </View>

      <View style={[styles.formField, { marginTop: 20 }]}>
        <Text style={styles.label}>Signature:</Text>
        <Text style={styles.fieldValue}></Text>
      </View>

      <View style={[styles.formField, { marginTop: 20 }]}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.fieldValue}></Text>
      </View>
    </Page>
  );
};

// Styles matching your existing code
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
  formField: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    marginRight: 5,
    width: 150,
  },
  fieldValue: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingBottom: 2,
    fontSize: 12,
  },
});
