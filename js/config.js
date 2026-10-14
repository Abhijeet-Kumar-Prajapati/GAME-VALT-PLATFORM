/* ============================================================
   GAMEVAULT — Site Configuration (PUBLIC — koi personal detail nahi)
   ------------------------------------------------------------
   Is file me KABHI bhi personal detail ya UPI ID mat likho.
   Ye file public repo me jati hai.

   Site par sirf 2 cheezein dikhti hain:
     1. Naam
     2. Gmail ID

   Mobile number, UPI ID, WhatsApp — kuch bhi yahan nahi.

   Asli details 'config.local.js' me daalo (wo .gitignore me hai).
   Template: js/config.example.js

   PAYMENT ke liye payment gateway use karo (Razorpay / PayU /
   Cashfree). Unka payment link config.local.js me daalo — wo
   link me aapka UPI ID already hota hai, isliye aapka number
   kabhi aapki website par nahi aata.
   ============================================================ */

const SITE = {
    /* ---- Your details (config.local.js se aate hain) ---- */
    ownerName: '',
    ownerFullName: '',
    email: '',

    /* ---- Payment ----
       Payment gateway ka link. Example (Razorpay):
           https://rzp.io/l/xxxxxxxx
       Ya PayU:  https://u.paysqr.link/xxxxx
       Isme amount pehle se set hota hai, isliye har tournament
       ke liye alag link bana sakte ho. */
    paymentLink: '',
    paymentLabel: 'Pay securely',

    /* ---- Branding ---- */
    siteName: 'GameVault',
    siteTagline: 'India\'s Mobile Gaming Platform',
    domain: 'gamevault',                 // display name only (no live domain yet)
    currency: '₹',

    /* ---- Social links (leave '' to hide the button) ---- */
    social: {
        discord: '',
        youtube: '',
        telegram: '',
        instagram: ''
    },

    /* ---- Business info ---- */
    city: 'India',
    supportHours: '10 AM – 10 PM IST'
};

/* config.local.js (gitignored) se asli details merge karo.
   Wo file nahi hui to site khud kaam karega, bas contact
   section 'Not configured' dikhayega aur payment button chhupa
   rahega. */
if (typeof window !== 'undefined' && window.SITE_LOCAL && typeof window.SITE_LOCAL === 'object') {
    Object.assign(SITE, window.SITE_LOCAL);
}

/* Payment gateway ka link. Koi UPI deep-link nahi — isse number
   kabhi browser tak nahi jaata. */
function paymentLink() {
    return SITE.paymentLink || '';
}