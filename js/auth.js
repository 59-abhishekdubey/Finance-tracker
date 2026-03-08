function registerUser(user){

let users = JSON.parse(localStorage.getItem("users")) || [];

const existing = users.find(u => u.email === user.email);

if(existing){
return {success:false, error:"User already exists"};
}

users.push(user);

localStorage.setItem("users", JSON.stringify(users));

return {success:true};
}

function loginUser(email,password){

let users = JSON.parse(localStorage.getItem("users")) || [];

const user = users.find(u => u.email === email && u.password === password);

if(!user){
return {success:false, error:"Invalid email or password"};
}

localStorage.setItem("currentUser", JSON.stringify(user));

return {success:true};
}