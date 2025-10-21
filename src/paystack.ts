declare var PaystackPop: any;

export const pay = (email:HTMLInputElement | null, amount:number) => {

if (!email) {
  alert("Email input not found!")
} else {
  const emailInput = email.value.trim()

  // Validate email format before using it
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailInput)) {
    alert("Please enter a valid email address")
  } else {
    // Proceed with Paystack or whatever you’re doing
    const handler = PaystackPop.setup({
      key: "pk_test_xxxxx",
      email: emailInput, // ✅ valid email string here
      amount: 5000 * 100, // Paystack expects kobo (so multiply by 100)
      currency: "NGN",
      callback: function (response: any) {
        alert(`Payment complete! Reference: ${response.reference}`)
      },
      onClose: function () {
        alert("Transaction was not completed")
      }
    })

    handler.openIframe()
  }
}
}