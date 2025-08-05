import { logAction } from './logger.js'; // ✅ Logger import

const billsTableBody = document.getElementById("billsTableBody");
const searchInput = document.getElementById("searchInput");

let billsData = [];

function loadBills() {
  db.collection("bills").get().then(snapshot => {
    billsData = [];
    billsTableBody.innerHTML = "";

    snapshot.forEach(doc => {
      const bill = doc.data();
      bill.id = doc.id;
      billsData.push(bill);
    });

    billsData.sort((a, b) => {
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return b.startDate.localeCompare(a.startDate) * -1;
    });

    displayBills(billsData);
  }).catch(error => {
    console.error("Error loading bills:", error);
    billsTableBody.innerHTML = `<tr><td colspan="8">Error loading bills.</td></tr>`;
  });
}

function displayBills(data) {
  billsTableBody.innerHTML = "";

  if (data.length === 0) {
    billsTableBody.innerHTML = `<tr><td colspan="8">No bills found.</td></tr>`;
    return;
  }

  data.forEach(bill => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${bill.memberName}</td>
      <td>${bill.memberID || bill.memberId || "N/A"}</td>
      <td>${bill.email || "N/A"}</td>
      <td>${bill.plan}</td>
      <td>₹${bill.amount}</td>
      <td>${bill.startDate}</td>
      <td>${bill.endDate}</td>
      <td>
        <div class="btn-group">
          <button class="view-btn" onclick="viewBill('${bill.id}')">View</button>
          <button class="delete-btn" onclick="deleteBill('${bill.id}')">Delete</button>
        </div>
      </td>
    `;
    billsTableBody.appendChild(row);
  });
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = billsData.filter(bill =>
    bill.memberName.toLowerCase().includes(keyword)
  );
  displayBills(filtered);
});

window.viewBill = function (billId) {
  const bill = billsData.find(b => b.id === billId);
  if (!bill) return;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  const billWindow = window.open("", "_blank");
  billWindow.document.write(`
    <html>
      <head>
        <title>Bill for ${bill.memberName}</title>
        <style>
          body {
            font-family: 'Poppins', sans-serif;
            padding: 40px;
            background: #fff0f0;
            color: #222;
          }
          .bill-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .bill-header h1 {
            color: #ff0033;
            margin: 0;
          }
          .bill-header p {
            margin: 2px 0;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          td, th {
            border: 1px solid #aaa;
            padding: 10px 14px;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <div class="bill-header">
          <h1>FitZone Gym</h1>
          <p>123 Fitness Lane, Mumbai</p>
          <p>+91-9876543210 | fitzone@email.com</p>
        </div>

        <table>
          <tr><th>Member Name</th><td>${bill.memberName}</td></tr>
          <tr><th>Member ID</th><td>${bill.memberID || bill.memberId || "N/A"}</td></tr>
          <tr><th>Email</th><td>${bill.email || "N/A"}</td></tr>
          <tr><th>Plan</th><td>${bill.plan}</td></tr>
          <tr><th>Amount</th><td>₹${bill.amount}</td></tr>
          <tr><th>Start Date</th><td>${formatDate(bill.startDate)}</td></tr>
          <tr><th>End Date</th><td>${formatDate(bill.endDate)}</td></tr>
        </table>
      </body>
    </html>
  `);
  billWindow.document.close();
};

// 🔹 Delete bill with logging
window.deleteBill = async function (billId) {
  const bill = billsData.find(b => b.id === billId);
  if (!bill) return;

  if (confirm("Are you sure you want to delete this bill?")) {
    try {
      await db.collection("bills").doc(billId).delete();
      await logAction("Admin", "Delete Bill", `Deleted bill of ${bill.memberName}, Plan: ${bill.plan}, Amount: ₹${bill.amount}`);
      alert("✅ Bill deleted successfully.");
      loadBills();
    } catch (error) {
      console.error("Error deleting bill:", error);
      alert("❌ Failed to delete bill.");
    }
  }
};

loadBills();
