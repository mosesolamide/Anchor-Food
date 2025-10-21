export const pay = (email, amount, phoneNo) => {
    if (!email) {
        alert("Email input not found!");
    }
    else {
        const emailInput = email.value.trim();
        // Validate email format before using it
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput)) {
            alert("Please enter a valid email address");
        }
        else {
            // Proceed with Paystack or whatever you’re doing
            const handler = PaystackPop.setup({
                key: "pk_test_471c2e6a6ec98b5e2f591bc06d0d5ecc44a5ef99",
                email: emailInput, // ✅ valid email string here
                amount: amount * 100, // Paystack expects kobo (so multiply by 100)
                currency: "NGN",
                callback: function (response) {
                    var _a;
                    alert(`Payment complete! Reference: ${response.reference}`);
                    localStorage.removeItem('packs');
                    (_a = document.getElementById("location")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
                    window.location.href = "OnItway.html";
                },
                onClose: function () {
                    alert("Transaction was not completed");
                }
            });
            handler.openIframe();
        }
    }
};
