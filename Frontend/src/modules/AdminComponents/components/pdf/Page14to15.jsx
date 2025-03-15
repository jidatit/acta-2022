import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import HeaderPDf from "./HeaderPDf";

// Page 15 - Hours Worked Form
export const Page14 = ({ formData }) => {
  const onDutyHours = formData?.form8?.onDutyHours?.[0] || {};

  return (
    <Page size="A4" style={styles.page}>
      <HeaderPDf />

      <View
        style={[
          styles.tableContainer,
          {
            marginTop: 50,
          },
        ]}
      >
        {/* Header Row */}
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.tableHeaderText}>Day</Text>
          </View>
          {[...Array(7)].map((_, index) => (
            <View style={styles.tableCell} key={index}>
              <Text style={styles.tableHeaderText}>
                {index === 0 ? "1\n(Yesterday)" : index + 1}
              </Text>
            </View>
          ))}
          <View style={styles.tableCell}>
            <Text style={styles.tableHeaderText}>Total Hours</Text>
          </View>
        </View>

        {/* Date Row */}
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.tableHeaderText}>Date</Text>
          </View>
          {[...Array(7)].map((_, index) => (
            <View style={styles.tableCell} key={index}>
              <Text style={styles.tableCellText}>
                {onDutyHours?.[`day${index + 1}`]?.value
                  ? new Date(
                      onDutyHours[`day${index + 1}`].value
                    ).toLocaleDateString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""}
              </Text>
            </View>
          ))}
          <View style={styles.tableCell}>
            <Text style={styles.tableCellText}></Text>
          </View>
        </View>

        {/* Hours Worked Row */}
        <View style={[styles.tableRow, { borderBottomWidth: 1 }]}>
          <View style={styles.tableCell}>
            <Text style={styles.tableHeaderText}>Hours Worked</Text>
          </View>
          {[...Array(7)].map((_, index) => (
            <View style={styles.tableCell} key={index}>
              <Text style={styles.tableCellText}>
                {onDutyHours?.[`day${index + 1}HoursWorked`]?.value || ""}
              </Text>
            </View>
          ))}
          <View style={styles.tableCell}>
            <Text style={styles.tableCellText}>
              {onDutyHours?.TotalHours?.value || ""}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          I hereby certify that the information given above is correct to the
          best of my knowledge and belief, and that I was last relieved from
          work at
        </Text>
      </View>

      <View style={styles.signatureSection}>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
            maxWidth: "60%",
          }}
        >
          <View style={{ flex: 1 }}>
            {/* <View style={styles.signatureLine} /> */}
            <View style={[styles.signatureLine, { maxWidth: "100%" }]} />

            <Text style={styles.signatureLabel}>Time</Text>
          </View>
          <Text
            style={{
              marginHorizontal: 10,
              fontSize: "10px",
              marginBottom: -40,
            }}
          >
            On
          </Text>
          <View style={{ flex: 1 }}>
            {/* <View style={styles.signatureLine} /> */}
            <View style={[styles.signatureLine, { maxWidth: "100%" }]} />

            <Text style={styles.signatureLabel}>Date</Text>
          </View>
        </View>

        <View
          style={[styles.signatureLine, { maxWidth: "40%", marginTop: 20 }]}
        />
        <Text style={styles.signatureLabel}>
          Applicant's Signature and Date
        </Text>
      </View>

      {/* <Text style={styles.pageNumber}>15</Text> */}
    </Page>
  );
};

export const Page15 = ({ formData }) => {
  // Extract data from formData for Page 16
  const compensatedWork = formData?.form9?.compensatedWork?.[0] || {};
  // console.log("compensatedWork", compensatedWork);
  const currentlyWorking = compensatedWork?.currentlyWorking?.value || "";
  // console.log("currentlyWorking", currentlyWorking);

  const workingForAnotherEmployer =
    compensatedWork?.workingForAnotherEmployer?.value || "";
  currentlyWorking;
  // console.log("workingForAnotherEmployer", workingForAnotherEmployer);

  return (
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
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Driver Certification for Other Compensated Work
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          INSTRUCTIONS: When employed by a motor carrier, a driver must report
          to the carrier all on-duty time including time working for other
          employers. The definition of on-duty time found in Section 395.2
          paragraphs (8) and (9) of the Federal Motor Carrier Safety Regulations
          includes time performing any other work in the capacity of, or in the
          employ or service of, a common, contract private motor carrier, also
          performing any compensated work for any non motor carrier entity.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          Are you currently working for another employer?
        </Text>
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 40,
            }}
          >
            <View
              style={[
                styles.checkbox,
                currentlyWorking === "yes" && styles.checkboxChecked,
              ]}
            >
              {currentlyWorking === "yes" && (
                <Text style={styles.checkboxText}>✓</Text>
              )}
            </View>
            <Text style={styles.checkboxLabel}>Yes</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[
                styles.checkbox,
                currentlyWorking === "no" && styles.checkboxChecked,
              ]}
            >
              {currentlyWorking === "no" && (
                <Text style={styles.checkboxText}>✓</Text>
              )}
            </View>
            <Text style={styles.checkboxLabel}>No</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          At this time do you intend to work for another employer while still
          employed by this company?
        </Text>
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 40,
            }}
          >
            <View
              style={[
                styles.checkbox,
                workingForAnotherEmployer === "yes" && styles.checkboxChecked,
              ]}
            >
              {workingForAnotherEmployer === "yes" && (
                <Text style={styles.checkboxText}>✓</Text>
              )}
            </View>
            <Text style={styles.checkboxLabel}>Yes</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[
                styles.checkbox,
                workingForAnotherEmployer === "no" && styles.checkboxChecked,
              ]}
            >
              {workingForAnotherEmployer === "no" && (
                <Text style={styles.checkboxText}>✓</Text>
              )}
            </View>
            <Text style={styles.checkboxLabel}>No</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          I hereby certify that the information given above is true and I
          understand that once I become employed with this company, if I begin
          working for any additional employer(s) for compensation that I must
          inform this company immediately of such employment activity.
        </Text>
      </View>

      <View style={styles.signatureSection}>
        {/* <View style={styles.signatureLine} /> */}
        <View style={[styles.signatureLine, { maxWidth: "40%" }]} />

        <Text style={styles.signatureLabel}>Applicant's Name</Text>

        <View style={{ marginTop: 20 }}>
          {/* <View style={styles.signatureLine} /> */}
          <View style={[styles.signatureLine, { maxWidth: "40%" }]} />

          <Text style={styles.signatureLabel}>
            Applicant's Signature and Date
          </Text>
        </View>

        <View style={{ marginTop: 40 }}>
          {/* <View style={styles.signatureLine} /> */}
          <View style={[styles.signatureLine, { maxWidth: "40%" }]} />

          <Text style={styles.signatureLabel}>
            Company Representative and Date
          </Text>
        </View>
      </View>

      <Text style={styles.pageNumber}>16</Text>
    </Page>
  );
};

// Combined styles
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
    width: "100%",
  },
  signatureLabel: {
    fontSize: 10,
    marginTop: 5,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 0,
    left: 0,
    textAlign: "center",
    fontSize: 12,
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "black",
  },
  tableCell: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "black",
    minHeight: 30,
    justifyContent: "center",
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCellText: {
    fontSize: 10,
    textAlign: "center",
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "black",
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "black",
  },
  checkboxText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 12,
  },
});
