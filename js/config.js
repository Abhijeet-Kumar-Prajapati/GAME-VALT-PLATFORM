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
       1) Agar paymentLink set hai  -> gateway use karo (best, number
          website par KABHI nahi aata)
       2) warna upiId set hai        -> runtime me UPI link bana do.
          Ye bhi repo me nahi hota kyunki sirf config.local.js me hai. */
    paymentLink: '',
    paymentLabel: 'Pay with UPI',

    /* UPI ID - sirf config.local.js me bharni hai, kabhi repo me nahi.
       Link RUNTIME me banaya jaata hai (see paymentLink() below), isliye
       code me koi number likha hua nahi hota. */
    upiId: '',
    upiName: '',

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

/* ============================================================
   PAYMENT LINK BUILDER
   ------------------------------------------------------------
   Do raaste hain, isse chunne ki zaroorat nahi — khud decide
   hota hai:

     1. paymentLink set hai (Razorpay/PayU/Cashfree)
        -> seedha wahi link use hota hai.
           Aapka number website par KABHI nahi aata. (best)

     2. upiId set hai
        -> yahan RUNTIME me upi:// link bana ke diya jaata hai.
           UPI protocol ka link hai — customer ka UPI app isme
           apna data bhar leta hai aur payment seedha aapke
           number pe chala jaata hai.

   Dono me number KISI BHI source file me likha hua nahi hota —
   sirf config.local.js me, jo .gitignore me hai aur GitHub par
   kabhi nahi jaati.
   ============================================================ */
function paymentLink(amount = 0) {
    // 1) Gateway link (recommended — number bilkul safe)
    if (SITE.paymentLink) return SITE.paymentLink;

    // 2) UPI link banayein (amount pehle se set)
    if (SITE.upiId) {
        const params = new URLSearchParams({
            pa: SITE.upiId,
            pn: SITE.upiName || SITE.ownerFullName || '',
            cu: 'INR',
            tn: `${SITE.siteName} Tournament Entry`
        });
        if (amount) params.set('am', String(amount));
        return `upi://pay?${params.toString()}`;
    }

    // 3) Kuch nahi set nahi — payment band
    return '';
}