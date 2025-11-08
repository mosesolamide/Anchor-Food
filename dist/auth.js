import { supabase } from "./supabase-confg.js";
import { showNotification } from "./index.js";
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const errorMessage = document.getElementById("errorMessage");
loginForm === null || loginForm === void 0 ? void 0 : loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';
    }
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });
        if (error)
            throw error;
        showNotification("Successfully Login", true);
        window.location.href = "./rider-dashboard.html";
    }
    catch (err) {
        showNotification(`${err === null || err === void 0 ? void 0 : err.message}`, false);
        console.error("Error:", err);
    }
    finally {
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    }
});
// sign up function
signupForm === null || signupForm === void 0 ? void 0 : signupForm.addEventListener("submit", async (e) => {
    var _a;
    e.preventDefault();
    if (signupBtn) {
        signupBtn.disabled = true;
        signupBtn.textContent = 'Signing up...';
    }
    const formData = new FormData(signupForm);
    const data = Object.fromEntries(formData.entries());
    try {
        if (!data.email || !data.password) {
            showFormError("You must fill all details");
            return;
        }
        if (data.password !== data.cpassword) {
            showFormError("Password does not match");
            return;
        }
        const { data: riderData, error: signUpError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
        });
        if (signUpError) {
            if (signUpError.message.includes("User already registered")) {
                showNotification("This email is already in use. Please log in.", false);
            }
            else {
                showNotification(`Error: ${signUpError.message}`, false);
            }
            return;
        }
        const { error: insertError } = await supabase.from("riderDetails").insert({
            user_id: (_a = riderData.user) === null || _a === void 0 ? void 0 : _a.id,
            fullname: data.fullname,
            matric_no: data.matric_no,
            email: data.email,
            phone_no: data.phone_no,
        });
        if (insertError)
            throw insertError;
        showNotification("Account successfully created!", true);
        setTimeout(() => {
            window.location.href = "./rider-dashboard.html";
        }, 1500);
    }
    catch (err) {
        console.error("Error:", err);
        showNotification(`Unexpected error: ${err === null || err === void 0 ? void 0 : err.message}`, false);
    }
    finally {
        if (signupBtn) {
            signupBtn.disabled = false;
            signupBtn.textContent = "Sign Up";
        }
    }
});
const showFormError = (text) => {
    if (errorMessage) {
        errorMessage.classList.remove("hidden");
        errorMessage.textContent = text;
        setTimeout(() => {
            errorMessage.classList.add("hidden");
        }, 5000);
    }
};
