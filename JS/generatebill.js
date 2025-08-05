import { logAction } from './logger.js'; // ✅ Import logger

const planDurations = {
  "Basic": 1,
  "Standard": 3,
  "Premium": 6,
  "Elite": 12
};

// Get DOM elements
const memberNameInput = document.getElementById("memberName");
const memberIDInput = document.getElementById("memberID");
const emailInput = document.getElementById("email");
const planInput = document.getElementById("plan");
const amountInput = document.getElementById("amount");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const generateForm = document.getElementById("billForm");
const message = document.getElementById("message");
const memberNamesList = document.getElementById("memberNames");

let membersMap = {};
let assignedPlans = {};

// 🔹 Load assigned packages
db.collection("assignedPackages").get().then(snapshot => {
  snapshot.forEach(doc => {
    const data = doc.data();
    const nameKey = data.memberName.trim().toLowerCase();

    membersMap[nameKey] = data.memberID;
    assignedPlans[data.memberID] = {
      plan: data.plan,
      amount: data.amount,
      email: data.email
    };

    const option = document.createElement("option");
    option.value = data.memberName;
    memberNamesList.appendChild(option);
  });
}).catch(err => {
  console.error("Error loading members:", err);
});

// 🔹 Auto-fill details on name selection
memberNameInput.addEventListener("change", () => {
  const nameKey = memberNameInput.value.trim().toLowerCase();
  const memberID = membersMap[nameKey];
  const assigned = assignedPlans[memberID];

  if (memberID && assigned) {
    memberIDInput.value = memberID;
    emailInput.value = assigned.email;
    planInput.value = assigned.plan;
    amountInput.value = assigned.amount;
    message.textContent = "";
    if (startDateInput.value) calculateEndDate();
  } else {
    memberIDInput.value = "";
    emailInput.value = "";
    planInput.value = "";
    amountInput.value = "";
    endDateInput.value = "";
    message.style.color = "#ff9999";
    message.textContent = "⚠️ Member not found or package not assigned!";
  }
});

// 🔹 Calculate end date
function calculateEndDate() {
  const plan = planInput.value;
  const startDateValue = startDateInput.value;

  if (plan && startDateValue && planDurations[plan]) {
    const durationMonths = planDurations[plan];
    const startDate = new Date(startDateValue);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    if (startDate.getDate() !== endDate.getDate()) {
      endDate.setDate(0);
    }

    const formatted = endDate.toISOString().split("T")[0];
    endDateInput.value = formatted;
  } else {
    endDateInput.value = "";
  }
}

startDateInput.addEventListener("change", calculateEndDate);

// 🔹 Submit bill form
generateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const memberName = memberNameInput.value.trim();
  const memberID = memberIDInput.value.trim();
  const email = emailInput.value.trim();
  const plan = planInput.value.trim();
  const amount = amountInput.value.trim();
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (!memberName || !memberID || !email || !plan || !amount || !startDate || !endDate) {
    message.style.color = "#ff9999";
    message.textContent = "⚠️ Please fill all fields.";
    return;
  }

  try {
    await db.collection("bills").add({
      memberName,
      memberID,
      email,
      plan,
      amount,
      startDate,
      endDate
    });

    console.log(`Bill generated: ${memberName}, Plan: ${plan}, Amount: ₹${amount}, Period: ${startDate} to ${endDate}`);

    // ✅ Log action
    await logAction("Admin", "Generate Bill", `Generated bill for ${memberName} | Plan: ${plan}, Amount: ₹${amount}, Period: ${startDate} to ${endDate}`);

    message.style.color = "#99ff99";
    message.textContent = "✅ Bill generated successfully!";
    generateForm.reset();

    memberIDInput.value = "";
    emailInput.value = "";
    planInput.value = "";
    amountInput.value = "";
    endDateInput.value = "";

    setTimeout(() => (message.textContent = ""), 3000);
  } catch (error) {
    console.error("Error generating bill:", error);
    message.style.color = "#ff9999";
    message.textContent = "❌ Error generating bill.";
  }
});
