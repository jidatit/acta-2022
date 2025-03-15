import React from "react";
import {
  Page,
  Text,
  View,
  StyleSheet,
  Document,
  Svg,
  Path,
  Circle,
} from "@react-pdf/renderer";
import HeaderPDf from "./HeaderPDf";

// Page 11: Previous Pre-Employment Employee Alcohol and Drug Testing Statement
export const Page10 = ({ formData }) => {
  // Extract alcohol and drug test data
  const alcoholDrugTest = formData?.form7?.AlcoholDrugTest?.[0] || {};
  const testedPositiveEver =
    alcoholDrugTest?.testedPositiveEver?.value === "yes";
  const dotCompletion = alcoholDrugTest?.DOTCompletion?.value === "yes";

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

      <View style={[styles.section, { marginTop: 50 }]}>
        <Text style={styles.sectionTitle}>
          Previous Pre-Employment Employee Alcohol and Drug Testing Statement
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          Sec. 40.25() As the employer, you must also ask the employee whether
          he or she has tested positive, or refused to test, on any pre-
          employment drug or alcohol test administered by an employer to which
          the employee applied for, but did not obtain, safety sensitive
          transportation work covered by DOT agency, drug and alcohol testing
          rules during the past two years.
        </Text>
        <Text style={styles.paragraph}>
          If the employee admits that he or she had a positive test or refusal
          to test, you must not use the employee to perform safety-sensitive
          functions for you, until and unless the employee documents successful
          completion of the return-to-duty process, (see Sec. 40.25(b)(5) and
          (e))
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.instructionText}>
          TO BE READ AND SIGNED BY APPLICANT
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          Have you ever been tested positive or refused to be tested on any
          pre-employment drug test in which you were not hired during the past
          two years?
        </Text>
      </View>

      <View style={styles.checkboxRow}>
        <View style={styles.checkboxContainer}>
          <View
            style={
              testedPositiveEver ? styles.checkboxChecked : styles.checkbox
            }
          />
          <Text style={styles.checkboxLabel}>Yes</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <View
            style={
              !testedPositiveEver ? styles.checkboxChecked : styles.checkbox
            }
          />
          <Text style={styles.checkboxLabel}>No</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          If you answered YES, can you provide or obtain on our request proof
          that you have successfully completed the DOT return-to-duty
          requirements?
        </Text>
      </View>

      <View style={styles.checkboxRow}>
        <View style={styles.checkboxContainer}>
          <View
            style={dotCompletion ? styles.checkboxChecked : styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>Yes</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <View
            style={!dotCompletion ? styles.checkboxChecked : styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>NO</Text>
        </View>
      </View>

      <View style={styles.signatureSection}>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureLabel}>Applicant's Name</Text>

        <View style={[styles.signatureLine, { marginTop: 20 }]} />
        <Text style={styles.signatureLabel}>
          Applicant's Signature and Date
        </Text>
      </View>

      <Text style={styles.pageNumber}>11</Text>
    </Page>
  );
};

// Page 12: Consent Form Pre-Employment Urinalysis (First Part)
export const Page11 = ({ formData }) => (
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
      <Text style={styles.sectionTitle}>
        Consent Form Pre-Employment Urinalysis
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.instructionText}>
        TO BE READ AND SIGNED BY APPLICANT
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.paragraph}>
        I understand that as required by the Federal Motor Carrier Safety
        Regulations Title 49 United States Code of Federal Regulations Section
        391,103, and company policy, all prospective drivers must submit to a
        controlled substances test.
      </Text>
      <Text style={styles.paragraph}>
        A urine sample will be collected and tested for controlled substances.
      </Text>
      <Text style={styles.paragraph}>
        I also understand that if test positive for use of controlled
        substances, I am not medically qualified to operate a commercial motor
        vehicle. The results of the drug test will be maintained by the Medical
        Review Officer or the company who will report whether the test results
        were negative or positive to the motor carrier. The results will not be
        released to any additional parties without my written authorization.
      </Text>
      <Text style={styles.paragraph}>
        I hereby agree to submit to a drug screen-urinalysis.
      </Text>
    </View>

    <View style={styles.signatureSection}>
      <View style={styles.signatureLine} />
      <Text style={styles.signatureLabel}>Applicant's Name</Text>

      <View style={[styles.signatureLine, { marginTop: 20 }]} />
      <Text style={styles.signatureLabel}>Applicant's Signature and Date</Text>
    </View>

    <View
      style={[
        styles.section,
        {
          marginTop: 50,
        },
      ]}
    >
      <Text style={styles.sectionTitleUppercase}>
        CERTIFICATION OF RECEIPT AND UNDERSTANDING OF AND CONSENT TO COMPLY WITH
        THE COMPANY SUBSTANCE ABUSE PROGRAM
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.paragraph}>
        The Company Is vitally concerned with those situations where the use of
        illegal drugs or the illegal use of legal drugs, and themisuse of
        alcohol can seriously interfere with an individuals health and job
        performance and Theoperations, and is a hazard to the safety and welfare
        of other employees or the public at large.
      </Text>
      <Text style={styles.paragraph}>
        The Company has established a Substance Abuse Program for the purpose of
        maintaining a drug and alcohol free work place in accordance with
        Federal Regulations and Company Policy.
      </Text>
    </View>

    <Text style={styles.pageNumber}>12</Text>
  </Page>
);

// Page 13: Consent Form Pre-Employment Urinalysis (Continuation)
export const Page12 = ({ formData }) => (
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
      <Text style={styles.paragraph}>
        All existing covered persons and new applicants for covered positions
        must be drug and alcohol free in accordance with DOTRegulations and The
        Company Substance Abuse Program.
      </Text>
      <Text style={styles.paragraph}>
        I hereby authorize The Company to obtain my DOT drug and alcohol test
        results from my past employers to the previous two(2) years, in
        accordance with the Federal Regulations and understand that those test
        results will be kept strictly confidential.
      </Text>
      <Text style={styles.paragraph}>
        I understand The Company has designated a third party to act as its
        "Designated Agent" for the purpose of receiving andprocessing individual
        drug and alcohol test results administered to its employees and job
        applicants.
      </Text>
      <Text style={styles.paragraph}>
        I hereby authorize The Company's "Designated Agent" to receive my drug
        and alcohol test results direct from The Company's drug testing
        laboratories and alcohol testing facilities, and to process and report
        such test results to The Company in a confidential manner.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.paragraph}>I hereby certify that</Text>
    </View>

    <View style={[styles.checkboxRow, { marginLeft: 20 }]}>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxChecked} />
        <Text style={styles.checkboxStatement}>
          I have received a copy of The Company Substance Abuse Program.
        </Text>
      </View>
    </View>

    <View style={[styles.checkboxRow, { marginLeft: 20 }]}>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxChecked} />
        <Text style={styles.checkboxStatement}>
          I have read and understand its contents.
        </Text>
      </View>
    </View>

    <View style={[styles.checkboxRow, { marginLeft: 20 }]}>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxChecked} />
        <Text style={styles.checkboxStatement}>
          I understand that I must be drug and alcohol free as a condition of
          employment
        </Text>
      </View>
    </View>

    <View style={styles.signatureSection}>
      <View style={styles.signatureLine} />
      <Text style={styles.signatureLabel}>Applicant's printed Name</Text>

      <View style={[styles.signatureLine, { marginTop: 20 }]} />
      <Text style={styles.signatureLabel}>Applicant's Signature and Date</Text>

      <View style={[styles.signatureLine, { marginTop: 30 }]} />
      <Text style={styles.signatureLabel}>
        Company's representative printed name
      </Text>

      <View style={[styles.signatureLine, { marginTop: 20 }]} />
      <Text style={styles.signatureLabel}>
        Company's representative signature and Date
      </Text>
    </View>

    <Text style={styles.pageNumber}>13</Text>
  </Page>
);

// Page 14: Statement of On-Duty Hours
export const Page13 = ({ formData }) => {
  // Extract driver's license information
  const driverLicenseInfo = formData?.form5?.driverLicensePermit?.[0] || {};

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
        <Text style={styles.sectionTitle}>Statement of On-Duty Hours</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          INSTRUCTIONS: Motor carriers when using a driver for the first time
          shall obtain from the driver a signed statement giving the total time
          on- duty during the immediately preceding 7 days and time at which
          such driver was last relieved from duty prior to beginning work for
          such carrier. Rule 395.8(1)(2) Federal Motor Carrier Safety
          Regulations. NOTE: Hours for any compensated work during the preceding
          7 days, including work for a non-motor carrier entity, must be
          recorded on this form.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Driver's Name:</Text>
          <View
            style={[
              styles.formInputLine,
              {
                maxWidth: "40%",
              },
            ]}
          >
            <Text>{driverLicenseInfo?.fullName || ""}</Text>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.formLabel}>Social Security Number:</Text>
          <View
            style={[
              styles.formInputLine,
              {
                maxWidth: "40%",
              },
            ]}
          >
            <Text>{formData?.form1?.SSN?.value || ""}</Text>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.formLabel}>Driver's License #:</Text>
          <View
            style={[
              styles.formInputLine,
              {
                maxWidth: "40%",
              },
            ]}
          >
            <Text>{driverLicenseInfo?.licenseNumber || ""}</Text>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.formLabel}>State:</Text>
          <View
            style={[
              styles.formInputLine,
              {
                maxWidth: "40%",
              },
            ]}
          >
            <Text>{driverLicenseInfo?.state || ""}</Text>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.formLabel}>Exp. Date:</Text>
          <View
            style={[
              styles.formInputLine,
              {
                maxWidth: "40%",
              },
            ]}
          >
            <Text>{driverLicenseInfo?.expirationDate || ""}</Text>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.formLabel}>Type of License:</Text>
          <View
            style={[
              styles.formInputLine,
              {
                maxWidth: "40%",
              },
            ]}
          >
            <Text>{driverLicenseInfo?.class || ""}</Text>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.formLabel}>Restrictions:</Text>
          <View
            style={[
              styles.formInputLine,
              {
                maxWidth: "40%",
              },
            ]}
          >
            <Text>{driverLicenseInfo?.restrictions || ""}</Text>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.formLabel}>Endorsements:</Text>
          <View
            style={[
              styles.formInputLine,
              {
                maxWidth: "40%",
              },
            ]}
          >
            <Text>{driverLicenseInfo?.endorsements || ""}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.pageNumber}>14</Text>
    </Page>
  );
};

// Extended StyleSheet for all pages
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
  sectionTitleUppercase: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  instructionText: {
    fontSize: 12,
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
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "black",
    marginBottom: 2,
    marginTop: 2,
    width: "70%",
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
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginLeft: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 30,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "black",
    marginRight: 5,
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "black",
    marginRight: 5,
  },
  checkboxLabel: {
    fontSize: 12,
  },
  checkboxStatement: {
    fontSize: 12,
    maxWidth: "90%",
  },
  formContainer: {
    marginTop: 20,
    marginLeft: 10,
  },
  formField: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 12,
    marginRight: 5,
    width: "30%",
  },
  formInputLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    marginLeft: 5,
    height: "20px",
    paddingBottom: 2,
  },
});
