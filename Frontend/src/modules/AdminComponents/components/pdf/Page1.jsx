import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF (mimicking Tailwind CSS)
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF", // bg-white
    padding: 20, // p-5
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", // justify-between
    alignItems: "center", // items-center
    paddingBottom: 10, // pb-2
    borderBottom: "1px solid #1F2937", // border-b border-gray-800
    marginBottom: 20, // mb-5
  },
  headerText: {
    fontSize: 24, // text-2xl
    fontWeight: "bold", // font-bold
  },
  headerSubtext: {
    fontSize: 12, // text-sm
    color: "#374151", // text-gray-700
  },
  logoContainer: {
    width: 64, // w-16
    height: 64, // h-16
    borderRadius: 32, // rounded-full
    backgroundColor: "#000000", // bg-black
    justifyContent: "center", // justify-center
    alignItems: "center", // items-center
  },
  logoText: {
    color: "#F59E0B", // text-yellow-500
    fontWeight: "bold", // font-bold
  },
  section: {
    marginBottom: 20, // mb-5
  },
  formField: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8, // mb-2
  },
  formLabel: {
    width: 160, // w-40
    fontSize: 12, // text-sm
  },
  formValue: {
    flex: 1,
    borderBottom: "1px solid #9CA3AF", // border-b border-gray-400
    paddingLeft: 8, // pl-2
    fontSize: 12, // text-sm
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // gap-4
  },
  checkbox: {
    width: 16, // w-4
    height: 16, // h-4
    border: "1px solid #000000", // border border-black
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxFilled: {
    backgroundColor: "#000000", // bg-black
  },
  grid: {
    flexDirection: "row",
    gap: 32, // gap-8
  },
  col: {
    flex: 1,
  },
});

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

// Helper function to format phone numbers
const formatPhone = (phone) => {
  if (!phone || phone.length !== 10) return phone;
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
};

const Page1 = ({ formData }) => (
  <>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>FFA Inc</Text>
          <Text style={styles.headerSubtext}>3506 Bristol Ln, Elk Grove</Text>
          <Text style={styles.headerSubtext}>Village, IL 60007</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>FFA</Text>
          </View>
          <Text style={styles.headerText}>Driver Application</Text>
        </View>
      </View>

      {/* Compliance Text */}
      <View style={styles.section}>
        <Text style={{ fontSize: 12, marginBottom: 24 }}>
          Freight For All is in compliance with Federal and State equal
          employment opportunity laws, qualified applicants are considered for
          all positions without regard to race, color, religion, sex, national
          origin, age, marital status and non-job related disabilities.
        </Text>
      </View>

      {/* Applicant Information */}
      <View style={styles.section}>
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Applicant Full Name:</Text>
          <Text style={styles.formValue}>
            {formData?.form1?.applicantName?.value}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 32 }}>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Application Date:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.appliedDate?.value
                ? formatDate(formData?.form1?.appliedDate?.value)
                : ""}
            </Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Position Applied For:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.positionApplied?.value}
            </Text>
          </View>
        </View>
      </View>

      {/* Two-Column Layout */}
      <View style={styles.grid}>
        {/* Left Column */}
        <View style={styles.col}>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>SSN:</Text>
            <Text style={styles.formValue}>{formData?.form1?.ssn?.value}</Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Date Of Birth:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.DOB?.value
                ? formatDate(formData?.form1?.DOB?.value)
                : ""}
            </Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Street 1:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.street1?.value}
            </Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Street 2:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.street2?.value}
            </Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>City:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.city11?.value}
            </Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>State:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.state11?.value}
            </Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Zip Code:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.zipCode11?.value}
            </Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Cell Phone #:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.cellPhone?.value
                ? formatPhone(formData?.form1?.cellPhone?.value)
                : ""}
            </Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Emergency Contact:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.EmergencyContact?.value}
            </Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Relationship:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.Relationship?.value}
            </Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Emergency Phone #:</Text>
            <Text style={styles.formValue}></Text>
          </View>
        </View>

        {/* Right Column */}
        <View style={styles.col}>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Currently Employed:</Text>
            <View style={styles.checkboxContainer}>
              <View
                style={[
                  styles.checkbox,
                  formData?.form1?.currentlyEmployed?.value === "yes" &&
                    styles.checkboxFilled,
                ]}
              />
              <Text>Yes</Text>
              <View
                style={[
                  styles.checkbox,
                  formData?.form1?.currentlyEmployed?.value === "no" &&
                    styles.checkboxFilled,
                ]}
              />
              <Text>No</Text>
            </View>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>
              If not, how long since leaving last employment?
            </Text>
            <Text style={styles.formValue}></Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Who referred you?</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.referredBy?.value}
            </Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Rate of pay expected:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.payExpected?.value}
            </Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>
              Do you have the legal right to work in the United States?
            </Text>
            <View style={styles.checkboxContainer}>
              <View
                style={[
                  styles.checkbox,
                  formData?.form1?.legalRightToWork?.value === "yes" &&
                    styles.checkboxFilled,
                ]}
              />
              <Text>Yes</Text>
              <View
                style={[
                  styles.checkbox,
                  formData?.form1?.legalRightToWork?.value === "no" &&
                    styles.checkboxFilled,
                ]}
              />
              <Text>No</Text>
            </View>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>CDL #:</Text>
            <Text style={styles.formValue}>{formData?.form1?.CDL?.value}</Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>CDL State:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.CDLState?.value}
            </Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>CDL Class:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.CDLClass?.value}
            </Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>CDL Expiration Date:</Text>
            <Text style={styles.formValue}>
              {formData?.form1?.CDLExpirationDate?.value
                ? formatDate(formData?.form1?.CDLExpirationDate?.value)
                : ""}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </>
);

export default Page1;
