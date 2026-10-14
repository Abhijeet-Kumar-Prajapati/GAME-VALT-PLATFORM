/* ============================================================
   SITE CONFIG — public
   ------------------------------------------------------------
   Ye file repo me hai taki live site par QR code aur payment
   kaam kare.

   Security note (sach baat):
   UPI ID aur mobile number yahan likhe hain, isliye wo public
   repo me dikh sakte hain. Ye jaan-boojhkar kiya gaya hai —
   kyunki UPI ID public hota hai. Google Pay / PhonePe bhi
   apna "Accept Payments" QR share karne par UPI ID dikhata hai.

   QR code me sirf UPI link jaata hai — koi personal data
   payment ke liye zaroori nahi.

   Template / instructions: js/config.example.js
   ============================================================ */

window.SITE_LOCAL = {
    /* ---- Your details ---- */
    ownerName: 'Abhijeet',
    ownerFullName: 'Abhijeet',

    /* Email */
    email: 'abhijeet943935@gmail.com',

    /* ---- Payment ----
       paymentLink khali chhod do — khud ban jayega upi:// se. */
    paymentLink: '',
    paymentLabel: 'Pay via UPI',

    /* ---- UPI ----
       Ye standard UPI ID hai. QR code isi se banta hai. */
    upiId: '9431393935@fam',
    upiName: 'Abhijeet'
};