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

// Set up our login function

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  
  if (!validate_email(email) || !validate_password(password)) {
      alert('Email or Password is invalid!');
      return;
  }

  auth.signInWithEmailAndPassword(email, password)
      .then(function(userCredential) {
          const user = userCredential.user;
          const database_ref = database.ref();

          const user_data = {
              last_login: Date.now()
          };

          database_ref.child('users/' + user.uid).update(user_data);
          alert('User Logged In!');
          
          window.location.href = "http://localhost/LiftAscend/Code/HTML/loggedin.html"
      })
      .catch(function(error) {
          const error_message = error.message;
          alert(error_message);
      });
}


// Function to generate a random unique ID
function generateUniqueId() {
    return Math.floor(Math.random() * 1000000); // Adjust range as needed
  }
  
  // Function to check if the ID already exists in the database
  function checkUniqueId(uniqueId) {
    return database.ref('users').orderByChild('unique_id').equalTo(uniqueId).once('value')
        .then(snapshot => {
            return !snapshot.exists(); // Return true if unique
        });
  }
  
  // Set up our register function
  async function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const full_name = document.getElementById('full_name').value;
  
    if (!validate_email(email) || !validate_password(password)) {
        alert('Email or Password is Outta Line!!');
        return;
    }
  
    if (!validate_field(full_name)) {
        alert('Full Name is Outta Line!!');
        return;
    }
  
    let uniqueUserId;
    let isUnique = false;
  
    // Keep generating a new ID until a unique one is found
    while (!isUnique) {
        uniqueUserId = generateUniqueId();
        isUnique = await checkUniqueId(uniqueUserId);
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            const user = userCredential.user;
            const database_ref = database.ref();
  
            const user_data = {
                email: email,
                full_name: full_name,
                last_login: Date.now(),
                unique_id: 1 // Add the unique ID here
            };
  
            // Save the user data under the user's UID in the database
            database_ref.child('users/' + user.uid).update(user_data)
                .then(() => {
                    alert('User Created!!');
                })
                .catch((error) => {
                    console.error("Error saving user data:", error);
                    alert('Failed to save user data.');
                });
        })
        .catch(function(error) {
            const error_message = error.message;
            alert(error_message);
        });
  }

// Validate Functions
function validate_email(email) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(email);
}

function validate_password(password) {
  return password.length >= 6;
}

function validate_field(field) {
  return field != null && field.length > 0;
}

function updateLifts() {
  const user = auth.currentUser;
  if (!user) {
      alert('You must be logged in to update your lifts.');
      return;
  }

  const squat = document.getElementById('squat').value;
  const bench = document.getElementById('bench').value;
  const deadlift = document.getElementById('deadlift').value;

  if (!squat || !bench || !deadlift) {
      alert('Please enter values for all lifts.');
      return;
  }

  const database_ref = database.ref();
  const user_data = {
      squat: parseInt(squat),
      bench: parseInt(bench),
      deadlift: parseInt(deadlift),
      total: parseInt(squat) + parseInt(bench) + parseInt(deadlift)
  };

  database_ref.child('users/' + user.uid).update(user_data)
      .then(() => {
          alert('Lifts updated successfully!');
      })
      .catch((error) => {
          console.error("Error updating lifts:", error);
          alert('Failed to update lifts. Please try again.');
      });
}

