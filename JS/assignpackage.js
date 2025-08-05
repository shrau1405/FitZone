import { logAction } from './logger.js'; // ✅ Logging import

// Plan-to-amount mapping
const planPrices = {
  "Basic": 2500,
  "Standard": 6000,
  "Premium": 9500,
  "Elite": 12000
};

// Get DOM elements
const memberNameInput = document.getElementById("memberName");
const memberIDInput = document.getElementById("memberID");
const emailInput = document.getElementById("email");
const planInput = document.getElementById("plan");
const amountInput = document.getElementById("amount");
const assignForm = document.getElementById("assignForm");
const message = document.getElementById("message");
const memberNamesList = document.getElementById("memberNames");

let membersMap = {};
let membersDetailsMap = {};

// 🔹 Load members and populate datalist
db.collection("members").get().then(snapshot => {
  snapshot.forEach(doc => {
    const data = doc.data();
    const nameKey = data.name.trim().toLowerCase();
    membersMap[nameKey] = doc.id;
    membersDetailsMap[nameKey] = { email: data.email || "" };

    const option = document.createElement("option");
    option.value = data.name;
    memberNamesList.appendChild(option);
  });
}).catch(err => {
  console.error("Error fetching members:", err);
});

// 🔹 Auto-fill ID and email when name is selected
memberNameInput.addEventListener("change", () => {
  const nameKey = memberNameInput.value.trim().toLowerCase();
  const memberId = membersMap[nameKey];
  const memberData = membersDetailsMap[nameKey];

  if (memberId && memberData) {
    memberIDInput.value = memberId;
    emailInput.value = memberData.email;
    message.textContent = "";
  } else {
    memberIDInput.value = "";
    emailInput.value = "";
    message.style.color = "#ff9999";
    message.textContent = "⚠️ Member not found!";
  }
});

// 🔹 Auto-fill amount based on plan
planInput.addEventListener("change", () => {
  const selectedPlan = planInput.value;
  amountInput.value = planPrices[selectedPlan] || "";
});

// 🔹 Submit form to assign package
assignForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const memberName = memberNameInput.value.trim();
  const memberID = memberIDInput.value.trim();
  const email = emailInput.value.trim();
  const plan = planInput.value;
  const amount = amountInput.value;

  if (!memberName || !memberID || !email || !plan || !amount) {
    message.style.color = "#ff9999";
    message.textContent = "⚠️ Please fill all fields.";
    return;
  }

  db.collection("assignedPackages").doc(memberID).set({
    memberName,
    memberID,
    email,
    plan,
    amount
  }).then(async () => {
    console.log(`Package assigned: ${plan} to ${memberName} (${email}), Amount: ₹${amount}`);
    
    // ✅ Log the action
    await logAction("Admin", "Assign Fee Package", `Assigned ${plan} plan to ${memberName} for ₹${amount}`);

    message.style.color = "#99ff99";
    message.textContent = "✅ Fee package assigned successfully!";
    assignForm.reset();
    memberIDInput.value = "";
    emailInput.value = "";
    amountInput.value = "";

    setTimeout(() => (message.textContent = ""), 3000);
  }).catch((error) => {
    console.error("Error assigning package:", error);
    message.style.color = "#ff9999";
    message.textContent = "❌ Error assigning package.";
  });
});
