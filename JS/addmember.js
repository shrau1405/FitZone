// ✅ import logger (make sure path is correct!)
import { logAction } from './logger.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addMemberForm");
  const errorMsg = document.getElementById("errorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const age = parseInt(document.getElementById("age").value.trim());
    const gender = document.getElementById("gender").value;
    const phone = document.getElementById("phone").value.trim();
    const startDate = document.getElementById("startDate").value;
    const plan = document.getElementById("plan").value;

    if (!name || !email || !age || !gender || !phone || !startDate || !plan) {
      errorMsg.textContent = "Please fill out all fields.";
      return;
    }

    try {
      await firebase.firestore().collection("members").add({
        name,
        email,
        age,
        gender,
        phone,
        startDate,
        plan,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Member added successfully: ${name}, ${email}, Plan: ${plan}`);

      // ✅ Logging the action
      await logAction("Admin", "Add Member", `Added: ${name}, Email: ${email}, Plan: ${plan}`);

      form.reset();
      errorMsg.style.color = "#99ff99";
      errorMsg.textContent = "Member added successfully!";
    } catch (error) {
      console.error("Error adding member: ", error);
      errorMsg.style.color = "#ff9999";
      errorMsg.textContent = "Failed to add member. Try again.";
    }
  });
});
