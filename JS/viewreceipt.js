// Check if a user is logged in using Firebase Authentication
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // Get the logged-in user's email
    const email = user.email;

    // Get the table body where bills will be displayed
    const tableBody = document.getElementById("tableBody");

    // Query the 'bills' collection in Firestore where email matches the logged-in user
    db.collection("bills").where("email", "==", email).get().then(snapshot => {
      // If no bills found, show a placeholder row
      if (snapshot.empty) {
        tableBody.innerHTML = `<tr><td colspan="5">No bills found</td></tr>`;
        return;
      }

      // For each bill document found, render a row in the table
      snapshot.forEach(doc => {
        const d = doc.data(); // Extract the data from the document

        // Append a new table row with bill details and download buttons
        tableBody.innerHTML += `
          <tr>
            <td>${d.plan}</td>
            <td>Rs. ${d.amount}</td>
            <td>${d.startDate}</td>
            <td>${d.endDate}</td>
            <td>
              <button class="action-btn" onclick="downloadPDF('${doc.id}', '${d.memberName}', '${d.email}', '${d.plan}', '${d.amount}', '${d.startDate}', '${d.endDate}')">PDF</button>
              <button class="action-btn" onclick="downloadCSV('${doc.id}', '${d.memberName}', '${d.email}', '${d.plan}', '${d.amount}', '${d.startDate}', '${d.endDate}')">CSV</button>
            </td>
          </tr>`;
      });
    });
  }
});

// Function to generate and download a PDF bill using jsPDF
function downloadPDF(id, name, email, plan, amount, startDate, endDate) {
  const { jsPDF } = window.jspdf; // Get jsPDF from the global scope
  const doc = new jsPDF(); // Create a new PDF document

  // Add title and header info
  doc.setFontSize(16);
  doc.setTextColor("#ff0033");
  doc.text("FitZone - Gym Management System", 20, 20);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("2025 IronFit Complex, Mumbai, India", 20, 30);
  doc.text("support@fitzone.com | +91-9988776655", 20, 37);

  // Create a table using autoTable plugin to list bill fields and values
  doc.autoTable({
    startY: 50, // Start position of the table on Y-axis
    head: [['Field', 'Value']], // Table headers
    body: [
      ['Member Name', name],
      ['Member ID', id],
      ['Email', email],
      ['Plan', plan],
      ['Amount', `Rs. ${amount}`],
      ['Start Date', startDate],
      ['End Date', endDate]
    ],
    styles: {
      lineColor: [0, 0, 0], // Border line color
      lineWidth: 0.2, // Border line width
      textColor: 20,
      halign: 'left' // Align text to left
    },
    headStyles: {
      fillColor: [255, 255, 255], // Header background color
      textColor: 0, // Header text color
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fillColor: [255, 255, 255], // Body background
      textColor: 50
    }
  });

  // Save the PDF with a dynamic file name
  doc.save(`FitZone_Bill_${name}.pdf`);
}

// Function to generate and download a CSV bill
function downloadCSV(id, name, email, plan, amount, startDate, endDate) {
  // Construct a CSV string with headers and values
  const csv = `Member Name,Member ID,Email,Plan,Amount,Start Date,End Date\n"${name}","${id}","${email}","${plan}","Rs. ${amount}","${startDate}","${endDate}"`;

  // Create a Blob object for the CSV data
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  // Create a downloadable URL for the blob
  const url = URL.createObjectURL(blob);

  // Create an anchor element and simulate click to download
  const a = document.createElement("a");
  a.href = url;
  a.download = `FitZone_Bill_${name}.csv`;
  a.click();

  // Revoke the URL after download to free memory
  URL.revokeObjectURL(url);
}
