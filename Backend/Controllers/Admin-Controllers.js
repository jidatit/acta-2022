import admin from "firebase-admin";
import { serviceAccount } from "../config/serviceAcc.js";

// Adjust the path accordingly
console.log("service account: " + serviceAccount);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //   databaseURL: "https://acta-2022-default-rtdb.firebaseio.com/",
});

const auth = admin.auth();
const db = admin.firestore();
export const createUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(firstName, lastName, email, password);
  const userRecord = await admin.auth().createUser({
    email: email,
    password: password,
    displayName: `${firstName} ${lastName}`,
  });

  console.log("User created successfully:", userRecord.uid);

  // Store user data in Firebase Realtime Database or Firestore
  // Option 1: Realtime Database
  // await admin.database().ref(`users/${userRecord.uid}`).set({
  //   firstName: firstName,
  //   lastName: lastName,
  //   email: email,
  // });

  // Store user data in FireStore database
  await admin.firestore().collection("users").doc(userRecord.uid).set({
    firstName: firstName,
    lastName: lastName,
    email: email,
    activeStatus: "Active",
  });
  console.log("createUser");
  return res.status(200).json({
    success: true,
    message: "New review is created",
    user: { uid: userRecord.uid, firstName, lastName, email },
  });
};

export const blockUser = async (req, res, next) => {
  const { email } = req.body; // Assuming email is passed in the request body

  // Assuming email is passed in the request body

  try {
    // Retrieve the user by email to get the UID
    const userRecord = await admin.auth().getUserByEmail(email);

    // Disable the user in Firebase Authentication using the UID
    await admin.auth().updateUser(userRecord.uid, {
      disabled: true,
    });

    // Update the user's active status in Firestore (or Realtime Database)
    const userRef = admin.firestore().collection("users").doc(userRecord.uid);
    await userRef.update({
      activeStatus: "blocked",
    });

    return res.status(200).json({
      success: true,
      message: `User with email ${email} has been blocked successfully`,
      user: { uid: userRecord.uid, email: userRecord.email },
    });
  } catch (error) {
    console.error("Error blocking user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to block the user",
      error: error.message,
    });
  }
};

export const UnblockUser = async (req, res, next) => {
  const { email } = req.body; // Assuming email is passed in the request body

  try {
    // Retrieve the user by email to get the UID
    const userRecord = await admin.auth().getUserByEmail(email);

    // Enable the user in Firebase Authentication using the UID
    await admin.auth().updateUser(userRecord.uid, {
      disabled: false,
    });

    // Update the user's active status in Firestore (or Realtime Database)
    const userRef = admin.firestore().collection("users").doc(userRecord.uid);
    await userRef.update({
      activeStatus: "Active",
    });

    return res.status(200).json({
      success: true,
      message: `User with email ${email} has been unblocked successfully`,
      user: { uid: userRecord.uid, email: userRecord.email },
    });
  } catch (error) {
    console.error("Error unblocking user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to unblock the user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res, next) => {
  const { uid, userRef } = req.body;
  console.log("User deleted", uid);
  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }
  console.log("userref", userRef);
  const result = await deleteDriver(uid, userRef);
  if (result.success) {
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(400).json({ message: result.message });
  }
};
const deleteDriver = async (uid, userRef) => {
  try {
    // Delete user from Firebase Authentication
    await auth.deleteUser(uid);

    // Get the reference to the TruckDrivers collection
    const truckDriversCollection = db.collection("TruckDrivers");

    // Fetch all documents in the TruckDrivers collection
    const snapshot = await truckDriversCollection.get();

    // Loop through the documents and find the one that contains the uid
    for (const doc of snapshot.docs) {
      const driverData = doc.data();

      // Check if the document contains the driver UID
      if (driverData.uid === uid) {
        // Delete the document if the UID matches
        await doc.ref.delete();
        console.log(
          `Driver with UID: ${uid} deleted from TruckDrivers collection`
        );
        break; // Exit loop once the driver is deleted
      }
    }

    // Delete the driver's application from the truck_driver_applications collection
    const applicationDocRef = db
      .collection("truck_driver_applications")
      .doc(uid);

    // Delete the application document corresponding to the driver's UID
    await applicationDocRef.delete();
    console.log(
      `Driver's application with UID: ${uid} deleted from truck_driver_applications collection`
    );

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return { success: false, message: error.message };
  }
};
