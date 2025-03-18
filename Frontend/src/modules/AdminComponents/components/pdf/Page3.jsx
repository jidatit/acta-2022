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

// Define styles based on the provided example
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
    textAlign: "center",
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
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "black",
    marginRight: 10,
  },
  checkedBox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "black",
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 13,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "16.6%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCol: {
    width: "16.6%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    minHeight: 35,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    fontSize: 12,
    textAlign: "center",
    flexWrap: "wrap",
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

const Page3 = ({ formData }) => {
  const noAccidents = formData?.form4?.noAccidents || false;
  const accidentRecords = formData?.form4?.accidentRecords || [];
  // console.log("form 4", formData?.form4);

  return (
    <Page size="A4" style={styles.page}>
      <HeaderPDf />

      <View style={{ marginTop: 70 }}>
        <Text style={styles.paragraph}>
          * The Federal Motor Carrier Safety Regulations (FMCSRS) apply to
          anyone operating a motor vehicle on a highway in interstate commerce
          to transport passengers or property when the vehicle: (1) weighs or
          has a GVWR of 10,001 pounds or more, (2) is designed or used to
          transport 9 or more passengers, OR (3) is of any size and is used to
          transport hazardous materials in a quantity requiring placarding.
        </Text>
      </View>

      <View style={styles.formTitle}>
        <Text>Driving Background & Qualifications</Text>
      </View>

      <View style={{ marginTop: 30, marginBottom: 15 }}>
        <Text style={styles.paragraph}>
          Provide accident record and forfeitures record for previous 3 years
        </Text>
      </View>

      <View style={styles.formRow}>
        <View style={noAccidents ? styles.checkedBox : styles.checkbox} />
        <Text style={[styles.checkboxLabel, { marginBottom: 15 }]}>
          Check box if no accidents in past 3 years
        </Text>
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Date</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Type of Accident</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Location</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Fatalities</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Penalties</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Comments</Text>
          </View>
        </View>

        {/* Table Data - If no accidents, show empty rows */}
        {noAccidents || accidentRecords.length === 0 ? (
          <>
            <View style={styles.tableRow}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              ))}
            </View>
            <View style={styles.tableRow}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              ))}
            </View>
            <View style={styles.tableRow}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              ))}
            </View>
            <View style={styles.tableRow}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          // If there are accidents, map through them
          accidentRecords.map((record, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {record.date41?.value || "N/A"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {record.accidentType?.value || "N/A"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {record.location41?.value || "N/A"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {record.fatalities?.value || "N/A"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {record.penalties41?.value || "N/A"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {record.comments41?.value || "N/A"}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </Page>
  );
};

export default Page3;
