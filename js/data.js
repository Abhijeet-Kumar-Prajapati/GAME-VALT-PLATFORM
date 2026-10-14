/* ============================================================
   GAMEVAULT — Data Layer
   Static seed data + localStorage persistence helpers
   ============================================================ */

const DB_KEYS = {
    users: 'gv_users',
    session: 'gv_session',
    teams: 'gv_teams',
    posts: 'gv_posts',
    favorites: 'gv_favorites',
    news: 'gv_news',
    liked: 'gv_liked_posts'
};

/* ---------- Store helpers ---------- */
const Store = {
    read(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    },
    write(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage failed:', e);
            Toast.show('Storage full — export your data to free space', 'error');
            return false;
        }
    },
    remove(key) { localStorage.removeItem(key); }
};

/* ---------- Seed once ---------- */
function seedDatabase() {
    if (!Store.read(DB_KEYS.posts, null)) Store.write(DB_KEYS.posts, SEED_POSTS);
    if (!Store.read(DB_KEYS.teams, null)) Store.write(DB_KEYS.teams, SEED_TEAMS);
    if (!Store.read(DB_KEYS.users, null)) Store.write(DB_KEYS.users, SEED_USERS);
    if (!Store.read(DB_KEYS.news, null)) Store.write(DB_KEYS.news, SEED_NEWS);
}

const News = {
    all() { return Store.read(DB_KEYS.news, SEED_NEWS); }
};

/* ============================================================
   GAMES
   ============================================================ */
const GAMES = [
    {
        id: 'free-fire',
        title: 'Free Fire: MAX',
        short: 'FF MAX',
        genre: ['Battle Royale', 'Shooter'],
        year: 2026,
        rating: 4.5,
        downloads: '500M+',
        size: '1.2 GB',
        players: '80M+',
        badge: 'Trending',
        mode: 'Battle Royale',
        icon: '🔥',
        accent: '#ff6b2c',
        desc: 'The fastest mobile battle royale. 50 players, one survivor. Land, loot, and outplay the squad in under 12 minutes.',
        modes: ['Squad 4v4', 'Solo', 'Clash Squad', 'CS-Ranked'],
        trending: true
    },
    {
        id: 'bgmi',
        title: 'Battlegrounds Mobile India',
        short: 'BGMI',
        genre: ['Battle Royale', 'Shooter'],
        year: 2026,
        rating: 4.4,
        downloads: '300M+',
        size: '1.1 GB',
        players: '60M+',
        badge: 'Esports',
        mode: 'Battle Royale',
        icon: '🎯',
        accent: '#ffb300',
        desc: 'India\'s premier battle royale experience with classic maps, Indian servers and a thriving competitive scene.',
        modes: ['TDM', 'Classic BR', 'Erangel 2.0', 'Payload'],
        trending: true
    },
    {
        id: 'codm',
        title: 'Call of Duty: Mobile',
        short: 'COD Mobile',
        genre: ['Shooter', 'Multiplayer'],
        year: 2026,
        rating: 4.3,
        downloads: '200M+',
        size: '2.5 GB',
        players: '45M+',
        badge: 'Popular',
        mode: 'Multiplayer',
        icon: '🎖️',
        accent: '#00e5ff',
        desc: 'Console-grade shooters in your pocket. Multiplayer, Battle Royale and Zombies modes with weapon customization.',
        modes: ['Multiplayer', 'Battle Royale', 'Zombies', 'Ranked'],
        trending: true
    },
    {
        id: 'mlbb',
        title: 'Mobile Legends: Bang Bang',
        short: 'MLBB',
        genre: ['MOBA', 'Strategy'],
        year: 2026,
        rating: 4.6,
        downloads: '400M+',
        size: '890 MB',
        players: '100M+',
        badge: 'Esports',
        mode: 'MOBA',
        icon: '⚔️',
        accent: '#7c4dff',
        desc: 'The world\'s most played mobile MOBA. 5v5 lanes, ultimate teamfights and the biggest esports audience on mobile.',
        modes: ['Classic 5v5', 'Ranked', 'Brawl', 'Custom'],
        trending: true
    },
    {
        id: 'clash-royale',
        title: 'Clash Royale',
        short: 'Clash',
        genre: ['Strategy', 'Card'],
        year: 2026,
        rating: 4.5,
        downloads: '150M+',
        size: '420 MB',
        players: '35M+',
        badge: 'Classic',
        mode: 'Card Battle',
        icon: '👑',
        accent: '#00e676',
        desc: 'Real-time 1v1 tower strategy. Master the deck, time the push, and destroy the opponent\'s crown in under 4 minutes.',
        modes: ['Ladder', 'Challenge', 'Tournament', 'Party'],
        trending: false
    },
    {
        id: 'pubg-mobile',
        title: 'PUBG Mobile',
        short: 'PUBG M',
        genre: ['Battle Royale', 'Shooter'],
        year: 2026,
        rating: 4.2,
        downloads: '250M+',
        size: '1.4 GB',
        players: '55M+',
        badge: 'Classic',
        mode: 'Battle Royale',
        icon: '🪂',
        accent: '#ff2e93',
        desc: 'Survive, loot, and dominate with 100 players in the globally dominant mobile battle royale.',
        modes: ['Classic', 'Ranked', 'Erangel', 'Livik'],
        trending: false
    },
    {
        id: 'minecraft',
        title: 'Minecraft',
        short: 'MC',
        genre: ['Sandbox', 'Creative'],
        year: 2026,
        rating: 4.4,
        downloads: '180M+',
        size: '1.6 GB',
        players: '40M+',
        badge: 'Sandbox',
        mode: 'Creative',
        icon: '🧱',
        accent: '#00e676',
        desc: 'Build anything you can imagine. Survival mode, creative mode, and a community of millions of builders.',
        modes: ['Survival', 'Creative', 'Multiplayer', 'Bedrock'],
        trending: false
    },
    {
        id: 'clash-of-clans',
        title: 'Clash of Clans',
        short: 'CoC',
        genre: ['Strategy', 'Base Building'],
        year: 2026,
        rating: 4.5,
        downloads: '220M+',
        size: '310 MB',
        players: '50M+',
        badge: 'Strategy',
        mode: 'Base Building',
        icon: '🏰',
        accent: '#ffd700',
        desc: 'Build an unstoppable village, raise your clan, and raid rivals in the most addictive base builder.',
        modes: ['Builder Base', 'Home Village', 'War', 'Clan Wars'],
        trending: false
    },
    {
        id: 'valorant-mobile',
        title: 'Valorant Mobile',
        short: 'Valorant',
        genre: ['FPS', 'Tactical'],
        year: 2026,
        rating: 4.6,
        downloads: '90M+',
        size: '1.8 GB',
        players: '20M+',
        badge: 'New',
        mode: 'Tactical FPS',
        icon: '🎯',
        accent: '#ff4655',
        desc: '5v5 tactical shooter with agent abilities and precision gunplay. Console quality, mobile controls.',
        modes: ['Unrated', 'Competitive', 'Swiftplay', 'Deathmatch'],
        trending: true
    },
    {
        id: 'genshin-impact',
        title: 'Genshin Impact',
        short: 'Genshin',
        genre: ['RPG', 'Action'],
        year: 2026,
        rating: 4.4,
        downloads: '80M+',
        size: '1.5 GB',
        players: '18M+',
        badge: 'RPG',
        mode: 'Open World',
        icon: '⚡',
        accent: '#7c4dff',
        desc: 'Explore the vast world of Teyvat, master elemental powers, and build your dream team of characters.',
        modes: ['Adventure', 'Abyss', 'Co-op', 'Events'],
        trending: false
    }
];

const GENRES = ['All', 'Battle Royale', 'MOBA', 'Shooter', 'FPS', 'Strategy', 'Card', 'Sandbox', 'RPG', 'Action'];

/* ============================================================
   TOURNAMENTS
   ============================================================ */
const TOURNAMENTS = [
    {
        id: 't-1001',
        game: 'free-fire',
        title: 'Free Fire MAX — Bermuda Clash',
        mode: 'Squad 4v4',
        status: 'open',
        prize: '₹15,000',
        entry: '₹100 / squad',
        date: '2026-10-25',
        time: '6:00 PM',
        slots: 12,
        filled: 7,
        perTeam: 4,
        rules: 'Classic Bermuda. Squad wipes and kills decide points. Best of 3 rounds.',
        contact: ''
    },
    {
        id: 't-1002',
        game: 'bgmi',
        title: 'BGMI — Erangel Masters',
        mode: 'Squad TPP',
        status: 'open',
        prize: '₹12,000',
        entry: '₹80 / squad',
        date: '2026-10-27',
        time: '7:30 PM',
        slots: 16,
        filled: 11,
        perTeam: 4,
        rules: 'Erangel 2.0 with revive rules. Placement + kills scoring.',
        contact: ''
    },
    {
        id: 't-1003',
        game: 'codm',
        title: 'COD Mobile — Sniper King',
        mode: 'Hardpoint',
        status: 'soon',
        prize: '₹8,000',
        entry: 'Free',
        date: '2026-11-02',
        time: '5:00 PM',
        slots: 32,
        filled: 18,
        perTeam: 1,
        rules: 'Solo sniper lobby. Fastest total time wins.',
        contact: ''
    },
    {
        id: 't-1004',
        game: 'mlbb',
        title: 'MLBB — Ranked Showdown',
        mode: 'Classic 5v5',
        status: 'soon',
        prize: '₹25,000',
        entry: '₹200 / team',
        date: '2026-11-09',
        time: '4:00 PM',
        slots: 20,
        filled: 9,
        perTeam: 5,
        rules: 'Best of 3. Ban 3 heroes. Draft mode enabled.',
        contact: ''
    },
    {
        id: 't-1005',
        game: 'free-fire',
        title: 'Free Fire — Solo Showdown',
        mode: 'Solo BR',
        status: 'live',
        prize: '₹5,000',
        entry: '₹40',
        date: '2026-10-13',
        time: 'Live now',
        slots: 48,
        filled: 48,
        perTeam: 1,
        rules: 'Solo battle royale. 48 players, one winner.',
        contact: ''
    },
    {
        id: 't-1006',
        game: 'valorant-mobile',
        title: 'Valorant Mobile — Open Beta Cup',
        mode: 'Unrated 5v5',
        status: 'done',
        prize: '₹10,000',
        entry: '₹150 / team',
        date: '2026-10-05',
        time: 'Completed',
        slots: 8,
        filled: 8,
        perTeam: 5,
        rules: 'Won by Nexus Vanguard.',
        contact: ''
    }
];

/* ============================================================
   SEED USERS / TEAMS
   ============================================================ */
const SEED_USERS = [
    { id: 'u1', username: 'Abhijeet', email: '', pass: '', gameId: 'free-fire', avatar: '', joined: '2026-02-14', rank: 'Grand Master', wins: 47, verified: true, owner: true },
    { id: 'u2', username: 'GhostRider', email: 'ghost@player.gg', pass: 'demo1234', gameId: 'free-fire', avatar: '', joined: '2026-03-02', rank: 'Grand Master', wins: 44, verified: true },
    { id: 'u3', username: 'SniperQueen', email: 'queen@player.gg', pass: 'demo1234', gameId: 'bgmi', avatar: '', joined: '2026-01-22', rank: 'Ace Dominator', wins: 38, verified: true },
    { id: 'u4', username: 'HeadshotHarry', email: 'harry@player.gg', pass: 'demo1234', gameId: 'codm', avatar: '', joined: '2026-03-08', rank: 'Master', wins: 29, verified: false },
    { id: 'u5', username: 'TacticalNikhil', email: 'nikhil@player.gg', pass: 'demo1234', gameId: 'valorant-mobile', avatar: '', joined: '2026-04-19', rank: 'Immortal', wins: 22, verified: true },
    { id: 'u6', username: 'MidasTouch', email: 'midas@player.gg', pass: 'demo1234', gameId: 'mlbb', avatar: '', joined: '2026-05-30', rank: 'Epic', wins: 18, verified: false }
];

const SEED_TEAMS = [
    {
        id: 'team-001',
        name: 'Phantom Squad',
        tournamentId: 't-1001',
        game: 'free-fire',
        captain: 'GhostRider',
        contact: '9876543210',
        email: 'phantom@gg.com',
        members: ['GhostRider', 'NightFall', 'RogueX', 'ViperKing'],
        ids: ['1122334455', '2233445566', '3344556677', '4455667788'],
        status: 'approved',
        date: '2026-10-05'
    },
    {
        id: 'team-002',
        name: 'Thunder Bolts',
        tournamentId: 't-1001',
        game: 'free-fire',
        captain: 'BlazeOP',
        contact: '9123456780',
        email: 'thunder@gg.com',
        members: ['BlazeOP', 'StormZ', 'FrostBite', 'IronFist'],
        ids: ['5566778899', '6677889900', '7788990011', '8899001122'],
        status: 'pending',
        date: '2026-10-07'
    },
    {
        id: 'team-003',
        name: 'Shadow Hunters',
        tournamentId: 't-1002',
        game: 'bgmi',
        captain: 'SniperQueen',
        contact: '9001122334',
        email: 'shadow@gg.com',
        members: ['SniperQueen', 'GhostWolf', 'SilentAim', 'RapidFire'],
        ids: ['1002003004', '2003004005', '3004005006', '4005006007'],
        status: 'approved',
        date: '2026-10-08'
    },
    {
        id: 'team-004',
        name: 'Pixel Warriors',
        tournamentId: 't-1004',
        game: 'mlbb',
        captain: 'MidasTouch',
        contact: '9555667788',
        email: 'pixel@gg.com',
        members: ['MidasTouch', 'KiteRunner', 'Nova', 'Zenith'],
        ids: ['NA', 'KR', 'NV', 'ZE'],
        status: 'pending',
        date: '2026-10-09'
    }
];

/* ============================================================
   COMMUNITY POSTS
   ============================================================ */
const SEED_POSTS = [
    {
        id: 'p1',
        user: 'SniperQueen',
        avatar: '',
        game: 'bgmi',
        category: 'Clutch',
        time: '2026-10-12T18:30:00',
        content: '1v4 clutch on Erangel with only a crossbow left. The whole lobby in my kill feed — absolute cinema. 🏆 Recording the full clip tomorrow.',
        likes: 342,
        comments: [
            { user: 'GhostRider', text: 'That final shot was insane bro' },
            { user: 'TacticalNikhil', text: 'How did you even see that guy?' }
        ],
        media: null
    },
    {
        id: 'p2',
        user: 'MidasTouch',
        avatar: '',
        game: 'mlbb',
        category: 'Guide',
        time: '2026-10-12T14:10:00',
        content: 'MLBB Mythic climb tip nobody mentions: stop farming jungle after 4 min. Contest objectives instead. Win rate jumped from 52% to 71% just by rotating early.',
        likes: 528,
        comments: [
            { user: 'SniperQueen', text: 'This is actually game changing, thanks' }
        ],
        media: null
    },
    {
        id: 'p3',
        user: 'GhostRider',
        avatar: '',
        game: 'free-fire',
        category: 'Announcement',
        time: '2026-10-11T20:00:00',
        content: 'Registration for the Free Fire MAX Bermuda Clash is closing soon! 5 slots left. ₹100 per squad, ₹15,000 prize pool. Room ID and password sent 30 mins before match.',
        likes: 189,
        comments: [],
        media: null
    },
    {
        id: 'p4',
        user: 'HeadshotHarry',
        avatar: '',
        game: 'codm',
        category: 'Question',
        time: '2026-10-11T11:25:00',
        content: 'What\'s the best loadout for Nuketown on the new season? Been stuck at Master for weeks and the ranked mode is brutal.',
        likes: 64,
        comments: [
            { user: 'TacticalNikhil', text: 'Try full auto AK + cluster grenade. Trust me.' }
        ],
        media: null
    },
    {
        id: 'p5',
        user: 'TacticalNikhil',
        avatar: '',
        game: 'valorant-mobile',
        category: 'Highlight',
        time: '2026-10-10T16:45:00',
        content: 'Valorant Mobile on mobile is genuinely playable now. Movement feels 1:1 with PC. Took my rank from Gold straight to Immortal over the weekend.',
        likes: 271,
        comments: [
            { user: 'MidasTouch', text: 'Controller or touch? For aim' }
        ],
        media: null
    }
];

const POST_CATEGORIES = ['All', 'Highlight', 'Guide', 'Clutch', 'Announcement', 'Question', 'Rant'];

/* ============================================================
   NEWS
   ============================================================ */
const SEED_NEWS = [
    { id: 'n1', title: 'Free Fire MAX announces Ramadan Cup with ₹5L prize pool', game: 'free-fire', date: '2026-10-12', tag: 'Esports', excerpt: 'Garena confirms a month-long community cup with open qualifiers across India, SEA and Middle East regions.' },
    { id: 'n2', title: 'BGMI patch 3.4 nerfs AKM and brings back classic Erangel', game: 'bgmi', date: '2026-10-11', tag: 'Update', excerpt: 'Weapon balance changes, new vehicle system, and the return of one of the most beloved maps in the pool.' },
    { id: 'n3', title: 'Valorant Mobile passes 100M downloads globally', game: 'valorant-mobile', date: '2026-10-10', tag: 'Milestone', excerpt: 'Riot\'s mobile tactical shooter crosses six figures in just over a year, with esports plans announced for 2027.' },
    { id: 'n4', title: 'Mobile Legends World Series 2026 draws record 2.1M peak viewers', game: 'mlbb', date: '2026-10-09', tag: 'Esports', excerpt: 'The M7 championship finals in Kuala Lumpur becomes the most-watched mobile esports event of all time.' },
    { id: 'n5', title: 'Clash of Clans introduces Clan Capital 2.0', game: 'clash-of-clans', date: '2026-10-08', tag: 'Update', excerpt: 'Rebuilt clan systems, new siege defenses, and a redesigned home village for the community\'s biggest update yet.' }
];

/* ============================================================
   LEADERBOARD
   ============================================================ */
const LEADERBOARD = {
    overall: [
        { rank: 1, name: 'TacticalNikhil', tag: 'N1K', game: 'Valorant Mobile', wins: 63, winRate: 78, points: 12480 },
        { rank: 2, name: 'GhostRider', tag: 'GHOSTR', game: 'Free Fire MAX', wins: 47, winRate: 71, points: 11205 },
        { rank: 3, name: 'SniperQueen', tag: 'SNIP3R', game: 'BGMI', wins: 38, winRate: 69, points: 9870 },
        { rank: 4, name: 'MidasTouch', tag: 'MIDAS', game: 'MLBB', wins: 18, winRate: 82, points: 8410 },
        { rank: 5, name: 'HeadshotHarry', tag: 'H$H', game: 'COD Mobile', wins: 29, winRate: 61, points: 7985 },
        { rank: 6, name: 'NightFall', tag: 'N1GH7', game: 'Free Fire MAX', wins: 33, winRate: 64, points: 7440 },
        { rank: 7, name: 'RapidFire', tag: 'RPD', game: 'BGMI', wins: 26, winRate: 60, points: 6980 },
        { rank: 8, name: 'Nova', tag: 'N0VA', game: 'MLBB', wins: 21, winRate: 74, points: 6520 }
    ],
    monthly: [
        { rank: 1, name: 'MidasTouch', game: 'MLBB', wins: 12, points: 3120 },
        { rank: 2, name: 'GhostRider', game: 'Free Fire MAX', wins: 9, points: 2840 },
        { rank: 3, name: 'Nova', game: 'MLBB', wins: 8, points: 2610 },
        { rank: 4, name: 'SniperQueen', game: 'BGMI', wins: 7, points: 2380 },
        { rank: 5, name: 'TacticalNikhil', game: 'Valorant Mobile', wins: 6, points: 2190 },
        { rank: 6, name: 'NightFall', game: 'Free Fire MAX', wins: 5, points: 1940 },
        { rank: 7, name: 'HeadshotHarry', game: 'COD Mobile', wins: 4, points: 1780 }
    ]
};

/* ============================================================
   ROLES
   ============================================================ */
const RANKS = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grand Master', 'Ace Dominator', 'Conqueror', 'Immortal'];