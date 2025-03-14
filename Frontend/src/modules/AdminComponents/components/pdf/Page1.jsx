import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  address: {
    fontSize: 16,
  },

  paragraph: {
    fontSize: 13,
    marginBottom: 10,
    lineHeight: 1.3,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  formColumn: {
    flexDirection: "column",
    marginBottom: 10,
  },
  twoColumnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    width: 120,
  },
  input: {
    flex: 1,
    borderBottom: 1,
    borderBottomColor: "#999999",
    fontSize: 13,
    marginRight: 10,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 6,
    paddingVertical: 6,
    justifyContent: "center",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  radioLabel: {
    fontSize: 13,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "black",
    marginLeft: 2,
  },
  checkedBox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "black",
    marginLeft: 2,
  },
  column: {
    flex: 1,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 10,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 10,
  },
  grid: {
    flexDirection: "row",
    marginTop: 10,
  },
  question: {
    fontSize: 13,
    marginBottom: 4,
    lineHeight: 1.3,
  },
  longQuestion: {
    fontSize: 13,
    marginBottom: 4,
    width: "90%",
    lineHeight: 1.3,
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    right: 0,
    left: 0,
    textAlign: "center",
    fontSize: 13,
  },
});

// Create Document Component
const Page1 = ({ formData }) => {
  // Helper function for formatting date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Helper function for formatting phone number
  const formatPhone = (phoneString) => {
    if (!phoneString) return "";
    return phoneString; // Implement custom formatting if needed
  };

  return (
    <>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View>
            <Text style={styles.companyName}>FFA Inc</Text>
            <Text style={styles.address}>3506 Bristol Ln, Elk Grove</Text>
            <Text style={styles.address}>Village, IL 60007</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>FFA</Text>
            </View>
            <Text style={styles.title}>Driver Application</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View
          style={{
            marginTop: 10,
          }}
        >
          <Text style={styles.paragraph}>
            Freight For All is in compliance with Federal and State equal
            employment opportunity laws, qualified applicants are considered for
            all positions without regard to race, color, religion, sex, national
            origin, age, marital status and non-job related disabilities.
          </Text>

          <View style={styles.formRow}>
            <Text style={styles.label}>Applicant Full Name:</Text>
            <Text style={styles.input}>
              {formData?.form1?.applicantName?.value}
            </Text>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={[styles.formRow, { flex: 1 }]}>
              <Text style={styles.label}>Application Date:</Text>
              <Text style={styles.input}>
                {formData?.form1?.appliedDate?.value
                  ? formatDate(formData?.form1?.appliedDate?.value)
                  : ""}
              </Text>
            </View>
            <View style={[styles.formRow, { flex: 1 }]}>
              <Text style={styles.label}>Position Applied For:</Text>
              <Text style={styles.input}>
                {formData?.form1?.positionApplied?.value}
              </Text>
            </View>
          </View>

          <View style={styles.grid}>
            <View style={styles.leftColumn}>
              <View style={styles.formRow}>
                <Text style={styles.label}>SSN:</Text>
                <Text style={styles.input}>{formData?.form1?.ssn?.value}</Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Date Of Birth:</Text>
                <Text style={styles.input}>
                  {formData?.form1?.DOB?.value
                    ? formatDate(formData?.form1?.DOB?.value)
                    : ""}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Street 1:</Text>
                <Text style={styles.input}>
                  {formData?.form1?.street1?.value}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Street 2:</Text>
                <Text style={styles.input}>
                  {formData?.form1?.street2?.value}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>City:</Text>
                <Text style={styles.input}>
                  {formData?.form1?.city11?.value}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>State:</Text>
                <Text style={styles.input}>
                  {formData?.form1?.state11?.value}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Zip Code:</Text>
                <Text style={styles.input}>
                  {formData?.form1?.zipCode11?.value}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Cell Phone #:</Text>
                <Text style={styles.input}>
                  {formData?.form1?.cellPhone?.value
                    ? formatPhone(formData?.form1?.cellPhone?.value)
                    : ""}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Emergency Contact:</Text>
                <Text style={styles.input}>
                  {formData?.form1?.EmergencyContact?.value}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Relationship:</Text>
                <Text style={styles.input}>
                  {formData?.form1?.Relationship?.value}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Emergency Phone #:</Text>
                <Text style={styles.input}></Text>
              </View>
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.formRow}>
                <Text style={styles.label}>Currently Employed:</Text>
                <View style={styles.radioGroup}>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>Yes</Text>
                    <View
                      style={
                        formData?.form1?.currentlyEmployed?.value === "yes"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>No</Text>
                    <View
                      style={
                        formData?.form1?.currentlyEmployed?.value === "no"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                </View>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>
                  If not, how long since leaving last employment?
                </Text>
                <Text style={styles.input}></Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Who referred you?</Text>
                <Text style={styles.input}>
                  {formData?.form1?.referredBy?.value}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Rate of pay expected:</Text>
                <Text style={styles.input}>
                  {formData?.form1?.payExpected?.value}
                </Text>
              </View>

              <View style={[styles.formRow, { marginTop: 4, marginBottom: 4 }]}>
                <Text style={styles.label}>
                  Do you have the legal right to work in the United States?
                </Text>
                <View style={styles.radioGroup}>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>Yes</Text>
                    <View
                      style={
                        formData?.form1?.legalRightToWork?.value === "yes"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>No</Text>
                    <View
                      style={
                        formData?.form1?.legalRightToWork?.value === "no"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                </View>
              </View>

              <View style={styles.formRow}>
                <Text style={styles.label}>CDL #:</Text>
                <Text style={styles.input}>{formData?.form1?.CDL?.value}</Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>CDL State:</Text>
                <Text style={styles.input}>
                  {formData?.form1?.CDLState?.value}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>CDL Class:</Text>
                <Text style={styles.input}>
                  {formData?.form1?.CDLClass?.value}
                </Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>CDL Expiration Date:</Text>
                <Text style={styles.input}>
                  {formData?.form1?.CDLExpirationDate?.value
                    ? formatDate(formData?.form1?.CDLExpirationDate?.value)
                    : ""}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.grid}>
            <View style={styles.leftColumn}>
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.question}>
                  Have you ever been denied a license, permit or privilege to
                  operate a motor vehicle?
                </Text>
                <View style={styles.radioGroup}>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>Yes</Text>
                    <View
                      style={
                        formData?.form1?.EverBeenDeniedALicense?.value === "yes"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>No</Text>
                    <View
                      style={
                        formData?.form1?.EverBeenDeniedALicense?.value === "no"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                </View>
              </View>

              <View style={{ marginBottom: 15 }}>
                <Text style={styles.question}>
                  Have any license, permit or privilege ever been suspended or
                  revoked?
                </Text>
                <View style={styles.radioGroup}>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>Yes</Text>
                    <View
                      style={
                        formData?.form1?.PermitPrivilegeOfLicense?.value ===
                        "yes"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>No</Text>
                    <View
                      style={
                        formData?.form1?.PermitPrivilegeOfLicense?.value ===
                        "no"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.rightColumn}>
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.longQuestion}>
                  Have you ever tested positive or refused a DOT drug or alcohol
                  pre employment test within the past 3 years from an employer
                  who did not hire you?
                </Text>
                <View style={styles.radioGroup}>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>Yes</Text>
                    <View
                      style={
                        formData?.form1?.TestedPositiveOrRefusedDotDrug
                          ?.value === "yes"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>No</Text>
                    <View
                      style={
                        formData?.form1?.TestedPositiveOrRefusedDotDrug
                          ?.value === "no"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                </View>
              </View>

              <View style={{ marginBottom: 15 }}>
                <Text style={styles.question}>
                  Have you ever been convicted of a felony?
                </Text>
                <View style={styles.radioGroup}>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>Yes</Text>
                    <View
                      style={
                        formData?.form1?.EverConvictedOfFelony?.value === "yes"
                          ? styles.checkedBox
                          : styles.checkbox
                      }
                    ></View>
                  </View>
                  <View style={styles.radioOption}>
                    <Text style={styles.radioLabel}>No</Text>
                    <View
                      style={
                        formData?.form1?.EverConvictedOfFelony?.value === "no"
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

        {/* <Text style={styles.pageNumber}>1</Text> */}
      </Page>
    </>
  );
};

export default Page1;
