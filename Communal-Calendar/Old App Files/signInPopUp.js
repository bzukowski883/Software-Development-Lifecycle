document.addEventListener("DOMContentLoaded", function () {
    const signInButton = document.querySelector(".signInButton > button");
    const signInOverlay = document.querySelector(".signInPopUpOverlay");
    const closePopup = document.querySelector(".closeSignInPopUp");
    const signInSubmit = document.querySelector("#signInSubmit");
    const userNameInput = document.querySelector("#userNameInput");
    const passwordInput = document.querySelector("#passwordInput");

    signInButton.addEventListener("click", function () {
        signInOverlay.style.display = "block";
    });

    closePopup.addEventListener("click", function () {
        signInOverlay.style.display = "none";
    });
    signInSubmit.addEventListener("click", function () {
        const username = userNameInput.value;
        const password = passwordInput.value;
        if(username && password){
            signInOverlay.style.display = "none";
            userNameInput.value = null;
            passwordInput.value = null;
            alert("Signed in as " + username);
        }
        else{
            alert("Please enter a username and password.");
        }
    });

});