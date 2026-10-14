/* ============================================================
   QR CODE GENERATOR  —  zero dependencies
   ------------------------------------------------------------
   Ye poora QR encoder hai (QR Code Model 2, byte mode, level M),
   apne liye likha gaya hai. Koi external library nahi.

   Sirf itna karta hai:
     text  ->  QR matrix  ->  <svg> string

   UPI link (upi://pay?pa=...&am=...) ko QR me daal deta hai,
   jise GPay/PhonePe/Paytm scan karke payment kar sakte ho.

   Spec: ISO/IEC 18004
   ============================================================ */

const QR = (() => {

    /* ---------- GF(256) arithmetic (Reed-Solomon ke liye) ---------- */
    const EXP = new Uint8Array(512);
    const LOG = new Uint8Array(256);
    (function initGF() {
        let x = 1;
        for (let i = 0; i < 255; i++) {
            EXP[i] = x;
            LOG[x] = i;
            x <<= 1;
            if (x & 0x100) x ^= 0x11D;      // primitive polynomial
        }
        for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
    })();

    function gfMul(a, b) {
        if (a === 0 || b === 0) return 0;
        return EXP[LOG[a] + LOG[b]];
    }

    /* Generator polynomial for `degree` error-correction codewords.
       Convention: poly[0] is the HIGHEST-degree coefficient, so the
       result starts with 0x01 (the leading 1 of x^degree).
       g(x) = (x - a^0)(x - a^1)...(x - a^(degree-1)) */
    function rsGenerator(degree) {
        let poly = [1];
        for (let i = 0; i < degree; i++) {
            const next = new Array(poly.length + 1).fill(0);
            for (let j = 0; j < poly.length; j++) {
                next[j] ^= poly[j];                        // x * poly
                next[j + 1] ^= gfMul(poly[j], EXP[i]);     // + a^i * poly
            }
            poly = next;
        }
        return poly;
    }

    /* Reed-Solomon ECC for one block */
    function rsEncode(data, ecLen) {
        const gen = rsGenerator(ecLen);
        const res = new Array(ecLen).fill(0);
        for (const b of data) {
            const factor = b ^ res[0];
            res.shift();
            res.push(0);
            for (let i = 0; i < ecLen; i++) {
                res[i] ^= gfMul(gen[i + 1], factor);
            }
        }
        return res;
    }

    /* ---------- Version table (error-correction level M) ----------
       [ ecPerBlock, group1Blocks, group1Data, group2Blocks, group2Data ] */
    const VER = {
        1:  [10, 1, 16, 0, 0],   2:  [16, 1, 28, 0, 0],
        3:  [26, 1, 44, 0, 0],   4:  [18, 2, 32, 0, 0],
        5:  [24, 2, 43, 0, 0],   6:  [16, 4, 27, 0, 0],
        7:  [18, 4, 31, 0, 0],   8:  [22, 2, 38, 2, 39],
        9:  [22, 3, 36, 2, 37],  10: [26, 4, 43, 1, 44]
    };

    const ALIGN = {
        1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
        6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50]
    };

    const dataCapacity = v => VER[v][1] * VER[v][2] + VER[v][3] * VER[v][4];

    /* ---------- Bit stream ---------- */
    function toBits(bytes) {
        const bits = [];
        for (const b of bytes) {
            for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1);
        }
        return bits;
    }

    function buildDataCodewords(text, version) {
        const bytes = Array.from(new TextEncoder().encode(text));
        const countBits = version < 10 ? 8 : 16;

        const bits = [];
        // mode indicator: 0100 (byte mode)
        bits.push(0, 1, 0, 0);
        // character count
        for (let i = countBits - 1; i >= 0; i--) {
            bits.push((bytes.length >> i) & 1);
        }
        // data
        for (const b of bytes) {
            for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1);
        }

        const capBits = dataCapacity(version) * 8;
        // terminator (4 zero bits max)
        for (let i = 0; i < 4 && bits.length < capBits; i++) bits.push(0);
        // pad to byte boundary
        while (bits.length % 8 !== 0) bits.push(0);

        // pad bytes 0xEC / 0x11
        const out = [];
        for (let i = 0; i < bits.length; i += 8) {
            let v = 0;
            for (let j = 0; j < 8; j++) v = (v << 1) | bits[i + j];
            out.push(v);
        }
        const PAD = [0xEC, 0x11];
        let p = 0;
        while (out.length < dataCapacity(version)) {
            out.push(PAD[p++ % 2]);
        }
        return out;
    }

    /* ---------- Split into blocks + interleave ---------- */
    function interleave(codewords, version) {
        const [ec, g1n, g1d, g2n, g2d] = VER[version];

        const blocks = [];
        let idx = 0;
        for (let i = 0; i < g1n; i++) { blocks.push(codewords.slice(idx, idx + g1d)); idx += g1d; }
        for (let i = 0; i < g2n; i++) { blocks.push(codewords.slice(idx, idx + g2d)); idx += g2d; }

        const ecBlocks = blocks.map(b => rsEncode(b, ec));

        // interleave data
        const out = [];
        const maxData = Math.max(...blocks.map(b => b.length));
        for (let i = 0; i < maxData; i++) {
            for (const b of blocks) if (i < b.length) out.push(b[i]);
        }
        // interleave EC
        for (let i = 0; i < ec; i++) {
            for (const b of ecBlocks) out.push(b[i]);
        }
        return out;
    }

    /* ---------- Matrix construction ---------- */
    function makeMatrix(version) {
        const size = version * 4 + 17;
        const m = Array.from({ length: size }, () => new Int8Array(size).fill(-1));
        const reserved = Array.from({ length: size }, () => new Uint8Array(size));

        const setF = (r, c, v) => { if (r >= 0 && r < size && c >= 0 && c < size) { m[r][c] = v; reserved[r][c] = 1; } };

        // finder patterns + separators
        const finder = (row, col) => {
            for (let r = -1; r <= 7; r++) {
                for (let c = -1; c <= 7; c++) {
                    const rr = row + r, cc = col + c;
                    if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
                    const inner = (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
                                 (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
                                 (r >= 2 && r <= 4 && c >= 2 && c <= 4);
                    setF(rr, cc, inner ? 1 : 0);
                }
            }
        };
        finder(0, 0); finder(0, size - 7); finder(size - 7, 0);

        // timing patterns
        for (let i = 8; i < size - 8; i++) {
            setF(6, i, i % 2 === 0 ? 1 : 0);
            setF(i, 6, i % 2 === 0 ? 1 : 0);
        }

        // alignment patterns
        const pos = ALIGN[version];
        for (const r of pos) {
            for (const c of pos) {
                // skip the three finder corners
                if ((r === 6 && c === 6) || (r === 6 && c === size - 7) || (r === size - 7 && c === 6)) continue;
                for (let dr = -2; dr <= 2; dr++) {
                    for (let dc = -2; dc <= 2; dc++) {
                        const v = (Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0)) ? 1 : 0;
                        setF(r + dr, c + dc, v);
                    }
                }
            }
        }

        // dark module
        setF(size - 8, 8, 1);

        // reserve format info areas
        for (let i = 0; i < 9; i++) {
            if (!reserved[8][i]) { m[8][i] = 0; reserved[8][i] = 1; }
            if (!reserved[i][8]) { m[i][8] = 0; reserved[i][8] = 1; }
        }
        for (let i = 0; i < 8; i++) {
            if (!reserved[8][size - 1 - i]) { m[8][size - 1 - i] = 0; reserved[8][size - 1 - i] = 1; }
            if (!reserved[size - 1 - i][8]) { m[size - 1 - i][8] = 0; reserved[size - 1 - i][8] = 1; }
        }

        // version info (version >= 7)
        if (version >= 7) {
            for (let i = 0; i < 18; i++) {
                const r = Math.floor(i / 3), c = size - 11 + (i % 3);
                m[r][c] = 0; reserved[r][c] = 1;
                m[c][r] = 0; reserved[c][r] = 1;
            }
        }

        return { m, reserved, size };
    }

    /* place data bits in zigzag */
    function placeData(m, reserved, size, codewords) {
        const bits = toBits(codewords);
        let bitIdx = 0;
        let up = true;
        for (let col = size - 1; col > 0; col -= 2) {
            if (col === 6) col--;             // skip vertical timing column
            for (let i = 0; i < size; i++) {
                const row = up ? size - 1 - i : i;
                for (const c of [col, col - 1]) {
                    if (reserved[row][c]) continue;
                    m[row][c] = bitIdx < bits.length ? bits[bitIdx] : 0;
                    bitIdx++;
                }
            }
            up = !up;
        }
    }

    /* ---------- Masks ---------- */
    const MASKS = [
        (r, c) => (r + c) % 2 === 0,
        (r) => r % 2 === 0,
        (r, c) => c % 3 === 0,
        (r, c) => (r + c) % 3 === 0,
        (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
        (r, c) => (r * c) % 2 + (r * c) % 3 === 0,
        (r, c) => ((r * c) % 2 + (r * c) % 3) % 2 === 0,
        (r, c) => ((r + c) % 2 + (r * c) % 3) % 2 === 0
    ];

    function applyMask(m, reserved, size, maskIdx) {
        const out = m.map(row => Int8Array.from(row));
        const fn = MASKS[maskIdx];
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (!reserved[r][c] && fn(r, c)) out[r][c] ^= 1;
            }
        }
        return out;
    }

    /* ---------- Format info (BCH 15,5) ---------- */
    function formatBits(maskIdx) {
        // level M = 0b00
        const data = (0b00 << 3) | maskIdx;
        let v = data << 10;
        for (let i = 4; i >= 0; i--) {
            if ((v >> (i + 10)) & 1) v ^= 0b10100110111 << i;
        }
        return ((data << 10) | v) ^ 0b101010000010010;
    }

    /* Format info placement (ISO/IEC 18004)
           Vertical   : column 8  -> rows 0..5, 7..8, size-7..size-1
           Horizontal : row 8     -> cols size-1..size-8, 7, 5..0
           Bit 0 is the LSB of the 15-bit string. */
    function putFormat(m, size, maskIdx) {
        const bits = formatBits(maskIdx);
        for (let i = 0; i < 15; i++) {
            const v = (bits >> i) & 1;
            // vertical strip (column 8)
            if (i < 6)       m[i][8] = v;
            else if (i < 8)  m[i + 1][8] = v;
            else             m[size - 15 + i][8] = v;
            // horizontal strip (row 8)
            if (i < 8)       m[8][size - i - 1] = v;
            else if (i < 9)  m[8][7] = v;
            else             m[8][15 - i - 1] = v;
        }
        m[size - 8][8] = 1;   // dark module
    }

    /* ---------- Version info (BCH 18,6) ---------- */
    function putVersion(m, size, version) {
        if (version < 7) return;
        let v = version << 12;
        for (let i = 5; i >= 0; i--) {
            if ((v >> (i + 12)) & 1) v ^= 0b1111100100101 << i;
        }
        const bits = (version << 12) | v;
        for (let i = 0; i < 18; i++) {
            const bit = (bits >> i) & 1;
            const r = Math.floor(i / 3), c = size - 11 + (i % 3);
            m[r][c] = bit;
            m[c][r] = bit;
        }
    }

    /* ---------- Penalty scoring ---------- */
    function penalty(m, size) {
        let score = 0;

        // rule 1: runs of 5+
        for (let i = 0; i < size; i++) {
            for (const dir of [0, 1]) {
                let run = 1;
                let prev = dir ? m[0][i] : m[i][0];
                for (let j = 1; j < size; j++) {
                    const v = dir ? m[j][i] : m[i][j];
                    if (v === prev) { run++; }
                    else { if (run >= 5) score += 3 + (run - 5); run = 1; prev = v; }
                }
                if (run >= 5) score += 3 + (run - 5);
            }
        }

        // rule 2: 2x2 blocks
        for (let r = 0; r < size - 1; r++) {
            for (let c = 0; c < size - 1; c++) {
                const v = m[r][c];
                if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) score += 3;
            }
        }

        // rule 3: finder-like patterns
        const pat1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
        const pat2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
        const match = (arr, pat) => {
            let n = 0;
            for (let i = 0; i + pat.length <= arr.length; i++) {
                let ok = true;
                for (let j = 0; j < pat.length; j++) if (arr[i + j] !== pat[j]) { ok = false; break; }
                if (ok) n++;
            }
            return n;
        };
        for (let i = 0; i < size; i++) {
            const row = Array.from(m[i]);
            const col = Array.from({ length: size }, (_, j) => m[j][i]);
            score += 40 * match(row, pat1) + 40 * match(row, pat2);
            score += 40 * match(col, pat1) + 40 * match(col, pat2);
        }

        // rule 4: dark ratio
        let dark = 0;
        for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) dark += m[r][c];
        const pct = (dark * 100) / (size * size);
        score += Math.floor(Math.abs(pct - 50) / 5) * 10;

        return score;
    }

    /* ---------- Public: encode ---------- */
    function encode(text) {
        if (typeof text !== 'string' || !text) return null;

        // UTF-8 bytes (JS char count se different ho sakta hai - unicode ho to)
        const byteLen = new TextEncoder().encode(text).length;

        // smallest version that fits
        let version = 0;
        for (let v = 1; v <= 10; v++) {
            const countBits = v < 10 ? 8 : 16;
            const need = 4 + countBits + byteLen * 8;
            if (need <= dataCapacity(v) * 8) { version = v; break; }
        }
        if (!version) return null;   // too long

        const codewords = interleave(buildDataCodewords(text, version), version);
        const { m, reserved, size } = makeMatrix(version);
        placeData(m, reserved, size, codewords);

        // try all 8 masks, keep lowest penalty
        let best = null, bestScore = Infinity;
        for (let k = 0; k < 8; k++) {
            const cand = applyMask(m, reserved, size, k);
            putFormat(cand, size, k);
            putVersion(cand, size, version);
            const s = penalty(cand, size);
            if (s < bestScore) { bestScore = s; best = cand; }
        }

        return { size, version, modules: best };
    }

    /* ---------- Public: SVG string ---------- */
    function toSVG(text, px = 160) {
        const q = encode(text);
        if (!q) return '';
        const { size, modules } = q;
        const cell = 4, quiet = 4;
        const dim = (size + quiet * 2) * cell;
        const parts = [];
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (modules[r][c]) {
                    parts.push(`M${(c + quiet) * cell} ${(r + quiet) * cell}h${cell}v${cell}h-${cell}z`);
                }
            }
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" width="${px}" height="${px}" shape-rendering="crispEdges" role="img" aria-label="Payment QR code">`
            + `<rect width="${dim}" height="${dim}" fill="#ffffff"/>`
            + `<path d="${parts.join('')}" fill="#000000"/></svg>`;
    }

    return { encode, toSVG };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = QR;