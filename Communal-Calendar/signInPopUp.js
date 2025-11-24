document.addEventListener("DOMContentLoaded", function () {

    const signInButton = document.querySelector(".signInButton > button");
    const signInOverlay = document.querySelector(".signInPopUpOverlay");
    const closePopup = document.querySelector(".closeSignInPopUp");
    const signInSubmit = document.querySelector("#signInSubmit");
    const userNameInput = document.querySelector("#userNameInput");
    const passwordInput = document.querySelector("#passwordInput");

    // Always read current data from localStorage when page loads
    let currentUser = localStorage.getItem('currentUser');

    //  Fallback if no uploaded image exists
    function getStoredProfileImage() {
        return localStorage.getItem('profilePicture') 
            || "https://via.placeholder.com/100?text=User"; 
    }

    // First UI render 
    updateAuthUI();

    
    // SIGN-IN POPUP open/close
    signInButton.addEventListener("click", function () {
        if (currentUser) {
            alert(`Already signed in as ${currentUser}`);
        } else {
            signInOverlay.style.display = "block";
        }
    });

    closePopup.addEventListener("click", function () {
        signInOverlay.style.display = "none";
    });

    
    // Handle login
    signInSubmit.addEventListener("click", function () {
        const username = userNameInput.value;
        const password = passwordInput.value;
        
        if(username && password){
            currentUser = username;
            localStorage.setItem('currentUser', username);

            signInOverlay.style.display = "none";
            userNameInput.value = '';
            passwordInput.value = '';

            updateAuthUI();
        }
        else{
            alert("Please enter a username and password.");
        }
    });

    
    // Main function to refresh 
    function updateAuthUI() {

        const signInButtonContainer = document.querySelector(".signInButton");

        // Always re-load the current image
        let profilePicture = getStoredProfileImage();

        if (currentUser) {

            // Full profile buttin render  
            signInButtonContainer.innerHTML = `
                <div class="profile-container">
                    <button class="profile-button">
                        <img src="${profilePicture}" class="profile-icon" />
                        <span class="username">${currentUser}</span>
                    </button>

                    <div class="profile-dropdown">
                        <div class="profile-option" id="change-picture">Change Picture</div>
                        <div class="profile-option" id="sign-out">Sign Out</div>
                    </div>
                </div>
            `;

            const profileButton = signInButtonContainer.querySelector('.profile-button');
            const profileDropdown = signInButtonContainer.querySelector('.profile-dropdown');
            const changePictureBtn = signInButtonContainer.querySelector('#change-picture');
            const signOutBtn = signInButtonContainer.querySelector('#sign-out');

            // Dropdown toggle
            profileButton.addEventListener('click', function(e) {
                e.stopPropagation();
                profileDropdown.style.display = 
                    profileDropdown.style.display === "block" ? "none" : "block";
            });

            
            // Change picture 
            changePictureBtn.addEventListener('click', function() {

                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = "image/*";
                fileInput.style.display = "none";

                fileInput.addEventListener('change', function(event) {
                    const file = event.target.files[0];

                    if (file && file.type.startsWith("image/")) {

                        const reader = new FileReader();

                        reader.onload = function(e) {

                            // Save new image
                            localStorage.setItem("profilePicture", e.target.result);

                            // Re-render UI 
                            updateAuthUI();
                        };

                        reader.readAsDataURL(file);
                    } 
                    else {
                        alert("Please select a valid image.");
                    }
                });

                document.body.appendChild(fileInput);
                fileInput.click();

                // Remove input for cleanliness
                setTimeout(() => {
                    if (document.body.contains(fileInput)) {
                        document.body.removeChild(fileInput);
                    }
                }, 500);
            });

            
            // Sign out 
            signOutBtn.addEventListener('click', function() {
                currentUser = null;
                localStorage.removeItem('currentUser');
                localStorage.removeItem('profilePicture');

                updateAuthUI();
            });

            // Close dropdown if user clicks anywhere else
            document.addEventListener('click', function() {
                profileDropdown.style.display = 'none';
            });

        } else {

            // User is logged OUT = show sign-in button again
            signInButtonContainer.innerHTML = `<button>Sign In</button>`;
            signInButtonContainer.querySelector('button').addEventListener('click', function () {
                signInOverlay.style.display = "block";
            });
        }
    }
});
