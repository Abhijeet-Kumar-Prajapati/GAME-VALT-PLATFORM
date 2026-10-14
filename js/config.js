/* ============================================================
   GAMEVAULT — Site Configuration (PUBLIC — koi personal detail nahi)
   ------------------------------------------------------------
   Phone, email aur UPI ID jaan-boojhkar YAHAAN nahi rakhe gaye,
   taaki ye public repo me kabhi leak na hon.

   Asli details 'config.local.js' me daalo — wo file .gitignore
   me hai aur GitHub par push nahi hoti.

   Template dekho: js/config.example.js
   ============================================================ */

const SITE = {
    /* ---- Your details ----
       Ye sab config.local.js se aate hain. Tab tak khali rahenge. */
    ownerName: '',
    ownerFullName: '',

    /* Indian mobile number (10 digits, no +91) */
    phone: '',
    phoneIntl: '',
    phoneDisplay: '',
    whatsapp: '',

    /* Email */
    email: '',

    /* ---- Payment / UPI ---- */
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
   section 'Not configured' dikhayega. */
if (typeof window !== 'undefined' && window.SITE_LOCAL && typeof window.SITE_LOCAL === 'object') {
    Object.assign(SITE, window.SITE_LOCAL);
}

/* UPI deep-link — opens any UPI app with the amount pre-filled */
function upiLink(amount) {
    const params = new URLSearchParams({
        pa: SITE.upiId,
        pn: SITE.upiName,
        cu: 'INR',
        tn: `${SITE.siteName} Tournament Entry`
    });
    if (amount) params.set('am', String(amount));
    return `upi://pay?${params.toString()}`;
}

/* Pretty-print a phone number for display */
function phonePretty() {
    return SITE.phoneDisplay;
}