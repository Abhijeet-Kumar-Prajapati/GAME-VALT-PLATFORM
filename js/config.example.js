/* ============================================================
   SITE CONFIGURATION (template)
   ------------------------------------------------------------
   Ye file sirf EXAMPLE hai. Apni asli details YAHAAN mat daalo -
   wo public ho jayegi.

   Steps:
     1. Neeche '...' wali jagah apni details bharo
     2. File ka naam badal kar 'config.local.js' rakho
     3. index.html me is file ko load karne wali line add karo
        (config.js se PEHLE)

   config.local.js .gitignore me hai, wo GitHub par nahi jayegi.
   ============================================================ */

window.SITE_LOCAL = {
    /* ---- Your details ---- */
    ownerName: '...',
    ownerFullName: '...',

    /* Indian mobile number (10 digits, no +91) */
    phone: '...',
    phoneIntl: '+91...',        // country code ke saath
    phoneDisplay: '+91 00000 00000',  // website par kaise dikhega
    whatsapp: '...',            // sirf country code + number (91...)

    /* Email */
    email: '...',

    /* ---- Payment / UPI ----
       Most banks allow UPI ID = 10-digit mobile number + @bankhandle.
       Agar aapka UPI ID alag hai to wahi daalo. */
    upiId: '...',
    upiName: '...',

    /* ---- Social links (leave '' to hide the button) ---- */
    social: {
        discord: '',
        youtube: '',
        telegram: '',
        instagram: ''
    }
};