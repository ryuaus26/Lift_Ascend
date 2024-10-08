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

function removeRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

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
            })
            .catch((error) => {
                console.error("Error submitting lift data:", error);
                alert('Failed to submit lift data. Please try again.');
            });
    } else {
        alert('No valid lift data to submit.');
    }
}

function clearLiftDataTable() {
    const tbody = document.getElementById('liftDataBody');
    tbody.innerHTML = `
        <tr>
            <td><input type="number" class="age" placeholder="Age"></td>
            <td><input type="number" class="squat" placeholder="Squat"></td>
            <td><input type="number" class="bench" placeholder="Bench"></td>
            <td><input type="number" class="deadlift" placeholder="Deadlift"></td>
            <td><button onclick="removeRow(this)">Remove</button></td>
        </tr>
    `;
}