import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import HeaderPDf from "./HeaderPDf";

const Page6 = ({ formData, truckDriverData }) => {
  return (
    <Page size="A4" style={styles.page}>
      {/* <HeaderPDf /> */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Applicant: Read the following statement, then sign and date
          Application Form
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          I understand that in order to qualify for this position as an
          interstate commercial driver I must submit the employment controlled
          substance test, and must test negative before an offer of employment
          can be processed and is in accordance with US DOT Federal Motor
          Carrier Safety Regulations Part 391. I authorize{" "}
          {`${truckDriverData?.selectedCompany?.name || ``}`} to make any such
          inquiries and investigations of my driving and past employment
          background, personal, financial and/or medical history, I hereby
          release state agencies, employers, schools, health care providers
          and/or any other person from all liability in connection to their
          responding to any and all inquiries from{" "}
          {`${truckDriverData?.selectedCompany?.name || `Freight For All`}`} and
          the subsequent release information to verify the accuracy of this
          application.I understand that in the event of my employment by{" "}
          {`${truckDriverData?.selectedCompany?.name || `Freight For All`}`} any
          false or misstatements given in my application or interview(s) may
          result in my discharge. I also understand that I have to abide by all
          rules and regulations of{" "}
          {`${truckDriverData?.selectedCompany?.name || `Freight For All`}`}
          /This certifies that this application was completed by me, and that
          all entries on it and Information in it is complete to the best of my
          knowledge.
        </Text>
      </View>

      <View style={styles.signatureSection}>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureLabel}>
          Applicant's Signature And Date of Application
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Consumer Report Disclosure and Drug Release
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          In connection with my application for employment (including contract
          for services) with In connection with m
          {`${truckDriverData?.selectedCompany?.name || `Freight For All`}`} I
          understand that consumer reports which may contain public record
          information may be requested from DAC Services (DAC).
          {"\n"}
          These reports may include the following types of information: names
          and dates of employers, reason for termination, work experience,
          accidentpreviouss, etc. I further understand that such reports may
          contain public record information concerning numbers of workers
          compensation history, credit, bankruptcy proceedings, criminal
          records, etc., from federal, state and other agencies providing such
          records; as well as information from DAC concerning previous driving
          record requests made by others from such state agencies that provided
          driving records.WITHOUT
          {"\n"}I AUTHORIZE, aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, ANY PARTY
          OR AGENCY CONTACTED BY DACT ABOVE MENTIONED INFORMATION TO THE EXTENT
          AUTHORIZED BY STATE AND FEDERAL LAW.
        </Text>
      </View>

      {/* <Text style={styles.pageNumber}>7</Text> */}
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
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 0,
    left: 0,
    textAlign: "center",
    fontSize: 12,
  },
});

export default Page6;
