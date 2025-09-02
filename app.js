// Paste your Firebase config object here
const firebaseConfig = {
    apiKey: "AIzaSyCwA7rqlO_E5PHF-EYKgnl5H0D8qqNS1Mw",
    authDomain: "vpn-user-manager.firebaseapp.com",
    projectId: "vpn-user-manager",
    storageBucket: "vpn-user-manager.firebasestorage.app",
    messagingSenderId: "600555282917",
    appId: "1:600555282917:web:51778f6ffeeb22082c0f0c",
    measurementId: "G-RCX7FST8L5"
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const usersRef = database.ref('users');

const userForm = document.getElementById('user-form');
const userTableBody = document.getElementById('user-table-body');

// Function to add a user to the database
userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const expDate = document.getElementById('exp-date').value;

    usersRef.push({
        username: username,
        expDate: expDate,
        createdAt: new Date().toISOString()
    });

    userForm.reset();
});

// Function to display users from the database
usersRef.on('value', (snapshot) => {
    userTableBody.innerHTML = '';
    const users = snapshot.val();
    if (users) {
        Object.keys(users).forEach(key => {
            const user = users[key];
            const expDate = new Date(user.expDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const oneDay = 1000 * 60 * 60 * 24;
            const diffInDays = Math.ceil((expDate.getTime() - today.getTime()) / oneDay);

            let statusText = '';
            let statusClass = '';

            if (diffInDays < 0) {
                statusText = 'Expired';
                statusClass = 'expired';
            } else if (diffInDays === 0) {
                statusText = 'Expires Today';
                statusClass = 'expiring';
            } else {
                statusText = `${diffInDays} days left`;
                statusClass = 'active';
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.expDate}</td>
                <td class="${statusClass}">${statusText}</td>
            `;
            userTableBody.appendChild(row);
        });
    }
});
