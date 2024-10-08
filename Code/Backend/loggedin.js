// Function to fetch user data from Firebase
function fetchUserData(uid) {
    const userRef = database.ref('users/' + uid);
    userRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            document.getElementById('user-full-name').textContent = userData.full_name || 'N/A';
            document.getElementById('user-email').textContent = userData.email || 'N/A';

            // Fetch lift data
            const liftRef = database.ref('users/' + uid + '/liftData');
            liftRef.once('value').then((liftSnapshot) => {
                if (liftSnapshot.exists()) {
                    const liftData = liftSnapshot.val();
                    document.getElementById('user-bench').textContent = liftData.bench || 'N/A';
                    document.getElementById('user-squat').textContent = liftData.squat || 'N/A';
                    document.getElementById('user-deadlift').textContent = liftData.deadlift || 'N/A';
                } else {
                    document.getElementById('user-bench').textContent = 'N/A';
                    document.getElementById('user-squat').textContent = 'N/A';
                    document.getElementById('user-deadlift').textContent = 'N/A';
                }
            }).catch((error) => {
                console.error("Error fetching lift data:", error);
            });

            // Hide the login container and show the profile container
            document.getElementById('login-dropdown').style.display = 'none';
            document.getElementById('profile-container').style.display = 'block';
        } else {
            alert('No user data found.');
        }
    }).catch((error) => {
        console.error("Error fetching user data:", error);
    });
}
