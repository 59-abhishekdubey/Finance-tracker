function navigateTo(page) {

const pages = [
"landing-page",
"login-page",
"register-page",
"home-page"
];

pages.forEach(id => {
const el = document.getElementById(id);
if(el){
el.style.display = "none";
}
});

if(page === "login"){
document.getElementById("login-page").style.display = "block";
}

if(page === "register"){
document.getElementById("register-page").style.display = "block";
}

if(page === "home"){
document.getElementById("home-page").style.display = "block";
}

}
