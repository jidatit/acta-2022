import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
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
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  address: {
    fontSize: 16,
  },
  paragraph: {
    fontSize: 13,
    marginBottom: 15,
    lineHeight: 1.3,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
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
  sectionTitle: {
    fontSize: 13,
    marginTop: 40,
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 30,
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
    fontSize: 12,
    textAlign: "center",
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    right: 0,
    left: 0,
    textAlign: "center",
    fontSize: 13,
  },
  convictionsTable: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  convictionsColHeader: {
    width: "16.6%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  convictionsCol: {
    width: "16.6%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    height: 35,
  },
  licenseTable: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  licenseColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  licenseCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    height: 35,
  },
});

const Page4 = ({ formData }) => {
  const noTrafficConvictions = formData?.form4?.noTrafficConvictions || false;
  const trafficConvictions = formData?.form4?.trafficConvictions || [];
  const driverLicenses = formData?.form5?.driverLicensePermit || [];

  return (
    <Page size="A4" style={styles.page}>
      <HeaderPDf />

      <View style={{ marginTop: 70 }}>
        <Text style={styles.paragraph}>
          Provide traffic convictions and forfeitures record for previous 3
          years
        </Text>
      </View>

      <View style={styles.formRow}>
        <View
          style={noTrafficConvictions ? styles.checkedBox : styles.checkbox}
        />
        <Text style={styles.checkboxLabel}>
          Check box if no convictions in past 3 years
        </Text>
      </View>

      {/* Traffic Convictions Table */}
      <View style={styles.convictionsTable}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={styles.convictionsColHeader}>
            <Text style={styles.tableCellHeader}>Date</Text>
          </View>
          <View style={styles.convictionsColHeader}>
            <Text style={styles.tableCellHeader}>Type of Offense</Text>
          </View>
          <View style={styles.convictionsColHeader}>
            <Text style={styles.tableCellHeader}>Location</Text>
          </View>
          <View style={styles.convictionsColHeader}>
            <Text style={styles.tableCellHeader}>Fatalities</Text>
          </View>
          <View style={styles.convictionsColHeader}>
            <Text style={styles.tableCellHeader}>Penalties</Text>
          </View>
          <View style={styles.convictionsColHeader}>
            <Text style={styles.tableCellHeader}>Comments</Text>
          </View>
        </View>

        {/* Table Data - If no convictions, show empty rows */}
        {noTrafficConvictions || trafficConvictions.length === 0 ? (
          <>
            <View style={styles.tableRow}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={styles.convictionsCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              ))}
            </View>
            <View style={styles.tableRow}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={styles.convictionsCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              ))}
            </View>
            <View style={styles.tableRow}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={styles.convictionsCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              ))}
            </View>
            <View style={styles.tableRow}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={styles.convictionsCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          // If there are convictions, map through them
          trafficConvictions.map((record, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.convictionsCol}>
                <Text style={styles.tableCell}>{record.date}</Text>
              </View>
              <View style={styles.convictionsCol}>
                <Text style={styles.tableCell}>{record.offense}</Text>
              </View>
              <View style={styles.convictionsCol}>
                <Text style={styles.tableCell}>{record.location}</Text>
              </View>
              <View style={styles.convictionsCol}>
                <Text style={styles.tableCell}>{record.fatalities}</Text>
              </View>
              <View style={styles.convictionsCol}>
                <Text style={styles.tableCell}>{record.penalties}</Text>
              </View>
              <View style={styles.convictionsCol}>
                <Text style={styles.tableCell}>{record.comments}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={{ marginTop: 30, marginBottom: 15 }}>
        <Text style={styles.sectionTitle}>
          List all driver licenses or permits held in the past 3 years
        </Text>
      </View>

      {/* Driver Licenses Table */}
      <View style={styles.licenseTable}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={styles.licenseColHeader}>
            <Text style={styles.tableCellHeader}>License No.</Text>
          </View>
          <View style={styles.licenseColHeader}>
            <Text style={styles.tableCellHeader}>Type</Text>
          </View>
          <View style={styles.licenseColHeader}>
            <Text style={styles.tableCellHeader}>State</Text>
          </View>
          <View style={styles.licenseColHeader}>
            <Text style={styles.tableCellHeader}>Expiration Date</Text>
          </View>
        </View>

        {/* Table Data - Show licenses from data or empty rows */}
        {driverLicenses && driverLicenses.length > 0 ? (
          driverLicenses.map((license, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.licenseCol}>
                <Text style={styles.tableCell}>
                  {license.LicenseNo?.value || ""}
                </Text>
              </View>
              <View style={styles.licenseCol}>
                <Text style={styles.tableCell}>
                  {license.type?.value || ""}
                </Text>
              </View>
              <View style={styles.licenseCol}>
                <Text style={styles.tableCell}>
                  {license.state53?.value || ""}
                </Text>
              </View>
              <View style={styles.licenseCol}>
                <Text style={styles.tableCell}>
                  {license.expiryDate?.value || ""}
                </Text>
              </View>
            </View>
          ))
        ) : (
          // If no licenses, show empty rows
          <>
            <View style={styles.tableRow}>
              {[...Array(4)].map((_, i) => (
                <View key={i} style={styles.licenseCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              ))}
            </View>
            <View style={styles.tableRow}>
              {[...Array(4)].map((_, i) => (
                <View key={i} style={styles.licenseCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              ))}
            </View>
            <View style={styles.tableRow}>
              {[...Array(4)].map((_, i) => (
                <View key={i} style={styles.licenseCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              ))}
            </View>
            <View style={styles.tableRow}>
              {[...Array(4)].map((_, i) => (
                <View key={i} style={styles.licenseCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      {/* <Text
          style={styles.pageNumber}
          render={({ pageNumber }) => `${pageNumber}`}
          fixed
        /> */}
    </Page>
  );
};

export default Page4;
