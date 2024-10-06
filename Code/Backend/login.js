// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB5pHK1U6Oy5Ta9oPOcL5LfWXGP_U3838E",
    authDomain: "liftascend.firebaseapp.com",
    projectId: "liftascend",
    storageBucket: "liftascend.appspot.com",
    messagingSenderId: "403461421933",
    appId: "1:403461421933:web:52452b598fb853c3cb3864",
    measurementId: "G-RFR3H01R2N"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize variables
  const auth = firebase.auth();
  const database = firebase.database();
  
  // Set up our register function
  function register() {
    // Get all our input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const full_name = document.getElementById('full_name').value;
  
    // Validate input fields
    if (!validate_email(email) || !validate_password(password)) {
      alert('Email or Password is Outta Line!!');
      return; // Don't continue running the code
    }
  
    if (!validate_field(full_name)) {
      alert('Full Name is Outta Line!!');
      return; // Validate only the full_name field
    }
  
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
      .then(function() {
        // Declare user variable
        const user = auth.currentUser;
  
        // Add this user to Firebase Database
        const database_ref = database.ref();
  
        // Create User data
        const user_data = {
          email: email,
          full_name: full_name,
          last_login: Date.now()
        };
  
        // Push to Firebase Database
        database_ref.child('users/' + user.uid).set(user_data);
  
        // Done
        alert('User Created!!');
      })
      .catch(function(error) {
        // Firebase will use this to alert of its errors
        const error_message = error.message;
        alert(error_message);
      });
  }
  
  // Set up our login function
  function login() {
    // Get all our input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Validate input fields
    if (!validate_email(email) || !validate_password(password)) {
      alert('Email or Password is Outta Line!!');
      return; // Don't continue running the code
    }
  
    auth.signInWithEmailAndPassword(email, password)
      .then(function() {
        // Declare user variable
        const user = auth.currentUser;
  
        // Add this user to Firebase Database
        const database_ref = database.ref();
  
        // Create User data
        const user_data = {
          last_login: Date.now()
        };
  
        // Push to Firebase Database
        database_ref.child('users/' + user.uid).update(user_data);
  
        // Done
        alert('User Logged In!!');
      })
      .catch(function(error) {
        // Firebase will use this to alert of its errors
        const error_message = error.message;
        alert(error_message);
      });
  }
  
  // Validate Functions
  function validate_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email); // Return true or false
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    return password.length >= 6; // Check if password length is valid
  }
  
  function validate_field(field) {
    return field != null && field.length > 0; // Return true if field is not empty
  }
  
  // Debugging log to check values
  console.log("Email:", email, "Password:", password, "Full Name:", full_name);
  