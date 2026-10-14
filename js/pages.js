/* ============================================================
   GAMEVAULT — Page Renderers
   ============================================================ */

/* ============================================================
   GAMES
   ============================================================ */
const GamesPage = {
    activeGenre: 'All',
    activeSort: 'trending',
    query: '',

    init() {
        this.render();
        this.bind();
    },

    filtered() {
        let list = [...GAMES];
        if (this.activeGenre !== 'All') {
            list = list.filter(g => g.genre.includes(this.activeGenre));
        }
        if (this.query) {
            const q = this.query.toLowerCase();
            list = list.filter(g =>
                g.title.toLowerCase().includes(q) ||
                g.genre.some(x => x.toLowerCase().includes(q)) ||
                g.mode.toLowerCase().includes(q)
            );
        }
        switch (this.activeSort) {
            case 'rating': list.sort((a, b) => b.rating - a.rating); break;
            case 'downloads': list.sort((a, b) => parseFloat(b.downloads) - parseFloat(a.downloads)); break;
            case 'name': list.sort((a, b) => a.title.localeCompare(b.title)); break;
            default: list.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        }
        return list;
    },

    card(game) {
        const isFav = Favorites.has(game.id);
        const stars = '★'.repeat(Math.round(game.rating)) + '☆'.repeat(5 - Math.round(game.rating));
        return `
        <article class="card card-hover reveal">
            <div class="card-media">
                <img src="${coverFor(game)}" alt="${esc(game.title)}" loading="lazy">
                <div style="position:absolute;top:12px;left:12px;z-index:2">
                    <span class="badge ${game.badge === 'New' ? 'badge-new' : game.badge === 'Esports' ? 'badge-live' : 'badge-soon'}">${esc(game.badge)}</span>
                </div>
                <button onclick="GamesPage.toggleFav('${game.id}', this)"
                    style="position:absolute;top:10px;right:10px;z-index:2;width:34px;height:34px;border-radius:10px;
                           display:grid;place-items:center;background:rgba(5,6,15,.7);backdrop-filter:blur(8px);
                           border:1px solid ${isFav ? '#ff2e93' : 'rgba(148,163,184,.3)'};color:${isFav ? '#ff2e93' : '#9aa3cc'};
                           transition:all .2s">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                <div style="position:absolute;bottom:12px;left:12px;right:12px;z-index:2">
                    <div class="flex items-center gap-2">
                        <span style="font-size:1.5rem">${game.icon}</span>
                        <div>
                            <h3 class="bold" style="font-size:1.05rem">${esc(game.title)}</h3>
                            <div class="xs mute">${esc(game.mode)} · ${esc(game.size)}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="sm dim clamp-2 mb-4" style="min-height:40px">${esc(game.desc)}</p>
                <div class="flex gap-2 wrap mb-4">
                    ${game.genre.slice(0, 2).map(g => `<span class="badge badge-done">${esc(g)}</span>`).join('')}
                </div>
                <div class="flex items-center justify-between mb-4" style="font-size:.8rem">
                    <span style="color:${game.accent}">${stars} ${game.rating}</span>
                    <span class="mute">${esc(game.downloads)} downloads</span>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-primary btn-sm" style="flex:1" onclick="GamesPage.details('${game.id}')">Details</button>
                    <button class="btn btn-ghost btn-sm" onclick="location.href='tournaments.html?game=${game.id}'">Tourneys</button>
                </div>
            </div>
        </article>`;
    },

    render() {
        const grid = $('#gamesGrid');
        if (!grid) return;
        const list = this.filtered();
        grid.innerHTML = list.length
            ? list.map(g => this.card(g)).join('')
            : `<div class="empty" style="grid-column:1/-1">
                 <div class="empty-icon">🔍</div>
                 <h4>No games found</h4>
                 <p>Try a different search or genre filter</p>
               </div>`;

        $$('.reveal', grid).forEach((el, i) => {
            el.style.transitionDelay = `${i * 45}ms`;
            el.classList.add('visible');
        });

        const count = $('#gamesCount');
        if (count) count.textContent = `${list.length} game${list.length === 1 ? '' : 's'}`;
    },

    toggleFav(gameId, btn) {
        const added = Favorites.toggle(gameId);
        btn.textContent = added ? '❤️' : '🤍';
        btn.style.borderColor = added ? '#ff2e93' : 'rgba(148,163,184,.3)';
        btn.style.color = added ? '#ff2e93' : '#9aa3cc';
        if ($('#libraryGrid')) ProfilePage.renderLibrary();
    },

    details(gameId) {
        const g = GAMES.find(x => x.id === gameId);
        if (!g) return;
        const stars = '★'.repeat(Math.round(g.rating)) + '☆'.repeat(5 - Math.round(g.rating));
        $('#gameModalTitle').textContent = g.title;
        $('#gameModalBody').innerHTML = `
            <img src="${coverFor(g)}" alt="" style="width:100%;border-radius:14px;margin-bottom:18px">
            <div class="flex items-center gap-3 mb-4">
                <span style="font-size:2.4rem">${g.icon}</span>
                <div>
                    <div style="color:${g.accent}">${stars} <span class="mute">${g.rating} / 5</span></div>
                    <div class="sm mute">${esc(g.mode)} · Released ${g.year}</div>
                </div>
            </div>
            <p class="sm dim mb-6">${esc(g.desc)}</p>
            <div class="grid g-3 mb-6" style="gap:12px">
                <div class="glass" style="padding:14px;border-radius:12px;text-align:center">
                    <div class="bold neon-text">${esc(g.downloads)}</div><div class="xs mute">Downloads</div>
                </div>
                <div class="glass" style="padding:14px;border-radius:12px;text-align:center">
                    <div class="bold neon-text">${esc(g.players)}</div><div class="xs mute">Monthly players</div>
                </div>
                <div class="glass" style="padding:14px;border-radius:12px;text-align:center">
                    <div class="bold neon-text">${esc(g.size)}</div><div class="xs mute">App size</div>
                </div>
            </div>
            <h4 class="bold mb-3" style="font-size:.95rem">Game Modes</h4>
            <div class="chips mb-6">
                ${g.modes.map(m => `<span class="chip">${esc(m)}</span>`).join('')}
            </div>
            <h4 class="bold mb-3" style="font-size:.95rem">Genres</h4>
            <div class="chips mb-6">
                ${g.genre.map(m => `<span class="chip">${esc(m)}</span>`).join('')}
            </div>
            <div class="flex gap-3">
                <button class="btn btn-primary" style="flex:1" onclick="location.href='tournaments.html?game=${g.id}'">Find Tournaments</button>
                <button class="btn btn-hot" onclick="GamesPage.toggleFav('${g.id}', this);closeModal('gameModal')">
                    ${Favorites.has(g.id) ? 'In Library' : 'Add to Library'}
                </button>
            </div>`;
        openModal('gameModal');
    },

    bind() {
        const search = $('#gameSearch');
        if (search) {
            search.addEventListener('input', e => {
                this.query = e.target.value.trim();
                this.render();
            });
        }
        const genreWrap = $('#genreChips');
        if (genreWrap) {
            genreWrap.addEventListener('click', e => {
                const chip = e.target.closest('.chip');
                if (!chip) return;
                $$('.chip', genreWrap).forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.activeGenre = chip.dataset.genre;
                this.render();
            });
        }
        const sort = $('#gameSort');
        if (sort) {
            sort.addEventListener('change', e => {
                this.activeSort = e.target.value;
                this.render();
            });
        }
    }
};

/* ============================================================
   TOURNAMENTS
   ============================================================ */
const TournamentsPage = {
    activeFilter: 'all',

    init() {
        this.render();
        this.bind();
        const params = new URLSearchParams(location.search);
        if (params.get('game')) {
            this.activeFilter = params.get('game');
        }
        this.render();
    },

    filtered() {
        if (this.activeFilter === 'all') return TOURNAMENTS;
        if (this.activeFilter === 'open') return TOURNAMENTS.filter(t => t.status === 'open');
        if (this.activeFilter === 'live') return TOURNAMENTS.filter(t => t.status === 'live');
        return TOURNAMENTS.filter(t => t.game === this.activeFilter);
    },

    statusBadge(status) {
        const map = { live: ['badge-live', 'Live'], open: ['badge-open', 'Open'], soon: ['badge-soon', 'Filling'], done: ['badge-done', 'Ended'] };
        const [cls, label] = map[status] || ['badge-done', status];
        return `<span class="badge ${cls}">${status === 'live' ? '<span class="pulse"></span>' : ''}${label}</span>`;
    },

    card(t) {
        const game = GAMES.find(g => g.id === t.game);
        const pct = Math.round((t.filled / t.slots) * 100);
        const full = t.filled >= t.slots;
        const status = (() => {
            const now = new Date();
            const target = new Date(`${t.date}T${t.time === 'Live now' || t.time === 'Completed' ? '00:00' : t.time}`);
            if (t.status === 'live') return 'Live now';
            if (t.status === 'done') return 'Completed';
            if (target > now) return `in ${Math.max(0, Math.ceil((target - now) / 86400000))}d`;
            return 'Started';
        })();

        return `
        <article class="card card-hover reveal">
            <div style="height:5px;background:linear-gradient(90deg,${game.accent},transparent)"></div>
            <div class="card-body">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <span style="font-size:1.7rem">${game.icon}</span>
                        <div>
                            <div class="xs mute">${esc(game.title)}</div>
                            <div class="bold" style="font-size:.95rem">${esc(t.mode)}</div>
                        </div>
                    </div>
                    ${this.statusBadge(t.status)}
                </div>

                <h3 class="mb-4" style="font-size:1.1rem">${esc(t.title)}</h3>

                <div class="glass mb-4" style="padding:14px;border-radius:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
                    <div><div class="xs mute">Prize Pool</div><div class="bold" style="color:${game.accent}">${esc(t.prize)}</div></div>
                    <div><div class="xs mute">Entry</div><div class="bold sm">${esc(t.entry)}</div></div>
                    <div><div class="xs mute">Format</div><div class="bold sm">${t.perTeam}v${t.perTeam === 1 ? '' : ''} ${t.perTeam === 1 ? 'Solo' : 'Team'}</div></div>
                </div>

                <div class="flex gap-4 mb-4 xs mute wrap">
                    <span>📅 ${formatDate(t.date)}</span>
                    <span>🕐 ${esc(t.time)}</span>
                    <span>👥 ${t.slots} slots</span>
                </div>

                <div class="mb-4">
                    <div class="flex justify-between xs mute mb-2">
                        <span>${t.filled}/${t.slots} registered</span><span>${pct}%</span>
                    </div>
                    <div style="height:7px;background:rgba(148,163,184,.16);border-radius:6px;overflow:hidden">
                        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,${game.accent},${game.accent}99);border-radius:6px"></div>
                    </div>
                </div>

                <p class="xs mute mb-4 clamp-2" style="min-height:32px">${esc(t.rules)}</p>

                <div class="flex gap-2">
                    ${t.status === 'done'
                        ? `<button class="btn btn-ghost btn-sm btn-block" disabled>Ended</button>`
                        : full
                            ? `<button class="btn btn-ghost btn-sm btn-block" disabled>Tournament Full</button>`
                            : `<button class="btn btn-primary btn-sm" style="flex:1" onclick="TournamentsPage.openRegister('${t.id}')">Register Squad</button>
                               <button class="btn btn-ghost btn-sm" onclick="TournamentsPage.details('${t.id}')">Info</button>`}
                </div>
            </div>
        </article>`;
    },

    render() {
        const grid = $('#tournamentsGrid');
        if (!grid) return;
        const list = this.filtered();
        grid.innerHTML = list.length
            ? list.map(t => this.card(t)).join('')
            : `<div class="empty" style="grid-column:1/-1"><div class="empty-icon">🏆</div><h4>No tournaments here</h4><p>Check back soon — new events every week</p></div>`;
        $$('.reveal', grid).forEach((el, i) => {
            el.style.transitionDelay = `${i * 50}ms`;
            el.classList.add('visible');
        });
    },

    details(id) {
        const t = TOURNAMENTS.find(x => x.id === id);
        if (!t) return;
        const game = GAMES.find(g => g.id === t.game);
        $('#tournamentModalTitle').textContent = t.title;
        $('#tournamentModalBody').innerHTML = `
            <img src="${coverFor(game)}" alt="" style="width:100%;border-radius:14px;margin-bottom:18px">
            <div class="flex items-center justify-between mb-4">
                ${this.statusBadge(t.status)}
                <span class="xs mute">${esc(game.title)}</span>
            </div>
            <div class="grid g-2 mb-6" style="gap:12px">
                <div class="glass" style="padding:16px;border-radius:12px">
                    <div class="xs mute mb-1">Prize pool</div>
                    <div class="bold" style="font-size:1.4rem;color:${game.accent}">${esc(t.prize)}</div>
                </div>
                <div class="glass" style="padding:16px;border-radius:12px">
                    <div class="xs mute mb-1">Entry fee</div>
                    <div class="bold" style="font-size:1.4rem">${esc(t.entry)}</div>
                </div>
            </div>
            <div class="divider"></div>
            <h4 class="bold mb-2" style="font-size:.9rem">Schedule</h4>
            <p class="sm dim mb-6">${formatDate(t.date)} at ${esc(t.time)}</p>
            <h4 class="bold mb-2" style="font-size:.9rem">Rules & Format</h4>
            <p class="sm dim mb-6">${esc(t.rules)}</p>
            <h4 class="bold mb-2" style="font-size:.9rem">Squad Size</h4>
            <p class="sm dim mb-6">${t.perTeam} player${t.perTeam > 1 ? 's' : ''} per squad · ${t.slots} total slots</p>
            <h4 class="bold mb-2" style="font-size:.9rem">Room Details</h4>
            <p class="sm dim mb-6">Room ID and password are sent on WhatsApp 30 minutes before match start. Contact: <span class="mono neon-text">${esc(t.contact)}</span></p>
            ${t.status !== 'done' && t.filled < t.slots
                ? `<button class="btn btn-primary btn-block" onclick="closeModal('tournamentModal');TournamentsPage.openRegister('${t.id}')">Register Now</button>`
                : ''}`;
        openModal('tournamentModal');
    },

    openRegister(id) {
        if (!requireAuth('register a squad')) return;
        const t = TOURNAMENTS.find(x => x.id === id);
        if (!t) return;
        const game = GAMES.find(g => g.id === t.game);

        $('#registerModalTitle').textContent = `Register — ${t.title}`;
        $('#regTeamName').value = '';
        $('#regContact').value = '';
        $('#regEmail').value = Auth.current().email;
        $('#regTournamentId').value = t.id;
        $('#regTeamName').placeholder = `Your squad name`;
        $('#regSlotHint').textContent = `${t.perTeam} member${t.perTeam > 1 ? 's' : ''} required · ${t.perTeam === 1 ? 'solo entry' : `${t.perTeam} player slots`}`;

        const slots = $('#regMemberSlots');
        slots.innerHTML = Array.from({ length: t.perTeam }, (_, i) => `
            <div class="grid ${t.perTeam > 1 ? 'g-2' : ''}" style="gap:12px">
                <div class="field" style="margin:0">
                    <label class="label">Player ${i + 1} — In-Game Name</label>
                    <input class="input" data-role="member" data-idx="${i}" placeholder="Username" required>
                </div>
                ${t.perTeam > 1 ? `<div class="field" style="margin:0">
                    <label class="label">Player ${i + 1} — Game UID</label>
                    <input class="input" data-role="uid" data-idx="${i}" placeholder="e.g. 1234567890">
                </div>` : ''}
            </div>`).join('');

        $('#regSummary').innerHTML = `
            <div class="flex items-center gap-3">
                <span style="font-size:2rem">${game.icon}</span>
                <div>
                    <div class="bold">${esc(t.title)}</div>
                    <div class="xs mute">${formatDate(t.date)} · ${esc(t.time)}</div>
                </div>
            </div>
            <div class="divider" style="margin:14px 0"></div>
            <div class="flex justify-between sm"><span class="mute">Entry</span><span class="bold">${esc(t.entry)}</span></div>
            <div class="flex justify-between sm mt-2"><span class="mute">Prize pool</span><span class="bold" style="color:${game.accent}">${esc(t.prize)}</span></div>`;
        $('#regPaymentHint').innerHTML = Payment.panel(t.entry);

        openModal('registerModal');
    },

    bind() {
        const form = $('#registerForm');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                const members = $$('#regMemberSlots [data-role="member"]').map(i => i.value.trim()).filter(Boolean);
                const ids = $$('#regMemberSlots [data-role="uid"]').map(i => i.value.trim()).filter(Boolean);
                const result = Teams.register({
                    tournamentId: $('#regTournamentId').value,
                    name: $('#regTeamName').value.trim(),
                    contact: $('#regContact').value.trim(),
                    email: $('#regEmail').value.trim(),
                    members,
                    ids
                });
                if (!result.ok) { Toast.show(result.error, 'error'); return; }
                closeModal('registerModal');
                Toast.show('Squad registered! Pending admin approval.', 'success');
                this.render();
            });
        }

        const chips = $('#tournamentFilters');
        if (chips) {
            chips.addEventListener('click', e => {
                const chip = e.target.closest('.chip');
                if (!chip) return;
                $$('.chip', chips).forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.activeFilter = chip.dataset.filter;
                this.render();
            });
        }
    }
};

/* ============================================================
   COMMUNITY
   ============================================================ */
const CommunityPage = {
    activeCategory: 'All',
    query: '',

    init() { this.render(); this.bind(); },

    filtered() {
        let list = [...Community.all()];
        if (this.activeCategory !== 'All') list = list.filter(p => p.category === this.activeCategory);
        if (this.query) {
            const q = this.query.toLowerCase();
            list = list.filter(p =>
                p.content.toLowerCase().includes(q) ||
                p.user.toLowerCase().includes(q)
            );
        }
        return list;
    },

    card(post) {
        const game = GAMES.find(g => g.id === post.game);
        const isLiked = Store.read(DB_KEYS.liked, []).includes(post.id);
        const user = Auth.current();
        const isOwner = user && user.username === post.user;
        return `
        <article class="card reveal" data-post="${esc(post.id)}">
            <div class="card-body">
                <div class="flex items-center gap-3 mb-4">
                    <img src="${post.avatar || avatarFor(post.user)}" alt="" style="width:42px;height:42px;border-radius:50%;border:2px solid ${game?.accent || '#7c4dff'}">
                    <div style="flex:1;min-width:0">
                        <div class="bold sm truncate">${esc(post.user)}</div>
                        <div class="xs mute">${timeAgo(post.time)} · ${game ? esc(game.short) : 'Gaming'}</div>
                    </div>
                    <span class="badge ${post.category === 'Question' ? 'badge-new' : post.category === 'Announcement' ? 'badge-live' : 'badge-done'}">${esc(post.category)}</span>
                </div>

                <p class="sm mb-4" style="white-space:pre-wrap">${esc(post.content)}</p>

                <div class="flex items-center gap-2 wrap mb-4">
                    <button class="btn btn-ghost btn-sm" onclick="CommunityPage.like('${esc(post.id)}', this)" style="${isLiked ? 'border-color:#ff2e93;color:#ff2e93' : ''}">
                        ${isLiked ? '❤️' : '🤍'} <span>${post.likes}</span>
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="CommunityPage.toggleComments('${esc(post.id)}')">💬 ${post.comments.length}</button>
                    ${isOwner ? `<button class="btn btn-ghost btn-sm" onclick="CommunityPage.remove('${esc(post.id)}')" style="margin-left:auto;color:var(--red)">Delete</button>` : ''}
                </div>

                <div class="comments hidden" id="c-${esc(post.id)}">
                    <div class="divider" style="margin:12px 0"></div                    <div class="space-y-3 mb-4">
                        ${post.comments.length
                            ? post.comments.map(c => `
                                <div class="flex gap-3">
                                    <img src="${avatarFor(c.user)}" alt="" style="width:28px;height:28px;border-radius:50%">
                                    <div style="flex:1;background:rgba(37,42,74,.4);border-radius:10px;padding:10px 13px">
                                        <div class="bold xs">${esc(c.user)} ${c.time ? `<span class="mute" style="font-weight:400">· ${timeAgo(c.time)}</span>` : ''}</div>
                                        <div class="sm dim">${esc(c.text)}</div>
                                    </div>
                                </div>`).join('')
                            : `<p class="xs mute text-center" style="padding:10px">No comments yet — start the conversation</p>`}
                    </div>
                    <form onsubmit="CommunityPage.submitComment(event, '${esc(post.id)}')" class="flex gap-2">
                        <input class="input" name="text" placeholder="Add a comment..." style="flex:1">
                        <button class="btn btn-primary btn-sm" type="submit">Post</button>
                    </form>
                </div>
            </div>
        </article>`;
    },

    render() {
        const feed = $('#communityFeed');
        if (!feed) return;
        const list = this.filtered();
        feed.innerHTML = list.length
            ? list.map(p => this.card(p)).join('')
            : `<div class="empty"><div class="empty-icon">💬</div><h4>Nothing here yet</h4><p>Try a different filter or start the conversation</p></div>`;
        $$('.reveal', feed).forEach((el, i) => {
            el.style.transitionDelay = `${i * 50}ms`;
            el.classList.add('visible');
        });
        const c = $('#feedCount');
        if (c) c.textContent = `${list.length} post${list.length === 1 ? '' : 's'}`;
    },

    like(id, btn) {
        const count = Community.like(id);
        btn.innerHTML = `${btn.innerHTML.trim().startsWith('❤️') ? '🤍' : '❤️'} <span>${count}</span>`;
        btn.style.borderColor = btn.innerHTML.includes('❤️') ? '#ff2e93' : '';
        btn.style.color = btn.innerHTML.includes('❤️') ? '#ff2e93' : '';
    },

    toggleComments(id) { $(`#c-${id}`).classList.toggle('hidden'); },

    submitComment(e, postId) {
        e.preventDefault();
        const text = e.target.text.value.trim();
        if (!text) return;
        const res = Community.comment(postId, text);
        if (!res.ok) { Toast.show(res.error, 'error'); return; }
        e.target.reset();
        Toast.show('Comment posted', 'success');
        this.render();
        const el = $(`#c-${postId}`);
        if (el) el.classList.remove('hidden');
    },

    remove(id) {
        if (!confirm('Delete this post?')) return;
        Community.remove(id);
        Toast.show('Post deleted', 'info');
        this.render();
    },

    bind() {
        const form = $('#composerForm');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                if (!requireAuth('create a post')) return;
                const content = form.content.value.trim();
                if (!content) { Toast.show('Write something first', 'error'); return; }
                const res = Community.create({ content, game: form.game.value, category: form.category.value });
                if (!res.ok) { Toast.show(res.error, 'error'); return; }
                form.reset();
                Toast.show('Posted to the feed', 'success');
                this.render();
            });
        }

        const chips = $('#communityFilters');
        if (chips) {
            chips.addEventListener('click', e => {
                const chip = e.target.closest('.chip');
                if (!chip) return;
                $$('.chip', chips).forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.activeCategory = chip.dataset.cat;
                this.render();
            });
        }

        const search = $('#communitySearch');
        if (search) {
            search.addEventListener('input', e => {
                this.query = e.target.value.trim();
                this.render();
            });
        }
    }
};

/* ============================================================
   LEADERBOARD
   ============================================================ */
const LeaderboardPage = {
    tab: 'overall',

    init() { this.render(); this.bind(); },

    render() {
        const data = LEADERBOARD[this.tab];
        const podium = $('#podium');
        const table = $('#leaderboardTable');

        if (podium && data.length >= 3) {
            const [a, b, c] = data;
            podium.innerHTML = `
                <div class="grid g-3" style="align-items:end;gap:16px">
                    ${[a, b, c].map((p, i) => {
                        const order = i === 0 ? 2 : i === 1 ? 0 : 1;
                        const heights = [160, 118, 138];
                        const medals = ['🥇', '🥈', '🥉'];
                        const game = GAMES.find(g => g.title === p.game) || GAMES[0];
                        return `
                        <div class="card text-center" style="order:${order};border-color:${game.accent}44">
                            <div class="card-body" style="padding:18px 14px">
                                <div style="font-size:1.9rem">${medals[order === 0 ? 1 : order === 1 ? 0 : 2]}</div>
                                <img src="${avatarFor(p.name)}" alt="" style="width:58px;height:58px;border-radius:50%;margin:6px auto;border:2px solid ${game.accent}">
                                <div class="bold sm truncate">${esc(p.name)}</div>
                                <div class="xs mute">${esc(p.game)}</div>
                                <div class="bold mt-2" style="color:${game.accent}">${formatNumber(p.points)} pts</div>
                            </div>
                            <div style="height:${heights[order]}px;background:linear-gradient(180deg,${game.accent}33,transparent);display:grid;place-items:center;border-top:1px solid ${game.accent}44">
                                <span class="rank rank-${order + 1}" style="font-size:1.6rem">#${p.rank}</span>
                            </div>
                        </div>`;
                    }).join('')}
                </div>`;
        }

        if (table) {
            table.innerHTML = `
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th><th>Player</th><th>Game</th>
                                ${this.tab === 'overall' ? '<th>Win Rate</th><th>Wins</th>' : ''}
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(p => {
                                const game = GAMES.find(g => g.title === p.game) || GAMES[0];
                                return `<tr>
                                    <td><span class="rank rank-${p.rank <= 3 ? p.rank : ''}">${p.rank <= 3 ? ['🥇','🥈','🥉'][p.rank - 1] : '#' + p.rank}</span></td>
                                    <td><div class="flex items-center gap-3">
                                        <img src="${avatarFor(p.name)}" alt="" style="width:32px;height:32px;border-radius:50%">
                                        <div><div class="bold sm">${esc(p.name)}</div><div class="xs mute">${esc(p.tag || '')}</div></div>
                                    </div></td>
                                    <td><span class="chip" style="font-size:.7rem;padding:3px 10px">${esc(p.game)}</span></td>
                                    ${this.tab === 'overall' ? `
                                        <td><div class="flex items-center gap-2"><div style="width:60px;height:6px;background:rgba(148,163,184,.16);border-radius:4px;overflow:hidden"><div style="height:100%;width:${p.winRate}%;background:${game.accent}"></div></div><span class="xs mute">${p.winRate}%</span></div></td>
                                        <td>${p.wins}</td>` : `
                                        <td>${p.wins}</td>`}
                                    <td class="bold" style="color:${game.accent}">${formatNumber(p.points)}</td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>`;
        }
    },

    bind() {
        const tabs = $('#leaderTabs');
        if (tabs) {
            tabs.addEventListener('click', e => {
                const tab = e.target.closest('.chip');
                if (!tab) return;
                $$('.chip', tabs).forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                this.tab = tab.dataset.tab;
                this.render();
            });
        }
    }
};

/* ============================================================
   PROFILE
   ============================================================ */
const ProfilePage = {
    init() { this.render(); this.bind(); },

    render() {
        const user = Auth.current();
        const panel = $('#profileContent');
        if (!panel) return;

        if (!user) {
            panel.innerHTML = `
                <div class="card text-center" style="padding:64px 24px">
                    <div class="empty-icon">👤</div>
                    <h3 class="mb-2">Sign in to view your profile</h3>
                    <p class="dim mb-6">Track your rank, squads, favourite games and tournament history.</p>
                    <button class="btn btn-primary btn-lg" onclick="openModal('authModal')">Sign In / Create Account</button>
                </div>`;
            return;
        }

        const game = GAMES.find(g => g.id === user.gameId) || GAMES[0];
        const myTeams = Teams.all().filter(t => t.captain === user.username || t.members.includes(user.username));
        const favs = Favorites.all().map(id => GAMES.find(g => g.id === id)).filter(Boolean);
        const posts = Community.all().filter(p => p.user === user.username);

        panel.innerHTML = `
            <div class="card mb-6" style="overflow:visible">
                <div style="height:120px;background:linear-gradient(120deg,${game.accent},${game.accent}22,#05060f);border-radius:16px 16px 0 0"></div>
                <div class="card-body" style="margin-top:-44px">
                    <div class="flex items-end gap-4 mb-4 wrap">
                        <img src="${user.avatar || avatarFor(user.username, 96)}" alt=""
                             style="width:88px;height:88px;border-radius:50%;border:4px solid ${game.accent};box-shadow:0 8px 30px rgba(0,0,0,.6)">
                        <div style="flex:1">
                            <h2 class="display" style="font-size:1.6rem">${esc(user.username)}
                                ${user.verified ? '<span class="neon-text" title="Verified">✔</span>' : ''}
                            </h2>
                            <div class="sm mute">${esc(user.email)}</div>
                            <div class="flex gap-2 mt-2 wrap">
                                <span class="chip" style="font-size:.72rem;padding:3px 11px">${game.icon} ${esc(game.short)}</span>
                                <span class="chip" style="font-size:.72rem;padding:3px 11px">${esc(user.rank)}</span>
                                <span class="chip" style="font-size:.72rem;padding:3px 11px">Joined ${user.joined}</span>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button class="btn btn-ghost btn-sm" onclick="ProfilePage.edit()">✎ Edit</button>
                            <button class="btn btn-hot btn-sm" onclick="Auth.logout();ProfilePage.render()">Sign out</button>
                        </div>
                    </div>

                    <div class="grid g-4" style="gap:14px">
                        <div class="stat glass" style="border-radius:12px"><div class="stat-value">${user.wins}</div><div class="stat-label">Wins</div></div>
                        <div class="stat glass" style="border-radius:12px"><div class="stat-value">${myTeams.length}</div><div class="stat-label">Squads</div></div>
                        <div class="stat glass" style="border-radius:12px"><div class="stat-value">${favs.length}</div><div class="stat-label">Library</div></div>
                        <div class="stat glass" style="border-radius:12px"><div class="stat-value">${posts.length}</div><div class="stat-label">Posts</div></div>
                    </div>
                </div>
            </div>

            <div class="section-head" style="margin-bottom:18px">
                <h3 class="section-title" style="font-size:1.1rem">My Squads</h3>
            </div>
            <div class="grid g-2 mb-6" id="myTeamsList">
                ${myTeams.length ? myTeams.map(t => `
                    <div class="card">
                        <div class="card-body">
                            <div class="flex items-center justify-between mb-3">
                                <div class="bold">${esc(t.name)}</div>
                                <span class="badge ${t.status === 'approved' ? 'badge-open' : 'badge-soon'}">${t.status}</span>
                            </div>
                            <div class="xs mute mb-3">${esc(GAMES.find(g => g.id === t.game)?.short || '')} · ${t.date}</div>
                            <div class="flex gap-2 wrap">
                                ${t.members.map(m => `<span class="chip" style="font-size:.7rem;padding:2px 9px">${esc(m)}</span>`).join('')}
                            </div>
                        </div>
                    </div>`).join('') : `<div class="empty" style="grid-column:1/-1;padding:40px 20px"><div class="empty-icon">👥</div><h4>No squads yet</h4><p>Register for a tournament to create your first squad</p><button class="btn btn-primary btn-sm mt-4" onclick="location.href='tournaments.html'">Browse Tournaments</button></div>`}
            </div>

            <div class="section-head" style="margin-bottom:18px">
                <h3 class="section-title" style="font-size:1.1rem">My Library</h3>
            </div>
            <div class="grid g-4 mb-6" id="libraryGrid" style="gap:14px">
                ${favs.length ? favs.map(g => `
                    <div class="card card-hover" onclick="GamesPage.details('${g.id}')" style="cursor:pointer">
                        <img src="${coverFor(g)}" alt="" style="aspect-ratio:1;object-fit:cover">
                        <div style="padding:10px 12px">
                            <div class="bold xs truncate">${esc(g.short)}</div>
                            <div class="xs mute">${esc(g.genre[0])}</div>
                        </div>
                    </div>`).join('') : `<div class="empty" style="grid-column:1/-1;padding:40px 20px"><div class="empty-icon">🎮</div><h4>Library is empty</h4><p>Tap the heart on any game to save it here</p><button class="btn btn-primary btn-sm mt-4" onclick="location.href='games.html'">Browse Games</button></div>`}
            </div>

            <div class="section-head" style="margin-bottom:18px">
                <h3 class="section-title" style="font-size:1.1rem">My Posts</h3>
            </div>
            <div class="grid" style="gap:14px">
                ${posts.length ? posts.map(p => `
                    <div class="card"><div class="card-body">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="badge badge-done">${esc(p.category)}</span>
                            <span class="xs mute">${timeAgo(p.time)}</span>
                        </div>
                        <p class="sm dim">${esc(p.content)}</p>
                        <div class="xs mute mt-2">❤️ ${p.likes} · 💬 ${p.comments.length}</div>
                    </div></div>`).join('') : `<div class="empty" style="padding:40px 20px"><div class="empty-icon">✍️</div><h4>No posts yet</h4><p>Share your first gaming moment</p><button class="btn btn-primary btn-sm mt-4" onclick="location.href='community.html'">Open Community</button></div>`}
            </div>`;
    },

    edit() {
        const user = Auth.current();
        if (!user) return;
        $('#editUsername').value = user.username;
        $('#editEmail').value = user.email;
        $('#editGame').value = user.gameId;
        $('#editRank').value = user.rank;
        openModal('editModal');
    },

    bind() {
        const form = $('#editForm');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                const username = $('#editUsername').value.trim();
                const email = $('#editEmail').value.trim();
                const users = Auth.users();
                const idx = users.findIndex(u => u.id === Auth.current().id);

                if (users.some((u, i) => i !== idx && u.email.toLowerCase() === email.toLowerCase())) {
                    Toast.show('Email already in use', 'error');
                    return;
                }
                if (users.some((u, i) => i !== idx && u.username.toLowerCase() === username.toLowerCase())) {
                    Toast.show('Username already taken', 'error');
                    return;
                }

                Auth.update({
                    username,
                    email,
                    gameId: $('#editGame').value,
                    rank: $('#editRank').value
                });
                closeModal('editModal');
                Toast.show('Profile updated', 'success');
                renderAuthUI();
                this.render();
            });
        }
    }
};

/* ============================================================
   NEWS
   ============================================================ */
const NewsPage = {
    init() { this.render(); },
    render() {
        const feed = $('#newsFeed');
        if (!feed) return;
        const news = News.all();
        feed.innerHTML = news.map((n, i) => {
            const game = GAMES.find(g => g.id === n.game) || GAMES[0];
            return `
            <article class="card card-hover reveal" style="${i === 0 ? 'grid-column:1/-1' : ''}">
                <div class="${i === 0 ? 'grid' : ''}" style="${i === 0 ? 'grid-template-columns:1fr 1fr;gap:0' : ''}">
                    <div style="${i === 0 ? 'min-height:260px' : 'aspect-ratio:16/9'}">
                        <img src="${coverFor(game)}" alt="" style="width:100%;height:100%;object-fit:cover">
                    </div>
                    <div class="card-body" style="${i === 0 ? 'display:flex;flex-direction:column;justify-content:center;padding:32px' : ''}">
                        <div class="flex items-center gap-2 mb-3">
                            <span class="badge badge-new">${esc(n.tag)}</span>
                            <span class="xs mute">${timeAgo(n.date)}</span>
                        </div>
                        <h3 style="font-size:${i === 0 ? '1.55rem' : '1.1rem'};margin-bottom:10px">${esc(n.title)}</h3>
                        <p class="sm dim clamp-3 mb-4">${esc(n.excerpt)}</p>
                        <div class="flex items-center gap-2">
                            <span class="chip" style="font-size:.7rem;padding:3px 10px">${game.icon} ${esc(game.short)}</span>
                            <button class="btn btn-ghost btn-sm" onclick="GamesPage.details('${game.id}')">View game →</button>
                        </div>
                    </div>
                </div>
            </article>`;
        }).join('');
        $$('.reveal', feed).forEach((el, i) => {
            el.style.transitionDelay = `${i * 60}ms`;
            el.classList.add('visible');
        });
    }
};

/* ============================================================
   STATS COUNTER ANIMATION (home page)
   ============================================================ */
function animateCounters() {
    $$('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 42);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = formatNumber(current) + suffix;
        }, 26);
    });
}