// Listen for authentication state changes
firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    window.location.href = "loginpage.html";
    return;
  }

  const currentEmail = user.email;
  const today = new Date();
  const db = firebase.firestore();
  const billsRef = db.collection("bills");

  const notificationTableBody = document.getElementById("notificationBody");
  const noNotifMsg = document.getElementById("noNotif");

  let hasNotification = false;

  // Fetch Upcoming Expiring Plans
  billsRef.where("email", "==", currentEmail).get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const end = new Date(data.endDate);
      const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

      if (daysLeft <= 7) {
        hasNotification = true;
        notificationTableBody.innerHTML += `
          <tr>
            <td>${data.email}</td>
            <td>${data.plan}</td>
            <td>Rs. ${data.amount}</td>
            <td>${data.startDate}</td>
            <td>${data.endDate}</td>
            <td>Membership ending in ${daysLeft} day(s)</td>
          </tr>
        `;
      }
    });

    if (!hasNotification) {
      noNotifMsg.textContent = "No new notifications.";
    }
  }).catch(err => {
    console.error("Error fetching bills:", err);
  });
});
