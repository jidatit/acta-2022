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

const Page5 = ({ formData }) => {
  const form5 = formData?.form5;
  const statesOperated =
    form5?.driverExperience?.[0]?.statesOperated?.value || "";
  const driverExperience = form5?.driverExperience || [];
  const educationHistory = form5?.educationHistory || [];
  const extraSkills = form5?.extraSkills || {};

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
      textAlign: "center",
    },
    companyName: {
      fontSize: 18,
      fontWeight: "bold",
    },
    address: {
      fontSize: 16,
    },
    title: {
      fontSize: 14,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },
    statesOperatedSection: {
      marginBottom: 15,
    },
    statesOperatedLabel: {
      fontSize: 12,
      marginBottom: 5,
    },
    statesOperatedValue: {
      fontSize: 12,
      borderBottomWidth: 1,
      borderBottomColor: "black",
      paddingBottom: 2,
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      marginBottom: 15,
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
      width: "100%",
    },
    tableColHeader: {
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: 5,
    },
    tableCol: {
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: 5,
      height: 35,
    },
    tableCellHeader: {
      fontSize: 10,
      fontWeight: "bold",
      textAlign: "center",
    },
    tableCell: {
      fontSize: 10,
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 20,
      marginBottom: 20,
    },
    additionalInfoSection: {
      marginTop: 20,
    },
    additionalInfoItem: {
      marginBottom: 15,
    },
    lineAbove: {
      borderTopWidth: 1,
      borderTopColor: "black",
      marginTop: 20,
      marginBottom: 5,
      width: "100%",
    },
    label: {
      fontSize: 10,
      marginBottom: 5,
    },
    value: {
      fontSize: 10,
      paddingLeft: 5,
    },
    pageNumber: {
      position: "absolute",
      bottom: 10,
      right: 0,
      left: 0,
      textAlign: "center",
      fontSize: 12,
    },
  });

  return (
    <Page size="A4" style={styles.page}>
      <HeaderPDf />

      <Text style={styles.title}>Driving Experience</Text>

      <View style={styles.statesOperatedSection}>
        <Text style={styles.statesOperatedLabel}>
          States Operated In For Last 5 Years {statesOperated}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableColHeader, { width: "15%" }]}>
            <Text style={styles.tableCellHeader}>Class of Equipment</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "17%" }]}>
            <Text style={styles.tableCellHeader}>Type of Equipment</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "13%" }]}>
            <Text style={styles.tableCellHeader}>Date From</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "13%" }]}>
            <Text style={styles.tableCellHeader}>Date To</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "22%" }]}>
            <Text style={styles.tableCellHeader}>
              Approximately Number of Miles
            </Text>
          </View>
          <View style={[styles.tableColHeader, { width: "20%" }]}>
            <Text style={styles.tableCellHeader}>Comments</Text>
          </View>
        </View>

        {driverExperience.map((exp, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>
                {exp.ClassEquipment?.value || ""}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "17%" }]}>
              <Text style={styles.tableCell}>
                {exp.EquipmentType?.value || ""}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "13%" }]}>
              <Text style={styles.tableCell}>
                {exp.DateFrom51?.value || ""}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "13%" }]}>
              <Text style={styles.tableCell}>{exp.DateTo51?.value || ""}</Text>
            </View>
            <View style={[styles.tableCol, { width: "22%" }]}>
              <Text style={styles.tableCell}>
                {exp.ApproximatelyMiles?.value || ""}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "20%" }]}>
              <Text style={styles.tableCell}>
                {exp.comments51?.value || ""}
              </Text>
            </View>
          </View>
        ))}

        {/* Add empty rows to match the template */}
        {Array.from({ length: Math.max(0, 4 - driverExperience.length) }).map(
          (_, index) => (
            <View key={`empty-${index}`} style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "15%" }]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCol, { width: "17%" }]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCol, { width: "13%" }]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCol, { width: "13%" }]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCol, { width: "22%" }]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCol, { width: "20%" }]}>
                <Text style={styles.tableCell}></Text>
              </View>
            </View>
          )
        )}
      </View>

      <Text style={styles.sectionTitle}>Education History</Text>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableColHeader, { width: "30%" }]}>
            <Text style={styles.tableCellHeader}>
              School (Name, City, State)
            </Text>
          </View>
          <View style={[styles.tableColHeader, { width: "25%" }]}>
            <Text style={styles.tableCellHeader}>Educational Level</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "15%" }]}>
            <Text style={styles.tableCellHeader}>Date From</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "15%" }]}>
            <Text style={styles.tableCellHeader}>Date To</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "15%" }]}>
            <Text style={styles.tableCellHeader}>Comments</Text>
          </View>
        </View>

        {educationHistory.map((edu, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "30%" }]}>
              <Text style={styles.tableCell}>{edu.school?.value || ""}</Text>
            </View>
            <View style={[styles.tableCol, { width: "25%" }]}>
              <Text style={styles.tableCell}>
                {edu.educationLevel?.value || ""}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>
                {edu.DateFrom52?.value || ""}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>{edu.DateTo52?.value || ""}</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>
                {edu.comments52?.value || ""}
              </Text>
            </View>
          </View>
        ))}

        {/* Add empty rows to match the template */}
        {Array.from({ length: Math.max(0, 4 - educationHistory.length) }).map(
          (_, index) => (
            <View key={`empty-edu-${index}`} style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "30%" }]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCol, { width: "25%" }]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCol, { width: "15%" }]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCol, { width: "15%" }]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCol, { width: "15%" }]}>
                <Text style={styles.tableCell}></Text>
              </View>
            </View>
          )
        )}
      </View>

      <View style={styles.additionalInfoSection}>
        <View style={styles.additionalInfoItem}>
          <View style={styles.lineAbove} />
          <Text style={styles.label}>
            List any special training that will enable you to be a better
            driver:
          </Text>
          <Text style={styles.value}>
            {extraSkills?.specialTraining?.value || ""}
          </Text>
        </View>

        <View style={styles.additionalInfoItem}>
          <View style={styles.lineAbove} />
          <Text style={styles.label}>
            List Any Safe Driving Awards You Have Earned:
          </Text>
          <Text style={styles.value}>
            {extraSkills?.safeDrivingAwards?.value || ""}
          </Text>
        </View>

        <View style={styles.additionalInfoItem}>
          <View style={styles.lineAbove} />
          <Text style={styles.label}>Other Skills or Training:</Text>
          <Text style={styles.value}>
            {extraSkills?.otherSkills?.value || ""}
          </Text>
        </View>
      </View>

      <Text style={styles.pageNumber}>6</Text>
    </Page>
  );
};

export default Page5;
