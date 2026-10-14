/* ============================================================
   GAMEVAULT — Core Application
   ============================================================ */

/* ---------- Utilities ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];



const uid = (prefix = 'id') => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

function timeAgo(iso) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
}

function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
}

/* ---------- Toast ---------- */
const Toast = {
    show(message, type = 'info') {
        let wrap = $('.toast-wrap');
        if (!wrap) {
            wrap = document.createElement('div');
            wrap.className = 'toast-wrap';
            document.body.appendChild(wrap);
        }
        const icons = { success: '✓', error: '✕', info: 'ℹ' };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span class="neon-text bold">${icons[type]}</span><span>${esc(message)}</span>`;
        wrap.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'opacity .3s, transform .3s';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(110%)';
            setTimeout(() => toast.remove(), 300);
        }, 3600);
    }
};

/* ---------- Avatar (generated, no external images) ---------- */
function avatarFor(seed, size = 64) {
    const palettes = [
        ['#00e5ff', '#7c4dff'], ['#ff2e93', '#ffb300'], ['#00e676', '#00b0ff'],
        ['#ffb300', '#ff6b2c'], ['#7c4dff', '#ff2e93'], ['#ff4655', '#ffb300']
    ];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    const [c1, c2] = palettes[Math.abs(hash) % palettes.length];
    const initial = seed.charAt(0).toUpperCase();
    return `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
            <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
            </linearGradient></defs>
            <rect width="64" height="64" fill="url(#g)"/>
            <text x="32" y="43" font-family="Orbitron,sans-serif" font-size="28" font-weight="900"
                  fill="#05060f" text-anchor="middle">${initial}</text>
        </svg>`)}`;
}

/* Game cover art generator */
function coverFor(game) {
    const id = game.id.replace(/[^a-z0-9]/g, '');
    const seed = encodeURIComponent(id);
    return `data:image/svg+xml,${seed && encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#111428"/>
                    <stop offset="55%" stop-color="${game.accent}33"/>
                    <stop offset="100%" stop-color="#05060f"/>
                </linearGradient>
                <radialGradient id="glow" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stop-color="${game.accent}" stop-opacity="0.55"/>
                    <stop offset="100%" stop-color="${game.accent}" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <rect width="640" height="400" fill="url(#bg)"/>
            <rect width="640" height="400" fill="url(#glow)"/>
            <g stroke="${game.accent}" stroke-opacity="0.16" stroke-width="1">
                ${Array.from({ length: 10 }, (_, i) => `<line x1="${i * 64}" y1="0" x2="${i * 64}" y2="400"/>`).join('')}
                ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 64}" x2="640" y2="${i * 64}"/>`).join('')}
            </g>
            <circle cx="320" cy="170" r="74" fill="none" stroke="${game.accent}" stroke-width="2.5" stroke-opacity="0.75"/>
            <circle cx="320" cy="170" r="92" fill="none" stroke="${game.accent}" stroke-width="1" stroke-opacity="0.35"/>
            <text x="320" y="200" font-size="82" text-anchor="middle">${game.icon}</text>
            <text x="320" y="330" font-family="Orbitron,sans-serif" font-size="30" font-weight="900"
                  fill="#ffffff" text-anchor="middle" opacity="0.95">${game.short.toUpperCase()}</text>
            <text x="320" y="358" font-family="Rajdhani,sans-serif" font-size="17"
                  fill="${game.accent}" text-anchor="middle" letter-spacing="4">${game.mode.toUpperCase()}</text>
        </svg>`)}`;
}

/* ============================================================
   AUTH
   ============================================================ */
const Auth = {
    users() { return Store.read(DB_KEYS.users, []); },
    session() { return Store.read(DB_KEYS.session, null); },
    current() { return this.session(); },
    isLoggedIn() { return !!this.session(); },

    register(data) {
        const users = this.users();
        if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
            return { ok: false, error: 'An account with this email already exists' };
        }
        if (users.some(u => u.username.toLowerCase() === data.username.toLowerCase())) {
            return { ok: false, error: 'This username is taken' };
        }
        const user = {
            id: uid('u'),
            username: data.username,
            email: data.email,
            pass: data.pass,
            gameId: data.gameId || 'free-fire',
            avatar: '',
            joined: new Date().toISOString().slice(0, 10),
            rank: 'Unranked',
            wins: 0,
            verified: false
        };
        users.push(user);
        Store.write(DB_KEYS.users, users);
        Store.write(DB_KEYS.session, user);
        return { ok: true, user };
    },

    login(email, pass) {
        const users = this.users();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) return { ok: false, error: 'No account found with that email' };
        if (user.pass !== pass) return { ok: false, error: 'Incorrect password' };
        Store.write(DB_KEYS.session, user);
        return { ok: true, user };
    },

    logout() {
        Store.remove(DB_KEYS.session);
        Toast.show('Signed out successfully', 'info');
        renderAuthUI();
    },

    update(patch) {
        const user = this.current();
        if (!user) return null;
        const users = this.users();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx === -1) return null;
        users[idx] = { ...users[idx], ...patch };
        Store.write(DB_KEYS.users, users);
        Store.write(DB_KEYS.session, users[idx]);
        return users[idx];
    }
};

function requireAuth(action = 'continue') {
    if (Auth.isLoggedIn()) return true;
    openModal('authModal');
    Toast.show(`Sign in to ${action}`, 'info');
    return false;
}

/* ============================================================
   FAVORITES
   ============================================================ */
const Favorites = {
    all() { return Store.read(DB_KEYS.favorites, []); },
    has(gameId) { return this.all().includes(gameId); },
    toggle(gameId) {
        const favs = this.all();
        const idx = favs.indexOf(gameId);
        if (idx > -1) { favs.splice(idx, 1); }
        else { favs.push(gameId); }
        Store.write(DB_KEYS.favorites, favs);
        Toast.show(idx > -1 ? 'Removed from library' : 'Added to your library', idx > -1 ? 'info' : 'success');
        return idx === -1;
    }
};

/* ============================================================
   TEAMS / TOURNAMENT REGISTRATION
   ============================================================ */
const Teams = {
    all() { return Store.read(DB_KEYS.teams, []); },

    register(form) {
        if (!Auth.isLoggedIn()) {
            return { ok: false, error: 'Sign in first' };
        }
        const teams = this.all();
        const tournament = TOURNAMENTS.find(t => t.id === form.tournamentId);
        if (!tournament) return { ok: false, error: 'Tournament not found' };

        const members = form.members.filter(m => m.trim());
        if (members.length < tournament.perTeam) {
            return { ok: false, error: `Need exactly ${tournament.perTeam} members for this mode` };
        }
        if (teams.some(t => t.tournamentId === form.tournamentId && t.name.toLowerCase() === form.name.toLowerCase())) {
            return { ok: false, error: 'A team with this name is already registered in this tournament' };
        }
        if (teams.filter(t => t.tournamentId === form.tournamentId).length >= tournament.slots) {
            return { ok: false, error: 'This tournament is full' };
        }

        const team = {
            id: uid('team'),
            name: form.name,
            tournamentId: form.tournamentId,
            game: tournament.game,
            captain: Auth.current().username,
            contact: form.contact,
            email: form.email,
            members,
            ids: form.ids.filter(i => i.trim()),
            status: 'pending',
            date: new Date().toISOString().slice(0, 10)
        };
        teams.push(team);
        Store.write(DB_KEYS.teams, teams);
        return { ok: true, team };
    },

    setStatus(teamId, status) {
        const teams = this.all();
        const idx = teams.findIndex(t => t.id === teamId);
        if (idx === -1) return;
        teams[idx].status = status;
        Store.write(DB_KEYS.teams, teams);
    },

    remove(teamId) {
        const teams = this.all().filter(t => t.id !== teamId);
        Store.write(DB_KEYS.teams, teams);
    }
};

/* ============================================================
   COMMUNITY POSTS
   ============================================================ */
const Community = {
    all() { return Store.read(DB_KEYS.posts, SEED_POSTS); },

    create(data) {
        if (!Auth.isLoggedIn()) return { ok: false, error: 'Sign in to post' };
        const posts = this.all();
        const post = {
            id: uid('p'),
            user: Auth.current().username,
            avatar: '',
            game: data.game || 'free-fire',
            category: data.category || 'Highlight',
            time: new Date().toISOString(),
            content: data.content,
            likes: 0,
            comments: [],
            media: null
        };
        posts.unshift(post);
        Store.write(DB_KEYS.posts, posts);
        return { ok: true, post };
    },

    like(postId) {
        const posts = this.all();
        const post = posts.find(p => p.id === postId);
        if (!post) return 0;
        const liked = Store.read(DB_KEYS.liked, []);
        if (liked.includes(postId)) {
            post.likes = Math.max(0, post.likes - 1);
            Store.write(DB_KEYS.liked, liked.filter(id => id !== postId));
        } else {
            post.likes += 1;
            liked.push(postId);
            Store.write(DB_KEYS.liked, liked);
        }
        Store.write(DB_KEYS.posts, posts);
        return post.likes;
    },

    comment(postId, text) {
        if (!Auth.isLoggedIn()) return { ok: false, error: 'Sign in to comment' };
        const posts = this.all();
        const post = posts.find(p => p.id === postId);
        if (!post) return { ok: false, error: 'Post not found' };
        post.comments.push({ user: Auth.current().username, text, time: new Date().toISOString() });
        Store.write(DB_KEYS.posts, posts);
        return { ok: true };
    },

    remove(postId) {
        const posts = this.all().filter(p => p.id !== postId);
        Store.write(DB_KEYS.posts, posts);
    }
};

/* ============================================================
   PAYMENT (UPI — mobile number based)
   ============================================================ */
const Payment = {
    /* Extract the numeric amount from an entry string like "₹100 / squad" */
    amount(entry) {
        const m = String(entry).match(/(\d+(?:\.\d+)?)/);
        return m ? parseFloat(m[1]) : 0;
    },

    /* UPI deep link — opens GPay/PhonePe/Paytm with amount pre-filled */
    link(entry) {
        return upiLink(this.amount(entry));
    },

    /* Copy UPI ID / link to clipboard */
    async copy(text, label = 'Copied to clipboard') {
        const value = String(text);
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(value);
            } else {
                // Fallback for http:// (local preview) and older browsers
                const ta = document.createElement('textarea');
                ta.value = value;
                ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }
            Toast.show(label, 'success');
        } catch (e) {
            Toast.show('Copy failed — please select manually', 'error');
        }
    },

    /* Full payment panel used in the registration modal and contact page.
       ------------------------------------------------------------
       PRIVACY: yahan koi number, UPI ID ya QR nahi dikhaya jaata.
       Sirf price aur ek "Pay" button. UPI deep link ke andar UPI ID
       jaata hai (ye UPI protocol ka hissa hai - bina iske payment hi
       nahi ho sakti) lekin wo screen par kabhi print nahi hota.
    */
    panel(entry) {
        const amt = this.amount(entry);
        const link = this.link(entry);
        return `
            <div class="divider" style="margin:16px 0"></div>
            <h4 class="bold mb-3" style="font-size:.95rem">💳 Payment</h4>

            <div style="text-align:center;padding:20px 0 16px">
                <div class="xs mute mb-2">Entry fee</div>
                <div class="bold neon-text" style="font-size:2rem;line-height:1.2">${esc(entry)}</div>
            </div>

            <a href="${link}" class="btn btn-hot btn-block btn-lg mb-4">
                📱 Pay with UPI App
            </a>

            <ol class="xs mute" style="line-height:2">
                <li>Upar wala button dabao - teri UPI app khul jayegi</li>
                <li>Amount pehle se set hoga, bas confirm kar do</li>
                <li>Payment hote hi tera slot confirm ho jayega</li>
                ${SITE.email ? `<li>Payment screenshot bhejni ho to email karo:
                    <a href="mailto:${esc(SITE.email)}" class="neon-text">${esc(SITE.email)}</a></li>` : ''}
            </ol>`;
    }
};

/* ============================================================
   NAVIGATION + UI BOOTSTRAP
   ============================================================ */
function showPage(pageId) {
    $$('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');

    $$('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === pageId));
    $$('.drawer-link').forEach(l => l.classList.toggle('active', l.dataset.page === pageId));

    if (window.innerWidth <= 820) closeDrawer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', `#${pageId}`);
}

function openDrawer() { $('#drawer').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeDrawer() { $('#drawer').classList.remove('open'); document.body.style.overflow = ''; }

function openModal(id) { const m = document.getElementById(id); if (m) m.classList.add('open'); }
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('open'); }

function renderAuthUI() {
    const user = Auth.current();
    const authSlot = $('#authSlot');
    if (!authSlot) return;

    if (user) {
        authSlot.innerHTML = `
            <button class="icon-btn" title="Notifications" onclick="toggleNotifications(event)">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 17H9m9 0a2 2 0 002-2l-1-1V9a6 6 0 00-4-5.7V3a1 1 0 10-2 0v.3A6 6 0 005 9v5l-1 1a2 2 0 002 2"/></svg>
                <span class="dot"></span>
            </button>
            <button class="avatar-btn" title="${esc(user.username)}" onclick="showPage('profile')">
                <img src="${user.avatar || avatarFor(user.username)}" alt="${esc(user.username)}">
            </button>`;
    } else {
        authSlot.innerHTML = `
            <button class="btn btn-primary btn-sm" onclick="openModal('authModal')">
                <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 7h-6M9 7H3m12 10h-6M9 17H3M15 4H9m6 13h6m-3-3v6"/></svg>
                Sign In
            </button>`;
    }
}

function toggleNotifications(ev) {
    ev.stopPropagation();
    const open = TOURNAMENTS.filter(t => t.status === 'open').length;
    const live = TOURNAMENTS.filter(t => t.status === 'live').length;
    const posts = Community.all().length;
    openModal('notifModal');
    $('#notifList').innerHTML = [
        ...(live ? [{ icon: '🔴', title: 'Live tournament running', desc: 'Free Fire — Solo Showdown is live now', page: 'tournaments' }] : []),
        { icon: '🏆', title: `${open} tournaments open for registration`, desc: 'Slots filling fast — register your squad', page: 'tournaments' },
        { icon: '📢', title: 'New community activity', desc: `${posts} posts in the feed today`, page: 'community' },
        { icon: '🆕', title: 'Valorant Mobile crossed 100M downloads', desc: 'Read the milestone story', page: 'news' },
        { icon: '🎁', title: 'Daily reward claimed?', desc: 'Check your profile for reward streaks', page: 'profile' }
    ].map(n => `
        <div class="row-item" style="cursor:pointer" onclick="closeModal('notifModal');showPage('${n.page}')">
            <div style="font-size:1.5rem">${n.icon}</div>
            <div>
                <div class="bold sm">${n.title}</div>
                <div class="xs mute">${n.desc}</div>
            </div>
        </div>`).join('');
}

/* ============================================================
   INIT
   ============================================================ */
function initApp() {
    seedDatabase();
    renderAuthUI();

    // Nav active state from hash
    const hash = location.hash.slice(1);
    if (hash && document.getElementById(hash)) showPage(hash);

    // Nav scroll shadow
    const nav = $('.nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
    });

    // Mobile drawer
    const drawer = $('#drawer');
    if (drawer) {
        $('.drawer-overlay', drawer).addEventListener('click', closeDrawer);
    }

    // Modal close on overlay click / Escape
    document.addEventListener('click', e => {
        if (e.target.classList.contains('modal')) e.target.classList.remove('open');
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            $$('.modal.open').forEach(m => m.classList.remove('open'));
            closeDrawer();
        }
    });

    // Scroll reveal
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    fillPublicContact();
    $$('.reveal').forEach(el => observer.observe(el));
}

/* ============================================================
   PUBLIC CONTACT
   ------------------------------------------------------------
   Site par sirf DO cheezein dikhti hain: naam aur Gmail.
   Mobile number kabhi screen par nahi aata - na footer me,
   na payment me, na kahin aur.

   Ye function har <span class="site-email"> ko Gmail se bhar
   deta hai. Agar config.local.js nahi hai to "Not configured"
   dikhega (lekin koi number leak nahi hoga).
   ============================================================ */
function fillPublicContact() {
    const email = SITE.email || '';
    const name = SITE.ownerFullName || SITE.ownerName || '';

    $$('.site-email').forEach(el => {
        if (!email) { el.textContent = 'Not configured'; return; }
        // Gmail hamesha visible rahega (user ne yahi allow kiya hai)
        el.innerHTML = `<a href="mailto:${esc(email)}" class="neon-text">${esc(email)}</a>`;
    });

    $$('.site-owner').forEach(el => {
        el.textContent = name || 'Not configured';
    });
}

document.addEventListener('DOMContentLoaded', initApp);