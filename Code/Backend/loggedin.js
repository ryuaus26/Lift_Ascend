// Your web app's Firebase configuration
import search from "./search.js";
import 'instantsearch.css/themes/satellite.css';

search.start();

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

function logout() {
   
    firebase.auth().signOut()
      .then(() => {
        // Sign-out successful.
        console.log("User signed out successfully");
        // Clear any user-specific data from the page
      
        // Redirect to the logged-out page
        
      })
      .catch((error) => {
        // An error happened during sign-out.
        console.error("Error signing out:", error);
        alert("An error occurred while logging out. Please try again.");
      });
      window.location.href = "http://localhost/LiftAscend/Code/HTML/loggedout.html";
  }

// Function to submit lift data to Firebase
function submitLiftData() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('You must be logged in to submit lift data.');
        return;
    }

    const rows = document.querySelectorAll('#liftDataBody tr');
    const liftData = [];

    rows.forEach((row, index) => {
        const age = row.querySelector('.age').value;
        const squat = row.querySelector('.squat').value;
        const bench = row.querySelector('.bench').value;
        const deadlift = row.querySelector('.deadlift').value;

        if (age && squat && bench && deadlift) {
            liftData.push({
                age: parseInt(age),
                squat: parseInt(squat),
                bench: parseInt(bench),
                deadlift: parseInt(deadlift),
                total: parseInt(squat) + parseInt(bench) + parseInt(deadlift),
                timestamp: Date.now()
            });
        } else {
            alert(`Please fill all fields in row ${index + 1}`);
            return;
        }
    });

    if (liftData.length > 0) {
        const database_ref = firebase.database().ref();
        database_ref.child('users/' + user.uid + '/liftData').push(liftData)
            .then(() => {
                alert('Lift data submitted successfully!');
                clearLiftDataTable();
                loadUserData(); // Refresh the displayed data
            })
            .catch((error) => {
            
                alert('Failed to submit lift data. Please try again.');
            });
    } else {
        alert('No valid lift data to submit.');
    }
}

// Function to update the profile display
function updateProfileDisplay(data) {
    document.getElementById('user-bench').textContent = data.bench ? data.bench + ' lbs' : 'N/A';
    document.getElementById('user-squat').textContent = data.squat ? data.squat + ' lbs' : 'N/A';
    document.getElementById('user-deadlift').textContent = data.deadlift ? data.deadlift + ' lbs' : 'N/A';
}

// Function to load user data
function loadUserData() {
    const user = firebase.auth().currentUser;

    if (user) {
        const uid = user.uid;
        firebase.database().ref('users/' + uid).once('value').then((snapshot) => {
          const fullName = snapshot.val().full_name;
          document.getElementById('user-full-name').textContent = fullName;
     
        }).catch((error) => {
          console.error(error);
        });
      } else {
        alert('No user is signed in');
      }

 
    if (user) {
        const database_ref = firebase.database().ref();
        database_ref.child('users/' + user.uid + '/liftData').limitToLast(1).once('value')
            .then((snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    const lastEntry = Object.values(userData)[0][0]; // Get the first (and only) entry of the last push
                    updateProfileDisplay(lastEntry);
                }
            })
            .catch((error) => {
                console.error("Error loading user data:", error);
            });
    }
}

// Function to clear the lift data table
function clearLiftDataTable() {
    const tbody = document.getElementById('liftDataBody');
    tbody.innerHTML = ''; // Clear all rows
    addRow(); // Add one empty row
}


// Function to add a new row to the lift data table
function addRow() {
    const tbody = document.getElementById('liftDataBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="number" class="age" placeholder="Age"></td>
        <td><input type="number" class="squat" placeholder="Squat"></td>
        <td><input type="number" class="bench" placeholder="Bench"></td>
        <td><input type="number" class="deadlift" placeholder="Deadlift"></td>
        <td><button onclick="removeRow(this)">Remove</button></td>
    `;
    tbody.appendChild(newRow);
}

// Function to remove a row from the lift data table
function removeRow(button) {
    const row = button.closest('tr');
    row.remove();
}

// Call loadUserData when the page loads
document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            loadUserData();
        }
    });
});

//Friend add
const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions');

// Function to search for lifters using Typesense
searchInput.addEventListener('input', async (event) => {
    const query = event.target.value.toLowerCase(); // Get the input value
    suggestionsList.innerHTML = ''; // Clear previous suggestions

    if (query) {
        try {
            const response = await client.collections('users').documents().search({
                q: query,                       // Search query
                query_by: 'full_name',         // Field to search against
                sort_by: 'full_name:asc',      // Sorting results
                typo_tokens: true,              // Enable typo tolerance
            });

            response.hits.forEach(hit => {
                const li = document.createElement('li');
                li.textContent = hit.document.full_name; // Display user's full name
                li.addEventListener('click', () => {
                    addFriend(hit.document); // Function to add friend
                    searchInput.value = ''; // Clear search input
                    suggestionsList.innerHTML = ''; // Clear suggestions
                    suggestionsList.style.display = 'none'; // Hide suggestions
                });
                suggestionsList.appendChild(li);
            });

            // Show or hide the suggestions dropdown
            suggestionsList.style.display = response.hits.length ? 'block' : 'none'; // Hide if no suggestions
        } catch (error) {
            console.error("Error retrieving users from Typesense: ", error);
        }
    } else {
        suggestionsList.style.display = 'none'; // Hide if input is empty
    }
});

// Function to add friend (implement as needed)
function addFriend(friendData) {
    console.log("Adding friend:", friendData.full_name);
}