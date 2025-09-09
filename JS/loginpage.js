// loginpage.js

// Attach a submit event listener to the login form
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent the default form submission

  // Get the selected role from dropdown and convert to lowercase
  const selectedRole = document.getElementById("role").value.toLowerCase();
  // Get the email and password inputs
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  // Reference to error message element
  const errorMsg = document.getElementById("errorMsg");

  // Clear previous error
  errorMsg.textContent = "";

  // Debug logs to see what values are being read
  console.log("Attempting login with:", email, password, selectedRole);

  // Firebase Authentication - sign in with email and password
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;

      // Fetch the user document from 'users' collection
      return firebase.firestore().collection("users").doc(uid).get();
    })
    .then((doc) => {
      if (doc.exists) {
        // Get the role from Firestore and convert to lowercase
        const role = doc.data().role.toLowerCase();
        console.log("Firestore role:", role);

        // Check if selected role matches Firestore role
        if (role === selectedRole) {
          console.log(`User logged in as ${role} with email: ${email}`);

          // Redirect based on role
          if (role === "admin") {
            window.location.href = "admin.html";
          } else if (role === "member") {
            window.location.href = "member.html";
          } else if (role === "user") {
            window.location.href = "user.html";
          } else {
            errorMsg.textContent = "Unknown role detected.";
          }
        } else {
          errorMsg.textContent = "Selected role doesn't match user's role.";
        }
      } else {
        errorMsg.textContent = "No role information found for this user.";
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      // Display the Firebase error message
      errorMsg.textContent = error.message;
    });
});
