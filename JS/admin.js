// Redirect to login if not authenticated
firebase.auth().onAuthStateChanged(function(user) {
  // If no user is logged in, redirect to the login page
  if (!user) {
    window.location.href = "adminlogin.html";
  }
});

// Get button references from DOM
const addMemberBtn = document.getElementById("addMemberBtn");
const viewMembersBtn = document.getElementById("viewMembersBtn");
const generateBillBtn = document.getElementById("generateBillBtn");

// Add Member button click listener
if (addMemberBtn) {
  addMemberBtn.addEventListener("click", function () {
    // Navigate to Add Member page
    window.location.href = "addmember.html";
  });
}

// View Members button click listener
if (viewMembersBtn) {
  viewMembersBtn.addEventListener("click", function () {
    // Navigate to View Members page
    window.location.href = "viewmembers.html";
  });
}

// Generate Bill button click listener
if (generateBillBtn) {
  generateBillBtn.addEventListener("click", function () {
    // Navigate to Generate Bill page
    window.location.href = "generatebill.html";
  });
}
