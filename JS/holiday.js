import { logAction } from './logger.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("holidayform");
  const errorMsg = document.getElementById("errorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const date = document.getElementById("date").value.trim();

    if (!title || !description || !date) {
      errorMsg.textContent = "Please fill out all fields.";
      errorMsg.style.color = "#ff9999";
      return;
    }

    try {
      // Save holiday to Firestore
      await firebase.firestore().collection("notifications").add({
        title,
        description,
        date,
        type: "holiday",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Notification added: Title="${title}", Date=${date}, Description="${description}"`);

      // 🔹 Log action to Firestore
      await logAction("Admin", "Add Holiday", `Added holiday: ${title} on ${date}`);

      // Reset form and show success
      form.reset();
      errorMsg.style.color = "#99ff99";
      errorMsg.textContent = "Holiday/Announcement added successfully!";
    } catch (error) {
      console.error("Error adding holiday: ", error);
      errorMsg.style.color = "#ff9999";
      errorMsg.textContent = "Failed to add. Try again.";
    }
  });
});
