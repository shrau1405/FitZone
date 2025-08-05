import { logAction } from './logger.js';

// DOM elements
const planFilter = document.getElementById("planFilter");
const searchInput = document.getElementById("searchInput");
const membersTable = document.getElementById("membersTable").getElementsByTagName("tbody")[0];

const deleteModal = document.getElementById("deleteModal");
const confirmBtn = document.getElementById("confirmDelete");
const cancelBtn = document.getElementById("cancelDelete");

const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const editName = document.getElementById("editName");
const editEmail = document.getElementById("editEmail");
const editAge = document.getElementById("editAge");
const editGender = document.getElementById("editGender");
const editPhone = document.getElementById("editPhone");
const editStartDate = document.getElementById("editStartDate");
const editPlan = document.getElementById("editPlan");
const cancelEdit = document.getElementById("cancelEdit");

let deleteMemberId = null;
let editMemberId = null;

// Fetch & display members
function fetchMembers() {
  const selectedPlan = planFilter.value;
  const searchTerm = searchInput.value.toLowerCase();

  db.collection("members").get().then(snapshot => {
    membersTable.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      const name = data.name.toLowerCase();

      const matchPlan = selectedPlan ? data.plan === selectedPlan : true;
      const matchName = searchTerm ? name.includes(searchTerm) : true;

      if (matchPlan && matchName) {
        const row = membersTable.insertRow();
        row.innerHTML = `
          <td>${data.name}</td>
          <td>${data.email}</td>
          <td>${data.age}</td>
          <td>${data.gender}</td>
          <td>${data.phone}</td>
          <td>${data.startDate}</td>
          <td>${data.plan}</td>
          <td>
            <button class="action-btn" onclick="editMember('${doc.id}')">Edit</button>
            <button class="action-btn" onclick="confirmDelete('${doc.id}')">Delete</button>
          </td>
        `;
      }
    });

    if (membersTable.rows.length === 0) {
      const row = membersTable.insertRow();
      const cell = row.insertCell(0);
      cell.colSpan = 8;
      cell.innerText = "No matching members found.";
    }
  }).catch(err => {
    console.error("Error fetching members:", err);
  });
}

// Delete button clicked
function confirmDelete(memberId) {
  deleteMemberId = memberId;
  deleteModal.style.display = "block";
}

// Confirm deletion
confirmBtn.onclick = () => {
  if (deleteMemberId) {
    db.collection("members").doc(deleteMemberId).delete()
      .then(async () => {
        await logAction("Admin", "Delete Member", `Deleted member with ID: ${deleteMemberId}`);
        deleteModal.style.display = "none";
        deleteMemberId = null;
        fetchMembers();
      })
      .catch(err => {
        console.error("Delete failed:", err);
      });
  }
};

// Cancel delete
cancelBtn.onclick = () => {
  deleteModal.style.display = "none";
  deleteMemberId = null;
};

// Click outside modal
window.onclick = (event) => {
  if (event.target === deleteModal) {
    deleteModal.style.display = "none";
    deleteMemberId = null;
  }
  if (event.target === editModal) {
    editModal.style.display = "none";
    editMemberId = null;
  }
};

// Edit button clicked
function editMember(id) {
  editMemberId = id;
  db.collection("members").doc(id).get().then(doc => {
    const data = doc.data();
    editName.value = data.name;
    editEmail.value = data.email;
    editAge.value = data.age;
    editGender.value = data.gender;
    editPhone.value = data.phone;
    editStartDate.value = data.startDate;
    editPlan.value = data.plan;
    editModal.style.display = "block";
  }).catch(err => {
    console.error("Error loading member:", err);
  });
}

// Submit edit form
editForm.onsubmit = (e) => {
  e.preventDefault();

  const updatedData = {
    name: editName.value,
    email: editEmail.value,
    age: editAge.value,
    gender: editGender.value,
    phone: editPhone.value,
    startDate: editStartDate.value,
    plan: editPlan.value
  };

  db.collection("members").doc(editMemberId).update(updatedData)
    .then(async () => {
      await logAction("Admin", "Edit Member", `Edited member with ID: ${editMemberId}, New Data: ${JSON.stringify(updatedData)}`);
      editModal.style.display = "none";
      editMemberId = null;
      fetchMembers();
    })
    .catch(err => {
      console.error("Update failed:", err);
    });
};

// Cancel edit
cancelEdit.onclick = () => {
  editModal.style.display = "none";
  editMemberId = null;
};

// Expose to HTML (because of onclick="...")
window.confirmDelete = confirmDelete;
window.editMember = editMember;

// Initial fetch
window.onload = fetchMembers;
planFilter.addEventListener("change", fetchMembers);
searchInput.addEventListener("input", fetchMembers);
