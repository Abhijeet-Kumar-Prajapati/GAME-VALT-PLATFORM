/* ============================================================
   LOCAL CONFIG — YE FILE GIT ME NAHI JAATI (.gitignore me hai)
   ------------------------------------------------------------
   Yahan apni asli details aur payment link daalo. Ye file
   sirf aapke computer / server par rahegi, GitHub par push
   nahi hogi.

   SETUP:
     1. Ye file banao:
          Copy-Item js\config.example.js js\config.local.js
        (Git Bash me:  cp js/config.example.js js/config.local.js)

     2. Neeche '...' wali jagah apni details bharo.

     3. PAYMENT LINK kahan se ayega:
          a) Razorpay  → https://razorpay.com  (free account)
             Dashboard → Payment Links → Create
             Amount aur description bhar do → link copy karo
             Link kuch aisa hoga: https://rzp.io/l/xxxxxxxx

          b) PayU      → https://payu.in
             bhi aisa hi kaam karta hai.

          c) Cashfree  → https://cashfree.me

        Har tournament ka alag amount hai? Har ek ke liye alag
        payment link bana lo, aur config me us link ko rakh lo.

     4. Website kholo — payment button apne aap aa jayega.

   IMPORTANT:
     Ye file GitHub par NAHI hai. Isliye jab tak deploy nahi hota,
     payment button nahi dikhega. Hosting par ye file set karna
     zaroori hai.

     Aapka UPI ID / mobile number is file me KABHI mat likho —
     wo gateway ke paas hota hai, aapke paas nahi rehna chahiye.
   ============================================================ */

window.SITE_LOCAL = {
    /* ---- Your details ---- */
    ownerName: '...',
    ownerFullName: '...',

    /* Email (ye website par dikhegi - sirf yehi dikhta hai) */
    email: '...',

    /* ---- Payment ----
       Gateway ka payment link. Amount isme pehle se set hota hai,
       isliye customer ko sirf Pay karna hai. */
    paymentLink: 'https://rzp.io/l/xxxxxxxx',

    /* Button ka text */
    paymentLabel: 'Pay securely'
};