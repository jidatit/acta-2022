import React, { useEffect, useState } from "react";
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
  logoImg: {
    width: 40,
    height: 40,
    objectFit: "contain",
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
  const [imageBase64, setImageBase64] = useState(null);

  // useEffect(() => {
  //   fetch("/ffa.png") // Ensure it's inside the public folder
  //     .then((res) => res.blob())
  //     .then((blob) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => setImageBase64(reader.result);
  //       reader.readAsDataURL(blob);
  //     });
  // }, []);
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.companyName}>FFA Inc</Text>
        <Text style={styles.address}>3506 Bristol Ln, Elk Grove</Text>
        <Text style={styles.address}>Village, IL 60007 </Text>
      </View>
      <View style={styles.logo}>
        {/* <Image style={styles.logoText} src="/ffa.png" /> */}
        <Image style={styles.logoImg} src="/ffa.png" />
      </View>
    </View>
  );
};

export default HeaderPDf;
