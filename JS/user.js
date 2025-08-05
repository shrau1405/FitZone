// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");  // Search bar input
  const planFilter = document.getElementById("planFilter");    // Plan filter dropdown
  const userBody = document.getElementById("userBody");        // Table body where data will be injected

  // Function to fetch and display bills from Firestore
  function loadAllBills() {
    db.collection("bills").get().then(snapshot => {
      let html = ""; // This will hold the generated HTML rows
      const plan = planFilter.value.toLowerCase();     // Selected plan from dropdown
      const keyword = searchInput.value.toLowerCase(); // Text entered in search box

      snapshot.forEach(doc => {
        const d = doc.data(); // Get document data

        // Check if the document matches selected plan or if "all" is selected
        const plan = planFilter.value;
const matchPlan = plan === "all" || d.plan === plan;


        // Check if keyword is present in any of the fields
        const matchKeyword =
          d.memberName?.toLowerCase().includes(keyword) ||
          d.plan?.toLowerCase().includes(keyword) ||
          d.startDate?.toLowerCase().includes(keyword) ||
          d.endDate?.toLowerCase().includes(keyword);

        // If both plan and keyword match, add row to table
        if (matchPlan && matchKeyword) {
          html += `
            <tr>
              <td>${doc.id}</td>
              <td>${d.memberName}</td>
              <td>${d.email}</td>
              <td>${d.plan}</td>
              <td>${d.startDate}</td>
              <td>${d.endDate}</td>
              <td>
                <button class="action-btn" onclick="downloadUserPDF('${doc.id}', '${d.memberName}', '${d.email}', '${d.plan}', '${d.amount}', '${d.startDate}', '${d.endDate}')">PDF</button>
              </td>
            </tr>`;
        }
      });

      // If no records matched, show fallback message
      userBody.innerHTML = html || `<tr><td colspan="7">No data found</td></tr>`;
    });
  }

  // Trigger filtering when dropdown value changes
  planFilter.addEventListener("change", loadAllBills);

  // Trigger filtering when user types in the search box
  searchInput.addEventListener("input", loadAllBills);

  // Load data once on initial page load
  loadAllBills();
});


// Function to generate and download PDF bill using jsPDF
function downloadUserPDF(id, name, email, plan, amount, startDate, endDate) {
  const { jsPDF } = window.jspdf; // Access jsPDF from the jspdf library
  const doc = new jsPDF();        // Create new PDF document

  // Header text
  doc.setFontSize(16);
  doc.setTextColor(255, 0, 51); // Bright red color
  doc.text("FitZone - Gym Management System", 20, 20);

  // Contact info
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("2025 IronFit Complex, Mumbai, India", 20, 30);
  doc.text("support@fitzone.com | +91-9988776655", 20, 37);

  // Table with billing details
  doc.autoTable({
    head: [['Field', 'Value']],
    body: [
      ['Member Name', name],
      ['Member ID', id],
      ['Email', email],
      ['Plan', plan],
      ['Amount', `₹${amount}`],
      ['Start Date', startDate],
      ['End Date', endDate]
    ],
    startY: 50, // Position below the header text
    styles: {
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      fillColor: false, // No background fill
    },
    theme: 'grid' // Light grid table theme
  });

  // Save the file with a specific name
  doc.save(`FitZone_Bill_${name}.pdf`);
}
