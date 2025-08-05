firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    window.location.href = "loginpage.html";
    return;
  }

  const db = firebase.firestore();
  const notificationsRef = db.collection("notifications");

  const tableBody = document.getElementById("notificationBody");
  const noNotifMsg = document.getElementById("noNotif");

  let hasData = false;

  // Fetch all documents in 'notifications' collection
  notificationsRef.get()
    .then(snapshot => {
      if (snapshot.empty) {
        noNotifMsg.textContent = "No holidays or announcements found.";
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();
        hasData = true;

        tableBody.innerHTML += `
          <tr>
            <td>${data.title || "N/A"}</td>
            <td>${data.description || "N/A"}</td>
            <td>${data.date || "N/A"}</td>
          </tr>
        `;
      });

      if (!hasData) {
        noNotifMsg.textContent = "No holidays or announcements found.";
      }
    })
    .catch(error => {
      console.error("Error fetching holidays:", error);
      noNotifMsg.textContent = "Error loading data.";
    });
});
