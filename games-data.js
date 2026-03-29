// games-data.js

window.HERO_GAMES =[
  { title: 'PUBG', cat: 'Shooter', desc: 'Battle Royale', trailer: 'GXXEsnG14kw', poster: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/578080/library_600x900_2x.jpg' },
  { title: 'Dota 2', cat: 'Strategy', desc: 'MOBA - Стратеги', trailer: '-cSFPIwMEq4', poster: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/library_600x900_2x.jpg' },
  { title: 'Counter-Strike 2', cat: 'Shooter', desc: 'Тактикийн буудлага', trailer: 'c80dVYcL69E', poster: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/library_600x900_2x.jpg' },
  { title: 'Apex Legends', cat: 'Shooter', desc: 'Хурдтай Battle Royale', trailer: 'e_E9W2vsRbQ', poster: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/library_600x900_2x.jpg' },
  { title: 'Rust', cat: 'Survival', desc: 'Амьд үлдэх тулаан', trailer: 'W1ZJ1Hj2kQY', poster: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252490/library_600x900_2x.jpg' }
];

window.GAMES_LIST =[
  // 🧩 ОЮУН УХААН & ТААВАР
  { title:'Wordle', cat:'puzzle', poster:'https://placehold.co/400x600/1a1a2e/ffffff?text=Wordle', desc:'Үг таах тоглоом', embed:'https://wordleunlimited.org/' },
  { title:'2048', cat:'puzzle', poster:'https://placehold.co/400x600/2d1f00/ffffff?text=2048', desc:'Тоон нийлүүлэлт', embed:'https://play2048.co/' },
  { title:'Sudoku', cat:'puzzle', poster:'https://placehold.co/400x600/0d1b2a/ffffff?text=Sudoku', desc:'Судоку тоглоом', embed:'https://sudoku.com/' },
  { title:'Crossword', cat:'puzzle', poster:'https://placehold.co/400x600/1a1a1a/ffffff?text=Crossword', desc:'Үгийн сүлжээ', embed:'https://crosswordlabs.com/' },

  // ♟️ СТРАТЕГИ & ХӨЛӨГТ ТОГЛООМ
  { title:'Chess', cat:'strategy', poster:'https://placehold.co/400x600/2d1515/ffffff?text=Chess', desc:'Шатар тоглоом', embed:'https://www.chess.com/play/computer' },
  { title:'Minesweeper', cat:'strategy', poster:'https://placehold.co/400x600/1a3a1a/ffffff?text=Minesweeper', desc:'Минэ эрэх тоглоом', embed:'https://minesweeper.online/' },
  { title:'Solitaire', cat:'strategy', poster:'https://placehold.co/400x600/1a1a3a/ffffff?text=Solitaire', desc:'Картын тоглоом', embed:'https://www.solitaire.org/' },

  // 🕹️ СОНГОДОГ АРКАД (Жинхэнэ постеруудтай)
  { title:'Geometry Dash', cat:'arcade', poster:'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/322170/library_600x900_2x.jpg', desc:'Хэмнэлт үсрэлт', embed:'https://geometrydash.io/' },
  { title:'Terraria', cat:'arcade', poster:'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/library_600x900_2x.jpg', desc:'2D Адал явдал', embed:'https://g.vseigru.net/14/igra-terrariya/' },
  { title:'Snake', cat:'arcade', poster:'https://placehold.co/400x600/003300/ffffff?text=Snake', desc:'Могойн тоглоом', embed:'https://playsnake.org/' },
  { title:'Pac-Man', cat:'arcade', poster:'https://placehold.co/400x600/332b00/ffffff?text=Pac-Man', desc:'Пак-ман классик', embed:'https://freepacman.org/' },

  // 👥 ОЛОН ТОГЛОГЧТОЙ IO
  { title:'Among Us', cat:'multi', poster:'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/945360/library_600x900_2x.jpg', desc:'Хуурамч тоглогчийг ол', embed:'https://amongusplay.online/' },
  { title:'Brawlhalla', cat:'multi', poster:'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/341150/library_600x900_2x.jpg', desc:'2D Тулаан', embed:'https://www.brawlhalla.com/play/' },
  { title:'Agar.io', cat:'multi', poster:'https://placehold.co/400x600/003310/ffffff?text=Agar.io', desc:'Хүн идэх тоглоом', embed:'https://agar.io/' },
  { title:'Slither.io', cat:'multi', poster:'https://placehold.co/400x600/1a1a00/ffffff?text=Slither.io', desc:'Олон тоглогчийн могой', embed:'https://slither.io/' },

  // ⚔️ ТУЛААН & АДАЛ ЯВДАЛ
  { title:'Krunker.io', cat:'action', poster:'https://placehold.co/400x600/4a1414/ffffff?text=Krunker', desc:'3D Буудлага', embed:'https://krunker.io/' },
  { title:'1v1.LOL', cat:'action', poster:'https://placehold.co/400x600/2a144a/ffffff?text=1v1.LOL', desc:'Барилга барьж буудалцах', embed:'https://1v1.lol/' },
  { title:'Venge.io', cat:'action', poster:'https://placehold.co/400x600/333314/ffffff?text=Venge.io', desc:'Онлайн FPS буудлага', embed:'https://venge.io/' },

  // 🏎️ СПОРТ & УРАЛДААН
  { title:'Moto X3M', cat:'sports', poster:'https://placehold.co/400x600/4a2a14/ffffff?text=Moto+X3M', desc:'Мотоциклын саадтай уралдаан', embed:'https://motox3m.co/' },
  { title:'Basketball Stars', cat:'sports', poster:'https://placehold.co/400x600/4a1414/ffffff?text=Basketball', desc:'Сагсан бөмбөгийн одод', embed:'https://basketballstars.io/' },
  { title:'8 Ball Pool', cat:'sports', poster:'https://placehold.co/400x600/142a4a/ffffff?text=8+Ball+Pool', desc:'Биллиард', embed:'https://8ballpool.com/' },

  // ☕ ЧӨЛӨӨТ ЦАГ & БУСАД
  { title:'Stardew Valley', cat:'casual', poster:'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/library_600x900_2x.jpg', desc:'Фермийн амьдрал', embed:'https://playclassic.games/games/role-playing-dos-games-online/play-stardew-valley-online/' },
  { title:'Subway Surfers', cat:'casual', poster:'https://placehold.co/400x600/144a4a/ffffff?text=Subway+Surfers', desc:'Галт тэрэгний зам дээрх гүйлт', embed:'https://subwaysurfers.com/' },
  { title:'Temple Run 2', cat:'casual', poster:'https://placehold.co/400x600/4a4a14/ffffff?text=Temple+Run', desc:'Сүмээс зугтах нь', embed:'https://poki.com/en/g/temple-run-2' }
];

window.GAME_SECTIONS =[
  { id: 'grow_puzzle',   title: '🧩 Оюун ухаан & Таавар',       key: 'puzzle' },
  { id: 'grow_strategy', title: '♟️ Стратеги & Хөлөгт',         key: 'strategy' },
  { id: 'grow_arcade',   title: '🕹️ Сонгодог Аркад',           key: 'arcade' },
  { id: 'grow_multi',    title: '👥 Олон тоглогчтой (IO)',      key: 'multi' },
  { id: 'grow_action',   title: '⚔️ Тулаан & Буудлага',         key: 'action' },
  { id: 'grow_sports',   title: '🏎️ Спорт & Уралдаан',          key: 'sports' },
  { id: 'grow_casual',   title: '☕ Чөлөөт цаг & Бусад',        key: 'casual' }
];