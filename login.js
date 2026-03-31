// 🔥 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCj4P0UM0HBDI1ytoeZbFx10aBBOX9cKkg",
  authDomain: "food-expiry-app-ceb50.firebaseapp.com",
  projectId: "food-expiry-app-ceb50",
  storageBucket: "food-expiry-app-ceb50.firebasestorage.app",
  messagingSenderId: "131583253131",
  appId: "1:131583253131:web:cc26a716838c0e06add28e",
  measurementId: "G-MQDJKS2XLH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ✅ LOGIN
function login(){
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if(email === "" || password === ""){
    alert("Please fill all fields ❗");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(()=>{
    alert("Login Success ✅");
    window.location.href = "index.html";
  })
  .catch(error=>{
    alert(error.message);
  });
}

// ✅ SIGNUP
function signup(){
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if(email === "" || password === ""){
    alert("Please fill all fields ❗");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
  .then(()=>{
    alert("Account Created 🎉 Now Login");
  })
  .catch(error=>{
    alert(error.message);
  });
}

// ✅ RESET PASSWORD
function resetPassword(){
  let email = document.getElementById("email").value;

  if(email === ""){
    alert("Enter your email first ❗");
    return;
  }

  auth.sendPasswordResetEmail(email)
  .then(()=>{
    alert("Reset Email Sent 📧");
  })
  .catch(error=>{
    alert(error.message);
  });
}