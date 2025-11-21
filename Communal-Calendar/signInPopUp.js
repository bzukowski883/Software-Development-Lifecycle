document.addEventListener("DOMContentLoaded", function () {
    const signInButton = document.querySelector(".signInButton > button");
    const signInOverlay = document.querySelector(".signInPopUpOverlay");
    const closePopup = document.querySelector(".closeSignInPopUp");
    const signInSubmit = document.querySelector("#signInSubmit");
    const userNameInput = document.querySelector("#userNameInput");
    const passwordInput = document.querySelector("#passwordInput");

    // Check if user is already signed in (from localStorage)
    let currentUser = localStorage.getItem('currentUser');
    let profilePicture = localStorage.getItem('profilePicture') || '👤'; // Default emoji

    // Initialize the UI based on sign-in status
    updateAuthUI();

    signInButton.addEventListener("click", function () {
        // Check if user is already signed in
        if (currentUser) {
            // If already signed in, show profile options
            alert(`Already signed in as ${currentUser}`);
        } else {
            signInOverlay.style.display = "block";
        }
    });

    closePopup.addEventListener("click", function () {
        signInOverlay.style.display = "none";
    });

    signInSubmit.addEventListener("click", function () {
        const username = userNameInput.value;
        const password = passwordInput.value;
        
        if(username && password){
            // Store user info in localStorage
            currentUser = username;
            localStorage.setItem('currentUser', username);
            
            // Close popup and reset fields
            signInOverlay.style.display = "none";
            userNameInput.value = '';
            passwordInput.value = '';
            
            // Update UI to show profile instead of sign-in button
            updateAuthUI();
            
            alert("Signed in as " + username);
        }
        else{
            alert("Please enter a username and password.");
        }
    });

    // Function to update the authentication UI
    function updateAuthUI() {
        const signInButtonContainer = document.querySelector(".signInButton");
        
        if (currentUser) {
            // REPLACED: Sign-in button with profile icon and dropdown
            signInButtonContainer.innerHTML = `
                <div class="profile-container">
                    <button class="profile-button">
                        <span class="profile-icon">${profilePicture}</span>
                        <span class="username">${currentUser}</span>
                    </button>
                    <div class="profile-dropdown">
                        <div class="profile-option" id="change-picture">Change Picture</div>
                        <div class="profile-option" id="sign-out">Sign Out</div>
                    </div>
                </div>
            `;

            // Add event listeners for the new profile elements
            const profileButton = signInButtonContainer.querySelector('.profile-button');
            const profileDropdown = signInButtonContainer.querySelector('.profile-dropdown');
            const changePictureBtn = signInButtonContainer.querySelector('#change-picture');
            const signOutBtn = signInButtonContainer.querySelector('#sign-out');

            // Toggle dropdown visibility
            profileButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent immediate closing
                profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
            });
            

// NEW: Change picture functionality with file input
changePictureBtn.addEventListener('click', function() {
    // Create a hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // Only allow image files
    fileInput.style.display = 'none';
    
    // Add event listener for when user selects a file
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file (JPEG, PNG, GIF, etc.)');
                return;
            }
            
            // Create a FileReader to read the image
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // e.target.result contains the image as data URL
                profilePicture = e.target.result;
                localStorage.setItem('profilePicture', profilePicture);
                updateAuthUI(); // Refresh UI with new picture
            };
            
            reader.onerror = function() {
                alert('Error reading the image file. Please try another image.');
            };
            
            // Read the image file as data URL
            reader.readAsDataURL(file);
        }
    });
    
    // Add the file input to the page and trigger click
    document.body.appendChild(fileInput);
    fileInput.click();
    
    // Clean up: remove the file input after use
    fileInput.addEventListener('click', function() {
        setTimeout(() => {
            if (document.body.contains(fileInput)) {
                document.body.removeChild(fileInput);
            }
        }, 1000);
    });
});

            // Sign out functionality
            signOutBtn.addEventListener('click', function() {
                currentUser = null;
                localStorage.removeItem('currentUser');
                localStorage.removeItem('profilePicture');
                updateAuthUI(); // Refresh UI back to sign-in button
                alert("Signed out successfully");
            });

            // Close dropdown when clicking elsewhere on the page
            document.addEventListener('click', function() {
                profileDropdown.style.display = 'none';
            });

        } else {
            // Show regular sign-in button when not signed in
            signInButtonContainer.innerHTML = `<button>Sign In</button>`;
            
            // Re-add event listener to the newly created sign-in button
            signInButtonContainer.querySelector('button').addEventListener('click', function() {
                signInOverlay.style.display = 'block';
            });
        }
    }
});