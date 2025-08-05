// Function to convert a date string into 'DD-MM-YYYY' format
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Function to calculate how many days are left from today until a given end date
function getDaysLeft(endDateStr) {
  const today = new Date();
  const endDate = new Date(endDateStr);

  // Clear time from both dates
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Function to fetch bills from Firestore and display those that are about to expire
function loadExpiringPlans() {
  db.collection("bills").get().then(snapshot => {
    const tableBody = document.querySelector("#notificationTable tbody");
    tableBody.innerHTML = "";

    snapshot.forEach(doc => {
      const bill = doc.data();
      const daysLeft = getDaysLeft(bill.endDate);

      // Only display bills that are expiring in the next 7 days
      if (daysLeft <= 7 && daysLeft >= 0) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${bill.memberName || "N/A"}</td>
          <td>${bill.memberID || "N/A"}</td>
          <td>${bill.plan || "N/A"}</td>
          <td>${formatDate(bill.endDate)}</td>
          <td>${daysLeft} day(s)</td>
        `;
        tableBody.appendChild(row);
      }
    });

    if (tableBody.innerHTML === "") {
      tableBody.innerHTML = `<tr><td colspan="5">No upcoming expirations.</td></tr>`;
    }
  }).catch(error => {
    console.error("Error loading bills:", error);
  });
}

// Call the function to load expiring plans on page load
loadExpiringPlans();

// ================= HOLIDAY/ANNOUNCEMENT NOTIFICATIONS ===================

// Function to load holiday or announcement notifications
function loadHolidayNotifications() {
  db.collection("notifications").get().then(snapshot => {
    const tableBody = document.querySelector(".container2 #notificationTable tbody");
    tableBody.innerHTML = "";

    snapshot.forEach(doc => {
      const note = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${note.title}</td>
        <td>${note.description}</td>
        <td>${note.date}</td>
      `;
      tableBody.appendChild(row);
    });

    if (tableBody.innerHTML === "") {
      tableBody.innerHTML = `<tr><td colspan="3">No upcoming holidays or announcements.</td></tr>`;
    }
  }).catch(error => {
    console.error("Error loading holiday/announcements:", error);
  });
}

// Call the function to load holiday/announcement notifications on page load
loadHolidayNotifications();
