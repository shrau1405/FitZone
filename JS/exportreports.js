// Wait until the DOM content is fully loaded before executing scripts
document.addEventListener("DOMContentLoaded", () => {
  const planFilter = document.getElementById("planFilter"); // Dropdown to filter by plan
  const searchInput = document.getElementById("searchInput"); // Input to search by name
  const tableBody = document.getElementById("tableBody"); // Table body where results are rendered

  // Function to render table rows dynamically based on filtered data
  function renderTable(data) {
    tableBody.innerHTML = ""; // Clear existing content

    if (!data.length) {
      tableBody.innerHTML = `<tr><td colspan="7">No data found</td></tr>`;
      return;
    }

    // Create table rows for each document
    data.forEach(doc => {
      const d = doc.data();
      tableBody.innerHTML += `
        <tr>
          <td>${d.memberName}</td>
          <td>${d.email}</td>
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
  }

  // Function to load and filter bills based on dropdown and search input
  function loadBills() {
    const plan = planFilter.value.toLowerCase(); // Get selected plan filter
    const keyword = searchInput.value.toLowerCase(); // Get input keyword

    // Fetch all documents from 'bills' collection in Firestore
    db.collection("bills").get().then(snapshot => {
      const filtered = snapshot.docs.filter(doc => {
        const d = doc.data();
        const matchPlan = plan === "all" || d.plan.toLowerCase() === plan;
        const matchKeyword = d.memberName.toLowerCase().includes(keyword);
        return matchPlan && matchKeyword;
      });

      renderTable(filtered); // Render filtered data
      console.log(`Bills loaded: ${filtered.length} result(s) with filter - Plan: ${plan || "all"}, Keyword: "${keyword}"`);

    });
  }

  // Event listeners for filters
  planFilter.addEventListener("change", loadBills);
  searchInput.addEventListener("input", loadBills);

  loadBills(); // Load all bills initially
});

// Function to download a PDF bill using jsPDF
function downloadPDF(id, name, email, plan, amount, startDate, endDate) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Header information
  doc.setFontSize(16);
  doc.text("FitZone - Gym Management System", 20, 20);
  doc.setFontSize(12);
  doc.text("2025 IronFit Complex, Mumbai, India", 20, 30);
  doc.text("support@fitzone.com | +91-9988776655", 20, 37);

  // Bill table
  doc.autoTable({
    head: [['Member Name', 'Member ID', 'Email', 'Start Date', 'End Date', 'Amount']],
    body: [[name, id, email, startDate, endDate, `Rs. ${amount}`]],
    startY: 50
  });
console.log(`PDF generated for: ${name}, Plan: ${plan}, Amount: ₹${amount}`);

  // Save the file with a dynamic filename
  doc.save(`FitZone_Bill_${name}.pdf`);
}

// Function to download CSV of the bill
function downloadCSV(id, name, email, plan, amount, startDate, endDate) {
  // Construct CSV content with labels and data
  const csv = `Member Name,Member ID,Email,Plan,Amount,Start Date,End Date\n"${name}","${id}","${email}","${plan}","Rs. ${amount}","${startDate}","${endDate}"`;
  
  // Create a blob and anchor element to trigger download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `FitZone_Bill_${name}.csv`;
  console.log(`CSV downloaded for: ${name}, Plan: ${plan}, Amount: ₹${amount}`);

  a.click();
  URL.revokeObjectURL(url); // Clean up
}
