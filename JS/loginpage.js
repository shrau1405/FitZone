// Attach a submit event listener to the login form
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent the default form submission behavior

  // Get the selected role from the dropdown
  const selectedRole = document.getElementById("role").value;
  // Get the entered email and trim whitespace
  const email = document.getElementById("email").value.trim();
  // Get the entered password
  const password = document.getElementById("password").value;
  // Reference to the error message element to display login errors
  const errorMsg = document.getElementById("errorMsg");

  // Authenticate user with Firebase Authentication using email and password
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Extract the user ID of the logged-in user
      const uid = userCredential.user.uid;

      // Return a Firestore document from 'users' collection for this UID
      return firebase.firestore().collection("users").doc(uid).get();
    })
    .then((doc) => {
      // Check if the document exists in the Firestore 'users' collection
      if (doc.exists) {
        // Extract the role stored in the Firestore document
        const role = doc.data().role;

        // Check if the selected role matches the user's stored role
        if (role === selectedRole) {
          // ✅ Added: Log user login action (for internship logging requirement)
          console.log(`User logged in as ${role} with email: ${email}`);

          // Redirect the user to the corresponding dashboard based on role
          if (role === "admin") {
            window.location.href = "admin.html"; // Admin page
          } else if (role === "member") {
            window.location.href = "member.html"; // Member page
          } else if (role === "user") {
            window.location.href = "user.html"; // User page
          } else {
            // Unknown role that isn't handled
            errorMsg.textContent = "Unknown role detected.";
          }
        } else {
          // The selected role doesn't match the role stored in Firestore
          errorMsg.textContent = "Selected role doesn't match user's role.";
        }
      } else {
        // Firestore document does not exist for the UID
        errorMsg.textContent = "No role information found for this user.";
      }
    })
    .catch((error) => {
      // Catch authentication or Firestore errors and show error message
      errorMsg.textContent = "Invalid email or password combination. Please try again.";
    });

});
