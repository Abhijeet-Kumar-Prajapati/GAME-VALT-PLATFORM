# Licenses

This project vendors **no third-party code**.

Every file in this repository was written for this project, with no
external library copied in or bundled. The QR code library that was
previously vendored (`qrcode-generator` by Kazuhiko Arase, MIT) has been
**removed** — payments now use the plain `upi://` deep link instead of a
scanned QR image.

## Web fonts (loaded from Google Fonts, not vendored)

Orbitron, Rajdhani and Inter are loaded from Google Fonts and are licensed
under the SIL Open Font License 1.1.

These fonts are **not** included in this repository — they are requested
from Google's CDN at runtime.