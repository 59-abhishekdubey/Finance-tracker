// SIGNUP

const signupForm = document.getElementById("signupForm");

if(signupForm){

signupForm.addEventListener("submit", function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const user = {
name: name,
email: email,
password: password
};

localStorage.setItem("user", JSON.stringify(user));

alert("Signup successful");

window.location.replace("login.html");
});

}


// LOGIN

const loginForm = document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit", function(e){

e.preventDefault();

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const savedUser = JSON.parse(localStorage.getItem("user"));

if(savedUser && email === savedUser.email && password === savedUser.password){

alert("Login successful");

window.location.replace("index.html");
}else{

alert("Invalid email or password");

}

});

}