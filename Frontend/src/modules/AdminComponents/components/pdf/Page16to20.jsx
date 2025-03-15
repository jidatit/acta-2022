import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Page 17 - Road Test Examination
export const Page16 = () => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.companyName}>FFA Inc</Text>
          <Text style={styles.address}>3506 Bristol Ln, Elk Grove</Text>
          <Text style={styles.address}>Village, IL 60007</Text>
        </View>
        <View style={styles.logo}>
          <Text style={styles.logoText}>FFA</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Road Test Examination</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          The road test shall be given by the motor carrier or a person
          designated by it. However, a driver who is a driver-operated, must be
          given the test by another person. The test shall be given by a person
          who is competent to evaluate and determine whether the person who
          takes the test has demonstrated that he or she is capable of operating
          the vehicle and associated equipment that the motor carrier intends to
          assign
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>Rating Of Performance:</Text>
        <Text style={styles.paragraph}>
          (S- Satisfactory, C-Conditional, U - Unsatisfactory)
        </Text>
      </View>

      <View style={styles.checklistSection}>
        <View style={styles.checklistItem}>
          <View style={styles.checkbox}>
            <Text style={styles.checkboxText}></Text>
          </View>
          <Text style={styles.checklistText}>
            The pretrip inspection. (As required by Sec. 392.7)
          </Text>
        </View>

        <View style={styles.checklistItem}>
          <View style={styles.checkbox}>
            <Text style={styles.checkboxText}></Text>
          </View>
          <Text style={styles.checklistText}>
            Coupling and uncoupling of combination units, if the equipment he or
            she may drive includes combination units.
          </Text>
        </View>

        <View style={styles.checklistItem}>
          <View style={styles.checkbox}>
            <Text style={styles.checkboxText}></Text>
          </View>
          <Text style={styles.checklistText}>
            Placing the equipment in operation.
          </Text>
        </View>

        <View style={styles.checklistItem}>
          <View style={styles.checkbox}>
            <Text style={styles.checkboxText}></Text>
          </View>
          <Text style={styles.checklistText}>
            Use of vehicle's controls and emergency equipment.
          </Text>
        </View>

        <View style={styles.checklistItem}>
          <View style={styles.checkbox}>
            <Text style={styles.checkboxText}></Text>
          </View>
          <Text style={styles.checklistText}>
            Operating the vehicle in traffic and while passing other vehicles.
          </Text>
        </View>

        <View style={styles.checklistItem}>
          <View style={styles.checkbox}>
            <Text style={styles.checkboxText}></Text>
          </View>
          <Text style={styles.checklistText}>Turning the vehicle.</Text>
        </View>

        <View style={styles.checklistItem}>
          <View style={styles.checkbox}>
            <Text style={styles.checkboxText}></Text>
          </View>
          <Text style={styles.checklistText}>
            Braking, and slowing the vehicle by means other than braking.
          </Text>
        </View>

        <View style={styles.checklistItem}>
          <View style={styles.checkbox}>
            <Text style={styles.checkboxText}></Text>
          </View>
          <Text style={styles.checklistText}>
            Backing, and parking the vehicle.
          </Text>
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={[styles.label]}>
          Type of equipment used in giving test:
        </Text>
        <Text style={[styles.fieldValue]}></Text>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Examiner:</Text>
        <Text style={styles.fieldValue}></Text>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.fieldValue}></Text>
      </View>

      <View style={[styles.section, { marginBottom: 0 }]}>
        <Text style={styles.paragraph}>
          If the road test is successfully completed, the person who gave it
          shall complete a certificate of driver's road test.
        </Text>
      </View>

      <View style={[styles.signatureSection, { marginTop: 10 }]}>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureLabel}>Examiner's Signature</Text>
      </View>

      {/* <Text style={styles.pageNumber}>17</Text> */}
    </Page>
  );
};

// Page 18 - Driver's Acknowledgement of Receipt
export const Page17 = () => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.companyName}>FFA Inc</Text>
          <Text style={styles.address}>3506 Bristol Ln, Elk Grove</Text>
          <Text style={styles.address}>Village, IL 60007</Text>
        </View>
        <View style={styles.logo}>
          <Text style={styles.logoText}>FFA</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Driver's Acknowledgement of Receipt
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          I acknowledge that I have read and received Driver's Guide which
          covers the following topics:
        </Text>
      </View>

      <View style={styles.checklistSection}>
        <View style={styles.checklistItem}>
          <View style={[styles.checkbox, styles.checkboxChecked]}>
            <Text style={styles.checkboxText}>✓</Text>
          </View>
          <Text style={styles.checklistText}>Accidents procedures</Text>
        </View>

        <View style={styles.checklistItem}>
          <View style={[styles.checkbox, styles.checkboxChecked]}>
            <Text style={styles.checkboxText}>✓</Text>
          </View>
          <Text style={styles.checklistText}>Alcohol and drug testing</Text>
        </View>

        <View style={styles.checklistItem}>
          <View style={[styles.checkbox, styles.checkboxChecked]}>
            <Text style={styles.checkboxText}>✓</Text>
          </View>
          <Text style={styles.checklistText}>
            Company policy and safety manual
          </Text>
        </View>

        <View style={styles.checklistItem}>
          <View style={[styles.checkbox, styles.checkboxChecked]}>
            <Text style={styles.checkboxText}>✓</Text>
          </View>
          <Text style={styles.checklistText}>Hours of service</Text>
        </View>

        <View style={styles.checklistItem}>
          <View style={[styles.checkbox, styles.checkboxChecked]}>
            <Text style={styles.checkboxText}>✓</Text>
          </View>
          <Text style={styles.checklistText}>Vehicle inspections</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.checklistItem}>
          <View style={[styles.checkbox, styles.checkboxChecked]}>
            <Text style={styles.checkboxText}>✓</Text>
          </View>
          <Text style={styles.checklistText}>
            I hereby certify that I am familiar with U.S. DOT drug and alcohol
            testing requirements of 49 CFR part 40; FMCSR's and Freight For All
            company policy and safety manual, and FMCSR's pocketbook, and hereby
            agree to follow and obey those rules and regulations during my
            employment with Freight For All.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.checklistItem}>
          <View style={[styles.checkbox, styles.checkboxChecked]}>
            <Text style={styles.checkboxText}>✓</Text>
          </View>
          <Text style={styles.checklistText}>
            I hereby certify that I am informed and I understood that Freight
            For All designated representative to answer all drug and alcohol;
            FMCSR's and Freight For All company policy related questions is. I
            understand that, in the case I have above mentioned questions I can
            call at () -.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.checklistItem}>
          <View style={[styles.checkbox, styles.checkboxChecked]}>
            <Text style={styles.checkboxText}>✓</Text>
          </View>
          <Text style={styles.checklistText}>
            I hereby certify that I read and understood Freight For All
            disciplinary actions in Addendum A of "Company Policy", and that
            those actions are subject to change without prior notice given. I
            understand that most updated disciplinary actions handout is
            available upon request to my safety department.
          </Text>
        </View>
      </View>

      <View style={styles.signatureSection}>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureLabel}>Driver's Signature and Date</Text>
      </View>

      {/* <Text style={styles.pageNumber}>18</Text> */}
    </Page>
  );
};

// Page 19 - Important Disclosure (Part 1)
export const Page18 = () => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.companyName}>FFA Inc</Text>
          <Text style={styles.address}>3506 Bristol Ln, Elk Grove</Text>
          <Text style={styles.address}>Village, IL 60007</Text>
        </View>
        <View style={styles.logo}>
          <Text style={styles.logoText}>FFA</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontWeight: "bold" }]}>
          IMPORTANT DISCLOSURE
        </Text>
        <Text style={[styles.sectionTitle, { fontWeight: "bold" }]}>
          REGARDING BACKGROUND REPORTS FROM THE PSP Online Service
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          In connection with your application for employment with Freight For
          All ("Prospective Employer"), Prospective Employer, its employees,
          agents or contractors may obtain one or more reports regarding your
          driving, and safety inspection history from the Federal Motor Carrier
          Safety Administration (FMCSA).
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          When the application for employment is submitted in person, if the
          Prospective Employer uses any information it obtains from FMCSA in a
          decision to not hire you or to make any other adverse employment
          decision regarding you, the Prospective Employer will provide you with
          a copy of the report upon which its decision was based and a written
          summary of your rights under the Fair Credit Reporting Act before
          taking any final adverse action. If any final adverse action is taken
          against you based upon your driving history or safety report, the
          Prospective Employer will notify you that the action has been taken
          and that the action was based in part or in whole on this report.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          When the application for employment is submitted by mail, telephone,
          computer, or other similar means, if the Prospective Employer uses any
          information it obtains from FMCSA in a decision to not hire you or to
          make any other adverse employment decision regarding you, the
          Prospective Employer must provide you within three business days of
          taking adverse action, with the name, address, and toll free telephone
          number of FMCSA; the action taken; notice that the action was based in
          whole or in part on information obtained from FMCSA; the name,
          address, and the toll free telephone number of FMCSA; that the FMCSA
          did not make the decision to take the adverse action and is unable to
          provide you the specific reasons why the adverse action was taken; and
          that you may, upon providing proper identification, request a free
          copy of the report and may dispute with the FMCSA the accuracy or
          completeness of any information or report. If you request a copy of a
          driver record from the Prospective Employer who procured the report,
          then, within 3 business days of receiving your request, together with
          proper identification, the Prospective Employer must send or provide
          to you a copy of your report and a summary of your rights under the
          Fair Credit Reporting Act.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          Neither the Prospective Employer nor the FMCSA contractor supplying
          the crash and safety information has the capability to correct any
          safety data that appears to be incorrect. You may challenge the
          accuracy of the data by submitting a request to
          https://dataqs.fmcsa.dot.gov. If you challenge crash or inspection
          information reported by a State, FMCSA cannot change or correct this
          data. Your request will be forwarded by the DataQs system to the
          appropriate State for adjudication.
        </Text>
      </View>

      {/* <Text style={styles.pageNumber}>19</Text> */}
    </Page>
  );
};

// Page 20 - Important Disclosure (Part 2)
export const Page19 = () => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.companyName}>FFA Inc</Text>
          <Text style={styles.address}>3506 Bristol Ln, Elk Grove</Text>
          <Text style={styles.address}>Village, IL 60007</Text>
        </View>
        <View style={styles.logo}>
          <Text style={styles.logoText}>FFA</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          Any crash or inspection in which you were involved will display on
          your PSP report. Since the PSP report does not report, or assign, or
          imply fault, it will include all Commercial Motor Vehicle (CMV)
          crashes where you were a driver or co-driver and where those crashes
          were reported to FMCSA, regardless of fault. Similarly, all
          inspections, with or without violations, appear on the PSP report.
          State citations associated with Federal Motor Carrier Safety
          Regulations (FMCSR) violations that have been adjudicated by a court
          of law will also appear, and remain, on a PSP report.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          The Prospective Employer cannot obtain background reports from FMCSA
          without your authorization.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontWeight: "bold" }]}>
          AUTHORIZATION
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          If you agree that the Prospective Employer may obtain such background
          reports, please read the following and sign below.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          I authorize Freight For All ("Prospective Employer") to access the
          FMCSA Pre-Employment Screening Program (PSP) system to seek
          information regarding my commercial driver's safety record and
          information regarding my safety inspection history. I understand that
          I am authorizing the release of safety performance information
          including crash data from the previous five (5) years and inspection
          history from the previous three (3) years. I understand and
          acknowledge that this release of information may assist the
          Prospective Employer to make a determination regarding my suitability
          as an employee.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          I further understand that neither the Prospective Employer nor the
          FMCSA contractor supplying the crash and safety information has the
          capability to correct any safety data that appears to be incorrect. I
          understand I may challenge the accuracy of the data by submitting a
          request to https://dataqs.fmcsa.dot.gov. If I challenge crash or
          inspection information reported by a State, FMCSA cannot change or
          correct this data. I understand my request will be forwarded by the
          DataQs System to the appropriate State for adjudication.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          I understand that any crash or inspection in which I was involved will
          display on my PSP report. Since the PSP report does not report, or
          assign, or imply fault, I acknowledge it will include all CMV crashes
          where I was a driver or co-driver and where those crashes were
          reported to FMCSA, regardless of fault. Similarly, I understand all
          inspections, with or without violations, will appear on my PSP report,
          and State citations associated with FMCSR violations that have been
          adjudicated by a court of law will also appear, and remain, on my PSP
          report.
        </Text>
      </View>

      {/* <Text style={styles.pageNumber}>20</Text> */}
    </Page>
  );
};

// Page 21 - Important Disclosure (Part 3)
export const Page20 = () => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.companyName}>FFA Inc</Text>
          <Text style={styles.address}>3506 Bristol Ln, Elk Grove</Text>
          <Text style={styles.address}>Village, IL 60007</Text>
        </View>
        <View style={styles.logo}>
          <Text style={styles.logoText}>FFA</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          I have read the above Disclosure Regar Background Reports provided to
          me by Prospectiv mployer and I understand that if I sign this
          Disclosure and Authorization, Prosive Employer may obtain a report of
          my crash a... inspection history. I hereby authorize Prospective
          Employer and its employees, authorized agents, and/or affiliates to
          obtain the information authorized above.
        </Text>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.fieldValue}></Text>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Applicant's Signature:</Text>
        <Text style={styles.fieldValue}></Text>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Applicant's Name:</Text>
        <Text style={styles.fieldValue}></Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.paragraph, { fontSize: 12, marginTop: 20 }]}>
          NOTICE: This form is made available to monthly account holders by NIC
          on behalf of the U.S. Department of Transportation, Federal Motor
          Carrier Safety Administration (FMCSA). Account holders are required by
          federal law to obtain an Applicant's written or electronic consent
          prior to accessing the Applicant's PSP report. Further, account
          holders are required by FMCSA to use the language contained in this
          Disclosure and Authorization form to obtain an Applicant's consent.
          The language must be used in whole, exactly as provided. Further, the
          language on this form must exist as one stand-alone document. The
          language may NOT be included with other consent forms or any other
          language.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.paragraph, { fontSize: 12 }]}>
          NOTICE: The prospective employment concept referenced in this form
          contemplates the definition of "employee" contained at 49 C.F.R.
          383.5.
        </Text>
      </View>

      {/* <Text style={styles.pageNumber}>21</Text> */}
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
  checklistSection: {
    marginVertical: 10,
  },
  checklistItem: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: "black",
    marginRight: 8,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "white",
  },
  checkboxText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  checklistText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 1.5,
  },
  formField: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    marginRight: 5,
    width: 100,
  },
  fieldValue: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingBottom: 2,
    fontSize: 12,
  },
});
