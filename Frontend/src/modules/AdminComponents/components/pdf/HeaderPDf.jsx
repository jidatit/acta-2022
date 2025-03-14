import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

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
});

const HeaderPDf = () => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.companyName}>FFA Inc</Text>
        <Text style={styles.address}>3506 Bristol Ln, Elk Grove</Text>
        <Text style={styles.address}>Village, IL 60007</Text>
      </View>
      <View style={styles.logo}>
        <Text style={styles.logoText}>FFA </Text>
      </View>
    </View>
  );
};

export default HeaderPDf;
