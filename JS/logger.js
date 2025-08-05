// logger.js
export async function logAction(user = "System", action, details = "") {
  console.log("🟡 logAction CALLED with:", user, action, details); // ✅ Debug

  try {
    await firebase.firestore().collection("logs").add({
      user,
      action,
      details,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log("✅ Logged successfully to Firestore");
  } catch (error) {
    console.error("❌ Failed to log:", error);
  }
}
