var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { supabase } from "./supabase-confg.js";
import { showNotification } from "./index.js";
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const signupBtn = document.getElementById("signup-btn");
const errorMessage = document.getElementById("errorMessage");
// login functions
loginForm === null || loginForm === void 0 ? void 0 : loginForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    // Disable button
    if (signupBtn) {
        signupBtn.disabled = true;
        signupBtn.textContent = 'Loggin...';
    }
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());
    try {
        const { error } = yield supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });
        if (error) {
            throw error;
        }
        showNotification("Successfully Login", true);
        window.location.href = "./LandingPage.html";
        if (signupBtn) {
            signupBtn.disabled = false;
            signupBtn.textContent = 'Login';
        }
    }
    catch (err) {
        showNotification(`${err === null || err === void 0 ? void 0 : err.message} `, false);
        console.error("Error:", err);
    }
}));
// sign up function
signupForm === null || signupForm === void 0 ? void 0 : signupForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    e.preventDefault();
    // Disable button
    if (signupBtn) {
        signupBtn.disabled = true;
        signupBtn.textContent = 'Signing up...';
    }
    const formData = new FormData(signupForm);
    const data = Object.fromEntries(formData.entries());
    try {
        if (!data.email || !data.password) {
            if (errorMessage) {
                showFormError("You must fill all details");
                if (signupBtn) {
                    signupBtn.disabled = false;
                    signupBtn.textContent = 'Sign Up';
                }
                return;
            }
        }
        if (data.password !== data.cpassword) {
            if (errorMessage) {
                showFormError("Password does not match");
                if (signupBtn) {
                    signupBtn.disabled = false;
                    signupBtn.textContent = 'Sign Up';
                }
                return;
            }
        }
        // register rider email, password
        const { data: riderData, error: signUpError } = yield supabase.auth.signUp({
            email: data.email,
            password: data.password,
        });
        if (signUpError) {
            // Handle "already registered" gracefully
            if (signUpError.message.includes("User already registered")) {
                showNotification("This email is already in use. Please log in.", false);
            }
            else {
                showNotification(`Error: ${signUpError.message}`, false);
            }
            return;
        }
        // Insert rider details into database
        const { error: insertError } = yield supabase.from("riderDetails").insert({
            user_id: (_a = riderData.user) === null || _a === void 0 ? void 0 : _a.id,
            fullname: data.fullname,
            matric_no: data.matric_no,
            email: data.email,
            phone_no: data.phone_no,
        });
        if (insertError)
            throw insertError;
        // Success message
        showNotification("Account successfully created!", true);
        // Redirect after a short delay (1.5s)
        setTimeout(() => {
            window.location.href = "./LandingPage.html";
        }, 1500);
    }
    catch (err) {
        console.error("Error:", err);
        showNotification(`Unexpected error: ${err === null || err === void 0 ? void 0 : err.message}`, false);
    }
    finally {
        // Always re-enable the button
        if (signupBtn) {
            signupBtn.disabled = false;
            signupBtn.textContent = "Sign Up";
        }
    }
}));
const showFormError = (text) => {
    if (errorMessage) {
        errorMessage.classList.remove("hidden");
        errorMessage.textContent = text;
        setTimeout(() => {
            errorMessage.classList.add("hidden");
        }, 5000);
    }
};
