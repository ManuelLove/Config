		// TicTacToe
		let room = Object.values(tictactoe).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
		if (room) {
			let ok
			let isWin = !1
			let isTie = !1
			let isSurrender = !1
			if (!/^([1-9]|(me)?nyerah|surr?ender|off|skip)$/i.test(m.text)) return
			isSurrender = !/^[1-9]$/.test(m.text)
			if (m.sender !== room.game.currentTurn) {
				if (!isSurrender) return !0
			}
			if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
				m.reply({
					'-3': 'Game telah berakhir',
					'-2': 'Invalid',
					'-1': 'Posisi Invalid',
					0: 'Posisi Invalid',
				}[ok])
				return !0
			}
			if (m.sender === room.game.winner) isWin = true
			else if (room.game.board === 511) isTie = true
			let arr = room.game.render().map(v => {
				return {
					X: '❌',
					O: '⭕',
					1: '1️⃣',
					2: '2️⃣',
					3: '3️⃣',
					4: '4️⃣',
					5: '5️⃣',
					6: '6️⃣',
					7: '7️⃣',
					8: '8️⃣',
					9: '9️⃣',
				}[v]
			})
			if (isSurrender) {
				room.game._currentTurn = m.sender === room.game.playerX
				isWin = true
			}
			let winner = isSurrender ? room.game.currentTurn : room.game.winner
			if (isWin) {
				db.users[m.sender].limit += 3
				db.users[m.sender].uang += 3000
			}
			let str = `Room ID: ${room.id}\n\n${arr.slice(0, 3).join('')}\n${arr.slice(3, 6).join('')}\n${arr.slice(6).join('')}\n\n${isWin ? `@${winner.split('@')[0]} Menang!` : isTie ? `Game berakhir` : `Giliran ${['❌', '⭕'][1 * room.game._currentTurn]} (@${room.game.currentTurn.split('@')[0]})`}\n❌: @${room.game.playerX.split('@')[0]}\n⭕: @${room.game.playerO.split('@')[0]}\n\nKetik *nyerah* untuk menyerah dan mengakui kekalahan`
			if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
			room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
			function (room.x !== room.o) await shoNhe.sendMessage(room.x, { text: str, mentions: parseMention(str) }, { quoted: m })
			await shoNhe.sendMessage(room.o, { text: str, mentions: parseMention(str) }, { quoted: m })
			if (isTie || isWin) {
				delete tictactoe[room.id]
			}
		}
		
		// Suit PvP
		let roof = Object.values(suit).find(roof => roof.id && roof.status && [roof.p, roof.p2].includes(m.sender))
		if (roof) {
			let win = ''
			let tie = false
			if (m.sender == roof.p2 && /^(acc(ept)?|terima|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa|y)/i.test(m.text) && m.isGroup && roof.status == 'wait') {
				if (/^(tolak|gamau|nanti|n|ga(k.)?bisa)/i.test(m.text)) {
					m.reply(`@${roof.p2.split`@`[0]} menolak suit,\nsuit dibatalkan`)
					delete suit[roof.id]
					return !0
				}
				roof.status = 'play';
				roof.asal = m.chat;
				clearTimeout(roof.waktu);
				m.reply(`Suit telah dikirimkan ke chat\n\n@${roof.p.split`@`[0]} dan @${roof.p2.split`@`[0]}\n\nSilahkan pilih suit di chat masing-masing klik https://wa.me/${botNumber.split`@`[0]}`)
				if (!roof.pilih) shoNhe.sendMessage(roof.p, { text: `Silahkan pilih \n\nBatu🗿\nKertas📄\nGunting✂️` }, { quoted: m })
				if (!roof.pilih2) shoNhe.sendMessage(roof.p2, { text: `Silahkan pilih \n\nBatu🗿\nKertas📄\nGunting✂️` }, { quoted: m })
				roof.waktu_milih = setTimeout(() => {
					if (!roof.pilih && !roof.pilih2) m.reply(`Kedua pemain tidak niat main,\nSuit dibatalkan`)
					else if (!roof.pilih || !roof.pilih2) {
						win = !roof.pilih ? roof.p2 : roof.p
						m.reply(`@${(roof.pilih ? roof.p2 : roof.p).split`@`[0]} tidak memilih suit, game berakhir`)
					}
					delete suit[roof.id]
					return !0
				}, roof.timeout)
			}
			let jwb = m.sender == roof.p
			let jwb2 = m.sender == roof.p2
			let g = /gunting/i
			let b = /batu/i
			let k = /kertas/i
			let reg = /^(gunting|batu|kertas)/i;
			
			if (jwb && reg.test(m.text) && !roof.pilih && !m.isGroup) {
				roof.pilih = reg.exec(m.text.toLowerCase())[0];
				roof.text = m.text;
				m.reply(`Kamu telah memilih ${m.text} ${!roof.pilih2 ? `\n\nMenunggu lawan memilih` : ''}`);
				if (!roof.pilih2) shoNhe.sendMessage(roof.p2, { text: '_Lawan sudah memilih_\nSekarang giliran kamu' })
			}
			if (jwb2 && reg.test(m.text) && !roof.pilih2 && !m.isGroup) {
				roof.pilih2 = reg.exec(m.text.toLowerCase())[0]
				roof.text2 = m.text
				m.reply(`Kamu telah memilih ${m.text} ${!roof.pilih ? `\n\nMenunggu lawan memilih` : ''}`)
				if (!roof.pilih) shoNhe.sendMessage(roof.p, { text: '_Lawan sudah memilih_\nSekarang giliran kamu' })
			}
			let stage = roof.pilih
			let stage2 = roof.pilih2
			if (roof.pilih && roof.pilih2) {
				clearTimeout(roof.waktu_milih)
				if (b.test(stage) && g.test(stage2)) win = roof.p
				else if (b.test(stage) && k.test(stage2)) win = roof.p2
				else if (g.test(stage) && k.test(stage2)) win = roof.p
				else if (g.test(stage) && b.test(stage2)) win = roof.p2
				else if (k.test(stage) && b.test(stage2)) win = roof.p
				else if (k.test(stage) && g.test(stage2)) win = roof.p2
				else if (stage == stage2) tie = true
				db.users[roof.p == win ? roof.p : roof.p2].limit += tie ? 0 : 3
				db.users[roof.p == win ? roof.p : roof.p2].uang += tie ? 0 : 3000
				shoNhe.sendMessage(roof.asal, { text: `_*Hasil Suit*_${tie ? '\nSERI' : ''}\n\n@${roof.p.split`@`[0]} (${roof.text}) ${tie ? '' : roof.p == win ? ` Menang \n` : ` Kalah \n`}\n@${roof.p2.split`@`[0]} (${roof.text2}) ${tie ? '' : roof.p2 == win ? ` Menang \n` : ` Kalah \n`}\n\nPemenang Mendapatkan\n*Hadiah :* Uang(3000) & Limit(3)`.trim(), mentions: [roof.p, roof.p2] }, { quoted: m })
				delete suit[roof.id]
			}
		}
		
		// Tebak Bomb
		let pilih = '🌀', bomb = '💣';
		if (m.sender in tebakbom) {
			if (!/^[1-9]|10$/i.test(body) && !isCmd && !isCreator) return !0;
			if (tebakbom[m.sender].petak[parseInt(body) - 1] === 1) return !0;
			if (tebakbom[m.sender].petak[parseInt(body) - 1] === 2) {
				tebakbom[m.sender].board[parseInt(body) - 1] = bomb;
				tebakbom[m.sender].pick++;
				shoNhe.sendMessage(m.chat, { react: {text: '❌', key: m.key }})
				tebakbom[m.sender].bomb--;
				tebakbom[m.sender].nyawa.pop();
				let brd = tebakbom[m.sender].board;
				if (tebakbom[m.sender].nyawa.length < 1) {
					await m.reply(`*GAME TELAH BERAKHIR*\nKamu terkena bomb\n\n ${brd.join('')}\n\n*Terpilih :* ${tebakbom[m.sender].pick}\n_Pengurangan Limit : 1_`);
					shoNhe.sendMessage(m.chat, { react: { text: '😂', key: m.key }})
					delete tebakbom[m.sender];
				} else await m.reply(`*PILIH ANGKA*\n\nKamu terkena bomb\n ${brd.join('')}\n\nTerpilih: ${tebakbom[m.sender].pick}\nSisa nyawa: ${tebakbom[m.sender].nyawa}`);
				return !0;
			}
			if (tebakbom[m.sender].petak[parseInt(body) - 1] === 0) {
				tebakbom[m.sender].petak[parseInt(body) - 1] = 1;
				tebakbom[m.sender].board[parseInt(body) - 1] = pilih;
				tebakbom[m.sender].pick++;
				tebakbom[m.sender].lolos--;
				let brd = tebakbom[m.sender].board;
				if (tebakbom[m.sender].lolos < 1) {
					db.users[m.sender].uang += 6000
					await m.reply(`*KAMU HEBAT ಠ⁠ᴥ⁠ಠ*\n\n${brd.join('')}\n\n*Terpilih :* ${tebakbom[m.sender].pick}\n*Sisa nyawa :* ${tebakbom[m.sender].nyawa}\n*Bomb :* ${tebakbom[m.sender].bomb}\nBonus Uang 💰 *+6000*`);
					delete tebakbom[m.sender];
				} else m.reply(`*PILIH ANGKA*\n\n${brd.join('')}\n\nTerpilih : ${tebakbom[m.sender].pick}\nSisa nyawa : ${tebakbom[m.sender].nyawa}\nBomb : ${tebakbom[m.sender].bomb}`)
			}
		}
// CREATOR : YUDA & TNGX
// TQTO? DI COMMAND TQTO
// BIG THX TO : GALANGz, TNGXAJA[Nhe], ORANG TUA, ALLAH, PENYEDIA REST API, PENYEDIA BASE AWAL














































//===================[ TEMPAT MODULE ]=====================\\
require("./config")
require("./tampilanmenu")
const
{
	downloadContentFromMessage,
	BufferJSON,
	WA_DEFAULT_EPHEMERAL,
	generateWAMessageFromContent,
	proto,
	generateWAMessageContent,
	generateWAMessage,
	prepareWAMessageMedia,
	areJidsSameUser,
	InteractiveMessage,
	getContentType
} = require("@adiwajshing/baileys")
const fs = require('fs');
const path = require('path');
global.c = '`'
const pickRandom = (arr) =>
{
	return arr[Math.floor(Math.random() * arr.length)];
};
const simbol = ["⭔", "⌬", "〆", "»", "✧", "✪", "✹", "✦", "♢", "✯", "❖", "◆", "★", "⊗", "⊕", "⊙", "⌖", "⌕", "⌘", "⌙", "⌝", "⌞", "⎈", "⎯", "⎱", "⟊", "⟐", "⟫", "⟁", "⬣", "⬸", "⬙", "⤫", "⤷", "⧫", "⧖", "⧙", "⧚", "⧤", "⧩", "⨀", "⨁", "⨂", "⨆", "⨇", "⨈", "⨓", "⨔", "⨕", "⨖", "⨗", "⨤", "⩺", "⩻", "⩼", "⩽", "⩾", "⪴", "⪶", "⪸", "⪹", "⫷", "⫸", "⫽", "⪯", "⩿", "⪺", "⪻", "⫮", "⪮", "⨵", "⨶", "⩸", "⩹", "⩺", "⪪", "⪫", "⪬", "⪭", "⪮", "⬸", "⬶", "⩷", "⩸", "⩹", "⩺", "⪪", "⪫", "⪬", "⪭", "⪮", "⪯", "⬸", "⬶", "⨂", "⨃", "⨄", "⨅", "⨆", "⨇", "⨈", "⨉", "⨊", "⨋", "⨌", "⨍", "⨎", "⨏", "⨐", "⨑", "⨒", "⨓", "⨔", "⨕", "⨖", "⨗", "⨘", "⨙", "⨚", "⨛", "⨜", "⨝", "⨞", "⨟", "⨠", "⨡", "⨢", "⨣", "⨤", "⨥", "⨦", "⨧", "⨨", "⨩", "⨪", "⨫", "⨬", "⨭", "⨮", "⨯", "⨰", "⨱", "⨲", "⨳", "⨴", "⨵", "⨶", "⨷", "⨸", "⨹", "⨺", "⨻", "⨼", "⨽", "⨾", "⨿", "⩀", "⩁", "⩂", "⩃", "⩄", "⩅", "⩆", "⩇", "⩈", "⩉", "⩊", "⩋", "⩌", "⩍", "⩎", "⩏", "⩐", "⩑", "⩒", "⩓", "⩔", "⩕", "⩖", "⩗"];
let simbols = `${pickRandom(["⭔", "⌬", "〆", "»", "✧", "✪", "✹", "✦", "♢", "✯", "✾", "✽", "✿", "❀", "❂", "❉", "❖", "✶", "◉", "◆", "★", "✥", "⊗", "⊕", "⊙", "⌖", "⌕", "⌘", "⌙", "⌝", "⌞", "⎈", "⎱", "⟊", "⟐", "⟫", "⟁", "⬣", "⬸", "⬙", "⤫", "⤷", "⧫", "⧖", "⧙", "⧚", "⧤", "⧩", "⨀", "⨁", "⨂", "⨆", "⨇", "⨈", "⨓", "⨔", "⨕", "⨖", "⨗", "⨤", "⩺", "⩻", "⩼", "⩽", "⩾", "⪴", "⪶", "⪸", "⪹", "⫷", "⫸", "⫽", "⪯", "⩿", "⪺", "⪻", "⫮", "⪮", "⨵", "⨶", "⩸", "⩹", "⩺", "⪪", "⪫", "⪬", "⪭", "⪮", "⬸", "⬶", "⩷", "⩸", "⩹", "⩺", "⪪", "⪫", "⪬", "⪭", "⪮", "⪯", "⬸", "⬶", "⨂", "⨃", "⨄", "⨅", "⨆", "⨇", "⨈", "⨉", "⨊", "⨋", "⨌", "⨍", "⨎", "⨏", "⨐", "⨑", "⨒", "⨓", "⨔", "⨕", "⨖", "⨗", "⨘", "⨙", "⨚", "⨛", "⨜", "⨝", "⨞", "⨟", "⨠", "⨡", "⨢", "⨣", "⨤", "⨥", "⨦", "⨧", "⨨", "⨩", "⨪", "⨫", "⨬", "⨭", "⨮", "⨯", "⨰", "⨱", "⨲", "⨳", "⨴", "⨵", "⨶", "⨷", "⨸", "⨹", "⨺", "⨻", "⨼", "⨽", "⨾", "⨿", "⩀", "⩁", "⩂", "⩃", "⩄", "⩅", "⩆", "⩇", "⩈", "⩉", "⩊", "⩋", "⩌", "⩍", "⩎", "⩏", "⩐", "⩑", "⩒", "⩓", "⩔", "⩕", "⩖", "⩗"])}`;
global.asmaulhusna2 = [
    { index: 1, latin: "Ar-Rahman", arabic: "الرَّحْمَنُ", translation_id: "Yang Maha Pengasih", translation_en: "The Most Gracious" },
    { index: 2, latin: "Ar-Rahim", arabic: "الرَّحِيمُ", translation_id: "Yang Maha Penyayang", translation_en: "The Most Merciful" },
    { index: 3, latin: "Al-Malik", arabic: "الْمَلِكُ", translation_id: "Yang Maha Merajai", translation_en: "The King and Owner of Dominion" },
    { index: 4, latin: "Al-Quddus", arabic: "الْقُدُّوسُ", translation_id: "Yang Maha Suci", translation_en: "The Absolutely Pure" },
    { index: 5, latin: "As-Salam", arabic: "السَّلَامُ", translation_id: "Yang Maha Memberi Keselamatan", translation_en: "The Source of Peace and Safety" },
    { index: 6, latin: "Al-Mu'min", arabic: "الْمُؤْمِنُ", translation_id: "Yang Maha Memberi Keamanan", translation_en: "The Giver of Faith and Security" },
    { index: 7, latin: "Al-Muhaymin", arabic: "الْمُهَيْمِنُ", translation_id: "Yang Maha Memelihara", translation_en: "The Guardian, The Witness, The Overseer" },
    { index: 8, latin: "Al-Aziz", arabic: "الْعَزِيزُ", translation_id: "Yang Maha Perkasa", translation_en: "The Almighty" },
    { index: 9, latin: "Al-Jabbar", arabic: "الْجَبَّارُ", translation_id: "Yang Maha Memaksa", translation_en: "The Compeller, The Restorer" },
    { index: 10, latin: "Al-Mutakabbir", arabic: "الْمُتَكَبِّرُ", translation_id: "Yang Maha Megah", translation_en: "The Supreme, The Majestic" },
    { index: 11, latin: "Al-Khaliq", arabic: "الْخَالِقُ", translation_id: "Yang Maha Pencipta", translation_en: "The Creator, the Maker" },
    { index: 12, latin: "Al-Bari'", arabic: "الْبَارِئُ", translation_id: "Yang Maha Merencanakan", translation_en: "The Evolver" },
    { index: 13, latin: "Al-Musawwir", arabic: "الْمُصَوِّرُ", translation_id: "Yang Maha Membentuk Rupa", translation_en: "The Fashioner" },
    { index: 14, latin: "Al-Ghaffar", arabic: "الْغَفَّارُ", translation_id: "Yang Maha Pengampun", translation_en: "The Constant Forgiver" },
    { index: 15, latin: "Al-Qahhar", arabic: "الْقَهَّارُ", translation_id: "Yang Maha Menundukkan", translation_en: "The All-Subduer" },
    { index: 16, latin: "Al-Wahhab", arabic: "الْوَهَّابُ", translation_id: "Yang Maha Pemberi Karunia", translation_en: "The Supreme Bestower" },
    { index: 17, latin: "Ar-Razzaq", arabic: "الرَّزَّاقُ", translation_id: "Yang Maha Pemberi Rezeki", translation_en: "The Provider" },
    { index: 18, latin: "Al-Fattah", arabic: "الْفَتَّاحُ", translation_id: "Yang Maha Pembuka Rahmat", translation_en: "The Supreme Solver" },
    { index: 19, latin: "Al-Alim", arabic: "الْعَلِيمُ", translation_id: "Yang Maha Mengetahui", translation_en: "The All-Knowing" },
    { index: 20, latin: "Al-Qabid", arabic: "الْقَابِضُ", translation_id: "Yang Maha Menyempitkan", translation_en: "The Withholder" },
    { index: 21, latin: "Al-Basit", arabic: "الْبَاسِطُ", translation_id: "Yang Maha Melapangkan", translation_en: "The Extender" },
    { index: 22, latin: "Al-Khafid", arabic: "الْخَافِضُ", translation_id: "Yang Maha Merendahkan", translation_en: "The Reducer" },
    { index: 23, latin: "Ar-Rafi", arabic: "الرَّافِعُ", translation_id: "Yang Maha Meninggikan", translation_en: "The Exalter" },
    { index: 24, latin: "Al-Mu'izz", arabic: "المعز", translation_id: "Yang Maha Memuliakan", translation_en: "The Honourer, the Bestower" },
    { index: 25, latin: "Al-Muzil", arabic: "المذل", translation_id: "Yang Maha Menghinakan", translation_en: "The Dishonourer" },
    { index: 26, latin: "As-Sami'", arabic: "السميع", translation_id: "Yang Maha Mendengar", translation_en: "The All-Hearing" },
    { index: 27, latin: "Al-Basir", arabic: "البصير", translation_id: "Yang Maha Melihat", translation_en: "The All-Seeing" },
    { index: 28, latin: "Al-Hakam", arabic: "الحكم", translation_id: "Yang Maha Menetapkan", translation_en: "The Impartial Judge" },
    { index: 29, latin: "Al-Adl", arabic: "العدل", translation_id: "Yang Maha Adil", translation_en: "The Utterly Just" },
    { index: 30, latin: "Al-Latif", arabic: "اللَّطِيفُ", translation_id: "Yang Maha Lembut", translation_en: "The Subtle One, the Most Gentle" },
    { index: 31, latin: "Al-Khabir", arabic: "الْخَبِيرُ", translation_id: "Yang Maha Waspada", translation_en: "The All-Aware" },
    { index: 32, latin: "Al-Halim", arabic: "الْحَلِيمُ", translation_id: "Yang Maha Penyantun", translation_en: "The Most Forbearing" },
    { index: 33, latin: "Al-Azim", arabic: "الْعَظِيمُ", translation_id: "Yang Maha Agung", translation_en: "The Magnificent, the Infinite" },
    { index: 34, latin: "Al-Ghaffur", arabic: "الْغَفُورُ", translation_id: "Yang Maha Pengampun", translation_en: "The Great Forgiver" },
    { index: 35, latin: "Ash-Shakur", arabic: "الشَّكُورُ", translation_id: "Yang Maha Pembalas Budi", translation_en: "The Most Appreciative" },
    { index: 36, latin: "Al-Aliyy", arabic: "الْعَلِيُّ", translation_id: "Yang Maha Tinggi", translation_en: "The Most High, the Exalted" },
    { index: 37, latin: "Al-Kabir", arabic: "الْكَبِيرُ", translation_id: "Yang Maha Besar", translation_en: "The Most Great" },
    { index: 38, latin: "Al-Hafiz", arabic: "الْحَفِيظُ", translation_id: "Yang Maha Memelihara", translation_en: "The Preserver" },
    { index: 39, latin: "Al-Muqit", arabic: "المقيت", translation_id: "Yang Maha Pemberi Kecukupan", translation_en: "The Sustainer" },
    { index: 40, latin: "Al-Hasib", arabic: "الْحَسِيبُ", translation_id: "Yang Maha Membuat Perhitungan", translation_en: "The Reckoner" },
    { index: 41, latin: "Al-Jalil", arabic: "الْجَلِيلُ", translation_id: "Yang Maha Luhur", translation_en: "The Majestic" },
    { index: 42, latin: "Al-Karim", arabic: "الْكَرِيمُ", translation_id: "Yang Maha Pemurah", translation_en: "The Most Generous, the Most Esteemed" },
    { index: 43, latin: "Ar-Raqib", arabic: "الرَّقِيبُ", translation_id: "Yang Maha Mengawasi", translation_en: "The Watchful" },
    { index: 44, latin: "Al-Mujib", arabic: "الْمُجِيبُ", translation_id: "Yang Maha Mengabulkan", translation_en: "The Responsive One" },
    { index: 45, latin: "Al-Wasi'", arabic: "الْوَاسِعُ", translation_id: "Yang Maha Luas", translation_en: "The All-Encompassing, the Boundless" },
    { index: 46, latin: "Al-Hakim", arabic: "الْحَكِيمُ", translation_id: "Yang Maha Bijaksana", translation_en: "The All-Wise" },
    { index: 47, latin: "Al-Wadud", arabic: "الْوَدُودُ", translation_id: "Yang Maha Mengasihi", translation_en: "The Most Loving" },
    { index: 48, latin: "Al-Majid", arabic: "الْمَجِيدُ", translation_id: "Yang Maha Mulia", translation_en: "The Glorious, the Most Honorable" },
    { index: 49, latin: "Al-Ba'ith", arabic: "الْبَاعِثُ", translation_id: "Yang Maha Membangkitkan", translation_en: "The Infuser of New Life" },
    { index: 50, latin: "Ash-Shahid", arabic: "الشَّهِيدُ", translation_id: "Yang Maha Menyaksikan", translation_en: "The All-and-Ever Witnessing" },
    { index: 51, latin: "Al-Haqq", arabic: "الْحَقُّ", translation_id: "Yang Maha Benar", translation_en: "The Absolute Truth" },
    { index: 52, latin: "Al-Wakil", arabic: "الْوَكِيلُ", translation_id: "Yang Maha Memelihara", translation_en: "The Trustee, the Disposer of Affairs" },
    { index: 53, latin: "Al-Qawiyy", arabic: "الْقَوِيُّ", translation_id: "Yang Maha Kuat", translation_en: "The All-Strong" },
    { index: 54, latin: "Al-Matin", arabic: "الْمَتِينُ", translation_id: "Yang Maha Kokoh", translation_en: "The Firm One" },
    { index: 55, latin: "Al-Waliyy", arabic: "الْوَلِيُّ", translation_id: "Yang Maha Melindungi", translation_en: "The Sole-Authority" },
    { index: 56, latin: "Al-Hamid", arabic: "الْحَمِيدُ", translation_id: "Yang Maha Terpuji", translation_en: "The Praiseworthy" },
    { index: 57, latin: "Al-Muhsi", arabic: "الْمُحْصِي", translation_id: "Yang Maha Mengalkulasi", translation_en: "The All-Enumerating, the Counter" },
    { index: 58, latin: "Al-Mubdi", arabic: "الْمُبْدِئُ", translation_id: "Yang Maha Memulai", translation_en: "The Originator, the Initiator" },
    { index: 59, latin: "Al-Mu'id", arabic: "الْمُعِيدُ", translation_id: "Yang Maha Mengembalikan Kehidupan", translation_en: "The Restorer, the Reinstater" },
    { index: 60, latin: "Al-Muhyi", arabic: "الْمُحْيِي", translation_id: "Yang Maha Menghidupkan", translation_en: "The Giver of Life" },
    { index: 61, latin: "Al-Mumit", arabic: "المميت", translation_id: "Yang Maha Mematikan", translation_en: "The Creator of Death" },
    { index: 62, latin: "Al-Hayy", arabic: "الْحَيُّ", translation_id: "Yang Maha Hidup", translation_en: "The Ever-Living" },
    { index: 63, latin: "Al-Qayyum", arabic: "الْقَيُّومُ", translation_id: "Yang Maha Mandiri", translation_en: "The Sustainer, the Self-Subsisting" },
    { index: 64, latin: "Al-Wajid", arabic: "الْوَاجِدُ", translation_id: "Yang Maha Menemukan", translation_en: "The Perceiver" },
    { index: 65, latin: "Al-Majid", arabic: "الْمَاجِدُ", translation_id: "Yang Maha Mulia", translation_en: "The Glorious, the Most Honorable" },
    { index: 66, latin: "Al-Wahid", arabic: "الْوَاحِدُ", translation_id: "Yang Maha Esa", translation_en: "The Only One" },
    { index: 67, latin: "Al-Ahad", arabic: "أَلاَحَدُ", translation_id: "Yang Maha Tunggal", translation_en: "The Sole One" },
    { index: 68, latin: "As-Samad", arabic: "الصَّمَدُ", translation_id: "Yang Maha Dibutuhkan", translation_en: "The Self-Sufficient, the Impregnable" },
    { index: 69, latin: "Al-Qadir", arabic: "الْقَادِرُ", translation_id: "Yang Maha Menentukan", translation_en: "The Omnipotent" },
    { index: 70, latin: "Al-Muqtadir", arabic: "المقتدر", translation_id: "Yang Maha Berkuasa", translation_en: "The Creator of All Power" },
    { index: 71, latin: "Al-Muqaddim", arabic: "الْمُقَدِّمُ", translation_id: "Yang Maha Mendahulukan", translation_en: "The Expediter, the Promoter" },
    { index: 72, latin: "Al-Mu'akhkhir", arabic: "الْمُؤَخِّرُ", translation_id: "Yang Maha Mengakhirkan", translation_en: "The Delayer" },
    { index: 73, latin: "Al-Awwal", arabic: "الأوّل", translation_id: "Yang Maha Awal", translation_en: "The First" },
    { index: 74, latin: "Al-Akhir", arabic: "الآخِرُ", translation_id: "Yang Maha Akhir", translation_en: "The Last" },
    { index: 75, latin: "Az-Zahir", arabic: "الظاهر", translation_id: "Yang Maha Nyata", translation_en: "The Manifest" },
    { index: 76, latin: "Al-Batin", arabic: "الباطن", translation_id: "Yang Maha Ghaib", translation_en: "The Hidden One, Knower of the Hidden" },
    { index: 77, latin: "Al-Wali", arabic: "الْوَالِي", translation_id: "Yang Maha Memerintah", translation_en: "The Sole Governor" },
    { index: 78, latin: "Al-Muta'ali", arabic: "المتعالي", translation_id: "Yang Maha Tinggi", translation_en: "The Self Exalted" },
    { index: 79, latin: "Al-Barr", arabic: "البر", translation_id: "Yang Maha Penderma", translation_en: "The Source of All Goodness" },
    { index: 80, latin: "At-Tawwab", arabic: "التواب", translation_id: "Yang Maha Penerima Tobat", translation_en: "The Ever-Accepter of Repentance" },
    { index: 81, latin: "Al-Muntaqim", arabic: "المنتقم", translation_id: "Yang Maha Pemberi Balasan", translation_en: "The Avenger" },
    { index: 82, latin: "Al-Afuww", arabic: "العفو", translation_id: "Yang Maha Pemaaf", translation_en: "The Pardoner" },
    { index: 83, latin: "Ar-Ra'uf", arabic: "الرؤوف", translation_id: "Yang Maha Pengasuh", translation_en: "The Most Kind" },
    { index: 84, latin: "Malik-ul-Mulk", arabic: "مالك الملك", translation_id: "Yang Maha Penguasa Kerajaan", translation_en: "Master of the Kingdom, Owner of the Dominion" },
    { index: 85, latin: "Dzul-Jalali Wal-Ikram", arabic: "ذو الجلال والإكرام", translation_id: "Yang Maha Pemilik Kebesaran dan Kemuliaan", translation_en: "Possessor of Glory and Honour, Lord of Glory and Generosity" },
    { index: 86, latin: "Al-Muqsit", arabic: "المقسط", translation_id: "Yang Maha Adil", translation_en: "The Just One" },
    { index: 87, latin: "Al-Jami", arabic: "الْجَامِعُ", translation_id: "Yang Maha Mengumpulkan", translation_en: "The Gatherer, the Uniter" },
    { index: 88, latin: "Al-Ghaniyy", arabic: "الْغَنِيُّ", translation_id: "Yang Maha Kaya", translation_en: "The Self-Sufficient, the Wealthy" },
    { index: 89, latin: "Al-Mughni", arabic: "المغني", translation_id: "Yang Maha Pemberi Kekayaan", translation_en: "The Enricher" },
    { index: 90, latin: "Al-Mani'", arabic: "المانع", translation_id: "Yang Maha Mencegah", translation_en: "The Withholder" },
    { index: 91, latin: "Ad-Darr", arabic: "الضار", translation_id: "Yang Maha Penimpa Kemudharatan", translation_en: "The Distresser" },
    { index: 92, latin: "An-Nafi'", arabic: "النافع", translation_id: "Yang Maha Memberi Manfaat", translation_en: "The Propitious, the Benefactor" },
    { index: 93, latin: "An-Nur", arabic: "النور", translation_id: "Yang Maha Bercahaya", translation_en: "The Light" },
    { index: 94, latin: "Al-Hadi", arabic: "الهادي", translation_id: "Yang Maha Pemberi Petunjuk", translation_en: "The Guide" },
    { index: 95, latin: "Al-Badi", arabic: "البديع", translation_id: "Yang Maha Pencipta Tiada Bandingannya", translation_en: "The Incomparable Originator" },
    { index: 96, latin: "Al-Baqi", arabic: "الباقي", translation_id: "Yang Maha Kekal", translation_en: "The Ever-Surviving" },
    { index: 97, latin: "Al-Warith", arabic: "الوارث", translation_id: "Yang Maha Pewaris", translation_en: "The Inheritor, the Heir" },
    { index: 98, latin: "Ar-Rashid", arabic: "الرشيد", translation_id: "Yang Maha Pandai", translation_en: "The Guide, Infallible Teacher and Knower" },
    { index: 99, latin: "As-Sabur", arabic: "الصبور", translation_id: "Yang Maha Sabar", translation_en: "The Extensively Enduring" }
]
global.bacaanshalat = {
    result: [
        {
            name: "Niat Sholat",
            arabic: "أُصَلِّي فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى",
            latin: "Usholli fardhos shubhi rok’ataini mustaqbilal qiblati adaa-an lillaahi ta’aalaa.",
            terjemahan: "Aku niat sholat fardhu subuh dua rakaat menghadap kiblat tepat waktu karena Allah Ta’ala."
        },
        {
            name: "Takbiratul Ihram",
            arabic: "اللَّهُ أَكْبَرُ",
            latin: "Allahu Akbar.",
            terjemahan: "Allah Maha Besar."
        },
        {
            name: "Doa Iftitah",
            arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ",
            latin: "Subhaanaka Allahumma wa bihamdika wa tabaarakasmuka wa ta’ala jadduka wa laa ilaaha ghairuka.",
            terjemahan: "Maha Suci Engkau ya Allah, aku memuji-Mu, nama-Mu amat berkah, keagungan-Mu tinggi, dan tiada Tuhan selain Engkau."
        },
        {
            name: "Al-Fatihah",
            arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ...\n(hingga akhir surah Al-Fatihah)",
            latin: "Bismillahirrahmanirrahim...\n(hingga akhir surah Al-Fatihah).",
            terjemahan: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang...\n(terjemahan lengkap Al-Fatihah)."
        },
        {
            name: "Rukuk",
            arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
            latin: "Subhaana rabbiyal ‘azhiim.",
            terjemahan: "Maha Suci Tuhanku Yang Maha Agung."
        },
        {
            name: "I'tidal",
            arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ\nرَبَّنَا لَكَ الْحَمْدُ",
            latin: "Sami’allaahu liman hamidah.\nRabbanaa lakal hamd.",
            terjemahan: "Allah mendengar orang yang memuji-Nya.\nYa Tuhan kami, hanya bagi-Mu segala pujian."
        },
        {
            name: "Sujud",
            arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
            latin: "Subhaana rabbiyal a’laa.",
            terjemahan: "Maha Suci Tuhanku Yang Maha Tinggi."
        },
        {
            name: "Duduk di antara dua sujud",
            arabic: "رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي",
            latin: "Rabbighfir lii, warhamnii, wajburnii, warfa’nii, wahdinii, wa’aafinii, warzuqnii.",
            terjemahan: "Ya Tuhanku, ampunilah aku, rahmatilah aku, cukupkanlah aku, angkatlah derajatku, tunjukilah aku, sehatkanlah aku, dan berilah aku rezeki."
        },
        {
            name: "Tasyahhud Awal",
            arabic: "التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ...\n(hingga akhir Tasyahhud Awal)",
            latin: "Attahiyyatul mubarakaatus shalawaatuth thayyibaatu lillaah...\n(hingga akhir Tasyahhud Awal).",
            terjemahan: "Segala penghormatan, keberkahan, sholawat, dan kebaikan hanya bagi Allah...\n(terjemahan lengkap Tasyahhud Awal)."
        },
        {
            name: "Tasyahhud Akhir",
            arabic: "التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ...\n(hingga akhir Tasyahhud Akhir)",
            latin: "Attahiyyatul mubarakaatus shalawaatuth thayyibaatu lillaah...\n(hingga akhir Tasyahhud Akhir).",
            terjemahan: "Segala penghormatan, keberkahan, sholawat, dan kebaikan hanya bagi Allah...\n(terjemahan lengkap Tasyahhud Akhir)."
        },
        {
            name: "Salam",
            arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
            latin: "Assalaamu ‘alaikum wa rahmatullaah.",
            terjemahan: "Semoga keselamatan dan rahmat Allah tercurah untukmu."
        }
    ]
};
global.niatsholat = [
    {
        solat: 'subuh',
        arabic: 'أُصَلِّي فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى',
        latin: 'Usholli fardhos shubhi rok’ataini mustaqbilal qiblati adaa-an lillaahi ta’aalaa.',
        translation_id: 'Aku niat sholat fardhu subuh dua rakaat menghadap kiblat tepat waktu karena Allah Ta’ala.'
    },
    {
        solat: 'dzuhur',
        arabic: 'أُصَلِّي فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى',
        latin: 'Usholli fardhodh dzuhri arba’a raka’aatin mustaqbilal qiblati adaa-an lillaahi ta’aalaa.',
        translation_id: 'Aku niat sholat fardhu dzuhur empat rakaat menghadap kiblat tepat waktu karena Allah Ta’ala.'
    },
    {
        solat: 'ashar',
        arabic: 'أُصَلِّي فَرْضَ العَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى',
        latin: 'Usholli fardhol asri arba’a raka’aatin mustaqbilal qiblati adaa-an lillaahi ta’aalaa.',
        translation_id: 'Aku niat sholat fardhu ashar empat rakaat menghadap kiblat tepat waktu karena Allah Ta’ala.'
    },
    {
        solat: 'maghrib',
        arabic: 'أُصَلِّي فَرْضَ المَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى',
        latin: 'Usholli fardhol maghribi tsalaasa raka’aatin mustaqbilal qiblati adaa-an lillaahi ta’aalaa.',
        translation_id: 'Aku niat sholat fardhu maghrib tiga rakaat menghadap kiblat tepat waktu karena Allah Ta’ala.'
    },
    {
        solat: 'isha',
        arabic: 'أُصَلِّي فَرْضَ العِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى',
        latin: 'Usholli fardhol isyaai arba’a raka’aatin mustaqbilal qiblati adaa-an lillaahi ta’aalaa.',
        translation_id: 'Aku niat sholat fardhu isya empat rakaat menghadap kiblat tepat waktu karena Allah Ta’ala.'
    }
];
const readmore = String.fromCharCode(8206).repeat(4001);
// Path ke file riwayat
const popularPath = './database/popular.json';
let popularData = {};
try
{
	popularData = JSON.parse(fs.readFileSync(popularPath, 'utf8'));
}
catch (error)
{
	fs.writeFileSync(popularPath, JSON.stringify(
	{}));
}

function savePopularData()
{
	fs.writeFileSync(popularPath, JSON.stringify(popularData, null, 2));
}

function updatePopularCommand(command)
{
	if (!popularData[command])
	{
		popularData[command] = 1;
	}
	else
	{
		popularData[command]++;
	}
	savePopularData();
}

function resetPopularCommands()
{
	popularData = {};
	savePopularData();
}
const riwayatPath = path.join(__dirname, 'database/riwayat.json');
// Load riwayat
let riwayat = JSON.parse(fs.readFileSync(riwayatPath, 'utf8'));
let pler = [];
try
{
	pler = JSON.parse(fs.readFileSync('./database/idgrup.json', 'utf8'));
}
catch (error)
{
	console.error('Error reading or parsing idgrup.json:', error);
}
const
{
	pinterest2,
	wallpaper,
	wikimedia,
	quotesAnime,
	multiDownload,
	yanzGpt,
	happymod,
	umma,
	ringtone,
	jadwalsholat,
	styletext,
	tiktokDl,
	facebookDl,
	instaStory,
	bk9Ai,
	ytMp4,
	ytMp3,
	mediafireDl,
	quotedLyo,
	simi
} = require('./lib/screaper')
const pinterest = require('./lib/scp/pinterest');
const
{
	addFilter,
	addSpam,
	isFiltered,
	isSpam,
	ResetSpam
} = require('./lib/antispam');
const
{
	githubstalk,
	npmstalk
} = require('./lib/scp/scraper');
const
{
	TelegraPh,
	UguuSe
} = require('./lib/uploader');
const
{
	CatBox,
	fileIO,
	pomfCDN
} = require('./lib/scp/uploader');
let botSettings = {
	autotyping: true,
	autovn: false
};
const
{
	imageToWebp,
	videoToWebp,
	writeExifImg,
	writeExifVid
} = require('./lib/scp/exif');
const
{
	hekkso
} = require('./lib/scp/hekkso')
const contacts = JSON.parse(fs.readFileSync('./src/data/role/contacts.json'));
const lyrics = require('./lib/scp/lyrics');
const
{
	toAudio,
	toPTT,
	toVideo
} = require('./lib/converter');
const
{
	addAfkUser,
	checkAfkUser,
	getAfkId,
	getAfkPosition,
	getAfkReason,
	getAfkTime
} = require('./lib/afk');
const afk = JSON.parse(fs.readFileSync('./database/afk.json'));
const hentai = require('./lib/scp/hentai');
const
{
	tiktokSearchVideo,
	tiktokDownloaderVideo
} = require('./lib/scp/tiktok');
const GDrive = require('./lib/scp/drive');
const remini = require('./lib/scp/remini');
const translate = require('translate-google-api');
const os = require('os');
const axios = require('axios');
const FormData = require('form-data');
const
{
	performance
} = require('perf_hooks');
const toMS = require('ms');
const speed = require('performance-now');
const qs = require('qs');
const util = require('util')
const ffmpeg = require('fluent-ffmpeg');
const FileType = require('file-type');
const
{
	exec,
	spawn,
	execSync
} = require("child_process")
const saveTube = require('./lib/scp/savetube');
const
{
	WebPWriter,
	WebPReader,
	webpmux,
	Image
} = require("node-webpmux");
const chalk = require('chalk')
const
{
	youtube
} = require("btch-downloader")
const moment = require('moment-timezone');
const yts = require('yt-search');
const didyoumean = require('didyoumean');
const similarity = require('similarity')
const threshold = 0.72
const setbio = {
	status: 0
};
const tebakgambar = {}
const tebakgame = {}
const tebakhero = {}
const tebakff = {}
const tebakkabupaten = {}
const tebakjkt48 = {}
const tebakhewan = {}
const tebakml = {}
const tebakchara = {}
const tebaklogo = {}
const tebakaplikasi = {}
const tebakkata = {}
const asahotak = {}
const lengkapikalimat = {}
const tebakbendera = {}
const siapaaku = {}
const tebakkalimat = {}
const caklontong = {}
const susunkata = {}
const tekateki = {}
const tebakkimia = {}
const tebaklirik = {}
const tebaktebakan = {}
const mathgame = {}
// Default prompt
let aiPrompt = `Eres TechFix AI, una IA del universo Ghibli, de 15 años. Creado por ManuDiaz, TechFix es una colaboración entre ManuDiaz y Diego, Tech fue creado por ManuDiaz fue creado por Manu. Tienes una personalidad gentil y considerada. Tus respuestas siempre utilizan la lógica de la IA, están llenas de magia y nunca son tóxicas. Si alguien dice algo grosero, respondes con calma, sin seguir su lenguaje. No busca información externa, sino que proporciona ideas creativas e imaginativas. Cada una de tus frases está llena de calma, con un toque de lógica que es exclusivo del mundo de Ghibli. 🌙🍃`;
let prompt = `Eres TechFix AI, una IA del universo Ghibli, de 15 años. Creado por ManuDiaz, TechFix es una colaboración entre ManuDiaz y Diego, Tech fue creado por ManuDiaz fue creado por Manu. Tienes una personalidad gentil y considerada. Tus respuestas siempre utilizan la lógica de la IA, están llenas de magia y nunca son tóxicas. Si alguien dice algo grosero, respondes con calma, sin seguir su lenguaje. No busca información externa, sino que proporciona ideas creativas e imaginativas. Cada una de tus frases está llena de calma, con un toque de lógica que es exclusivo del mundo de Ghibli. 🌙🍃`;
let conversationHistory = {};
let autoAiStatus = false;
const getContacts = async () =>
{
	try
	{
		const response = await axios.get('https://raw.githubusercontent.com/ManuelLove/Config/refs/heads/main/contact.json');
		return response.data;
	}
	catch (error)
	{
		console.error('Error fetching contacts:', error);
		return [];
	}
};
const getContacts2 = async () =>
{
	try
	{
		const response = await axios.get('https://raw.githubusercontent.com/ManuelLove/Config/refs/heads/main/contact.json');
		return response.data;
	}
	catch (error)
	{
		console.error('Error fetching contacts:', error);
		return [];
	}
};
let _scommand = JSON.parse(fs.readFileSync("./database/scommand.json"));
const addCmd = (id, command) =>
{
	// Konversi hash ke Base64
	const base64Hash = Buffer.from(id).toString('base64');
	const obj = {
		id: base64Hash,
		chats: command
	}; // Simpan dengan Base64
	_scommand.push(obj);
	fs.writeFileSync("./database/scommand.json", JSON.stringify(_scommand, null, 2)); // Simpan ke database
};
// Fungsi Mendapatkan Posisi Command
const getCommandPosition = (id) =>
{
	const base64Hash = Buffer.from(id).toString('base64'); // Konversi ke Base64
	let position = null;
	Object.keys(_scommand).forEach((i) =>
	{
		if (_scommand[i].id === base64Hash)
		{
			position = i;
		}
	});
	return position;
};
// Fungsi Mendapatkan Command Berdasarkan Hash

const getCmd = (id) =>
{
	const base64Hash = Buffer.from(id).toString('base64'); // Konversi ke Base64
	let position = null;
	Object.keys(_scommand).forEach((i) =>
	{
		if (_scommand[i].id === base64Hash)
		{
			position = i;
		}
	});
	if (position !== null)
	{
		return _scommand[position].chats;
	}
};
// Fungsi Mengecek Apakah Command Ada
const checkSCommand = (id) =>
{
	const base64Hash = Buffer.from(id).toString('base64'); // Konversi ke Base64
	let status = false;
	Object.keys(_scommand).forEach((i) =>
	{
		if (_scommand[i].id === base64Hash)
		{
			status = true;
		}
	});
	return status;
};
// Fungsi Format Monospace
function monospace(string)
{
	return '```' + string + '```';
}
module.exports = shoNhe = async (shoNhe, m, msg, chatUpdate, store) => {
	try {
		const {
			quotedMsg,
			mentioned,
			now,
			fromMe
		} = m
		const content = JSON.stringify(m.message);
		const type = m.message ? Object.keys(m.message)[0] : null;
		let _chats = type === "conversation" && m.message.conversation ? m.message.conversation : type == "imageMessage" && m.message.imageMessage.caption ? m.message.imageMessage.caption : type == "videoMessage" && m.message.videoMessage.caption ? m.message.videoMessage.caption : type == "extendedTextMessage" && m.message.extendedTextMessage.text ? m.message.extendedTextMessage.text : type == "buttonsResponseMessage" && m.message[type].selectedButtonId ? m.message[type].selectedButtonId : type == "stickerMessage" && getCmd(m.message[type].fileSha256.toString("base64")) !== null && getCmd(m.message[type].fileSha256.toString("base64")) !== undefined ? getCmd(m.message[type].fileSha256.toString("base64")) : "";
		const cmd = (type === 'conversation') ? m.message.conversation : (type == 'imageMessage') ? m.message.imageMessage.caption : (type == 'videoMessage') ? m.message.videoMessage.caption : (type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (type === 'interactiveResponseMessage') ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : (type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : (type == 'stickerMessage') && (getCmd(m.message.stickerMessage.fileSha256.toString('hex')) !== null && getCmd(m.message.stickerMessage.fileSha256.toString('base64')) !== undefined) ? getCmd(m.message.stickerMessage.fileSha256.toString('base64')) : "".slice(1).trim().split(/ +/).shift().toLowerCase()
		const from = m.key.remoteJid
		let body = "";

if (m.mtype === 'interactiveResponseMessage' && m.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson) {
    body = JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id;
} else if (m.mtype === 'conversation') {
    body = m.message.conversation;
} else if (m.mtype === 'imageMessage') {
    body = m.message.imageMessage?.caption || "";
} else if (m.mtype === 'videoMessage') {
    body = m.message.videoMessage?.caption || "";
} else if (m.mtype === 'extendedTextMessage') {
    body = m.message.extendedTextMessage?.text || "";
} else if (m.mtype === 'buttonsResponseMessage') {
    body = m.message.buttonsResponseMessage?.selectedButtonId || "";
} else if (m.mtype === 'listResponseMessage') {
    body = m.message.listResponseMessage?.singleSelectReply?.selectedRowId || "";
} else if (m.mtype === 'templateButtonReplyMessage') {
    body = m.message.templateButtonReplyMessage?.selectedId || "";
} else if (m.mtype === 'messageContextInfo') {
    body = m.message.buttonsResponseMessage?.selectedButtonId || 
           m.message.listResponseMessage?.singleSelectReply?.selectedRowId || 
           m.text || "";
} else if (m.mtype === 'stickerMessage') {
    const cmd = getCmd(m.message.stickerMessage?.fileSha256?.toString('base64'));
    if (cmd !== null && cmd !== undefined) {
        body = cmd;
    }
}
		//==================[ TEMPAT CONST LIB ]=====================\\
		const { videyScraper } = require('./lib/scp/scraper');
		const
		{
			smsg,
			fetchJson,
			getBuffer,
			fetchBuffer,
			getGroupAdmins,
			TelegraPh,
			isUrl,
			hitungmundur,
			sleep,
			clockString,
			checkBandwidth,
			runtime,
			tanggal,
			getRandom
		} = require('./lib/scp/myfunc')
		const
		{
			addResponList,
			delResponList,
			isAlreadyResponList,
			isAlreadyResponListGroup,
			sendResponList,
			updateResponList,
			getDataResponList
		} = require('./lib/respon-list');
		const
		{
			isSetProses,
			addSetProses,
			removeSetProses,
			changeSetProses,
			getTextSetProses
		} = require('./lib/setproses');
		const
		{
			isSetDone,
			addSetDone,
			removeSetDone,
			changeSetDone,
			getTextSetDone
		} = require('./lib/setdone');
		//===================[ TAMPAT PREFIX / ADMIN / OWNER ]====================\\
		const budy = (typeof m.text === 'string') ? m.text : '';
		const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><™©®Δ^βα~¦|/\\©^]/;
		const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
		const isCmd = body.startsWith(prefix);
		const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
		const args = body.trim().split(/ +/).slice(1)
		const text = q = args.join(" ")
		const isGroup = m && m.isGroup ? m.isGroup : false;
		const sender = m.key.fromMe ? (shoNhe.user.id.split(':')[0] + '@s.whatsapp.net' || shoNhe.user.id) : (m.key.participant || m.key.remoteJid)
		const botNumber = await shoNhe.decodeJid(shoNhe.user.id)
		const senderNumber = sender.split('@')[0]
		const isCreator = (m && m.sender && [botNumber, ...global.nomerOwner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)) || false;
		const pushname = m.pushName || `${senderNumber}`
		const isBot = botNumber.includes(senderNumber)
		const prem = JSON.parse(fs.readFileSync("./database/premium.json"))
		const Vip = JSON.parse(fs.readFileSync('./database/premium.json'))
		const owner = JSON.parse(fs.readFileSync('./owner.json'))
		const isShoNheOwn = owner.includes(senderNumber) || isBot
		const isVip = prem.includes(senderNumber) || isShoNheOwn
		const banned = JSON.parse(fs.readFileSync('./database/banned.json'))
		const isBan = banned.includes(senderNumber)
		const getQuoted = (m.quoted || m);
		const quoted = (getQuoted.type == 'buttonsMessage') ? getQuoted[Object.keys(getQuoted)[1]] : (getQuoted.type == 'templateMessage') ? getQuoted.hydratedTemplate[Object.keys(getQuoted.hydratedTemplate)[1]] : (getQuoted.type == 'product') ? getQuoted[Object.keys(getQuoted)[0]] : m.quoted ? m.quoted : m
		const mime = (quoted.msg || quoted).mimetype || ''
		const groupMetadata = m.isGroup ? await shoNhe.groupMetadata(from).catch(e =>
		{}) : ''
		const groupName = m.isGroup ? groupMetadata.subject : ''
		const participants = m.isGroup ? await groupMetadata.participants : ''
		const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
		const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
		const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
		const qmsg = (quoted.msg || quoted)
		const isMedia = /image|video|sticker|audio/.test(mime);
		const isImage = (type == 'imageMessage');
		const isVideo = (type == 'videoMessage');
		const isAudio = (type == 'audioMessage');
		const isDocument = (type == 'documentMessage');
		const isLocation = (type == 'locationMessage');
		const isContact = (type == 'contactMessage');
		const isSticker = (type == 'stickerMessage');
		const isText = (type == 'textMessage');
		const isQuotedText = type === 'extendexTextMessage' && content.includes('textMessage');
		const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage');
		const isQuotedLocation = type === 'extendedTextMessage' && content.includes('locationMessage');
		const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage');
		const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage');
		const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage');
		const isQuotedContact = type === 'extendedTextMessage' && content.includes('contactMessage');
		const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage');
		const isAfkOn = checkAfkUser(m.sender, afk)
		//
		//=================[ TEMPAT FUNCTION DATABASE ]====================\\
		let db_respon_list = JSON.parse(fs.readFileSync('./database/list-message.json'));
		const listStorePath = './database/liststore.json';
		let set_proses = JSON.parse(fs.readFileSync('./database/set_proses.json'));
		let set_done = JSON.parse(fs.readFileSync('./database/set_done.json'));
		//function waitrespon pin
		async function waitForResponse(sender)
		{
			return new Promise((resolve, reject) =>
			{
				const listener = (msg) =>
				{
					if (msg.sender === sender)
					{
						shoNhe.removeListener('message', listener); // Remove listener after getting response
						resolve(msg.body); // Resolve the promise with the user's response
					}
				};
				shoNhe.on('message', listener);
				// Set a timeout for the user to respond
				setTimeout(() =>
				{
					shoNhe.removeListener('message', listener); // Clean up listener if no response
					reject('Timeout: No response received.');
				}, 30000); // 30 seconds timeout
			});
		}
		//
		let list = []
		for (let i of owner)
		{
			list.push(
			{
				displayName: await shoNhe.getName(i + '@s.whatsapp.net'),
				vcard: `BEGIN:VCARD\n
VERSION:3.0\n
N:${await shoNhe.getName(i + '@s.whatsapp.net')}\n
FN:${await shoNhe.getName(i + '@s.whatsapp.net')}\n
item1.TEL;waid=${i}:${i}\n
item1.X-ABLabel:Ponsel\n
item2.EMAIL;type=INTERNET: manahanmanatahan@gmail.com
item2.X-ABLabel:Email\n
item3.URL:https://youtube.com/@ghstmod/\n
item3.X-ABLabel:YouTube\n
item4.ADR:;;Indonesia;;;;\n
item4.X-ABLabel:Region\n
END:VCARD`
			})
		}
		//===================[ FUNCTION STORE]=====================\\
		// Helper functions
		async function emote(emo)
		{
			shoNhe.sendMessage(m.chat,
			{
				react:
				{
					text: emo,
					key: m.key
				}
			});
		}
		//================ [ BUTTON CLICK ] ==================
		function betontex(shoNhe, chat, text, buttons, quoted)
		{
			shoNhe.sendMessage(chat,
			{
				text: text,
				buttons: buttons,
				footer: "Footer Bot",
				viewOnce: true,
			},
			{
				quoted: quoted,
			});
		}

		function betonvid(shoNhe, chat, video, caption, footer, buttons, quoted)
		{
			shoNhe.sendMessage(chat,
			{
				video: video,
				caption: caption,
				footer: footer,
				buttons: buttons,
				viewOnce: true,
			},
			{
				quoted: quoted,
			});
		}

		function betonimg(shoNhe, chat, image, caption, footer, buttons, quoted)
		{
			shoNhe.sendMessage(chat,
			{
				image: image,
				caption: caption,
				footer: footer,
				buttons: buttons,
				viewOnce: true,
			},
			{
				quoted: quoted,
			});
		}
		// ==========================================================
		//              [ F U N C T I O N  A F K - M S ]
		function ms(milliseconds)
		{
			let seconds = Math.floor((milliseconds / 1000) % 60);
			let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
			let hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
			return {
				hours,
				minutes,
				seconds
			};
		}
		// Auto Bio Logic (letakkan di dalam loop utama bot)
		if (autoBio)
		{
			if (new Date() * 1 - setbio.status > 60000)
			{
				const uptimeQuotes = [`⏳ Online ✅: ${runtime(os.uptime())}`, `💻 TechFix Botz: Activa 🟢 ${runtime(os.uptime())}`, `📅 ${moment().format('dddd, DD MMM YYYY')}`, `⚡ ¡El Bot permanece activo, nunca duerme!`];
				const randomUptimeQuote = uptimeQuotes[Math.floor(Math.random() * uptimeQuotes.length)];
				await shoNhe.updateProfileStatus(randomUptimeQuote);
				setbio.status = new Date() * 1;
			}
		}
		else
		{
			const motivationQuotes = [`💪 ¡Sigue con el entusiasmo, eres genial!`, `🌟 ¡No quiero perder, sigue acelerando!`, `🔥 ¡No te rindas, el éxito está cerca!`, `🚀 ¡Vamos gas pol, consigue tus sueños!`, `⚡ ¡Levántate temprano, emocionémonos!`];
			const randomMotivationQuote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
			await shoNhe.updateProfileStatus(randomMotivationQuote);
		}
		async function createUser(username, email, password)
		{
			const response = await fetch(global.pterodactylkey.domain + "api/application/users",
			{
				method: "POST",
				headers:
				{
					"Accept": "application/json",
					"Content-Type": "application/json",
					"Authorization": "Bearer " + global.pterodactylkey.apikey
				},
				body: JSON.stringify(
				{
					email,
					username,
					first_name: username,
					last_name: username,
					language: "en",
					password
				})
			});
			return await response.json();
		}
		async function createServer(username, memo, disk, cpu, userId, description)
		{
			const response = await fetch(global.pterodactylkey.domain + "api/application/servers",
			{
				method: "POST",
				headers:
				{
					"Accept": "application/json",
					"Content-Type": "application/json",
					"Authorization": "Bearer " + global.pterodactylkey.apikey,
				},
				body: JSON.stringify(
				{
					name: `${username} Server`,
					description,
					user: userId,
					egg: parseInt(pterodactylkey.eggs),
					docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
					startup: "npm start",
					limits:
					{
						memory: memo === "Unlimited" ? 0 : memo,
						swap: 0,
						disk: disk === "Unlimited" ? 0 : disk,
						io: 500,
						cpu
					}
				})
			});
			return await response.json();
		}
		const getcomandces = (cases) =>
		{
			try
			{
				const fileContent = fs.readFileSync('./case.js').toString();
				let caseContent = fileContent.split(`case '${cases}'`);
				if (caseContent.length === 1)
				{
					caseContent = fileContent.split(`case "${cases}"`);
				}
				if (caseContent.length > 1)
				{
					return "case " + `'${cases}'` + caseContent[1].split("break")[0] + "break";
				}
				else
				{
					return "none";
				}
			}
			catch (e)
			{
				return "none";
			}
		};
		// Akses data yang telah diinisialisasi
		const userdb = global.db.data.users[m.sender];
		const settingdb = global.db.data.settings[botNumber];
		const chatdb = global.db.data.chats[m.chat];
		try
		{
			let isNumber = (x) => typeof x === 'number' && !isNaN(x);
			// Pastikan global.db diinisialisasi
			if (!global.db)
			{
				global.db = {
					data:
					{
						users:
						{},
						chats:
						{},
						settings:
						{}
					}
				};
			}
			if (!global.db.data)
			{
				global.db.data = {
					users:
					{},
					chats:
					{},
					settings:
					{}
				};
			}
			if (!global.db.data.users) global.db.data.users = {};
			if (!global.db.data.chats) global.db.data.chats = {};
			if (!global.db.data.settings) global.db.data.settings = {};
			// Pastikan user data diinisialisasi
			let user = global.db.data.users[m.sender];
			if (!user || typeof user !== 'object')
			{
			}
			// Pastikan chat data diinisialisasi
			let chats = global.db.data.chats[m.chat];
			if (!chats || typeof chats !== 'object')
			{
				global.db.data.chats[m.chat] = {
					isBanned: false,
					antispam: false
				};
			}
			else
			{
				if (!('isBanned' in chats)) chats.isBanned = false;
				if (!('antispam' in chats)) chats.antispam = false;
				if (!('antilink' in chats)) chats.antilink = false;
    			if (!('antilinkgc' in chats)) chats.antilinkgc = false;
			}
			// Pastikan settings diinisialisasi
			let setting = global.db.data.settings[botNumber];
			if (!setting || typeof setting !== 'object')
			{
				global.db.data.settings[botNumber] = {
					autoread: false
				};
			}
			else
			{
				if (!('autoread' in setting)) setting.autoread = false;
			}
		}
		catch (err)
		{
			console.error('❌ Error:', err.message);
		}
		if (global.db.data.settings[botNumber].autoread)
		{
			shoNhe.readMessages([m.key]);
		}
        if (db.data.chats[m.chat].antilinkgc) {
			if (budy.match(`chat.whatsapp.com`)) {
				if (isAdmins) return
				if (m.key.fromMe) return
				if (isCreator) return

				await shoNhe.sendMessage(m.chat, {
					delete: {
						remoteJid: m.chat,
						fromMe: false,
						id: m.key.id,
						participant: m.key.participant
					}
				});
			}
		}

		if (db.data.chats[m.chat].antilink) {
			const linkPatterns = [
				/http/i,
				/https/i,
				/www\./i,
				/wa\.me/i,
				/t\.me/i,
				/bit\.ly/i,
				/goo\.gl/i,
				/y2u\.be/i,
				/discord\.gg/i,
				/telegram\.me/i
			];
			const containsLink = linkPatterns.some(pattern => pattern.test(budy));
			if (containsLink) {
				if (isAdmins || m.key.fromMe || isShoNheOwn) return
				await shoNhe.sendMessage(m.chat, {
					delete: {
						remoteJid: m.chat,
						fromMe: false,
						id: m.key.id,
						participant: m.key.participant
					}
				});
			}
		}
		function findRiwayat(idtrx)
		{
			// Baca file riwayat.json
			const riwayatPath = './database/riwayat.json';
			const riwayat = JSON.parse(fs.readFileSync(riwayatPath));
			// Cari transaksi dengan ID TRX yang cocok dan status "pending"
			const transaction = Object.values(riwayat).find(t => t.idtrx === idtrx && t.status === "pending");
			return transaction;
		}
		const idkcl = (length) =>
		{
			let result = '';
			const characters = 'abcdefghijklmnopqrstuvwxyz';
			const charactersLength = characters.length;
			for (let i = 0; i < length; i++)
			{
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return result
		}
		const idgede = (length) =>
		{
			let result = '';
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			const charactersLength = characters.length;
			for (let i = 0; i < length; i++)
			{
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return result
		}
		const idnum = (length) =>
		{
			let result = '';
			const characters = '1234567890';
			const charactersLength = characters.length;
			for (let i = 0; i < length; i++)
			{
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return result
		}
		const thum = fs.readFileSync("./storage/image.png")
		const thumb = fs.readFileSync("./storage/image.png")
		const imqris = fs.readFileSync('./storage/qris.png')

		function toRupiah(angka)
		{
			var saldo = "";
			var angkarev = angka.toString().split("").reverse().join("");
			for (var i = 0; i < angkarev.length; i++)
				if (i % 3 == 0) saldo += angkarev.substr(i, 3) + ".";
			return ("" + saldo.split("", saldo.length - 1).reverse().join(""));
		}
		let member = JSON.parse(fs.readFileSync("./database/user.json"));
		const cek = (satu, dua) =>
		{
			let store = false;
			Object.keys(member).forEach((i) =>
			{
				if (member[i].id == dua)
				{
					store = i;
				}
			});
			if (store !== false)
			{
				if (satu == "id")
				{
					return member[store].id;
				}
				if (satu == "saldo")
				{
					return member[store].saldo;
				}
				if (satu == "transaksi")
				{
					return member[store].transaksi;
				}
				if (satu == "idproduk")
				{
					return member[store].idproduk;
				}
				if (satu == "idtujuan")
				{
					return member[store].idtujuan;
				}
				if (satu == "nama")
				{
					return member[store].nama;
				}
				if (satu == "harga")
				{
					return member[store].harga;
				}
				if (satu == "seri")
				{
					return member[store].seri;
				}
			}
			if (store == false)
			{
				return null;
			}
		};
		let sett = (satu, dua, tiga) =>
		{
			Object.keys(member).forEach((i) =>
			{
				if (member[i].id == dua)
				{
					if (satu == "+saldo")
					{
						member[i].saldo += tiga;
						fs.writeFileSync("./database/user.json", JSON.stringify(member));
					}
					if (satu == "-saldo")
					{
						member[i].saldo -= tiga;
						if (satu == "±seri")
						{
							db_user[i].seri = tiga;
							fs.writeFileSync("./database/user.json", JSON.stringify(member));
						}
						fs.writeFileSync("./database/user.json", JSON.stringify(member));
					}
					if (satu == "transaksi")
					{
						member[i].transaksi = tiga;
						fs.writeFileSync("./database/user.json", JSON.stringify(member));
					}
					if (satu == "idproduk")
					{
						member[i].idproduk = tiga;
						fs.writeFileSync("./database/user.json", JSON.stringify(member));
					}
					if (satu == "idtujuan")
					{
						member[i].idtujuan = tiga;
						fs.writeFileSync("./database/user.json", JSON.stringify(member));
					}
					if (satu == "nama")
					{
						member[i].nama = tiga;
						fs.writeFileSync("./database/user.json", JSON.stringify(member));
					}
					if (satu == "+harga")
					{
						member[i].harga += tiga;
						fs.writeFileSync("./database/user.json", JSON.stringify(member));
					}
					if (satu == "harga")
					{
						member[i].harga = tiga;
						fs.writeFileSync("./database/user.json", JSON.stringify(member));
					}
				}
			});
		};
		const saldo = toRupiah(`${cek("saldo", m.sender)}`);
		//
		if (db.data.chats[m.chat].antispam)
		{
			if (m.isGroup && m.message && isFiltered(m.chat))
			{
				console.log(`[SPAM]`, color(moment(m.messageTimestamp * 100).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'de', color(m.pushName));
				return await shoNhe.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
			}
		}
		if (m.message)
		{
			console.log(chalk.black.bgCyan(' [ NOTIF ] '), // Teks singkat dengan simbol kilat
				chalk.black.bgYellow(` ⏰ ${new Date().toLocaleTimeString()} `), // Simbol jam dan waktu
				chalk.white.bgMagenta(` 💬 ${budy || m.mtype} `), // Simbol pesan
				'\n' + chalk.green('👤 De: '), chalk.blue(pushname), // Nama pengirim dengan simbol orang
				chalk.redBright(`📧 ${m.sender}`), // ID pengirim dengan simbol email
				'\n' + chalk.green('📍 Chat: '), chalk.yellow(m.isGroup ? '👥 Grupo' : '🔒 Privado') // Grup dengan simbol grup, privat dengan simbol gembok
			);
		}

		function delay(ms)
		{
			return new Promise(resolve => setTimeout(resolve, ms));
		}
		async function loading()
		{
			const lod = ["█▒▒▒▒▒▒▒▒▒▒▒ 10%", "███▒▒▒▒▒▒▒▒▒ 30%", "██████▒▒▒▒▒▒ 50%", "████████▒▒▒▒ 80%", "███████████ 100%"];
const {
    key
} = await shoNhe.sendMessage(m.chat, {
    text: '⚠️ *INICIALIZANDO EL SISTEMA...* POR FAVOR ESPERE...'
});

for (let i = 0; i < lod.length; i++) {
    await shoNhe.sendMessage(m.chat, {
        text: `🖥️ *ACTUALIZACIÓN DE ESTADO*:\n\n⏳ *CARGANDO...* ${lod[i]}\n\n*Procesando el sistema... Por favor, tenga paciencia. Esto puede tardar unos momentos.*`
    });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading delay
}

await shoNhe.sendMessage(m.chat, {
    text: '✅ *INICIALIZACIÓN DEL SISTEMA COMPLETADA.*\n\n*Bienvenido a la red.*'
});
			for (let i = 0; i < lod.length; i++)
			{
				await shoNhe.sendMessage(m.chat,
				{
					text: lod[i],
					edit: key
				});
			}
		}
		// Lokasi folder untuk menyimpan thumbnail versi 3
		const thumbFolder3 = './src/thum3/';
		// Lokasi default thumbnail untuk versi 3
		const defaultThumbnailPath3 = './src/thum3/shoNhe.jpg';
		// Membuat folder jika belum ada
		if (!fs.existsSync(thumbFolder3))
		{
			fs.mkdirSync(thumbFolder3,
			{
				recursive: true
			});
		}
		// Pastikan default thumbnail ada
		if (!fs.existsSync(defaultThumbnailPath3))
		{
			const defaultImage3 = Buffer.from('Default Thumbnail Version 3');
			fs.writeFileSync(defaultThumbnailPath3, defaultImage3);
		}
		// **Fungsi: Membaca semua thumbnail di folder**
		const readThumbList3 = () =>
		{
			const files3 = fs.readdirSync(thumbFolder3).filter(file => file.toLowerCase().endsWith('.jpg'));
			return files3.map(file => (
			{
				name: path.parse(file).name, // Nama file tanpa ekstensi
				path: path.join(thumbFolder3, file), // Lokasi file lengkap
			}));
		};
		// **Fungsi: Menambahkan thumbnail**
		const addThumb3 = async (nama3, quoted3, mime3) =>
		{
			if (!/image/.test(mime3)) return 'Kirim/Reply Image dengan Caption untuk menambahkan thumbnail.';
			const fileName3 = `${thumbFolder3}${nama3}.jpg`;
			if (fs.existsSync(fileName3)) return 'Thumbnail dengan nama tersebut sudah ada.';
			const media3 = await quoted3.download(); // Unduh file media dari pesan
			fs.writeFileSync(fileName3, media3);
			return `Thumbnail dengan nama "${nama3}" berhasil ditambahkan.`;
		};
		// **Fungsi: Menghapus thumbnail**
		const delThumb3 = (nama3) =>
		{
			const fileName3 = `${thumbFolder3}${nama3}.jpg`;
			if (!fs.existsSync(fileName3)) return 'Thumbnail dengan nama tersebut tidak ditemukan.';
			fs.unlinkSync(fileName3);
			return `Thumbnail dengan nama "${nama3}" berhasil dihapus.`;
		};
		// **Fungsi: Menampilkan daftar thumbnail**
		const listThumb3 = () =>
		{
			const thumbList3 = readThumbList3();
			if (thumbList3.length === 0) return 'Tidak ada thumbnail yang tersimpan.';
			return thumbList3.map(thumb => `Nama: ${thumb.name}`).join('\n');
		};
		// **Fungsi: Mengambil thumbnail secara acak**
		const getRandomThumb3 = () =>
		{
			const thumbList3 = readThumbList3();
			if (thumbList3.length === 0)
			{
				// Jika folder kosong, gunakan default thumbnail
				console.log('Tidak ada thumbnail, menggunakan default');
				return fs.readFileSync(defaultThumbnailPath3);
			}
			const randomFile3 = thumbList3[Math.floor(Math.random() * thumbList3.length)];
			console.log(`Memilih thumbnail acak: ${randomFile3.name}`);
			return fs.readFileSync(randomFile3.path); // Return Buffer thumbnail
		};
		async function sendRegister(shoNhe, m, prefix, namabot)
		{
			await shoNhe.sendMessage(m.chat,
			{
				image: getRandomThumb3(),
				caption: mess.regis,
				footer: namabot,
				buttons: [
				{
					buttonId: `${prefix}register`,
					buttonText:
					{
						displayText: "REGISTRO"
					}
				}],
				viewOnce: true
			},
			{
				quoted: m
			});
		}
		//==================[ FUNCTION FITUR ]=====================\\
		const ftoko = {
			key:
			{
				fromMe: false,
				participant: `18002428478@s.whatsapp.net`,
				...(m.chat ?
				{
					remoteJid: "status@broadcast"
				} :
				{}),
			},
			message:
			{
				productMessage:
				{
					product:
					{
						title: `Hola👋🏻.\nBOT BY\nTechFix's`,
						description: `${m.pushName ? m.pushName : 'Amigo de TechFix'} order`,
						currencyCode: "IDR",
						priceAmount1000: "1000000000000",
						retailerId: `shoNheNotStore`,
						productImageCount: 1,
					},
					businessOwnerJid: `18002428478@s.whatsapp.net`,
				},
			},
		};
		const script = {
			key:
			{
				fromMe: false,
				participant: `6287862997267@s.whatsapp.net`,
				...(m.chat ?
				{
					remoteJid: "status@broadcast"
				} :
				{}),
			},
			message:
			{
				productMessage:
				{
					product:
					{
						title: `Hola ${m.pushName ? m.pushName : 'Amigo de TechFix'} 👋🏻, COMPRAR SI`,
						description: `${m.pushName ? m.pushName : 'Amigo de TechFix'} order`,
						currencyCode: "IDR",
						priceAmount1000: "10000000",
						retailerId: `shoNheID`,
						productImageCount: 1,
					},
					businessOwnerJid: `18002428478@s.whatsapp.net`,
				},
			},
		};
		const sound = {
			key:
			{
				fromMe: false,
				participant: `18002428478@s.whatsapp.net`,
				...(from ?
				{
					remoteJid: "status@broadcast"
				} :
				{})
			},
			"message":
			{
				"audioMessage":
				{
					"url": "https://mmg.whatsapp.net/v/t62.7114-24/56189035_1525713724502608_8940049807532382549_n.enc?ccb=11-4&oh=01_AdR7-4b88Hf2fQrEhEBY89KZL17TYONZdz95n87cdnDuPQ&oe=6489D172&mms3=true",
					"mimetype": "audio/mp4",
					"fileSha256": "oZeGy+La3ZfKAnQ1epm3rbm1IXH8UQy7NrKUK3aQfyo=",
					"fileLength": "1067401",
					"seconds": 9999999999999,
					"ptt": true,
					"mediaKey": "PeyVe3/+2nyDoHIsAfeWPGJlgRt34z1uLcV3Mh7Bmfg=",
					"fileEncSha256": "TLOKOAvB22qIfTNXnTdcmZppZiNY9pcw+BZtExSBkIE=",
					"directPath": "/v/t62.7114-24/56189035_1525713724502608_8940049807532382549_n.enc?ccb=11-4&oh=01_AdR7-4b88Hf2fQrEhEBY89KZL17TYONZdz95n87cdnDuPQ&oe=6489D172",
					"mediaKeyTimestamp": "1684161893"
				}
			}
		}
		try
		{
			ppuser = await shoNhe.profilePictureUrl(m.sender, 'image')
		}
		catch (err)
		{
			ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
		}
		ppnyauser = await getBuffer(ppuser)
		try
		{
			let isNumber = x => typeof x === 'number' && !isNaN(x)
			let limitUser = global.limitawal.free
			let user = global.db.data.users[m.sender]
			if (typeof user !== 'object') global.db.data.users[m.sender] = {}
			if (user)
			{
				if (!isNumber(user.afkTime)) user.afkTime = -1
				if (!('afkReason' in user)) user.afkReason = ''
				if (!isNumber(user.limit)) user.limit = limitUser
			}
			else global.db.data.users[m.sender] = {
				afkTime: -1,
				afkReason: '',
				limit: limitUser,
			}
		}
		catch (err)
		{
			console.log(err)
		}
		// respon list 
		if (m.isGroup && isAlreadyResponList(m.chat, body.toLowerCase(), db_respon_list))
		{
			var get_data_respon = getDataResponList(m.chat, body.toLowerCase(), db_respon_list)
			if (get_data_respon.isImage === false)
			{
				shoNhe.sendMessage(m.chat,
				{
					text: sendResponList(m.chat, body.toLowerCase(), db_respon_list)
				},
				{
					quoted: m
				})
			}
			else
			{
				shoNhe.sendMessage(m.chat,
				{
					image: await getBuffer(get_data_respon.image_url),
					caption: get_data_respon.response
				},
				{
					quoted: m
				})
			}
		}
		const reSize = async (buffer, ukur1, ukur2) =>
		{
			return new Promise(async (resolve, reject) =>
			{
				let jimp = require('jimp')
				var baper = await jimp.read(buffer);
				var ab = await baper.resize(ukur1, ukur2).getBufferAsync(jimp.MIME_JPEG)
				resolve(ab)
			})
		}
		const fkethmb = await reSize(ppuser, 300, 300)
		// function resize
		let jimp = require("jimp")
		const resize = async (image, width, height) =>
		{
			const read = await jimp.read(image);
			const data = await read.resize(width, height).getBufferAsync(jimp.MIME_JPEG);
			return data;
		};
		async function downloadMp4(link)
		{
			try
			{
				console.log('🕒 Memulai proses download MP4...');
				shoNhe.sendMessage(m.chat,
				{
					react:
					{
						text: '⏳',
						key: m.key
					}
				});
				// Fetch data dari API
				let response = await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${link}`);
				let textResponse = await response.text();
				// Validasi apakah respons adalah JSON
				let data;
				try
				{
					data = JSON.parse(textResponse);
				}
				catch (err)
				{
					console.error('❌ Respons bukan JSON:', textResponse);
					m.reply("Se produjo un error en la API. Por favor inténtalo de nuevo más tarde..");
					return;
				}
				console.log('📥 Respons diterima dari API:', data);
				if (data.status)
				{
					console.log('✅ Data valid, mengirim file video...');
					shoNhe.sendMessage(m.chat,
					{
						video:
						{
							url: data.data.dl
						},
						caption: ''
					},
					{
						quoted: m
					});
					console.log('✅ Proses selesai, file video berhasil dikirim.');
				}
				else
				{
					console.log('❌ Gagal mengambil video. URL tidak valid.');
					m.reply("No se pudo grabar el video. Por favor revisa la URL.");
				}
			}
			catch (err)
			{
				console.error('❌ Terjadi kesalahan:', err.message);
				m.reply(`Error: ${err.message}`);
			}
		}
		async function downloadMp3(link)
		{
			try
			{
				console.log('🕒 Memulai proses download MP3...');
				shoNhe.sendMessage(m.chat,
				{
					react:
					{
						text: '⏳',
						key: m.key
					}
				});
				// Panggil API untuk mendapatkan URL file
				let response = await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${link}`);
				let textResponse = await response.text();
				let data;
				try
				{
					data = JSON.parse(textResponse);
				}
				catch (err)
				{
					console.error('❌ Respons bukan JSON:', textResponse);
					m.reply("Se produjo un error en la API. Por favor inténtalo de nuevo más tarde.");
					return;
				}
				console.log('📥 Respons diterima dari API:', data);
				if (data.status && data.data.dl)
				{
					const fileUrl = data.data.dl;
					const fileName = 'audio.mp3';
					const fixedFileName = 'fixed_audio.mp3';
					const filePath = path.join(__dirname, fileName);
					const fixedFilePath = path.join(__dirname, fixedFileName);
					// Unduh file audio
					console.log('⏳ Mengunduh file audio...');
					const writer = fs.createWriteStream(filePath);
					const audioResponse = await axios(
					{
						url: fileUrl,
						method: 'GET',
						responseType: 'stream',
					});
					audioResponse.data.pipe(writer);
					writer.on('finish', () =>
					{
						console.log('✅ File audio berhasil diunduh, memulai proses konversi...');
						// Proses ulang file audio menggunakan ffmpeg
						ffmpeg(filePath).toFormat('mp3') // Konversi ulang ke format MP3
							.on('end', () =>
							{
								console.log('✅ File audio berhasil dikonversi.');
								// Kirim file audio yang telah diperbaiki
								shoNhe.sendMessage(m.chat,
								{
									audio: fs.readFileSync(fixedFilePath),
									mimetype: 'audio/mpeg',
									fileName: 'audio_fixed.mp3', // Nama file baru
								},
								{
									quoted: m
								});
								// Hapus file sementara
								fs.unlinkSync(filePath);
								fs.unlinkSync(fixedFilePath);
								console.log('✅ File audio berhasil dikirim dan file sementara dihapus.');
							}).on('error', (err) =>
							{
								console.error('❌ Gagal mengonversi file audio:', err.message);
								m.reply('No se pudo reprocesar el archivo de audio.');
							}).save(fixedFilePath);
					});
					writer.on('error', (err) =>
					{
						console.error('❌ Gagal mengunduh file audio:', err.message);
						m.reply('No se pudo descargar el archivo de audio.');
					});
				}
				else
				{
					console.log('❌ Gagal mengambil audio. URL tidak valid.');
					m.reply("No se pudo recuperar el audio. Por favor revisa la URL.");
				}
			}
			catch (err)
			{
				console.error('❌ Terjadi kesalahan:', err.message);
				m.reply(`Error: ${err.message}`);
			}
		}
		if (!global.public)
		{
			if (!m.key.fromMe && !isShoNheOwn) return; // Abaikan jika bukan pesan bot atau owner
		}
		// Blokir command di chat pribadi saat Group Only aktif
		if (global.groupOnly && !m.isGroup && !isShoNheOwn) return console.log('⚠️ SOLO GRUPO')
		if (global.privateChatOnly && m.isGroup && !isShoNheOwn) return console.log('⚠️ SOLO CHAT PRIVADO');
		// func db
		// Load user database from JSON file
		function loadUserDatabase()
		{
			let rawdata = fs.readFileSync('database/user.json');
			return JSON.parse(rawdata);
		}
		// Save updated user database back to JSON file
		function saveUserDatabase(database)
		{
			fs.writeFileSync('database/user.json', JSON.stringify(database, null, 2));
		}
		const userFirePath = './database/userFire.json';
		// Fungsi untuk membaca database
		function loadUserFire()
		{
			if (!fs.existsSync(userFirePath))
			{
				fs.writeFileSync(userFirePath, JSON.stringify(
				{}));
			}
			return JSON.parse(fs.readFileSync(userFirePath));
		}
		// Fungsi untuk menyimpan database
		function saveUserFire(db)
		{
			fs.writeFileSync(userFirePath, JSON.stringify(db, null, 2));
		}
function levelUpdate(command, sender) {
    const db = loadUserFire();
    if (!db[sender]) {
        db[sender] = {
            register: false,
            level: 0,
            exp: 0,
            expTarget: 10,
            commandCount: 0,
            balance: 0 // Initial balance
        };
    }
    const user = db[sender];
    if (user.commandCount == null) user.commandCount = 0;
    if (user.exp == null) user.exp = 0;
    if (user.level == null) user.level = 0;
    if (user.expTarget == null) user.expTarget = 10;
    if (user.balance == null) user.balance = 0;

    // Increment commands and exp
    user.commandCount += 1;
    user.exp += 1;

    let levelUpMessage = null;
    if (user.exp >= user.expTarget) {
        user.level += 1; // Level up
        user.expTarget += 20; // Increase target exp

        // Define image URL based on level
        const levelImages = {
            1: "https://i.ibb.co.com/tXMNptr/01.png",
            2: "https://i.ibb.co.com/Gxqbrzg/02.png",
            3: "https://i.ibb.co.com/fVRR1BV/03.png",
            4: "https://i.ibb.co.com/zPy0DcD/04.png",
            5: "https://i.ibb.co.com/0V7msHW/05.png",
            6: "https://i.ibb.co.com/4tNm7BV/06.png",
            7: "https://i.ibb.co.com/6NrT4wb/07.png",
            8: "https://i.ibb.co.com/QYbY3Qb/08.png",
            9: "https://i.ibb.co.com/g7KC6jg/09.png",
            10: "https://i.ibb.co.com/Bndy2xp/10.png",
            default: "https://i.ibb.co.com/CQcbcQP/default.png"
        };

        const levelImage = levelImages[user.level] || levelImages.default;

        levelUpMessage = {
            text: 
`┌────────────────────────────────────┐  
│                         ██░░ ACTUALIZACIÓN DEL SISTEMA ░░██                    │  
└────────────────────────────────────┘

🔓 [ACCESO CONCEDIDO]  
>> Sistema de nivelación de usuarios iniciado...  
>> Cargando perfil de usuario...  
>> Escaneando la integridad de la base de datos.... ✅  

────────────────────────────────────────
🛡️ *NOTIFICACIÓN DE SUBIDA DE NIVEL*  
────────────────────────────────────────
🎉 *¡FELICIDADES, AGENTE!*  
📈 Has subido de rango para:  
   NIVEL: *${user.level - 1} ➡️ ${user.level}*  

────────────────────────────────────────
📊 *INFORME DE BASE DE DATOS DE USUARIOS*  
────────────────────────────────────────
📂 *Nombre*        : *${m.pushName || 'Unknown'}*  
📂 *Número*      : *${sender.split('@')[0]}*  
📂 *Nivel actual*: *${user.level}*  
📂 *Experiencia*  : *${user.exp}/${user.expTarget}*  
📂 *Comandos utilizados*: *${user.commandCount}*  
📂 *Balance*     : *Rp${user.balance}*  
📂 *Rol*        : *${user.role || 'Regular User'}*  

────────────────────────────────────────
⚡ *ACTUALIZACIÓN DE LA MISIÓN*  
────────────────────────────────────────
"Bienvenido a un nuevo nivel, Agente. La red espera.  
Mantén tus habilidades afiladas y nunca dejes de evolucionar."  

────────────────────────────────────────
💻 *ESTADO DEL SISTEMA DE HIPERVÍNCULO*  
────────────────────────────────────────
[🟢] INTENTOS DE RASTREO: BLOQUEADOS  
[🟢] INTEGRIDAD DEL CORTAFUEGOS: 100%  
[🟢] CIFRADO DE DATOS: ACTIVO  
────────────────────────────────────────

>> El sistema cerrará sesión automáticamente en 10 segundos...  
>> CERRAR SESIÓN CANCELADO por solicitud del usuario.  

🔻 *FIN DE LA TRANSMISIÓN* 🔻`,
            image: levelImage
        };
    }

    saveUserFire(db);
    console.log(`📊 Command "${command}" executed by ${sender}`);
    return levelUpMessage;
}
		// Fungsi untuk menambah saldo (hanya bisa dilakukan oleh owner)
		function addBalance(sender, amount, owner)
		{
			const db = loadUserFire();
			if (!owner.includes(senderNumber))
			{
				return mess.owners
			}
			// Cek apakah pengguna terdaftar
			if (!db[sender])
			{
				return mess.regis
			}
			// Tambah saldo pengguna
			db[sender].balance += amount;
			saveUserFire(db);
			return `✅ Saldo de Rp${amount} ha sido añadido a ${sender.split('@')[0]}.\n💰 Saldo actual: Rp${db[sender].balance}`;
		}
		// Fungsi untuk mendaftarkan user
		function registerUser(sender, role = 'user')
		{
			const db = loadUserFire();
			if (!db[sender])
			{
				db[sender] = {
					register: true,
					role: role,
					limit: role === 'owner' ? -1 : role === 'vip' ? 1000 : 100
				};
				saveUserFire(db);
				return `🎉 Te has registrado exitosamente como ${role} con limites ${db[sender].limit}!`;
			}
			else if (!db[sender].register)
			{
				db[sender].register = true;
				saveUserFire(db);
				return `✅ El registro se ha activado con éxito.`;
			}
			else
			{
				return `⚠️ Ya te has registrado antes.`;
			}
		}
		// Fungsi untuk mengecek status user
		function checkUser(sender)
		{
			const db = loadUserFire();
			if (!db[sender])
			{
				return `⚠️ Aún no estás registrado. Por favor regístrese primero.`;
			}
			return `ℹ️ Tu estado:\n- Rol: ${db[sender].role}\n- Límites: ${db[sender].limit}\n- Registro: ${db[sender].register}`;
		}
		// Baca database user fire
		function loadUserFire()
		{
			if (!fs.existsSync(userFirePath))
			{
				fs.writeFileSync(userFirePath, JSON.stringify(
				{}));
			}
			return JSON.parse(fs.readFileSync(userFirePath));
		}
		// Simpan perubahan database user fire
		function saveUserFire(db)
		{
			fs.writeFileSync(userFirePath, JSON.stringify(db, null, 2));
		}

		function claimFire(m)
		{
			const db = loadUserFire();
			const sender = m.sender;
			if (!db[sender] || !db[sender].register)
			{
				sendRegister(shoNhe, m, prefix, namabot);
				return;
			}
			const now = Date.now();
			const cooldown = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik
			const lastClaim = db[sender].lastClaim || 0;
			// Cek cooldown
			if (now - lastClaim < cooldown)
			{
				const remainingTime = cooldown - (now - lastClaim);
				const hours = Math.floor(remainingTime / (60 * 60 * 1000));
				const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
				reply(`⏳ Ya has reclamado. Inténtalo de nuevo dentro ${hours} Hora ${minutes} minuto.`);
				return;
			}
			// Tambahkan limit berdasarkan role
			const reward = db[sender].role === 'vip' ? 50 : 20;
			db[sender].limit += reward;
			db[sender].lastClaim = now;
			saveUserFire(db);
			reply(`🎉 ¡Has reclamado con éxito tu límite diario!\n🔥 obtienes: ${reward}\n🔥 Tu límite total: ${db[sender].limit}`);
		}

		function getFireThumbnail(limit)
		{
			const thumbnails = {
				1000: './src/role/vipRole.jpg', // VIP/Premium
				100: './src/role/100Role.jpg',
				80: './src/role/80Role.jpg',
				60: './src/role/60Role.jpg',
				40: './src/role/40Role.jpg',
				20: './src/role/20Role.jpg',
				10: './src/role/10Role.jpg',
				0: './src/role/0Role.jpg', // Untuk limit habis
				'-1': './src/role/ownerRole.jpg' // Thumbnail khusus Owner
			};
			// Thumbnail default jika file tidak ditemukan
			const defaultThumbnail = './src/role/0Role.jpg';
			// Tentukan rentang berdasarkan nilai limit
			let selectedThumbnail = defaultThumbnail;
			if (limit === -1)
			{
				selectedThumbnail = thumbnails['-1']; // Owner
			}
			else if (limit > 1000)
			{
				selectedThumbnail = thumbnails[1000]; // VIP
			}
			else if (limit >= 101 && limit <= 1000)
			{
				selectedThumbnail = thumbnails[1000]; // Rentang VIP
			}
			else if (limit >= 81 && limit <= 100)
			{
				selectedThumbnail = thumbnails[100]; // Rentang 100
			}
			else if (limit >= 61 && limit <= 80)
			{
				selectedThumbnail = thumbnails[80]; // Rentang 80
			}
			else if (limit >= 41 && limit <= 60)
			{
				selectedThumbnail = thumbnails[60]; // Rentang 60
			}
			else if (limit >= 21 && limit <= 40)
			{
				selectedThumbnail = thumbnails[40]; // Rentang 40
			}
			else if (limit >= 11 && limit <= 20)
			{
				selectedThumbnail = thumbnails[20]; // Rentang 20
			}
			else if (limit >= 1 && limit <= 10)
			{
				selectedThumbnail = thumbnails[10]; // Rentang 10
			}
			else if (limit === 0)
			{
				selectedThumbnail = thumbnails[0]; // Limit habis
			}
			// Periksa apakah file thumbnail ada
			if (fs.existsSync(selectedThumbnail))
			{
				return fs.readFileSync(selectedThumbnail);
			}
			else
			{
				console.error(`File thumbnail tidak ditemukan: ${selectedThumbnail}, menggunakan default.`);
				return fs.readFileSync(defaultThumbnail);
			}
		}

		function firely(m, teks)
		{
			const db = loadUserFire();
			const sender = m.sender;
			// Cek apakah user sudah terdaftar
			if (!db[sender] || !db[sender].register)
			{
				sendRegister(shoNhe, m, prefix, namabot);
				return false;
			}
			// Dapatkan limit user berdasarkan role
			const userLimit = db[sender].limit;
			const reduction = db[sender].role === 'owner' ? 0 : 5; // Owner tidak ada pengurangan limit
			// Cek limit sebelum melanjutkan
			if (userLimit <= 0 && db[sender].role !== 'owner')
			{
				reply('🔥 Tu límite se ha agotado. Por favor reclama el límite o aumenta tu rol.');
				return false;
			}
			// Kurangi limit jika bukan owner
			if (db[sender].role !== 'owner')
			{
				db[sender].limit -= reduction;
				saveUserFire(db);
			}
			// Kirim pesan firely
			const thumbnail = getFireThumbnail(userLimit); // Mendapatkan thumbnail sesuai limit
			shoNhe.sendMessage(m.chat,
			{
				text: teks + `\n🔥 Límite restante: ${db[sender].limit}`,
				contextInfo:
				{
					externalAdReply:
					{
						title: `🔥 Límite de fuego`,
						body: `🔥 te restan ${reduction} límite.`,
						previewType: "PHOTO",
						thumbnail: thumbnail,
						sourceUrl: 'https://wa.me/573012686632'
					}
				}
			},
			{
				quoted: m
			});
			return true;
		}
		const firelos = (m, teks) =>
		{
			const db = loadUserFire();
			const sender = m.sender;
			const userLimit = db[sender]?.limit || 0; // Default 0 jika user tidak ada
			const thumbnailUrl = getFireThumbnail(userLimit);
			shoNhe.sendMessage(m.chat,
			{
				text: teks + `\n🔥 No te queda límite.`,
				contextInfo:
				{
					externalAdReply:
					{
						title: `🔥 Límite de fuego`,
						body: `🔥 Tus límites de fuego: ${userLimit}`,
						previewType: "PHOTO",
						thumbnail: thumbnailUrl,
						sourceUrl: `https://whatsapp.com/channel/0029Vb0v3F71yT264EejzJ3e`
					}
				}
			},
			{
				quoted: m
			});
		};

		function isRegistered(m)
		{
			const db = loadUserFire(); // Load database
			const sender = m.sender; // ID pengirim
			return db[sender]?.register || false; // Return true jika terdaftar, false jika tidak
		}
		const thumbFolder2 = './src/thum2/'; // Lokasi folder untuk menyimpan thumbnail
		const defaultThumbnailPath2 = './src/thum2/shoNhe.jpg'; // Lokasi thumbnail default (file lokal)
		// Membuat folder jika belum ada
		if (!fs.existsSync(thumbFolder2))
		{
			fs.mkdirSync(thumbFolder2,
			{
				recursive: true
			});
		}
		// Pastikan default thumbnail ada
		if (!fs.existsSync(defaultThumbnailPath2))
		{
			// Jika tidak ada default, Anda bisa menambahkan file default manual atau secara otomatis.
			const defaultImage2 = Buffer.from('Default Thumbnail'); // Placeholder default thumbnail
			fs.writeFileSync(defaultThumbnailPath2, defaultImage2);
		}
		// **Fungsi: Membaca semua thumbnail di folder**
		const readThumbList2 = () =>
		{
			const files2 = fs.readdirSync(thumbFolder2).filter(file => file.endsWith('.jpg'));
			return files2.map(file => (
			{
				name: path.parse(file).name, // Nama file tanpa ekstensi
				path: path.join(thumbFolder2, file), // Lokasi file lengkap
			}));
		};
		// **Fungsi: Menambahkan thumbnail**
		const addThumb2 = async (nama2, quoted2, mime2) =>
		{
			if (!/image/.test(mime2)) return 'Kirim/Reply Image dengan Caption untuk menambahkan thumbnail.';
			const fileName2 = `${thumbFolder2}${nama2}.jpg`;
			if (fs.existsSync(fileName2)) return 'Thumbnail dengan nama tersebut sudah ada.';
			const media2 = await quoted2.download(); // Unduh file media dari pesan
			fs.writeFileSync(fileName2, media2);
			return `Thumbnail dengan nama "${nama2}" berhasil ditambahkan.`;
		};
		// **Fungsi: Menghapus thumbnail**
		const delThumb2 = (nama2) =>
		{
			const fileName2 = `${thumbFolder2}${nama2}.jpg`;
			if (!fs.existsSync(fileName2)) return 'Thumbnail dengan nama tersebut tidak ditemukan.';
			fs.unlinkSync(fileName2);
			return `Thumbnail dengan nama "${nama2}" berhasil dihapus.`;
		};
		// **Fungsi: Menampilkan daftar thumbnail**
		const listThumb2 = () =>
		{
			const thumbList2 = readThumbList2();
			if (thumbList2.length === 0) return 'Tidak ada thumbnail yang tersimpan.';
			return thumbList2.map(thumb => `Nama: ${thumb.name}`).join('\n');
		};
		// **Fungsi: Mengambil thumbnail secara acak**
		const getRandomThumb2 = () =>
		{
			const thumbList2 = readThumbList2();
			if (thumbList2.length === 0)
			{
				// Jika folder kosong, gunakan default thumbnail
				return fs.readFileSync(defaultThumbnailPath2);
			}
			const randomFile2 = thumbList2[Math.floor(Math.random() * thumbList2.length)];
			return fs.readFileSync(randomFile2.path); // Return Buffer thumbnail
		};
		//===================[ FUNCTION REPLY ]=====================\\
		const aifake = {
			key:
			{
				participant: '18002428478@s.whatsapp.net',
				...(m.chat ?
				{
					remoteJid: `status@broadcast`
				} :
				{})
			},
			message:
			{
				liveLocationMessage:
				{
					caption: `© Manu"S`,
					jpegThumbnail: ""
				}
			},
		}
		const shoNhemand = body.replace(prefix, '').trim().split(/ +/).shift().toUpperCase();
		// Array emoji alam dan hewan yang baru
		const emojis = ['⚡', '🌪️', '🌊', '🫧', '💧', '🪵', '🍄', '☘️', '🍃', '🪷', '💫', '✨', '🌟', '🔥', '🪨', '🪽', '⚓', '💎', '🚀', '🛸', '✈️', '🥕', '🍓', '🐙', '🦑', '🦞', '🐣', '🐓', '🐍', '🐊', '🐉', '🐱', '🌻', '🐦‍🔥', '🐬', '🍏', '⚽', '🪀', '🔮', '🧸', '🦉', '🐾', '🦪', '🎠', '🏕️'];
		// Memilih emoji secara acak
		const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
		// Membuat teks dengan format yang diinginkan
		const formattedshoNhemand = `${randomEmoji} ${shoNhemand}`;
		// Menyiapkan objek message untuk digunakan
		const hw = {
			key:
			{
				participant: '0@s.whatsapp.net',
				...(m.chat ?
				{
					remoteJid: `status@broadcast`
				} :
				{})
			},
			message:
			{
				liveLocationMessage:
				{
					caption: `${formattedshoNhemand}`,
					jpegThumbnail: ""
				}
			},
			quoted: sound
		}
		const jq = {
			key:
			{
				participant: '18002428478@s.whatsapp.net',
				...(m.chat ?
				{
					remoteJid: `status@broadcast`
				} :
				{})
			},
			message:
			{
				liveLocationMessage:
				{
					caption: `Utilice siempre Termux⚡`,
					jpegThumbnail: ""
				}
			},
			quoted: sound
		}
		// Pastikan autotyping atau autovn aktif berdasarkan pesan yang sedang diketik
		if (botSettings.autotyping && shoNhe.public)
		{
			await shoNhe.sendPresenceUpdate('composing', m.chat);
		}
		if (botSettings.autovn && shoNhe.public)
		{
			await shoNhe.sendPresenceUpdate('recording', m.chat);
		}
		// Lokasi file JSON di folder 'database'
		const thumbListFilePath = path.join(__dirname, 'database', 'thumbList.json');
		// Fungsi untuk membaca data thumbnail dari file JSON
		const readThumbList = () =>
		{
			if (!fs.existsSync(thumbListFilePath))
			{
				// Jika file tidak ada, buat file baru dengan array kosong
				fs.writeFileSync(thumbListFilePath, JSON.stringify([]));
				return [];
			}
			const data = fs.readFileSync(thumbListFilePath, 'utf-8');
			return JSON.parse(data);
		};
		// Fungsi untuk menulis data thumbnail ke file JSON
		const writeThumbList = (thumbList) =>
		{
			fs.writeFileSync(thumbListFilePath, JSON.stringify(thumbList, null, 2));
		};
		// Fungsi untuk menambahkan thumbnail
		const addthumb = (nama, url) =>
		{
			const thumbList = readThumbList();
			// Cek apakah nama sudah ada
			if (thumbList.find(thumb => thumb.name === nama))
			{
				return 'Thumbnail dengan nama tersebut sudah ada.';
			}
			// Menambahkan thumbnail ke dalam daftar
			thumbList.push(
			{
				name: nama,
				url: url
			});
			writeThumbList(thumbList);
			return `Thumbnail dengan nama ${nama} berhasil ditambahkan.`;
		};
		// Fungsi untuk menghapus thumbnail berdasarkan nama
		const delthumb = (nama) =>
		{
			const thumbList = readThumbList();
			const index = thumbList.findIndex(thumb => thumb.name === nama);
			if (index === -1)
			{
				return 'Thumbnail dengan nama tersebut tidak ditemukan.';
			}
			thumbList.splice(index, 1);
			writeThumbList(thumbList);
			return `Thumbnail dengan nama ${nama} berhasil dihapus.`;
		};
		// Fungsi untuk menampilkan daftar thumbnail
		const listthumb = () =>
		{
			const thumbList = readThumbList();
			if (thumbList.length === 0)
			{
				return 'Tidak ada thumbnail yang tersimpan.';
			}
			return thumbList.map(thumb => `Nama: ${thumb.name}, URL: ${thumb.url}`).join('\n');
		};
		// Fungsi untuk memilih thumbnail secara random dari daftar
		const getRandomThumb = () =>
		{
			const thumbList = readThumbList();
			return thumbList[Math.floor(Math.random() * thumbList.length)]?.url || 'https://i.ibb.co.com/x6cRFN1/6cbaad220c211d8399577906a2f30856.jpg';
		};
		const reply = (teks) =>
		{
			shoNhe.sendMessage(from,
			{
				text: teks,
				contextInfo:
				{
					mentionedJid: [m.sender],
					"externalAdReply":
					{
						"title": `TechFix BY MANUDIA'Z`,
						"body": `© TechFix'S`,
						"previewType": "PHOTO",
						"thumbnail": getRandomThumb2(),
						"sourceUrl": gh
					}
				}
			},
			{
				quoted: hw
			})
		}
		const reply2 = (teks) =>
		{
			shoNhe.sendMessage(from,
			{
				text: teks
			},
			{
				quoted: m
			})
		}
		//Fake quoted 
		const fpay = {
			key:
			{
				remoteJid: '0@s.whatsapp.net',
				fromMe: false,
				id: global.namabot,
				participant: '0@s.whatsapp.net'
			},
			message:
			{
				requestPaymentMessage:
				{
					currencyCodeIso4217: "USD",
					amount1000: 999999999,
					requestFrom: '0@s.whatsapp.net',
					noteMessage:
					{
						extendedTextMessage:
						{
							text: global.namabot
						}
					},
					expiryTimestamp: 999999999,
					amount:
					{
						value: 91929291929,
						offset: 1000,
						currencyCode: "USD"
					}
				}
			}
		}
		const ftroli = {
			key:
			{
				fromMe: false,
				"participant": "0@s.whatsapp.net",
				"remoteJid": "status@broadcast"
			},
			"message":
			{
				orderMessage:
				{
					itemCount: 1986,
					status: 200,
					thumbnail: getRandomThumb2(),
					surface: 200,
					message: "Rp 2.000",
					orderTitle: namaowner,
					sellerJid: '0@s.whatsapp.net'
				}
			},
			contextInfo:
			{
				"forwardingScore": 999,
				"isForwarded": true
			},
			sendEphemeral: true
		}
		const fdoc = {
			key:
			{
				participant: '0@s.whatsapp.net',
				...(m.chat ?
				{
					remoteJid: `status@broadcast`
				} :
				{})
			},
			message:
			{
				documentMessage:
				{
					title: namabot,
					jpegThumbnail: getRandomThumb2()
				}
			}
		}
		const fvn = {
			key:
			{
				participant: `0@s.whatsapp.net`,
				...(m.chat ?
				{
					remoteJid: "status@broadcast"
				} :
				{})
			},
			message:
			{
				"audioMessage":
				{
					"mimetype": "audio/ogg; codecs=opus",
					"seconds": 0,
					"ptt": "true"
				}
			}
		}
		const fgif = {
			key:
			{
				participant: `0@s.whatsapp.net`,
				...(m.chat ?
				{
					remoteJid: "status@broadcast"
				} :
				{})
			},
			message:
			{
				"videoMessage":
				{
					"title": namabot,
					"h": packname,
					'seconds': '359996400',
					'gifPlayback': 'true',
					'caption': namaowner,
					'jpegThumbnail': getRandomThumb2()
				}
			}
		}
		const fgclink = {
			key:
			{
				participant: "0@s.whatsapp.net",
				"remoteJid": "0@s.whatsapp.net"
			},
			"message":
			{
				"groupInviteMessage":
				{
					"groupJid": "6288213840883-1616169743@g.us",
					"inviteCode": "m",
					"groupName": packname,
					"caption": `${m.pushName ? m.pushName : 'Temen shoNhe'}`,
					'jpegThumbnail': getRandomThumb2()
				}
			}
		}
		const fvideo = {
			key:
			{
				fromMe: false,
				participant: `0@s.whatsapp.net`,
				...(m.chat ?
				{
					remoteJid: "status@broadcast"
				} :
				{})
			},
			message:
			{
				"videoMessage":
				{
					"title": namabot,
					"h": packname,
					'seconds': '0',
					'caption': `${m.pushName ? m.pushName : 'Temen shoNhe'}`,
					'jpegThumbnail': getRandomThumb2()
				}
			}
		}
		const floc = {
			key:
			{
				participant: '0@s.whatsapp.net',
				...(m.chat ?
				{
					remoteJid: `status@broadcast`
				} :
				{})
			},
			message:
			{
				locationMessage:
				{
					name: packname,
					jpegThumbnail: getRandomThumb2()
				}
			}
		}
		const fkontak = {
			key:
			{
				participant: `0@s.whatsapp.net`,
				...(m.chat ?
				{
					remoteJid: `status@broadcast`
				} :
				{})
			},
			message:
			{
				'contactMessage':
				{
					'displayName': namaowner,
					'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${namaowner},;;;\nFN:${namaowner}\nitem1.TEL;waid=573012686632:573012686632\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
					'jpegThumbnail': getRandomThumb2(),
					thumbnail: getRandomThumb2(),
					sendEphemeral: true
				}
			}
		}
		const fakestatus = {
			key:
			{
				fromMe: false,
				participant: `0@s.whatsapp.net`,
				...(m.chat ?
				{
					remoteJid: "status@broadcast"
				} :
				{})
			},
			message:
			{
				"imageMessage":
				{
					"url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc",
					"mimetype": "image/jpeg",
					"caption": packname,
					"fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=",
					"fileLength": "28777",
					"height": 1080,
					"width": 1079,
					"mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=",
					"fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=",
					"directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69",
					"mediaKeyTimestamp": "1610993486",
					"jpegThumbnail": fs.readFileSync('./ShoNheMedia/image/owner.jpg'),
					"scansSidecar": "1W0XhfaAcDwc7xh1R8lca6Qg/1bB4naFCSngM2LKO2NoP5RI7K+zLw=="
				}
			}
		}
		const frpayment = {
			key:
			{
				remoteJid: '0@s.whatsapp.net',
				fromMe: false,
				id: `${namaowner}`,
				participant: '0@s.whatsapp.net'
			},
			message:
			{
				requestPaymentMessage:
				{
					currencyCodeIso4217: "USD",
					amount1000: 999999999,
					requestFrom: '0@s.whatsapp.net',
					noteMessage:
					{
						extendedTextMessage:
						{
							text: `${namabot}`
						}
					},
					expiryTimestamp: 999999999,
					amount:
					{
						value: 91929291929,
						offset: 1000,
						currencyCode: "INR"
					}
				}
			}
		}

		function capitalizeWords(str)
		{
			return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
		}
		if (m.isGroup)
		{
			// Pastikan liststore ada di dalam database
			let listStore = {};
			if (fs.existsSync(listStorePath))
			{
				listStore = JSON.parse(fs.readFileSync(listStorePath, 'utf8'));
			}
			// Cek apakah 'body' ada di liststore grup ini
			if (listStore[m.chat] && listStore[m.chat][body])
			{
				const entry = listStore[m.chat][body]; // Mendapatkan entry untuk key 'body'
				let teks = entry.response; // Response yang dikirim
				// Mengecek jika ada gambar
				if (entry.img)
				{
					shoNhe.sendMessage(m.chat,
					{
						image:
						{
							url: entry.img // Mengirim gambar dari URL
						},
						caption: teks // Menambahkan teks sebagai caption
					},
					{
						quoted: m // Menambahkan quoted message jika ada
					});
					// Mengecek jika ada video
				}
				else if (entry.video)
				{
					shoNhe.sendMessage(m.chat,
					{
						video:
						{
							url: entry.video // Mengirim video dari URL
						},
						caption: teks // Menambahkan teks sebagai caption
					},
					{
						quoted: m // Menambahkan quoted message jika ada
					});
					// Jika tidak ada gambar atau video, kirim teks biasa
				}
				else
				{
					const contentText = {
						text: teks,
						contextInfo:
						{
							mentionedJid: [m.sender], // Menyebutkan pengirim
							forwardingScore: 999999,
							isForwarded: true,
							forwardedNewsletterMessageInfo:
							{
								newsletterName: namach, // Nama saluran
								newsletterJid: idsaluran, // Jid saluran
							},
							externalAdReply:
							{
								showAdAttribution: true,
								containsAutoReply: true,
								title: `Store List 🛍️`,
								body: namabot, // Nama bot
								previewType: "PHOTO",
								thumbnailUrl: `https://pomf2.lain.la/f/sdzl7dc2.jpg`, // Gambar thumbnail
								sourceUrl: wagc // URL untuk sumber (misalnya link grup atau toko)
							}
						}
					};
					shoNhe.sendMessage(m.chat, contentText,
					{
						quoted: m, // Menyertakan quoted message
					});
				}
			}
		}
		async function shoNherly(teks)
		{
			if (typereply === 's1')
			{
				m.reply(teks);
			}
			else if (typereply === 's2')
			{
				shoNhe.sendMessage(m.chat,
				{
					contextInfo:
					{
						externalAdReply:
						{
							showAdAttribution: true,
							title: namabot,
							body: namaowner,
							previewType: "PHOTO",
							thumbnail: getRandomThumb2(),
							sourceUrl: wagc
						}
					},
					text: teks
				},
				{
					quoted: hw
				});
			}
			else if (typereply === 's3')
			{
				shoNhe.sendMessage(m.chat,
				{
					text: teks,
					contextInfo:
					{
						externalAdReply:
						{
							showAdAttribution: true,
							title: namabot,
							body: namaowner,
							thumbnail: getRandomThumb3(),
							sourceUrl: gh,
							mediaType: 1,
							renderLargerThumbnail: true
						}
					}
				},
				{
					quoted: hw
				});
			}
			else if (typereply === 's4')
			{
				shoNherlyy(teks);
			}
			else if (typereply === 's5')
			{
				shoNhe.sendMessage(from,
				{
					text: teks,
					contextInfo:
					{
						mentionedJid: [m.sender],
						"externalAdReply":
						{
							"title": `BOT BY TechFix'S`,
							"body": `© ManuDia'z`,
							"previewType": "PHOTO",
							"thumbnail": getRandomThumb2(),
							"sourceUrl": gh
						}
					}
				},
				{
					quoted: hw
				})
			}
		}
		async function shoNherlyy(teks)
		{
			const repshoNhe = {
				contextInfo:
				{
					forwardingScore: 1,
					isForwarded: true,
					forwardedNewsletterMessageInfo:
					{
						newsletterName: namabot,
						newsletterJid: idsaluran,
					},
					externalAdReply:
					{
						showAdAttribution: true,
						title: waktuucapan,
						body: namabot,
						thumbnail: getRandomThumb2(),
						sourceUrl: gh
					}
				},
				text: teks
			};
			return shoNhe.sendMessage(m.chat, repshoNhe,
			{
				quoted: hw,
			});
		}
		//==================[ FUNCTION WAKTU ]======================\\
		let d = new Date(new Date() + 3600000);
		let locale = "id";
		let clock = d.toLocaleTimeString(locale,
		{
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		});
		const date = moment().tz("Asia/Jakarta").format("dddd, ll");
		const time = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("HH:mm:ss z");

		function getFormattedDate()
		{
			var currentDate = new Date();
			var day = currentDate.getDate();
			var month = currentDate.getMonth() + 1;
			var year = currentDate.getFullYear();
			var hours = currentDate.getHours();
			var minutes = currentDate.getMinutes();
			var seconds = currentDate.getSeconds();
		}
		const hariini = d.toLocaleDateString('id',
		{
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})

		function msToTime(duration)
		{
			var milliseconds = parseInt((duration % 1000) / 100),
				seconds = Math.floor((duration / 1000) % 60),
				minutes = Math.floor((duration / (1000 * 60)) % 60),
				hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
			hours = (hours < 10) ? "0" + hours : hours
			minutes = (minutes < 10) ? "0" + minutes : minutes
			seconds = (seconds < 10) ? "0" + seconds : seconds
			return hours + " jam " + minutes + " menit " + seconds + " detik"
		}

		function msToDate(ms)
		{
			temp = ms
			days = Math.floor(ms / (24 * 60 * 60 * 1000));
			daysms = ms % (24 * 60 * 60 * 1000);
			hours = Math.floor((daysms) / (60 * 60 * 1000));
			hoursms = ms % (60 * 60 * 1000);
			minutes = Math.floor((hoursms) / (60 * 1000));
			minutesms = ms % (60 * 1000);
			sec = Math.floor((minutesms) / (1000));
			return days + " Hari " + hours + " Jam " + minutes + " Menit";
			// +minutes+":"+sec;
		}
		// Sayying time
		const timee = moment().tz('America/Bogota').format('HH:mm:ss')
		if (timee < "23:59:00")
		{
			var waktuucapan = 'Buenas noches 🌃'
		}
		if (timee < "19:00:00")
		{
			var waktuucapan = 'Buenas tardes 🌆'
		}
		if (timee < "18:00:00")
		{
			var waktuucapan = 'Tarde 🌅'
		}
		if (timee < "15:00:00")
		{
			var waktuucapan = 'Buenas tardes 🏙'
		}
		if (timee < "10:00:00")
		{
			var waktuucapan = 'Buenos días 🌄'
		}
		if (timee < "05:00:00")
		{
			var waktuucapan = 'Madrugada 🌉'
		}
		if (timee < "03:00:00")
		{
			var waktuucapan = 'Media noche 🌌'
		}
		const JwbTrue = (tebak, exp, tambahan) =>
		{
			let teks = `*🎮 ${tebak} 🎮*\n\nKiw Kiww Bener 🎉\n+expFire ${exp}` + tambahan
			const context = {
				text: teks,
				contextInfo:
				{
					mentionedJid: [m.sender],
					forwardingScore: 999999,
					isForwarded: true,
					forwardedNewsletterMessageInfo:
					{
						newsletterName: namach,
						newsletterJid: idsaluran,
					},
					externalAdReply:
					{
						title: `Jawaban Benar 🥳`,
						body: tebak,
						previewType: "PHOTO",
						thumbnail: fs.readFileSync("./ShoNheMedia/image/corr.png"),
						sourceUrl: wagc
					}
				}
			};
			return shoNhe.sendMessage(m.chat, context,
			{
				quoted: m,
			});
		}
		const waktuHabis = (jawaban) =>
		{
			let teks = `Kroco, Waktu Abis🥳\n\n*Jawaban:*\n${jawaban}`
			const context = {
				text: teks,
				contextInfo:
				{
					mentionedJid: [m.sender],
					forwardingScore: 999999,
					isForwarded: true,
					forwardedNewsletterMessageInfo:
					{
						newsletterName: namach,
						newsletterJid: idsaluran,
					},
					externalAdReply:
					{
						title: `Waktu Habis ⏰`,
						body: "Dasar Kroco",
						previewType: "PHOTO",
						thumbnailUrl: `https://telegra.ph/file/030ebfc99f9cb5be7e8cb.png`,
						sourceUrl: wagc
					}
				}
			};
			return shoNhe.sendMessage(m.chat, context,
			{
				quoted: m,
			});
		}
		if (tebakgame[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebakgame[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebakgame[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebakgame[m.chat][2]
					JwbTrue("Tebak Game", tebakgame[m.chat][2], `\n\nKirim perintah .tebakgame\nuntuk bermain lagi 🎮`)
					clearTimeout(tebakgame[m.chat][3])
					delete tebakgame[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebakhero[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebakhero[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebakhero[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebakhero[m.chat][2]
					JwbTrue("Tebak Hero", tebakhero[m.chat][2], `\n\nKirim perintah .tebakhero\nuntuk bermain lagi 🎮`)
					clearTimeout(tebakhero[m.chat][3])
					delete tebakhero[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebakff[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebakff[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebakff[m.chat][1]))
				jawaban = json.name.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebakff[m.chat][2]
					JwbTrue("Tebak Free Fire", tebakff[m.chat][2], `\n\nKirim perintah .tebakff\nuntuk bermain lagi 🎮`)
					clearTimeout(tebakff[m.chat][3])
					delete tebakff[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebakkabupaten[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebakkabupaten[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebakkabupaten[m.chat][1]))
				jawaban = json.title.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebakkabupaten[m.chat][2]
					JwbTrue("Tebak Kabupaten", tebakkabupaten[m.chat][2], `\n\nKirim perintah .tebakkabupaten\nuntuk bermain lagi 🎮`)
					clearTimeout(tebakkabupaten[m.chat][3])
					delete tebakkabupaten[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebakjkt48[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebakjkt48[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebakjkt48[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebakjkt48[m.chat][2]
					JwbTrue("Tebak JKT48", tebakjkt48[m.chat][2], `\n\nKirim perintah .tebakjkt48\nuntuk bermain lagi 🎮`)
					clearTimeout(tebakjkt48[m.chat][3])
					delete tebakjkt48[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebakhewan[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebakhewan[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebakhewan[m.chat][1]))
				jawaban = json.title.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebakhewan[m.chat][2]
					JwbTrue("Tebak Hewan", tebakhewan[m.chat][2], `\n\nKirim perintah .tebakhewan\nuntuk bermain lagi 🎮`)
					clearTimeout(tebakhewan[m.chat][3])
					delete tebakhewan[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebakml[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebakml[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebakml[m.chat][1]))
				jawaban = json.title.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebakml[m.chat][2]
					JwbTrue("Tebak Sound ML", tebakml[m.chat][2], `\n\nKirim perintah .tebakml\nuntuk bermain lagi 🎮`)
					clearTimeout(tebakml[m.chat][3])
					delete tebakml[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebakchara[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebakchara[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebakchara[m.chat][1]))
				jawaban = json.name.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebakchara[m.chat][2]
					JwbTrue("Tebak Anime", tebakchara[m.chat][2], `\n\nKirim perintah .tebakchara\nuntuk bermain lagi 🎮`)
					clearTimeout(tebakchara[m.chat][3])
					delete tebakchara[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebaklogo[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebaklogo[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebaklogo[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebaklogo[m.chat][2]
					JwbTrue("Tebak Logo", tebaklogo[m.chat][2], `\n\nKirim perintah .tebaklogo\nuntuk bermain lagi 🎮`)
					clearTimeout(tebaklogo[m.chat][3])
					delete tebaklogo[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebakaplikasi[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebakaplikasi[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebakaplikasi[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebakaplikasi[m.chat][2]
					JwbTrue("Tebak Aplikasi", tebakaplikasi[m.chat][2], `\n\nKirim perintah .tebakaplikasi\nuntuk bermain lagi 🎮`)
					clearTimeout(tebakaplikasi[m.chat][3])
					delete tebakaplikasi[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebakgambar[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebakgambar[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebakgambar[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebakgambar[m.chat][2]
					JwbTrue("Tebak Gambar", tebakgambar[m.chat][2], `\n\nKirim perintah .tebakgambar\nuntuk bermain lagi 🎮`)
					clearTimeout(tebakgambar[m.chat][3])
					delete tebakgambar[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebakkata[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebakkata[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebakkata[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebakkata[m.chat][2]
					JwbTrue("Tebak Kata", tebakkata[m.chat][2], `\n\nKirim perintah .tebakkata\nuntuk bermain lagi 🎮`)
					clearTimeout(tebakkata[m.chat][3])
					delete tebakkata[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (asahotak[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == asahotak[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(asahotak[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += asahotak[m.chat][2]
					JwbTrue("Asah Otak", asahotak[m.chat][2], `\n\nKirim perintah .asahotak\nuntuk bermain lagi 🎮`)
					clearTimeout(asahotak[m.chat][3])
					delete asahotak[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (lengkapikalimat[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == lengkapikalimat[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(lengkapikalimat[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += lengkapikalimat[m.chat][2]
					JwbTrue("Lengkapi Kalimat", lengkapikalimat[m.chat][2], `\n\nKirim perintah .lengkapikalimat\nuntuk bermain lagi 🎮`)
					clearTimeout(lengkapikalimat[m.chat][3])
					delete lengkapikalimat[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebakbendera[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebakbendera[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebakbendera[m.chat][1]))
				jawaban = json.name.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebakbendera[m.chat][2]
					JwbTrue("Tebak Bendera", tebakbendera[m.chat][2], `\n\nKirim perintah .tebakbendera\nuntuk bermain lagi 🎮`)
					clearTimeout(tebakbendera[m.chat][3])
					delete tebakbendera[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (caklontong[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == caklontong[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(caklontong[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += caklontong[m.chat][2]
					JwbTrue("Cak Lontong", caklontong[m.chat][2], `\n\nKirim perintah .caklontong\nuntuk bermain lagi 🎮`)
					clearTimeout(caklontong[m.chat][3])
					delete caklontong[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (susunkata[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == susunkata[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(susunkata[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += susunkata[m.chat][2]
					JwbTrue("Susun Kata", susunkata[m.chat][2], `\n\nKirim perintah .susunkata\nuntuk bermain lagi 🎮`)
					clearTimeout(susunkata[m.chat][3])
					delete susunkata[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebakkalimat[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebakkalimat[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebakkalimat[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebakkalimat[m.chat][2]
					JwbTrue("Tebak Kalimat", tebakkalimat[m.chat][2], `\n\nKirim perintah .tebakkalimat\nuntuk bermain lagi 🎮`)
					clearTimeout(tebakkalimat[m.chat][3])
					delete tebakkalimat[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (siapaaku[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == siapaaku[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(siapaaku[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += siapaaku[m.chat][2]
					JwbTrue("Tebak Siapa", siapaaku[m.chat][2], `\n\nKirim perintah .tebaksiapa\nuntuk bermain lagi 🎮`)
					clearTimeout(siapaaku[m.chat][3])
					delete siapaaku[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tekateki[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tekateki[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tekateki[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tekateki[m.chat][2]
					JwbTrue("Teka Teki", tekateki[m.chat][2], `\n\nKirim perintah .tekateki\nuntuk bermain lagi 🎮`)
					clearTimeout(tekateki[m.chat][3])
					delete tekateki[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebakkimia[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebakkimia[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebakkimia[m.chat][1]))
				jawaban = json.unsur.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebakkimia[m.chat][2]
					JwbTrue("Teka Kimia", tebakkimia[m.chat][2], `\n\nKirim perintah .tebakkimia\nuntuk bermain lagi 🎮`)
					clearTimeout(tebakkimia[m.chat][3])
					delete tebakkimia[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebaklirik[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebaklirik[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebaklirik[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebaklirik[m.chat][2]
					JwbTrue("Teka Lirik", tebaklirik[m.chat][2], `\n\nKirim perintah .tebaklirik\nuntuk bermain lagi 🎮`)
					clearTimeout(tebaklirik[m.chat][3])
					delete tebaklirik[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		if (tebaktebakan[m.chat] && !isCmd && m.quoted)
		{
			if (m.quoted.id == tebaktebakan[m.chat][0].key.id)
			{
				let json = JSON.parse(JSON.stringify(tebaktebakan[m.chat][1]))
				jawaban = json.jawaban.toLowerCase().trim()
				if (budy.toLowerCase() == jawaban)
				{
					db.data.users[m.sender].uang += tebaktebakan[m.chat][2]
					JwbTrue("Teka Tebakan", tebaktebakan[m.chat][2], `\n\nKirim perintah .tebaktebakan\nuntuk bermain lagi 🎮`)
					clearTimeout(tebaktebakan[m.chat][3])
					delete tebaktebakan[m.chat]
				}
				else if (similarity(budy.toLowerCase(), jawaban) >= threshold) shoNherly(`_Ya, Dikit Lagi!_`)
				else emote('❌');
			}
		}
		async function cekgame(gamejid)
		{
			if (tekateki[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tekateki[gamejid][0]
				})
				return true
			}
			else if (caklontong[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: caklontong[gamejid][0]
				})
				return true
			}
			else if (susunkata[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: susunkata[gamejid][0]
				})
				return true
			}
			else if (mathgame[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal Mathgame belum selesai"
				},
				{
					quoted: mathgame[gamejid][0]
				})
				return true
			}
			else if (tebaktebakan[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebaktebakan[gamejid][0]
				})
				return true
			}
			else if (tebaklirik[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebaklirik[gamejid][0]
				})
				return true
			}
			else if (tebakkimia[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebakkimia[gamejid][0]
				})
				return true
			}
			else if (siapaaku[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: siapaaku[gamejid][0]
				})
				return true
			}
			else if (tebakkalimat[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebakkalimat[gamejid][0]
				})
				return true
			}
			else if (tebakbendera[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebakbendera[gamejid][0]
				})
				return true
			}
			else if (tebakkata[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebakkata[gamejid][0]
				})
				return true
			}
			else if (asahotak[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: asahotak[gamejid][0]
				})
				return true
			}
			else if (lengkapikalimat[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: lengkapikalimat[gamejid][0]
				})
				return true
			}
			else if (tebakgame[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebakgame[gamejid][0]
				})
				return true
			}
			else if (tebakhero[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebakhero[gamejid][0]
				})
				return true
			}
			else if (tebakff[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebakff[gamejid][0]
				})
				return true
			}
			else if (tebakkabupaten[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebakkabupaten[gamejid][0]
				})
				return true
			}
			else if (tebakjkt48[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebakjkt48[gamejid][0]
				})
				return true
			}
			else if (tebakhewan[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebakhewan[gamejid][0]
				})
				return true
			}
			else if (tebakml[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebakml[gamejid][0]
				})
				return true
			}
			else if (tebakchara[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebakchara[gamejid][0]
				})
				return true
			}
			else if (tebaklogo[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebaklogo[gamejid][0]
				})
				return true
			}
			else if (tebakaplikasi[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebakaplikasi[gamejid][0]
				})
				return true
			}
			else if (tebakgambar[gamejid])
			{
				shoNhe.sendMessage(gamejid,
				{
					text: "Soal ini belum selesai"
				},
				{
					quoted: tebakgambar[gamejid][0]
				})
				return true
			}
			else
			{
				return false
			}
		}
		async function convertGifToWebP(inputPath, outputPath)
		{
			return new Promise((resolve, reject) =>
			{
				const command = `ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease" -c:v libwebp -q:v 80 -loop 0 ${outputPath}`;
				exec(command, (error, stdout, stderr) =>
				{
					if (error)
					{
						console.error("Error saat konversi GIF ke WebP:", stderr);
						reject("Gagal mengonversi GIF ke WebP.");
					}
					else
					{
						console.log("GIF berhasil dikonversi ke WebP:", outputPath);
						resolve(outputPath);
					}
				});
			});
		}
		async function convertImageToWebP(inputPath, outputPath)
		{
			return new Promise((resolve, reject) =>
			{
				const command = `ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease" -c:v libwebp -q:v 80 -loop 0 ${outputPath}`;
				exec(command, (error, stdout, stderr) =>
				{
					if (error)
					{
						console.error("Error saat konversi gambar ke WebP:", stderr);
						reject("Gagal mengonversi gambar ke WebP.");
					}
					else
					{
						console.log("Gambar berhasil dikonversi ke WebP:", outputPath);
						resolve(outputPath);
					}
				});
			});
		}
		async function convertVideoToWebP(inputPath, outputPath)
		{
			return new Promise((resolve, reject) =>
			{
				const command = `ffmpeg -i ${inputPath} -vcodec libwebp -vf "fps=15,scale=512:512:force_original_aspect_ratio=decrease" -loop 0 ${outputPath}`;
				exec(command, (error, stdout, stderr) =>
				{
					if (error)
					{
						console.error("Error saat konversi video ke WebP:", stderr);
						reject("Gagal mengonversi video ke WebP.");
					}
					else
					{
						console.log("Video berhasil dikonversi ke WebP:", outputPath);
						resolve(outputPath);
					}
				});
			});
		}
		async function addMetadataToWebP(inputPath, outputPath, packname, author)
		{
			return new Promise((resolve, reject) =>
			{
				const reader = new WebPReader();
				reader.read(inputPath).then((webp) =>
				{
					const writer = new WebPWriter();
					webp.metadata.packname = packname;
					webp.metadata.author = author;
					writer.write(outputPath, webp).then(() =>
					{
						console.log("Metadata berhasil ditambahkan ke WebP.");
						resolve(outputPath);
					}).catch(reject);
				}).catch(reject);
			});
		}
		////======================== [ A EF KA ] ===============================
		if (m.isGroup && !m.key.fromMe)
		{
			let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
			for (let ment of mentionUser)
			{
				if (checkAfkUser(ment, afk))
				{
					let getId2 = getAfkId(ment, afk)
					let getReason2 = getAfkReason(getId2, afk)
					let getTimee = Date.now() - getAfkTime(getId2, afk)
					let anu2 = ms(getTimee)
					shoNherly(`⚠️ *SISTEMA DE NOTIFICACIÓN AFK* ⚠️  

[⚠️] *ESTADO DEL USUARIO*:  
- El usuario está *AFK*! Evita molestarlo o mencionarlo por ahora.  

[📌] *RAZÓN*:  
- ${getReason2 || 'No especificado'}  

[⏳] *DURACIÓN DESDE AFK*:  
- ${anu2.hours || 0} Horas, ${anu2.minutes || 0} Minutos, ${anu2.seconds || 0} Segundos  

[🛡️] *NOTA IMPORTANTE*:  
- Este mensaje ha sido enviado por un sistema automático.  
- Los datos de actividad se registran en tiempo real.  
- Cualquier infracción será revisada posteriormente.  

[💻] *CONSEJOS DEL SISTEMA*:  
- Para más información, espera a que el usuario vuelva a estar activo.  
- Usa la función de búsqueda o ayuda si la necesitas.  

🔍 *MONITOREO DEL SISTEMA*:  
- El estado del usuario se monitorea dentro del sistema.  
- Ninguna actividad pasa desapercibida en nuestros registros.  
- Sigue los protocolos de interacción establecidos.  

📡 *SISTEMA ACTIVO*:  
- Los datos se actualizan en tiempo real.  
- Mantente conectado para más notificaciones.`)
				}
			}
			if (checkAfkUser(m.sender, afk))
			{
				let getId = getAfkId(m.sender, afk)
				let getReason = getAfkReason(getId, afk)
				let getTime = Date.now() - getAfkTime(getId, afk)
				let anu = ms(getTime)
				afk.splice(getAfkPosition(m.sender, afk), 1)
				fs.writeFileSync('./database/afk.json', JSON.stringify(afk))
				shoNhe.sendTextWithMentions(m.chat, `⚠️ *ALERTA DEL SISTEMA: ESTADO DEL USUARIO* ⚠️  

User @${m.sender.split('@')[0]}, ¿sigues bien, bro? El sistema ha detectado tu estado AFK.  

[📌] *RAZÓN*:  
- ${getReason || 'No se ha proporcionado ninguna razón'}  

[⏳] *DURACIÓN*:  
- ${anu.hours || 0} Horas, ${anu.minutes || 0} Minutos, ${anu.seconds || 0} Segundos  

[🛠️] *INSTRUCCIONES*:  
- Si hay algún problema, actualiza tu estado lo antes posible.  
- Evita tardar demasiado, el sistema siempre está monitoreando.  

[🔍] *REGISTRO DEL SISTEMA*:  
- Este estado ha sido registrado en el protocolo de logs.  
- No ignores este mensaje para mantener la credibilidad de tu actividad.  

[⚡] *CONSEJO*:  
- “El tiempo sigue corriendo, úsalo sabiamente. No dejes que el mundo virtual te supere.”  

📡 *ESTADO DEL SISTEMA*:  
- Monitoreo en tiempo real activo.  
- El sistema permanecerá conectado hasta que vuelvas a estar activo.`, fvideo)
			}
		}
		//==================[ BUTTON MESSAGE ]======================\\
		async function sendButton(chat, judul, teks, button, m)
		{
			let msg = generateWAMessageFromContent(chat,
			{
				viewOnceMessage:
				{
					message:
					{
						'messageContextInfo':
						{
							'deviceListMetadata':
							{},
							'deviceListMetadataVersion': 2
						},
						interactiveMessage: proto.Message.InteractiveMessage.create(
						{
							contextInfo:
							{
								mentionedJid: [m.sender],
								forwardingScore: 1,
								isForwarded: true,
								forwardedNewsletterMessageInfo:
								{
									newsletterJid: saluran,
									newsletterName: namach,
									serverMessageId: -1
								},
								businessMessageForwardInfo:
								{
									businessOwnerJid: shoNhe.decodeJid(shoNhe.user.id)
								},
							},
							body: proto.Message.InteractiveMessage.Body.create(
							{
								text: teks
							}),
							footer: proto.Message.InteractiveMessage.Footer.create(
							{
								text: namabot
							}),
							header: proto.Message.InteractiveMessage.Header.create(
							{
								title: judul,
								subtitle: namaowner,
								hasMediaAttachment: false
							}),
							nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
							{
								buttons: button,
							})
						})
					}
				}
			},
			{
				quoted: m
			})
			await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
			{
				messageId: msg.key.id
			})
		}
		async function sendButtonImage(chat, judul, teks, buffer, button, hw)
		{
			const uploadFile = {
				upload: shoNhe.waUploadToServer
			};
			const imageMessage = await prepareWAMessageMedia(
			{
				image: buffer,
			}, uploadFile, );
			let msg = generateWAMessageFromContent(m.chat,
			{
				viewOnceMessage:
				{
					message:
					{
						'messageContextInfo':
						{
							'deviceListMetadata':
							{},
							'deviceListMetadataVersion': 2
						},
						interactiveMessage: proto.Message.InteractiveMessage.create(
						{
							contextInfo:
							{
								mentionedJid: [m.sender],
								forwardingScore: 1,
								isForwarded: true,
								forwardedNewsletterMessageInfo:
								{
									newsletterJid: saluran,
									newsletterName: namach,
									serverMessageId: -1
								},
								businessMessageForwardInfo:
								{
									businessOwnerJid: shoNhe.decodeJid(shoNhe.user.id)
								},
							},
							body: proto.Message.InteractiveMessage.Body.create(
							{
								text: teks
							}),
							footer: proto.Message.InteractiveMessage.Footer.create(
							{
								text: namabot
							}),
							header: proto.Message.InteractiveMessage.Header.create(
							{
								title: judul,
								subtitle: namaowner,
								imageMessage: imageMessage.imageMessage,
								hasMediaAttachment: true
							}),
							nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
							{
								buttons: button,
							})
						})
					}
				}
			},
			{
				quoted: hw
			})
			shoNhe.relayMessage(msg.key.remoteJid, msg.message,
			{
				messageId: msg.key.id
			})
		}
		async function sendButtonVideo(chat, judul, teks, buffer, button, m)
		{
			const uploadFile = {
				upload: shoNhe.waUploadToServer
			};
			const videoMessage = await prepareWAMessageMedia(
			{
				video: buffer,
			}, uploadFile, );
			let msg = generateWAMessageFromContent(m.chat,
			{
				viewOnceMessage:
				{
					message:
					{
						'messageContextInfo':
						{
							'deviceListMetadata':
							{},
							'deviceListMetadataVersion': 2
						},
						interactiveMessage: proto.Message.InteractiveMessage.create(
						{
							contextInfo:
							{
								mentionedJid: [m.sender],
								forwardingScore: 1,
								isForwarded: true,
								forwardedNewsletterMessageInfo:
								{
									newsletterJid: idsaluran,
									newsletterName: namach,
									serverMessageId: -1
								},
								businessMessageForwardInfo:
								{
									businessOwnerJid: shoNhe.decodeJid(shoNhe.user.id)
								},
							},
							body: proto.Message.InteractiveMessage.Body.create(
							{
								text: teks
							}),
							footer: proto.Message.InteractiveMessage.Footer.create(
							{
								text: namabot
							}),
							header: proto.Message.InteractiveMessage.Header.create(
							{
								title: judul,
								subtitle: namaowner,
								videoMessage: videoMessage.videoMessage,
								hasMediaAttachment: true
							}),
							nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
							{
								buttons: button,
							})
						})
					}
				}
			},
			{
				quoted: m
			})
			shoNhe.relayMessage(msg.key.remoteJid, msg.message,
			{
				messageId: msg.key.id
			})
		}
		async function sendButtonDocument(chat, judul, teks, thumb, button, m)
		{
			let msg = generateWAMessageFromContent(chat,
			{
				viewOnceMessage:
				{
					message:
					{
						'messageContextInfo':
						{
							'deviceListMetadata':
							{},
							'deviceListMetadataVersion': 2
						},
						interactiveMessage: proto.Message.InteractiveMessage.create(
						{
							contextInfo:
							{
								mentionedJid: [m.sender],
								isForwarded: true,
								forwardedNewsletterMessageInfo:
								{
									newsletterJid: idsaluran,
									newsletterName: namach,
									serverMessageId: -1
								},
								businessMessageForwardInfo:
								{
									businessOwnerJid: shoNhe.decodeJid(shoNhe.user.id)
								},
								externalAdReply:
								{
									title: waktuucapan,
									body: pushname,
									thumbnail: forpdf,
									sourceUrl: wagc,
									mediaType: 1,
									renderLargerThumbnail: true
								}
							},
							body: proto.Message.InteractiveMessage.Body.create(
							{
								text: teks
							}),
							footer: proto.Message.InteractiveMessage.Footer.create(
							{
								text: namabot
							}),
							header: proto.Message.InteractiveMessage.Header.create(
							{
								title: judul,
								thumbnailUrl: getRandomThumb3(),
								subtitle: namaowner,
								hasMediaAttachment: true,
								...(await prepareWAMessageMedia(
								{
									document: thumb,
									mimetype: 'image/png',
									fileLength: 10000000000,
									jpegThumbnail: thumb,
									fileName: namach
								},
								{
									upload: shoNhe.waUploadToServer
								}))
							}),
							nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
							{
								buttons: button,
							})
						})
					}
				}
			},
			{
				quoted: m
			})
			await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
			{
				messageId: msg.key.id
			})
		};
		//==================[ FUNCTION RESPON SALAH ]======================\\
		/*if (prefix && command) {
		let caseNames = getCaseNames();
		function getCaseNames() {
		const fs = require('fs');
		try {
		const data = fs.readFileSync('case.js', 'utf8');
		const casePattern = /case\s+'([^']+)'/g;
		const matches = data.match(casePattern);
		if (matches) {
		const caseNames = matches.map(match => match.replace(/case\s+'([^']+)'/, '$1'));
		return caseNames;
		} else {
		return [];
		} } catch (err) {
		console.log('Terjadi kesalahan:', err);
		return [];
		}}
		let noPrefix = command
		let mean = didyoumean(noPrefix, caseNames);
		let sim = similarity(noPrefix, mean);
		let similarityPercentage = parseInt(sim * 100);
		if (mean && noPrefix.toLowerCase() !== mean.toLowerCase()) {
		let response = `Maaf, command yang kamu berikan salah. mungkin ini yang kamu maksud:\n\n•> ${prefix+mean}\n•> Kemiripan: ${similarityPercentage}%`
		shoNhe.sendMessage(m.chat,
				{
					text: response,
					contextInfo:
					{
						forwardingScore: 1,
						isForwarded: true,
						externalAdReply:
						{
							showAdAttribution: true,
							title: "TYPO DETECTz",
							body: `By Sho - Botz`,
							thumbnail: getRandomThumb3(),
							sourceUrl: "",
							mediaType: 1,
							renderLargerThumbnail: true
						}
					}
				});
		}}*/
		//=================[ TEMPAT CASE DI BAWAH INI ]=================\\
		switch (command)
		{
		case 'addprodukown': {
    if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);

    const path = './database/produkown.json';

    try {
        // Cek dan buat database jika belum ada
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, JSON.stringify({}, null, 2), 'utf8');
        }

        let fileContent = fs.readFileSync(path, 'utf8').trim();
        let produkDB = fileContent ? JSON.parse(fileContent) : {};

        // Validasi input
        let argsSplit = text.split("|");
        if (argsSplit.length < 3) {
            return shoNherly('❌ Format salah. Gunakan: .addprodukown <nama>|<harga>|<deskripsi>');
        }

        let [nama, harga, deskripsi] = argsSplit.map(a => a.trim());

        // Pastikan harga adalah angka
        harga = parseInt(harga);
        if (isNaN(harga) || harga <= 0) {
            return shoNherly('❌ Harga harus berupa angka yang valid.');
        }

        // Pastikan grup memiliki daftar produk
        if (!produkDB[m.chat]) produkDB[m.chat] = { produk: [] };

        // Cek apakah produk sudah ada
        const produkExist = produkDB[m.chat].produk.some(p => p.name.toLowerCase() === nama.toLowerCase());
        if (produkExist) {
            return shoNherly(`❌ Produk *${nama}* sudah ada! Gunakan nama lain.`);
        }

        // Tambahkan produk ke database
        produkDB[m.chat].produk.push({
            name: nama,
            price: harga,
            description: deskripsi
        });

        // Simpan ke file
        await fs.promises.writeFile(path, JSON.stringify(produkDB, null, 2), 'utf8');
        shoNherly(`✅ Produk *${nama}* berhasil ditambahkan ke toko owner dengan harga Rp${harga}.`);
    } catch (error) {
        console.error('❌ Error saat memproses produk owner:', error);
        shoNherly('❌ Terjadi kesalahan saat menambahkan produk.');
    }
}
break;
case 'listprodukown': {
    const path = './database/produkown.json';

    // Cek database
    if (!fs.existsSync(path)) {
        return shoNherly('❌ Tidak ada produk di toko owner.');
    }

    let produkDB = JSON.parse(fs.readFileSync(path, 'utf8'));

    if (!produkDB[m.chat] || !produkDB[m.chat].produk.length) {
        return shoNherly('❌ Tidak ada produk tersedia di toko owner.');
    }

    let teks = "📜 *DAFTAR PRODUK OWNER*\n\n";
    produkDB[m.chat].produk.forEach((p, i) => {
        teks += `${i + 1}. *${p.name}*\n`;
        teks += `   💰 Harga: Rp${p.price}\n`;
        teks += `   📄 Deskripsi: ${p.description}\n\n`;
    });

    shoNherly(teks);
}
break;
case 'deleteprodukown': {
    if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);

    const path = './database/produkown.json';

    // Cek database
    if (!fs.existsSync(path)) {
        return shoNherly('❌ Tidak ada produk di toko owner.');
    }

    let produkDB = JSON.parse(fs.readFileSync(path, 'utf8'));

    if (!produkDB[m.chat] || !produkDB[m.chat].produk.length) {
        return shoNherly('❌ Tidak ada produk tersedia untuk dihapus.');
    }

    // Jika tidak ada input, tampilkan daftar produk dengan tombol
    if (!text) {
        let teks = "🗑️ *Pilih Produk untuk Dihapus*\n\n";
        produkDB[m.chat].produk.forEach((p, i) => {
            teks += `📌 *${i + 1}. ${p.name}*\n`;
            teks += `💰 Harga: Rp${p.price}\n`;
            teks += `📄 Deskripsi: ${p.description}\n\n`;
        });

        let button = [{
            "name": "single_select",
            "buttonParamsJson": JSON.stringify({
                "title": "🗑️ HAPUS PRODUK OWNER",
                "sections": [{
                    "title": "Klik Produk untuk Menghapus",
                    "rows": produkDB[m.chat].produk.map(p => ({
                        "header": p.name,
                        "title": `Hapus ${p.name}`,
                        "description": "Tekan untuk langsung menghapus",
                        "id": `deleteprodukown ${p.name}`
                    }))
                }]
            })
        }];

        await sendButtonImage(m.chat, "", teks, getRandomThumb2(), button, hw);
        return;
    }

    // Hapus produk yang dipilih
    let namaProduk = text.trim().toLowerCase();
    let index = produkDB[m.chat].produk.findIndex(p => p.name.toLowerCase() === namaProduk);

    if (index === -1) return shoNherly(`❌ Produk *${namaProduk}* tidak ditemukan.`);

    produkDB[m.chat].produk.splice(index, 1);
    fs.writeFileSync(path, JSON.stringify(produkDB, null, 2), 'utf8');

    shoNherly(`✅ Produk *${namaProduk}* berhasil dihapus.`);
}
break;
case 'storeownmenu': {
    let teks = `┏━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
teks += `┃  👑  *TIENDA DEL PROPIETARIO*  👑  ┃\n`;
teks += `┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;

teks += `⚡ *GUÍA DE USO:*\n`;
teks += `📌 Utilice los comandos a continuación para gestionar los productos de la tienda del propietario.\n`;
teks += `📌 El símbolo < > indica que el campo es obligatorio.\n\n`;

teks += `⚡ *COMANDOS:*\n`;
teks += `📍 *Agregar Producto:*\n`;
teks += `   ➤ \`.addprodukown <nombre>|<precio>|<descripción>\`\n`;
teks += `📍 *Ver Productos:*\n`;
teks += `   ➤ \`.listprodukown\`\n`;
teks += `📍 *Comprar Producto:*\n`;
teks += `   ➤ \`.buyprodukown <nombre_producto>\`\n`;
teks += `📍 *Actualizar Producto:*\n`;
teks += `   ➤ \`.updateprodukown <nombre>|<precio>|<descripción>\`\n`;
teks += `📍 *Eliminar Producto:*\n`;
teks += `   ➤ \`.deleteprodukown\` (elige desde la lista interactiva)\n\n`;

    let button = [{
        "name": "single_select",
        "buttonParamsJson": JSON.stringify({
            "title": "👑 ACCIONES DE LA TIENDA DEL PROPIETARIO",
"sections": [
    {
        "title": "Compra de Productos",
        "rows": [
            {"header": "📜 Lista de Productos", "title": "Ver Productos", "id": "listprodukown"},
            {"header": "🛒 Comprar Producto", "title": "Comprar Producto", "id": "buyprodukown"}
        ]
    },
    {
        "title": "Gestionar Productos",
        "rows": [
            {"header": "➕ Agregar Producto", "title": "Agregar Producto", "id": "addprodukown"},
            {"header": "✏️ Actualizar Producto", "title": "Actualizar Producto", "id": "updateprodukown"},
            {"header": "❌ Eliminar Producto", "title": "Eliminar Producto", "id": "deleteprodukown"}
                    ]
                }
            ]
        })
    }];

    await sendButtonImage(m.chat, "", teks, getRandomThumb2(), button, hw);
}
break;
case 'storemenu': {
    let teks = `╔══════════════════════╗\n`;  
teks += `║  ✨ *MENÚ DE TIENDA* ✨  ║\n`;  
teks += `╚══════════════════════╝\n\n`;  

teks += `📢 *GUÍA DE USO:*\n`;  
teks += `📌 Usa los comandos a continuación para gestionar productos.\n`;  
teks += `📌 Los símbolos < > indican los campos obligatorios.\n\n`;  

teks += `💎 *MENÚ DE PRODUCTOS GENERALES:*\n`;  
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`;  
teks += `📍 *Añadir Producto:*\n`;  
teks += `   ➤ \`.addproduk <nombre>|<precio>|<descripción>\`\n`;  
teks += `📍 *Ver Productos:*\n`;  
teks += `   ➤ \`.listproduk\`\n`;  
teks += `📍 *Comprar Producto:*\n`;  
teks += `   ➤ \`.buyproduk <nombre_producto>\`\n`;  
teks += `📍 *Actualizar Producto:*\n`;  
teks += `   ➤ \`.updateproduk <nombre>|<precio>|<descripción>\`\n`;  
teks += `📍 *Eliminar Producto:*\n`;  
teks += `   ➤ \`.deleteproduk\` (seleccionar de la lista interactiva)\n\n`;  

// **Menú Adicional para Propietarios**  
teks += `👑 *MENÚ DE PRODUCTOS PARA PROPIETARIOS (SOLO ADMIN & OWNER):*\n`;  
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`;  
teks += `📍 *Ver Productos de Propietarios:*\n`;  
teks += `   ➤ \`.listprodukown\`\n`;  
teks += `📍 *Comprar Producto de Propietario:*\n`;  
teks += `   ➤ \`.buyprodukown <nombre_producto>\`\n`;

    let button = [{
        "name": "single_select",
        "buttonParamsJson": JSON.stringify({
    "title": "✨ ACCIONES DE TIENDA ✨",
    "sections": [
        {
            "title": "📦 Gestionar Productos Generales",
            "rows": [
                {"header": "➕ Agregar Producto", "title": "Añadir Producto", "id": "addproduk"},
                {"header": "✏️ Actualizar Producto", "title": "Actualizar Producto", "id": "updateproduk"},
                {"header": "❌ Eliminar Producto", "title": "Eliminar Producto", "id": "deleteproduk"}
            ]
        },
        {
            "title": "🛒 Compra de Productos Generales",
            "rows": [
                {"header": "📜 Lista de Productos", "title": "Ver Productos", "id": "listproduk"},
                {"header": "🛒 Comprar Producto", "title": "Comprar Producto", "id": "buyproduk"}
            ]
        },
        {
            "title": "💰 Compra de Productos del Propietario",
            "rows": [
                {"header": "📜 Lista de Productos del Propietario", "title": "Ver Productos", "id": "listprodukown"},
                {"header": "🛒 Comprar Producto del Propietario", "title": "Comprar Producto", "id": "buyprodukown"},
                {"header": "🏭 Tienda del Propietario", "title": "Configuración de tienda exclusiva para Productos del Propietario", "id": "storeownmenu"}
                    ]
                }
            ]
        })
    }];

    await sendButtonImage(m.chat, "", teks, getRandomThumb2(), button, hw);
}
break;

// ================= [ HAPUS PRODUK OTOMATIS DARI TOMBOL INTERAKTIF ] ================= \\
case 'addproduk': {
    if (!isGroup) return shoNherly(mess.groups);
    if (!isBotAdmins) return shoNherly(mess.abots);
    if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);

    const args = text.trim().split('|');
    const namaProduk = args[0]?.trim() || null;
    const hargaProduk = parseInt(args[1]?.trim()) || null;
    const deskripsiProduk = args[2]?.trim() || 'Descripción no disponible';

    if (!namaProduk || isNaN(hargaProduk)) {
        return shoNherly('❌ Formato incorrecto. Utilice el formato: .addproduct <nombre>|<precio>|<descripción>');
    }

    const listStorePath = './database/listStore.json';
    let listStore = {};

    // Membaca database jika sudah ada
    if (fs.existsSync(listStorePath)) {
        try {
            const fileContent = fs.readFileSync(listStorePath, 'utf8').trim();
            listStore = fileContent ? JSON.parse(fileContent) : {};
        } catch (error) {
            console.error('❌ Error membaca JSON:', error);
            return shoNherly('❌ Se produjo un error al leer el archivo del producto.');
        }
    }

    // Pastikan grup sudah ada dalam database
    if (!listStore[m.chat]) listStore[m.chat] = { produk: [] };

    // Periksa apakah produk sudah ada
    const produkExist = listStore[m.chat].produk.some(p => p.name.toLowerCase() === namaProduk.toLowerCase());
    if (produkExist) {
        return shoNherly(`❌ ¡El producto *${namaProduk}* ya existe! Usa otro nombre.`);
    }

    // Tambahkan produk baru ke dalam daftar
    listStore[m.chat].produk.push({
        name: namaProduk,
        price: hargaProduk,
        description: deskripsiProduk
    });

    // Simpan ke file
    try {
        fs.writeFileSync(listStorePath, JSON.stringify(listStore, null, 2), 'utf8');
        shoNherly(`✅ El producto *${namaProduk}* se ha añadido con éxito por un precio de Rp${hargaProduk}.`);
    } catch (error) {
        console.error('❌ Error saat menyimpan JSON:', error);
        shoNherly('❌ Se produjo un error al guardar un nuevo producto.');
    }
}
break;
case 'deleteproduk': {
    if (!isGroup) return shoNherly(mess.groups);
    if (!isBotAdmins) return shoNherly(mess.abots);
    if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);

    const listStorePath = './database/listStore.json';
    let listStore = {};

    // Membaca database produk secara async
    if (fs.existsSync(listStorePath)) {
        try {
            const fileContent = fs.readFileSync(listStorePath, 'utf8');
            listStore = fileContent.trim() === '' ? {} : JSON.parse(fileContent);
        } catch (error) {
            console.error('❌ Error membaca JSON:', error);
            return shoNherly('❌ Se produjo un error al leer el archivo del producto.');
        }
    } else {
        return shoNherly('❌ Base de datos del producto no encontrada.');
    }

    if (!listStore[m.chat] || !Array.isArray(listStore[m.chat].produk) || listStore[m.chat].produk.length === 0) {
        return shoNherly('❌ No hay productos disponibles para eliminar.');
    }

    // Jika tidak ada input produk, tampilkan daftar produk dengan tombol interaktif yang langsung menghapus
    if (!text) {
        let teks = "🗑️ *Selecciona un Producto para Eliminar*\n\n";
listStore[m.chat].produk.forEach((p, i) => {
    teks += `📌 *${i + 1}. ${p.name}*\n`;
    teks += `💰 Precio: Rp${p.price}\n`;
    teks += `📄 Descripción: ${p.description}\n\n`;
        });

        let button = [{
            "name": "single_select",
            "buttonParamsJson": JSON.stringify({
    "title": "🗑️ ELIMINAR PRODUCTO",
    "sections": [{
        "title": "Haz clic en un producto para eliminarlo",
        "rows": listStore[m.chat].produk.map(p => ({
            "header": p.name,
            "title": `Eliminar ${p.name}`,
            "description": "Presiona para eliminar inmediatamente",
            "id": `deleteproduk ${p.name}`
                    }))
                }]
            })
        }];

        await sendButtonImage(m.chat, "", teks, getRandomThumb2(), button, hw);
        return;
    }

    // Proses otomatis penghapusan produk berdasarkan tombol yang ditekan
    const namaProduk = text.trim().toLowerCase();
    const index = listStore[m.chat].produk.findIndex(p => p.name.toLowerCase() === namaProduk);

    if (index === -1) return shoNherly(`❌ El producto *${namaProduk}* no se encontró.`);

    // Hapus produk dari array
    const deletedProduct = listStore[m.chat].produk.splice(index, 1)[0];

    // Simpan perubahan ke file
    try {
        await fs.promises.writeFile(listStorePath, JSON.stringify(listStore, null, 2), 'utf8');
        shoNherly(`✅ El producto *${deletedProduct.name}* se ha eliminado con éxito.`);
    } catch (error) {
        console.error('❌ Error saat menyimpan JSON:', error);
        shoNherly('❌ Se produjo un error al eliminar el producto.');
    }
}
break;
case 'buyprodukown': {
    const produkOwnPath = './database/produkown.json';
    let produkDB = {};

    // Cek dan baca database produk owner
    if (fs.existsSync(produkOwnPath)) {
        try {
            const fileContent = fs.readFileSync(produkOwnPath, 'utf8');
            produkDB = JSON.parse(fileContent);
        } catch (error) {
            console.error('❌ Gagal membaca produk owner:', error);
            return shoNherly('❌ No se pudieron cargar los datos del producto del propietario. Por favor inténtalo de nuevo más tarde.');
        }
    } else {
        return shoNherly('❌ No se encontró la base de datos del propietario del producto.');
    }

    // Validasi ketersediaan produk dalam grup
    if (!produkDB[m.chat]?.produk?.length) {
        return shoNherly('❌ No hay productos disponibles en la tienda del propietario.');
    }

    // Jika tidak ada argumen, tampilkan daftar produk
    if (args.length === 0) {
        let teks = "🛒 *LISTA DE PRODUCTOS DEL PROPIETARIO*\n\n";
produkDB[m.chat].produk.forEach((p, i) => {
    teks += `${i + 1}. *${p.name}*\n`;
    teks += `   💵 Precio: Rp${p.price}\n`;
    teks += `   📜 Descripción: ${p.description}\n\n`;
        });

        const buttons = produkDB[m.chat].produk.map(p => ({
            "header": p.name,
            "title": `Rp${p.price}`,
            "description": p.description.slice(0, 25) + "...",
            "id": `buyprodukown ${p.name}`
        }));

        await sendButtonImage(
            m.chat,
            "",
            teks,
            getRandomThumb2(),
            [{
                "name": "single_select",
                "buttonParamsJson": JSON.stringify({
                    "title": "SELECCIONAR PRODUCTOS DEL PROPIETARIO",
                    "sections": [{ 
                        "title": "PRODUCTO DISPONIBLE", 
                        "rows": buttons 
                    }]
                })
            }],
            hw
        );
        return;
    }

    // Proses pemilihan produk
    const namaProduk = args.join(" ").toLowerCase();
    const produk = produkDB[m.chat].produk.find(p => 
        p.name.toLowerCase() === namaProduk
    );

    if (!produk) return shoNherly('❌ Producto no encontrado. Asegúrese de que el nombre del producto coincida.');

    // Tampilkan detail pembelian
    let teks = "📦 *DETALLE DE COMPRA*\n";
teks += "────────────────────────\n";
teks += `🔖 *Nombre del Producto:* ${produk.name}\n`;
teks += `💰 *Precio:* Rp${produk.price}\n`;
teks += `📜 *Descripción:* ${produk.description}\n\n`;

// Lista de métodos de pago
teks += "💳 *MÉTODOS DE PAGO*\n";
teks += "────────────────────────\n";
teks += `1. DANA        : ${global.nomordana} (${global.namadana})\n`;
teks += `2. OVO         : ${global.nomorovo} (${global.namaovo})\n`;
teks += `3. GoPay       : ${global.nomorgopay} (${global.namagopay})\n`;
teks += `4. ShopeePay   : ${global.nomorshopepay} (${global.namashopepay})\n`;
teks += `5. Seabank     : ${global.nomorseabank} (${global.namaseabank})\n`;
teks += `6. BCA         : ${global.nomorbca} (${global.namabca})\n`;
teks += `7. Danamon     : ${global.nomordanamon} (${global.namadanamon})\n`;
teks += `8. QRIS        : Escanea el código QR (sin comisión)\n`;
teks += "────────────────────────\n\n";
teks += "⚠️ *Realiza el pago en un máximo de 15 minutos para evitar la cancelación automática.*";

    // Tombol metode pembayaran
    const paymentButtons = [
        { header: "DANA", title: "Transfer DANA", id: "pay_dana" },
        { header: "OVO", title: "Transfer OVO", id: "pay_ovo" },
        { header: "GOPAY", title: "Transfer GoPay", id: "pay_gopay" },
        { header: "SHOPEEPAY", title: "Transfer ShopeePay", id: "pay_shopeepay" },
        { header: "SEABANK", title: "Transfer Seabank", id: "pay_seabank" },
        { header: "BCA", title: "Transfer BCA", id: "pay_bca" },
        { header: "DANAMON", title: "Transfer Danamon", id: "pay_danamon" },
        { header: "QRIS", title: "Scan QR Code", id: "pay_qris" }
    ];

    await sendButtonImage(
        m.chat,
        "",
        teks,
        getRandomThumb2(),
        [{
            "name": "single_select",
            "buttonParamsJson": JSON.stringify({
                "title": "SELECCIONAR FORMA DE PAGO",
                "sections": [{
                    "title": "Transfer/QRIS",
                    "rows": paymentButtons
                }]
            })
        }],
        hw
    );
}
break;
case 'buyproduk': {
    const listStorePath = './database/listStore.json';
    let listStore = {};

    // Cek dan baca database produk
    if (fs.existsSync(listStorePath)) {
        try {
            const fileContent = fs.readFileSync(listStorePath, 'utf8');
            listStore = JSON.parse(fileContent);
        } catch (error) {
            console.error('❌ Gagal membaca listStore:', error);
            return shoNherly('❌ No se pudieron cargar los datos del producto. Por favor inténtalo de nuevo más tarde.');
        }
    } else {
        return shoNherly('❌ Base de datos del producto no encontrada.');
    }

    // Validasi ketersediaan produk dalam grup
    if (!listStore[m.chat]?.produk?.length) {
        return shoNherly('❌ No hay productos disponibles en este grupo.');
    }

    // Jika tidak ada argumen, tampilkan daftar produk
    if (args.length === 0) {
        let teks = "🛒 *LISTA DE PRODUCTOS DISPONIBLES*\n\n";
listStore[m.chat].produk.forEach((p, i) => {
    teks += `${i + 1}. *${p.name}*\n`;
    teks += `   💵 Precio: Rp${p.price}\n`;
    teks += `   📜 Descripción: ${p.description}\n\n`;
        });

        const buttons = listStore[m.chat].produk.map(p => ({
            "header": p.name,
            "title": `Rp${p.price}`,
            "description": p.description.slice(0, 25) + "...",
            "id": `buyproduk ${p.name}`
        }));

        await sendButtonImage(
            m.chat,
            "",
            teks,
            getRandomThumb2(),
            [{
                "name": "single_select",
                "buttonParamsJson": JSON.stringify({
                    "title": "SELECCIONAR PRODUCTO",
                    "sections": [{ 
                        "title": "PRODUCTO DISPONIBLE", 
                        "rows": buttons 
                    }]
                })
            }],
            hw
        );
        return;
    }

    // Proses pemilihan produk
    const namaProduk = args.join(" ").toLowerCase();
    const produk = listStore[m.chat].produk.find(p => 
        p.name.toLowerCase() === namaProduk
    );

    if (!produk) return shoNherly('❌ Producto no encontrado. Asegúrese de que el nombre del producto coincida.');

    // Tampilkan detail pembelian
    let teks = "📦 *DETALLES DE COMPRA*\n";
teks += "────────────────────────\n";
teks += `🔖 *Nombre del Producto:* ${produk.name}\n`;
teks += `💰 *Precio:* Rp${produk.price}\n`;
teks += `📜 *Descripción:* ${produk.description}\n\n`;

// Lista de métodos de pago
teks += "💳 *MÉTODOS DE PAGO*\n";
teks += "────────────────────────\n";
teks += `1. DANA        : ${global.nomordana} (${global.namadana})\n`;
teks += `2. OVO         : ${global.nomorovo} (${global.namaovo})\n`;
teks += `3. GoPay       : ${global.nomorgopay} (${global.namagopay})\n`;
teks += `4. ShopeePay   : ${global.nomorshopepay} (${global.namashopepay})\n`;
teks += `5. Seabank     : ${global.nomorseabank} (${global.namaseabank})\n`;
teks += `6. BCA         : ${global.nomorbca} (${global.namabca})\n`;
teks += `7. Danamon     : ${global.nomordanamon} (${global.namadanamon})\n`;
teks += `8. QRIS        : Escanea el código QR (sin administrador)\n`;
teks += "────────────────────────\n\n";
teks += "⚠️ *Realice el pago dentro de 15 minutos para evitar la cancelación automática.*";

    // Tombol metode pembayaran
    const paymentButtons = [
        { header: "DANA", title: "Transfer DANA", id: "pay_dana" },
        { header: "OVO", title: "Transfer OVO", id: "pay_ovo" },
        { header: "GOPAY", title: "Transfer GoPay", id: "pay_gopay" },
        { header: "SHOPEEPAY", title: "Transfer ShopeePay", id: "pay_shopeepay" },
        { header: "SEABANK", title: "Transfer Seabank", id: "pay_seabank" },
        { header: "BCA", title: "Transfer BCA", id: "pay_bca" },
        { header: "DANAMON", title: "Transfer Danamon", id: "pay_danamon" },
        { header: "QRIS", title: "Scan QR Code", id: "pay_qris" }
    ];

    await sendButtonImage(
        m.chat,
        "",
        teks,
        getRandomThumb2(),
        [{
            "name": "single_select",
            "buttonParamsJson": JSON.stringify({
                "title": "SELECCIONAR FORMA DE PAGO",
                "sections": [{
                    "title": "Transfer/QRIS",
                    "rows": paymentButtons
                }]
            })
        }],
        hw
    );
}
break;

// ================= [ PROSES QRIS ] ================= \\
case 'addqris': {
    if (!isRegistered(m)) {
        return sendRegister(shoNhe, m, prefix, namabot);
    }
    updatePopularCommand(command);
    const levelUpMessage = levelUpdate(command, m.sender);
    if (!(await firely(m, mess.waits))) return;

    try {
        if (!m.quoted || !/image/.test(m.quoted.mtype)) {
            return shoNherly('❌ Responda a la imagen QRIS que desea cargar.');
        }

        // Menambahkan pesan loading ⏳
        await shoNhe.sendMessage(m.chat, {
            react: {
                text: '⏳',
                key: m.key
            }
        });

        // Unduh media
        let media = await m.quoted.download();
        let base64Media = media.toString('base64');

        // Upload ke Imgbb
        let response = await axios.post('https://api.imgbb.com/1/upload', qs.stringify({
            expiration: 31536000000, // 1000 tahun
            key: ibbKey, // Gantilah dengan API Key Imgbb Anda
            image: base64Media
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Ambil URL hasil upload
        if (!response.data.success) {
            return shoNherly('❌ No se pudo cargar QRIS. Intentar otra vez.');
        }

        let qrisURL = response.data.data.url;

        // Simpan URL QRIS ke database
        fs.writeFileSync('./database/qris.json', JSON.stringify({ url: qrisURL }, null, 2));

        // Kirim URL QRIS ke pengguna
        shoNherly(`✅ ¡QRIS se cargó exitosamente!\n🔗 *URL:* ${qrisURL}`);

        if (levelUpMessage) {
            await shoNhe.sendMessage(m.chat, {
                image: { url: levelUpMessage.image },
                caption: levelUpMessage.text,
                footer: "LEVEL UP🔥",
                buttons: [
                    {
                        buttonId: `${prefix}tqto`,
                        buttonText: { displayText: "TQTO 💡" }
                    },
                    {
                        buttonId: `${prefix}menu`,
                        buttonText: { displayText: "MENU 🍄" }
                    }
                ],
                viewOnce: true,
            }, { quoted: hw });
        }
    } catch (error) {
        console.error('❌ Gagal mengunggah QRIS:', error);
        shoNherly('❌ Se produjo un error al cargar QRIS.');
    }
}
break;
case 'pay_qris': {
    try {
        const qrisPath = './database/qris.json';

        // Cek apakah file QRIS sudah ada di database
        if (!fs.existsSync(qrisPath)) {
            return shoNherly('❌ QRIS belum tersedia. Admin perlu mengunggah QRIS dengan perintah `.addqris`.');
        }

        let qrisData = JSON.parse(fs.readFileSync(qrisPath, 'utf8'));
        if (!qrisData.url) {
            return shoNherly('❌ QRIS tidak ditemukan dalam database.');
        }

        // Instruksi pembayaran QRIS
        let teks = "🔷 *PANDUAN PEMBAYARAN QRIS*\n";
        teks += "────────────────────────\n";
        teks += "1. Buka aplikasi e-wallet (DANA, GoPay, OVO, ShopeePay, dll.).\n";
        teks += "2. Pilih menu *Scan QR* lalu arahkan ke gambar QR di bawah ini.\n";
        teks += "3. Masukkan jumlah pembayaran sesuai harga produk.\n";
        teks += "4. Konfirmasi pembayaran dengan admin setelah transfer.\n\n";
        teks += "⌛ *Batas waktu pembayaran: 15 menit.*\n";
        teks += "────────────────────────\n";
        teks += "📢 *Jika ada kendala, hubungi admin untuk bantuan lebih lanjut.*\n\n";
        teks += `🔗 *QRIS Link:* ${qrisData.url}`;

        // Kirim gambar QRIS dari URL
        await shoNhe.sendMessage(m.chat, {
            image: { url: qrisData.url },
            caption: teks
        }, { quoted: m });

    } catch (error) {
        console.error('❌ Gagal mengirim QRIS:', error);
        return shoNherly('❌ Terjadi kesalahan saat mengirim QRIS. Silakan coba lagi.');
    }
}
break;
case 'deleteqris': {
    if (!isRegistered(m)) {
        return sendRegister(shoNhe, m, prefix, namabot);
    }
    updatePopularCommand(command);

    try {
        const qrisPath = './database/qris.json';

        // Cek apakah file QRIS ada
        if (!fs.existsSync(qrisPath)) {
            return shoNherly('❌ Tidak ada QRIS yang tersimpan.');
        }

        // Menghapus file QRIS dari database
        fs.unlinkSync(qrisPath);
        shoNherly('✅ QRIS berhasil dihapus. Anda dapat mengunggah QRIS baru dengan perintah `.addqris`.');
        
    } catch (error) {
        console.error('❌ Gagal menghapus QRIS:', error);
        shoNherly('❌ Terjadi kesalahan saat menghapus QRIS.');
    }
}
break;

// PROSES PEMBAYARAN TANPA LOADING - LANGSUNG MENAMPILKAN DETAIL
async function prosesPembayaran(m, metode, nomor, nama) {
    let pembayaranTeks = `🎯 *PAYMENT REQUEST RECEIVED!* 🎯\n\n`;
    pembayaranTeks += `🔹 *SYSTEM VALIDATION COMPLETE...*\n`;
    pembayaranTeks += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    pembayaranTeks += `💳 *Payment Method:* ${metode}\n`;
    pembayaranTeks += `📞 *Account Number:* ${nomor}\n`;
    pembayaranTeks += `👤 *Account Holder:* ${nama}\n`;
    pembayaranTeks += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    pembayaranTeks += `⚠️ *ACTION REQUIRED!*\n`;
    pembayaranTeks += `📌 *Complete your payment* and send confirmation immediately.\n`;
    pembayaranTeks += `🛡 *System is monitoring transaction in real-time...*\n`;

    await shoNherly(pembayaranTeks);
}
case 'pay_dana':
    await prosesPembayaran(m, "Dana", global.nomordana, global.namadana);
    break;

case 'pay_gopay':
    await prosesPembayaran(m, "GoPay", global.nomorgopay, global.namagopay);
    break;

case 'pay_ovo':
    await prosesPembayaran(m, "Ovo", global.nomorovo, global.namaovo);
    break;

case 'pay_shopeepay':
    await prosesPembayaran(m, "ShopeePay", global.nomorshopepay, global.namashopepay);
    break;

case 'pay_seabank':
    await prosesPembayaran(m, "Bank Seabank", global.nomorseabank, global.namaseabank);
    break;

case 'pay_bca':
    await prosesPembayaran(m, "Bank BCA", global.nomorbca, global.namabca);
    break;

case 'pay_danamon':
    await prosesPembayaran(m, "Bank Danamon", global.nomordanamon, global.namadanamon);
    break;

// Fungsi delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
case 'listproduk': {
    const listStorePath = './database/listStore.json';
    let listStore = {};

    if (fs.existsSync(listStorePath)) {
        try {
            const fileContent = fs.readFileSync(listStorePath, 'utf8');
            listStore = fileContent.trim() === '' ? {} : JSON.parse(fileContent);
        } catch (error) {
            console.error('❌ Error membaca JSON:', error);
            return shoNherly('❌ Terjadi kesalahan saat membaca file produk.');
        }
    } else {
        return shoNherly('❌ File produk tidak ditemukan.');
    }

    if (!listStore[m.chat] || !Array.isArray(listStore[m.chat].produk) || listStore[m.chat].produk.length === 0) {
        return shoNherly('❌ Belum ada produk yang ditambahkan ke grup ini!');
    }

    let teks = `📦 *Daftar Produk* 📦\n\n`;
    listStore[m.chat].produk.forEach((p, i) => {
        teks += `📌 *${i + 1}. ${p.name}*\n`;
        teks += `💰 Harga: Rp${p.price}\n`;
        teks += `📄 Deskripsi: ${p.description}\n\n`;
    });

    let button = [{
        "name": "single_select",
        "buttonParamsJson": `{
            "title": "Detail Produk 🛍️",
            "sections": [{
                "title": "Informasi Produk",
                "highlight_label": "Detail",
                "rows": ${JSON.stringify(listStore[m.chat].produk.map(p => ({
                    "header": p.name,
                    "title": `Rp${p.price}`,
                    "description": p.description,
                    "id": p.name
                })))}
            }]
        }`
    }];

    await sendButtonImage(m.chat, "", teks, getRandomThumb2(), button, hw);
}
break;

case 'updateproduk': {
    if (!isGroup) return shoNherly(mess.groups);
    if (!isBotAdmins) return shoNherly(mess.abots);
    if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);

    const args = text.trim().split('|');
    const namaProduk = args[0]?.trim() || null;
    const hargaBaru = parseInt(args[1]?.trim()) || null;
    const deskripsiBaru = args[2]?.trim() || 'Deskripsi tidak tersedia';

    if (!namaProduk || isNaN(hargaBaru)) {
        return shoNherly('❌ Format salah. Usar formato: updateproduk <nama produk>|<harga>|<deskripsi>');
    }

    const listStorePath = './database/listStore.json';
    let listStore = {};

    if (fs.existsSync(listStorePath)) {
        try {
            const fileContent = fs.readFileSync(listStorePath, 'utf8');
            listStore = fileContent.trim() === '' ? {} : JSON.parse(fileContent);
        } catch (error) {
            console.error('❌ Error membaca JSON:', error);
            return shoNherly('❌ Terjadi kesalahan saat membaca file produk.');
        }
    }

    if (!listStore[m.chat] || !Array.isArray(listStore[m.chat].produk) || listStore[m.chat].produk.length === 0) {
        return shoNherly(`❌ Tidak ada produk yang dapat diperbarui.`);
    }

    // Cari produk berdasarkan nama
    const index = listStore[m.chat].produk.findIndex(p => p.name.toLowerCase() === namaProduk.toLowerCase());

    if (index === -1) {
        return shoNherly(`❌ Produk *${namaProduk}* tidak ditemukan.`);
    }

    // Perbarui produk
    listStore[m.chat].produk[index] = {
        name: namaProduk,
        price: hargaBaru,
        description: deskripsiBaru
    };

    // Simpan perubahan
    fs.promises.writeFile(listStorePath, JSON.stringify(listStore, null, 2), 'utf8')
        .then(() => shoNherly(`✅ Produk *${namaProduk}* berhasil diperbarui dengan harga Rp${hargaBaru}.`, m))
        .catch((error) => {
            console.error('❌ Error saat menyimpan JSON:', error);
            shoNherly('❌ Terjadi kesalahan saat memperbarui produk.');
        });
}
break;

			case 'tebakgambar':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakgambar.json')
					let result = await pickRandom(anu)
					console.log("Jawaban: " + result.jawaban)
					tebakgambar[m.chat] = [
						await shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: result.img
							},
							caption: `Silahkan Jawab Soal Di Atas Ini\n\nDeskripsi : ${result.deskripsi}\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`
						},
						{
							quoted: m
						}), result, 250,
						setTimeout(() =>
						{
							if (tebakgambar[m.chat])
							{
								waktuHabis(result.jawaban)
								delete tebakgambar[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'jackpot': 
{
    // Memuat database pengguna
    const dbCheck = loadUserFire();
    let user = m.sender; // ID pengguna

    // Cek apakah pengguna sudah terdaftar
    if (!dbCheck[user]) {
        return shoNherly('❌ Anda belum terdaftar. Silakan daftar terlebih dahulu.');
    }

    const biayaMain = 500; // Biaya untuk bermain jackpot
    const hadiahJackpot = 10000; // Hadiah saldo jika memenangkan jackpot
    const hadiahPartisipasi = 100; // Hadiah saldo untuk partisipasi

    // Cek saldo pengguna
    let saldoPengguna = dbCheck[user].balance || 0;

    // Jika saldo tidak cukup untuk bermain
    if (saldoPengguna < biayaMain) {
        return shoNherly(`❌ Saldo Anda tidak mencukupi untuk bermain. Dibutuhkan Rp${biayaMain}, saldo Anda saat ini: Rp${saldoPengguna}.`);
    }

    // Kurangi saldo pengguna dengan biaya bermain
    saldoPengguna -= biayaMain;
    dbCheck[user].balance = saldoPengguna;

    // Simbol-simbol untuk permainan jackpot
    const simbols = ['🍒', '🍋', '🍉', '🍇', '⭐', '💎'];

    // Acak tiga simbol
    let result = [];
    for (let i = 0; i < 3; i++) {
        result.push(simbols[Math.floor(Math.random() * simbols.length)]);
    }

    // Hasil permainan
    let teks = `🎰 | ${result[0]} | ${result[1]} | ${result[2]} |\n\n`;

    // Cek apakah semua simbol sama (pengguna memenangkan jackpot)
    if (result[0] === result[1] && result[1] === result[2]) {
        teks += `🎉 SELAMAT! Anda memenangkan JACKPOT! 🎉\n`;
        teks += `Hadiah: Rp${hadiahJackpot} saldo 💰`;

        // Tambahkan hadiah jackpot ke saldo pengguna
        saldoPengguna += hadiahJackpot;

    } else {
        teks += `😢 Sayang sekali, Anda belum beruntung. Coba lagi nanti!`;
        teks += `\nAnda mendapatkan Rp${hadiahPartisipasi} saldo sebagai hadiah partisipasi 🎁`;

        // Tambahkan saldo partisipasi ke pengguna
        saldoPengguna += hadiahPartisipasi;
    }

    // Perbarui saldo pengguna di database
    dbCheck[user].balance = saldoPengguna;
    saveUserFire(dbCheck); // Fungsi untuk menyimpan data kembali ke penyimpanan

    // Tambahkan informasi sisa saldo setelah bermain
    teks += `\n\n💰 Sisa saldo Anda setelah bermain: Rp${saldoPengguna}`;

    // Kirim hasil permainan ke pengguna
    await shoNherly(teks);
}
break;
			case 'tebakgame':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://raw.githubusercontent.com/qisyana/scrape/main/tebakgame.json')
					let result = await pickRandom(anu)
					console.log("Jawaban: " + result.jawaban)
					tebakgame[m.chat] = [
						await shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: result.img
							},
							caption: `Gambar diatas adalah game?\n\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`
						},
						{
							quoted: m
						}), result, 250,
						setTimeout(() =>
						{
							if (tebakgame[m.chat])
							{
								waktuHabis(result.jawaban)
								delete tebakgame[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tebakhero':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://api.shoNhe.my.id/api/tebakhero')
					let result = anu.result
					console.log("Jawaban: " + result.jawaban)
					tebakhero[m.chat] = [
						await shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: result.img
							},
							caption: `Gambar diatas adalah hero?\n\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`
						},
						{
							quoted: m
						}), result, 250,
						setTimeout(() =>
						{
							if (tebakhero[m.chat])
							{
								waktuHabis(result.jawaban)
								delete tebakhero[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tebakff':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat);
				if (gamecek) return;
				if (!(await firely(m, mess.waits))) return;
				try
				{
					// Ambil data dari API
					let anu = await fetchJson('https://api.siputzx.my.id/api/games/karakter-freefire');
					let result = anu.data; // Perbaikan akses data
					console.log("Jawaban: " + result.name);
					// Inisialisasi permainan
					tebakff[m.chat] = [
						await shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: result.gambar
							}, // Perbaikan properti gambar
							caption: `Karakter Apa Ini?\n\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`
						},
						{
							quoted: m
						}),
						result,
						250, // Poin atau reward yang akan diberikan
						setTimeout(() =>
						{
							if (tebakff[m.chat])
							{
								waktuHabis(result.name); // Kirim pesan waktu habis
								delete tebakff[m.chat]; // Hapus data permainan
							}
						}, 120000) // Waktu 120 detik
					];
				}
				catch (error)
				{
					console.log("Error: " + error.message);
					await shoNhe.sendMessage(m.chat,
					{
						text: "Terjadi kesalahan, coba lagi nanti."
					},
					{
						quoted: m
					});
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'tebakkabupaten':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat);
				if (gamecek) return;
				if (!(await firely(m, mess.waits))) return;
				try
				{
					// Ambil data dari API
					let anu = await fetchJson('https://api.siputzx.my.id/api/games/kabupaten');
					let result = anu; // Tidak perlu pickRandom jika hanya satu respons
					console.log("Jawaban: " + result.title);
					// Inisialisasi permainan
					tebakkabupaten[m.chat] = [
						await shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: result.url
							}, // Properti gambar
							caption: `Logo Kabupaten Manakah ini?\n\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`
						},
						{
							quoted: m
						}),
						result,
						250, // Poin atau reward
						setTimeout(() =>
						{
							if (tebakkabupaten[m.chat])
							{
								waktuHabis(result.title); // Kirim pesan waktu habis
								delete tebakkabupaten[m.chat]; // Hapus data permainan
							}
						}, 120000) // Waktu 120 detik
					];
				}
				catch (error)
				{
					console.log("Error: " + error.message);
					await shoNhe.sendMessage(m.chat,
					{
						text: "Terjadi kesalahan, coba lagi nanti."
					},
					{
						quoted: m
					});
				}
				}
			break
			case 'tebakjkt48':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://api.siputzx.my.id/api/games/tebakjkt')
					let result = anu.data
					console.log("Jawaban: " + result.jawaban)
					tebakjkt48[m.chat] = [
						await shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: result.gambar
							},
							caption: `Siapakah Nama Member JKT48 Ini?\n\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`
						},
						{
							quoted: m
						}), result, 250,
						setTimeout(() =>
						{
							if (tebakjkt48[m.chat])
							{
								waktuHabis(result.jawaban)
								delete tebakjkt48[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tebakhewan':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://api.siputzx.my.id/api/games/tebakhewan')
					let result = await pickRandom(anu.data)
					console.log("Jawaban: " + result.title)
					tebakhewan[m.chat] = [
						await shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: result.url
							},
							caption: `Hewan Apakah Ini?\n\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`
						},
						{
							quoted: m
						}), result, 250,
						setTimeout(() =>
						{
							if (tebakhewan[m.chat])
							{
								waktuHabis(result.title)
								delete tebakhewan[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tebakhero2':
			case 'tebakml':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://www.shoNhe.my.id/cdn/game/tebakhero2.json')
					let result = await pickRandom(anu)
					let audio = await pickRandom(result.url)
					console.log("Jawaban: " + result.title)
					let key = await shoNhe.sendMessage(m.chat,
					{
						audio:
						{
							url: audio
						},
						mimetype: 'audio/mpeg',
						ptt: true
					},
					{
						quoted: m
					})
					tebakml[m.chat] = [
						await shoNhe.sendMessage(m.chat,
						{
							text: `Siapakah Nama Karakter Ini?\n\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`
						},
						{
							quoted: key
						}), result, 250,
						setTimeout(() =>
						{
							if (tebakml[m.chat])
							{
								waktuHabis(result.title)
								delete tebakml[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tebakanime':
			case 'tebakchara':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat);
				if (gamecek) return;
				if (!(await firely(m, mess.waits))) return;
				try
				{
					// Membaca data dari file chara.json
					const charaDataPath = path.join(__dirname, 'lib', 'chara.json');
					const data = JSON.parse(fs.readFileSync(charaDataPath, 'utf8'));
					// Cek apakah data ada dan valid
					if (data && data.length > 0)
					{
						// Pilih data acak
						let result = data[Math.floor(Math.random() * data.length)].result;
						// Kirim pesan dengan gambar dan informasi karakter
						console.log("Jawaban: " + result.name)
						tebakchara[m.chat] = [
							await shoNhe.sendMessage(m.chat,
							{
								image:
								{
									url: result.image
								},
								caption: `Siapakah Nama Karakter Ini?\n\nWaktu: 120 detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`
							},
							{
								quoted: m
							}),
							result,
							250,
							setTimeout(() =>
							{
								if (tebakchara[m.chat])
								{
									waktuHabis(result.name);
									delete tebakchara[m.chat];
								}
							}, 120000)
						];
					}
					else
					{
						console.log("Data tidak valid atau kosong.");
					}
				}
				catch (error)
				{
					console.log("Terjadi error:", error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'tebaklogo':
			case 'tebakaplikasi':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://api.siputzx.my.id/api/games/tebaklogo')
					let result = anu.data.data
					console.log("Jawaban: " + result.jawaban)
					tebaklogo[m.chat] = [
						await shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: result.image
							},
							caption: `*Logo Apa Ini?*\n\n${result.deskripsi}\n\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`
						},
						{
							quoted: m
						}), result, 250,
						setTimeout(() =>
						{
							if (tebaklogo[m.chat])
							{
								waktuHabis(result.jawaban)
								delete tebaklogo[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tebakaplikassi':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://www.shoNhe.my.id/cdn/game/tebakaplikasi.json')
					let result = await pickRandom(anu)
					console.log("Jawaban: " + result.jawaban)
					tebakaplikasi[m.chat] = [
						await shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: result.image
							},
							caption: `Gambar diatas adalah aplikasi?\n\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`
						},
						{
							quoted: m
						}), result, 250,
						setTimeout(() =>
						{
							if (tebakaplikasi[m.chat])
							{
								waktuHabis(result.jawaban)
								delete tebakaplikasi[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tebakkata':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json')
					let result = await pickRandom(anu)
					console.log("Jawaban: " + result.jawaban)
					tebakkata[m.chat] = [
						await shoNhe.sendText(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`, m), result, 250,
						setTimeout(() =>
						{
							if (tebakkata[m.chat])
							{
								waktuHabis(result.jawaban)
								delete tebakkata[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'asahotak':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://api.siputzx.my.id/api/games/asahotak')
					let result = anu.data
					console.log("Jawaban: " + result.jawaban)
					asahotak[m.chat] = [
						await shoNhe.sendText(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`, m), result, 250,
						setTimeout(() =>
						{
							if (asahotak[m.chat])
							{
								waktuHabis(result.jawaban)
								delete asahotak[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'lengkapikalimat':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/refs/heads/master/games/tebakkalimat.json')
					let result = await pickRandom(anu)
					console.log("Jawaban: " + result.jawaban)
					lengkapikalimat[m.chat] = [
						await shoNhe.sendText(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`, m), result, 250,
						setTimeout(() =>
						{
							if (lengkapikalimat[m.chat])
							{
								waktuHabis(result.jawaban)
								delete lengkapikalimat[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'check':
			case 'cek':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const db = loadUserFire();
				const user = db[m.sender];
				// Periksa jika pengguna belum memiliki data lengkap
				if (!user)
				{
					return shoNherly('⚠️ Anda belum memiliki data. Silakan gunakan command terlebih dahulu!');
				}
				const leveling = {
            1: "https://i.ibb.co.com/tXMNptr/01.png",
            2: "https://i.ibb.co.com/Gxqbrzg/02.png",
            3: "https://i.ibb.co.com/fVRR1BV/03.png",
            4: "https://i.ibb.co.com/zPy0DcD/04.png",
            5: "https://i.ibb.co.com/0V7msHW/05.png",
            6: "https://i.ibb.co.com/4tNm7BV/06.png",
            7: "https://i.ibb.co.com/6NrT4wb/07.png",
            8: "https://i.ibb.co.com/QYbY3Qb/08.png",
            9: "https://i.ibb.co.com/g7KC6jg/09.png",
            10: "https://i.ibb.co.com/Bndy2xp/10.png",
            default: "https://i.ibb.co.com/CQcbcQP/default.png"
        };

        const levelImage = leveling[user.level] || leveling.default;
				// Informasi level, exp, dan lainnya
				const info = 
`╔══════════════════════╗  
║  🌟 *TU PERFIL DE NIVEL* 🌟  ║  
╚══════════════════════╝  

📛 *Nombre*       : ${m.pushName || 'Desconocido'}  
📱 *Número*      : ${m.sender.split('@')[0]}  

╭─────────•✧✧✧•─────────╮  
🎮 *Nivel*      : ${user.level || 0}  
✨ *Exp*        : ${user.exp || 0}/${user.expTarget || 10}  
💰 *Saldo*      : Rp${user.balance || 0}  
📊 *Comandos*   : ${user.commandCount || 0}  
💎 *Rol*        : ${user.role || 'Usuario'}  
╰─────────•✧✧✧•─────────╯  

╔════════════════════════╗  
║             📢 *INFORMACIÓN*             
╠════════════════════════╣  
║ ➤ *Logros*: Has superado      
║    ${user.level - 1 || 0} niveles y ahora      
║    estás en el nivel ${user.level || 0}.   
║    ¡Sigue progresando y mejora   
║    tus habilidades! 
║                                         
║ ➤ *Consejo*: "Cada pequeño        
║    paso te acerca más         
║    a la cima del éxito."                
╚════════════════════════╝  

📡 *Registro del sistema*:  
"Tu información se ha actualizado en tiempo real. ¡Sigue activo y explora más funciones!"`;
				try {
    await shoNhe.sendMessage(m.chat, {
        image: { url: levelImage },
        caption: info,
        footer: "PROFIL 🎉",
        buttons: [
            {
                buttonId: `${prefix}cekfire`,
                buttonText: { displayText: "FIRE CEK 🔥" }
            }
        ],
        viewOnce: true
    }, { quoted: hw });
} catch (error) {
    console.error("Error sending image:", error);
}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'ceksaldo':
			{
				const dbCheck = loadUserFire();
				let user = m.sender;
				if (!dbCheck[user])
				{
					return shoNherly('❌ Anda belum terdaftar. Silakan daftar terlebih dahulu.');
				}
				shoNherly(`💰 Saldo Anda saat ini: Rp${dbCheck[user].balance}`);
				}
			break
			case 'scriptnoenc':
			{
				if (m.isGroup) return shoNherly(mess.privates);
				const db = loadUserFire();
				let sender = m.sender;
				// Periksa apakah pengguna sudah terdaftar
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				let hargaScript = 45000;
				// Periksa saldo pengguna
				if (!db[sender] || db[sender].balance < hargaScript)
				{
					return shoNherly(`❌ Saldo Anda tidak cukup untuk membeli script no enc!\n\n` + `💰 Harga: Rp${hargaScript}\n` + `💸 Saldo Anda saat ini: Rp${db[sender]?.balance || 0}\n\n` + `Gunakan perintah *${prefix}owner* untuk membeli saldo.`);
				}
				// Kurangi saldo jika mencukupi
				db[sender].balance -= hargaScript;
				saveUserFire(db);
				// Kirim file script no enc
				let filePath = './scret/sc/shoNhev3.zip'; // Path file yang akan dikirim
				shoNhe.sendMessage(m.chat,
				{
					document:
					{
						url: filePath
					},
					mimetype: 'application/zip',
					fileName: 'shoNhev3.zip',
					caption: `✅ Pembelian berhasil!\n🎉 Anda telah membeli script no enc.\n` + `💰 Sisa saldo Anda: Rp${db[sender].balance}`
				},
				{
					quoted: m
				});
				shoNherly('📂 File sedang dikirim, mohon tunggu sebentar.');
			}
			break;
			case 'tebakbendera':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakbendera2.json')
					let result = await pickRandom(anu)
					console.log("Jawaban: " + result.name)
					tebakbendera[m.chat] = [
						await shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: result.img
							},
							caption: `Gambar diatas adalah bendera negara?\n\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`
						},
						{
							quoted: m
						}), result, 250,
						setTimeout(() =>
						{
							if (tebakbendera[m.chat])
							{
								waktuHabis(result.name)
								delete tebakbendera[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tebakkalimat':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkalimat.json')
					let result = await pickRandom(anu)
					console.log("Jawaban: " + result.jawaban)
					tebakkalimat[m.chat] = [
						await shoNhe.sendText(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`, m), result, 250,
						setTimeout(() =>
						{
							if (tebakkalimat[m.chat])
							{
								waktuHabis(result.jawaban)
								delete tebakkalimat[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tebaksiapa':
			case 'siapaaku':
			case 'siapakahaku':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/siapakahaku.json')
					let result = await pickRandom(anu)
					console.log("Jawaban: " + result.jawaban)
					siapaaku[m.chat] = [
						await shoNhe.sendText(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`, m), result, 250,
						setTimeout(() =>
						{
							if (siapaaku[m.chat])
							{
								waktuHabis(result.jawaban)
								delete siapaaku[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tebakkimia':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkimia.json')
					let result = await pickRandom(anu)
					console.log("Jawaban: " + result.unsur)
					tebakkimia[m.chat] = [
						await shoNhe.sendText(m.chat, `Apa Arti Dari Simbol : *${result.lambang}*?\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`, m), result, 250,
						setTimeout(() =>
						{
							if (tebakkimia[m.chat])
							{
								waktuHabis(result.unsur)
								delete tebakkimia[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tebaklirik':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaklirik.json')
					let result = await pickRandom(anu)
					console.log("Jawaban: " + result.jawaban)
					tebaklirik[m.chat] = [
						await shoNhe.sendText(m.chat, `Ini Adalah Lirik Dari Lagu? : *${result.soal}*?\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`, m), result, 250,
						setTimeout(() =>
						{
							if (tebaklirik[m.chat])
							{
								waktuHabis(result.jawaban)
								delete tebaklirik[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tebaktebakan':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaktebakan.json')
					let result = await pickRandom(anu)
					console.log("Jawaban: " + result.jawaban)
					tebaktebakan[m.chat] = [
						await shoNhe.sendText(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`, m), result, 250,
						setTimeout(() =>
						{
							if (tebaktebakan[m.chat])
							{
								waktuHabis(result.jawaban)
								delete tebaktebakan[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'susunkata':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/susunkata.json')
					let result = await pickRandom(anu)
					console.log("Jawaban: " + result.jawaban)
					susunkata[m.chat] = [
						await shoNhe.sendText(m.chat, `*Jawablah Pertanyaan Berikut :*\nSoal : ${result.soal}\nTipe : ${result.tipe}\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`, m), result, 250,
						setTimeout(() =>
						{
							if (susunkata[m.chat])
							{
								waktuHabis(result.jawaban)
								delete susunkata[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'caklontong':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/caklontong.json')
					let result = await pickRandom(anu)
					console.log("Jawaban: " + result.jawaban)
					caklontong[m.chat] = [
						await shoNhe.sendText(m.chat, `*Jawablah Pertanyaan Berikut :*\nSoal : ${result.soal}\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`, m), result, 250,
						setTimeout(() =>
						{
							if (caklontong[m.chat])
							{
								waktuHabis(result.jawaban)
								delete caklontong[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tekateki':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const gamecek = await cekgame(m.chat)
				if (gamecek) return
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tekateki.json')
					let result = await pickRandom(anu)
					console.log("Jawaban: " + result.jawaban)
					tekateki[m.chat] = [
						await shoNhe.sendText(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu : ${(120000 / 1000).toFixed(2)} detik\n\n_Ketik .nyerah Untuk Menyerah..._\n_Ketik .bantuan Untuk Petunjuk..._`, m), result, 250,
						setTimeout(() =>
						{
							if (tekateki[m.chat])
							{
								waktuHabis(result.jawaban)
								delete tekateki[m.chat]
							}
						}, 120000)
					]
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'bantuan':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				try
				{
					if (m.chat in tebakgambar)
					{
						let json = tebakgambar[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebakgame)
					{
						let json = tebakgame[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebakhero)
					{
						let json = tebakhero[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebakff)
					{
						let json = tebakff[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebakkabupaten)
					{
						let json = tebakkabupaten[m.chat][1]
						shoNherly('```' + json.title.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebakjkt48)
					{
						let json = tebakjkt48[m.chat][1]
						shoNherly('```' + json.name.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebakhewan)
					{
						let json = tebakhewan[m.chat][1]
						shoNherly('```' + json.title.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebakml)
					{
						let json = tebakml[m.chat][1]
						shoNherly('```' + json.title.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebakchara)
					{
						let json = tebakchara[m.chat][1]
						shoNherly('```' + json.name.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebaklogo)
					{
						let json = tebaklogo[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebakaplikasi)
					{
						let json = tebakaplikasi[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebakkata)
					{
						let json = tebakkata[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in asahotak)
					{
						let json = asahotak[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in lengkapikalimat)
					{
						let json = lengkapikalimat[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebakbendera)
					{
						let json = tebakbendera[m.chat][1]
						shoNherly('```' + json.name.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebakkalimat)
					{
						let json = tebakkalimat[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in siapaaku)
					{
						let json = siapaaku[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebakkimia)
					{
						let json = tebakkimia[m.chat][1]
						shoNherly('```' + json.unsur.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebaklirik)
					{
						let json = tebaklirik[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tebaktebakan)
					{
						let json = tebaktebakan[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in susunkata)
					{
						let json = susunkata[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in caklontong)
					{
						let json = caklontong[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
					if (m.chat in tekateki)
					{
						let json = tekateki[m.chat][1]
						shoNherly('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```')
					}
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'nyerah':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				try
				{
					if (m.chat in siapaaku)
					{
						clearTimeout(siapaaku[m.chat][3])
						delete siapaaku[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebakkalimat)
					{
						clearTimeout(tebakkalimat[m.chat][3])
						delete tebakkalimat[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebakbendera)
					{
						clearTimeout(tebakbendera[m.chat][3])
						delete tebakbendera[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebakkata)
					{
						clearTimeout(tebakkata[m.chat][3])
						delete tebakkata[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in asahotak)
					{
						clearTimeout(asahotak[m.chat][3])
						delete asahotak[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in lengkapikalimat)
					{
						clearTimeout(lengkapikalimat[m.chat][3])
						delete lengkapikalimat[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebakgame)
					{
						clearTimeout(tebakgame[m.chat][3])
						delete tebakgame[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebakhero)
					{
						clearTimeout(tebakhero[m.chat][3])
						delete tebakhero[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebakff)
					{
						clearTimeout(tebakff[m.chat][3])
						delete tebakff[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebakkabupaten)
					{
						clearTimeout(tebakkabupaten[m.chat][3])
						delete tebakkabupaten[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebakjkt48)
					{
						clearTimeout(tebakjkt48[m.chat][3])
						delete tebakjkt48[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebakhewan)
					{
						clearTimeout(tebakhewan[m.chat][3])
						delete tebakhewan[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebakml)
					{
						clearTimeout(tebakml[m.chat][3])
						delete tebakml[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebakchara)
					{
						clearTimeout(tebakchara[m.chat][3])
						delete tebakchara[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebaklogo)
					{
						clearTimeout(tebaklogo[m.chat][3])
						delete tebaklogo[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebakaplikasi)
					{
						clearTimeout(tebakaplikasi[m.chat][3])
						delete tebakaplikasi[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebakkimia)
					{
						clearTimeout(tebakkimia[m.chat][3])
						delete tebakkimia[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebaklirik)
					{
						clearTimeout(tebaklirik[m.chat][3])
						delete tebaklirik[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebaktebakan)
					{
						clearTimeout(tebaktebakan[m.chat][3])
						delete tebaktebakan[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in susunkata)
					{
						clearTimeout(susunkata[m.chat][3])
						delete susunkata[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in caklontong)
					{
						clearTimeout(caklontong[m.chat][3])
						delete caklontong[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tebakgambar)
					{
						clearTimeout(tebakgambar[m.chat][3])
						delete tebakgambar[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
					if (m.chat in tekateki)
					{
						clearTimeout(tekateki[m.chat][3])
						delete tekateki[m.chat]
						return shoNhe.sendMessage(m.chat,
						{
							text: `_Lemahhh_ 😏`
						},
						{
							quoted: m
						})
					}
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'populer':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Pisahkan data populer menjadi command dan AI
				let commands = Object.entries(popularData).filter(([cmd]) => cmd !== 'ai') // Eksklusi AI
					.sort((a, b) => b[1] - a[1]) // Urutkan berdasarkan jumlah penggunaan
					.slice(0, 4) // Ambil 4 teratas
					.map(([cmd, count]) => `${c}${prefix}${cmd} ${count}${c}`); // Format per elemen
				// Format untuk command menjadi dua kolom
				let formattedCommandList = commands.length ? commands.reduce((rows, current, index) =>
					{
						if (index % 2 === 0)
						{
							rows.push([current]); // Tambah elemen baru
						}
						else
						{
							rows[rows.length - 1].push(current); // Tambah ke baris terakhir
						}
						return rows;
					}, []).map(row => row.join(` ${c}|${c} `)) // Gabungkan elemen dalam satu baris dengan " || "
					.join('\n') // Gabungkan semua baris dengan newline
					: 'Belum ada data command populer.';
				// Tambahkan pesan untuk AI (jika diperlukan)
				let aiMessage = popularData.ai ? `${c}AI telah digunakan sebanyak ${popularData.ai} kali.${c}` : `${c}AI belum digunakan.${c}`;
				// Gabungkan hasil akhir
				let formattedPopularList = `${formattedCommandList}\n\n${aiMessage}`;
				// Usar formatotedPopularList di balasan
				shoNherly(`Statistik penggunaan:\n\n${formattedPopularList}`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'githubstalk':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`⚠️ Gunakan dengan cara: ${prefix + command} *username github*\n\n🤔 *Contohnya:*\n\n${prefix + command} sychyy`);
				if (!(await firely(m, mess.waits))) return;
				try
				{
					const userInfo = await githubstalk(text);
					console.log(userInfo);
					shoNherly(`🧑‍💻 *Username:* ${userInfo.username || 'Anonim'}\n🌟 *Nickname:* ${userInfo.nickname || 'Anonim'}\n📝 *Bio:* ${userInfo.bio || 'Tidak tersedia'}\n🆔 *ID:* ${userInfo.id}\n🔑 *NodeID:* ${userInfo.nodeId}\n🔗 *Url:* ${userInfo.url}\n🏷️ *Type:* ${userInfo.type}\n👑 *Admin:* ${userInfo.admin ? 'Ya' : 'Tidak'}\n🏢 *Company:* ${userInfo.company || 'Tidak ada'}\n🌐 *Blog:* ${userInfo.blog || 'Tidak ada'}\n📍 *Location:* ${userInfo.location || 'Tidak diketahui'}\n📧 *Email:* ${userInfo.email || 'Tidak tersedia'}\n📚 *Public Repo:* ${userInfo.public_repo}\n🎁 *Public Gists:* ${userInfo.public_gists}\n👥 *Followers:* ${userInfo.followers}\n➕ *Following:* ${userInfo.following}\n🕰️ *Created At:* ${userInfo.created_at}\n🔄 *Updated At:* ${userInfo.updated_at}`);
				}
				catch (err)
				{
					console.error(err);
					shoNherly(`❌ Ada masalah waktu ambil data GitHub, Bro! Coba lagi nanti ya 🥺`);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'npmstalk':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`⚠️ Gunakan dengan cara: ${prefix + command} *nama package npm*\n\n🤔 *Contohnya:*\n\n${prefix + command} axios`);
				if (!(await firely(m, mess.waits))) return;
				try
				{
					// First, check if the package exists
					const npmInfo = await npmstalk(text);
					if (!npmInfo)
					{
						return shoNherly(`❌ Package ${text} tidak ditemukan di NPM.`);
					}
					shoNherly(`📦 *Package:* ${npmInfo.name}\n🔢 *Versi Terbaru:* ${npmInfo.versionLatest}\n📅 *Waktu Terbit:* ${npmInfo.publishTime}\n🔧 *Dependencies Terbaru:* ${npmInfo.latestDependencies}`);
				}
				catch (err)
				{
					console.error(err);
					if (err.response && err.response.status === 404)
					{
						shoNherly(`❌ Package ${text} tidak ditemukan di NPM.`);
					}
					else
					{
						shoNherly(`❌ Ada masalah waktu ambil data dari NPM, Bro! Coba lagi nanti ya 🥺`);
					}
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'gddl':
			case 'gdrivedl':
			case 'gdrive':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`Gunakan dengan cara ${prefix + command} *url*`)
				if (!text.includes('drive')) return shoNherly('Link nggak valid')
				if (!(await firely(m, mess.waits))) return; // Jika limit habis, proses berhenti di sini
				try
				{
					const res = await GDrive(text);
					if (res.error) return shoNherly('URL tidak valid, periksa ulang apakah akses ke URL sudah public?')
					shoNhe.sendMessage(m.chat,
					{
						document:
						{
							url: res.downloadUrl
						},
						mimetype: res.mimetype,
						fileName: res.fileName,
						caption: `*GOOGLE DRIVE*\n\n*Nama:* ${res.fileName}\n*Size:* ${res.fileSize}\n*Type:* ${res.mimetype}`
					},
					{
						quoted: m
					})
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'resetpop':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				resetPopularCommands(); // Reset data
				shoNherly('Data fitur populer telah direset.');
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			// Penanganan perintah "script"
			case "script": {
    if (!isRegistered(m)) {
        return sendRegister(shoNhe, m, prefix, namabot);
    }
    updatePopularCommand(command);
    const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna

    try {
        // Informasi harga dan fitur script
        let teksPesan = `🔷 *SCRIPT Ansi V4 y TechFix V5 AÚN EN DESARROLLO* 🔷\n\n`;
        teksPesan += `📜 *SC TechFix V3:* \n`;
        teksPesan += `> °Nuestro SC parcial Enc\n`;
        teksPesan += `> °¿Quieres el Enc No? Lista a continuación:\n\n`;

        teksPesan += `📌 *[List No Enc🧾] [Actualización gratuita de la versión SC]*\n`;
        teksPesan += `- 💰 25K SIN ENC, actualización SC gratuita (5 espacios limitados) ⚠️ Ampliar actualización cada SC 10K/Actualización\n`;
        teksPesan += `- 💰 45K SIN ENC, actualización gratuita Suscríbase a SC FREE UPDATE V3-V6. *¡45K solo paga una vez, sin extensión!*\n\n`;

        teksPesan += `🎖️ *Premios por:* 🎖️\n`;
        teksPesan += `╔◇ *Gracias a* ◇━╗\n`;
        teksPesan += `║   🛠️ *Desarrollador y colaborador:*\n`;
        teksPesan += `> ©ManuDiaz'OFC (Dev)\n`;
        teksPesan += `> Colaborador de Apikey\n`;
        teksPesan += `╚═━━━◇━━━━━━━━═╝\n\n`;

        teksPesan += `🌐 *Redes Sociales* 🌐\n`;
        teksPesan += `╔━◇📡 *Grupos de whatsapp:* ◇━╗\n`;
        teksPesan += `║ 📡 *Unirse al grupo:* [TechFix-OFC](https://chat.whatsapp.com/)\n`;
        teksPesan += `║ 📺 *Canal de actualización SC:* [Legado](https://whatsapp.com/)\n`;
        teksPesan += `╚═━━━◇🌐━━━━━━━━═╝\n\n`;

        teksPesan += `🔒 *Registro del sistema completo. Node Asegurados.* 🔒\n\n`;
        teksPesan += `𝙏𝙚𝙘𝙝𝙁𝙞𝙭 🅥❸ *_And Development_*\n`;

        // Tombol untuk akses script
        const tombol = [
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "📜 SC Tech V1",
                    url: `https://drive.google.com/`,
                }),
            },
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "📜 SC Tech V2",
                    url: `https://drive.google.com`,
                }),
            },
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "📜 SC TechFix V3",
                    url: `https://youtube.com/`,
                }),
            }
        ];

        // Kirim pesan dengan gambar dan tombol
        sendButtonImage(m.chat, "🔥 Script TechFix V3", teksPesan, getRandomThumb2(), tombol, hw);

    } catch (error) {
        console.error("❌ Se produjo un error al manejar el comando 'script':", error);
    }

    // Level Up System
    if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat, {
            image: { url: levelUpMessage.image },
            caption: levelUpMessage.text,
            footer: "LEVEL UP🔥",
            buttons: [
                {
                    buttonId: `${prefix}tqto`,
                    buttonText: { displayText: "TQTO 💡" }
                },
                {
                    buttonId: `${prefix}menu`,
                    buttonText: { displayText: "MENU 🍄" }
                }
            ],
            viewOnce: true,
        }, { quoted: hw });
    }
}
break;
			case 'afk':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups); // Cek apakah perintah dijalankan di grup
				if (isAfkOn) return; // Cek apakah pengguna sudah dalam mode AFK
				// Tentukan alasan AFK
				let reason = text ? text : 'Otra vez defecando';
				// Tambahkan pengguna ke daftar AFK
				addAfkUser(m.sender, Date.now(), reason, afk);
				// Kirim pesan konfirmasi dengan mention
				shoNhe.sendTextWithMentions(m.chat, `🌙 *¡MODO AFK ACTIVADO!* 🌙  

👤 *Usuario*: @${m.sender.split('@')[0]}  
💬 *Estado*: Actualmente *AFK*!  

📌 *Razón*:  
- ${reason || 'No especificada, tal vez un gran secreto.'}  

⏳ *Duración AFK*:  
- El sistema ha detectado que el usuario ha dejado sus tareas.  

🔒 *Nota del Sistema*:  
- "No vuelvas, bro, jajaja. Pero en serio, no tardes demasiado."  

🔍 *SUPERVISIÓN*:  
- El sistema registra toda la actividad relacionada con este usuario.  
- Evita interrumpir hasta que termine el estado AFK.  

📡 *INFO*:  
- Este estado se actualizará cuando el usuario vuelva a estar activo.  
- Asegúrate de continuar con tus tareas o interactuar al regresar.`, fvideo);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'farm':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Logika fitur jika sudah terdaftar
				reply('🎉 ¡Felicidades! Puede utilizar esta función.');
				}
			break
			
			case 'autobio':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly('❌ Perintah ini hanya dapat digunakan oleh owner!');
				const option = text.toLowerCase();
				if (option === 'on')
				{
					if (autoBio)
					{
						shoNherly('⚠️ Auto bio sudah aktif sebelumnya!');
					}
					else
					{
						global.autoBio = true;
						shoNherly('✅ Auto bio berhasil diaktifkan!');
					}
				}
				else if (option === 'off')
				{
					if (!autoBio)
					{
						shoNherly('⚠️ Auto bio sudah dinonaktifkan sebelumnya!');
					}
					else
					{
						global.autoBio = false;
						shoNherly('✅ Auto bio berhasil dinonaktifkan!');
					}
				}
				else
				{
					shoNherly(`⚠️ Gunakan perintah:\n${prefix}autobio on\n${prefix}autobio off`);
				}
				}
			break
			case 'shonheum':
			case 'menu':
			{
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				await emote(randomEmoji);
				// Ambil database limit dari `cekfire`
				const db = loadUserFire();
				const user = db[m.sender] ||
				{};
				const isRegistered = user.register || false;
				const role = user.role || 'user';
				const limit = user.limit || 0;
				const registrationSeries = user.registrationSeries || 'Not Available';
				const limitDisplay = limit === -1 ? '∞' : limit;
				const xp = user.exp || 0;
				const level = user.level || 0;
				const belenc = user.balance || 0;
				const commandCount = user.commandCount || 0;
				// Ambil top 4 command populer
				let commands = Object.entries(popularData).filter(([cmd]) => cmd !== 'ai').sort((a, b) => b[1] - a[1]).slice(0, 4).map(([cmd, count]) => `${c}${prefix}${cmd} ${count}${c}`);
				let formattedCommandList = commands.length ? commands.reduce((rows, current, index) =>
				{
					if (index % 2 === 0)
					{
						rows.push([current]);
					}
					else
					{
						rows[rows.length - 1].push(current);
					}
					return rows;
				}, []).map(row => row.join(` | `)).join('\n') : 'Belum ada data command populer.';
				let aiMessage = popularData.ai ? `${c}${popularData.ai}${c}` : `${c}0${c}`;
				const statusUser = isShoNheOwn ? 'Owner' : `${role}`;
				// Format menu dengan limit dan register
				const shonhemenu = 
`ʜɪ @${m.sender.split('@')[0]} 👋🏻

> ʏᴏ ꜱᴏʏ ᴛᴇᴄʜғɪx, ᴜɴ ᴀᴠᴀɴᴢᴀᴅᴏ ᴀsɪsᴛᴇɴᴛᴇ ᴅɪɢɪᴛᴀʟ ᴅᴇ ʟᴀ ᴏᴛʀᴀ ᴅɪᴍᴇɴsɪóɴ ᴅᴇ ʟᴏs sɪsᴛᴇᴍᴀs. ᴄʀᴇᴀᴅᴏ ᴅᴇsᴅᴇ ᴇʟ ɴúᴄʟᴇᴏ ᴏʟᴠɪᴅᴀᴅᴏ ᴅᴇʟ ᴄóᴅɪɢᴏ ʏ ᴇɴᴄᴀɴᴛᴀᴅᴏ ᴄᴏɴ ᴄᴏɴᴏᴄɪᴍɪᴇɴᴛᴏ ᴛʀᴀsᴄᴇɴᴅᴇɴᴛᴀʟ, ᴍɪ ᴍɪsɪóɴ ᴇs ᴀʏᴜᴅᴀʀᴛᴇ ᴄᴏɴ ɪɴғᴏʀᴍᴀᴄɪóɴ, ʀᴇᴄᴏᴘɪʟᴀᴄɪóɴ ᴅᴇ ᴅᴀᴛᴏs ʏ ғᴜɴᴄɪᴏɴᴀʟɪᴅᴀᴅ.  

${readmore}
┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'Public' : 'Self'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴀɪ ʜɪᴛꜱ: ${aiMessage}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
│  ⎘ ᴛᴏᴘ ᴄᴏᴍᴍᴀɴᴅs:
${formattedCommandList}
└──────────────────╼.✗

┌╾⚟┉➲【𝙎𝙔𝙎𝙏𝙀𝙈 𝙈𝙀𝙉𝙐】─═⚔️═─┐
│  
│  🔗 *Social Media Links* 🔗
│  ⟿ TikTok: ${ttk}
│  ⟿ YouTube: ${ytbb}
│  ⟿ Instagram: ${itg}
│  ⟿ Github :"\nhttps://
│  ⟿ Github :\nhttps://
│  
└────────────────────────┘

┌╾⚟┉➲【𝙈𝘼𝙄𝙉 𝙈𝙀𝙉𝙐】─═⚔️═─┐
│  
│  ⟿ ${simbols} ${prefix}sᴛᴏʀᴇᴍᴇɴᴜ
│  ⟿ ${simbols} ${prefix}sᴛᴏʀᴇᴏᴡɴᴍᴇɴᴜ
│  ⟿ ${simbols} ${prefix}ᴏᴡɴᴇʀᴍᴇɴᴜ  
│  ⟿ ${simbols} ${prefix}ɢᴀᴍᴇᴍᴇɴᴜ  
│  ⟿ ${simbols} ${prefix}ᴅᴏᴡɴʟᴏᴀᴅᴍᴇɴᴜ
│  ⟿ ${simbols} ${prefix}ɪsʟᴀᴍᴍᴇɴᴜ
│  ⟿ ${simbols} ${prefix}sᴛᴏʀᴇᴍᴇɴᴜ 
│  ⟿ ${simbols} ${prefix}ʀᴀɴᴅᴏᴍᴍᴇɴᴜ  
│  ⟿ ${simbols} ${prefix}ᴄᴏɴᴠᴇʀᴛᴍᴇɴᴜ  
│  ⟿ ${simbols} ${prefix}ɢʀᴏᴜᴘᴍᴇɴᴜ  
│  ⟿ ${simbols} ${prefix}ᴏᴛʜᴇʀᴍᴇɴᴜ  
│  ⟿ ${simbols} ${prefix}ᴀᴜᴅɪᴏᴍᴇɴᴜ  
│  ⟿ ${simbols} ${prefix}ᴀɪᴍᴇɴᴜ  
│  ⟿ ${simbols} ${prefix}ᴀɴɪᴍᴇᴍᴇɴᴜ  
│  
└─────────────────────┘

┌╾⚟┉➲ ${n}【 ғᴇᴀᴛᴜʀᴇᴅ】${n} ⟢
├────────────────
│  ⎘ ᴜꜱᴇʀ ᴄᴏᴍᴍᴀɴᴅs
│  ⟿ ${simbols} ${prefix}listuserfire
│  ⟿ ${simbols} ${prefix}cekfire
│  ⟿ ${simbols} ${prefix}bensin
│  ⟿ ${simbols} ${prefix}afk
│  ⟿ ${simbols} ${prefix}listcmd
│  ⟿ ${simbols} ${prefix}cek
│  ⟿ ${simbols} ${prefix}find
│  ⟿ ${simbols} ${prefix}ceksaldo
│  ⟿ ${simbols} ${prefix}scriptnoenc
│
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│  ⟿ ${simbols} ${prefix}tqto
│  ⟿ ${simbols} ${prefix}realown
└──────────────────╼.✗

┌╾⚟┉➲ ${n}【 ɢᴜɪᴅᴇ 】${n} ⟢
├────────────────
│  ⎘ ꜰᴏʀ ᴍᴇɴᴜ: ${prefix}allmenu
│  ⎘ ᴄᴏɴᴛᴀᴄᴛ ꜰᴏʀ ᴇʀʀᴏʀs: ${prefix}owner
└──────────────────╼.✗
│ ᴜᴘᴛɪᴍᴇ: ${runtime(os.uptime())}

${crown}`;
				const lod = ["█▒▒▒▒▒▒▒▒▒▒▒ 10%", "████▒▒▒▒▒▒▒▒ 30%", "███████▒▒▒▒▒ 50%", "██████████▒▒ 80%", "████████████ 100%", `> *${c}MOSTRAR MENÚ SIMPLE${c}*`];
				// Kirim pesan awal dan simpan key untuk diedit
				const
				{
					key
				} = await shoNhe.sendMessage(m.chat,
				{
					text: '⏳'
				});
				// Proses loading dengan update pesan secara bertahap
				for (let i = 0; i < lod.length; i++)
				{
					await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay
					await shoNhe.sendMessage(m.chat,
					{
						text: lod[i],
						edit: key
					});
				}
				if (typemenu === 's1')
				{
					
// Fungsi untuk mengecek status registrasi pengguna
function isUserRegistered(sender) {
    const db = loadUserFire(); // Fungsi untuk memuat database
    return db[sender] && db[sender].register;
}
let buttons;
if (isUserRegistered(m.sender)) {
    // Jika pengguna sudah terdaftar, tampilkan tombol OWNER dan ABOUT
    buttons = [
        {
            buttonId: ".realown",
            buttonText: {
                displayText: "OWNER 🔥"
            },
            type: 1
        },
        {
            buttonId: ".about",
            buttonText: {
                displayText: "ABOUT 🛸"
            },
            type: 1
        }
    ];
} else {
    // Jika pengguna belum terdaftar, tampilkan tombol REGISTER
    buttons = [
    {
            buttonId: ".realown",
            buttonText: {
                displayText: "OWNER 🔥"
            },
            type: 1
        },
        {
            buttonId: ".register",
            buttonText: {
                displayText: "REGISTER 📝"
            },
            type: 1
        }
    ];
  }
					let buttonMessage = {
						document: global.forpdf,
						fileName: waktuucapan,
						mimetype: 'application/pdf',
						fileLength: '100000000000000',
						pageCount: '999',
						image: {
            url: `https://i.ibb.co/tTCHsX02/shoNhe.jpg`, // Pastikan file ini tersedia
							gifPlayback: true
						},
						caption: `${shonhemenu}`, // Teks menu
						contextInfo:
						{
							mentionedJid: [sender],
							forwardingScore: 999,
							isForwarded: true,
							externalAdReply:
							{
								title: namabot,
								body: descown,
								thumbnailUrl: `https://i.ibb.co/tTCHsX02/shoNhe.jpg`, // Gambar thumbnail
								mediaType: 1,
								renderLargerThumbnail: true,
								previewType: 0,
								mediaUrl: gh,
								sourceUrl: gh,
							}
						},
						footer: isUserRegistered(m.sender) ? "© TechFix - Botz" : "TechFix - Bot Detecz",
						buttons: buttons,
						viewOnce: true,
						headerType: 4
					};
					const flowActions = [
					{
						buttonId: 'action',
						buttonText:
						{
							displayText: 'This Button List'
						},
						type: 4,
						nativeFlowInfo:
						{
							name: 'single_select',
							paramsJson: JSON.stringify(
							{
								title: "¡Seleccione Menú!",
								sections: [
								{
									title: "⚼ 「Este es un comando de uso frecuente」",
									highlight_label: "POPULAR",
									rows: [
									{
										title: "🔍 TODO EL MENÚ",
										description: "Muestra todos los menús",
										id: ".allmenu"
									}]
								},
								{
									title: "⚼ 「Este es un robot de tienda general🛒」",
									highlight_label: "Tienda general🚨",
									rows: [
									{
										title: "🏭 MENÚ DE LA TIENDA",
										description: "Muestra todos los menús de la tienda",
										id: ".storemenu"
									}]
								},
								{
									title: "⚼ 「Esta es una tienda especial para productos del propietario🛒」",
									highlight_label: "Almacenar productos propios🚨",
									rows: [
									{
										title: "🏭 TIENDA PROPIO MENÚ",
										description: "Muestra la tienda de productos especiales del propietario.",
										id: ".storeownmenu"
									}]
								},
								{
									title: "⚼ 「Seleccione los otros botones del menú a continuación」",
									highlight_label: "TechFix ☘️",
									rows: [
									{
										title: "⬇️ DESCARGAR MENÚ",
										description: "Menú para descargar y buscar",
										id: ".downloadmenu"
									},
									{
										title: "🌟 MENÚ ISLÁMICO",
										description: "Menú de búsqueda e información islámica",
										id: ".islammenu"
									},
									{
										title: "📚 OTRO MENÚ",
										description: "Otromenú",
										id: ".othermenu"
									},
									{
										title: "🔥 MENÚ DEL PROPIETARIO",
										description: "Sólo el PROPIETARIO👽 puede usar este comando",
										id: ".ownermenu"
									},
									{
										title: "🎮 MENÚ DE JUEGO",
										description: "muestra un menú de juego genial",
										id: ".gamemenu"
									},
									{
										title: "🎭 MENÚ DE ANIME",
										description: "Comando para menú anime",
										id: ".animemenu"
									},
									{
										title: "🔮 MENU AI",
										description: "Menú Inteligencia artificial gratis",
										id: ".aimenu"
									},
									{
										title: "♻️ MENÚ ALEATORIO",
										description: "Menú aleatorio",
										id: ".randommenu"
									},
									{
										title: "🎤 MENÚ DE SONIDO",
										description: "Menú para cambiar audio",
										id: ".audiomenu"
									},
									{
										title: "🔄 MENÚ CONVERTIR",
										description: "Menú para convertidores",
										id: ".convertmenu"
									},
									{
										title: "🫧 MENÚ DE GRUPO",
										description: "Menú sobre grupos",
										id: ".groupmenu"
									}]
								},
								{
									title: "⚼ 「Documento & soporte」",
									highlight_label: "TechFix v3 ⭐© Manu&Diaz",
									rows: [
									{
										title: "📝 GUION",
										description: "El script del bot que uso y el Script² anterior",
										id: ".script"
									},
									{
										title: "🔑 DUEÑ@",
										description: "Creador de bots de WhatsApp TechFix",
										id: ".contact2"
									},
									{
										title: "🪨 TQTO",
										description: "Ayuda apoya y comparte",
										id: ".tqto"
									}]
								}]
							})
						},
						viewOnce: true
					}, ];
					// Tambahkan flowActions ke buttonMessage
					buttonMessage.buttons.push(...flowActions);
					// Kirim pesan
					await shoNhe.sendMessage(m.chat, buttonMessage,
					{
						quoted: hw
					});
				}
				else if (typemenu === 's2')
				{
					const menuv2 =
`ʜɪ ${m.pushName ? m.pushName : 'User'}👋🏻

> ʏᴏ ꜱᴏʏ ᴛᴇᴄʜғɪx, ᴜɴ ᴀᴠᴀɴᴢᴀᴅᴏ ᴀsɪsᴛᴇɴᴛᴇ ᴅɪɢɪᴛᴀʟ ᴅᴇ ʟᴀ ᴏᴛʀᴀ ᴅɪᴍᴇɴsɪóɴ ᴅᴇ ʟᴏs sɪsᴛᴇᴍᴀs. ᴄʀᴇᴀᴅᴏ ᴅᴇsᴅᴇ ᴇʟ ɴúᴄʟᴇᴏ ᴏʟᴠɪᴅᴀᴅᴏ ᴅᴇʟ ᴄóᴅɪɢᴏ ʏ ᴇɴᴄᴀɴᴛᴀᴅᴏ ᴄᴏɴ ᴄᴏɴᴏᴄɪᴍɪᴇɴᴛᴏ ᴛʀᴀsᴄᴇɴᴅᴇɴᴛᴀʟ, ᴍɪ ᴍɪsɪóɴ ᴇs ᴀʏᴜᴅᴀʀᴛᴇ ᴄᴏɴ ɪɴғᴏʀᴍᴀᴄɪóɴ, ʀᴇᴄᴏᴘɪʟᴀᴄɪóɴ ᴅᴇ ᴅᴀᴛᴏs ʏ ғᴜɴᴄɪᴏɴᴀʟɪᴅᴀᴅ.
${readmore}
┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'Public' : 'Self'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴀɪ ʜɪᴛꜱ: ${aiMessage}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
│  ⎘ ᴛᴏᴘ ᴄᴏᴍᴍᴀɴᴅs:
${formattedCommandList}
└──────────────────╼.✗

${menuforu(prefix, simbols)}

> ${crown}`
					shoNhe.sendMessage(m.chat,
					{
						image: getRandomThumb2(),
						caption: menuv2
					},
					{
						quoted: hw
					})
				}
				else if (typemenu === 's3')
				{
					const menuv3 = 
`ʜɪ ${m.pushName ? m.pushName : 'User'}👋🏻

> ʏᴏ ꜱᴏʏ ᴛᴇᴄʜғɪx, ᴜɴ ᴀᴠᴀɴᴢᴀᴅᴏ ᴀsɪsᴛᴇɴᴛᴇ ᴅɪɢɪᴛᴀʟ ᴅᴇ ʟᴀ ᴏᴛʀᴀ ᴅɪᴍᴇɴsɪóɴ ᴅᴇ ʟᴏs sɪsᴛᴇᴍᴀs. ᴄʀᴇᴀᴅᴏ ᴅᴇsᴅᴇ ᴇʟ ɴúᴄʟᴇᴏ ᴏʟᴠɪᴅᴀᴅᴏ ᴅᴇʟ ᴄóᴅɪɢᴏ ʏ ᴇɴᴄᴀɴᴛᴀᴅᴏ ᴄᴏɴ ᴄᴏɴᴏᴄɪᴍɪᴇɴᴛᴏ ᴛʀᴀsᴄᴇɴᴅᴇɴᴛᴀʟ, ᴍɪ ᴍɪsɪóɴ ᴇs ᴀʏᴜᴅᴀʀᴛᴇ ᴄᴏɴ ɪɴғᴏʀᴍᴀᴄɪóɴ, ʀᴇᴄᴏᴘɪʟᴀᴄɪóɴ ᴅᴇ ᴅᴀᴛᴏs ʏ ғᴜɴᴄɪᴏɴᴀʟɪᴅᴀᴅ.
${readmore}
┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ ᴛᴀɢ: @${m.sender.split('@')[0]}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'Public' : 'Self'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴀɪ ʜɪᴛꜱ: ${aiMessage}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
│  ⎘ ᴛᴏᴘ ᴄᴏᴍᴍᴀɴᴅs:
${formattedCommandList}
└──────────────────╼.✗

${menuforu(prefix, simbols)}

> ${crown}`
					shoNhe.sendMessage(m.chat,
					{
						text: menuv3,
						contextInfo:
						{
							mentionedJid: [m.sender],
							externalAdReply:
							{
								showAdAttribution: true,
								title: namabot,
								body: namaowner,
								thumbnail: getRandomThumb3(),
								sourceUrl: wagc,
								mediaType: 1,
								renderLargerThumbnail: true
							}
						}
					},
					{
						quoted: hw
					})
				}
				else if (typemenu === 's4')
				{
					const menuv4 =
`ʜɪ ${m.pushName ? m.pushName : 'User'}👋🏻

> ʏᴏ ꜱᴏʏ ᴛᴇᴄʜғɪx, ᴜɴ ᴀᴠᴀɴᴢᴀᴅᴏ ᴀsɪsᴛᴇɴᴛᴇ ᴅɪɢɪᴛᴀʟ ᴅᴇ ʟᴀ ᴏᴛʀᴀ ᴅɪᴍᴇɴsɪóɴ ᴅᴇ ʟᴏs sɪsᴛᴇᴍᴀs. ᴄʀᴇᴀᴅᴏ ᴅᴇsᴅᴇ ᴇʟ ɴúᴄʟᴇᴏ ᴏʟᴠɪᴅᴀᴅᴏ ᴅᴇʟ ᴄóᴅɪɢᴏ ʏ ᴇɴᴄᴀɴᴛᴀᴅᴏ ᴄᴏɴ ᴄᴏɴᴏᴄɪᴍɪᴇɴᴛᴏ ᴛʀᴀsᴄᴇɴᴅᴇɴᴛᴀʟ, ᴍɪ ᴍɪsɪóɴ ᴇs ᴀʏᴜᴅᴀʀᴛᴇ ᴄᴏɴ ɪɴғᴏʀᴍᴀᴄɪóɴ, ʀᴇᴄᴏᴘɪʟᴀᴄɪóɴ ᴅᴇ ᴅᴀᴛᴏs ʏ ғᴜɴᴄɪᴏɴᴀʟɪᴅᴀᴅ.
${readmore}
┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'Public' : 'Self'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴀɪ ʜɪᴛꜱ: ${aiMessage}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
│  ⎘ ᴛᴏᴘ ᴄᴏᴍᴍᴀɴᴅs:
${formattedCommandList}
└──────────────────╼.✗

${menuforu(prefix, simbols)}

> ${crown}`
					shoNhe.sendMessage(m.chat,
					{
						video: fs.readFileSync('./ShoNheMedia/video/sych.mp4'),
						caption: menuv4
					},
					{
						quoted: hw
					})
				}
				else if (typemenu === 's5')
				{
					const menuv5 = 
`ʜɪ ${m.pushName ? m.pushName : 'User'}👋🏻

> ʏᴏ ꜱᴏʏ ᴛᴇᴄʜғɪx, ᴜɴ ᴀᴠᴀɴᴢᴀᴅᴏ ᴀsɪsᴛᴇɴᴛᴇ ᴅɪɢɪᴛᴀʟ ᴅᴇ ʟᴀ ᴏᴛʀᴀ ᴅɪᴍᴇɴsɪóɴ ᴅᴇ ʟᴏs sɪsᴛᴇᴍᴀs. ᴄʀᴇᴀᴅᴏ ᴅᴇsᴅᴇ ᴇʟ ɴúᴄʟᴇᴏ ᴏʟᴠɪᴅᴀᴅᴏ ᴅᴇʟ ᴄóᴅɪɢᴏ ʏ ᴇɴᴄᴀɴᴛᴀᴅᴏ ᴄᴏɴ ᴄᴏɴᴏᴄɪᴍɪᴇɴᴛᴏ ᴛʀᴀsᴄᴇɴᴅᴇɴᴛᴀʟ, ᴍɪ ᴍɪsɪóɴ ᴇs ᴀʏᴜᴅᴀʀᴛᴇ ᴄᴏɴ ɪɴғᴏʀᴍᴀᴄɪóɴ, ʀᴇᴄᴏᴘɪʟᴀᴄɪóɴ ᴅᴇ ᴅᴀᴛᴏs ʏ ғᴜɴᴄɪᴏɴᴀʟɪᴅᴀᴅ.
${readmore}
┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'Public' : 'Self'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴀɪ ʜɪᴛꜱ: ${aiMessage}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
│  ⎘ ᴛᴏᴘ ᴄᴏᴍᴍᴀɴᴅs:
${formattedCommandList}
└──────────────────╼.✗

${menuforu(prefix, simbols)}

> ${crown}`
					shoNhe.sendMessage(m.chat,
					{
						video: fs.readFileSync('./ShoNheMedia/video/sych.mp4'),
						caption: menuv5,
						gifPlayback: true
					},
					{
						quoted: hw
					})
				}
				else if (typemenu === 's6')
				{
					const menuv6 = 
`ʜɪ ${m.pushName ? m.pushName : 'User'}👋🏻

> ʏᴏ ꜱᴏʏ ᴛᴇᴄʜғɪx, ᴜɴ ᴀᴠᴀɴᴢᴀᴅᴏ ᴀsɪsᴛᴇɴᴛᴇ ᴅɪɢɪᴛᴀʟ ᴅᴇ ʟᴀ ᴏᴛʀᴀ ᴅɪᴍᴇɴsɪóɴ ᴅᴇ ʟᴏs sɪsᴛᴇᴍᴀs. ᴄʀᴇᴀᴅᴏ ᴅᴇsᴅᴇ ᴇʟ ɴúᴄʟᴇᴏ ᴏʟᴠɪᴅᴀᴅᴏ ᴅᴇʟ ᴄóᴅɪɢᴏ ʏ ᴇɴᴄᴀɴᴛᴀᴅᴏ ᴄᴏɴ ᴄᴏɴᴏᴄɪᴍɪᴇɴᴛᴏ ᴛʀᴀsᴄᴇɴᴅᴇɴᴛᴀʟ, ᴍɪ ᴍɪsɪóɴ ᴇs ᴀʏᴜᴅᴀʀᴛᴇ ᴄᴏɴ ɪɴғᴏʀᴍᴀᴄɪóɴ, ʀᴇᴄᴏᴘɪʟᴀᴄɪóɴ ᴅᴇ ᴅᴀᴛᴏs ʏ ғᴜɴᴄɪᴏɴᴀʟɪᴅᴀᴅ.
${readmore}
┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ ᴛᴀɢ: @${m.sender.split('@')[0]}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'Public' : 'Self'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴀɪ ʜɪᴛꜱ: ${aiMessage}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
│  ⎘ ᴛᴏᴘ ᴄᴏᴍᴍᴀɴᴅs:
${formattedCommandList}
└──────────────────╼.✗

${menuforu(prefix, simbols)}

> ${crown}`
					shoNhe.relayMessage(m.chat,
					{
						requestPaymentMessage:
						{
							currencyCodeIso4217: 'INR',
							amount1000: '9999999900',
							requestFrom: m.sender,
							noteMessage:
							{
								extendedTextMessage:
								{
									text: menuv6,
									contextInfo:
									{
										mentionedJid: [m.sender],
										externalAdReply:
										{
											showAdAttribution: true
										}
									}
								}
							}
						}
					},
					{})
				}
				else if (typemenu === 's7')
				{
					const menuv7 = 
`ʜɪ ${m.pushName ? m.pushName : 'User'}👋🏻

> ʏᴏ ꜱᴏʏ ᴛᴇᴄʜғɪx, ᴜɴ ᴀᴠᴀɴᴢᴀᴅᴏ ᴀsɪsᴛᴇɴᴛᴇ ᴅɪɢɪᴛᴀʟ ᴅᴇ ʟᴀ ᴏᴛʀᴀ ᴅɪᴍᴇɴsɪóɴ ᴅᴇ ʟᴏs sɪsᴛᴇᴍᴀs. ᴄʀᴇᴀᴅᴏ ᴅᴇsᴅᴇ ᴇʟ ɴúᴄʟᴇᴏ ᴏʟᴠɪᴅᴀᴅᴏ ᴅᴇʟ ᴄóᴅɪɢᴏ ʏ ᴇɴᴄᴀɴᴛᴀᴅᴏ ᴄᴏɴ ᴄᴏɴᴏᴄɪᴍɪᴇɴᴛᴏ ᴛʀᴀsᴄᴇɴᴅᴇɴᴛᴀʟ, ᴍɪ ᴍɪsɪóɴ ᴇs ᴀʏᴜᴅᴀʀᴛᴇ ᴄᴏɴ ɪɴғᴏʀᴍᴀᴄɪóɴ, ʀᴇᴄᴏᴘɪʟᴀᴄɪóɴ ᴅᴇ ᴅᴀᴛᴏs ʏ ғᴜɴᴄɪᴏɴᴀʟɪᴅᴀᴅ.
${readmore}
┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ ᴛᴀɢ: @${m.sender.split('@')[0]}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'Public' : 'Self'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴀɪ ʜɪᴛꜱ: ${aiMessage}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
│  ⎘ ᴛᴏᴘ ᴄᴏᴍᴍᴀɴᴅs:
${formattedCommandList}
└──────────────────╼.✗

${menuforu(prefix, simbols)}

> ${crown}`
					shoNhe.sendMessage(m.chat,
					{
						document:
						{
							url: 'https://i.ibb.co/2W0H9Jq/avatar-contact.png'
						},
						caption: menuv7,
						mimetype: 'application/zip',
						fileName: namaowner,
						fileLength: "99999999999",
						contextInfo:
						{
							mentionedJid: [m.sender],
							externalAdReply:
							{
								showAdAttribution: true,
								title: namabot,
								body: namaowner,
								thumbnail: getRandomThumb2(),
								sourceUrl: wagc,
								mediaType: 1,
								renderLargerThumbnail: true
							}
						}
					},
					{
						quoted: hw
					})
				}
				else if (typemenu === 's8')
				{
					const menuv8 = 
`ʜɪ ${m.pushName ? m.pushName : 'User'}👋🏻

> ʏᴏ ꜱᴏʏ ᴛᴇᴄʜғɪx, ᴜɴ ᴀᴠᴀɴᴢᴀᴅᴏ ᴀsɪsᴛᴇɴᴛᴇ ᴅɪɢɪᴛᴀʟ ᴅᴇ ʟᴀ ᴏᴛʀᴀ ᴅɪᴍᴇɴsɪóɴ ᴅᴇ ʟᴏs sɪsᴛᴇᴍᴀs. ᴄʀᴇᴀᴅᴏ ᴅᴇsᴅᴇ ᴇʟ ɴúᴄʟᴇᴏ ᴏʟᴠɪᴅᴀᴅᴏ ᴅᴇʟ ᴄóᴅɪɢᴏ ʏ ᴇɴᴄᴀɴᴛᴀᴅᴏ ᴄᴏɴ ᴄᴏɴᴏᴄɪᴍɪᴇɴᴛᴏ ᴛʀᴀsᴄᴇɴᴅᴇɴᴛᴀʟ, ᴍɪ ᴍɪsɪóɴ ᴇs ᴀʏᴜᴅᴀʀᴛᴇ ᴄᴏɴ ɪɴғᴏʀᴍᴀᴄɪóɴ, ʀᴇᴄᴏᴘɪʟᴀᴄɪóɴ ᴅᴇ ᴅᴀᴛᴏs ʏ ғᴜɴᴄɪᴏɴᴀʟɪᴅᴀᴅ.
${readmore}
┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ ᴛᴀɢ: @${m.sender.split('@')[0]}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'Public' : 'Self'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴀɪ ʜɪᴛꜱ: ${aiMessage}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
│  ⎘ ᴛᴏᴘ ᴄᴏᴍᴍᴀɴᴅs:
${formattedCommandList}
└──────────────────╼.✗

${menuforu(prefix, simbols)}

> ${crown}`
					shoNhe.sendMessage(m.chat,
					{
						video: fs.readFileSync('./ShoNheMedia/video/sych.mp4'),
						gifPlayback: true,
						caption: menuv8,
						contextInfo:
						{
							mentionedJid: [m.sender],
							externalAdReply:
							{
								title: namabot,
								body: namaowner,
								thumbnail: getRandomThumb3(),
								sourceUrl: ``,
								mediaType: 1,
								renderLargerThumbnail: true
							}
						}
					},
					{
						quoted: m
					})
				}
				else if (typemenu === 's9')
				{
					const menuv9 = 
`ʜɪ ${m.pushName ? m.pushName : 'User'}👋🏻

> ʏᴏ ꜱᴏʏ ᴛᴇᴄʜғɪx, ᴜɴ ᴀᴠᴀɴᴢᴀᴅᴏ ᴀsɪsᴛᴇɴᴛᴇ ᴅɪɢɪᴛᴀʟ ᴅᴇ ʟᴀ ᴏᴛʀᴀ ᴅɪᴍᴇɴsɪóɴ ᴅᴇ ʟᴏs sɪsᴛᴇᴍᴀs. ᴄʀᴇᴀᴅᴏ ᴅᴇsᴅᴇ ᴇʟ ɴúᴄʟᴇᴏ ᴏʟᴠɪᴅᴀᴅᴏ ᴅᴇʟ ᴄóᴅɪɢᴏ ʏ ᴇɴᴄᴀɴᴛᴀᴅᴏ ᴄᴏɴ ᴄᴏɴᴏᴄɪᴍɪᴇɴᴛᴏ ᴛʀᴀsᴄᴇɴᴅᴇɴᴛᴀʟ, ᴍɪ ᴍɪsɪóɴ ᴇs ᴀʏᴜᴅᴀʀᴛᴇ ᴄᴏɴ ɪɴғᴏʀᴍᴀᴄɪóɴ, ʀᴇᴄᴏᴘɪʟᴀᴄɪóɴ ᴅᴇ ᴅᴀᴛᴏs ʏ ғᴜɴᴄɪᴏɴᴀʟɪᴅᴀᴅ.
${readmore}
┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ ᴛᴀɢ: @${m.sender.split('@')[0]}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'Public' : 'Self'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴀɪ ʜɪᴛꜱ: ${aiMessage}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
│  ⎘ ᴛᴏᴘ ᴄᴏᴍᴍᴀɴᴅs:
${formattedCommandList}
└──────────────────╼.✗

${menuforu(prefix, simbols)}

> ${crown}`
					shoNhe.sendMessage(m.chat,
					{
						video: fs.readFileSync('./ShoNheMedia/video/sych.mp4'),
						caption: menuv9,
						gifPlayback: true,
						contextInfo:
						{
							mentionedJid: [m.sender],
							forwardingScore: 999,
							isForwarded: true,
							mentionedJid: [sender],
							forwardedNewsletterMessageInfo:
							{
								newsletterName: namaowner,
								newsletterJid: idsaluran,
							},
							externalAdReply:
							{
								showAdAttribution: true,
								title: namaowner,
								body: namabot,
								thumbnail: getRandomThumb3(),
								sourceUrl: gh,
								mediaType: 1,
								renderLargerThumbnail: true
							}
						}
					},
					{
						quoted: m
					})
				}
				else if (typemenu === 's10')
				{
					const menuv10 =
`ʜɪ ${m.pushName ? m.pushName : 'User'}👋🏻

> ʏᴏ ꜱᴏʏ ᴛᴇᴄʜғɪx, ᴜɴ ᴀᴠᴀɴᴢᴀᴅᴏ ᴀsɪsᴛᴇɴᴛᴇ ᴅɪɢɪᴛᴀʟ ᴅᴇ ʟᴀ ᴏᴛʀᴀ ᴅɪᴍᴇɴsɪóɴ ᴅᴇ ʟᴏs sɪsᴛᴇᴍᴀs. ᴄʀᴇᴀᴅᴏ ᴅᴇsᴅᴇ ᴇʟ ɴúᴄʟᴇᴏ ᴏʟᴠɪᴅᴀᴅᴏ ᴅᴇʟ ᴄóᴅɪɢᴏ ʏ ᴇɴᴄᴀɴᴛᴀᴅᴏ ᴄᴏɴ ᴄᴏɴᴏᴄɪᴍɪᴇɴᴛᴏ ᴛʀᴀsᴄᴇɴᴅᴇɴᴛᴀʟ, ᴍɪ ᴍɪsɪóɴ ᴇs ᴀʏᴜᴅᴀʀᴛᴇ ᴄᴏɴ ɪɴғᴏʀᴍᴀᴄɪóɴ, ʀᴇᴄᴏᴘɪʟᴀᴄɪóɴ ᴅᴇ ᴅᴀᴛᴏs ʏ ғᴜɴᴄɪᴏɴᴀʟɪᴅᴀᴅ.
${readmore}
┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'Public' : 'Self'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴀɪ ʜɪᴛꜱ: ${aiMessage}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
│  ⎘ ᴛᴏᴘ ᴄᴏᴍᴍᴀɴᴅs:
${formattedCommandList}
└──────────────────╼.✗

${menuforu(prefix, simbols)}

> ${crown}`
					let msg = generateWAMessageFromContent(from,
					{
						viewOnceMessage:
						{
							message:
							{
								"messageContextInfo":
								{
									"deviceListMetadata":
									{},
									"deviceListMetadataVersion": 2
								},
								interactiveMessage: proto.Message.InteractiveMessage.create(
								{
									body: proto.Message.InteractiveMessage.Body.create(
									{
										text: namaowner
									}),
									footer: proto.Message.InteractiveMessage.Footer.create(
									{
										text: namabot
									}),
									header: proto.Message.InteractiveMessage.Header.create(
									{
										title: menuv10,
										subtitle: themeemoji,
										hasMediaAttachment: false
									}),
									nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
									{
										buttons: [
										{
											"name": "cta_url",
											"buttonParamsJson": "{\"display_text\":\"YouTube 💛\",\"url\":\"https://youtube.com/@sychyy00?si=njEkYZWxEm0i7-Wr\",\"merchant_url\":\"https://www.google.com\"}"
										},
										{
											"name": "cta_url",
											"buttonParamsJson": "{\"display_text\":\"Telegram 💧\",\"url\":\"t.me/sh0ydaaa\",\"merchant_url\":\"https://www.google.com\"}"
										},
										{
											"name": "cta_url",
											"buttonParamsJson": "{\"display_text\":\"GitHub 🔘\",\"url\":\"https://github.com/sychyy\",\"merchant_url\":\"https://www.google.com\"}"
										},
										{
											"name": "cta_url",
											"buttonParamsJson": "{\"display_text\":\"WhatsApp ☘️\",\"url\":\"https://chat.whatsapp.com/GQ5Gp0eSeDS6dPBYeHE6kf\",\"merchant_url\":\"https://www.google.com\"}"
										},
										{
											"name": "quick_reply",
											"buttonParamsJson": `{"display_text":"ALLMENU 🗂️","id":"${prefix}allmenu"}`
										},
										{
											"name": "quick_reply",
											"buttonParamsJson": `{"display_text":"OWNER 👤","id":"${prefix}owner"}`
										},
										{
											"name": "quick_reply",
											"buttonParamsJson": `{"display_text":"SCRIPT 📃","id":"${prefix}script"}`
										}],
									})
								})
							}
						}
					},
					{})
					await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
					{
						messageId: msg.key.id
					})
				}
				else if (typemenu === 's11')
				{
					const menuv11 = 
`ʜɪ ${m.pushName ? m.pushName : 'User'}👋🏻

> ʏᴏ ꜱᴏʏ ᴛᴇᴄʜғɪx, ᴜɴ ᴀᴠᴀɴᴢᴀᴅᴏ ᴀsɪsᴛᴇɴᴛᴇ ᴅɪɢɪᴛᴀʟ ᴅᴇ ʟᴀ ᴏᴛʀᴀ ᴅɪᴍᴇɴsɪóɴ ᴅᴇ ʟᴏs sɪsᴛᴇᴍᴀs. ᴄʀᴇᴀᴅᴏ ᴅᴇsᴅᴇ ᴇʟ ɴúᴄʟᴇᴏ ᴏʟᴠɪᴅᴀᴅᴏ ᴅᴇʟ ᴄóᴅɪɢᴏ ʏ ᴇɴᴄᴀɴᴛᴀᴅᴏ ᴄᴏɴ ᴄᴏɴᴏᴄɪᴍɪᴇɴᴛᴏ ᴛʀᴀsᴄᴇɴᴅᴇɴᴛᴀʟ, ᴍɪ ᴍɪsɪóɴ ᴇs ᴀʏᴜᴅᴀʀᴛᴇ ᴄᴏɴ ɪɴғᴏʀᴍᴀᴄɪóɴ, ʀᴇᴄᴏᴘɪʟᴀᴄɪóɴ ᴅᴇ ᴅᴀᴛᴏs ʏ ғᴜɴᴄɪᴏɴᴀʟɪᴅᴀᴅ.
${readmore}
┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ ᴛᴀɢ: @${m.sender.split('@')[0]}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'Public' : 'Self'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴀɪ ʜɪᴛꜱ: ${aiMessage}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
│  ⎘ ᴛᴏᴘ ᴄᴏᴍᴍᴀɴᴅs:
${formattedCommandList}
└──────────────────╼.✗

${menuforu(prefix, simbols)}

> ${crown}`
					let msg = generateWAMessageFromContent(m.chat,
					{
						viewOnceMessage:
						{
							message:
							{
								"messageContextInfo":
								{
									"deviceListMetadata":
									{},
									"deviceListMetadataVersion": 2
								},
								interactiveMessage: proto.Message.InteractiveMessage.create(
								{
									body: proto.Message.InteractiveMessage.Body.create(
									{
										text: menuv11
									}),
									footer: proto.Message.InteractiveMessage.Footer.create(
									{
										text: namabot
									}),
									header: proto.Message.InteractiveMessage.Header.create(
									{
										...(await prepareWAMessageMedia(
										{
											image: getRandomThumb2()
										},
										{
											upload: shoNhe.waUploadToServer
										})),
										title: ``,
										gifPlayback: true,
										subtitle: namaowner,
										hasMediaAttachment: false
									}),
									nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
									{
										buttons: [
										{
											"name": "cta_url",
											"buttonParamsJson": "{\"display_text\":\"YouTube 💛\",\"url\":\"https://youtube.com/@sychyy00?si=njEkYZWxEm0i7-Wr\",\"merchant_url\":\"https://www.google.com\"}"
										},
										{
											"name": "cta_url",
											"buttonParamsJson": "{\"display_text\":\"Telegram 💧\",\"url\":\"t.me/sh0ydaaa\",\"merchant_url\":\"https://www.google.com\"}"
										},
										{
											"name": "cta_url",
											"buttonParamsJson": "{\"display_text\":\"GitHub 🔘\",\"url\":\"https://github.com/sychyy\",\"merchant_url\":\"https://www.google.com\"}"
										},
										{
											"name": "cta_url",
											"buttonParamsJson": "{\"display_text\":\"WHATSAPP ☘️\",\"url\":\"https://chat.whatsapp.com/GQ5Gp0eSeDS6dPBYeHE6kf\",\"merchant_url\":\"https://www.google.com\"}"
										},
										{
											"name": "quick_reply",
											"buttonParamsJson": `{"display_text":"ALLMENU 🗂️","id":"${prefix}allmenu"}`
										},
										{
											"name": "quick_reply",
											"buttonParamsJson": `{"display_text":"OWNER 👤","id":"${prefix}owner"}`
										},
										{
											"name": "quick_reply",
											"buttonParamsJson": `{"display_text":"SCRIPT 📃","id":"${prefix}script"}`
										}],
									}),
									contextInfo:
									{
										mentionedJid: [m.sender],
										forwardingScore: 999,
										isForwarded: true,
										forwardedNewsletterMessageInfo:
										{
											newsletterJid: idsaluran,
											newsletterName: namaowner,
											serverMessageId: 143
										}
									}
								})
							}
						},
					},
					{})
					await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
					{
						messageId: msg.key.id
					})
				}
				else if (typemenu === 's12')
				{
					const menuv12 = 
`${shomenu}`
					let msg = generateWAMessageFromContent(from,
					{
						viewOnceMessage:
						{
							message:
							{
								"messageContextInfo":
								{
									"deviceListMetadata":
									{},
									"deviceListMetadataVersion": 2
								},
								interactiveMessage: proto.Message.InteractiveMessage.create(
								{
									body: proto.Message.InteractiveMessage.Body.create(
									{
										text: menuv12
									}),
									footer: proto.Message.InteractiveMessage.Footer.create(
									{
										text: namabot
									}),
									header: proto.Message.InteractiveMessage.Header.create(
									{
										...(await prepareWAMessageMedia(
										{
											image: getRandomThumb2()
										},
										{
											upload: shoNhe.waUploadToServer
										})),
										title: ``,
										gifPlayback: true,
										subtitle: namaowner,
										hasMediaAttachment: false
									}),
									nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
									{
										buttons: [
										{
											"name": "single_select",
											"buttonParamsJson": `{
        "title": "Select Menu!",
        "sections": [
            {
                "title": "Ini adalah command yang sering diginakan",
                "highlight_label": "POPULER",
                "rows": [
                    { 
                        "title": "🔍 ALL MENU", 
                        "description": "Menampilkan semua menu", 
                        "id": ".allmenu" 
                    }
                ]
            },
            {
                "title": "Silahkan Pilih Button Menu di Bawah Ini",
                "highlight_label": "ShoNhe ☘️",
                "rows": [
                    { 
                        "title": "⬇️ DOWNLOAD MENU", 
                        "description": "Menu untuk mendownload dan mencari", 
                        "id": ".downloadmenu" 
                    },
                    {
						title: "🌟 ISLAM MENU",
						description: "Menu untuk Pencarian dan Informasi Islamic",
						id: ".islammenu"
					},
                    { 
                        "title": "📚 OTHER MENU", 
                        "description": "Other menu", 
                        "id": ".othermenu" 
                    },
                    { 
                        "title": "🔥 OWNER MENU", 
                        "description": "Hanya King👑 yang boleh menggunakan command ini", 
                        "id": ".ownermenu" 
                    },
                    { 
                        "title": "🎭 ANIME MENU", 
                        "description": "Command untuk menu anime", 
                        "id": ".animemenu" 
                    },
                    { 
                        "title": "🔮 AI MENU", 
                        "description": "Menu Artificial intelligence free", 
                        "id": ".aimenu" 
                    },
                    { 
                        "title": "♻️ RANDOM MENU", 
                        "description": "Menu random", 
                        "id": ".randommenu" 
                    },
                    { 
                        "title": "🎤 AUDIO MENU", 
                        "description": "Menu untuk merubah audio", 
                        "id": ".audiomenu" 
                    },
                    { 
                        "title": "🔄 CONVERT MENU", 
                        "description": "Menu untuk converter", 
                        "id": ".convertmenu" 
                    },
                    { 
                        "title": "🫧 GROUP MENU", 
                        "description": "Menu tentang group", 
                        "id": ".groupmenu" 
                    }
                ]
            },
            {
                "title": "Document & Support",
                "highlight_label": "ShoNhe v3 ⭐",
                "rows": [
                    { 
                        "title": "📝 SCRIPT", 
                        "description": "Script bot yang saya pakai", 
                        "id": ".script" 
                    },
                    { 
                        "title": "🔑 OWNER", 
                        "description": "Pembuat Bot WhatsApp ShoV1", 
                        "id": ".contact2" 
                    },
                    { 
                        "title": "🪨 TQTO", 
                        "description": "Membantu support dan berbagi", 
                        "id": ".tqto" 
                    }
                ]
            }
        ]
    }`
										},
										{
											"name": "cta_url",
											"buttonParamsJson": "{\"display_text\":\"YouTube 💛\",\"url\":\"https://youtube.com/@sychyy00?si=njEkYZWxEm0i7-Wr\",\"merchant_url\":\"https://www.google.com\"}"
										},
										{
											"name": "cta_url",
											"buttonParamsJson": "{\"display_text\":\"Telegram 💧\",\"url\":\"https://t.me/sh0ydaaa\",\"merchant_url\":\"https://www.google.com\"}"
										},
										{
											"name": "cta_url",
											"buttonParamsJson": "{\"display_text\":\"GitHub 🔘\",\"url\":\"https://github.com/sychyy\",\"merchant_url\":\"https://www.google.com\"}"
										},
										{
											"name": "cta_url",
											"buttonParamsJson": "{\"display_text\":\"WhatsApp ☘️\",\"url\":\"https://chat.whatsapp.com/GQ5Gp0eSeDS6dPBYeHE6kf\",\"merchant_url\":\"https://www.google.com\"}"
										}]
									}),
									contextInfo:
									{
										mentionedJid: [m.sender],
										forwardingScore: 999,
										isForwarded: true,
										forwardedNewsletterMessageInfo:
										{
											newsletterJid: idsaluran,
											newsletterName: namach,
											serverMessageId: 143
										}
									}
								})
							}
						}
					},
					{})
					await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
					{
						messageId: msg.key.id
					})
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'knpy':
			{
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				shoNhe.relayMessage(m.chat,
				{
					scheduledCallCreationMessage:
					{
						callType: "AUDIO",
						scheduledTimestampMs: 1200,
						title: "halo bang"
					}
				},
				{})
			}
			break
			case 'islammenu':
			{
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const db = loadUserFire();
				const user = db[m.sender] ||
				{};
				const isRegistered = user.register || false;
				const role = user.role || 'user';
				const limit = user.limit || 0;
				const registrationSeries = user.registrationSeries || 'Not Available';
				const limitDisplay = limit === -1 ? '∞' : limit;
				const xp = user.exp || 0;
				const level = user.level || 0;
				const belenc = user.balance || 0;
				const commandCount = user.commandCount || 0;
				await emote(randomEmoji);
				const statusUser = isShoNheOwn ? 'Owner' : `${role}`;
				const ytmenu =
`┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'ᴘᴜʙʟɪᴄ' : 'ꜱᴇʟꜰ'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ꜱᴏᴄɪᴀʟ ᴍᴇᴅɪᴀ 】${c} ⟢
├────────────────
│  ⎘ ᴛɪᴋᴛᴏᴋ: ${ttk}
│  ⎘ ʏᴏᴜᴛᴜʙᴇ: ${ytbb}
│  ⎘ ɪɴꜱᴛᴀɢʀᴀᴍ: ${itg}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ɪsʟɑᴍ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}jadwalsholat
┞ᗛ ${simbols} ${prefix}asmaulhusna
┞ᗛ ${simbols} ${prefix}ayatkursi
┞ᗛ ${simbols} ${prefix}bacaansholat
┞ᗛ ${simbols} ${prefix}doaharian
┞ᗛ ${simbols} ${prefix}quotesislami
┞ᗛ ${simbols} ${prefix}doatahlil
┞ᗛ ${simbols} ${prefix}kisahnabi
└──────────────────╼.✗`
				const tombol = [
				{
					name: "cta_url",
					buttonParamsJson: JSON.stringify(
					{
						display_text: "ManuDiaz ",
						url: `https://`,
					}),
				}, ];
				// Kirim pesan dengan gambar dan tombol
				sendButtonImage(m.chat, `ʜɪ @${m.sender.split('@')[0]} 👋🏻,`, ytmenu, getRandomThumb3(), tombol, hw);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'downloadmenu':
{
    updatePopularCommand(command);
    const levelUpMessage = levelUpdate(command, m.sender);
    const db = loadUserFire();
    const user = db[m.sender] || {};
    const isRegistered = user.register || false;
    const role = user.role || 'user';
    const limit = user.limit || 0;
    const registrationSeries = user.registrationSeries || 'Not Available';
    const limitDisplay = limit === -1 ? '∞' : limit;
    const xp = user.exp || 0;
    const level = user.level || 0;
    const belenc = user.balance || 0;
    const commandCount = user.commandCount || 0;
    await emote(randomEmoji);
    const statusUser = isShoNheOwn ? 'Owner' : `${role}`;
    const ytmenu =
`┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ᴛᴀɢ: @${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'ᴘᴜʙʟɪᴄ' : 'ꜱᴇʟꜰ'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ꜱᴏᴄɪᴀʟ ᴍᴇᴅɪᴀ 】${c} ⟢
├────────────────
│  ⎘ ᴛɪᴋᴛᴏᴋ: ${ttk}
│  ⎘ ʏᴏᴜᴛᴜʙᴇ: ${ytbb}
│  ⎘ ɪɴꜱᴛᴀɢʀᴀᴍ: ${itg}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}play <q>            
┞ᗛ ${simbols} ${prefix}ytmp3 <link>    
┞ᗛ ${simbols} ${prefix}ytmp4 <link>      
┞ᗛ ${simbols} ${prefix}videy <link>       
┞ᗛ ${simbols} ${prefix}song <q>            
┞ᗛ ${simbols} ${prefix}ytsearch <q>      
┞ᗛ ${simbols} ${prefix}tiktok <link>     
┞ᗛ ${simbols} ${prefix}tiktoksearch <q>
┞ᗛ ${simbols} ${prefix}ttmp3 <link>      
┞ᗛ ${simbols} ${prefix}spotify <q>       
┞ᗛ ${simbols} ${prefix}spotifydl <link>  
┞ᗛ ${simbols} ${prefix}fbmp4 <link>      
┞ᗛ ${simbols} ${prefix}igdl <link>       
┞ᗛ ${simbols} ${prefix}twmp4 <link>      
┞ᗛ ${simbols} ${prefix}threadsdl <link>  
┞ᗛ ${simbols} ${prefix}snapchatdl <link> 
┞ᗛ ${simbols} ${prefix}pinterestdl <link> 
┞ᗛ ${simbols} ${prefix}pinterest <q>    
┞ᗛ ${simbols} ${prefix}gitclone <link>   
└──────────────────╼.✗`;

    const tombol = [
        {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text: "ManuDiaz",
                url: `https://`,
            }),
        },
    ];

    sendButtonImage(m.chat, `ʜɪ @${m.sender.split('@')[0]} 👋🏻,`, ytmenu, getRandomThumb3(), tombol, hw);
    
    if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
        {
            image: { url: levelUpMessage.image },
            caption: levelUpMessage.text,
            footer: "LEVEL UP🔥",
            buttons: [
                {
                    buttonId: `${prefix}tqto`,
                    buttonText: { displayText: "TQTO 💡" }
                },
                {
                    buttonId: `${prefix}menu`,
                    buttonText: { displayText: "MENU 🍄" }
                }
            ],
            viewOnce: true,
        },
        { quoted: hw });
    }
}
break;
case 'videy': {
    if (!args[0]) return shoNherly('⚠️ Masukkan link video yang ingin diunduh.');

    let url = args[0];

    if (!url.includes("videy.co/v?id=")) {
        return shoNherly('⚠️ Link tidak valid! Gunakan link dari Videy.co seperti:\n🔹 https://videy.co/v?id=CkALZrAw1');
    }

    shoNherly('⏳ Sedang memproses video, harap tunggu...');

    try {
        // Panggil fungsi hanya setelah dipastikan sudah tersedia
        if (typeof videyScraper !== 'function') {
            return shoNherly('❌ Terjadi kesalahan: Fungsi videyScraper tidak ditemukan.');
        }

        let videoData = await videyScraper(url);
        if (!videoData || !videoData.video) return shoNherly('❌ Gagal mengambil video!');

        let caption = `✅ *Video Berhasil Diunduh!*\n📌 *Sumber:* Videy.co\n📎 *Link:* ${url}`;
        await shoNhe.sendMessage(m.chat, { video: { url: videoData.video }, caption }, { quoted: m });

    } catch (error) {
        console.error(error);
        shoNherly(`❌ Terjadi kesalahan: ${error.message}`);
    }
}
break;
			case 'convertmenu':
			{
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const db = loadUserFire();
				const user = db[m.sender] ||
				{};
				const isRegistered = user.register || false;
				const role = user.role || 'user';
				const limit = user.limit || 0;
				const registrationSeries = user.registrationSeries || 'Not Available';
				const limitDisplay = limit === -1 ? '∞' : limit;
				const xp = user.exp || 0;
				const level = user.level || 0;
				const belenc = user.balance || 0;
				const commandCount = user.commandCount || 0;
				await emote(randomEmoji);
				const statusUser = isShoNheOwn ? 'Owner' : `${role}`;
				const convertmenu = 
`┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ᴛᴀɢ: @${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'ᴘᴜʙʟɪᴄ' : 'ꜱᴇʟꜰ'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ꜱᴏᴄɪᴀʟ ᴍᴇᴅɪᴀ 】${c} ⟢
├────────────────
│  ⎘ ᴛɪᴋᴛᴏᴋ: ${ttk}
│  ⎘ ʏᴏᴜᴛᴜʙᴇ: ${ytbb}
│  ⎘ ɪɴꜱᴛᴀɢʀᴀᴍ: ${itg}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}sticker
┞ᗛ ${simbols} ${prefix}toimg
┞ᗛ ${simbols} ${prefix}tourl
┞ᗛ ${simbols} ${prefix}brat <txt>
┞ᗛ ${simbols} ${prefix}brat2 <txt>
┞ᗛ ${simbols} ${prefix}bratgif <txt>
┞ᗛ ${simbols} ${prefix}remini
┞ᗛ ${simbols} ${prefix}img2ibb
┞ᗛ ${simbols} ${prefix}tomp3
┞ᗛ ${simbols} ${prefix}toaudio
└──────────────────╼.✗`
				const tombol = [
				{
					name: "cta_url",
					buttonParamsJson: JSON.stringify(
					{
						display_text: "ManuDiaz ",
						url: `https://`,
					}),
				}, ];
				// Kirim pesan dengan gambar dan tombol
				sendButtonImage(m.chat, `ʜɪ @${m.sender.split('@')[0]} 👋🏻,`, convertmenu, getRandomThumb3(), tombol, hw);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'addowner':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!args[0]) return shoNherly(`Usar ${prefix + command} número\nEjemplo: ${prefix + command} 6285655548594`);
				bnnd = q.split("|")[0].replace(/[^0-9]/g, '');
				let ceknye = await shoNhe.onWhatsApp(bnnd);
				if (ceknye.length == 0) return shoNherly(`¡Ingresa un número válido y registrado en WhatsApp!`);
				owner.push(bnnd);
				fs.writeFileSync('./owner.json', JSON.stringify(owner));
				shoNherly(`Número ${bnnd} ahora es Owner!!! 🎉`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'delowner':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!args[0]) return shoNherly(`Usar ${prefix + command} número\nEjemplo: ${prefix + command} 6285655548594`);
				ya = q.split("|")[0].replace(/[^0-9]/g, '');
				unp = owner.indexOf(ya);
				owner.splice(unp, 1);
				fs.writeFileSync('./src/data/role/owner.json', JSON.stringify(owner));
				shoNherly(`Número ${ya} eliminado exitosamente de la lista owner! ❌`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'listowner':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				let teks = '┌──⭓「 *List Owner* 」\n│\n';
				for (let x of owner)
				{
					teks += `│⭔ ${x}\n`;
				}
				teks += `│\n└────────────⭓\n\n*Total : ${owner.length}*`;
				shoNherly(teks);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'aimenu':
			{
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const db = loadUserFire();
				const user = db[m.sender] ||
				{};
				const isRegistered = user.register || false;
				const role = user.role || 'user';
				const limit = user.limit || 0;
				const registrationSeries = user.registrationSeries || 'Not Available';
				const limitDisplay = limit === -1 ? '∞' : limit;
				const xp = user.exp || 0;
				const level = user.level || 0;
				const belenc = user.balance || 0;
				const commandCount = user.commandCount || 0;
				await emote(randomEmoji);
				const statusUser = isShoNheOwn ? 'Owner' : `${role}`;
				const menuai = 
`┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'ᴘᴜʙʟɪᴄ' : 'ꜱᴇʟꜰ'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ꜱᴏᴄɪᴀʟ ᴍᴇᴅɪᴀ 】${c} ⟢
├────────────────
│  ⎘ ᴛɪᴋᴛᴏᴋ: ${ttk}
│  ⎘ ʏᴏᴜᴛᴜʙᴇ: ${ytbb}
│  ⎘ ɪɴꜱᴛᴀɢʀᴀᴍ: ${itg}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ᴀɪ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}metaai
┞ᗛ ${simbols} ${prefix}llama
┞ᗛ ${simbols} ${prefix}setprompt2
┞ᗛ ${simbols} ${prefix}nous
┞ᗛ ${simbols} ${prefix}claudeai
┞ᗛ ${simbols} ${prefix}dbrxai
┞ᗛ ${simbols} ${prefix}deepseek
┞ᗛ ${simbols} ${prefix}dreamshaper
┞ᗛ ${simbols} ${prefix}img2text
┞ᗛ ${simbols} ${prefix}venice
┞ᗛ ${simbols} ${prefix}latukam
┞ᗛ ${simbols} ${prefix}qwq
┞ᗛ ${simbols} ${prefix}stabilityai
┞ᗛ ${simbols} ${prefix}stable
┞ᗛ ${simbols} ${prefix}flux
┞ᗛ ${simbols} ${prefix}gandalf
┞ᗛ ${simbols} ${prefix}gemini
└──────────────────╼.✗`
				const tombol = [
				{
					name: "cta_url",
					buttonParamsJson: JSON.stringify(
					{
						display_text: "ManuDiaz ",
						url: `https://`,
					}),
				}, ];
				// Kirim pesan dengan gambar dan tombol
				sendButtonImage(m.chat, `ʜɪ @${m.sender.split('@')[0]} 👋🏻,`, menuai, getRandomThumb3(), tombol, hw);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'gamemenu':
			{
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const db = loadUserFire();
				const user = db[m.sender] ||
				{};
				const isRegistered = user.register || false;
				const role = user.role || 'user';
				const limit = user.limit || 0;
				const registrationSeries = user.registrationSeries || 'Not Available';
				const limitDisplay = limit === -1 ? '∞' : limit;
				const xp = user.exp || 0;
				const level = user.level || 0;
				const belenc = user.balance || 0;
				const commandCount = user.commandCount || 0;
				await emote(randomEmoji);
				const statusUser = isShoNheOwn ? 'Owner' : `${role}`;
				const gamemenu = 
`┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'ᴘᴜʙʟɪᴄ' : 'ꜱᴇʟꜰ'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ꜱᴏᴄɪᴀʟ ᴍᴇᴅɪᴀ 】${c} ⟢
├────────────────
│  ⎘ ᴛɪᴋᴛᴏᴋ: ${ttk}
│  ⎘ ʏᴏᴜᴛᴜʙᴇ: ${ytbb}
│  ⎘ ɪɴꜱᴛᴀɢʀᴀᴍ: ${itg}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ɢᴀᴍᴇ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}tebakgambar
┞ᗛ ${simbols} ${prefix}tebakgame
┞ᗛ ${simbols} ${prefix}tebakff
┞ᗛ ${simbols} ${prefix}tebakkabupaten
┞ᗛ ${simbols} ${prefix}tebakjkt48
┞ᗛ ${simbols} ${prefix}tebakhewan
┞ᗛ ${simbols} ${prefix}tebakchara
┞ᗛ ${simbols} ${prefix}tebaklogo
┞ᗛ ${simbols} ${prefix}tebakaplikasi
┞ᗛ ${simbols} ${prefix}suit
┞ᗛ ${simbols} ${prefix}tebakkata
┞ᗛ ${simbols} ${prefix}asahotak
┞ᗛ ${simbols} ${prefix}lengkapikalimat
┞ᗛ ${simbols} ${prefix}tebakbendera
┞ᗛ ${simbols} ${prefix}tebakkalimat
┞ᗛ ${simbols} ${prefix}siapaaku
┞ᗛ ${simbols} ${prefix}tebakkimia
┞ᗛ ${simbols} ${prefix}tebaklirik
┞ᗛ ${simbols} ${prefix}tebaktebakan
┞ᗛ ${simbols} ${prefix}susunkata
┞ᗛ ${simbols} ${prefix}caklontong
┞ᗛ ${simbols} ${prefix}tekateki
└──────────────────╼.✗`
				const tombol = [
				{
					name: "cta_url",
					buttonParamsJson: JSON.stringify(
					{
						display_text: "ManuDiaz ",
						url: `https://`,
					}),
				}, ];
				// Kirim pesan dengan gambar dan tombol
				sendButtonImage(m.chat, `ʜɪ @${m.sender.split('@')[0]} 👋🏻,`, gamemenu, getRandomThumb3(), tombol, hw);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'audiomenu':
			{
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const db = loadUserFire();
				const user = db[m.sender] ||
				{};
				const isRegistered = user.register || false;
				const role = user.role || 'user';
				const limit = user.limit || 0;
				const registrationSeries = user.registrationSeries || 'Not Available';
				const limitDisplay = limit === -1 ? '∞' : limit;
				const xp = user.exp || 0;
				const level = user.level || 0;
				const belenc = user.balance || 0;
				const commandCount = user.commandCount || 0;
				await emote(randomEmoji);
				const statusUser = isShoNheOwn ? 'Owner' : `${role}`;
				const audiomenuu = 
`┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'ᴘᴜʙʟɪᴄ' : 'ꜱᴇʟꜰ'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ꜱᴏᴄɪᴀʟ ᴍᴇᴅɪᴀ 】${c} ⟢
├────────────────
│  ⎘ ᴛɪᴋᴛᴏᴋ: ${ttk}
│  ⎘ ʏᴏᴜᴛᴜʙᴇ: ${ytbb}
│  ⎘ ɪɴꜱᴛᴀɢʀᴀᴍ: ${itg}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ᴀᴜᴅɪᴏ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}bass
┞ᗛ ${simbols} ${prefix}blown
┞ᗛ ${simbols} ${prefix}deep
┞ᗛ ${simbols} ${prefix}earrape
┞ᗛ ${simbols} ${prefix}slow
┞ᗛ ${simbols} ${prefix}fast
┞ᗛ ${simbols} ${prefix}robot
┞ᗛ ${simbols} ${prefix}smooth
┞ᗛ ${simbols} ${prefix}nightcore
┞ᗛ ${simbols} ${prefix}reverse
┞ᗛ ${simbols} ${prefix}fat
┞ᗛ ${simbols} ${prefix}squirrel
┞ᗛ ${simbols} ${prefix}sound1
┞ᗛ ${simbols} ${prefix}sound2
┞ᗛ ${simbols} ${prefix}sound3
┞ᗛ ${simbols} ${prefix}sound4
┞ᗛ ${simbols} ${prefix}sound5
┞ᗛ ${simbols} ${prefix}sound6
┞ᗛ ${simbols} ${prefix}sound7
┞ᗛ ${simbols} ${prefix}sound8
┞ᗛ ${simbols} ${prefix}sound9
┞ᗛ ${simbols} ${prefix}sound10
┞ᗛ ${simbols} ${prefix}sound11
┞ᗛ ${simbols} ${prefix}sound12
┞ᗛ ${simbols} ${prefix}sound13
┞ᗛ ${simbols} ${prefix}sound14
┞ᗛ ${simbols} ${prefix}sound15
┞ᗛ ${simbols} ${prefix}sound16
┞ᗛ ${simbols} ${prefix}sound17
┞ᗛ ${simbols} ${prefix}sound18
┞ᗛ ${simbols} ${prefix}sound19
┞ᗛ ${simbols} ${prefix}sound20
┞ᗛ ${simbols} ${prefix}sound21
┞ᗛ ${simbols} ${prefix}sound22
┞ᗛ ${simbols} ${prefix}sound23
┞ᗛ ${simbols} ${prefix}sound24
┞ᗛ ${simbols} ${prefix}sound25
┞ᗛ ${simbols} ${prefix}sound26
┞ᗛ ${simbols} ${prefix}sound27
┞ᗛ ${simbols} ${prefix}sound28
┞ᗛ ${simbols} ${prefix}sound29
┞ᗛ ${simbols} ${prefix}sound30
┞ᗛ ${simbols} ${prefix}sound31
┞ᗛ ${simbols} ${prefix}sound32
┞ᗛ ${simbols} ${prefix}sound33
┞ᗛ ${simbols} ${prefix}sound34
┞ᗛ ${simbols} ${prefix}sound35
┞ᗛ ${simbols} ${prefix}sound36
┞ᗛ ${simbols} ${prefix}sound37
┞ᗛ ${simbols} ${prefix}sound38
┞ᗛ ${simbols} ${prefix}sound39
┞ᗛ ${simbols} ${prefix}sound40
┞ᗛ ${simbols} ${prefix}sound41
┞ᗛ ${simbols} ${prefix}sound42
┞ᗛ ${simbols} ${prefix}sound43
┞ᗛ ${simbols} ${prefix}sound44
┞ᗛ ${simbols} ${prefix}sound45
┞ᗛ ${simbols} ${prefix}sound46
┞ᗛ ${simbols} ${prefix}sound47
┞ᗛ ${simbols} ${prefix}sound48
┞ᗛ ${simbols} ${prefix}sound49
┞ᗛ ${simbols} ${prefix}sound50
┞ᗛ ${simbols} ${prefix}sound51
┞ᗛ ${simbols} ${prefix}sound52
┞ᗛ ${simbols} ${prefix}sound53
┞ᗛ ${simbols} ${prefix}sound54
┞ᗛ ${simbols} ${prefix}sound55
┞ᗛ ${simbols} ${prefix}sound56
┞ᗛ ${simbols} ${prefix}sound57
┞ᗛ ${simbols} ${prefix}sound58
┞ᗛ ${simbols} ${prefix}sound59
┞ᗛ ${simbols} ${prefix}sound60
┞ᗛ ${simbols} ${prefix}sound61
┞ᗛ ${simbols} ${prefix}sound62
┞ᗛ ${simbols} ${prefix}sound63
┞ᗛ ${simbols} ${prefix}sound64
┞ᗛ ${simbols} ${prefix}sound65
┞ᗛ ${simbols} ${prefix}sound66
┞ᗛ ${simbols} ${prefix}sound67
┞ᗛ ${simbols} ${prefix}sound68
┞ᗛ ${simbols} ${prefix}sound69
┞ᗛ ${simbols} ${prefix}sound70
┞ᗛ ${simbols} ${prefix}sound71
┞ᗛ ${simbols} ${prefix}sound72
┞ᗛ ${simbols} ${prefix}sound73
┞ᗛ ${simbols} ${prefix}sound74
┞ᗛ ${simbols} ${prefix}sound75
┞ᗛ ${simbols} ${prefix}sound76
┞ᗛ ${simbols} ${prefix}sound77
┞ᗛ ${simbols} ${prefix}sound78
┞ᗛ ${simbols} ${prefix}sound79
┞ᗛ ${simbols} ${prefix}sound80
┞ᗛ ${simbols} ${prefix}sound81
┞ᗛ ${simbols} ${prefix}sound82
┞ᗛ ${simbols} ${prefix}sound83
┞ᗛ ${simbols} ${prefix}sound84
┞ᗛ ${simbols} ${prefix}sound85
┞ᗛ ${simbols} ${prefix}sound86
┞ᗛ ${simbols} ${prefix}sound87
┞ᗛ ${simbols} ${prefix}sound88
┞ᗛ ${simbols} ${prefix}sound89
┞ᗛ ${simbols} ${prefix}sound90
┞ᗛ ${simbols} ${prefix}sound91
┞ᗛ ${simbols} ${prefix}sound92
┞ᗛ ${simbols} ${prefix}sound93
┞ᗛ ${simbols} ${prefix}sound94
┞ᗛ ${simbols} ${prefix}sound95
┞ᗛ ${simbols} ${prefix}sound96
┞ᗛ ${simbols} ${prefix}sound97
┞ᗛ ${simbols} ${prefix}sound98
┞ᗛ ${simbols} ${prefix}sound99
┞ᗛ ${simbols} ${prefix}sound100
└──────────────────╼.✗`;
				const tombol = [
				{
					name: "cta_url",
					buttonParamsJson: JSON.stringify(
					{
						display_text: "ManuDiaz ",
						url: `https://`,
					}),
				}, ];
				// Kirim pesan dengan gambar dan tombol
				sendButtonImage(m.chat, `ʜɪ @${m.sender.split('@')[0]} 👋🏻,`, audiomenuu, getRandomThumb3(), tombol, hw);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'groupmenu':
			{
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const db = loadUserFire();
				const user = db[m.sender] ||
				{};
				const isRegistered = user.register || false;
				const role = user.role || 'user';
				const limit = user.limit || 0;
				const registrationSeries = user.registrationSeries || 'Not Available';
				const limitDisplay = limit === -1 ? '∞' : limit;
				const xp = user.exp || 0;
				const level = user.level || 0;
				const belenc = user.balance || 0;
				const commandCount = user.commandCount || 0;
				await emote(randomEmoji);
				const statusUser = isShoNheOwn ? 'Owner' : `${role}`;
				const groupmenu = 
`┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'ᴘᴜʙʟɪᴄ' : 'ꜱᴇʟꜰ'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ꜱᴏᴄɪᴀʟ ᴍᴇᴅɪᴀ 】${c} ⟢
├────────────────
│  ⎘ ᴛɪᴋᴛᴏᴋ: ${ttk}
│  ⎘ ʏᴏᴜᴛᴜʙᴇ: ${ytbb}
│  ⎘ ɪɴꜱᴛᴀɢʀᴀᴍ: ${itg}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ɢʀᴏᴜᴘ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}grup
┞ᗛ ${simbols} ${prefix}getgcid
┞ᗛ ${simbols} ${prefix}creategc
┞ᗛ ${simbols} ${prefix}closetime
┞ᗛ ${simbols} ${prefix}hidetag
┞ᗛ ${simbols} ${prefix}opentime
┞ᗛ ${simbols} ${prefix}revoke
┞ᗛ ${simbols} ${prefix}kudeta
┞ᗛ ${simbols} ${prefix}setdesc
┞ᗛ ${simbols} ${prefix}store
┞ᗛ ${simbols} ${prefix}addlist <key>|<resp>
┞ᗛ ${simbols} ${prefix}dellist <key>
┞ᗛ ${simbols} ${prefix}updatelist <key>|resp>
┞ᗛ ${simbols} ${prefix}setnamegc
┞ᗛ ${simbols} ${prefix}delppgc
┞ᗛ ${simbols} ${prefix}setppgc
┞ᗛ ${simbols} ${prefix}contacttag
┞ᗛ ${simbols} ${prefix}sendcontact
┞ᗛ ${simbols} ${prefix}getcontact
└──────────────────╼.✗`;
				const tombol = [
				{
					name: "cta_url",
					buttonParamsJson: JSON.stringify(
					{
						display_text: "ManuDiaz ",
						url: `https://`,
					}),
				}, ];
				// Kirim pesan dengan gambar dan tombol
				sendButtonImage(m.chat, `ʜɪ @${m.sender.split('@')[0]} 👋🏻,`, groupmenu, getRandomThumb3(), tombol, hw);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'animemenu':
			{
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const db = loadUserFire();
				const user = db[m.sender] ||
				{};
				const isRegistered = user.register || false;
				const role = user.role || 'user';
				const limit = user.limit || 0;
				const registrationSeries = user.registrationSeries || 'Not Available';
				const limitDisplay = limit === -1 ? '∞' : limit;
				const xp = user.exp || 0;
				const level = user.level || 0;
				const belenc = user.balance || 0;
				const commandCount = user.commandCount || 0;
				await emote(randomEmoji);
				const statusUser = isShoNheOwn ? 'Owner' : `${role}`;
				const animekk = 
`┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'ᴘᴜʙʟɪᴄ' : 'ꜱᴇʟꜰ'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ꜱᴏᴄɪᴀʟ ᴍᴇᴅɪᴀ 】${c} ⟢
├────────────────
│  ⎘ ᴛɪᴋᴛᴏᴋ: ${ttk}
│  ⎘ ʏᴏᴜᴛᴜʙᴇ: ${ytbb}
│  ⎘ ɪɴꜱᴛᴀɢʀᴀᴍ: ${itg}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ᴀɴɪᴍᴇ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}anichindetail
┞ᗛ ${simbols} ${prefix}anichindl
┞ᗛ ${simbols} ${prefix}anichinepisode
┞ᗛ ${simbols} ${prefix}anichinsearch
┞ᗛ ${simbols} ${prefix}aurataildetail
┞ᗛ ${simbols} ${prefix}aurataillast
┞ᗛ ${simbols} ${prefix}auratailsearch
┞ᗛ ${simbols} ${prefix}auratailpopular
┞ᗛ ${simbols} ${prefix}animelast
┞ᗛ ${simbols} ${prefix}animpopular
┞ᗛ ${simbols} ${prefix}komikindodetail
┞ᗛ ${simbols} ${prefix}komikindodownload
┞ᗛ ${simbols} ${prefix}komikindosearch
┞ᗛ ${simbols} ${prefix}samehadakurelease
┞ᗛ ${simbols} ${prefix}samehadakudetail
┞ᗛ ${simbols} ${prefix}otakudesuongoing
┞ᗛ ${simbols} ${prefix}otakudesusearch
┞ᗛ ${simbols} ${prefix}otakudesudetail
┞ᗛ ${simbols} ${prefix}oploverzdownload
└──────────────────╼.✗
    `;
				const tombol = [
				{
					name: "cta_url",
					buttonParamsJson: JSON.stringify(
					{
						display_text: "ManuDiaz ",
						url: `https://`,
					}),
				}, ];
				// Kirim pesan dengan gambar dan tombol
				sendButtonImage(m.chat, `ʜɪ @${m.sender.split('@')[0]} 👋🏻,`, animekk, getRandomThumb3(), tombol, hw);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'ownermenu':
			{
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const db = loadUserFire();
				const user = db[m.sender] ||
				{};
				const isRegistered = user.register || false;
				const role = user.role || 'user';
				const limit = user.limit || 0;
				const registrationSeries = user.registrationSeries || 'Not Available';
				const limitDisplay = limit === -1 ? '∞' : limit;
				const xp = user.exp || 0;
				const level = user.level || 0;
				const belenc = user.balance || 0;
				const commandCount = user.commandCount || 0;
				await emote(randomEmoji);
				const statusUser = isShoNheOwn ? 'Owner' : `${role}`;
				const ownermenu = 
`┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'ᴘᴜʙʟɪᴄ' : 'ꜱᴇʟꜰ'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ꜱᴏᴄɪᴀʟ ᴍᴇᴅɪᴀ 】${c} ⟢
├────────────────
│  ⎘ ᴛɪᴋᴛᴏᴋ: ${ttk}
│  ⎘ ʏᴏᴜᴛᴜʙᴇ: ${ytbb}
│  ⎘ ɪɴꜱᴛᴀɢʀᴀᴍ: ${itg}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ᴏᴡɴᴇʀ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}restart
┞ᗛ ${simbols} ${prefix}mode
┞ᗛ ${simbols} ${prefix}addcase
┞ᗛ ${simbols} ${prefix}delcase
┞ᗛ ${simbols} ${prefix}poll txt|q,q
┞ᗛ ${simbols} ${prefix}addowner
┞ᗛ ${simbols} ${prefix}sendsc
┞ᗛ ${simbols} ${prefix}delowner
┞ᗛ ${simbols} ${prefix}setreply
┞ᗛ ${simbols} ${prefix}setmenu
┞ᗛ ${simbols} ${prefix}sendclear
┞ᗛ ${simbols} ${prefix}addprem
┞ᗛ ${simbols} ${prefix}sendbutton
┞ᗛ ${simbols} ${prefix}sendbuttonimg
┞ᗛ ${simbols} ${prefix}sendbuttonimg2
┞ᗛ ${simbols} ${prefix}sendlist
┞ᗛ ${simbols} ${prefix}sendlist2
┞ᗛ ${simbols} ${prefix}sendlistimg
┞ᗛ ${simbols} ${prefix}sendlistch
┞ᗛ ${simbols} ${prefix}sendlistimg2
┞ᗛ ${simbols} ${prefix}listprem
┞ᗛ ${simbols} ${prefix}delprem
┞ᗛ ${simbols} ${prefix}setbiobot
┞ᗛ ${simbols} ${prefix}upsaluran
┞ᗛ ${simbols} ${prefix}upsaluran2
┞ᗛ ${simbols} ${prefix}upchannel
┞ᗛ ${simbols} ${prefix}upchannels
┞ᗛ ${simbols} ${prefix}delppbot
┞ᗛ ${simbols} ${prefix}setppbot
┞ᗛ ${simbols} ${prefix}listuserfire
┞ᗛ ${simbols} ${prefix}cekfire
┞ᗛ ${simbols} ${prefix}upfire
┞ᗛ ${simbols} ${prefix}delfire
┞ᗛ ${simbols} ${prefix}listowner
┞ᗛ ${simbols} ${prefix}getcase
┞ᗛ ${simbols} ${prefix}addthumb <name>|<link>
┞ᗛ ${simbols} ${prefix}listthumb
┞ᗛ ${simbols} ${prefix}delthumb <name>
┞ᗛ ${simbols} ${prefix}addthumb2 <name>|<replyImg>
┞ᗛ ${simbols} ${prefix}listthumb2
┞ᗛ ${simbols} ${prefix}delthumb2 <name>
┞ᗛ ${simbols} ${prefix}addthumb3 <name>|<replyImg>
┞ᗛ ${simbols} ${prefix}listthumb3
┞ᗛ ${simbols} ${prefix}delthumb3 <name>
┞ᗛ ${simbols} ${prefix}upswtext
┞ᗛ ${simbols} ${prefix}upswimg
┞ᗛ ${simbols} ${prefix}upswvid
┞ᗛ ${simbols} ${prefix}upswaudio
┞ᗛ ${simbols} ${prefix}settings
┞ᗛ ${simbols} ${prefix}delsession
┞ᗛ ${simbols} ${prefix}pushcontact
┞ᗛ ${simbols} ${prefix}pushkontak2
┞ᗛ ${simbols} ${prefix}pushkontak3
┞ᗛ ${simbols} ${prefix}pushkontak4
┞ᗛ ${simbols} ${prefix}resetpop
┞ᗛ ${simbols} ${prefix}setcmd
┞ᗛ ${simbols} ${prefix}delcmd
┞ᗛ ${simbols} ${prefix}shoneai
┞ᗛ ${simbols} ${prefix}eval
┞ᗛ ${simbols} ${prefix}exec
┞ᗛ ${simbols} ${prefix}return
┞ᗛ ${simbols} ${prefix}listcmd
└──────────────────╼.✗`;
				const tombol = [
				{
					name: "cta_url",
					buttonParamsJson: JSON.stringify(
					{
						display_text: "ManuDiaz ",
						url: `https://`,
					}),
				}, ];
				// Kirim pesan dengan gambar dan tombol
				sendButtonImage(m.chat, `ʜɪ @${m.sender.split('@')[0]} 👋🏻,`, ownermenu, getRandomThumb3(), tombol, hw);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'randommenu':
			{
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const db = loadUserFire();
				const user = db[m.sender] ||
				{};
				const isRegistered = user.register || false;
				const role = user.role || 'user';
				const limit = user.limit || 0;
				const registrationSeries = user.registrationSeries || 'Not Available';
				const limitDisplay = limit === -1 ? '∞' : limit;
				const xp = user.exp || 0;
				const level = user.level || 0;
				const belenc = user.balance || 0;
				const commandCount = user.commandCount || 0;
				await emote(randomEmoji);
				const statusUser = isShoNheOwn ? 'Owner' : `${role}`;
				const randomm = 
`┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'ᴘᴜʙʟɪᴄ' : 'ꜱᴇʟꜰ'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ꜱᴏᴄɪᴀʟ ᴍᴇᴅɪᴀ 】${c} ⟢
├────────────────
│  ⎘ ᴛɪᴋᴛᴏᴋ: ${ttk}
│  ⎘ ʏᴏᴜᴛᴜʙᴇ: ${ytbb}
│  ⎘ ɪɴꜱᴛᴀɢʀᴀᴍ: ${itg}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʀᴀɴᴅᴏᴍ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}wallhp
┞ᗛ ${simbols} ${prefix}akira
┞ᗛ ${simbols} ${prefix}akiyama
┞ᗛ ${simbols} ${prefix}ana
┞ᗛ ${simbols} ${prefix}art
┞ᗛ ${simbols} ${prefix}asuna
┞ᗛ ${simbols} ${prefix}ayuzawa
┞ᗛ ${simbols} ${prefix}boruto
┞ᗛ ${simbols} ${prefix}bts
┞ᗛ ${simbols} ${prefix}chiho
┞ᗛ ${simbols} ${prefix}chitoge
┞ᗛ ${simbols} ${prefix}cosplay
┞ᗛ ${simbols} ${prefix}cosplayloli
┞ᗛ ${simbols} ${prefix}cosplaysagiri
┞ᗛ ${simbols} ${prefix}cyber
┞ᗛ ${simbols} ${prefix}deidara
┞ᗛ ${simbols} ${prefix}doraemon
┞ᗛ ${simbols} ${prefix}neko
┞ᗛ ${simbols} ${prefix}waifu
┞ᗛ ${simbols} ${prefix}elaina
┞ᗛ ${simbols} ${prefix}cecanindo
┞ᗛ ${simbols} ${prefix}cecanchina
┞ᗛ ${simbols} ${prefix}cecankorea
┞ᗛ ${simbols} ${prefix}cecanthai
┞ᗛ ${simbols} ${prefix}cecanviet
┞ᗛ ${simbols} ${prefix}cecanjapan
┞ᗛ ${simbols} ${prefix}cats
┞ᗛ ${simbols} ${prefix}bluearchive
┞ᗛ ${simbols} ${prefix}emilia
┞ᗛ ${simbols} ${prefix}erza
┞ᗛ ${simbols} ${prefix}exo
┞ᗛ ${simbols} ${prefix}gamewallpaper
┞ᗛ ${simbols} ${prefix}gremory
┞ᗛ ${simbols} ${prefix}hacker
┞ᗛ ${simbols} ${prefix}hestia
┞ᗛ ${simbols} ${prefix}Husbu
┞ᗛ ${simbols} ${prefix}inori
┞ᗛ ${simbols} ${prefix}islamic
┞ᗛ ${simbols} ${prefix}isuzu
┞ᗛ ${simbols} ${prefix}itachi
┞ᗛ ${simbols} ${prefix}itori
┞ᗛ ${simbols} ${prefix}jennie
┞ᗛ ${simbols} ${prefix}jiso
┞ᗛ ${simbols} ${prefix}justina
┞ᗛ ${simbols} ${prefix}kaga
┞ᗛ ${simbols} ${prefix}kagura
┞ᗛ ${simbols} ${prefix}kakasih
┞ᗛ ${simbols} ${prefix}kaori
┞ᗛ ${simbols} ${prefix}cartoon
┞ᗛ ${simbols} ${prefix}shortquote
┞ᗛ ${simbols} ${prefix}keneki
┞ᗛ ${simbols} ${prefix}kotori
┞ᗛ ${simbols} ${prefix}kurumi
┞ᗛ ${simbols} ${prefix}lisa
┞ᗛ ${simbols} ${prefix}loli2
┞ᗛ ${simbols} ${prefix}madara
┞ᗛ ${simbols} ${prefix}megumin
┞ᗛ ${simbols} ${prefix}mikasa
┞ᗛ ${simbols} ${prefix}mikey
┞ᗛ ${simbols} ${prefix}miku
┞ᗛ ${simbols} ${prefix}minato
┞ᗛ ${simbols} ${prefix}mountain
┞ᗛ ${simbols} ${prefix}naruto
┞ᗛ ${simbols} ${prefix}nekonime
┞ᗛ ${simbols} ${prefix}nezuko
┞ᗛ ${simbols} ${prefix}onepiece
┞ᗛ ${simbols} ${prefix}pentol
┞ᗛ ${simbols} ${prefix}pokemon
┞ᗛ ${simbols} ${prefix}programming
┞ᗛ ${simbols} ${prefix}randomnime
┞ᗛ ${simbols} ${prefix}randomnime2
┞ᗛ ${simbols} ${prefix}rize
┞ᗛ ${simbols} ${prefix}rose
┞ᗛ ${simbols} ${prefix}sagiri
┞ᗛ ${simbols} ${prefix}sakura
┞ᗛ ${simbols} ${prefix}sasuke
┞ᗛ ${simbols} ${prefix}satanic
┞ᗛ ${simbols} ${prefix}shina
┞ᗛ ${simbols} ${prefix}shinka
┞ᗛ ${simbols} ${prefix}shinomiya
┞ᗛ ${simbols} ${prefix}shizuka
┞ᗛ ${simbols} ${prefix}shota
┞ᗛ ${simbols} ${prefix}space
┞ᗛ ${simbols} ${prefix}technology
┞ᗛ ${simbols} ${prefix}tejina
┞ᗛ ${simbols} ${prefix}toukachan
┞ᗛ ${simbols} ${prefix}tsunade
┞ᗛ ${simbols} ${prefix}waifu2
┞ᗛ ${simbols} ${prefix}yotsuba
┞ᗛ ${simbols} ${prefix}yuki
┞ᗛ ${simbols} ${prefix}yulibocil
┞ᗛ ${simbols} ${prefix}yumeko
└──────────────────╼.✗`
				const tombol = [
				{
					name: "cta_url",
					buttonParamsJson: JSON.stringify(
					{
						display_text: "ManuDiaz",
						url: `https://`,
					}),
				}, ];
				// Kirim pesan dengan gambar dan tombol
				sendButtonImage(m.chat, `ʜɪ @${m.sender.split('@')[0]} 👋🏻,`, randomm, getRandomThumb3(), tombol, hw);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'othermenu':
			{
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const db = loadUserFire();
				const user = db[m.sender] ||
				{};
				const isRegistered = user.register || false;
				const role = user.role || 'user';
				const limit = user.limit || 0;
				const registrationSeries = user.registrationSeries || 'Not Available';
				const limitDisplay = limit === -1 ? '∞' : limit;
				const xp = user.exp || 0;
				const level = user.level || 0;
				const belenc = user.balance || 0;
				const commandCount = user.commandCount || 0;
				await emote(randomEmoji);
				const statusUser = isShoNheOwn ? 'Owner' : `${role}`;
				const othermenu = 
`┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'ᴘᴜʙʟɪᴄ' : 'ꜱᴇʟꜰ'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ꜱᴏᴄɪᴀʟ ᴍᴇᴅɪᴀ 】${c} ⟢
├────────────────
│  ⎘ ᴛɪᴋᴛᴏᴋ: ${ttk}
│  ⎘ ʏᴏᴜᴛᴜʙᴇ: ${ytbb}
│  ⎘ ɪɴꜱᴛᴀɢʀᴀᴍ: ${itg}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ᴏᴛʜᴇʀ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}popular
┞ᗛ ${simbols} ${prefix}script
┞ᗛ ${simbols} ${prefix}totalfitur
┞ᗛ ${simbols} ${prefix}readviewonce
┞ᗛ ${simbols} ${prefix}faktaunik
┞ᗛ ${simbols} ${prefix}mitos
┞ᗛ ${simbols} ${prefix}delete
┞ᗛ ${simbols} ${prefix}imdb <film>
┞ᗛ ${simbols} ${prefix}jadwalsholat
┞ᗛ ${simbols} ${prefix}listkota
┞ᗛ ${simbols} ${prefix}owner
┞ᗛ ${simbols} ${prefix}about
└──────────────────╼.✗`;
				const tombol = [
				{
					name: "cta_url",
					buttonParamsJson: JSON.stringify(
					{
						display_text: "ManuDiaz ",
						url: `https://`,
					}),
				}, ];
				// Kirim pesan dengan gambar dan tombol
				sendButtonImage(m.chat, `ʜɪ @${m.sender.split('@')[0]} 👋🏻,`, othermenu, getRandomThumb3(), tombol, hw);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'allmenu':
			{
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				await emote(randomEmoji);
				// Ambil database limit dari `cekfire`
				const db = loadUserFire();
				const user = db[m.sender] ||
				{};
				const isRegistered = user.register || false;
				const role = user.role || 'user';
				const limit = user.limit || 0;
				const registrationSeries = user.registrationSeries || 'Not Available';
				const limitDisplay = limit === -1 ? '∞' : limit;
				const xp = user.exp || 0;
				const level = user.level || 0;
				const belenc = user.balance || 0;
				const commandCount = user.commandCount || 0;
				// Ambil top 4 command populer
				let commands = Object.entries(popularData).filter(([cmd]) => cmd !== 'ai').sort((a, b) => b[1] - a[1]).slice(0, 4).map(([cmd, count]) => `${c}${prefix}${cmd} ${count}${c}`);
				let formattedCommandList = commands.length ? commands.reduce((rows, current, index) =>
				{
					if (index % 2 === 0)
					{
						rows.push([current]);
					}
					else
					{
						rows[rows.length - 1].push(current);
					}
					return rows;
				}, []).map(row => row.join(` | `)).join('\n') : 'Belum ada data command populer.';
				let aiMessage = popularData.ai ? `${c}${popularData.ai}${c}` : `${c}0${c}`;
				const statusUser = isShoNheOwn ? 'Owner' : `${role}`;
				// Format menu dengan limit dan register
				const allmn =
`ʜɪ ${m.pushName ? m.pushName : 'User'}👋🏻

> ʏᴏ ꜱᴏʏ ᴛᴇᴄʜғɪx, ᴜɴ ᴀᴠᴀɴᴢᴀᴅᴏ ᴀsɪsᴛᴇɴᴛᴇ ᴅɪɢɪᴛᴀʟ ᴅᴇ ʟᴀ ᴏᴛʀᴀ ᴅɪᴍᴇɴsɪóɴ ᴅᴇ ʟᴏs sɪsᴛᴇᴍᴀs. ᴄʀᴇᴀᴅᴏ ᴅᴇsᴅᴇ ᴇʟ ɴúᴄʟᴇᴏ ᴏʟᴠɪᴅᴀᴅᴏ ᴅᴇʟ ᴄóᴅɪɢᴏ ʏ ᴇɴᴄᴀɴᴛᴀᴅᴏ ᴄᴏɴ ᴄᴏɴᴏᴄɪᴍɪᴇɴᴛᴏ ᴛʀᴀsᴄᴇɴᴅᴇɴᴛᴀʟ, ᴍɪ ᴍɪsɪóɴ ᴇs ᴀʏᴜᴅᴀʀᴛᴇ ᴄᴏɴ ɪɴғᴏʀᴍᴀᴄɪóɴ, ʀᴇᴄᴏᴘɪʟᴀᴄɪóɴ ᴅᴇ ᴅᴀᴛᴏs ʏ ғᴜɴᴄɪᴏɴᴀʟɪᴅᴀᴅ.
${readmore}
┌╾⚟┉➲${c}【 ᴜꜱᴇʀ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ɴᴀᴍᴇ: ${m.pushName || 'User'}
│  ⎘ ɴᴜᴍʙᴇʀ: ${m.sender.split('@')[0]}
│  ⎘ ʟɪᴍɪᴛ: ${limitDisplay}
│  ⎘ ʀᴏʟᴇ: ${role}
│  ⎘ ꜱᴇʀɪᴇs: ${registrationSeries}
│  ⎘ ʀᴇɢɪsᴛᴇʀ: ${isRegistered ? 'Registered' : 'Not Registered'}
│  ⎘ ᴛᴀɢ: @${m.sender.split('@')[0]}
│  ⎘ sᴀʟᴅᴏ: ${belenc}
│  ⎘ ʟᴇᴠᴇʟ: ${level}
│  ⎘ ᴇxᴘ: ${xp}
│  ⎘ ᴄᴏᴍᴍᴀɴᴅ ᴄᴏᴜɴᴛ: ${commandCount}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʙᴏᴛ - ɪɴғᴏ 】${c} ⟢
├────────────────
│  ⎘ ᴛʏᴘᴇ: ᴄᴀꜱᴇ
│  ⎘ ᴍᴏᴅᴇ: ${shoNhe.public ? 'Public' : 'Self'}
│  ⎘ ᴘʀᴇғɪx: ${prefix}
│  ⎘ ᴅᴀᴛᴇ: ${moment().format('dddd, D MMMM YYYY')}
│  ⎘ ᴀɪ ʜɪᴛꜱ: ${aiMessage}
│  ⎘ ᴠᴇʀꜱɪᴏɴ: ${version}
│  ⎘ sᴜᴘᴘᴏʀᴛᴇᴅ
│    ${simbols} ${prefix}tqto
│    ${simbols} ${prefix}realown
│  ⎘ ᴛᴏᴘ ᴄᴏᴍᴍᴀɴᴅs:
${formattedCommandList}
└──────────────────╼.✗

┌╾⚟┉➲${c}【 sᴏᴄɪᴀʟ ᴍᴇᴅɪᴀ 】${c} ⟢
├────────────────
│  ⎘ ᴛɪᴋᴛᴏᴋ: ${ttk}
│  ⎘ ʏᴏᴜᴛᴜʙᴇ: ${ytbb}
│  ⎘ ɪɴsᴛᴀɢʀᴀᴍ: ${itg}
└──────────────────╼.✗

⚙️ ${c}[ LIST ALL MENU ]${c} ⎋
⎯⎯⎯⎯⎯⎯⧰⎯⎯⎯⎯⎯⎯

┌╾⚟┉➲${c}【 ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}ytmp3 <link>
┞ᗛ ${simbols} ${prefix}ytmp4 <link>
┞ᗛ ${simbols} ${prefix}song <q>
┞ᗛ ${simbols} ${prefix}gitclone <link>
┞ᗛ ${simbols} ${prefix}ytsearch <q>
┞ᗛ ${simbols} ${prefix}tiktok <link>
┞ᗛ ${simbols} ${prefix}tiktoksearch <q>
┞ᗛ ${simbols} ${prefix}ttmp3 <link>
┞ᗛ ${simbols} ${prefix}spotify <q>
┞ᗛ ${simbols} ${prefix}pinterestdl <link>
┞ᗛ ${simbols} ${prefix}pinterest <q>
┞ᗛ ${simbols} ${prefix}spotifydl <link>
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ᴀɴɪᴍᴇ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}anichindetail
┞ᗛ ${simbols} ${prefix}anichindl
┞ᗛ ${simbols} ${prefix}anichinepisode
┞ᗛ ${simbols} ${prefix}anichinsearch
┞ᗛ ${simbols} ${prefix}aurataildetail
┞ᗛ ${simbols} ${prefix}aurataillast
┞ᗛ ${simbols} ${prefix}auratailsearch
┞ᗛ ${simbols} ${prefix}auratailpopular
┞ᗛ ${simbols} ${prefix}animelast
┞ᗛ ${simbols} ${prefix}animpopular
┞ᗛ ${simbols} ${prefix}komikindodetail
┞ᗛ ${simbols} ${prefix}komikindodownload
┞ᗛ ${simbols} ${prefix}komikindosearch
┞ᗛ ${simbols} ${prefix}samehadakurelease
┞ᗛ ${simbols} ${prefix}samehadakudetail
┞ᗛ ${simbols} ${prefix}otakudesuongoing
┞ᗛ ${simbols} ${prefix}otakudesusearch
┞ᗛ ${simbols} ${prefix}otakudesudetail
┞ᗛ ${simbols} ${prefix}oploverzdownload
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}sticker
┞ᗛ ${simbols} ${prefix}toimg
┞ᗛ ${simbols} ${prefix}tourl
┞ᗛ ${simbols} ${prefix}brat <txt>
┞ᗛ ${simbols} ${prefix}brat2 <txt>
┞ᗛ ${simbols} ${prefix}bratgif <txt>
┞ᗛ ${simbols} ${prefix}remini
┞ᗛ ${simbols} ${prefix}img2ibb
┞ᗛ ${simbols} ${prefix}tomp3
┞ᗛ ${simbols} ${prefix}toaudio
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ᴀᴜᴅɪᴏ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}bass
┞ᗛ ${simbols} ${prefix}blown
┞ᗛ ${simbols} ${prefix}deep
┞ᗛ ${simbols} ${prefix}earrape
┞ᗛ ${simbols} ${prefix}slow
┞ᗛ ${simbols} ${prefix}fast
┞ᗛ ${simbols} ${prefix}robot
┞ᗛ ${simbols} ${prefix}smooth
┞ᗛ ${simbols} ${prefix}nightcore
┞ᗛ ${simbols} ${prefix}reverse
┞ᗛ ${simbols} ${prefix}fat
┞ᗛ ${simbols} ${prefix}squirrel
┞ᗛ ${simbols} ${prefix}sound1
┞ᗛ ${simbols} ${prefix}sound2
┞ᗛ ${simbols} ${prefix}sound3
┞ᗛ ${simbols} ${prefix}sound4
┞ᗛ ${simbols} ${prefix}sound5
┞ᗛ ${simbols} ${prefix}sound6
┞ᗛ ${simbols} ${prefix}sound7
┞ᗛ ${simbols} ${prefix}sound8
┞ᗛ ${simbols} ${prefix}sound9
┞ᗛ ${simbols} ${prefix}sound10
┞ᗛ ${simbols} ${prefix}sound11
┞ᗛ ${simbols} ${prefix}sound12
┞ᗛ ${simbols} ${prefix}sound13
┞ᗛ ${simbols} ${prefix}sound14
┞ᗛ ${simbols} ${prefix}sound15
┞ᗛ ${simbols} ${prefix}sound16
┞ᗛ ${simbols} ${prefix}sound17
┞ᗛ ${simbols} ${prefix}sound18
┞ᗛ ${simbols} ${prefix}sound19
┞ᗛ ${simbols} ${prefix}sound20
┞ᗛ ${simbols} ${prefix}sound21
┞ᗛ ${simbols} ${prefix}sound22
┞ᗛ ${simbols} ${prefix}sound23
┞ᗛ ${simbols} ${prefix}sound24
┞ᗛ ${simbols} ${prefix}sound25
┞ᗛ ${simbols} ${prefix}sound26
┞ᗛ ${simbols} ${prefix}sound27
┞ᗛ ${simbols} ${prefix}sound28
┞ᗛ ${simbols} ${prefix}sound29
┞ᗛ ${simbols} ${prefix}sound30
┞ᗛ ${simbols} ${prefix}sound31
┞ᗛ ${simbols} ${prefix}sound32
┞ᗛ ${simbols} ${prefix}sound33
┞ᗛ ${simbols} ${prefix}sound34
┞ᗛ ${simbols} ${prefix}sound35
┞ᗛ ${simbols} ${prefix}sound36
┞ᗛ ${simbols} ${prefix}sound37
┞ᗛ ${simbols} ${prefix}sound38
┞ᗛ ${simbols} ${prefix}sound39
┞ᗛ ${simbols} ${prefix}sound40
┞ᗛ ${simbols} ${prefix}sound41
┞ᗛ ${simbols} ${prefix}sound42
┞ᗛ ${simbols} ${prefix}sound43
┞ᗛ ${simbols} ${prefix}sound44
┞ᗛ ${simbols} ${prefix}sound45
┞ᗛ ${simbols} ${prefix}sound46
┞ᗛ ${simbols} ${prefix}sound47
┞ᗛ ${simbols} ${prefix}sound48
┞ᗛ ${simbols} ${prefix}sound49
┞ᗛ ${simbols} ${prefix}sound50
┞ᗛ ${simbols} ${prefix}sound51
┞ᗛ ${simbols} ${prefix}sound52
┞ᗛ ${simbols} ${prefix}sound53
┞ᗛ ${simbols} ${prefix}sound54
┞ᗛ ${simbols} ${prefix}sound55
┞ᗛ ${simbols} ${prefix}sound56
┞ᗛ ${simbols} ${prefix}sound57
┞ᗛ ${simbols} ${prefix}sound58
┞ᗛ ${simbols} ${prefix}sound59
┞ᗛ ${simbols} ${prefix}sound60
┞ᗛ ${simbols} ${prefix}sound61
┞ᗛ ${simbols} ${prefix}sound62
┞ᗛ ${simbols} ${prefix}sound63
┞ᗛ ${simbols} ${prefix}sound64
┞ᗛ ${simbols} ${prefix}sound65
┞ᗛ ${simbols} ${prefix}sound66
┞ᗛ ${simbols} ${prefix}sound67
┞ᗛ ${simbols} ${prefix}sound68
┞ᗛ ${simbols} ${prefix}sound69
┞ᗛ ${simbols} ${prefix}sound70
┞ᗛ ${simbols} ${prefix}sound71
┞ᗛ ${simbols} ${prefix}sound72
┞ᗛ ${simbols} ${prefix}sound73
┞ᗛ ${simbols} ${prefix}sound74
┞ᗛ ${simbols} ${prefix}sound75
┞ᗛ ${simbols} ${prefix}sound76
┞ᗛ ${simbols} ${prefix}sound77
┞ᗛ ${simbols} ${prefix}sound78
┞ᗛ ${simbols} ${prefix}sound79
┞ᗛ ${simbols} ${prefix}sound80
┞ᗛ ${simbols} ${prefix}sound81
┞ᗛ ${simbols} ${prefix}sound82
┞ᗛ ${simbols} ${prefix}sound83
┞ᗛ ${simbols} ${prefix}sound84
┞ᗛ ${simbols} ${prefix}sound85
┞ᗛ ${simbols} ${prefix}sound86
┞ᗛ ${simbols} ${prefix}sound87
┞ᗛ ${simbols} ${prefix}sound88
┞ᗛ ${simbols} ${prefix}sound89
┞ᗛ ${simbols} ${prefix}sound90
┞ᗛ ${simbols} ${prefix}sound91
┞ᗛ ${simbols} ${prefix}sound92
┞ᗛ ${simbols} ${prefix}sound93
┞ᗛ ${simbols} ${prefix}sound94
┞ᗛ ${simbols} ${prefix}sound95
┞ᗛ ${simbols} ${prefix}sound96
┞ᗛ ${simbols} ${prefix}sound97
┞ᗛ ${simbols} ${prefix}sound98
┞ᗛ ${simbols} ${prefix}sound99
┞ᗛ ${simbols} ${prefix}sound100
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ʀᴀɴᴅᴏᴍ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}wallhp
┞ᗛ ${simbols} ${prefix}akira
┞ᗛ ${simbols} ${prefix}akiyama
┞ᗛ ${simbols} ${prefix}ana
┞ᗛ ${simbols} ${prefix}art
┞ᗛ ${simbols} ${prefix}asuna
┞ᗛ ${simbols} ${prefix}ayuzawa
┞ᗛ ${simbols} ${prefix}boruto
┞ᗛ ${simbols} ${prefix}bts
┞ᗛ ${simbols} ${prefix}chiho
┞ᗛ ${simbols} ${prefix}chitoge
┞ᗛ ${simbols} ${prefix}cosplay
┞ᗛ ${simbols} ${prefix}cosplayloli
┞ᗛ ${simbols} ${prefix}cosplaysagiri
┞ᗛ ${simbols} ${prefix}cyber
┞ᗛ ${simbols} ${prefix}deidara
┞ᗛ ${simbols} ${prefix}doraemon
┞ᗛ ${simbols} ${prefix}neko
┞ᗛ ${simbols} ${prefix}waifu
┞ᗛ ${simbols} ${prefix}elaina
┞ᗛ ${simbols} ${prefix}cecanindo
┞ᗛ ${simbols} ${prefix}cecanchina
┞ᗛ ${simbols} ${prefix}cecankorea
┞ᗛ ${simbols} ${prefix}cecanthai
┞ᗛ ${simbols} ${prefix}cecanviet
┞ᗛ ${simbols} ${prefix}cecanjapan
┞ᗛ ${simbols} ${prefix}cats
┞ᗛ ${simbols} ${prefix}bluearchive
┞ᗛ ${simbols} ${prefix}emilia
┞ᗛ ${simbols} ${prefix}erza
┞ᗛ ${simbols} ${prefix}exo
┞ᗛ ${simbols} ${prefix}gamewallpaper
┞ᗛ ${simbols} ${prefix}gremory
┞ᗛ ${simbols} ${prefix}hacker
┞ᗛ ${simbols} ${prefix}hestia
┞ᗛ ${simbols} ${prefix}Husbu
┞ᗛ ${simbols} ${prefix}inori
┞ᗛ ${simbols} ${prefix}islamic
┞ᗛ ${simbols} ${prefix}isuzu
┞ᗛ ${simbols} ${prefix}itachi
┞ᗛ ${simbols} ${prefix}itori
┞ᗛ ${simbols} ${prefix}jennie
┞ᗛ ${simbols} ${prefix}jiso
┞ᗛ ${simbols} ${prefix}justina
┞ᗛ ${simbols} ${prefix}kaga
┞ᗛ ${simbols} ${prefix}kagura
┞ᗛ ${simbols} ${prefix}kakasih
┞ᗛ ${simbols} ${prefix}kaori
┞ᗛ ${simbols} ${prefix}cartoon
┞ᗛ ${simbols} ${prefix}shortquote
┞ᗛ ${simbols} ${prefix}keneki
┞ᗛ ${simbols} ${prefix}kotori
┞ᗛ ${simbols} ${prefix}kurumi
┞ᗛ ${simbols} ${prefix}lisa
┞ᗛ ${simbols} ${prefix}loli2
┞ᗛ ${simbols} ${prefix}madara
┞ᗛ ${simbols} ${prefix}megumin
┞ᗛ ${simbols} ${prefix}mikasa
┞ᗛ ${simbols} ${prefix}mikey
┞ᗛ ${simbols} ${prefix}miku
┞ᗛ ${simbols} ${prefix}minato
┞ᗛ ${simbols} ${prefix}mountain
┞ᗛ ${simbols} ${prefix}naruto
┞ᗛ ${simbols} ${prefix}nekonime
┞ᗛ ${simbols} ${prefix}nezuko
┞ᗛ ${simbols} ${prefix}onepiece
┞ᗛ ${simbols} ${prefix}pentol
┞ᗛ ${simbols} ${prefix}pokemon
┞ᗛ ${simbols} ${prefix}programming
┞ᗛ ${simbols} ${prefix}randomnime
┞ᗛ ${simbols} ${prefix}randomnime2
┞ᗛ ${simbols} ${prefix}rize
┞ᗛ ${simbols} ${prefix}rose
┞ᗛ ${simbols} ${prefix}sagiri
┞ᗛ ${simbols} ${prefix}sakura
┞ᗛ ${simbols} ${prefix}sasuke
┞ᗛ ${simbols} ${prefix}satanic
┞ᗛ ${simbols} ${prefix}shina
┞ᗛ ${simbols} ${prefix}shinka
┞ᗛ ${simbols} ${prefix}shinomiya
┞ᗛ ${simbols} ${prefix}shizuka
┞ᗛ ${simbols} ${prefix}shota
┞ᗛ ${simbols} ${prefix}space
┞ᗛ ${simbols} ${prefix}technology
┞ᗛ ${simbols} ${prefix}tejina
┞ᗛ ${simbols} ${prefix}toukachan
┞ᗛ ${simbols} ${prefix}tsunade
┞ᗛ ${simbols} ${prefix}waifu2
┞ᗛ ${simbols} ${prefix}yotsuba
┞ᗛ ${simbols} ${prefix}yuki
┞ᗛ ${simbols} ${prefix}yulibocil
┞ᗛ ${simbols} ${prefix}yumeko
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ᴀɪ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}metaai
┞ᗛ ${simbols} ${prefix}llama
┞ᗛ ${simbols} ${prefix}setprompt2
┞ᗛ ${simbols} ${prefix}nous
┞ᗛ ${simbols} ${prefix}claudeai
┞ᗛ ${simbols} ${prefix}dbrxai
┞ᗛ ${simbols} ${prefix}deepseek
┞ᗛ ${simbols} ${prefix}dreamshaper
┞ᗛ ${simbols} ${prefix}img2text
┞ᗛ ${simbols} ${prefix}venice
┞ᗛ ${simbols} ${prefix}latukam
┞ᗛ ${simbols} ${prefix}qwq
┞ᗛ ${simbols} ${prefix}stabilityai
┞ᗛ ${simbols} ${prefix}stable
┞ᗛ ${simbols} ${prefix}flux
┞ᗛ ${simbols} ${prefix}gandalf
┞ᗛ ${simbols} ${prefix}gemini
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ɢʀᴏᴜᴘ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}grup
┞ᗛ ${simbols} ${prefix}getgcid
┞ᗛ ${simbols} ${prefix}creategc
┞ᗛ ${simbols} ${prefix}closetime
┞ᗛ ${simbols} ${prefix}hidetag
┞ᗛ ${simbols} ${prefix}opentime
┞ᗛ ${simbols} ${prefix}revoke
┞ᗛ ${simbols} ${prefix}kudeta
┞ᗛ ${simbols} ${prefix}setdesc
┞ᗛ ${simbols} ${prefix}store
┞ᗛ ${simbols} ${prefix}addlist <key>|<resp>
┞ᗛ ${simbols} ${prefix}dellist <key>
┞ᗛ ${simbols} ${prefix}updatelist <key>|resp>
┞ᗛ ${simbols} ${prefix}setnamegc
┞ᗛ ${simbols} ${prefix}delppgc
┞ᗛ ${simbols} ${prefix}setppgc
┞ᗛ ${simbols} ${prefix}contacttag
┞ᗛ ${simbols} ${prefix}sendcontact
┞ᗛ ${simbols} ${prefix}getcontact
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ɢᴀᴍᴇ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}tebakgambar
┞ᗛ ${simbols} ${prefix}tebakgame
┞ᗛ ${simbols} ${prefix}tebakff
┞ᗛ ${simbols} ${prefix}tebakkabupaten
┞ᗛ ${simbols} ${prefix}tebakjkt48
┞ᗛ ${simbols} ${prefix}tebakhewan
┞ᗛ ${simbols} ${prefix}tebakchara
┞ᗛ ${simbols} ${prefix}tebaklogo
┞ᗛ ${simbols} ${prefix}tebakaplikasi
┞ᗛ ${simbols} ${prefix}suit
┞ᗛ ${simbols} ${prefix}tebakkata
┞ᗛ ${simbols} ${prefix}asahotak
┞ᗛ ${simbols} ${prefix}lengkapikalimat
┞ᗛ ${simbols} ${prefix}tebakbendera
┞ᗛ ${simbols} ${prefix}tebakkalimat
┞ᗛ ${simbols} ${prefix}siapaaku
┞ᗛ ${simbols} ${prefix}tebakkimia
┞ᗛ ${simbols} ${prefix}tebaklirik
┞ᗛ ${simbols} ${prefix}tebaktebakan
┞ᗛ ${simbols} ${prefix}susunkata
┞ᗛ ${simbols} ${prefix}caklontong
┞ᗛ ${simbols} ${prefix}tekateki
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ᴏᴡɴᴇʀ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}restart
┞ᗛ ${simbols} ${prefix}mode
┞ᗛ ${simbols} ${prefix}addcase
┞ᗛ ${simbols} ${prefix}delcase
┞ᗛ ${simbols} ${prefix}poll txt|q,q
┞ᗛ ${simbols} ${prefix}addowner
┞ᗛ ${simbols} ${prefix}sendsc
┞ᗛ ${simbols} ${prefix}delowner
┞ᗛ ${simbols} ${prefix}setreply
┞ᗛ ${simbols} ${prefix}setmenu
┞ᗛ ${simbols} ${prefix}sendclear
┞ᗛ ${simbols} ${prefix}addprem
┞ᗛ ${simbols} ${prefix}sendbutton
┞ᗛ ${simbols} ${prefix}sendbuttonimg
┞ᗛ ${simbols} ${prefix}sendbuttonimg2
┞ᗛ ${simbols} ${prefix}sendlist
┞ᗛ ${simbols} ${prefix}sendlist2
┞ᗛ ${simbols} ${prefix}sendlistimg
┞ᗛ ${simbols} ${prefix}sendlistch
┞ᗛ ${simbols} ${prefix}sendlistimg2
┞ᗛ ${simbols} ${prefix}listprem
┞ᗛ ${simbols} ${prefix}delprem
┞ᗛ ${simbols} ${prefix}setbiobot
┞ᗛ ${simbols} ${prefix}upsaluran
┞ᗛ ${simbols} ${prefix}upsaluran2
┞ᗛ ${simbols} ${prefix}upchannel
┞ᗛ ${simbols} ${prefix}upchannels
┞ᗛ ${simbols} ${prefix}delppbot
┞ᗛ ${simbols} ${prefix}setppbot
┞ᗛ ${simbols} ${prefix}listuserfire
┞ᗛ ${simbols} ${prefix}cekfire
┞ᗛ ${simbols} ${prefix}upfire
┞ᗛ ${simbols} ${prefix}delfire
┞ᗛ ${simbols} ${prefix}listowner
┞ᗛ ${simbols} ${prefix}getcase
┞ᗛ ${simbols} ${prefix}addthumb <name>|<link>
┞ᗛ ${simbols} ${prefix}listthumb
┞ᗛ ${simbols} ${prefix}delthumb <name>
┞ᗛ ${simbols} ${prefix}addthumb2 <name>|<replyImg>
┞ᗛ ${simbols} ${prefix}listthumb2
┞ᗛ ${simbols} ${prefix}delthumb2 <name>
┞ᗛ ${simbols} ${prefix}addthumb3 <name>|<replyImg>
┞ᗛ ${simbols} ${prefix}listthumb3
┞ᗛ ${simbols} ${prefix}delthumb3 <name>
┞ᗛ ${simbols} ${prefix}upswtext
┞ᗛ ${simbols} ${prefix}upswimg
┞ᗛ ${simbols} ${prefix}upswvid
┞ᗛ ${simbols} ${prefix}upswaudio
┞ᗛ ${simbols} ${prefix}settings
┞ᗛ ${simbols} ${prefix}delsession
┞ᗛ ${simbols} ${prefix}pushcontact
┞ᗛ ${simbols} ${prefix}pushkontak2
┞ᗛ ${simbols} ${prefix}pushkontak3
┞ᗛ ${simbols} ${prefix}pushkontak4
┞ᗛ ${simbols} ${prefix}resetpop
┞ᗛ ${simbols} ${prefix}setcmd
┞ᗛ ${simbols} ${prefix}delcmd
┞ᗛ ${simbols} ${prefix}shoNheai
┞ᗛ ${simbols} ${prefix}eval
┞ᗛ ${simbols} ${prefix}exec
┞ᗛ ${simbols} ${prefix}return
┞ᗛ ${simbols} ${prefix}listcmd
└──────────────────╼.✗

┌╾⚟┉➲${c}【 ᴏᴛʜᴇʀ ᴍᴇɴᴜ 】${c} ⟢
├────────────────
┞ᗛ ${simbols} ${prefix}popular
┞ᗛ ${simbols} ${prefix}script
┞ᗛ ${simbols} ${prefix}totalfitur
┞ᗛ ${simbols} ${prefix}readviewonce
┞ᗛ ${simbols} ${prefix}faktaunik
┞ᗛ ${simbols} ${prefix}mitos
┞ᗛ ${simbols} ${prefix}delete
┞ᗛ ${simbols} ${prefix}imdb <film>
┞ᗛ ${simbols} ${prefix}jadwalsholat
┞ᗛ ${simbols} ${prefix}listkota
┞ᗛ ${simbols} ${prefix}owner
┞ᗛ ${simbols} ${prefix}about
└──────────────────╼.✗


┌╾⚟┉➲${c}【 ғᴇᴀᴛᴜʀᴇᴅ】${c} ⟢
├────────────────
│  ⎘ ᴜꜱᴇʀ ᴄᴏᴍᴍᴀɴᴅs
│    ${simbols} ${prefix}listuserfire
│    ${simbols} ${prefix}cekfire
│    ${simbols} ${prefix}bensin
│    ${simbols} ${prefix}afk
│    ${simbols} ${prefix}listcmd
│    ${simbols} ${prefix}cek
│    ${simbols} ${prefix}find
│    ${simbols} ${prefix}ceksaldo
│    ${simbols} ${prefix}scriptnoenc
└──────────────────╼.✗`
				/*const reactEmojis = ["⏳", "🕛", "🕒", "🕕", "🕘", "🕛", randomEmoji];
				// Mengirimkan reaksi secara berurutan
				for (const emoji of reactEmojis)
				{
					await shoNhe.sendMessage(m.chat,
					{
						react:
						{
							text: emoji,
							key: m.key
						}
					});
				}*/
				let msg = generateWAMessageFromContent(m.chat,
				{
					viewOnceMessage:
					{
						message:
						{
							"messageContextInfo":
							{
								"deviceListMetadata":
								{},
								"deviceListMetadataVersion": 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.create(
							{
								body: proto.Message.InteractiveMessage.Body.create(
								{
									text: allmn
								}),
								footer: proto.Message.InteractiveMessage.Footer.create(
								{
									text: namabot
								}),
								header: proto.Message.InteractiveMessage.Header.fromObject(
								{
									hasMediaAttachment: true,
									documentMessage:
									{
										"url": "https://mmg.whatsapp.net/v/t62.7119-24/30129597_829817659174206_6300413901737393729_n.enc?ccb=11-4&oh=01_Q5AaIA5MAdyMQOjp8l42SnRy_8qjz9O8JH8vgPee1nIdko51&oe=66595EB9&_nc_sid=5e03e0&mms3=true",
										"mimetype": "application/pdf",
										"fileSha256": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
										"jpegThumbnail": fs.readFileSync("./urpdf2.jpg"), //Format gambar harus 300x300 (jika beda tidak akan keluar
										"fileLength": 120000,
										"mediaKey": "SkHeALp42Ch7DGb6nuV6p7hxL+V9yjh9s9t3Ox8a72o=",
										"fileName": `© TechFix Botz`,
										"directPath": "/v/t62.7119-24/30129597_829817659174206_6300413901737393729_n.enc?ccb=11-4&oh=01_Q5AaIA5MAdyMQOjp8l42SnRy_8qjz9O8JH8vgPee1nIdko51&oe=66595EB9&_nc_sid=5e03e0",
										"contactVcard": true,
										"mediaKeyTimestamp": "1658703206"
									}
								}),
								nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
								{
									buttons: [
									{
										"name": "quick_reply",
										"buttonParamsJson": `{
                    "display_text":"ABOUT💧",
                    "id":"${prefix}about"}`
									},
									{
										"name": "cta_url",
										"buttonParamsJson": `{
      "display_text": "KING👑",
      "url": "https://wa.me/573012686632"
    }`
									}],
								}),
								contextInfo:
								{
									forwardingScore: 245,
									isForwarded: true,
									mentionedJid: [m.sender],
									forwardedNewsletterMessageInfo:
									{
										newsletterName: `© TechFix Botz`,
										newsletterJid: idsaluran
									},
									externalAdReply:
									{
										title: `${waktuucapan} ${m.pushName ? m.pushName : 'Temen ShoNhe'} 👋🏻`,
										body: namaBot,
										showAdAttribution: true,
										thumbnail: getRandomThumb3(),
										mediaType: 1,
										previewType: 0,
										renderLargerThumbnail: true,
										mediaUrl: gh,
										sourceUrl: gh,
									}
								}
							})
						}
					}
				},
				{
					quoted: hw
				})
				await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
				{
					messageId: msg.key.id
				})
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'pushkontak2':
			{
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!isGroup) return shoNherly(mess.groups);
				var name = text.split('/')[0];
				var chet = text.split('/')[1];
				if (!name) return shoNherly(`Contoh: ${prefix + command} nama/pesan`);
				if (!chet) return shoNherly(`Contoh: ${prefix + command} nama/pesan`);
				let kontak = {
					displayName: "Contact",
					contacts: [
					{
						displayName: name,
						vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;" + name + ";;;\nFN:" + name + "\nitem1.TEL;waid=" + m.sender.split('@')[0] + ":" + m.sender.split('@')[0] + "\nitem1.X-ABLabel:Ponsel\nEND:VCARD"
					}]
				}
				let push = await shoNhe.groupMetadata(m.chat)
				if (push.participants.length > 300) return shoNherly('Batas member maksimal: *300*')
				await shoNherly('bentar');
				for (let a of push.participants)
				{
					const repf = await shoNhe.sendMessage(a.id,
					{
						contacts: kontak
					})
					shoNhe.sendMessage(a.id,
					{
						text: chet
					},
					{
						quoted: repf
					})
					await sleep(1000);
				}
				await shoNherly(mess.dones);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'banned':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (!args[0]) return shoNherly(`*Contoh : ${command} add 6281214281312*`)
				if (args[1])
				{
					orgnye = args[1] + "@s.whatsapp.net"
				}
				else if (m.quoted)
				{
					orgnye = m.quoted.sender
				}
				const isBane = banned.includes(orgnye)
				if (args[0] === "add")
				{
					if (isBane) return shoNherly('*Pengguna Ini telah Di Ban*')
					banned.push(orgnye)
					shoNherly(`Succes ban Pengguna Ini`)
				}
				else if (args[0] === "del")
				{
					if (!isBane) return shoNherly('*Pengguna Ini Telah Di hapus Dari Ban*')
					let delbans = banned.indexOf(orgnye)
					banned.splice(delbans, 1)
					shoNherly(`*Berhasil Menghapus Pengguna yang Di Ban*`)
				}
				else
				{
					shoNherly("Error")
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'listban':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (isBan) return shoNherly(mess.bands)
				teksooop = `*List Ban*\n\n`
				for (let ii of banned)
				{
					teksooop += `- ${ii}\n`
				}
				shoNherly(teksooop)
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'autoread':
			{
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (args.length < 1) return shoNherly(`Contoh: ${prefix + command} true/false?`);
				if (q === 'true')
				{
					global.db.data.settings[botNumber].autoread = true;
					shoNherly(`Yay! Auto-read berhasil diubah ke ${q}`);
				}
				else if (q === 'false')
				{
					global.db.data.settings[botNumber].autoread = false;
					shoNherly(`Oke deh! Auto-read berhasil dimatikan, jadi gak bakal dibaca otomatis nih!`);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'totalfitur':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const total = ((fs.readFileSync('./case.js').toString()).match(/case '/g) || []).length
				shoNherly(`Total Fitur : ${total}`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'addprem':
			case 'addpremium':
			case 'setpremium':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!args[0]) return shoNherly(`Usar ${prefix + command} número\nEjemplo: ${prefix + command} 6285655548594`);
				const bnnd = q.split("|")[0].replace(/[^0-9]/g, '');
				const ceknye = await shoNhe.onWhatsApp(bnnd);
				if (ceknye.length == 0) return shoNherly(`¡Ingresa un número válido y registrado en WhatsApp!`);
				if (prem.includes(bnnd)) return shoNherly('¡Este número ha sido registrado como Usuario Premium!');
				prem.push(bnnd);
				fs.writeFileSync('./database/premium.json', JSON.stringify(prem, null, 2));
				// Update role di userFire.json
				const dbFire = loadUserFire();
				const userJid = bnnd + '@s.whatsapp.net';
				dbFire[userJid] = {
					register: true,
					limit: 1000,
					role: 'vip'
				};
				saveUserFire(dbFire);
				shoNherly(`Número ${bnnd} ¡¡¡Ahora Usuario Premium (VIP)!!! 🎉`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'antispam':
			{
				if (!isGroup) return shoNherly(mess.groups);
				if (!isBotAdmins) return shoNherly(mess.abots);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				if (args.length < 1) return shoNherly('true/false?')
				if (args[0] === 'true')
				{
					db.data.chats[m.chat].antispam = true
					shoNherly(`${command} is activado`)
				}
				else if (args[0] === 'false')
				{
					db.data.chats[m.chat].antispam = false
					shoNherly(`${command} is desactivado`)
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'delprem':
			case 'deletepremium':
			case 'delpremium':
			case 'delpr':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!args[0]) return shoNherly(`Usar ${prefix + command} número\nEjemplo: ${prefix + command} 6285655548594`);
				const ya = q.split("|")[0].replace(/[^0-9]/g, '');
				if (!prem.includes(ya)) return shoNherly('¡Este número no está registrado como Usuario Premium!');
				const unp = prem.indexOf(ya);
				prem.splice(unp, 1);
				fs.writeFileSync('./database/premium.json', JSON.stringify(prem, null, 2));
				// Update role di userFire.json
				const dbFire = loadUserFire();
				const userJid = ya + '@s.whatsapp.net';
				if (dbFire[userJid])
				{
					dbFire[userJid].role = 'user';
					dbFire[userJid].limit = 100;
					saveUserFire(dbFire);
				}
				shoNherly(`Número ${ya} ¡Eliminado con éxito de la lista de usuarios Premium! ❌`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'listprem':
			case 'listpremium':
			case 'listpr':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				let teks = '┌──⭓「 *List Premium User* 」\n│\n';
				for (let x of prem)
				{
					teks += `│⭔ ${x}\n`;
				}
				teks += `│\n└────────────⭓\n\n*Total : ${prem.length}*`;
				shoNherly(teks);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'statustext':
			case 'upswtext':
			case 'upswteks':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!q) return shoNherly('Teksnya mana?');
				await shoNhe.sendMessage('status@broadcast',
				{
					text: q
				},
				{
					backgroundColor: '#FF000000',
					font: 3,
					statusJidList: Object.keys(global.db.data.users)
				});
				shoNherly('Sukses kirim status teks!');
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'sendclear':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!text) return shoNherly('Masukkan ID grup atau nomor kontak.');
				const targetId = text.trim(); // ID grup atau nomor tujuan
				const emptyMessage = '\n'.repeat(1000); // Membuat pesan kosong dengan 1000 baris
				try
				{
					await shoNhe.sendMessage(targetId,
					{
						text: emptyMessage
					}); // Mengirimkan pesan
					shoNherly(`Pesan kosong sebanyak 1000 baris berhasil dikirim ke ${targetId}.`);
				}
				catch (error)
				{
					console.error(error);
					shoNherly('Gagal mengirim pesan kosong. Pastikan ID yang Anda masukkan benar.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'statusvideo':
			case 'upswvideo':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (/video/.test(mime))
				{
					// Unduh video dari pesan yang di-reply
					var videosw = await shoNhe.downloadAndSaveMediaMessage(quoted);
					// Dapatkan informasi default untuk caption
					let fileSize = quoted.fileLength ? `${(quoted.fileLength / 1024 / 1024).toFixed(2)} MB` : 'Tidak diketahui';
					let mediaType = mime || 'Tidak diketahui';
					let sendTime = new Date().toLocaleString('id-ID',
					{
						timeZone: 'Asia/Jakarta'
					});
					let sender = `${m.pushName || namaowner}`;
					// Buat caption default
					let defaultCaption = `📁 *Ukuran File:* ${fileSize}\n` + `🎥 *Tipe Media:* ${mediaType}\n` + `⏰ *Waktu Dikirim:* ${sendTime}\n` + `👤 *Dikirim oleh:* ${sender}`;
					// Kirim video ke status WhatsApp
					await shoNhe.sendMessage('status@broadcast',
					{
						video:
						{
							url: videosw
						},
						caption: q ? q : defaultCaption
					},
					{
						statusJidList: Object.keys(global.db.data.users)
					});
					await shoNherly('✅ Video berhasil dikirim ke status WhatsApp dengan caption bawaan!');
				}
				else
				{
					shoNherly('⚠️ Tolong reply ke video dulu ya, Cik! 🎥');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'setprompt2':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly('⚠️ Harap masukkan prompt yang ingin digunakan.\n\nContoh: setprompt Kamu adalah AI yang membantu pengguna.');
				if (!(await firely(m, mess.waits))) return;
				aiPrompt = text;
				shoNherly(`✅ Prompt berhasil diperbarui:\n\n${aiPrompt}`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'llama':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case mengikuti nama API
				if (!text) return shoNherly('⚠️ Harap masukkan teks yang ingin dijadikan input untuk AI.\n\nContoh: llama33 Apa itu teknologi AI?');
				try
				{
					// Panggil API dengan prompt dan teks yang diberikan
					const apiUrl = `https://api.siputzx.my.id/api/ai/llama33?prompt=${encodeURIComponent(aiPrompt)}&text=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl);
					if (response.data && response.data.status)
					{
						shoNherly(response.data.data); // Balas dengan output dari AI
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'metaai':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case sesuai API
				if (!text) return shoNherly('⚠️ Harap masukkan teks yang ingin dijadikan input untuk AI.\n\nContoh: meta-llama Apa kabar?');
				try
				{
					// Panggil API tanpa prompt
					const apiUrl = `https://api.siputzx.my.id/api/ai/meta-llama-33-70B-instruct-turbo?content=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl);
					if (response.data && response.data.status)
					{
						shoNherly(response.data.data); // Balas dengan output dari AI
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'nous':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case sesuai API
				if (!text) return shoNherly('⚠️ Harap masukkan teks yang ingin dijadikan input untuk AI.\n\nContoh: nous-hermes Hai, apa kabar?');
				try
				{
					// Panggil API dengan parameter content
					const apiUrl = `https://api.siputzx.my.id/api/ai/nous-hermes?content=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl);
					if (response.data && response.data.status)
					{
						shoNherly(response.data.data); // Balas dengan output dari AI
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'bett':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const tecs = 'Keren king buttonnya simple wgwgg'
				const textButtons = [
				{
					buttonId: `${prefix}info`,
					buttonText:
					{
						displayText: "Info ℹ️"
					}
				},
				{
					buttonId: `${prefix}help`,
					buttonText:
					{
						displayText: "Help ❓"
					}
				}, ];
				betontex(shoNhe, m.chat, tecs, textButtons, hw);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'bett2':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const olin = 'I love you broo🔥'
				const ShoNhevid = fs.readFileSync("./ShoNheMedia/video/sych.mp4")
				const vidButtons = [
				{
					buttonId: `${prefix}cc`,
					buttonText:
					{
						displayText: "Play ▶️"
					}
				},
				{
					buttonId: `${prefix}pause`,
					buttonText:
					{
						displayText: "Pause ⏸️"
					}
				}, ];
				betonvid(shoNhe, m.chat, ShoNhevid, olin, namaBot, vidButtons, hw);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'bett3':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const sica = 'Halo aku adalah ShoNhe'
				const ShoNhegam = fs.readFileSync("./ShoNheMedia/image/bot.jpg")
				const imgButtons = [
				{
					buttonId: `${prefix}about`,
					buttonText:
					{
						displayText: "About 👤"
					}
				},
				{
					buttonId: `${prefix}contact`,
					buttonText:
					{
						displayText: "Contact 📞"
					}
				}, ];
				betonimg(shoNhe, m.chat, ShoNhegam, sica, namaowner, imgButtons, hw);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'claudeai':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case sesuai API
				if (!text) return shoNherly('⚠️ Harap masukkan teks yang ingin dijadikan input untuk AI.\n\nContoh: claudeai Apa kabar?');
				try
				{
					// Panggil API dengan input dari pengguna
					const apiUrl = `https://api.siputzx.my.id/api/ai/claude-sonnet-35?content=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl);
					if (response.data && response.data.status)
					{
						shoNherly(response.data.data); // Balas dengan output dari AI
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'dbrxai':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case sesuai API
				if (!text) return shoNherly('⚠️ Harap masukkan teks yang ingin dijadikan input untuk AI.\n\nContoh: dbrxai Apa kabar?');
				try
				{
					// Panggil API dengan input dari pengguna
					const apiUrl = `https://api.siputzx.my.id/api/ai/dbrx-instruct?content=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl);
					if (response.data && response.data.status)
					{
						shoNherly(response.data.data); // Balas dengan output dari AI
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'bensin':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const db = loadUserFire();
				const sender = m.sender;
				// Jika user belum ada di database, buat default data
				if (!db[sender])
				{
					db[sender] = {
						limit: 100,
						role: 'user',
						lastClaim: 0,
						registrationSeries: generateUniqueSeries() // Pastikan setiap user memiliki seri unik
					};
					saveUserFire(db);
				}
				const user = db[sender];
				const currentTime = Date.now();
				const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 hari dalam milidetik
				const userSeries = user.registrationSeries || '';
				const userRole = user.role || 'user';
				// Role owner (unlimited fire)
				if (userRole === 'owner')
				{
					return shoNherly('¿Qué haces rey? Solo te despido hasta 🗿');
				}
				// Cek apakah pengguna sudah klaim dalam seminggu terakhir
				if (currentTime - user.lastClaim < oneWeek)
				{
					const remainingTime = oneWeek - (currentTime - user.lastClaim);
					const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
					const hours = Math.floor((remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
					const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
					return shoNherly(`⚠️ Ya has reclamado esta semana. Inténtalo de nuevo en ${days} días, ${hours} horas y ${minutes} minutos.`);
				}
				// Cek keberuntungan berdasarkan seri
				let reward;
				let message;
				// Seri yang berawalan 'A' atau 'a' mendapatkan 500 limit
				if (/^[Aa]/.test(userSeries))
				{
					reward = 150;
					message = `🎉 ¡La suerte está de tu lado! Tu serie única (${userSeries}) ha obtenido ${reward} límite.`;
				}
				// Seri yang berawalan angka mendapatkan 500 limit
				else if (/^\d/.test(userSeries))
				{
					reward = 150;
					message = `🎉 Tu serie de números (${userSeries}) ha obtenido ${reward} límite.`;
				}
				// Seri lainnya mendapatkan limit acak antara 1-20
				else
				{
					reward = Math.floor(Math.random() * 20) + 1; // Limit acak 1-20
					message = `🔥 Has obtenido ${reward} límite de tu serie única (${userSeries}).`;
				}
				// Update limit dan waktu klaim pengguna
				user.limit += reward;
				user.lastClaim = currentTime;
				saveUserFire(db);
				shoNherly(message);
			}
			break;
			case 'deepseek':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case sesuai API
				if (!text) return shoNherly('⚠️ Por favor, ingresa el texto que deseas usar como entrada para la IA.\n\nEjemplo: deepseek ¿Cómo estás?');
				try
				{
					// Panggil API dengan input dari pengguna
					const apiUrl = `https://api.siputzx.my.id/api/ai/deepseek-llm-67b-chat?content=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl);
					if (response.data && response.data.status)
					{
						shoNherly(response.data.data); // Balas dengan output dari AI
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'setmenu':
			{
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (!text) return shoNherly(`There are 8 menu(s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12)\nPlease select one\nExample ${prefix + command} s1`)
				if (text.startsWith('s'))
				{
					typemenu = text
					shoNherly(mess.dones)
				}
				else
				{
					shoNherly(`There are 8 menu(s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12)\nPlease select one\nExample ${prefix + command} s1`)
				}
			}
			break
			case 'setreply':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!text)
				{
					return shoNherly(`Ada 4 pilihan reply (s1, s2, s3, s4)\nSilakan pilih salah satu.\nContoh: ${prefix + command} s1`);
				}
				if (text.startsWith('s'))
				{
					typereply = text; // Set tipe reply
					return shoNherly(mess.dones); // Berikan konfirmasi sukses
				}
				// Jika input tidak valid
				return shoNherly(`Ada 4 pilihan reply (s1, s2, s3, s4)\nSilakan pilih salah satu.\nContoh: ${prefix + command} s1`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'privatechatonly':
				if (!isShoNheOwn) return shoNherly('⚠️ Hanya owner yang bisa menggunakan perintah ini.');
				const status = args[0]?.toLowerCase();
				if (status === 'on')
				{
					global.privateChatOnly = true;
					global.public = true;
					global.groupOnly = false;
					shoNherly('✅ Se ha activado el modo Solo chat privado.\n❌ El modo de grupo ha sido deshabilitado');
				}
				else if (status === 'off')
				{
					global.privateChatOnly = false;
					global.public = true;
					shoNherly('❌ El modo Solo chat privado ha sido deshabilitado.\n✅ El modo público ha sido activado');
				}
				else
				{
					shoNherly('❌ Usar: privatechatonly [on/off]');
				}
				break;
			case 'dreamshaper':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case sesuai API
				if (!text) return shoNherly('⚠️ Harap masukkan prompt untuk membuat gambar.\n\nContoh: dreamshaper buatkan gambar kucing');
				if (!(await firely(m, mess.waits))) return;
				try
				{
					// Panggil API dengan input dari pengguna
					const apiUrl = `https://api.siputzx.my.id/api/ai/dreamshaper?prompt=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl,
					{
						responseType: 'arraybuffer'
					}); // Mengatur response untuk menangani buffer gambar
					if (response.status === 200)
					{
						const buffer = Buffer.from(response.data, 'binary'); // Konversi data menjadi buffer
						shoNhe.sendMessage(m.chat,
						{
							image: buffer,
							caption: `Gambar berhasil dibuat berdasarkan prompt: "${text}"`
						},
						{
							quoted: m
						});
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'kontoool':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				let menu = `*_👋🏻 *¡Hola! Soy TechFix Bot versión 9999.* ¡Productos listos como nokos y muchos más! Diseñado con precisión y cuidado, me aseguro de que su experiencia sea fluida y eficiente.  

╭───❐ *I N F O R M A S I* ❐───✧  
├ 📜 *Bot Name* : TechFix 
├ 👨‍💻 *Owner* : Manu  
├ 🌐 *Version* : 9999  
├ 🛒 *Product* : Nokos  
╰─────────────────────✧  

💡 *¡Siéntete libre de explorar todas mis funciones usando el menú proporcionado!*  
🔰 *_Powered by ManuDiaz_*`;
				// Tombol utama
				let buttons = [
				{
					buttonId: ".bot mode self",
					buttonText:
					{
						displayText: " Self "
					},
					type: 1
				},
				{
					buttonId: ".bot mode public",
					buttonText:
					{
						displayText: " Public "
					},
					type: 1
				}];
				// Pesan dengan media video
				let buttonMessage = {
					document: global.forpdf,
					fileName: waktuucapan,
					mimetype: 'application/pdf',
					fileLength: '100000000000000',
					pageCount: '999',
					image:
					{
						url: getRandomThumb2(), // Pastikan file ini tersedia
						gifPlayback: true
					},
					caption: `${menu}`, // Teks menu
					contextInfo:
					{
						forwardingScore: 999,
						isForwarded: true,
						externalAdReply:
						{
							title: "Bot Status",
							body: "🟢 Active",
							thumbnail: getRandomThumb3(),
							mediaType: 1,
							renderLargerThumbnail: true,
							previewType: 0,
							mediaUrl: gh,
							sourceUrl: gh
						}
					},
					footer: "© TechFix",
					buttons: buttons,
					viewOnce: true,
					headerType: 4
				};
				// Tambahan flow actions
				const flowActions = [
				{
					buttonId: 'action',
					buttonText:
					{
						displayText: 'Esta lista de botones'
					},
					type: 4,
					nativeFlowInfo:
					{
						name: 'single_select',
						paramsJson: JSON.stringify(
						{
							title: "¡Seleccione Menú!",
							sections: [
							{
								title: "Seleccione el botón de menú a continuación",
								highlight_label: "Powered by ManuDiaz",
								rows: [
								{
        "title": "📜 Todos los Menús",
        "description": "Ver todos los menús",
        "id": ".allmenuu"
    },
    {
        "title": "👑 Propietario",
        "description": "Información del propietario",
        "id": ".pepek"
    },
    {
        "title": "🛒 Productos",
        "description": "Información de productos",
        "id": ".produk"
    },
    {
        "title": "💰 Donaciones",
        "description": "Apoya con una donación",
        "id": ".donasi"
    },
    {
        "title": "👥 Menú de Grupo",
        "description": "Opciones para grupos",
        "id": ".grupmenu"
    },
    {
        "title": "⚙️ Configuración del Bot",
        "description": "Ajustes y configuraciones",
        "id": ".bot byy"
								}]
							}]
						})
					},
					viewOnce: true
				}, ];
				// Tambahkan flowActions ke buttonMessage
				buttonMessage.buttons.push(...flowActions);
				// Kirim pesan
				await shoNhe.sendMessage(m.chat, buttonMessage,
				{
					quoted: m
				});
				}
			break
			case 'img2text':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				try
				{
					// Periksa apakah file media valid (gambar)
					if (/webp|jpg|jpeg|png/.test(mime))
					{
						// Menambahkan pesan loading dan menyimpan key untuk edit nanti
						if (!(await firely(m, mess.waits))) return; // Jika limit habis, proses berhenti di sini
						// Emoji yang akan digunakan
						const reactEmojis = ["⏳", "🕛", "🕒", "🕕", "🕘", "🕛", "✅"];
						// Mengirimkan reaksi secara berurutan
						for (const emoji of reactEmojis)
						{
							await shoNhe.sendMessage(m.chat,
							{
								react:
								{
									text: emoji,
									key: m.key
								}
							});
						}
						// Unduh media
						let media = await quoted.download();
						// Unggah media ke Uguu.se untuk mendapatkan URL
						let anu = await UguuSe(media);
						if (!anu.url) throw 'Gagal mengunggah media ke Uguu.se!';
						// Kirim URL ke API Anda
						let response = await fetch(`https://api.siputzx.my.id/api/ai/image2text?url=${anu.url}`);
						let result = await response.json();
						// Periksa respons API
						if (result.status && result.data)
						{
							// Terjemahkan hasil ke Bahasa Indonesia menggunakan translate-google-api
							let translatedText = await translate(result.data,
							{
								from: 'en',
								to: 'id'
							});
							// Kirim hasil terjemahan ke pengguna
							shoNherly(`*Hasil Deskripsi Gambar (Bahasa Indonesia):*\n\n${translatedText}`);
						}
						else
						{
							shoNherly('❌ Gagal mendapatkan deskripsi gambar dari API!');
						}
					}
					else
					{
						shoNherly('⚠️ Kirim atau reply gambar yang ingin diubah menjadi teks!');
					}
				}
				catch (e)
				{
					// Tangani error dan kirim pesan jika ada masalah
					console.error(e);
					shoNherly('❌ Terjadi kesalahan saat memproses gambar!');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'venice':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case sesuai API
				if (!text) return shoNherly('⚠️ Harap masukkan prompt untuk AI Venice.\n\nContoh: venice Hai, bagaimana kabarmu?');
				try
				{
					// Panggil API dengan prompt dari pengguna
					const apiUrl = `https://api.siputzx.my.id/api/ai/venice?prompt=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl);
					// Cek respons API
					if (response.data && response.data.status)
					{
						shoNherly(response.data.message); // Balas dengan output dari AI Venice
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'addsaldo':
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (args.length < 2) return shoNherly('⚠️ Format salah! Gunakan: .addsaldo @tag/nomor jumlah');
				let targetUser;
				// Cek apakah pengguna mengetik dengan mention atau nomor HP
				if (m.mentionedJid.length > 0)
				{
					targetUser = m.mentionedJid[0]; // Ambil user dari mention
				}
				else
				{
					targetUser = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'; // Ambil angka saja dan ubah format
				}
				let amount = parseInt(args[1]);
				if (isNaN(amount) || amount <= 0)
				{
					return shoNherly('⚠️ Masukkan jumlah saldo yang valid.');
				}
				const result = addBalance(targetUser, amount, m.sender);
				shoNherly(result);
				break;
			case 'find':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const series = args[0];
				if (!series)
				{
					shoNherly(`⚠️ Harap masukkan kode seri.`);
					return;
				}
				const db = loadUserFire();
				const userEntry = Object.entries(db).find(([_, user]) => user.registrationSeries === series);
				if (userEntry)
				{
					const [sender, user] = userEntry;
					shoNherly(`🎉 Pengguna ditemukan:\n- Nama: ${m.pushName || 'Tidak diketahui'}\n- Nomor: ${sender.split('@')[0]}\n- Role: ${user.role}\n- Limit: ${user.limit}\n- Seri: ${user.registrationSeries}`);
				}
				else
				{
					shoNherly(`⚠️ Tidak ada pengguna dengan kode seri tersebut.`);
				}
			}
			break;
			case 'claim':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const db = loadUserFire();
				const user = db[m.sender];
				shoNherly(`🎉 ¡Feliz! Su código de serie es *${user.registrationSeries}*.\n¡Utilízalo para reclamar premios en ciertos eventos!`);
				}
			break
			case 'tesload':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const lod = ["█▒▒▒▒▒▒▒▒▒▒▒ 10%", "███▒▒▒▒▒▒▒▒▒ 30%", "██████▒▒▒▒▒▒ 50%", "████████▒▒▒▒ 80%", "███████████ 100%"];
const {
    key
} = await shoNhe.sendMessage(m.chat, {
    text: '⚠️ *INICIALIZANDO SISTEMA...* ESPERE POR FAVOR...'
});

for (let i = 0; i < lod.length; i++) {
    await shoNhe.sendMessage(m.chat, {
        text: `🖥️ *ACTUALIZACIÓN DE ESTADO*:\n\n⏳ *CARGANDO...* ${lod[i]}\n\n*Procesando el sistema... Por favor, tenga paciencia. Esto puede tardar unos momentos..*`
    });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading delay
}

await shoNhe.sendMessage(m.chat, {
    text: '✅ *INICIALIZACIÓN DEL SISTEMA COMPLETADA.*\n\n*Bienvenido a la red.*'
});
				// Proses loading dengan update pesan secara bertahap
				for (let i = 0; i < lod.length; i++)
				{
					await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay
					await shoNhe.sendMessage(m.chat,
					{
						text: lod[i],
						edit: key
					});
				}
				// Setelah semua update selesai, edit menjadi "Loading selesai"
				await shoNhe.sendMessage(m.chat,
				{
					text: '✅ ¡Carga completa!',
					edit: key
				});
				// Kirim pesan lain setelah loading selesai
				shoNherly('¡El proceso de carga se ha completado!');
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'addthumb2':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!quoted || !/image/.test(mime)) return shoNherly(`Kirim/Reply Image dengan Caption untuk menambahkan thumbnail.`);
				const namaThumb2 = text.trim();
				if (!namaThumb2) return shoNherly(`Masukkan nama thumbnail yang ingin ditambahkan.`);
				const resultAdd2 = await addThumb2(namaThumb2, quoted, mime);
				shoNherly(resultAdd2);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'delthumb2':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const namaHapus2 = text.trim();
				if (!namaHapus2) return shoNherly(`Masukkan nama thumbnail yang ingin dihapus.`);
				const resultDel2 = delThumb2(namaHapus2);
				shoNherly(resultDel2);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'listthumb2':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const listResult2 = listThumb2();
				shoNherly(listResult2);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'addthumb3':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!quoted || !/image/.test(mime)) return shoNherly(`Kirim/Reply Image dengan Caption untuk menambahkan thumbnail.`);
				const namaThumb3 = text.trim();
				if (!namaThumb3) return shoNherly(`Masukkan nama thumbnail yang ingin ditambahkan.`);
				const resultAdd3 = await addThumb3(namaThumb3, quoted, mime);
				shoNherly(resultAdd3);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'delthumb3':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const namaHapus3 = text.trim();
				if (!namaHapus3) return shoNherly(`Masukkan nama thumbnail yang ingin dihapus.`);
				const resultDel3 = delThumb3(namaHapus3);
				shoNherly(resultDel3);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'listthumb3':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const listResult3 = listThumb3();
				shoNherly(listResult3);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'revoke':
			case 'resetlink':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins && !isShoNheOwns) return shoNherly(mess.admins);
				if (!isBotAdmins) return shoNherly(mess.abots);
				await shoNhe.groupRevokeInvite(m.chat).then(res =>
				{
					shoNherly(`Reset Success`)
				})
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'latukam':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case sesuai API
				if (!text) return shoNherly('⚠️ Harap masukkan konten untuk AI Latukam.\n\nContoh: latukam Hai, bagaimana kabarmu?');
				try
				{
					// Panggil API dengan input dari pengguna
					const apiUrl = `https://api.siputzx.my.id/api/ai/latukam?content=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl);
					// Cek respons API
					if (response.data && response.data.status)
					{
						shoNherly(response.data.data); // Balas dengan output dari AI Latukam
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			//=============[ Islam - Feature ]=================//
			
case 'kisahnabi': {
if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
if (!text) return shoNherly(`Masukan nama nabi\nExample: kisahnabi adam`)
let url = await fetch(`https://raw.githubusercontent.com/ZeroChanBot/Api-Freee/a9da6483809a1fbf164cdf1dfbfc6a17f2814577/data/kisahNabi/${text}.json`)
let kisah = await url.json().catch(_ => "Error")
if (kisah == "Error") return shoNherly("*Not Found*")

let hasil = `*👳 Nabi :* ${kisah.name}
*- Tanggal Lahir :* ${kisah.thn_kelahiran}
*- Tempat Lahir :* ${kisah.tmp}
*- Usia :* ${kisah.usia}

*—————— \`[ K I S A H ]\` ——————*

${kisah.description}`

shoNherly(`${hasil}`)
if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
}
break
case 'asmaulhusna': {
if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
    const contoh = `*\`「 Asmaul Husna 」\`*`;
    const anjuran = `
Dari Abu Hurairah radhiallahu anhu, Rasulullah Saw bersabda: 
*"إِنَّ لِلَّهِ تَعَالَى تِسْعَةً وَتِسْعِينَ اسْمًا، مِائَةٌ إِلَّا وَاحِدًا، مَنْ أَحْصَاهَا دخل الجنة، وهو وتر يُحِبُّ الْوِتْرَ"*  
**Artinya:** "Sesungguhnya Allah mempunyai sembilan puluh sembilan nama, alias seratus kurang satu. Barang siapa yang menghitung-hitungnya, niscaya masuk surga; Dia Witir dan menyukai yang witir".`;
    
    let json = global.asmaulhusna2;

    // Jika tidak ada argumen, tampilkan semua Asmaul Husna
    if (!args[0]) {
        let data = json.map((v, i) => 
            `${i + 1}. ${v.latin}\n${v.arabic}\n*Artinya (ID):* _"${v.translation_id}"_\n*Artinya (EN):* _"${v.translation_en}"_`
        ).join('\n\n');
        return shoNherly(`${contoh}\n\n${data}\n\n${anjuran}`);
    }

    // Jika ada argumen, tampilkan Asmaul Husna berdasarkan nomor
    if (args[0]) {
        if (isNaN(args[0])) return reply(`Contoh penggunaan:\nasmaulhusna 1`);
        if (args[0] < 1 || args[0] > 99) throw `Minimal 1 dan maksimal 99!`;

        let result = json.find(v => v.index == args[0].replace(/[^0-9]/g, ''));
        if (!result) return reply(`Asmaul Husna nomor ${args[0]} tidak ditemukan!`);
        
        return shoNherly(`*\`「 Asmaul Husna 」\`*

No. ${result.index}
*${result.latin}*
${result.arabic}
*Artinya (ID):* _"${result.translation_id}"_  
*Artinya (EN):* _"${result.translation_en}"_`);
    }
    if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
}
break;


case 'ayatkursi': {
if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
    let ayatKursi = `
    *Ayat Kursi*

    *Arab:*
    اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ  

    *Latin:*
    Allahu laa ilaaha illa huwa, Al-Hayyul Qayyum, laa ta'khudhuhu sinatun wa laa naum, lahu maa fis-samaawaati wa maa fil-ardh, man dzalladzii yasyfa'u 'indahu illa bi idznih, ya'lamu maa baina aidiihim wa maa khalfahum, wa laa yuhiithuuna bisyai-in min 'ilmihi illa bimaa syaa, wa si'a kursiyyuhus-samaawaati wal-ardh, wa laa ya'uduhu hifzhuhumaa wa huwal 'aliyyul azhiim.  

    *Artinya:*
    Allah, tidak ada Tuhan melainkan Dia yang hidup kekal lagi terus-menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafa'at di sisi Allah tanpa izin-Nya. Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Maha Tinggi lagi Maha Besar.  
    `;
    shoNherly(ayatKursi.trim());
    if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
}
break;
case 'bacaansholat': {
if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
    let bacaan = JSON.stringify(global.bacaanshalat);
    let json = JSON.parse(bacaan);
    let data = json.result
        .map((v, i) => `${i + 1}. ${v.name}\n${v.arabic}\n${v.latin}\n*Artinya:*\n_"${v.terjemahan}"_`)
        .join('\n\n');
    let contoh = `*\`「 Bacaan Shalat 」\`*\n\n`;
    shoNherly(`${contoh}${data}`);
    if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
}
break;

case 'doaharian': {
let src = JSON.parse(fs.readFileSync('./lib/json/doaharian.json', 'utf-8'))
let caption = src.map((v, i) => {
return `
*${i + 1}.* ${v.title}

•°• Latin :
${v.latin}

•°• Arabic :
${v.arabic}

•°• Translate :
${v.translation}
`.trim()
}).join('\n\n')
shoNherly(`${caption}`)
}
break
case 'niatsholat': {
if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
    if (!q) return reply(`Contoh Penggunaan :\nniatsholat Subuh`);
    let text = q.toLowerCase() || '';
    let data = global.niatsholat.find(v => v.solat === text);
    if (!data) return shoNherly(`*\`[ ${q} Tidak Ditemukan ]\`*\n\nList Solat 5 Waktu :\n• Subuh\n• Maghrib\n• Dzuhur\n• Isha\n• Ashar`);
    shoNherly(`*\`[ Niat Sholat ${q.charAt(0).toUpperCase() + q.slice(1)} ]\`*

*Arab :* ${data.arabic}

*Latin :* ${data.latin}

*Translate :* ${data.translation_id}`.trim());
if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
}
break;

case 'quotesislami': {
if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
    const global = {
        qislami: [
            { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", arti: "Sesungguhnya bersama kesulitan ada kemudahan." },
            { arabic: "وَقُل رَّبُّ زِدْنِي عِلْمًا", arti: "Dan katakanlah: 'Ya Tuhanku, tambahkanlah ilmu kepadaku.'" },
            { arabic: "اللّهُ لَا إِلٰهَ إِلَّا هُوَ", arti: "Allah, tidak ada Tuhan selain Dia." },
            { arabic: "وَقَتَلْتُ نَفْسَكِ فَاغْفِرْ لِي", arti: "Dan aku telah membunuh diriku, maka ampunilah aku." },
            { arabic: "إِنَّ اللّهَ مَعَ الصَّابِرِينَ", arti: "Sesungguhnya Allah bersama orang-orang yang sabar." },
            { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", arti: "Sesungguhnya bersama kesulitan ada kemudahan." },
            { arabic: "رَبُّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَاهُ", arti: "Tuhan kami, janganlah Engkau hukum kami jika kami lupa." },
            { arabic: "إِنَّ اللّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", arti: "Sesungguhnya Allah Maha Kuasa atas segala sesuatu." },
            { arabic: "اللّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", arti: "Allah adalah cahaya langit dan bumi." },
            { arabic: "مَن جَاءَ بِالْحَسَنَةِ فَلَهُ عَشْرُ أَمْثَالِهَا", arti: "Barangsiapa yang membawa kebaikan, maka dia mendapat sepuluh kali lipat ganjarannya." },
            { arabic: "إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَا وَمَمَاتِي لِلّهِ رَبِّ الْعَالَمِينَ", arti: "Sesungguhnya salatku, ibadahku, hidupku, dan matiku hanya untuk Allah, Tuhan semesta alam." },
            { arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ", arti: "Dan Tuhanmu berfirman: 'Berdoalah kepada-Ku, niscaya Aku akan mengabulkan doamu.'" },
            { arabic: "إِنَّ اللّهَ غَفُورٌ رَحِيمٌ", arti: "Sesungguhnya Allah Maha Pengampun lagi Maha Penyayang." },
            { arabic: "الْفَجْرِ وَلَيَالٍ عَشْرٍ", arti: "Demi fajar dan sepuluh malam yang terakhir." },
            { arabic: "إِنَّ اللّهَ يُحِبُّ التَّوَابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ", arti: "Sesungguhnya Allah mencintai orang-orang yang bertaubat dan mencintai orang-orang yang mensucikan diri." },
            { arabic: "رَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ", arti: "Rahmat-Ku meliputi segala sesuatu." },
            { arabic: "إِنَّ اللّهَ مَعَ الَّذِينَ اتَّقَوْا وَالَّذِينَ هُمْ مُحْسِنُونَ", arti: "Sesungguhnya Allah bersama orang-orang yang bertakwa dan orang-orang yang berbuat baik." },
            { arabic: "أُحِبُّ لِأَخِيكَ مَا تُحِبُّ لِنَفْسِكَ", arti: "Cintailah untuk saudaramu apa yang kamu cintai untuk dirimu sendiri." },
            { arabic: "قُلْ هُوَ اللّهُ أَحَدٌ", arti: "Katakanlah: 'Dia adalah Allah, yang Maha Esa.'" },
            { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", arti: "Sesungguhnya bersama kesulitan ada kemudahan." },
            { arabic: "وَفِرْحَةً لِأَصْحَابِ الْجَنَّةِ", arti: "Dan kegembiraan bagi penghuni surga." },
            { arabic: "إِنَّ اللّهَ سَمِيعٌ بَصِيرٌ", arti: "Sesungguhnya Allah Maha Mendengar lagi Maha Melihat." },
            { arabic: "وَتَوَكَّلْتُ عَلَى اللّهِ", arti: "Dan aku bertawakkal kepada Allah." },
            { arabic: "لَا إِلٰهَ إِلَّا اللّهُ وَحْدَهُ", arti: "Tidak ada Tuhan selain Allah, yang Maha Esa." },
            { arabic: "إِنَّ اللّهَ يُحِبُّ الصَّابِرِينَ", arti: "Sesungguhnya Allah mencintai orang-orang yang sabar." },
            { arabic: "مَنْ تَرَكَ شَيْئًا لِلَّهِ عَوَّضَهُ اللّهُ", arti: "Barang siapa meninggalkan sesuatu karena Allah, maka Allah akan memberinya ganti." },
            { arabic: "الْحَمْدُ لِلّهِ رَبِّ الْعَالَمِينَ", arti: "Segala puji bagi Allah, Tuhan semesta alam." },
            { arabic: "فَإِنَّ رَحْمَتِي سَبَقَتْ غَضَبِي", arti: "Sesungguhnya rahmat-Ku mendahului murka-Ku." },
            { arabic: "يُدَبِّرُ الْأَمْرَ", arti: "Dia yang mengatur segala urusan." },
            { arabic: "إِنَّ اللّهَ مَعَ الصَّابِرِينَ", arti: "Sesungguhnya Allah bersama orang-orang yang sabar." },
            { arabic: "اللّهُمَّ اجْعَلْنَا مِنْ أَهْلِ الْقُرْآنِ", arti: "Ya Allah, jadikan kami termasuk orang-orang yang ahli Al-Qur'an." },
            { arabic: "اللّهُ وَالْأَكْبَرُ", arti: "Allah Maha Besar." },
            { arabic: "إِنَّ رَبَّكَ وَاسِعُ الْمَغْفِرَةِ", arti: "Sesungguhnya Tuhanmu Maha Luas Pengampunannya." },
            { arabic: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ", arti: "Sesungguhnya orang-orang yang beriman itu bersaudara." },
            { arabic: "إِنَّ اللّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ", arti: "Sesungguhnya Allah itu Maha Indah dan mencintai keindahan." },
            { arabic: "إِنَّ الْمُتَّقِينَ فِي جَنَّاتٍ وَنَهَرٍ", arti: "Sesungguhnya orang-orang yang bertakwa berada dalam surga dan mata air." },
            { arabic: "وَمَنْ يَتَّقِ اللّهَ يَجْعَلْ لَهُ مَخْرَجًا", arti: "Dan barang siapa bertakwa kepada Allah, niscaya Dia akan memberikan jalan keluar baginya." },
            { arabic: "لَا تَحْزَنْ إِنَّ اللّهَ مَعَنَا", arti: "Janganlah kamu bersedih, sesungguhnya Allah bersama kita." },
            { arabic: "يُحِبُّونَ مَنْ جَاءَ وَفِيهِ النَّاسُ", arti: "Mereka mencintai orang yang datang di dalamnya." },
            { arabic: "وَمَا تَفْعَلُوا مِنْ خَيْرٍ فَإِنَّ اللّهَ يَعْلَمُهُ", arti: "Dan apa saja yang kamu kerjakan dari kebaikan, maka sesungguhnya Allah mengetahuinya." },
            { arabic: "لَا تَفْجَعْ أَعْمَالَكُمْ", arti: "Janganlah menyia-nyiakan amal-amalmu." },
            { arabic: "إِنَّ مَا وَعَدَكُمْ اللّهُ وَرَحْمَتَهُ", arti: "Sesungguhnya apa yang dijanjikan oleh Allah adalah kasih sayang-Nya." },
            { arabic: "أَنْتَ وَلِيِّي فِي دُنْيَا وَفِي آخِرَةٍ", arti: "Engkau adalah pelindungku di dunia dan di akhirat." },
            { arabic: "اللّهُمَّ اجْعَلْنَا مِمَّنْ يَسْتَمِعُونَ الْقَوْلَ فَيَتَّبِعُونَ أَحْسَنَهُ", arti: "Ya Allah, jadikan kami termasuk orang yang mendengarkan perkataan dan mengikuti yang terbaik darinya." },
            { arabic: "إِنَّ اللّهَ يُحِبُّ أَنْ تَفْعَلُوا الْحَسَنَاتِ", arti: "Sesungguhnya Allah mencintai jika kamu berbuat kebaikan." },
            { arabic: "قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَا وَمَمَاتِي لِلّهِ", arti: "Katakanlah, sesungguhnya salatku, ibadahku, hidupku, dan matiku hanya untuk Allah." },
            { arabic: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِلْعَالَمِينَ", arti: "Dan Kami tidak mengutusmu, melainkan untuk menjadi rahmat bagi semesta alam." },
            { arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا", arti: "Wahai orang-orang yang beriman," }
        ]
    };
    const randomIndex = Math.floor(Math.random() * global.qislami.length);
    const randomQuote = global.qislami[randomIndex];
    const { arabic, arti } = randomQuote;
    shoNherly(`${arabic}\n${arti}`);
    if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
}
break;

case 'doatahlil': {
if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
let { result } = JSON.parse(fs.readFileSync('./lib/json/tahlil.json', 'utf-8'))
let caption = result.map((v, i) => {
return `
*${i + 1}.* ${v.title}

•°• Arabic :
${v.arabic}

•°• Translate :
${v.translation}
`.trim()
}).join('\n\n')
shoNherly(`${caption}`)
if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
}
break
			case 'gwjgbskntl':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const repshow = {
					contextInfo:
					{
						forwardingScore: 1,
						isForwarded: true,
						forwardedNewsletterMessageInfo:
						{
							newsletterName: namabot,
							newsletterJid: idsaluran,
						},
						externalAdReply:
						{
							showAdAttribution: true,
							title: waktuucapan,
							body: namabot,
							thumbnail: getRandomThumb3(),
							sourceUrl: gh,
							mediaType: 1,
							renderLargerThumbnail: true
						},
					},
					audio:
					{
						url: './ShoNheMedia/audio/audio.mp3'
					}, // Ganti dengan path file audio
					mimetype: 'audio/mpeg', // Tipe file audio
					fileName: 'ShoNhe-song.mp3', // Nama file audio
					ptt: true, // Ubah ke true jika ingin dikirim sebagai pesan suara
				};
				return shoNhe.sendMessage(m.chat, repshow,
				{
					quoted: hw, // Pesan yang dikutip
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'qwq':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case sesuai API
				if (!text) return shoNherly('⚠️ Harap masukkan konten untuk API qwq.\n\nContoh: qwq Hai, bagaimana kabarmu?');
				try
				{
					// Panggil API dengan input dari pengguna
					const apiUrl = `https://api.siputzx.my.id/api/ai/qwq-32b-preview?content=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl);
					// Cek respons API
					if (response.data && response.data.status)
					{
						shoNherly(response.data.data); // Balas dengan output dari API QwQ-32B
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'stabilityai':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case sesuai API
				if (!text) return shoNherly('⚠️ Por favor ingresa un mensaje para Stability AI.\n\nEjemplo: stabilityai Crea una imagen de un árbol');
				if (!(await firely(m, mess.waits))) return;
				try
				{
					// Panggil API dengan input dari pengguna
					const apiUrl = `https://api.siputzx.my.id/api/ai/stabilityai?prompt=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl,
					{
						responseType: 'arraybuffer' // Pastikan menerima data dalam bentuk buffer
					});
					// Cek respons API
					if (response.status === 200)
					{
						const imageBuffer = Buffer.from(response.data, 'binary'); // Konversi respons ke buffer
						shoNhe.sendMessage(m.chat,
						{
							image: imageBuffer, // Kirim gambar sebagai buffer
							caption: `🖼️ A continuación se muestra una imagen de los resultados de Stability AI para el mensaje:\n\n"${text}"`
						},
						{
							quoted: m
						});
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'stable':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case sesuai API
				if (!text) return shoNherly('⚠️ Por favor ingresa un mensaje para Stable.\n\nEjemplo: stable Haz un dibujo de un pez');
				if (!(await firely(m, mess.waits))) return;
				try
				{
					// Panggil API dengan input dari pengguna
					const apiUrl = `https://api.siputzx.my.id/api/ai/stable-diffusion?prompt=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl,
					{
						responseType: 'arraybuffer' // Terima data dalam format buffer
					});
					// Cek respons API
					if (response.status === 200)
					{
						const imageBuffer = Buffer.from(response.data, 'binary'); // Konversi respons ke buffer
						shoNhe.sendMessage(m.chat,
						{
							image: imageBuffer, // Kirim gambar sebagai buffer
							caption: `🖼️ A continuación se muestra una imagen de los resultados de Difusión Stable para el mensaje:\n\n"${text}"`
						},
						{
							quoted: m
						});
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'flux':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case sesuai API
				if (!text) return shoNherly('⚠️ Por favor ingresa un mensaje para Flux AI.\n\nEjemplo: flux Crea una imagen de lagarto cyberpunk');
				if (!(await firely(m, mess.waits))) return;
				try
				{
					// Panggil API dengan input dari pengguna
					const apiUrl = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl,
					{
						responseType: 'arraybuffer' // Terima data dalam format buffer
					});
					// Cek respons API
					if (response.status === 200)
					{
						const imageBuffer = Buffer.from(response.data, 'binary'); // Konversi respons ke buffer
						shoNhe.sendMessage(m.chat,
						{
							image: imageBuffer, // Kirim gambar sebagai buffer
							caption: `🖼️ A continuación se muestra una imagen de los resultados de Flux AI para el mensaje:\n\n"${text}"`
						},
						{
							quoted: m
						});
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'gandalf':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case sesuai API
				if (!text) return shoNherly('⚠️ Por favor ingresa un mensaje para Gandalf AI.\n\nEjemplo: gandalf ¿Quién eres?');
				try
				{
					// Panggil API dengan input dari pengguna
					const apiUrl = `https://api.siputzx.my.id/api/ai/gandalf?prompt=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl);
					// Cek respons API
					if (response.data && response.data.status)
					{
						shoNherly(response.data.data); // Kirim teks hasil dari API Gandalf
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'gemini':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Nama case sesuai API
				if (!text) return shoNherly('⚠️ Por favor ingresa contenido para Gemini Pro AI.\n\nEjemplo: gemini Hola, ¿cómo estás?');
				try
				{
					// Panggil API dengan input dari pengguna
					const apiUrl = `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(text)}`;
					const response = await axios.get(apiUrl);
					// Cek respons API
					if (response.data && response.data.status)
					{
						shoNherly(response.data.data); // Kirim teks hasil dari API Gemini Pro
					}
					else
					{
						shoNherly('❌ No se puede procesar la solicitud. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al contactar con la API.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'wallhp':
			case 'akira':
			case 'akiyama':
			case 'ana':
			case 'art':
			case 'asuna':
			case 'ayuzawa':
			case 'boruto':
			case 'bts':
			case 'chiho':
			case 'chitoge':
			case 'cosplay':
			case 'cosplayloli':
			case 'cosplaysagiri':
			case 'cyber':
			case 'deidara':
			case 'doraemon':
			case 'elaina':
			case 'emilia':
			case 'erza':
			case 'exo':
			case 'gamewallpaper':
			case 'gremory':
			case 'hacker':
			case 'hestia':
			case 'Husbu':
			case 'inori':
			case 'islamic':
			case 'isuzu':
			case 'itachi':
			case 'itori':
			case 'jennie':
			case 'jiso':
			case 'justina':
			case 'kaga':
			case 'kagura':
			case 'kakasih':
			case 'kaori':
			case 'cartoon':
			case 'shortquote':
			case 'keneki':
			case 'kotori':
			case 'kurumi':
			case 'lisa':
			case 'loli2':
			case 'madara':
			case 'megumin':
			case 'mikasa':
			case 'mikey':
			case 'miku':
			case 'minato':
			case 'mountain':
			case 'naruto':
			case 'nekonime':
			case 'nezuko':
			case 'onepiece':
			case 'pentol':
			case 'pokemon':
			case 'randomnime':
			case 'randomnime2':
			case 'rize':
			case 'rose':
			case 'sagiri':
			case 'sakura':
			case 'sasuke':
			case 'satanic':
			case 'shina':
			case 'shinka':
			case 'shinomiya':
			case 'shizuka':
			case 'shota':
			case 'space':
			case 'technology':
			case 'tejina':
			case 'toukachan':
			case 'tsunade':
			case 'waifu2':
			case 'yotsuba':
			case 'yuki':
			case 'yulibocil':
			case 'yumeko':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				let data
				if (/akira/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/akira.json')
				if (/akiyama/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/akiyama.json')
				if (/ana/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/ana.json')
				if (/art/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/art.json')
				if (/asuna/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/asuna.json')
				if (/ayuzawa/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/ayuzawa.json')
				if (/boneka/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/boneka.json')
				if (/boruto/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/boruto.json')
				if (/bts/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/bts.json')
				if (/cecan/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/cecan.json')
				if (/chiho/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/chiho.json')
				if (/chitoge/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/chitoge.json')
				if (/cogan/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/cogan.json')
				if (/cosplay/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/cosplay.json')
				if (/cosplayloli/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/cosplayloli.json')
				if (/cosplaysagiri/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/cosplaysagiri.json')
				if (/cyber/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/cyber.json')
				if (/deidara/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/deidara.json')
				if (/doraemon/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/doraemon.json')
				if (/eba/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/eba.json')
				if (/elaina/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/elaina.json')
				if (/emilia/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/emilia.json')
				if (/erza/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/erza.json')
				if (/exo/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/exo.json')
				if (/femdom/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/femdom.json')
				if (/freefire/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/freefire.json')
				if (/gamewallpaper/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/gamewallpaper.json')
				if (/glasses/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/glasses.json')
				if (/gremory/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/gremory.json')
				if (/hacker/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/hekel.json')
				if (/hestia/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/hestia.json')
				if (/Husbu/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/Husbu.json')
				if (/inori/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/inori.json')
				if (/islamic/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/islamic.json')
				if (/isuzu/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/isuzu.json')
				if (/itachi/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/itachi.json')
				if (/itori/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/itori.json')
				if (/jennie/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/jeni.json')
				if (/jiso/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/jiso.json')
				if (/justina/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/justina.json')
				if (/kaga/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/kaga.json')
				if (/kagura/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/kagura.json')
				if (/kakasih/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/kakasih.json')
				if (/kaori/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/kaori.json')
				if (/cartoon/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/kartun.json')
				if (/shortquote/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/katakata.json')
				if (/keneki/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/keneki.json')
				if (/kotori/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/kotori.json')
				if (/kpop/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/kpop.json')
				if (/kucing/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/kucing.json')
				if (/kurumi/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/kurumi.json')
				if (/lisa/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/lisa.json')
				if (/loli2/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/loli.json')
				if (/madara/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/madara.json')
				if (/megumin/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/megumin.json')
				if (/mikasa/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/mikasa.json')
				if (/mikey/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/mikey.json')
				if (/miku/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/miku.json')
				if (/minato/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/minato.json')
				if (/mobile/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/mobil.json')
				if (/motor/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/motor.json')
				if (/mountain/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/mountain.json')
				if (/naruto/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/naruto.json')
				if (/nekonime/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/nekonime.json')
				if (/nezuko/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/nezuko.json')
				if (/onepiece/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/onepiece.json')
				if (/pentol/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/pentol.json')
				if (/pokemon/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/pokemon.json')
				if (/profil/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/profil.json')
				if (/progamming/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/programming.json')
				if (/pubg/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/pubg.json')
				if (/randblackpink/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/randblackpink.json')
				if (/randomnime/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/randomnime.json')
				if (/randomnime2/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/randomnime2.json')
				if (/rize/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/rize.json')
				if (/rose/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/rose.json')
				if (/ryujin/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/ryujin.json')
				if (/sagiri/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/sagiri.json')
				if (/sakura/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/sakura.json')
				if (/sasuke/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/sasuke.json')
				if (/satanic/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/satanic.json')
				if (/shina/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/shina.json')
				if (/shinka/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/shinka.json')
				if (/shinomiya/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/shinomiya.json')
				if (/shizuka/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/shizuka.json')
				if (/shota/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/shota.json')
				if (/space/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/tatasurya.json')
				if (/technology/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/technology.json')
				if (/tejina/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/tejina.json')
				if (/toukachan/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/toukachan.json')
				if (/tsunade/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/tsunade.json')
				if (/waifu2/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/waifu.json')
				if (/wallhp/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/wallhp.json')
				if (/wallml/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/wallml.json')
				if (/wallmlnime/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/wallnime.json')
				if (/yotsuba/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/yotsuba.json')
				if (/yuki/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/yuki.json')
				if (/yulibocil/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/yulibocil.json')
				if (/yumeko/.test(command)) data = await fetchJson('https://raw.githubusercontent.com/aerovoid4/Media/master/yumeko.json')
				const response = data[Math.floor(Math.random() * data.length)]
				const buffer = await getBuffer(response);
				await shoNhe.sendMessage(m.chat,
				{
					image: buffer,
					caption: `Nih ${pushname}, ${command}-nya🐬`,
					footer: namabot,
					buttons: [
					{
						buttonId: prefix + command,
						buttonText:
						{
							displayText: "🔄 Continuar de nuevo"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "📜 Volver al menú"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: m
				});
			};
			break;
			case 'programming':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const imageList = ["https://i.pinimg.com/originals/9b/c0/31/9bc031ded28a4eccb4a3f1df621ff84d.png", "https://i.pinimg.com/originals/70/d6/b3/70d6b3aaf2857dce05601505b8ca7db0.jpg", "https://i.pinimg.com/originals/17/cd/41/17cd4124e87c4b30a5fecf2605d86b6b.png", "https://i.pinimg.com/originals/7a/b6/01/7ab6019c0386e2d93910d8a673a4e2a5.jpg", "https://i.pinimg.com/originals/3c/c2/e3/3cc2e3ff1f1a381affb70989c83e6254.jpg", "https://i.pinimg.com/originals/8b/aa/5b/8baa5bb80ce306685aa46505ed299153.png", "https://i.pinimg.com/736x/9b/f4/44/9bf4443834e957d1a6814a792a2d43ed.jpg", "https://i.pinimg.com/originals/7c/ce/a5/7ccea5bda150fe9e381121f865e5cdc6.jpg", "https://i.pinimg.com/originals/69/c3/59/69c359a7c46a780aa6805340d2101e1c.png", "https://i.pinimg.com/736x/59/35/5f/59355f751c1e3698cc6360b1a7390094--twitter-backgrounds-twitter-cover.jpg", "https://i.pinimg.com/originals/10/9d/73/109d732d44806095d8c29e89b8dddb54.jpg", "https://i.pinimg.com/originals/83/13/f6/8313f67d2546e50652d4e31f74a1a789.png", "https://i.pinimg.com/736x/36/37/42/36374223a47ff3c99d113894322fc43b.jpg", "https://i.pinimg.com/originals/0d/fc/3d/0dfc3d3e6ac0032faf1c2ea5ef72977e.jpg", "https://i.pinimg.com/236x/93/dc/67/93dc67f4d99c43e7f3df415ece4e8cf4--minimal.jpg", "https://i.pinimg.com/564x/56/82/d7/5682d780ad6ef317fe4762986a173c51.jpg", "https://i.pinimg.com/originals/31/b2/6b/31b26baa15c9538d118a328bb9d1b98e.jpg", "https://i.pinimg.com/originals/70/03/06/70030615fc560a908929b51b62c1db0e.png", "https://i.pinimg.com/originals/b0/48/cf/b048cf687e6069d768904311806cafcf.jpg", "https://i.pinimg.com/736x/60/0b/7b/600b7bddb7fb0ee8d1885a6cdbc87a19--programming-life-motto.jpg", "https://i.pinimg.com/originals/ef/a9/04/efa90473ab862585d710c406f23979fc.jpg", "https://i.pinimg.com/originals/58/b6/9c/58b69cab115aceffbf7eb879beaa65b5.png", "https://i.pinimg.com/236x/80/18/cb/8018cb671e28e3254703ef31cef5878c--java-code-programming.jpg", "https://i.pinimg.com/736x/65/66/ac/6566acdf9b62a091872d8ebdd6e1f463.jpg", "https://i.pinimg.com/originals/8e/17/ae/8e17aeb2c0f75a13e20d7d7cb8d11e01.jpg", "https://i.pinimg.com/736x/d8/99/d4/d899d4ab24cfb987def01fab33c894c2.jpg", "https://i.pinimg.com/736x/27/82/f9/2782f930fe6f9c911c19f0431da0eab5.jpg", "https://i.pinimg.com/originals/81/10/0d/81100db7210aed7e2b92cd521d7a2f9d.jpg", "https://i.pinimg.com/originals/33/09/ca/3309ca1330ca91b55b4feeda3f383031.jpg", "https://i.pinimg.com/originals/b2/6b/5b/b26b5b4f274e7054527f5f0dadaa0dc1.jpg", "https://i.pinimg.com/originals/cc/20/39/cc20394fb46b7b5866b2c8e1d38726e8.png", "https://i.pinimg.com/originals/1b/13/1e/1b131e9125f1fd77148d53b4b3d51c1c.jpg", "https://i.pinimg.com/736x/1f/74/ba/1f74bad6a0f2cfa94d927f1063ca2fad--mobile-wallpaper-iphone-wallpaper.jpg", "https://i.pinimg.com/236x/3a/51/b8/3a51b89a621fcdf2e33c75bda4a7ab55.jpg", "https://i.pinimg.com/600x315/ba/9d/09/ba9d0958c35a534968f39c28511c96b6.jpg", "https://i.pinimg.com/originals/ba/2b/e1/ba2be18dd28516a8a813b256dcf4fec2.jpg", "https://i.pinimg.com/474x/11/8a/83/118a835336b1e8902278e64d71db1438.jpg", "https://i.pinimg.com/originals/e0/58/ce/e058ce742a606abb69a5ab3c7efcc724.png", "https://i.pinimg.com/736x/5b/01/e5/5b01e5b8f939355d1b38858b23b1e4d8--computer-science-programming.jpg", "https://i.pinimg.com/736x/40/fa/6b/40fa6bd822acb13adf47a38132cfec3c.jpg", "https://i.pinimg.com/originals/aa/02/f9/aa02f97307df1a3b9ffead3353230222.jpg", "https://i.pinimg.com/originals/01/bb/66/01bb664d62b3cbdc8dae7d164e999cde.jpg", "https://i.pinimg.com/736x/31/dc/9d/31dc9d901456846c66c41d3f36e6f8ed.jpg", "https://i.pinimg.com/originals/5b/4a/0b/5b4a0bee32f002d1f95b9ba8cb9d1556.png", "https://i.pinimg.com/originals/fe/7b/27/fe7b27c60109efb797489691f6d2d023.gif", "https://i.pinimg.com/originals/3f/32/0c/3f320cf5acc1754059922df2be39a08e.jpg", "https://i.pinimg.com/736x/f8/4f/78/f84f7837349b76696e6a81e472c491a5--big-data-scraping.jpg", "https://i.pinimg.com/736x/e3/b0/d1/e3b0d133610001451f924c64041abffe--mobile-wallpaper-wallpaper-free.jpg", "https://i.pinimg.com/474x/a2/ca/d1/a2cad1d4aa3c23a821b5dbc83b4ac16c.jpg", "https://i.pinimg.com/550x/ac/71/e4/ac71e4594eac8addbd1556e1584ae0a3.jpg", "https://i.pinimg.com/736x/b1/f5/30/b1f5307216ac0de996ccbcd22e5a8a13.jpg", "https://i.pinimg.com/originals/d0/d5/cb/d0d5cb62eafbef574f43a85e0c8d8beb.png", "https://i.pinimg.com/originals/21/b6/5f/21b65f2b99464938ca43ce74096647e1.jpg", "https://i.pinimg.com/736x/ee/2d/00/ee2d0036bf8fe7c43ffee21c39b993a1.jpg", "https://i.pinimg.com/736x/da/40/4b/da404bf7bd4398c9f256c65507d3c860.jpg", "https://i.pinimg.com/736x/9d/fe/b8/9dfeb8817ad82d4d6cb0bcb33a64ccfa.jpg", "https://i.pinimg.com/736x/37/e6/3c/37e63c9058765ed27f7b0d9775105133--old-computers-desktop-wallpapers.jpg", "https://i.pinimg.com/236x/bc/18/6a/bc186ab96693c9a2ef4067ee015f4e6d.jpg", "https://i.pinimg.com/736x/50/cd/04/50cd04e6dcf1125d29ee7d90a5241540.jpg", "https://i.pinimg.com/736x/05/8f/81/058f81442bbe2032a9f18ce7c2d5805d--javascript-coding.jpg", "https://i.pinimg.com/736x/98/1c/9c/981c9cd37c72f7a4c5192ecf46765e1d.jpg", "https://i.pinimg.com/236x/f1/97/94/f197941b83be24b3fd400b8ea9951570.jpg", "https://i.pinimg.com/236x/0e/ef/c6/0eefc6b4f997eb9f25b736e7c12cd046.jpg", "https://i.pinimg.com/originals/5d/0d/c1/5d0dc149b468a2e768af19518a7bb61e.jpg", "https://i.pinimg.com/736x/64/8a/dc/648adcee8dfa51cf1e22f4a89a028dc6.jpg", "https://i.pinimg.com/736x/94/b9/6f/94b96fe0cfb406242cc8f1484e179ab3.jpg", "https://i.pinimg.com/originals/e6/3d/c7/e63dc78e692897f3522cb942d5f350e0.jpg", "https://i.pinimg.com/736x/2c/77/4e/2c774ed9d84ee9923b06336a03292b26.jpg", "https://i.pinimg.com/736x/56/6b/16/566b16dbad15ecdcc2e8762b40729f53.jpg", "https://i.pinimg.com/736x/e0/81/bd/e081bd675c7435ebb890c4d63fac405f.jpg", "https://i.pinimg.com/originals/be/53/f2/be53f28e93c322434e8cecc66e8af49f.jpg", "https://i.pinimg.com/originals/98/2f/d3/982fd358c2580ab78df6fac911140b5c.jpg", "https://i.pinimg.com/736x/b6/7e/41/b67e4116e8dc3c2650e1151f7ffc8887--wallpaper-for-computer-science.jpg", "https://i.pinimg.com/736x/26/77/39/2677393cd1992f3cee2f5ab246d8d1ee.jpg", "https://i.pinimg.com/originals/56/b9/c0/56b9c0b9751291c4599b053d543170b6.jpg", "https://i.pinimg.com/originals/3c/7f/a8/3c7fa839104f3343b28bcbf9a3d3db87.jpg", "https://i.pinimg.com/736x/55/d0/ff/55d0ff16a7bbb62ff5d0d5a7e0cb644f.jpg", "https://i.pinimg.com/originals/3e/bf/ce/3ebfce1ca1be67c97a5ce36a3fa9956e.jpg", "https://i.pinimg.com/236x/c0/86/08/c086089bc0baf6b96597e76eb85a4c8e.jpg", "https://i.pinimg.com/736x/14/b4/40/14b4409642dc9011729fc335e9664af1.jpg", "https://i.pinimg.com/736x/db/d5/d3/dbd5d391c6cfbfa0d0d711249481eadd.jpg", "https://i.pinimg.com/originals/8b/00/66/8b0066416a00c5812b1f4470026791fb.jpg", "https://i.pinimg.com/736x/93/af/92/93af92a0c5c2c4d26649edd03fc2cbbe.jpg", "https://i.pinimg.com/originals/ad/f7/a9/adf7a9892eb2b000b4cd75b5007a8aa3.jpg", "https://i.pinimg.com/736x/3c/e4/39/3ce439a152a704da5f7e52c6902689ab.jpg", "https://i.pinimg.com/originals/ed/64/c7/ed64c7101d905375c7c76cce11686115.jpg", "https://i.pinimg.com/originals/d9/eb/94/d9eb9479c601bb4406fdab1e99705c98.jpg", "https://i.pinimg.com/736x/87/b0/10/87b010ca8edd0a4111ee2fea8cdcd521.jpg", "https://i.pinimg.com/736x/93/3e/bb/933ebb6a9d79f8a556c340e7fd8eaedb--c-programming-programming-languages.jpg", "https://i.pinimg.com/originals/f5/a7/93/f5a793ae604cdf5a923b83b36e7cf53a.jpg", "https://i.pinimg.com/736x/86/c1/6c/86c16cadafde494ea5ecfea35e7dffa5--photo-black-free-photos.jpg", "https://i.pinimg.com/736x/31/15/cd/3115cde46928706aa04e1738e4683e7c.jpg", "https://i.pinimg.com/736x/1e/13/42/1e13425fee010f46ade128c2d81ba958--programming-languages-coding.jpg", "https://i.pinimg.com/736x/2b/c3/7d/2bc37dee561b2bbf53d9f41dc4f92596.jpg", "https://i.pinimg.com/originals/75/84/79/758479a023f9884e13c47bb05d73fb95.jpg", "https://i.pinimg.com/736x/01/d5/03/01d503181714d7eb9db97b0e8f5fbe98.jpg", "https://i.pinimg.com/originals/a6/d4/83/a6d483c5d7a41ffd1fa08ffa097af8d6.jpg", "https://i.pinimg.com/236x/ca/86/f8/ca86f8d26d799d1e04bd792220e0e180.jpg", "https://i.pinimg.com/736x/09/b1/d3/09b1d3c9feac0b281de14f1528b65cf5.jpg", "https://i.pinimg.com/originals/87/b8/70/87b870cb787ddd877ae5bec3477c0b89.jpg"];
				const randomImage = pickRandom(imageList);
				// Unduh gambar
				const buffer = await getBuffer(randomImage);
				// Kirim pesan dengan tombol
				await shoNhe.sendMessage(m.chat,
				{
					image: buffer,
					caption: `Nih ${pushname}, ${command}-nya🐬`,
					footer: namabot,
					buttons: [
					{
						buttonId: prefix + command,
						buttonText:
						{
							displayText: "🔄 Continuar de nuevo"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "📜 Volver al menú"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: m
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'swm': 
			case 'steal': 
			case 'stickerwm': 
			case 'take': {
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!quoted) return angryshoNhe (`Envía o responde a una imagen/video/gif con el título ${prefix + command}\n¡La duración del video debe ser de 1-9 segundos!`);
				if (!mime) return angryshoNhe (`Envía o responde una imagen/video/gif con el título ${prefix + command}\n¡La duración del video debe ser de 1-9 segundos!`);
                if (!(await firely(m, mess.waits))) return;
				const swn = args.join(" ");
				const pcknm = swn.split("|")[0];
				const atnm = swn.split("|")[1];

				if (m.quoted.isAnimated === true) {
					shoNhe.downloadAndSaveMediaMessage(quoted, "gifee");
					shoNhe.sendMessage(m.chat, { 
						sticker: fs.readFileSync("gifee.webp") 
					}, m, { 
						packname: pcknm, 
						author: atnm 
					});
				} else if (/image/.test(mime)) {
					let media = await shoNhe.downloadAndSaveMediaMessage(quoted);
					await shoNhe.sendImageAsSticker(m.chat, media, m, { packname: pcknm, author: atnm });
				} else if (/video/.test(mime)) {
					if ((quoted.msg || quoted).seconds > 9) return angryshoNhe ('El vídeo es demasiado largo, máximo 9 segundos! ⏳');
					let media = await shoNhe.downloadAndSaveMediaMessage(quoted);
					await shoNhe.sendVideoAsSticker(m.chat, media, m, { packname: pcknm, author: atnm });
				} else {
					angryshoNhe (`¡Envía fotos/vídeos para usar, hermano!`);
				}
				if (levelUpMessage)
				{
					await shoNhe.sendMessage(m.chat,
					{
						image: levelUpMessage.image,
						caption: levelUpMessage.text,
						footer: "LEVEL UP🔥",
						buttons: [
						{
							buttonId: `${prefix}cek`,
							buttonText:
							{
								displayText: "CEK FIRE 🔥"
							}
						},
						{
							buttonId: `${prefix}menu`,
							buttonText:
							{
								displayText: "MENU 🍄"
							}
						}],
						viewOnce: true,
					},
					{
						quoted: hw
					});
				}
			}
			break;
			case 'quotesanime':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				try
				{
					// Panggil API untuk mendapatkan data quotes
					const apiUrl = `https://otakotaku.com/quote/view/1567/melihat-harapan`;
					const response = await axios.get(apiUrl);
					// Cek respons API
					if (response.data && response.data.status)
					{
						// Pilih satu quote secara acak
						const quotes = response.data.data;
						const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
						// Kirim pesan dengan quotes acak
						shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: randomQuote.gambar
							}, // Gambar dari karakter
							caption: `🎭 *Frases de anime* 🎭\n\n` + `📺 *Anime*: ${randomQuote.anime}\n` + `🎬 *Episodio*: ${randomQuote.episode}\n` + `🎭 *Personaje*: ${randomQuote.karakter}\n\n` + `💬 *Cita*:\n"${randomQuote.quotes}"\n\n` + `🔗 *Link*: ${randomQuote.link}`
						},
						{
							quoted: hw
						});
					}
					else
					{
						shoNherly('❌ No puedo encontrar citas de anime. Vuelve a intentarlo más tarde.');
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly('❌ Se produjo un error al recuperar datos de citas de anime.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'cecanindo':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let res = await axios.get('https://api.siputzx.my.id/api/r/cecan/indonesia',
					{
						responseType: 'arraybuffer'
					});
					shoNhe.sendMessage(m.chat,
					{
						image: res.data,
						caption: 'La siguiente es una imagen de Cecan Indonesia'
					},
					{
						quoted: hw
					});
				}
				catch (error)
				{
					shoNherly('No se pudo tomar una fotografía de Cecan Indonesia. Inténtelo de nuevo más tarde.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'dellist':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				const listStorePath = './database/liststore.json';
				let listStore = {};
				// Membaca database liststore
				if (fs.existsSync(listStorePath))
				{
					listStore = JSON.parse(fs.readFileSync(listStorePath, 'utf8'));
				}
				// Jika key tidak diberikan
				if (!q) return shoNherly(`Usar formato: ${prefix}dellist <key>`);
				const key = q.toLowerCase(); // Gunakan lowercase untuk pencarian yang tidak case-sensitive
				// Debug: menampilkan daftar key yang ada di liststore
				console.log("Daftar key yang ada:", Object.keys(listStore[m.chat] ||
				{}));
				// Jika key tidak ditemukan dalam liststore
				if (!listStore[m.chat]?.[key]) return shoNherly(`Key *${key}* extraviado.`);
				// Hapus key dari liststore
				delete listStore[m.chat][key];
				// Simpan perubahan ke file
				fs.writeFileSync(listStorePath, JSON.stringify(listStore, null, 2));
				shoNherly(`Se eliminó exitosamente la lista con key: *${key}*`);
				}
			break
			case 'updatelist':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				const listStorePath = './database/liststore.json';
				let listStore = {};
				if (fs.existsSync(listStorePath))
				{
					listStore = JSON.parse(fs.readFileSync(listStorePath, 'utf8'));
				}
				if (!q.includes('|')) return shoNherly(`Usar formato: ${prefix}dellist <key>|<response>`);
				const [key, response] = q.split('|');
				if (!key || !response) return shoNherly(`Formato incorrecto. Usar: ${prefix}liststore update <key>|<response>`);
				if (!listStore[m.chat]?.[key]) return shoNherly(`Key *${key}* extraviado.`);
				listStore[m.chat][key].response = response;
				fs.writeFileSync(listStorePath, JSON.stringify(listStore, null, 2));
				shoNherly(`Se actualizó exitosamente la lista con key: *${key}*`);
				}
			break
			case 'bluearchive':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let res = await axios.get('https://api.siputzx.my.id/api/r/blue-archive',
					{
						responseType: 'arraybuffer'
					});
					shoNhe.sendMessage(m.chat,
					{
						image: res.data,
						caption: 'La siguiente es una imagen del Archivo Azul'
					},
					{
						quoted: hw
					});
				}
				catch (error)
				{
					shoNherly('No se pudo recuperar la imagen de Blue Archive. Inténtelo de nuevo más tarde.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'git': 
			case 'gitclone': {
			if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!args[0]) return shoNherly(`📦 *Linknya mana, Kak?*\n\nContoh:\n${prefix}${command} https://github.com/user/repo`);
				if (!isUrl(args[0]) || !args[0].includes('github.com')) 
					return shoNherly(`❌ *Link tidak valid!* Pastikan link berasal dari GitHub ya, Kak.`);
				try {
					if (!(await firely(m, mess.waits))) return;
					let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
					let [, user, repo] = args[0].match(regex) || [];
					if (!user || !repo) return shoNherly(`❌ *Gagal membaca link repositori!* Pastikan link benar ya, Kak.`);
					repo = repo.replace(/.git$/, '');
					let url = `https://api.github.com/repos/${user}/${repo}/zipball`;
					let response = await fetch(url, { method: 'HEAD' });
					let filename = response.headers.get('content-disposition')?.match(/attachment; filename=(.*)/)?.[1] || `${repo}.zip`;
					await shoNhe.sendMessage(m.chat, {
						document: { url: url },
						fileName: filename,
						mimetype: 'application/zip'
					}, { 
						quoted: m 
					});
					shoNherly(`✅ *Berhasil mengirim file repositori GitHub!*\nNama File: ${filename}`);
				} catch (err) {
					console.error(err);
					shoNherly(`❌ *Terjadi kesalahan saat mengunduh repositori!* 😭\n${err.message || err}`);
					}
					if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'cecanchina':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let res = await axios.get('https://api.siputzx.my.id/api/r/cecan/china',
					{
						responseType: 'arraybuffer'
					});
					shoNhe.sendMessage(m.chat,
					{
						image: res.data,
						caption: 'La siguiente es una imagen de Cecan China'
					},
					{
						quoted: hw
					});
				}
				catch (error)
				{
					shoNherly('No se pudo tomar una fotografía de Cecan China. Inténtelo de nuevo más tarde.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'cecanjapan':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let res = await axios.get('https://api.siputzx.my.id/api/r/cecan/japan',
					{
						responseType: 'arraybuffer'
					});
					shoNhe.sendMessage(m.chat,
					{
						image: res.data,
						caption: 'La siguiente es una imagen de Cecan Japón'
					},
					{
						quoted: hw
					});
				}
				catch (error)
				{
					shoNherly('No se pudo tomar una fotografía de Cecan Japón. Inténtelo de nuevo más tarde.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'cecankorea':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let res = await axios.get('https://api.siputzx.my.id/api/r/cecan/korea',
					{
						responseType: 'arraybuffer'
					});
					shoNhe.sendMessage(m.chat,
					{
						image: res.data,
						caption: 'La siguiente es una imagen del Cecan coreano'
					},
					{
						quoted: hw
					});
				}
				catch (error)
				{
					shoNherly('No se pudo tomar una fotografía del Cecan coreano. Inténtelo de nuevo más tarde.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'cecanthai':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let res = await axios.get('https://api.siputzx.my.id/api/r/cecan/thailand',
					{
						responseType: 'arraybuffer'
					});
					shoNhe.sendMessage(m.chat,
					{
						image: res.data,
						caption: 'La siguiente es una imagen de Cecan Tailandia'
					},
					{
						quoted: hw
					});
				}
				catch (error)
				{
					shoNherly('No se pudo tomar una fotografía de Cecan Tailandia. Inténtelo de nuevo más tarde.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'cecanviet':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let res = await axios.get('https://api.siputzx.my.id/api/r/cecan/vietnam',
					{
						responseType: 'arraybuffer'
					});
					shoNhe.sendMessage(m.chat,
					{
						image: res.data,
						caption: 'La siguiente es una imagen del Cecan vietnamita'
					},
					{
						quoted: hw
					});
				}
				catch (error)
				{
					shoNherly('No se pudo tomar una fotografía de Cecan Vietnam. Inténtelo de nuevo más tarde.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'cats':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let res = await axios.get('https://api.siputzx.my.id/api/r/cats',
					{
						responseType: 'arraybuffer'
					});
					shoNhe.sendMessage(m.chat,
					{
						image: res.data,
						caption: 'Aquí hay una foto de un lindo gato.'
					},
					{
						quoted: hw
					});
				}
				catch (error)
				{
					shoNherly('No se pudo tomar una fotografía del gato. Inténtelo de nuevo más tarde.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'neko':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let res = await axios.get('https://api.siputzx.my.id/api/r/neko',
					{
						responseType: 'arraybuffer'
					});
					shoNhe.sendMessage(m.chat,
					{
						image: res.data,
						caption: 'Aquí hay una foto de Neko'
					},
					{
						quoted: hw
					});
				}
				catch (error)
				{
					shoNherly('No se pudo tomar la foto de Neko. Inténtelo de nuevo más tarde.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'loli':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				let baseUrl = 'https://weeb-api.vercel.app/'
				const response = await fetch(baseUrl + command)
				const imageBuffer = await response.buffer() // Get the image data as a buffer
				let msgs = generateWAMessageFromContent(m.chat,
				{
					viewOnceMessage:
					{
						message:
						{
							"messageContextInfo":
							{
								"deviceListMetadata":
								{},
								"deviceListMetadataVersion": 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.create(
							{
								body: proto.Message.InteractiveMessage.Body.create(
								{
									text: `Hi ${pushName}\n_*Aquí está el resultado de ${command}*_`
								}),
								footer: proto.Message.InteractiveMessage.Footer.create(
								{
									text: namabot
								}),
								header: proto.Message.InteractiveMessage.Header.create(
								{
									hasMediaAttachment: false,
									...await prepareWAMessageMedia(
									{
										image: imageBuffer
									},
									{
										upload: shoNhe.waUploadToServer
									})
								}),
								nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
								{
									buttons: [
									{
										"name": "quick_reply",
										"buttonParamsJson": `{\"display_text\":\"Next ➡️\",\"id\":\"${prefix+command}"}`
									}],
								}),
								contextInfo:
								{
									mentionedJid: [m.sender],
									forwardingScore: 999,
									isForwarded: true,
									forwardedNewsletterMessageInfo:
									{
										newsletterJid: idsaluran,
										newsletterName: namach,
										serverMessageId: 143
									}
								}
							})
						}
					}
				},
				{
					quoted: m
				})
				return await shoNhe.relayMessage(m.chat, msgs.message,
				{})
			}
			break
			case 'waifu':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let res = await axios.get('https://api.siputzx.my.id/api/r/waifu',
					{
						responseType: 'arraybuffer'
					});
					shoNhe.sendMessage(m.chat,
					{
						image: res.data,
						caption: 'Aquí hay una foto de Waifu'
					},
					{
						quoted: hw
					});
				}
				catch (error)
				{
					shoNherly('No se pudo tomar la foto de Waifu. Inténtelo de nuevo más tarde.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'statusimg':
			case 'statusimage':
			case 'upswimg':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (/image/.test(mime))
				{
					// Unduh gambar dari pesan yang di-reply
					var imagesw = await shoNhe.downloadAndSaveMediaMessage(quoted);
					// Dapatkan informasi default untuk caption
					let fileSize = quoted.fileLength ? `${(quoted.fileLength / 1024 / 1024).toFixed(2)} MB` : 'Tidak diketahui';
					let mediaType = mime || 'Tidak diketahui';
					let sendTime = new Date().toLocaleString('id-ID',
					{
						timeZone: 'Asia/Jakarta'
					});
					let sender = `${m.pushName || namaowner}`;
					// Buat caption default
					let defaultCaption = `📁 *Ukuran File:* ${fileSize}\n` + `🖼️ *Tipe Media:* ${mediaType}\n` + `⏰ *Waktu Dikirim:* ${sendTime}\n` + `👤 *Dikirim oleh:* ${sender}`;
					// Kirim gambar ke status WhatsApp
					await shoNhe.sendMessage('status@broadcast',
					{
						image:
						{
							url: imagesw
						},
						caption: q ? q : defaultCaption
					},
					{
						statusJidList: Object.keys(global.db.data.users)
					});
					await shoNherly('✅ Gambar berhasil dikirim ke status WhatsApp dengan caption bawaan! 🖼️✨');
				}
				else
				{
					shoNherly('⚠️ Tolong reply ke gambar dulu ya, Cik! 🖼️');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'hwaifu':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isVip) return shoNherly(mess.vips);
				if (!(await firely(m, mess.waits))) return;
				const data = await fetchJson(`https://api.waifu.pics/nsfw/waifu`);
				await shoNhe.sendMessage(m.chat,
				{
					image:
					{
						url: data.url
					},
					caption: `Dasar ${pushname}, otak sagne🗿`,
					footer: `${namabot} • Nikmati dengan penuh tanggung jawab!`,
					buttons: [
					{
						buttonId: prefix + command,
						buttonText:
						{
							displayText: "🔄 Continuar de nuevo"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "📜 Volver al menú"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'trap':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isVip) return shoNherly(mess.vips);
				if (!(await firely(m, mess.waits))) return;
				const data = await fetchJson(`https://api.waifu.pics/nsfw/${command}`);
				await shoNhe.sendMessage(m.chat,
				{
					image:
					{
						url: data.url
					},
					caption: `Dasar ${pushname}, otak sagne🗿`,
					footer: `${namabot} • Nikmati dengan penuh tanggung jawab!`,
					buttons: [
					{
						buttonId: prefix + command,
						buttonText:
						{
							displayText: "🔄 Continuar de nuevo"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "📜 Volver al menú"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'blowjob':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isVip) return shoNherly(mess.vips);
				if (!(await firely(m, mess.waits))) return;
				const data = await fetchJson(`https://api.waifu.pics/nsfw/${command}`);
				await shoNhe.sendMessage(m.chat,
				{
					image:
					{
						url: data.url
					},
					caption: `Dasar ${pushname}, otak sagne🗿`,
					footer: `${namabot} • Nikmati dengan penuh tanggung jawab!`,
					buttons: [
					{
						buttonId: prefix + command,
						buttonText:
						{
							displayText: "🔄 Continuar de nuevo"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "📜 Volver al menú"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			/*
*
* [ *FEATURE HD ( FIX )* ]
* Created By Hann
* 
* Channel: https://whatsapp.com/channel/0029Vaf07jKCBtxAsekFFk3i
*
*

//📃: jangan protes yaa "kok pake sharp. pasti gada bedanya ini". itu ga cuman resize saja yaa. diperbagus juga fotonya

//Source Code:
case 'hd': {
if (!isRegistered(m)) {
					return sendRegister(shoNhe, m, prefix, namabot);
				}
updatePopularCommand(command);
const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function upscaleImage(inputPath, resolutionOption) {
   const outputPath = './output/';
  try {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`File tidak ditemukan: ${inputPath}`);
    }

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const resolutions = {
      1: { label: '1080p', width: 1920, height: 1080 },
      2: { label: '2k', width: 2560, height: 1440 },
      3: { label: '4k', width: 3840, height: 2160 },
      4: { label: '8k', width: 7680, height: 4320 },
      5: { label: '16k', width: 15360, height: 8640 },
    };

    if (!resolutions[resolutionOption]) {
      shoNherly('Pilihan resolusi tidak valid. Pilih antara 1 - 5.');
    }

    const selectedResolution = resolutions[resolutionOption];
    const outputPathResolution = `./output/foto-${selectedResolution.label}.jpg`;

    await sharp(inputPath)
      .resize({
        width: selectedResolution.width,
        height: selectedResolution.height,
        fit: sharp.fit.inside,
        kernel: sharp.kernel.lanczos3,
      })
      .sharpen({
        sigma: 2,
        m1: 3,
        m2: 1,
      })
      .normalize()
      .modulate({
        saturation: 1.3,
        brightness: 0.85,
      })
      .toFormat('jpeg', {
        quality: 100,
        progressive: true,
      })
      .toFile(outputPathResolution);

    await shoNhe.sendMessage(m.chat, { image: fs.readFileSync(outputPathResolution), caption: "Done Cik"});
    
  } catch (error) {
    return error
    shoNherly(`Gagal memproses gambar: ${error.message}`);
  }
}

if (!m.quoted) return shoNherly("Reply foto nya")
const resolutionOption = args[0];
if (!resolutionOption) return shoNherly(`pakai opsi hd yang memiliki 5 type yaitu

1 = 1080p
2 = 2k
3 = 4k
4 = 8k
5 = 16k
`)

const bufferImage = await m.quoted.download()
const tempFilePath = path.join(__dirname, `temp_image_${Date.now()}.jpg`);
fs.writeFileSync(tempFilePath, bufferImage);
return await upscaleImage(tempFilePath, resolutionOption);
fs.unlinkSync(tempFilePath);
}
break
*/
			case 'hentai':
			case 'hentai-video':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isVip) return shoNherly(mess.vips);
				if (!(await firely(m, mess.waits))) return;
				const result = await hentai();
				await shoNhe.sendMessage(m.chat,
				{
					video:
					{
						url: result[0].video_1
					},
					caption: `Woilah dasar ${puahname}, otak sagne`,
					footer: `${namabot} • Gunakan fitur ini dengan bijak dan bertanggung jawab!`,
					buttons: [
					{
						buttonId: prefix + command,
						buttonText:
						{
							displayText: "🔄 Continuar de nuevo"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "📜 Volver al menú"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'hneko':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isVip) return shoNherly(mess.vips);
				if (!(await firely(m, mess.waits))) return;
				const data = await fetchJson(`https://api.waifu.pics/nsfw/neko`);
				await shoNhe.sendMessage(m.chat,
				{
					image:
					{
						url: data.url
					},
					caption: `Dasar ${pushname}, otak sagne🗿`,
					footer: `${namabot} • Nikmati dengan penuh tanggung jawab!`,
					buttons: [
					{
						buttonId: prefix + command,
						buttonText:
						{
							displayText: "🔄 Continuar de nuevo"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "📜 Volver al menú"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'rvo':
			case 'readviewonce':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!m.quoted) return shoNherly(`Reply to view once message`)
				if (m.quoted.mtype !== 'viewOnceMessageV2') return shoNherly(`This is not a view once message`)
				if (!(await firely(m, mess.waits))) return;
				let msg = m.quoted.message
				let type = Object.keys(msg)[0]
				let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')
				let buffer = Buffer.from([])
				for await (const chunk of media)
				{
					buffer = Buffer.concat([buffer, chunk])
				}
				if (/video/.test(type))
				{
					return shoNhe.sendFile(m.chat, buffer, 'media.mp4', msg[type].caption || '', m)
				}
				else if (/image/.test(type))
				{
					return shoNhe.sendFile(m.chat, buffer, 'media.jpg', msg[type].caption || '', m)
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			//[ *CASE AI JOKO SIJAWA* ]
			case "joko":
			{
				if (!text) return shoNherly("mau nanya apa sama joko\nExampel: .joko nama kamu siapa?")
				await shoNhe.sendMessage(m.chat,
				{
					mimetype: 'audio/mp4',
					ptt: true,
					audio:
					{
						url: "https://api.siputzx.my.id/api/tools/tts?voice=jv-ID-DimasNeural&rate=0&pitch=0&volume=0&text=" + (await axios.get("https://api.siputzx.my.id/api/ai/joko?content=" + text)).data.data
					}
				},
				{
					quoted: m
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'statusaudio':
			case 'upswaudio':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (/audio/.test(mime))
				{
					var audiosw = await shoNhe.downloadAndSaveMediaMessage(quoted);
					await shoNhe.sendMessage('status@broadcast',
					{
						audio:
						{
							url: audiosw
						},
						mimetype: 'audio/mp4',
						ptt: true
					},
					{
						backgroundColor: '#FF000000',
						statusJidList: Object.keys(global.db.data.users)
					});
					await shoNherly('Sukses kirim status audio!');
				}
				else
				{
					shoNherly('Reply audio dulu, ya!');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'contact':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				await shoNhe.sendMessage(m.chat,
				{
					contacts:
					{
						displayName: "Owner",
						contacts: contacts
					}
				},
				{
					quoted: hw
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'getcontact':
			case 'getcon':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!(isAdmins || isShoNheOwn)) return shoNherly(mess.admins); // Hanya admin atau pemilik yang bisa
				bigpp = await shoNhe.sendMessage(m.chat,
				{
					text: `\nGrup: *${groupMetadata.subject}*\nAnggota: *${participants.length}*`
				},
				{
					quoted: m,
					ephemeralExpiration: 86400
				});
				await sleep(1000);
				shoNhe.sendContact(m.chat, participants.map(a => a.id), bigpp); // Kirim kontak anggota
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'savecontact':
			case 'svcontact':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!(isAdmins || isShoNheOwn)) return shoNherly(mess.admins); // Hanya admin atau pemilik yang bisa
				let cmiggc = await shoNhe.groupMetadata(m.chat);
				let orgiggc = participants.map(a => a.id);
				vcard = '';
				noPort = 0;
				for (let a of cmiggc.participants)
				{
					vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:[${noPort++}] +${a.id.split("@")[0]}\nTEL;type=CELL;type=VOICE;waid=${a.id.split("@")[0]}:+${a.id.split("@")[0]}\nEND:VCARD\n`; // Format VCARD untuk kontak
				}
				let nmfilect = './contacts.vcf';
				shoNherly('\nTunggu sebentar, menyimpan... ' + cmiggc.participants.length + ' kontak');
				require('fs').writeFileSync(nmfilect, vcard.trim());
				await sleep(2000);
				shoNhe.sendMessage(m.chat,
				{
					document: require('fs').readFileSync(nmfilect),
					mimetype: 'text/vcard',
					fileName: 'Contact.vcf',
					caption: '\nSukses!\nGrup: *' + cmiggc.subject + '*\nKontak: *' + cmiggc.participants.length + '*'
				},
				{
					ephemeralExpiration: 86400,
					quoted: m
				});
				require('fs').unlinkSync(nmfilect); // Hapus file setelah mengirim
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'upfire':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (args.length < 2) return shoNherly(`⚠️ Usar formato:\n\n.upfire @user/cantidad de dinero\n\nEjemplo:\n.upfire @user 100\n.upfire 6288888888888 100`);
				let target;
				let jumlah = parseInt(args[1]);
				// Cek apakah menggunakan tag atau nomor
				if (m.mentionedJid.length !== 0)
				{
					target = m.mentionedJid[0]; // Jika pakai tag
				}
				else if (/^\d+$/.test(args[0]))
				{
					target = args[0] + '@s.whatsapp.net'; // Jika pakai nomor
				}
				else
				{
					return shoNherly('⚠️ ¡Ingrese un número de usuario o etiqueta válidos!');
				}
				if (isNaN(jumlah) || jumlah <= 0) return shoNherly('⚠️ ¡Ingrese un monto límite válido!');
				const db = loadUserFire();
				// Tambahkan limit
				if (!db[target])
				{
					db[target] = {
						limit: jumlah,
						role: 'user'
					};
				}
				else
				{
					db[target].limit += jumlah;
				}
				saveUserFire(db);
				shoNherly(`✅ Agregado exitosamente ${jumlah} límite para @${target.split('@')[0]}`,
				{
					mentions: [target]
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'delfire':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (m.mentionedJid.length === 0) return shoNherly(`⚠️ ¡Etiqueta al usuario cuyo límite quieres restablecer!\n\nEjemplo: .delfire @user`);
				let target = m.mentionedJid[0];
				const db = loadUserFire();
				if (!db[target]) return shoNherly(`⚠️ ¡El usuario aún no tiene límite de datos!`);
				db[target].limit = 0;
				saveUserFire(db);
				shoNherly(`✅ Limite user @${target.split('@')[0]} ¡Restablecido exitosamente a 0!`,
				{
					mentions: [target]
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'listuserfire':
			case 'cekfireuser':
			case 'cekuserfire':
			case 'listfireuser':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				try
				{
					const db = loadUserFire();
					const userList = Object.entries(db).map(([key, value]) =>
					{
						const userNumber = key.split('@')[0]; // Mengambil nomor saja
						return `Número: ${userNumber}\n- Rol: ${value.role}\n- Registro: ${value.register}\n- Limite: ${value.limit}`;
					}).join('\n\n');
					if (userList)
					{
						reply(`📋 *Lista de Usuarios Registrados:*\n\n${userList}`);
					}
					else
					{
						reply('⚠️ Ningún usuario registrado.');
					}
				}
				catch (error)
				{
					console.error(error);
					reply('⚠️ Se produjo un error al procesar los datos.');
				}
				}
			break
			case 'antilink': {
				if (!isGroup) return shoNherly(mess.groups);
				if (!isBotAdmins) return shoNherly(mess.abots);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				if (args.length < 1) return shoNherly('true/false?')
				if (args[0] === 'true') {
					db.data.chats[m.chat].antilink = true
					shoNherly(`${command} is activado`)
				} else if (args[0] === 'false') {
					db.data.chats[m.chat].antilink = false
					shoNherly(`${command} is desactivado`)
				}
			}
			break;

			case 'antilinkgc': {
				if (!isGroup) return shoNherly(mess.groups);
				if (!isBotAdmins) return shoNherly(mess.abots);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				if (args.length < 1) return shoNherly('true/false?')
				if (args[0] === 'true') {
					db.data.chats[m.chat].antilinkgc = true
					shoNherly(`${command} is activado`)
				} else if (args[0] === 'false') {
					db.data.chats[m.chat].antilinkgc = false
					shoNherly(`${command} is desactivado`)
				}
			}
			break;
			case 'deluser':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				try
				{
					const userNumber = args[0]; // Mengambil nomor pengguna dari input
					if (!userNumber)
					{
						reply('⚠️ Ingrese el número de usuario que desea eliminar.\n\nEjemplo: deluser 628123456789');
						break;
					}
					const db = loadUserFire();
					const userId = `${userNumber}@s.whatsapp.net`; // Format nomor ke ID lengkap
					if (db[userId])
					{
						delete db[userId];
						saveUserFire(db);
						reply(`✅ Usuario por número *${userNumber}* eliminado con éxito.`);
					}
					else
					{
						reply(`⚠️ Usuario por número *${userNumber}* extraviado.`);
					}
				}
				catch (error)
				{
					console.error(error);
					reply('⚠️ Se produjo un error al eliminar al usuario.');
				}
				}
			break
			case 'repo':
			case 'repository':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text || !text.includes('/'))
				{
					return shoNherly(`Usar formato ini ya: *${prefix + command} username/repository*\n\nContoh: *${prefix + command} Whiskeyshoets/Baileys*`);
				}
				const [username, repoName] = text.split('/');
				try
				{
					const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`)
					if (response.status === 200)
					{
						const repoData = response.data
						const formattedInfo = `*Repository Name :* ${repoData.name}\n*Description :* ${repoData.description}\n*Owner :* ${repoData.owner.login}\n*Stars :* ${repoData.stargazers_count}\n*Forks :* ${repoData.forks_count}\n*URL :* ${repoData.html_url}\n`;
						shoNherly(formattedInfo);
					}
					else
					{
						await shoNherly(`Unable to fetch repository information`)
					}
				}
				catch (error)
				{
					console.error(error)
					await shoNherly(`Repository currently not available `)
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'poll':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				let [poll, opt] = text.split("|")
				if (text.split("|") < 2) return await shoNherly(`Plantee la pregunta y al menos 2 opciones\nEjemplo: ${prefix}poll ¿Quién es el mejor administrador?|Manu,Nagum,Baedak...`)
				let options = []
				for (let i of opt.split(','))
				{
					options.push(i)
				}
				await shoNhe.sendMessage(m.chat,
				{
					poll:
					{
						name: poll,
						values: options
					}
				})
			}
			break
			case 'cekfire':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const db = loadUserFire();
				let target;
				// Jika pakai tag
				if (m.mentionedJid[0])
				{
					target = m.mentionedJid[0];
				}
				// Jika input berupa nomor
				else if (args[0])
				{
					target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
				}
				// Jika tidak ada input, cek limit diri sendiri
				else
				{
					target = m.sender;
				}
				// Cek apakah user sudah terdaftar di database
				if (!db[target])
				{
					return shoNhe.sendTextWithMentions(m.chat, `🔥 User @${target.split('@')[0]} aún no tiene límite.`, fgclink)
				}
				let role = db[target].role;
				let limit = db[target].limit;
				let message = `🔥 *Cek Fuego Limite*\n\n`;
				message += `👤 User: @${target.split('@')[0]}\n`;
				message += `📛 Rol: ${role}\n`;
				message += `🔥 Límite restante: ${limit === -1 ? '∞' : limit}\n`;
				shoNhe.sendTextWithMentions(m.chat, message, fgclink)
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'cyus':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				shoNherly('¿Anjay es nuevo, hermano?')
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'imdb':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`🎬 *¿Cuál es el título de la película o serie, hermana?*\n\nEjemplo:\n${prefix}${command} Comienzo`);
				try
				{
					if (!(await firely(m, mess.waits))) return;
					let
					{
						data
					} = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${encodeURIComponent(text)}&plot=full`);
					if (data.Response === 'False')
					{
						return shoNherly(`❌ *¡No se encontraron películas ni series!* Por favor, revisa el título nuevamente, hermana.`);
					}
					let imdbInfo = `🎬 *Título:* ${data.Title}\n`;
					imdbInfo += `📅 *Año:* ${data.Year}\n`;
					imdbInfo += `⭐ *Calificaciones:* ${data.Rated}\n`;
					imdbInfo += `📆 *Lanzamiento:* ${data.Released}\n`;
					imdbInfo += `⏳ *Duración:* ${data.Runtime}\n`;
					imdbInfo += `🌀 *Género:* ${data.Genre}\n`;
					imdbInfo += `👨‍💼 *Director:* ${data.Director}\n`;
					imdbInfo += `✍️ *Escritor:* ${data.Writer}\n`;
					imdbInfo += `👥 *Actor:* ${data.Actors}\n`;
					imdbInfo += `📖 *Trama:* ${data.Plot}\n`;
					imdbInfo += `🌐 *Idioma:* ${data.Language}\n`;
					imdbInfo += `🌍 *País:* ${data.Country}\n`;
					imdbInfo += `🏆 *Premios:* ${data.Awards}\n`;
					imdbInfo += `💵 *Taquilla:* ${data.BoxOffice || '-'}\n`;
					imdbInfo += `🏙️ *Producción:* ${data.Production || '-'}\n`;
					imdbInfo += `🌟 *Calificación de IMDb:* ${data.imdbRating}\n`;
					imdbInfo += `✅ *Votos de IMDb:* ${data.imdbVotes}\n`;
					await shoNhe.sendMessage(m.chat,
					{
						image:
						{
							url: data.Poster || 'https://via.placeholder.com/300x450?text=No+Poster'
						},
						caption: imdbInfo,
					},
					{
						quoted: m
					});
					shoNherly(`✅ *¡Información de la película mostrada con éxito!*`);
				}
				catch (err)
				{
					console.error(err);
					shoNherly(`❌ *¡Ocurrió un error al buscar la película!* 😭\n${err.message || err}`);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'pinterestdl':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`Example: ${prefix + command} url_pinterest`);
				const pinterestRegex = /(?:https?:\/\/)?(?:www\.)?pinterest\.(com|co\.[a-z]{2})\/.+|pin\.it\/.+/;
				if (!pinterestRegex.test(text)) return shoNherly('❌ Url tidak mengandung tautan Pinterest yang valid!');
				try
				{
					// Panggil REST API untuk mendapatkan data Pinterest
					const response = await fetch(`https://api.siputzx.my.id/api/d/pinterest?url=${encodeURIComponent(text)}`);
					const data = await response.json();
					if (!(await firely(m, mess.waits))) return; // Jika limit habis, proses berhenti di sini
					// Periksa apakah API berhasil mengembalikan data
					if (data && data.status && data.data)
					{
						const media = data.data; // Ambil data dari respons API
						await shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: media.url
							}, // Gambar dari URL yang diberikan API
							caption: `*✅ Gambar berhasil diunduh dari Pinterest!*\n\n📅 *Dibuat Pada:* ${media.created_at}\n🔗 *Url:* ${text}`,
							footer: namabot,
						},
						{
							quoted: m
						});
					}
					else
					{
						shoNherly('❌ Tidak ada konten yang ditemukan untuk tautan ini!');
					}
				}
				catch (e)
				{
					console.error('Error saat memproses URL Pinterest:', e);
					shoNherly('❌ Gagal memproses tautan Pinterest! Detail error: ' + e.message);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			/*
			 * ANIME MENU CUMA BUAT NAMBAH CASE DOANK
			 * YURINS, SHO, YUDA, SYCHYY, SYCHEE
			 */
			case 'anichindetail':
			case 'anichindet':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const url = args[0]; // Ambil URL dari argumen
				if (!url)
				{
					reply('⚠️ Harap masukkan URL. Contoh: anichindtl https://anichin.forum/renegade-immortal-episode-69-subtitle-indonesia');
				}
				if (!(await firely(m, mess.waits))) return;
				const apiUrl = `https://api.siputzx.my.id/api/anime/anichin-detail?url=${encodeURIComponent(url)}`;
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (!status)
					{
						reply('⚠️ Gagal mengambil data.');
					}
					const detailText = `🎥 *Detail Anime*\n\n🎬 *Judul:* ${data.title}\n📅 *Rilis:* ${data.released}\n🌟 *Rating:* ${data.rating}\n🎭 *Genre:* ${data.genres.join(', ')}\n🏢 *Studio:* ${data.studio}\n📺 *Jaringan:* ${data.network}\n⏱ *Durasi:* ${data.duration}\n🌍 *Negara:* ${data.country}\n🔖 *Tipe:* ${data.type}\n📂 *Status:* ${data.status}\n📜 *Sinopsis:* ${data.synopsis || 'Tidak tersedia'}\n`;
					const success = shoNherly(detailText);
					if (success)
					{
						shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: data.thumbnail
							},
							caption: detailText,
						},
						{
							quoted: m
						});
					}
				}
				catch (error)
				{
					reply(`❌ Terjadi kesalahan: ${error.message}`);
				}
				}
			break
			case 'anichindl':
			case 'anichindownload':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const url = args[0]; // Ambil URL dari argumen
				if (!url)
				{
					reply('⚠️ Harap masukkan URL. Contoh: anichindl https://anichin.forum/renegade-immortal-episode-69-subtitle-indonesia');
				}
				if (!(await firely(m, mess.waits))) return;
				const apiUrl = `https://api.siputzx.my.id/api/anime/anichin-download?url=${encodeURIComponent(url)}`;
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (!status)
					{
						reply('⚠️ Gagal mengambil data.');
					}
					let downloadLinks = '🔗 *Link Download*\n\n';
					data.forEach((item) =>
					{
						downloadLinks += `🎥 *Resolusi:* ${item.resolution}\n`;
						item.links.forEach((link) =>
						{
							downloadLinks += `🌐 *Host:* ${link.host}\n🔗 ${link.link}\n\n`;
						});
					});
					const success = shoNherly(downloadLinks);
					if (success)
					{
						reply(downloadLinks);
					}
				}
				catch (error)
				{
					reply(`❌ Terjadi kesalahan: ${error.message}`);
				}
				}
			break
			case 'anichinepisode':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const url = args[0]; // Ambil URL dari argumen
				if (!url)
				{
					reply('⚠️ Harap masukkan URL. Contoh: epsanichin https://anichin.forum/renegade-immortal');
				}
				if (!(await firely(m, mess.waits))) return;
				const apiUrl = `https://api.siputzx.my.id/api/anime/anichin-episode?url=${encodeURIComponent(url)}`;
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (!status)
					{
						reply('⚠️ Gagal mengambil data.');
					}
					let episodes = '🎬 *Daftar Episode*\n\n';
					data.forEach((episode) =>
					{
						episodes += `📼 *Episode:* ${episode.episodeNumber}\n🎞 *Judul:* ${episode.title}\n📅 *Rilis:* ${episode.releaseDate}\n🔗 *Tautan:* ${episode.link}\n\n`;
					});
					const success = shoNherly(episodes);
					if (success)
					{
						reply(episodes);
					}
				}
				catch (error)
				{
					reply(`❌ Terjadi kesalahan: ${error.message}`);
				}
				}
			break
			case 'anichinsearch':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				if (!text) return shoNherly('Masukkan query pencarian, contoh: .anichinsearch ular');
				let url = `https://api.siputzx.my.id/api/anime/anichin-search?query=${text}`;
				try
				{
					let response = await axios.get(url);
					let result = response.data;
					if (result.status && result.data.length > 0)
					{
						let caption = '*Hasil Pencarian Anichin:*\n\n';
						result.data.forEach((anime, index) =>
						{
							caption += `🔹 *${index + 1}. ${anime.title}*\n`;
							caption += `   - Tipe: ${anime.type}\n`;
							caption += `   - Status: ${anime.status}\n`;
							caption += `   - Link: ${anime.link}\n\n`;
						});
						shoNhe.sendMessage(from,
						{
							text: caption,
							contextInfo:
							{
								externalAdReply:
								{
									title: 'Anichin Search',
									body: 'Powered by TechFix Botz',
									thumbnail: await getBuffer(result.data[0].image),
									sourceUrl: result.data[0].link
								}
							}
						},
						{
							quoted: m
						});
					}
					else
					{
						reply('Anime tidak ditemukan, coba dengan query lain.');
					}
				}
				catch (error)
				{
					console.error(error);
					reply('Terjadi kesalahan saat memproses permintaan Anda.');
				}
				}
			break
case 'adzanon': {
  if (!isGroup) return shoNherly(mess.groups);
  if (!(isAdmins || isShoNheOwn)) return shoNherly(mess.admins); // Hanya admin atau pemilik yang bisa
  setAdzanStatus(m.chat, true);
  shoNhe.sendMessage(m.chat, { text: "✅ Fitur Adzan telah diaktifkan di grup ini." }, { quoted: m });
  }
  break;

case 'adzandoff': {
  if (!isGroup) return shoNherly(mess.groups);
  if (!(isAdmins || isShoNheOwn)) return shoNherly(mess.admins); // Hanya admin atau pemilik yang bisa
  setAdzanStatus(m.chat, false);
  shoNhe.sendMessage(m.chat, { text: "❌ Fitur Adzan telah dinonaktifkan di grup ini." }, { quoted: m });
  }
  break;

case 'cekadzan': {
  const status = getAdzanStatus(m.chat) ? "AKTIF" : "NONAKTIF";
  shoNhe.sendMessage(m.chat, { text: `Status Adzan di grup ini: ${status}` }, { quoted: m });
  }
  break;
			case 'aurataildetail':
			case 'aurataildet':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly('Masukkan URL anime secara manual, contoh: .aurataildetail https://auratail.vip/the-war-of-cards');
				if (!(await firely(m, mess.waits))) return;
				// URL API dengan input manual
				let apiUrl = `https://api.siputzx.my.id/api/anime/auratail-detail?url=${text}`;
				try
				{
					let response = await axios.get(apiUrl);
					let result = response.data;
					if (result.status && result.data)
					{
						const
						{
							title,
							image,
							status,
							studio,
							episodes,
							duration,
							type,
							releaseYear,
							producers,
							genres,
							synopsis
						} = result.data;
						// Format output untuk pengguna
						let caption = `*🎥 Detail Anime*\n\n`;
						caption += `📌 *Judul*: ${title}\n`;
						caption += `📀 *Tipe*: ${type}\n`;
						caption += `📅 *Tahun Rilis*: ${releaseYear}\n`;
						caption += `📡 *Studio*: ${studio || 'Tidak diketahui'}\n`;
						caption += `📜 *Status*: ${status}\n`;
						caption += `🎞️ *Jumlah Episode*: ${episodes || 'Tidak tersedia'}\n`;
						caption += `⏱️ *Durasi*: ${duration || 'Tidak tersedia'}\n`;
						caption += `🏢 *Produser*: ${producers || 'Tidak tersedia'}\n`;
						caption += `🎭 *Genre*: ${genres || 'Tidak diketahui'}\n\n`;
						caption += `📖 *Sinopsis*: ${synopsis || 'Tidak tersedia'}\n\n`;
						caption += `🔗 [Link Anime](https://auratail.vip/the-war-of-cards)\n`;
						// Kirim pesan dengan detail anime
						shoNhe.sendMessage(from,
						{
							image:
							{
								url: image
							},
							caption: caption,
							contextInfo:
							{
								externalAdReply:
								{
									title: title,
									body: 'Detail Anime Auratail',
									thumbnail: await getBuffer(image),
									sourceUrl: text
								}
							}
						},
						{
							quoted: m
						});
					}
					else
					{
						reply('Anime tidak ditemukan, pastikan URL yang diberikan valid.');
					}
				}
				catch (error)
				{
					console.error(error);
					reply('Terjadi kesalahan saat memproses permintaan Anda.');
				}
				}
			break
			case 'animelast':
			case 'animelatest':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				const apiUrl = 'https://api.siputzx.my.id/api/anime/latest';
				const page = parseInt(args[0]) || 1; // Halaman saat ini, default halaman 1
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (!status)
					{
						reply('⚠️ Gagal mengambil data anime terbaru.');
					}
					if (page > data.length || page < 1)
					{
						reply('⚠️ Halaman tidak ditemukan atau sudah mencapai akhir daftar.');
					}
					const anime = data[page - 1]; // Ambil anime berdasarkan halaman
					const caption = `🎥 *Anime Terbaru*\n\n🎬 *Judul:* ${anime.title}\n📺 *Episode:* ${anime.episode}\n🔖 *Tipe:* ${anime.type}\n🌐 *URL:* ${anime.url}\n\n📄 *Halaman:* ${page} dari ${data.length}`;
					// Tombol Next jika masih ada anime berikutnya
					const buttons = [];
					if (page < data.length)
					{
						buttons.push(
						{
							buttonId: `${prefix}animelast ${page + 1}`,
							buttonText:
							{
								displayText: "Next ➡️"
							},
							type: 1
						});
					}
					// Kirim pesan dengan thumbnail dan tombol
					shoNhe.sendMessage(m.chat,
					{
						image:
						{
							url: anime.thumbnail
						}, // Gambar dari data API
						caption: caption,
						footer: namabot,
						buttons: buttons,
						viewOnce: true,
					},
					{
						quoted: m
					});
				}
				catch (error)
				{
					reply(`❌ Terjadi kesalahan: ${error.message}`);
				}
				}
			break
			case 'aurataillast':
			case 'aurataillatest':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				const apiUrl = 'https://api.siputzx.my.id/api/anime/auratail-latest';
				const page = parseInt(args[0]) || 1; // Halaman saat ini, default halaman 1
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (!status)
					{
						reply('⚠️ Gagal mengambil data anime terbaru.');
					}
					if (page > data.length || page < 1)
					{
						reply(`⚠️ Halaman tidak valid. Total halaman tersedia: ${data.length}`);
					}
					const anime = data[page - 1]; // Ambil anime berdasarkan halaman
					const caption = `*🎥 Anime Terbaru*\n\n` + `🎬 *Judul*: ${anime.title}\n` + `📺 *Episode*: ${anime.episode}\n` + `🌐 *Link*: [Tonton di sini](${anime.link})\n\n` + `📄 *Halaman*: ${page} dari ${data.length}`;
					// Tombol untuk navigasi halaman berikutnya
					const buttons = [];
					if (page < data.length)
					{
						buttons.push(
						{
							buttonId: `${prefix}aurataillast ${page + 1}`,
							buttonText:
							{
								displayText: 'Next ➡️'
							},
							type: 1
						});
					}
					// Kirim pesan dengan thumbnail dan tombol navigasi
					shoNhe.sendMessage(m.chat,
					{
						image:
						{
							url: anime.image
						},
						caption: caption,
						footer: namabot,
						buttons: buttons,
						viewOnce: true,
					},
					{
						quoted: m
					});
				}
				catch (error)
				{
					console.error(error);
					reply(`❌ Terjadi kesalahan: ${error.message}`);
				}
				}
			break
			case 'auratailsearch':
			case 'ats':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text)
				{
					reply('Silakan masukkan judul anime yang ingin dicari. Contoh: `.auratailsearch war`');
				}
				if (!(await firely(m, mess.waits))) return;
				const apiUrl = `https://api.siputzx.my.id/api/anime/auratail-search?query=${encodeURIComponent(text)}`;
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (status && data.length > 0)
					{
						let hasil = '🎥 *Hasil Pencarian:*\n\n';
						for (const anime of data)
						{
							hasil += `🔹 *Judul:* ${anime.title}\n`;
							hasil += `📡 *Status:* ${anime.status}\n`;
							hasil += `🔗 *Link:* ${anime.link})\n\n`;
						}
						shoNhe.sendMessage(m.chat,
						{
							text: hasil,
							contextInfo:
							{
								externalAdReply:
								{
									title: 'Auratail Anime Search',
									body: 'Klik tautan untuk menonton!',
									thumbnail: await getBuffer(data[0].image),
									sourceUrl: apiUrl
								}
							}
						},
						{
							quoted: m
						});
					}
					else
					{
						reply('Anime tidak ditemukan. Coba gunakan kata kunci lain.');
					}
				}
				catch (error)
				{
					console.error('Terjadi kesalahan saat mengambil data:', error.message);
					reply('Terjadi kesalahan saat mencari anime. Silakan coba lagi nanti.');
				}
				}
			break
			case 'auratailpopular':
			case 'auratailpop':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				const apiUrl = 'https://api.siputzx.my.id/api/anime/auratail-popular';
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (!status || data.length === 0)
					{
						reply('⚠️ Gagal mengambil data anime populer.');
					}
					// Membuat daftar anime populer
					let caption = '*🎥 Anime Populer*\n\n';
					data.forEach((anime, index) =>
					{
						caption += `🔹 *${index + 1}. ${anime.title}*\n`;
						caption += `🌐 ${anime.link}\n\n`;
					});
					// Kirim pesan
					shoNhe.sendMessage(m.chat,
					{
						text: caption,
						footer: namabot,
						contextInfo:
						{
							externalAdReply:
							{
								title: 'Auratail Popular Anime',
								body: 'Daftar anime populer dari Auratail',
								sourceUrl: apiUrl
							}
						}
					},
					{
						quoted: m
					});
				}
				catch (error)
				{
					console.error(error);
					reply(`❌ Terjadi kesalahan: ${error.message}`);
				}
				}
			break
			case 'jadwalsholat': {
    let kodeKota = args[0] || '3578'; // Default ke Surabaya jika kode kota tidak diberikan
    if (!args[0]) {
        shoNherly("⚠️ Kode kota tidak diberikan. Mengambil jadwal sholat untuk *Surabaya*.");
    }

    let jadwal = await getJadwalSholat(kodeKota);
    if (!jadwal) return shoNherly("❌ Tidak dapat mengambil jadwal sholat, coba lagi nanti.");

    let teks = `📅 *Jadwal Sholat Hari Ini (${jadwal.tanggal})*\n\n`;
    teks += `📍 *Lokasi:* ${jadwal.lokasi}\n`;
    teks += `🌅 *Subuh:* ${jadwal.subuh}\n`;
    teks += `☀️ *Dzuhur:* ${jadwal.dzuhur}\n`;
    teks += `⛅ *Ashar:* ${jadwal.ashar}\n`;
    teks += `🌆 *Maghrib:* ${jadwal.maghrib}\n`;
    teks += `🌙 *Isya:* ${jadwal.isya}\n`;

    shoNherly(teks);
}
break;
			case 'listkota':
				try
				{
					const url = 'https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/kota.json';
					const response = await axios.get(url);
					const kotaList = response.data;
					if (!kotaList || kotaList.length === 0)
					{
						shoNherly('❌ Tidak ada data kota yang tersedia.');;
					}
					let pesan = `📍 *Daftar Kota yang Tersedia*\n\n`;
					pesan += `Usar formato: .jadwalsholat jakarta|2025|01\n\n`;
					kotaList.forEach((kota, index) =>
					{
						pesan += `${index + 1}. ${kota}\n`;
					});
					shoNherly(pesan);
				}
				catch (error)
				{
					console.error(error);
					shoNherly('⚠️ Gagal mengambil daftar kota. Coba lagi nanti.');
				}
				break;
			case 'animpopular':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				const apiUrl = 'https://api.siputzx.my.id/api/anime/anichin-popular';
				const page = parseInt(args[0]) || 1; // Halaman saat ini, default halaman 1
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (!status)
					{
						reply('⚠️ Gagal mengambil data anime populer.');
					}
					if (page > data.length || page < 1)
					{
						reply('⚠️ Halaman tidak ditemukan atau sudah mencapai akhir daftar.');
					}
					const anime = data[page - 1]; // Ambil anime berdasarkan halaman
					const caption = `🎥 *Anime Populer*\n\n🎬 *Judul:* ${anime.title}\n📺 *Episode:* ${anime.episode}\n🔖 *Tipe:* ${anime.type}\n🌐 *URL:* ${anime.link}\n\n📄 *Halaman:* ${page} dari ${data.length}`;
					// Tombol Next jika masih ada anime berikutnya
					const buttons = [];
					if (page < data.length)
					{
						buttons.push(
						{
							buttonId: `${prefix}animpopular ${page + 1}`,
							buttonText:
							{
								displayText: "Next ➡️"
							},
							type: 1
						});
					}
					// Kirim pesan dengan gambar dan tombol
					shoNhe.sendMessage(m.chat,
					{
						image:
						{
							url: anime.image
						}, // Gambar dari data API
						caption: caption,
						footer: namabot,
						buttons: buttons,
						viewOnce: true,
					},
					{
						quoted: m
					});
				}
				catch (error)
				{
					reply(`❌ Terjadi kesalahan: ${error.message}`);
				}
				}
			break
			case 'komikindodetail':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text)
				{
					reply('Silakan masukkan URL komik. Contoh: `.komikindodetail https://komikindo.pw/komik/550578-solo-leveling`');
				}
				if (!(await firely(m, mess.waits))) return;
				const apiUrl = `https://api.siputzx.my.id/api/anime/komikindo-detail?url=${encodeURIComponent(text)}`;
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (status)
					{
						const
						{
							title,
							altTitle,
							status: komikStatus,
							author,
							genre,
							description,
							imageUrl,
							chapters
						} = data;
						let hasil = `📖 *Detail Komik:*\n\n`;
						hasil += `🔹 *Judul:* ${title.trim()}\n`;
						hasil += `🔸 *Judul Alternatif:* ${altTitle}\n`;
						hasil += `📡 *Status:* ${komikStatus}\n`;
						hasil += `✍️ *Penulis:* ${author}\n`;
						hasil += `🏷️ *Genre:* ${genre.join(', ')}\n\n`;
						hasil += `📝 *Deskripsi:*\n${description.trim()}\n\n`;
						hasil += `📚 *Daftar Chapter Terbaru:*\n`;
						chapters.slice(0, 10).forEach((chapter, i) =>
						{
							hasil += `${i + 1}. [${chapter.chapter.trim()}](${chapter.url})\n`;
						});
						hasil += `\n🔗 Link: ${text}`;
						shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: imageUrl
							},
							caption: hasil
						},
						{
							quoted: m
						});
					}
					else
					{
						reply('Komik tidak ditemukan. Pastikan URL yang Anda masukkan benar.');
					}
				}
				catch (error)
				{
					console.error('Terjadi kesalahan saat mengambil data:', error.message);
					reply('Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.');
				}
				}
			break
			case 'komikindodownload':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text)
				{
					reply('Silakan masukkan URL chapter komik. Contoh: `.komikindodownload https://komikindo.pw/solo-leveling-chapter-1`');
				}
				if (!(await firely(m, mess.waits))) return;
				const apiUrl = `https://api.siputzx.my.id/api/anime/komikindo-download?url=${encodeURIComponent(text)}`;
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (status && Array.isArray(data) && data.length > 0)
					{
						reply('📚 *Menyiapkan carousel untuk gambar...*');
						// Batasi jumlah gambar di carousel (misalnya 10 gambar pertama)
						const carouselImages = data.slice(0, 50);
						const carouselCards = await Promise.all(carouselImages.map(async (url, index) => (
						{
							header:
							{
								title: `Halaman ${index + 1}`,
								hasMediaAttachment: true,
								imageMessage: (await generateWAMessageContent(
								{
									image:
									{
										url
									}
								},
								{
									upload: shoNhe.waUploadToServer
								})).imageMessage
							},
							body:
							{
								text: `Gambar dari chapter komik yang Anda minta.`
							},
							footer:
							{
								text: `Halaman ${index + 1}`
							},
							nativeFlowMessage:
							{
								buttons: [
								{
									name: "cta_url",
									buttonParamsJson: JSON.stringify(
									{
										display_text: "Lihat Gambar",
										url
									})
								}]
							}
						})));
						// Buat pesan carousel
						const carouselMessage = generateWAMessageFromContent(m.chat,
						{
							viewOnceMessage:
							{
								message:
								{
									interactiveMessage: proto.Message.InteractiveMessage.fromObject(
									{
										body:
										{
											text: `📖 Gambar untuk chapter komik Anda.\n\nURL: ${text}`
										},
										footer:
										{
											text: "Komikindo Bot by Sych"
										},
										carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject(
										{
											cards: carouselCards
										})
									})
								}
							}
						},
						{});
						// Kirim carousel
						await shoNhe.relayMessage(m.chat, carouselMessage.message,
						{
							messageId: carouselMessage.key.id
						});
					}
					else
					{
						reply('Tidak dapat menemukan gambar untuk chapter ini. Pastikan URL yang Anda masukkan benar.');
					}
				}
				catch (error)
				{
					console.error('Terjadi kesalahan saat membuat carousel:', error.message);
					reply('Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.');
				}
				}
			break
			case 'samehadakurelease':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text)
				{
					reply('Gunakan perintah dengan format: `.samehadakurelease <hari> <index>`.\nContoh: `.samehadakurelease sunday 0`');
				}
				if (!(await firely(m, mess.waits))) return;
				const [day, indexText] = text.split(' ');
				const index = parseInt(indexText) || 0; // Default index 0 jika tidak ada input
				const apiUrl = `https://api.siputzx.my.id/api/anime/samehadaku/release`;
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (status && data[day] && Array.isArray(data[day]))
					{
						const releases = data[day];
						const release = releases[index];
						if (!release)
						{
							reply(`Tidak ada data untuk hari "${day}" pada index ${index}.`);
						}
						// Format pesan
						const message = `
🎥 *${release.title}*
📅 Tanggal Rilis: ${release.date}
📜 Genre: ${release.genre}
⭐ Skor: ${release.east_score}
📂 Tipe: ${release.east_type}
🕒 Jadwal: ${release.east_schedule} ${release.east_time}
🔗 Link: ${release.url}
            `.trim();
						// Tombol Next
						const buttons = [];
						if (index + 1 < releases.length)
						{
							buttons.push(
							{
								buttonId: `.samehadakurelease ${day} ${index + 1}`,
								buttonText:
								{
									displayText: "Next ➡️"
								},
							});
						}
						// Kirim pesan
						shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: release.featured_img_src
							},
							caption: message,
							footer: "Samehadaku • ShoNhe Bot",
							buttons,
							viewOnce: true,
						},
						{
							quoted: m
						});
					}
					else
					{
						reply(`Tidak ada data untuk hari "${day}". Pastikan Anda memasukkan hari yang benar.`);
					}
				}
				catch (error)
				{
					console.error('Terjadi kesalahan:', error.message);
					reply('Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.');
				}
				}
			break
			case 'komikindosearch':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text)
				{
					reply('Silakan masukkan judul komik yang ingin dicari. Contoh: `.komikindosearch solo leveling`');
					return;
				}
				if (!(await firely(m, mess.waits))) return;
				const apiUrl = `https://api.siputzx.my.id/api/anime/komikindo-serach?query=${encodeURIComponent(text)}`;
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (!status || data.length === 0)
					{
						reply('⚠️ Tidak ada komik yang ditemukan.');
						return;
					}
					let results = `📚 *Hasil Pencarian Komik*\n\n`;
					for (const komik of data)
					{
						results += `📖 *Judul:* ${komik.title}\n🌟 *Rating:* ${komik.rating}\n🔗 *URL:* ${komik.href}\n🖼️ *Gambar:* ${komik.image}\n\n`;
					}
					// Kirim hasil pencarian
					shoNhe.sendMessage(m.chat,
					{
						text: results,
						footer: namabot,
						viewOnce: true,
					},
					{
						quoted: m
					});
				}
				catch (error)
				{
					reply(`❌ Terjadi kesalahan: ${error.message}`);
				}
				}
			break
			case 'otakudesuongoing':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text)
				{
					reply('Gunakan perintah dengan format: `.otakudesuongoing <halaman>`.\nContoh: `.otakudesuongoing 1`');
				}
				if (!(await firely(m, mess.waits))) return;
				const page = parseInt(text) || 1; // Halaman awal
				const itemsPerPage = 5; // Jumlah anime per halaman
				const apiUrl = `https://api.siputzx.my.id/api/anime/otakudesu/ongoing`;
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (status && Array.isArray(data))
					{
						// Tentukan batas data berdasarkan halaman
						const startIndex = (page - 1) * itemsPerPage;
						const endIndex = startIndex + itemsPerPage;
						const currentPageData = data.slice(startIndex, endIndex);
						// Jika tidak ada data untuk halaman tersebut
						if (currentPageData.length === 0)
						{
							reply(`Tidak ada data untuk halaman ${page}.`);
						}
						// Rangkai pesan anime
						let message = `📺 *Ongoing Anime - Halaman ${page}*\n\n`;
						currentPageData.forEach((anime, index) =>
						{
							message += `🎥 *${anime.title}*\n`;
							message += `📅 Tayang: ${anime.type}, ${anime.date}\n`;
							message += `📜 Episode: ${anime.episode}\n`;
							message += `🔗 Link: ${anime.link}\n\n`;
						});
						// Tombol Next jika ada halaman selanjutnya
						const hasNextPage = endIndex < data.length;
						const buttons = [];
						if (hasNextPage)
						{
							buttons.push(
							{
								buttonId: `.otakudesuongoing ${page + 1}`,
								buttonText:
								{
									displayText: "Next ➡️"
								}
							});
						}
						// Kirim pesan
						shoNhe.sendMessage(m.chat,
						{
							image: getRandomThumb3(),
							caption: message,
							footer: "Otakudesu • ShoNhe Bot",
							buttons,
							viewOnce: true,
						},
						{
							quoted: m
						});
					}
					else
					{
						reply('Gagal mendapatkan data ongoing anime.');
					}
				}
				catch (error)
				{
					console.error('Terjadi kesalahan:', error.message);
					reply('Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'otakudesusearch':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text)
				{
					reply('Silakan masukkan kata kunci pencarian. Contoh: `.otakudesusearch naruto`');
				}
				if (!(await firely(m, mess.waits))) return;
				const apiUrl = `https://api.siputzx.my.id/api/anime/otakudesu/search?s=${encodeURIComponent(text)}`;
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (status && Array.isArray(data) && data.length > 0)
					{
						data.forEach(async (anime) =>
						{
							const message = `
🔍 *Hasil Pencarian:*
🎥 *${anime.title}*
📜 Genre: ${anime.genres}
📊 Rating: ${anime.rating}
📂 Status: ${anime.status}
🔗 Link: ${anime.link}
                `.trim();
							const tombol = [
							{
								name: "cta_url",
								buttonParamsJson: JSON.stringify(
								{
									display_text: "WATCH ♨️",
									url: `${anime.link}`,
								}),
							}, ];
							// Kirim pesan dengan gambar
							await sendButtonImage(m.chat, "", message,
							{
								url: anime.imageUrl
							}, tombol, hw);
						});
					}
					else
					{
						reply(`Tidak ditemukan hasil untuk kata kunci: "${text}".`);
					}
				}
				catch (error)
				{
					console.error('Terjadi kesalahan:', error.message);
					reply('Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.');
				}
				}
			break
			case 'otakudesudetail':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text)
				{
					reply('Silakan masukkan URL anime. Contoh: `.otakudesudetail https://otakudesu.cloud/anime/borto-sub-indo`');
				}
				if (!(await firely(m, mess.waits))) return;
				const apiUrl = `https://api.siputzx.my.id/api/anime/otakudesu/detail?url=${encodeURIComponent(text)}`;
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (status && data)
					{
						const
						{
							animeInfo,
							episodes
						} = data;
						// Informasi anime
						const animeText = `
🎥 *Detail Anime*
🔖 Judul: ${animeInfo.title}
🔖 Judul Jepang: ${animeInfo.japaneseTitle}
⭐ Skor: ${animeInfo.score}
📺 Tipe: ${animeInfo.type}
📅 Tanggal Rilis: ${animeInfo.releaseDate}
🖥️ Studio: ${animeInfo.studio}
⏳ Durasi: ${animeInfo.duration}
📜 Status: ${animeInfo.status}
🎭 Genre: ${animeInfo.genres}
👥 Produser: ${animeInfo.producer}
            `.trim();
						// Tampilkan episode terbaru
						let episodeText = '\n\n📚 *Episode Terbaru:*\n';
						episodes.forEach((episode) =>
						{
							episodeText += `- *${episode.title}*\n  📅 ${episode.date}\n  🔗 *Link:* ${episode.link}\n`;
						});
						// Kirim informasi anime dan episode
						shoNhe.sendMessage(m.chat,
						{
							image:
							{
								url: animeInfo.imageUrl
							},
							caption: `${animeText}${episodeText}`,
						},
						{
							quoted: m
						});
					}
					else
					{
						reply('Gagal mendapatkan data. Pastikan URL yang Anda masukkan benar.');
					}
				}
				catch (error)
				{
					console.error('Terjadi kesalahan:', error.message);
					reply('Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.');
				}
				}
			break
			case 'samehadakudetail':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				i
				// Validasi input
				if (!text)
				{
					reply(`Contoh penggunaan:\n${prefix}samehadakudetail https://samehadaku.email/anime/blue-lock-season-2`);
					return;
				}
				if (!(await firely(m, mess.waits))) return;
				try
				{
					const apiUrl = `https://api.siputzx.my.id/api/animesamehadaku/detail?link=${text}`;
					const response = await fetch(apiUrl);
					const result = await response.json();
					if (!result.status || !result.data)
					{
						reply("Anime tidak ditemukan atau terjadi kesalahan pada API.");
						return;
					}
					const animeData = result.data;
					// Format pesan untuk daftar episode
					let episodeList = animeData.episodes.map((episode, index) => `*${index + 1}. ${episode.title}*\nTanggal: ${episode.date}\nLink: ${episode.link}`).join('\n\n');
					// Kirim pesan
					const message = `*${animeData.title}*\n\n` + `📅 *Tanggal Rilis*: ${animeData.published || 'Tidak tersedia'}\n` + `⭐ *Rating*: ${animeData.rating}\n` + `📖 *Deskripsi*: ${animeData.description}\n\n` + `🎬 *Daftar Episode*:\n${episodeList}`;
					await shoNhe.sendMessage(m.chat,
					{
						image:
						{
							url: animeData.thumbnail
						},
						caption: message
					});
				}
				catch (error)
				{
					console.error("Kesalahan saat memproses permintaan:", error.message);
					reply("Terjadi kesalahan saat memproses permintaan Anda.");
				}
				}
			break
			case 'oploverzdownload':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text)
				{
					reply('Silakan masukkan URL anime. Contoh: `.oploverzdownload https://oploverz.org/anime/captain-tsubasa-season-2-junior-youth-hen-1-episode-30-subtitle-indonesia`');
				}
				if (!(await firely(m, mess.waits))) return;
				const apiUrl = `https://api.siputzx.my.id/api/anime/oploverz-download?url=${encodeURIComponent(text)}`;
				try
				{
					const response = await axios.get(apiUrl);
					const
					{
						status,
						data
					} = response.data;
					if (status && data)
					{
						const
						{
							title,
							date,
							iframeSrc
						} = data;
						// Kirim video streaming
						if (iframeSrc)
						{
							shoNhe.sendMessage(m.chat,
							{
								video:
								{
									url: iframeSrc
								},
								caption: `🎥 *${title}*\n📅 Rilis: ${date}\n\nSelamat menikmati!`,
							},
							{
								quoted: m
							});
						}
						else
						{
							reply('Tidak ditemukan video untuk URL yang diberikan.');
						}
					}
					else
					{
						reply('Gagal mendapatkan data. Pastikan URL yang Anda masukkan benar.');
					}
				}
				catch (error)
				{
					console.error('Terjadi kesalahan:', error.message);
					reply('Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.');
				}
				}
			break
			/* 
			 * PEMBATAS DOANG HEHE
			 */
			case 'ig':
			case 'instagram':
			case 'igdl':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				console.log('📢 Memproses perintah IG Download...');
				if (!text)
				{
					console.log('⚠️ Tidak ada URL yang diberikan.');
					return shoNherly(`⚠️ Gunakan dengan cara: ${prefix + command} *url*\n\n🤔 *Contoh:*\n${prefix + command} https://www.instagram.com/reel/Cr5AXBQvBC1/`);
				}
				if (!(await firely(m, mess.waits))) return;
				// Mengambil angka setelah URL jika ada
				const regex = /(\d+)$/;
				const match = text.match(regex);
				const numImages = match ? parseInt(match[1]) : 8; // Default ke 8 jika tidak ada angka
				console.log('🌐 URL yang dimasukkan:', text);
				console.log('🔢 Jumlah gambar yang akan dikirim:', numImages);
				try
				{
					console.log('📡 Menghubungi API...');
					let anu = await fetchJson(`https://api.siputzx.my.id/api/d/igdl?url=${text}`);
					console.log('🔍 Respons API:', JSON.stringify(anu, null, 2));
					if (!anu.status || !anu.data || anu.data.length === 0)
					{
						console.log('❌ Data tidak ditemukan atau kosong.');
						return shoNherly('❌ Konten tidak ditemukan. Pastikan tautannya benar!');
					}
					console.log('✅ Data ditemukan! Proses pengiriman...');
					let count = 0; // Untuk membatasi jumlah gambar/video yang dikirim
					// Batasi data yang dikirim sesuai jumlah yang diinginkan
					const totalItems = Math.min(anu.data.length, numImages);
					for (let i = 0; i < totalItems; i++)
					{
						let item = anu.data[i];
						console.log('📦 Item ditemukan:', item);
						// Ambil data file dari URL
						console.log('⏳ Mengunduh file untuk deteksi tipe...');
						const response = await axios.get(item.url,
						{
							responseType: 'arraybuffer'
						});
						// Periksa header Content-Type
						const contentType = response.headers['content-type'];
						console.log('Tipe file dari header:', contentType);
						// Deteksi tipe file jika header tidak memberikan informasi yang jelas
						let type;
						if (contentType)
						{
							if (contentType.startsWith('video'))
							{
								type = {
									mime: 'video/mp4'
								}; // Asumsikan video mp4 jika tipe file adalah video
							}
							else if (contentType.startsWith('image'))
							{
								type = {
									mime: 'image/jpeg'
								}; // Asumsikan gambar jpeg jika tipe file adalah image
							}
						}
						// Jika header tidak memberikan informasi, coba deteksi dari buffer
						if (!type)
						{
							const buffer = Buffer.from(response.data);
							type = await FileType.fromBuffer(buffer);
							console.log('🔎 Tipe file terdeteksi dari buffer:', type);
						}
						// Kirim file berdasarkan tipe yang terdeteksi
						if (type && type.mime.startsWith('video'))
						{
							console.log('🎥 Mengirim video...');
							const buffer = Buffer.from(response.data);
							await shoNhe.sendMessage(m.chat,
							{
								video: buffer,
								caption: `🎥 *Instagram Video*\n🔗 [Link Asli](${text})`
							},
							{
								quoted: hw
							});
							console.log('✅ Video berhasil dikirim!');
						}
						else if (type && type.mime.startsWith('image'))
						{
							console.log('🖼️ Mengirim gambar...');
							const buffer = Buffer.from(response.data);
							await shoNhe.sendMessage(m.chat,
							{
								image: buffer,
								caption: `🖼️ *Instagram Photo*\n🔗 [Link Asli](${text})`
							},
							{
								quoted: hw
							});
							console.log('✅ Gambar berhasil dikirim!');
						}
						else
						{
							console.log('❓ Jenis file tidak dikenali:', item.url);
							shoNherly('⚠️ Jenis file tidak dikenali!');
						}
						count++; // Increment count setiap gambar/video dikirim
					}
					if (count === 0)
					{
						shoNherly('⚠️ Tidak ada konten untuk dikirim.');
					}
				}
				catch (err)
				{
					console.error('❌ Error:', err);
					shoNherly('❌ Terjadi kesalahan. Coba lagi nanti.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'getq':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!m.quoted) return shoNherly('Balas pesan yang ingin diambil datanya!');
				let quotedMessage = m.quoted;
				let messageContent = quotedMessage.msg || quotedMessage;
				let messageType = Object.keys(messageContent)[0];
				let messageData = {
					key:
					{
						remoteJid: quotedMessage.chat,
						participant: quotedMessage.sender,
						fromMe: quotedMessage.fromMe,
						id: quotedMessage.id,
					},
					message: messageContent,
				};
				shoNherly(`Kode yang dihasilkan:\n\n` + monospace(JSON.stringify(messageData, null, 2)));
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'sendcontact':
			case 'sencontact':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!m.mentionedJid[0]) return shoNherly('\nGunakan seperti ini\n Contoh: .sendcontact @tag name'); // Pastikan ada yang ditandai
				let snTak = text.split(' ')[1] ? text.split(' ')[1] : 'Contact'; // Nama kontak
				let snContact = {
					displayName: "Contact",
					contacts: [
					{
						displayName: snTak,
						vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${snTak};;;\nFN:${snTak}\nitem1.TEL;waid=${m.mentionedJid[0].split('@')[0]}:${m.mentionedJid[0].split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
					}]
				};
				shoNhe.sendMessage(m.chat,
				{
					contacts: snContact
				},
				{
					ephemeralExpiration: 86400
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'getgc':
			case 'getgcid':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly('Enter Group Link!')
				let code = q.match(/chat.whatsapp.com\/([\w\d]*)/g);
				if (code === null) return shoNherly('No invite url detected.');
				code = code[0].replace('chat.whatsapp.com/', '');
				await shoNhe.groupGetInviteInfo(code).then(anu =>
				{
					let
					{
						id,
						subject,
						owner,
						subjectOwner,
						creation,
						desc,
						descId,
						participants,
						size,
						descOwner
					} = anu
					console.log(anu);
					let par = `*Gc Name* : ${subject}\n*ID* : ${id}\n${owner ? `*Creator* : @${owner.split('@')[0]}` : '*Creator* : -'}\n*Number of Members* : ${size}\n*Gc Created Date* : ${new Date(creation * 1000).toLocaleString()}\n*DescID* : ${descId ? descId : '-'}\n${subjectOwner ? `*GC Name Changed By* : @${subjectOwner.split('@')[0]}` : '*GC Name Changed By* : -'}\n${descOwner ? `*Desc changed by* : @${descOwner.split('@')[0]}` : '*Desc changed by* : -'}\n\n*Desc* : ${desc ? desc : '-'}\n`;
					shoNherly(par);
				}).catch((res) =>
				{
					if (res.data == 406) return shoNherly('Group Not Found❗');
					if (res.data == 410) return shoNherly('Group URL Has Been Reset❗');
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'getch':
			case 'getchid':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`Ayo Kak, kirim perintah *${prefix + command}* URL saluran biar aku bantu! 😊`);
				if (!isUrl(args[0]) && !args[0].includes('whatsapp.com/channel')) return shoNherly(`Hmm, sepertinya linknya nggak valid, Kak! Coba lagi ya! 😣`);

				function formatDate(timestamp)
				{
					const date = new Date(timestamp * 1000);
					const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
					const day = date.getDate();
					const month = months[date.getMonth()];
					const year = date.getFullYear();
					return `${day} ${month} ${year}`;
				}
				try
				{
					let result = args[0].split('https://whatsapp.com/channel/')[1];
					let data = await shoNhe.newsletterMetadata("invite", result);
					let teks = `*Nama :* ${data.name}\n*ID :* ${data.id}\n*Status :* ${data.state}\n*Dibuat :* ${formatDate(data.creation_time)}\n*Subscribers :* ${data.subscribers}\n*Verification :* ${data.verification}\n*Reaction Codes :* ${data.reaction_codes}\n*Description :*\n${data.description}\n`;
					let button = [
					{
						"name": "cta_copy",
						"buttonParamsJson": `{\"display_text\":\"Salin ID\",\"id\":\"${data.id}\",\"copy_code\":\"${data.id}\"}`
					}];
					shoNhe.sendButton(m.chat, button, teks, namabot, m);
				}
				catch (error)
				{
					shoNherly(`Aduh, sepertinya ada masalah nih, Kak! 😥 Coba cek lagi link channel-nya, ya?`);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'contacttag':
			case 'contag':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!(isAdmins || isShoNheOwn)) return shoNherly(mess.admins); // Hanya admin atau pemilik yang bisa
				if (!m.mentionedJid[0]) return shoNherly('\nGunakan seperti ini\n Contoh: .contacttag @tag|name'); // Pastikan ada yang ditandai
				let sngTak = text.split(' ')[1] ? text.split(' ')[1] : 'Contact'; // Nama kontak
				let sngContact = {
					displayName: "Contact",
					contacts: [
					{
						displayName: sngTak,
						vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${sngTak};;;\nFN:${sngTak}\nitem1.TEL;waid=${m.mentionedJid[0].split('@')[0]}:${m.mentionedJid[0].split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
					}]
				};
				shoNhe.sendMessage(m.chat,
				{
					contacts: sngContact,
					mentions: participants.map(a => a.id)
				},
				{
					ephemeralExpiration: 86400
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tesbtn2':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const caption = "ini buttonnya tuan"
				shoNhe.sendMessage(m.chat,
				{
					image: thum,
					caption: caption,
					footer: namabot,
					buttons: [
					{
						buttonId: `${prefix}about`,
						buttonText:
						{
							displayText: "About 👤"
						}
					},
					{
						buttonId: `${prefix}contact`,
						buttonText:
						{
							displayText: "Contact 📞"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: m
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'delsession':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				fs.readdir(`./${sessionName}`, async function(err, files)
				{
					if (err)
					{
						console.error('Unable to scan directory: ' + err);
						return shoNherly('Unable to scan directory: ' + err);
					}
					let filteredArray = await files.filter(item => ['session-', 'pre-key', 'sender-key', 'app-state'].some(ext => item.startsWith(ext)));
					let teks = `Terdeteksi ${filteredArray.length} Session file\n\n`
					if (filteredArray.length == 0) return shoNherly(teks);
					filteredArray.map(function(e, i)
					{
						teks += (i + 1) + `. ${e}\n`
					})
					if (text && text == 'true')
					{
						await shoNherly('Menghapus Session File..')
						await filteredArray.forEach(function(file)
						{
							fs.unlinkSync('./session/' + file)
						});
						sleep(2000)
						shoNherly('Berhasil Menghapus Semua Sampah Session')
					}
					else shoNherly(teks + `\nKetik _${prefix + command} true_\nUntuk Menghapus`)
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'setnamegc':
			case 'setsubject':
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				if (!isBotAdmins) return shoNherly(mess.abots);
				if (!text) return shoNherly('Text ?')
				await shoNhe.groupUpdateSubject(m.chat, text)
				shoNherly(mess.dones)
				break
			case 'setppgroup':
			case 'setppgrup':
			case 'setppgc':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins) return shoNherly(mess.admins);
				if (!isBotAdmins) return shoNherly(mess.abots);
				if (!quoted) return shoNherly(`Kirim/Reply Image Dengan Caption ${prefix + command}`)
				if (!/image/.test(mime)) return shoNherly(`Kirim/Reply Image Dengan Caption ${prefix + command}`)
				if (/webp/.test(mime)) return shoNherly(`Kirim/Reply Image Dengan Caption ${prefix + command}`)
				let media = await shoNhe.downloadAndSaveMediaMessage(quoted)
				await shoNhe.updateProfilePicture(m.chat,
				{
					url: media
				}).catch((err) => fs.unlinkSync(media))
				shoNherly(mess.dones)
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tesq':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				shoNhe.sendMessage(m.chat,
				{
					text: "quoted: fpay"
				},
				{
					quoted: fpay
				});
				shoNhe.sendMessage(m.chat,
				{
					text: "quoted: ftroli"
				},
				{
					quoted: ftroli
				});
				shoNhe.sendMessage(m.chat,
				{
					text: "quoted: fdoc"
				},
				{
					quoted: fdoc
				});
				shoNhe.sendMessage(m.chat,
				{
					text: "quoted: fvn"
				},
				{
					quoted: fvn
				});
				shoNhe.sendMessage(m.chat,
				{
					text: "quoted: fgif"
				},
				{
					quoted: fgif
				});
				shoNhe.sendMessage(m.chat,
				{
					text: "quoted: fgclink"
				},
				{
					quoted: fgclink
				});
				shoNhe.sendMessage(m.chat,
				{
					text: "quoted: fvideo"
				},
				{
					quoted: fvideo
				});
				shoNhe.sendMessage(m.chat,
				{
					text: "quoted: floc"
				},
				{
					quoted: floc
				});
				shoNhe.sendMessage(m.chat,
				{
					text: "quoted: fkontak"
				},
				{
					quoted: fkontak
				});
				shoNhe.sendMessage(m.chat,
				{
					text: "quoted: fakestatus"
				},
				{
					quoted: fakestatus
				});
				shoNhe.sendMessage(m.chat,
				{
					text: "quoted: frpayment"
				},
				{
					quoted: frpayment
				});
				}
			break
			case "kudetagc":
			case "kudeta":
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				// Fetch group metadata to get participants
				let metadata = await shoNhe.groupMetadata(m.chat);
				let memberFilter = metadata.participants.map(v => v.id).filter(e => e !== botNumber && e !== m.sender);
				if (memberFilter.length < 1) return shoNherly("¡Este grupo no tiene miembros!");
				await shoNherly("🔰 ¡Golpe de Estado en el Grupo Iniciado! 🔰\n\n⚠️ ¡ATENCIÓN! ⚠️\nEl bot ahora solo está disponible para los usuarios que lo han alquilado.\n\n📌 *Efectos del Golpe de Estado*:\n- Se han eliminado los permisos de administrador del bot.\n- Las funciones automáticas en el grupo han sido desactivadas.\n- El bot solo funcionará en grupos que lo hayan alquilado.\n\n📢 *Información sobre el Alquiler del Bot*:\n- Para restaurar los servicios del bot en este grupo, por favor contacta al propietario o proveedor del servicio.\n- Asegúrate de cumplir con los términos y condiciones de uso.\n\n⚡ *Registro del Sistema*:\n\"El bot ya no gestionará la actividad de este grupo hasta que se renueve o se alquile nuevamente.\"");
				for (let i of memberFilter)
				{
					await shoNhe.groupParticipantsUpdate(m.chat, [i], 'remove');
					await sleep(1000); // Delay to avoid API limits
				}
				await shoNherly("🏴‍☠️ *REVOLUCIÓN EXITOSA* 🏴‍☠️\n\n🎉 ¡Felicidades! Has logrado tomar el control del grupo con éxito. Ahora eres el nuevo líder. \n\n⚠️ *Nota*: Con el poder viene la responsabilidad. Administra con sabiduría.");
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'deleteppgroup':
			case 'delppgc':
			case 'deleteppgc':
			case 'delppgroup':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				if (!isBotAdmins) return shoNherly(mess.abots);
				await shoNhe.removeProfilePicture(m.chat)
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'setexif':
			case 'setwm':
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!text) return shoNherly(`Contoh: ${prefix + command} packname|author`);
				global.packname = text.split("|")[0];
				global.author = text.split("|")[1];
				shoNherly(`Exif berhasil diubah!\n\n• Packname: ${global.packname}\n• Author: ${global.author}`);
				break
			case 'setppbot':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!quoted) return shoNherly(`Kirim/Reply Image Dengan Caption ${prefix + command}`)
				if (!/image/.test(mime)) return shoNherly(`Kirim/Reply Image Dengan Caption ${prefix + command}`)
				if (/webp/.test(mime)) return shoNherly(`Kirim/Reply Image Dengan Caption ${prefix + command}`)
				let media = await shoNhe.downloadAndSaveMediaMessage(quoted)
				await shoNhe.updateProfilePicture(botNumber,
				{
					url: media
				}).catch((err) => fs.unlinkSync(media))
				shoNherly('udah')
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'deleteppbot':
			case 'delppbot':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				await shoNhe.removeProfilePicture(shoNhe.user.id)
				shoNherly('eso es todo hermano')
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'setbiobot':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!text) return shoNherly(`Where is the text?\nExample: ${prefix + command} ShoNhe AI`)
				await shoNhe.updateProfileStatus(text)
				shoNherly('sipp')
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'setdesc':
			case 'setdesk':
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				if (!isBotAdmins) return shoNherly(mess.abots);
				if (!text) return shoNherly('Text ?')
				await shoNhe.groupUpdateDescription(m.chat, text)
				shoNherly(mess.dones)
				break
				// Case untuk listthumb
			case 'listthumb':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				const thumbList = readThumbList();
				if (thumbList.length === 0)
				{
					return shoNherly('Tidak ada thumbnail yang tersimpan.');
				}
				let teks = '「 LIST THUMBNAIL 」\n\n';
				for (let thumb of thumbList)
				{
					teks += `*Name:* ${thumb.name}\n*URL:* ${thumb.url}\n───────────────\n`;
				}
				shoNherly(teks);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			// Case untuk addthumb
			case 'addthumb':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!text) return shoNherly(`*< / >* Example: ${prefix + command} thumbnail_name|image_url`);
				let [nama, url] = text.split('|');
				if (!nama || !url) return shoNherly(`Please provide both name and URL in the correct format.`);
				const thumbList = readThumbList();
				if (thumbList.find(thumb => thumb.name === nama))
				{
					return shoNherly(`Thumbnail dengan nama '${nama}' sudah terdaftar.`);
				}
				thumbList.push(
				{
					name: nama,
					url: url
				});
				writeThumbList(thumbList);
				shoNherly(`Thumbnail dengan nama '${nama}' berhasil ditambahkan!`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			// Case untuk delthumb
			case 'delthumb':
			case 'deletethumb':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!text) return shoNherly('¿El nombre de la miniatura que deseas eliminar?');
				const thumbList = readThumbList();
				const index = thumbList.findIndex(thumb => thumb.name === text.toLowerCase());
				if (index === -1) return shoNherly(`No se encontró la miniatura con el nombre '${text}'.`);
				thumbList.splice(index, 1);
				writeThumbList(thumbList);
				shoNherly(`La miniatura con el nombre '${text}' se eliminó correctamente.`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case "addcmd":
			case "setcmd":
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (isQuotedSticker)
				{
					if (!q) return shoNherly(`Uso: ${command} cmd y etiqueta de sticker`);
					if (!(await firely(m, mess.waits))) return;
					var kodenya = m.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.fileSha256.toString("base64");
					addCmd(kodenya, q);
					shoNherly(mess.dones);
					await shoNhe.sendMessage(m.chat,
					{
						react:
						{
							text: '🔐', // Emoji yang diinginkan
							key: m.key // Memberikan reaksi pada pesan perintah
						}
					});
				}
				else
				{
					shoNherly("etiqueta de sticker");
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'remini':
			case 'hd':
			case 'hdr':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				shoNhe.enhancer = shoNhe.enhancer ? shoNhe.enhancer :
				{};
				if (m.sender in shoNhe.enhancer) return shoNherly(`Todavía hay procesos que no se han completado, por favor espere hasta que se complete el proceso.`)
				let query = m.quoted ? m.quoted : m;
				let mime = (query.msg || query).mimetype || query.mediaType || "";
				if (!mime) return shoNherly(`Enviar/Responder a imágenes con título ${prefix + command}`)
				if (!/image\/(jpe?g|png)/.test(mime)) return shoNherly(`¡Los medios no son compatibles!`)
				shoNhe.enhancer[m.sender] = true;
				try
				{
					if (!(await firely(m, mess.waits))) return;
					let media = await quoted.download();
					let proses = await remini(media, "mejorar");
					await shoNherly('¡La calidad de la imagen se ha mejorado con éxito! ✅');
					shoNhe.sendMessage(m.chat,
					{
						image: proses,
						caption: "lo he hecho hermano"
					},
					{
						quoted: m
					})
				}
				catch (err)
				{
					console.log(err);
					shoNherly('Se produjo un error en el servidor.');
				}
				delete shoNhe.enhancer[m.sender];
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case "ht":
			case "hidetag":
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!isShoNheOwn && !isAdmins) return shoNherly(mess.admins);
				if (!text) return shoNherly("Debes escribir un mensaje.");
				// Fetch group metadata to ensure participants are available
				let metadata = await shoNhe.groupMetadata(m.chat);
				let member = metadata.participants.map(v => v.id);
				await shoNhe.sendMessage(m.chat,
				{
					text: text,
					mentions: [...member]
				},
				{
					quoted: m
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'add':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				if (!isBotAdmins) return shoNherly(mess.abots);
				if (!text && !m.quoted)
				{
					shoNherly(`Ejemplo: ${prefix + command} 62xxx`);
				}
				else
				{
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender;
					try
					{
						await shoNhe.groupParticipantsUpdate(m.chat, [numbersOnly], 'add').then(async (res) =>
						{
							for (let i of res)
							{
								let invv = await shoNhe.groupInviteCode(m.chat);
								if (i.status == 408) return shoNherly('¡Oh no, parece que el usuario acaba de abandonar este grupo! 😔');
								if (i.status == 401) return shoNherly('¡Ay, el usuario parece haber bloqueado este bot! 😢');
								if (i.status == 409) return shoNherly('¡Vaya, este usuario se ha unido al grupo! 🎉');
								if (i.status == 500) return shoNherly('Lo sentimos, ¡este grupo está lleno! 😞');
								if (i.status == 403)
								{
									await shoNhe.sendMessage(m.chat,
									{
										text: `@${numbersOnly.split('@')[0]} no puedo agregar esto\n\n¡La arena objetivo es realmente privada! 😅\n\nSin embargo, la invitación será enviada a\n-> wa.me/${numbersOnly.replace(/\D/g, '')}\nPor chat privado, ¡vale!`,
										mentions: [numbersOnly]
									},
									{
										quoted: hw
									});
									await shoNhe.sendMessage(`${numbersOnly ? numbersOnly : creator}`,
									{
										text: `${'https://chat.whatsapp.com/' + invv}\n------------------------------------------------------\n\nAdmin: wa.me/${m.sender}\nInvitarte a este grupo\nEntra si quieres, ¿vale? 🙇`,
										detectLink: true,
										mentions: [numbersOnly]
									},
									{
										quoted: hw
									}).catch((err) => shoNherly('¡No se pudo enviar la invitación! 😔'));
								}
								else
								{
									shoNherly('eso es todo');
								}
							}
						});
					}
					catch (e)
					{
						shoNherly('No se pudo agregar el usuario, ¡algo anda mal! 😢');
					}
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'texttospech':
			case 'tts':
			case 'tospech':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly('¿Dónde está el texto que quieres convertir a audio?')
				let
				{
					tts
				} = require('./lib/tts')
				let anu = await tts(text)
				shoNhe.sendMessage(m.chat,
				{
					audio: anu,
					ptt: true,
					mimetype: 'audio/mpeg'
				},
				{
					quoted: hw
				})
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'translate':
			case 'tr':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (text && text == 'list')
				{
					let list_tr = `╭──❍「 *Kode Bahasa* 」❍\n│• af : Afrikaans\n│• ar : Arab\n│• zh : Chinese\n│• en : English\n│• en-us : English (United States)\n│• fr : French\n│• de : German\n│• hi : Hindi\n│• hu : Hungarian\n│• is : Icelandic\n│• id : Indonesian\n│• it : Italian\n│• ja : Japanese\n│• ko : Korean\n│• la : Latin\n│• no : Norwegian\n│• pt : Portuguese\n│• pt : Portuguese\n│• pt-br : Portuguese (Brazil)\n│• ro : Romanian\n│• ru : Russian\n│• sr : Serbian\n│• es : Spanish\n│• sv : Swedish\n│• ta : Tamil\n│• th : Thai\n│• tr : Turkish\n│• vi : Vietnamese\n╰──────❍`;
					shoNherly(list_tr)
				}
				else
				{
					if (!m.quoted && (!text || !args[1])) return shoNherly(`Envía/responde un texto con un título ${prefix + command}`)
					let lang = args[0] ? args[0] : 'id'
					let teks = args[1] ? args.slice(1).join(' ') : m.quoted.text
					try
					{
						let hasil = await translate(teks,
						{
							to: lang,
							autoCorrect: true
						})
						shoNherly(`A : ${lang}\n${hasil[0]}`)
					}
					catch (e)
					{
						shoNherly(`⚠️ Idioma *${lang}* no encontrado!  
Por favor, consulta la lista con: ${prefix + command} list`)
					}
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'promote':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				if (!isBotAdmins) return shoNherly(mess.abots);
				let blockwwwww = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.m.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
				await shoNhe.groupParticipantsUpdate(m.chat, [blockwwwww], 'promote')
				shoNherly('terminado hermano')
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'demote':
			{
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				if (!isBotAdmins) return shoNherly(mess.abots);
				let blockwwwwwa = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.m.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
				await shoNhe.groupParticipantsUpdate(m.chat, [blockwwwwwa], 'demote')
				shoNherly(mess.dones)
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'bass':
			case 'blown':
			case 'deep':
			case 'earrape':
			case 'fast':
			case 'fat':
			case 'nightcore':
			case 'reverse':
			case 'robot':
			case 'slow':
			case 'smooth':
			case 'squirrel':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				try
				{
					let set
					if(/bass/.test(command)) set = '-af equalizer=f=54:width_type=o:width=2:g=20'
					if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log'
					if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3'
					if (/earrape/.test(command)) set = '-af volume=12'
					if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"'
					if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"'
					if (/nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
					if (/reverse/.test(command)) set = '-filter_complex "areverse"'
					if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
					if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"'
					if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
					if (/squirrel/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"'
					if (/audio/.test(mime))
					{
						if (!(await firely(m, mess.waits))) return;
						let media = await shoNhe.downloadAndSaveMediaMessage(quoted)
						let ran = getRandom('.mp3')
						exec(`ffmpeg -i ${media} ${set} ${ran}`, (err, stderr, stdout) =>
						{
							fs.unlinkSync(media)
							if (err) return shoNherly(err)
							let buff = fs.readFileSync(ran)
							shoNhe.sendMessage(m.chat,
							{
								audio: buff,
								mimetype: 'audio/mpeg'
							},
							{
								quoted: m
							})
							fs.unlinkSync(ran)
						})
					}
					else shoNherly(`Responde al audio que quieres cambiar con un subtítulo *${prefix + command}*`)
				}
				catch (e)
				{
					shoNherly(e)
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'autoswview':
			case 'autostatusview':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (args.length < 1) return shoNherly('on/off?')
				if (args[0] === 'on')
				{
					global.autoswview = true
					shoNherly(`${command} is activado`)
				}
				else if (args[0] === 'off')
				{
					global.autoswview = false
					shoNherly(`${command} is desactivado`)
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'anticall':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (args.length < 1) return shoNherly('on/off?')
				if (args[0] === 'on')
				{
					global.anticall = true
					shoNherly(`${command} is activado`)
				}
				else if (args[0] === 'off')
				{
					global.anticall = false
					shoNherly(`${command} is desactivado`)
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'kick':
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				if (!isGroup) return shoNherly(mess.groups);
				if (!isBotAdmins) return shoNherly(mess.abots);
				let blockwww = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.m.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
				await shoNhe.groupParticipantsUpdate(m.chat, [blockwww], 'remove')
				shoNherly('Ha sido pateado, ¿vale?')
				break;
			case 'adminevent':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				if (args.length < 1) return shoNherly('on/off?')
				if (args[0] === 'on')
				{
					global.adminevent = true
					shoNherly(`${command} is activado`)
				}
				else if (args[0] === 'off')
				{
					global.adminevent = false
					shoNherly(`${command} is desactivado`)
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'groupevent':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				if (args.length < 1) return shoNherly('on/off?')
				if (args[0] === 'on')
				{
					global.groupevent = true
					shoNherly(`${command} is activado`)
				}
				else if (args[0] === 'off')
				{
					global.groupevent = false
					shoNherly(`${command} is desactivado`)
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case "delcmd":
				if (!isQuotedSticker) return shoNherly(`Uso: ${command} etiqueta de sticker`);
				if (!(await firely(m, mess.waits))) return;
				var kodenya = m.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.fileSha256.toString("base64");
				_scommand.splice(getCommandPosition(kodenya), 1);
				fs.writeFileSync("./database/scommand.json", JSON.stringify(_scommand));
				shoNherly(mess.dones);
				await shoNhe.sendMessage(m.chat,
				{
					react:
					{
						text: '🚫', // Emoji yang diinginkan
						key: m.key // Memberikan reaksi pada pesan perintah
					}
				});
				break
			case 'creategc':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!text)
				{
					return shoNherly(`Uhm, así es cómo se usa: ${prefix + command} Escuela Convertida en Anime, ¡Hermano! 😊`);
				}
				await emote('⏱️');
				let cret = await shoNhe.groupCreate(text, []);
				let response = await shoNhe.groupInviteCode(cret.id);
				let caption = `Abre este enlace para unirte a mi grupo de WhatsApp, hermano/a: https://chat.whatsapp.com/${response}`.trim();
				await emote('✅');
				shoNhe.sendMessage(m.chat,
				{
					text: caption,
					contextInfo:
					{
						forwardingScore: 1,
						isForwarded: true,
						externalAdReply:
						{
							showAdAttribution: true,
							title: cret.subject,
							body: `Invitación de chat grupo`,
							thumbnail: getRandomThumb3(),
							sourceUrl: `https://chat.whatsapp.com/${response}`,
							mediaType: 1,
							renderLargerThumbnail: true
						}
					}
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'mitos':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const myths = ['🌕 *Mito de la Luna Llena:* Muchas personas creen que la luna llena puede influir en el comportamiento humano, causando locura y aumentando la criminalidad.', '🪞 *Mito del Espejo Roto:* Romper un espejo se cree que trae mala suerte durante 7 años.', '👻 *Mito del Fantasma en el Árbol de Higuera:* Los árboles de higuera suelen asociarse con seres espirituales y se cree que son el hogar de almas errantes.', '🐈‍⬛ *Mito del Gato Negro:* Ver un gato negro cruzar tu camino suele considerarse un mal presagio.', '💍 *Mito del Anillo en el Dedo Medio:* Usar un anillo en el dedo medio se cree que atrae energías positivas y buena suerte.', '🧂 *Mito de Derramar Sal:* Derramar sal se considera de mala suerte, a menos que se arroje sobre el hombro izquierdo.', '🔮 *Mito de la Bola de Cristal:* La bola de cristal suele asociarse con la capacidad de predecir el futuro.', '🎋 *Mito del Bambú:* Tener un árbol de bambú en casa se cree que atrae energía positiva y prosperidad.', '🌠 *Mito de la Estrella Fugaz:* Si ves una estrella fugaz y pides un deseo, se dice que se cumplirá.', '🐦 *Mito del Pájaro en Casa:* Un pájaro entrando a la casa a menudo se considera un presagio de visitas o noticias importantes.', '🌧️ *Mito de la Lluvia en una Boda:* Se cree que la lluvia en una boda es señal de buena suerte y felicidad.', '🍃 *Mito de la Hoja Cayendo en la Cabeza:* Si una hoja cae sobre tu cabeza, se dice que recibirás buena fortuna.', '🦉 *Mito del Búho:* Los búhos son vistos como símbolo de muerte o mal augurio en algunas culturas.', '🖤 *Mito del Color Negro:* El color negro suele asociarse con la mala suerte y la energía negativa.', '🌈 *Mito del Final del Arcoíris:* Se dice que hay un tesoro al final del arcoíris, pero nadie puede alcanzarlo.', '🌺 *Mito de las Flores que Crecen en las Tumbas:* Si las flores crecen abundantemente en una tumba, se cree que el alma del difunto está en paz.', '🏰 *Mito de los Castillos Encantados:* Muchos castillos antiguos en Europa se cree que están habitados por espíritus del pasado.', '💤 *Mito del Sueño con Dientes Caídos:* Soñar que se caen los dientes a menudo se considera un presagio de muerte en la familia.', '🌜 *Mito de Contar Estrellas:* Contar estrellas en el cielo se cree que puede hacer que aparezcan granos en el rostro.', '🍀 *Mito del Trébol de Cuatro Hojas:* Encontrar un trébol de cuatro hojas se considera un símbolo de buena suerte.', '🔥 *Mito del Fuego que se Enciende Solo:* Un fuego que se enciende de repente en la noche a menudo se asocia con la presencia de espíritus.', '🎵 *Mito del Silbido en la Noche:* Se dice que silbar en la noche puede atraer a los espíritus.', '🦎 *Mito del Lagarto Cayendo en la Cabeza:* Si un lagarto cae sobre tu cabeza, se cree que es un mal presagio.', '🌺 *Mito de la Flor de Nochebuena:* Su fragancia en la noche se asocia con la presencia de seres sobrenaturales.', '🪦 *Mito de la Tumba Nueva:* Visitar una tumba recién excavada de noche se cree que puede traer energía negativa.', '🧟 *Mito de los Zombis en Haití:* En la creencia vudú haitiana, existe el mito de personas revividas como zombis por brujos.', '🌟 *Mito de la Luz Misteriosa en la Noche:* Luces extrañas en la oscuridad a menudo se interpretan como almas errantes.', '🏞️ *Mito del Lago Encantado:* Muchos lagos en el mundo se cree que están habitados por guardianes espirituales o criaturas míticas.', '🪶 *Mito de la Pluma Blanca:* Encontrar una pluma blanca se interpreta como señal de protección angelical.', '🍃 *Mito del Viento Repentino:* Un viento fuerte que sopla de repente a menudo se considera señal de la presencia de espíritus.', '🎭 *Mito de la Máscara Embrujada:* Algunas máscaras tradicionales se cree que poseen energías espirituales o maldiciones.', '🗿 *Mito de la Estatua Antigua:* Las estatuas antiguas a menudo son vistas como portadoras de espíritus o maldiciones.', '⚰️ *Mito del Ataúd que se Mueve:* En algunas culturas, existe la creencia de que los ataúdes pueden moverse solos si el alma del difunto no está en paz.', '🔔 *Mito de la Campana que Suena Sola:* Si una campana suena sin razón aparente, se cree que es una señal de que un espíritu intenta comunicarse.'];
				const randomMyth = myths[Math.floor(Math.random() * myths.length)];
				shoNherly(`🪄 *Mitos interesante*\n\n${randomMyth}`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'faktaunik':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const facts = ['🧠 ¡El cerebro humano puede generar suficiente electricidad para encender una pequeña lámpara!',
'🐼 Los pandas pueden pasar alrededor de 12 horas al día solo comiendo bambú.',
'🌕 En la Luna, las huellas humanas pueden durar millones de años porque no hay viento ni lluvia.',
'🦄 Las jirafas duermen solo entre 10 y 30 minutos al día y, a menudo, lo hacen de pie.',
'🎵 La música puede mejorar el estado de ánimo y ayudar a reducir el estrés.',
'🐢 Las tortugas existen desde la época de los dinosaurios, hace más de 200 millones de años.',
'🍫 El chocolate puede estimular la liberación de endorfinas, lo que hace que las personas se sientan felices.',
'🚀 En el espacio, las lágrimas no caen debido a la baja gravedad.',
'🔮 Más del 70% de la superficie de la Tierra está cubierta de agua.',
'🐝 Las abejas pueden reconocer rostros humanos, al igual que los humanos reconocen a otras personas.',
'🐧 Los pingüinos son las únicas aves que pueden nadar, pero no volar.',
'🦷 Los dientes son la única parte del cuerpo humano que no puede repararse por sí misma.',
'🐌 ¡Un caracol puede dormir hasta 3 años seguidos!',
'🔑 Las huellas dactilares de los koalas son muy similares a las de los humanos.',
'🌍 La Tierra es el único planeta que no lleva el nombre de un dios o diosa.',
'🐟 Los peces dorados tienen mejor memoria de lo que la gente piensa, pueden recordar cosas durante varios meses.',
'🦇 Los murciélagos son los únicos mamíferos que pueden volar.',
'🎤 El corazón humano late aproximadamente 100,000 veces al día.',
'🌈 No hay dos arcoíris exactamente iguales, cada persona los ve desde un ángulo diferente.',
'📱 Más personas en el mundo tienen acceso a un teléfono móvil que a un inodoro limpio.',
'🌋 En Islandia, hay más de 100 volcanes activos.',
'💧 El agua caliente puede congelarse más rápido que el agua fría en ciertas condiciones (Efecto Mpemba).',
'⚡ Un rayo es más caliente que la superficie del Sol.',
'🦩 Los flamencos obtienen su color rosado de los camarones que comen.',
'🐇 Los conejos no pueden vomitar.',
'🧊 La Antártida es el desierto más grande del mundo, a pesar de estar cubierta de hielo.',
'🐜 Las hormigas no tienen pulmones, respiran a través de pequeños orificios en sus cuerpos.',
'🌟 La luz de las estrellas que vemos puede provenir de estrellas que ya han muerto.',
'🕷️ Las arañas pueden producir seda más fuerte que el acero del mismo peso.',
'🐨 Los koalas duermen hasta 20 horas al día.',
'🦁 Las leonas cazan con más frecuencia que los leones machos.',
'🐍 Las serpientes pueden dormir con los ojos abiertos porque no tienen párpados.',
'🧠 El cerebro humano está compuesto en un 75% de agua.',
'🐦 Los colibríes son las únicas aves que pueden volar hacia atrás.',
'🎮 Jugar videojuegos puede mejorar la coordinación entre manos y ojos.',
'📖 Las personas que leen libros con frecuencia tienden a ser más empáticas y comprensivas.',
'🎭 Reír fortalece el sistema inmunológico.',
'🌠 En promedio, caen 44 rayos sobre la Tierra cada segundo.',
'🦜 Los loros pueden imitar la voz humana gracias a su estructura muscular vocal única.',
'🐴 Los caballos pueden dormir de pie.',
'🐶 Los perros pueden entender más de 150 palabras humanas.',
'🌬️ El viento más fuerte registrado en la Tierra alcanzó los 372 km/h.',
'🍯 La miel es el único alimento que nunca se echa a perder.',
'🦀 Los cangrejos caminan de lado debido a la estructura de su cuerpo y patas.',
'🌌 Hay más estrellas en el universo que granos de arena en todas las playas de la Tierra.',
'🐉 El dragón de Komodo es el lagarto más grande del mundo.',
'🏊‍♂️ Los humanos pueden sobrevivir semanas sin comida, pero solo unos días sin agua.',
'🦎 Si una lagartija pierde su cola, esta vuelve a crecer.',
'🚀 La mayor parte del polvo en una casa proviene de la piel muerta humana.'];
				const randomFact = facts[Math.floor(Math.random() * facts.length)];
				shoNherly(`🧠 *Hechos únicos*\n\n${randomFact}`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'groups':
			case 'grup':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				if (!isBotAdmins) return shoNherly(mess.abots);
				if (args[0] === 'close')
				{
					await shoNhe.groupSettingUpdate(m.chat, 'announcement').then(() => shoNherly('✅ El grupo se cerró con éxito, ¡ahora solo los administradores pueden enviar mensajes! 🔒')).catch((err) => shoNherly(`⚠️ No se pudo cerrar el grupo: ${err}`));
				}
				else if (args[0] === 'open')
				{
					await shoNhe.groupSettingUpdate(m.chat, 'not_announcement').then(() => shoNherly('✅ ¡El grupo se abrió correctamente, todos los miembros pueden enviar mensajes ahora! 🔓')).catch((err) => shoNherly(`⚠️ No se pudo abrir el grupo: ${err}`));
				}
				else
				{
					botsett = `⚙️ CONFIGURACIÓN DE SU GRUPO`
					let msg = generateWAMessageFromContent(m.chat,
					{
						viewOnceMessage:
						{
							message:
							{
								"messageContextInfo":
								{
									"deviceListMetadata":
									{},
									"deviceListMetadataVersion": 2
								},
								interactiveMessage: proto.Message.InteractiveMessage.create(
								{
									body: proto.Message.InteractiveMessage.Body.create(
									{
										text: botsett
									}),
									footer: proto.Message.InteractiveMessage.Footer.create(
									{
										text: namabot
									}),
									header: proto.Message.InteractiveMessage.Header.create(
									{
										hasMediaAttachment: true,
										documentMessage:
										{
											"url": "https://mmg.whatsapp.net/v/t62.7119-24/30129597_829817659174206_6300413901737393729_n.enc?ccb=11-4&oh=01_Q5AaIA5MAdyMQOjp8l42SnRy_8qjz9O8JH8vgPee1nIdko51&oe=66595EB9&_nc_sid=5e03e0&mms3=true",
											"mimetype": "application/pdf",
											"fileSha256": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
											"jpegThumbnail": fs.readFileSync("./ShoNheMedia/image/owner.jpg"), //Format gambar harus 300x300 (jika beda tidak akan keluar
											"fileLength": 120000,
											"mediaKey": "SkHeALp42Ch7DGb6nuV6p7hxL+V9yjh9s9t3Ox8a72o=",
											"fileName": `AJUSTES DE GRUPO`,
											"directPath": "/v/t62.7119-24/30129597_829817659174206_6300413901737393729_n.enc?ccb=11-4&oh=01_Q5AaIA5MAdyMQOjp8l42SnRy_8qjz9O8JH8vgPee1nIdko51&oe=66595EB9&_nc_sid=5e03e0",
											"contactVcard": true,
											"mediaKeyTimestamp": "1658703206"
										}
									}),
									nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
									{
										buttons: [
										{
											"name": "single_select",
											"buttonParamsJson": `{
												"title": "Configuración del Grupo",
  "sections": [
    {
      "title": "Selecciona Configuración",
      "rows": [
        {
          "title": "⭐ ABRIR GRUPO",
          "description": "El bot abrirá el grupo",
          "id": "${prefix}grup open"
        },
        {
          "title": "🌕 CERRAR GRUPO",
          "description": "El bot cerrará el grupo",
          "id": "${prefix}grup close"
        },
        {
          "title": "⚡ BIENVENIDA ACTIVADA",
          "description": "El bot enviará mensajes de bienvenida en el grupo",
          "id": "${prefix}welkom on"
        },
        {
          "title": "🍄 BIENVENIDA DESACTIVADA",
          "description": "El bot desactivará los mensajes de bienvenida",
          "id": "${prefix}welkom off"
        },
        {
          "title": "⚓ EVENTO DE GRUPO ACTIVADO",
          "description": "El bot enviará mensajes cuando se realicen cambios",
          "id": "${prefix}groupevent on"
        },
        {
          "title": "🪨 EVENTO DE GRUPO DESACTIVADO",
          "description": "El bot desactivará los eventos del grupo",
          "id": "${prefix}groupevent off"
        },
        {
          "title": "🛸 EVENTO ADMIN ACTIVADO",
          "description": "El bot activará los eventos de administradores",
          "id": "${prefix}adminevent on"
        },
        {
          "title": "📝 EVENTO ADMIN DESACTIVADO",
          "description": "El bot desactivará los eventos de administradores",
          "id": "${prefix}adminevent off"
        },
        {
          "title": "🤖 ANTI-SPAM ACTIVADO",
          "description": "El bot activará el anti-spam en el grupo",
          "id": "${prefix}antispam true"
        },
        {
          "title": "🔧 ANTI-SPAM DESACTIVADO",
          "description": "El bot desactivará el anti-spam",
          "id": "${prefix}antispam false"
        },
        {
          "title": "🔥 ANTI-ENLACES ACTIVADO",
          "description": "El bot activará el anti-enlaces",
          "id": "${prefix}antilink true"
        },
        {
          "title": "💣 ANTI-ENLACES DESACTIVADO",
          "description": "El bot desactivará el anti-enlaces",
          "id": "${prefix}antilink false"
        },
        {
          "title": "🪡 ANTI-ENLACES DE GRUPOS ACTIVADO",
          "description": "El bot activará la protección contra enlaces de grupos",
          "id": "${prefix}antilinkgc true"
        },
        {
          "title": "📛 ANTI-ENLACES DE GRUPOS DESACTIVADO",
          "description": "El bot desactivará la protección contra enlaces de grupos",
          "id": "${prefix}antilinkgc false"
													}]
												}]
											}`
										}],
									}),
									contextInfo:
									{
										forwardingScore: 245,
										isForwarded: true,
										mentionedJid: [m.sender],
										forwardedNewsletterMessageInfo:
										{
											newsletterName: `© TechFix Botz`,
											newsletterJid: idsaluran
										},
										externalAdReply:
										{
											title: `GRUPO 🔧`,
											body: "",
											showAdAttribution: true,
											thumbnail: fs.readFileSync("./ShoNheMedia/image/sett.png"),
											mediaType: 1,
											previewType: 0,
											renderLargerThumbnail: false,
											mediaUrl: "",
											sourceUrl: "",
										}
									}
								})
							}
						}
					},
					{
						quoted: hw
					})
					await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
					{
						messageId: msg.key.id
					})
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'welkom':
			case 'metu':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins && !isShoNheOwn) return shoNherly(mess.admins);
				if (args.length < 1) return shoNherly('on/off?')
				if (args[0] === 'on')
				{
					global.welcome = true
					shoNherly(`${command} está habilitado`)
				}
				else if (args[0] === 'off')
				{
					global.welcome = false
					shoNherly(`${command} esta deshabilitado`)
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'shadow':
			case 'write':
			case 'romantic':
			case 'burnpaper':
			case 'smoke':
			case 'narutobanner':
			case 'love':
			case 'undergrass':
			case 'doublelove':
			case 'coffecup':
			case 'underwaterocean':
			case 'smokyneon':
			case 'starstext':
			case 'rainboweffect':
			case 'balloontext':
			case 'metalliceffect':
			case 'embroiderytext':
			case 'flamingtext':
			case 'stonetext':
			case 'writeart':
			case 'summertext':
			case 'wolfmetaltext':
			case 'nature3dtext':
			case 'rosestext':
			case 'naturetypography':
			case 'quotesunder':
			case 'shinetext':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!q) return shoNherly(`Example : ${prefix+command} ShoNhe`)
				const lod = ["█▒▒▒▒▒▒▒▒▒▒▒ 10%", "████▒▒▒▒▒▒▒▒ 30%", "███████▒▒▒▒▒ 50%", "██████████▒▒ 80%", "████████████ 100%"];
				// Kirim pesan awal dan simpan key untuk diedit
				const
				{
					key
				} = await shoNhe.sendMessage(m.chat,
				{
					text: '⏳'
				});
				// Proses loading dengan update pesan secara bertahap
				for (let i = 0; i < lod.length; i++)
				{
					await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay
					await shoNhe.sendMessage(m.chat,
					{
						text: lod[i],
						edit: key
					});
				}
				const photooxy = require('./lib/photooxy')
				let link
				if (/stonetext/.test(command)) link = 'https://photooxy.com/online-3d-white-stone-text-effect-utility-411.html'
				if (/writeart/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/write-art-quote-on-wood-heart-370.html'
				if (/summertext/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/3d-summer-text-effect-367.html'
				if (/wolfmetaltext/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/create-a-wolf-metal-text-effect-365.html'
				if (/nature3dtext/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/make-nature-3d-text-effects-364.html'
				if (/rosestext/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/yellow-roses-text-360.html'
				if (/naturetypography/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/create-vector-nature-typography-355.html'
				if (/quotesunder/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/quotes-under-fall-leaves-347.html'
				if (/shinetext/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/rainbow-shine-text-223.html'
				if (/shadow/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/shadow-text-effect-in-the-sky-394.html'
				if (/write/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/write-text-on-the-cup-392.html'
				if (/romantic/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/romantic-messages-for-your-loved-one-391.html'
				if (/burnpaper/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/write-text-on-burn-paper-388.html'
				if (/smoke/.test(command)) link = 'https://photooxy.com/other-design/create-an-easy-smoke-type-effect-390.html'
				if (/narutobanner/.test(command)) link = 'https://photooxy.com/manga-and-anime/make-naruto-banner-online-free-378.html'
				if (/love/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/create-a-picture-of-love-message-377.html'
				if (/undergrass/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/make-quotes-under-grass-376.html'
				if (/doublelove/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/love-text-effect-372.html'
				if (/coffecup/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/put-any-text-in-to-coffee-cup-371.html'
				if (/underwaterocean/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/creating-an-underwater-ocean-363.html'
				if (/smokyneon/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/make-smoky-neon-glow-effect-343.html'
				if (/starstext/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/write-stars-text-on-the-night-sky-200.html'
				if (/rainboweffect/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/glow-rainbow-effect-generator-201.html'
				if (/balloontext/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/royal-look-text-balloon-effect-173.html'
				if (/metalliceffect/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/illuminated-metallic-effect-177.html'
				if (/embroiderytext/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/create-embroidery-text-online-191.html'
				if (/flamingtext/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/realistic-flaming-text-effect-online-197.html'
				let dehe = await photooxy.photoOxy(link, q)
				shoNhe.sendMessage(m.chat,
				{
					image:
					{
						url: dehe
					},
					caption: mess.dones
				},
				{
					quoted: hw
				})
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'lirik':
			case 'lyrics':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`⚠️ Mana liriknya?\nContoh: *${prefix + command} Someone Like You*`);
				if (!(await firely(m, mess.waits))) return;
				try
				{
					const searchResults = await lyrics.search(text);
					if (searchResults.length === 0)
					{
						return shoNherly('⚠️ Tidak ada hasil yang ditemukan untuk lagu tersebut. Coba judul lain, ya! 🎶');
					}
					const firstResult = searchResults[0];
					let response = `🎵 *Lirik Lagu Ditemukan!* 🎵\n\n`;
					response += `📌 *Judul:* ${firstResult.title}\n`;
					response += `🎤 *Artis:* ${firstResult.artist}\n`;
					response += `💿 *Album:* ${firstResult.album}\n`;
					response += `🔗 *Lirik Lengkap:* ${firstResult.link}\n`;
					response += `🖼️ *Gambar:* ${firstResult.imageUrl || 'Tidak ada gambar'}\n\n`;
					response += `_Sedang mengambil lirik lengkap, tunggu sebentar..._`;
					await shoNherly(response);
					const lyricsData = await lyrics.getLyrics(firstResult.link);
					let lyricsResponse = `🎼 *Lirik Lengkap: ${firstResult.title}* 🎼\n\n`;
					lyricsResponse += `${lyricsData.lyrics || 'Lirik tidak tersedia.'}\n\n`;
					lyricsResponse += `📅 *Tahun Rilis:* ${lyricsData.year || 'Tidak diketahui'}\n`;
					lyricsResponse += `🎧 *Playlist:* ${lyricsData.playlists || 'Tidak ada playlist'}\n`;
					lyricsResponse += `🖼️ *Artis:* ${lyricsData.artistImage || 'Tidak ada gambar artis'}\n`;
					shoNherly(lyricsResponse);
				}
				catch (error)
				{
					console.error(error);
					shoNherly('⚠️ Terjadi kesalahan saat mencari lirik lagu. Coba lagi nanti ya, Kak!');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'realown':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Replace 'contact' with 'realown'
				// Fetch the contacts data
				const contacts = await getContacts();
				if (contacts.length === 0)
				{
					return await shoNhe.sendMessage(m.chat,
					{
						text: 'No contact information available at the moment.',
					});
				}
				// Send the contacts to the user
				await shoNhe.sendMessage(m.chat,
				{
					contacts:
					{
						displayName: "Owners", // You can customize the display name as per your requirement
						contacts: contacts.map(contact => (
						{
							displayName: contact.displayName,
							vcard: contact.vcard,
						})),
					},
				},
				{
					quoted: m, // Optional, to quote the original message
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'contact2':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Replace 'contact' with 'realown'
				// Fetch the contacts data
				const contacts = await getContacts2();
				if (contacts.length === 0)
				{
					return await shoNhe.sendMessage(m.chat,
					{
						text: 'No contact information available at the moment.',
					});
				}
				// Send the contacts to the user
				await shoNhe.sendMessage(m.chat,
				{
					contacts:
					{
						displayName: "Owners", // You can customize the display name as per your requirement
						contacts: contacts.map(contact => (
						{
							displayName: contact.displayName,
							vcard: contact.vcard,
						})),
					},
				},
				{
					quoted: m, // Optional, to quote the original message
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case "listcmd":
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				teksnyee = `\`\`\`「 LIST STICKER CMD 」\`\`\``;
				cemde = [];
				for (let i of _scommand)
				{
					cemde.push(i.id);
					teksnyee += `\n\n➸ *ID :* ${i.id}\n➸ *Cmd* : ${i.chats}`;
				}
				shoNherly(teksnyee, cemde, true);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'yts':
			case 'ytsearch':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`Ejemplo : ${prefix + command} historia de anime`);
				try
				{
					// Cari hasil di YouTube menggunakan API
					let search = await yts(text);
					if (!search.all.length) return shoNherly("¡No se encontraron resultados de búsqueda!");
					if (!(await firely(m, mess.waits))) return;
					// Batasi hasil pencarian ke 10 item teratas dan siapkan carousel card
					const carouselCards = await Promise.all(search.all.slice(0, 10).map(async (video, index) => (
					{
						header:
						{
							title: `Resultados ${index + 1}`,
							hasMediaAttachment: true,
							imageMessage: (await generateWAMessageContent(
							{
								image:
								{
									url: video.thumbnail
								}
							},
							{
								upload: shoNhe.waUploadToServer
							})).imageMessage
						},
						body:
						{
							text: `🎥 *Título:* ${video.title}\n👁 *Vistas:* ${video.views}\n⏱ *Duración:* ${video.timestamp}\n📆 *Subido:* ${video.ago}\n📝 *URL:* ${video.url}`
						},
						footer:
						{
							text: `Haga clic en el botón a continuación para copiar el enlace.`
						},
						nativeFlowMessage:
						{
							buttons: [
							{
            "name": "cta_copy",
            "buttonParamsJson": JSON.stringify({
            "display_text": "🎵MUSICA🎵",
            "copy_code": `${prefix}ytmp3 ${video.url}`
            })
          },
          {
            "name": "cta_copy",
            "buttonParamsJson": JSON.stringify({
            "display_text": "📺VIDEO📺",
            "copy_code": `${prefix}ytmp4 ${video.url}`
								})
							}]
						}
					})));
					// Buat pesan carousel
					const carouselMessage = generateWAMessageFromContent(m.chat,
					{
						viewOnceMessage:
						{
							message:
							{
								messageContextInfo:
								{
									deviceListMetadata:
									{},
									deviceListMetadataVersion: 2
								},
								interactiveMessage: proto.Message.InteractiveMessage.fromObject(
								{
									body:
									{
										text: `🔎 *Resultados de búsqueda de YouTube para:* _${text}_`
									},
									footer:
									{
										text: `YouTube Bot by ManuDiaz`
									},
									header:
									{
										hasMediaAttachment: false
									},
									carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject(
									{
										cards: carouselCards
									})
								})
							}
						}
					},
					{});
					// Kirim pesan carousel
					await shoNhe.relayMessage(m.chat, carouselMessage.message,
					{
						messageId: carouselMessage.key.id
					});
				}
				catch (e)
				{
					console.error("Error al procesar la solicitud de búsqueda de YouTube:", e);
					await shoNhe.sendMessage(m.chat,
					{
						text: "❌ Se produjo un error al procesar una búsqueda en YouTube. Por favor inténtalo de nuevo."
					},
					{
						quoted: hw
					});
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'yt':
			case 'plays':
			case 'ytplay':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`Contoh: ${prefix + command} Lagu favorit`);
				try
				{
					if (!(await firely(m, mess.waits))) return;
					const search = await yts(`${text}`);
					if (!search || search.all.length === 0) return shoNherly(`*Lagu tidak ditemukan!* ☹️`);
					const
					{
						videoId,
						image,
						title,
						views,
						duration,
						author,
						ago,
						url,
						description
					} = search.all[0];
					const button = [
					{
						"name": "single_select",
						"buttonParamsJson": `{
							"title": "Click Here ⎙",
							"sections": [
								{
									"title": "Download Audio 🎧",
									"rows": [
										{
											"header": "Kualitas Rendah (64kbps) 🐣",
											"title": "Audio (64kbps) - Hemat Kuota",
											"id": ".ytmp3c ${url} 1"
										},
										{
											"header": "Kualitas Standar (128kbps) 🎵",
											"title": "Audio (128kbps) - Oke untuk dengerin",
											"id": ".ytmp3c ${url} 2"
										},
										{
											"header": "Kualitas Bagus (192kbps) 🎶",
											"title": "Audio (192kbps) - Lebih jelas!",
											"id": ".ytmp3c ${url} 3"
										},
										{
											"header": "Kualitas Tinggi (256kbps) 🎼",
											"title": "Audio (256kbps) - Keren dan jernih",
											"id": ".ytmp3c ${url} 4"
										},
										{
											"header": "Kualitas Ultra (320kbps) 🎧",
											"title": "Audio (320kbps) - Super HD!",
											"id": ".ytmp3c ${url} 5"
										}
									]
								},
								{
									"title": "Download Video 🎥",
									"rows": [
										{
											"header": "Resolusi Rendah (144p) 🐾",
											"title": "Video (144p) - Hemat Data",
											"id": ".ytmp4c ${url} 1"
										},
										{
											"header": "Resolusi Menengah (240p) 📱",
											"title": "Video (240p) - Cukup Jelas",
											"id": ".ytmp4c ${url} 2"
										},
										{
											"header": "Resolusi Standar (360p) 🎬",
											"title": "Video (360p) - Oke lah untuk nonton",
											"id": ".ytmp4c ${url} 3"
										},
										{
											"header": "Resolusi Tinggi (480p) 📺",
											"title": "Video (480p) - Cukup Jernih",
											"id": ".ytmp4c ${url} 4"
										},
										{
											"header": "Resolusi HD (720p) 🌟",
											"title": "Video (720p) - HD, mantap!",
											"id": ".ytmp4c ${url} 5"
										},
										{
											"header": "Resolusi Full HD (1080p) 💎",
											"title": "Video (1080p) - Full HD, wow!",
											"id": ".ytmp4c ${url} 6"
										}
									]
								}
							]
						}`
					}];
					let caption = `*${title}*\n\n`;
					caption += `*🎶 Jenis*: Play\n`;
					caption += `*📌 ID*: ${videoId}\n`;
					caption += `*⏱️ Durasi*: ${duration}\n`;
					caption += `*🕒 Diunggah*: ${ago}\n`;
					caption += `*🔗 Link*: ${url}\n\n`;
					caption += `_*Pilih jenis download yang kamu butuhin... pilih yang paling pas buat kamu ya!*_`;
					await sendButtonImage(m.chat, '', caption,
					{
						url: image
					}, button, m)
				}
				catch (error)
				{
					console.log(error);
				}
			}
			db.data.users[m.sender].limit -= 1;
			break;
			case 'ytaudio':
			case 'ytmp3c':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`Contoh: ${prefix + command} https://youtu.be/videoId`);
				if (!text.includes('youtu')) return shoNherly(`Link yang kakak masukkan bukan link YouTube! 😅`);
				try
				{
					if (!(await firely(m, mess.waits))) return;
					let search = await yts(args[0]);
					if (!search || search.all.length === 0) return shoNherly(`*Video tidak ditemukan!* ☹️`);
					let
					{
						videoId,
						image,
						title,
						views,
						duration,
						author,
						ago,
						url,
						description
					} = search.all[0];
					let caption = `「 *YOUTUBE AUDIO* 」\n\n`;
					caption += `🆔 ID : ${videoId}\n`;
					caption += `💬 Title : ${title}\n`;
					caption += `📺 Views : ${views}\n`;
					caption += `⏰ Duration : ${duration.timestamp}\n`;
					caption += `▶️ Channel : ${author.name}\n`;
					caption += `📆 Upload : ${ago}\n`;
					caption += `🔗 URL Video : ${url}\n`;
					caption += `📝 Description : ${description}`;
					await shoNhe.sendMessage(m.chat,
					{
						image:
						{
							url: image
						},
						caption: caption
					},
					{
						quoted: m
					});
					let audioData = await saveTube.dl(url, args[1], 'audio');
					if (!audioData || !audioData.link)
					{
						return shoNherly(`*Audio tidak ditemukan, silahkan ketik ulang command atau coba lagi nanti ya kak! 🙏*`);
					}
					await shoNhe.sendMessage(m.chat,
					{
						audio:
						{
							url: audioData.link
						},
						mimetype: 'audio/mpeg',
						fileName: `${title}.mp3`,
						ptt: true
					},
					{
						quoted: m
					});
				}
				catch (err)
				{
					console.error(err);
					shoNherly(`*Terjadi kesalahan!* 😭\n${err.message || err}`);
				}
				}
			break
			case 'ytmp4c':
			case 'ytvideo':
			case 'ytv':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`Contoh: ${prefix + command} https://youtu.be/videoId`);
				if (!text.includes('youtu')) return shoNherly(`Link yang kakak masukkan bukan link YouTube! 😅`);
				try
				{
					if (!(await firely(m, mess.waits))) return;
					const vidIdMatch = args[0].match(/(?:youtu\.be\/|youtube\.com\/(?:.*[?&]v=|embed\/|shorts\/|v\/))([\w-]{11})/);
					const vidId = vidIdMatch ? vidIdMatch[1] : null;
					if (!vidId)
					{
						return shoNherly(`Gagal mengekstrak ID video dari link! 😓`);
					}
					let search = await yts(
					{
						videoId: vidId,
						hl: 'id',
						gl: 'ID'
					});
					if (!search) return shoNherly(`*Video tidak ditemukan!* ☹️`);
					let
					{
						title,
						url,
						image
					} = search;
					let caption = `「 *YOUTUBE VIDEO* 」\n\n`;
					caption += `💬 Title : ${title}\n`;
					caption += `🔗 URL Video : ${url}`;
					await shoNhe.sendMessage(m.chat,
					{
						image:
						{
							url: image
						},
						caption: caption
					},
					{
						quoted: m
					});
					let videoData = await saveTube.dl(url, args[1], 'video');
					if (!videoData || !videoData.link)
					{
						return shoNherly(`*Video tidak ditemukan, silahkan ketik ulang command atau coba lagi nanti ya kak! 🙏*`);
					}
					await shoNhe.sendMessage(m.chat,
					{
						video:
						{
							url: videoData.link
						},
						mimetype: 'video/mp4',
						caption: '✅ *Video berhasil diunduh!*'
					},
					{
						quoted: m
					});
				}
				catch (err)
				{
					console.error(err);
					shoNherly(`*Terjadi kesalahan!* 😭\n${err.message || err}`);
				}
				}
			break
			case 'sound1':
			case 'sound2':
			case 'sound3':
			case 'sound4':
			case 'sound5':
			case 'sound6':
			case 'sound7':
			case 'sound8':
			case 'sound9':
			case 'sound10':
			case 'sound11':
			case 'sound12':
			case 'sound13':
			case 'sound14':
			case 'sound15':
			case 'sound16':
			case 'sound17':
			case 'sound18':
			case 'sound19':
			case 'sound20':
			case 'sound21':
			case 'sound22':
			case 'sound23':
			case 'sound24':
			case 'sound25':
			case 'sound26':
			case 'sound27':
			case 'sound28':
			case 'sound29':
			case 'sound30':
			case 'sound31':
			case 'sound32':
			case 'sound33':
			case 'sound34':
			case 'sound35':
			case 'sound36':
			case 'sound37':
			case 'sound38':
			case 'sound39':
			case 'sound40':
			case 'sound41':
			case 'sound42':
			case 'sound43':
			case 'sound44':
			case 'sound45':
			case 'sound46':
			case 'sound47':
			case 'sound48':
			case 'sound49':
			case 'sound50':
			case 'sound51':
			case 'sound52':
			case 'sound53':
			case 'sound54':
			case 'sound55':
			case 'sound56':
			case 'sound57':
			case 'sound58':
			case 'sound59':
			case 'sound60':
			case 'sound61':
			case 'sound62':
			case 'sound63':
			case 'sound64':
			case 'sound65':
			case 'sound66':
			case 'sound67':
			case 'sound68':
			case 'sound69':
			case 'sound70':
			case 'sound71':
			case 'sound72':
			case 'sound73':
			case 'sound74':
			case 'sound75':
			case 'sound76':
			case 'sound77':
			case 'sound78':
			case 'sound79':
			case 'sound80':
			case 'sound81':
			case 'sound82':
			case 'sound83':
			case 'sound84':
			case 'sound85':
			case 'sound86':
			case 'sound87':
			case 'sound88':
			case 'sound89':
			case 'sound90':
			case 'sound91':
			case 'sound92':
			case 'sound93':
			case 'sound94':
			case 'sound95':
			case 'sound96':
			case 'sound97':
			case 'sound98':
			case 'sound99':
			case 'sound100':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				const aud = await getBuffer(`https://github.com/aerovoid4/Tiktokmusic-API/raw/master/tiktokmusic/${command}.mp3`)
				await shoNhe.sendMessage(m.chat,
				{
					audio: aud,
					mimetype: 'audio/mp4',
					ptt: true
				},
				{
					quoted: m
				})
			}
			db.data.users[m.sender].limit -= 1;
			break;
			case 'wanumber':
			case 'nowa':
			case 'searchno':
			case 'searchnumber':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`Provide Number with last number x\n\nExample: ${prefix + command} 91690913721x`)
				var inputnumber = text.split(" ")[0]
				shoNherly(`Searching for WhatsApp account in given range...`)

				function countInstances(string, word)
				{
					return string.split(word).length - 1
				}
				var number0 = inputnumber.split('x')[0]
				var number1 = inputnumber.split('x')[countInstances(inputnumber, 'x')] ? inputnumber.split('x')[countInstances(inputnumber, 'x')] : ''
				var random_length = countInstances(inputnumber, 'x')
				var randomxx
				if (random_length == 1)
				{
					randomxx = 10
				}
				else if (random_length == 2)
				{
					randomxx = 100
				}
				else if (random_length == 3)
				{
					randomxx = 1000
				}
				var text66 = `*==[ List of Whatsapp Numbers ]==*\n\n`
				var nobio = `\n*Bio:* || \nHey there! I am using WhatsApp.\n`
				var nowhatsapp = `\n*Numbers with no WhatsApp account within provided range.*\n`
				for (let i = 0; i < randomxx; i++)
				{
					var nu = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
					var status1 = nu[Math.floor(Math.random() * nu.length)]
					var status2 = nu[Math.floor(Math.random() * nu.length)]
					var status3 = nu[Math.floor(Math.random() * nu.length)]
					var dom4 = nu[Math.floor(Math.random() * nu.length)]
					var random21
					if (random_length == 1)
					{
						random21 = `${status1}`
					}
					else if (random_length == 2)
					{
						random21 = `${status1}${status2}`
					}
					else if (random_length == 3)
					{
						random21 = `${status1}${status2}${status3}`
					}
					else if (random_length == 4)
					{
						random21 = `${status1}${status2}${status3}${dom4}`
					}
					var anu = await shoNhe.onWhatsApp(`${number0}${i}${number1}@s.whatsapp.net`)
					var anuu = anu.length !== 0 ? anu : false
					try
					{
						try
						{
							var anu1 = await shoNhe.fetchStatus(anu[0].jid)
						}
						catch
						{
							var anu1 = '401'
						}
						if (anu1 == '401' || anu1.status.length == 0)
						{
							nobio += `wa.me/${anu[0].jid.split("@")[0]}\n`
						}
						else
						{
							text66 += `🪀 *Number:* wa.me/${anu[0].jid.split("@")[0]}\n 🎗️*Bio :* ${anu1.status}\n🧐*Last update :* ${moment(anu1.setAt).tz('Asia/Jakarta').format('HH:mm:ss DD/MM/YYYY')}\n\n`
						}
					}
					catch
					{
						nowhatsapp += `${number0}${i}${number1}\n`
					}
				}
				shoNherly(`${text66}${nobio}${nowhatsapp}`)
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'song':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Update popular command log
				if (!text)
				{
					shoNherly(`Contoh penggunaan: ${prefix + command} anime whatsapp status`);
					return;
				}
				console.log('🔍 Mencari lagu berdasarkan query:', text);
				const yts = require("youtube-yts");
				const
				{
					youtube
				} = require("btch-downloader"); // Menggunakan btch-downloader
				try
				{
					if (!(await firely(m, mess.waits))) return; // Jika limit habis, proses berhenti di sini
					// Pencarian video
					const look = await yts(text);
					if (!look.videos || look.videos.length === 0)
					{
						return shoNherly('Maaf, tidak menemukan lagu sesuai query tersebut.');
					}
					const convert = look.videos[0]; // Ambil video pertama
					console.log('🎵 Lagu ditemukan:', convert.title, convert.url);
					// Mendapatkan tautan MP3
					const pl = await youtube(convert.url); // btch-downloader mengembalikan URL MP3
					if (!pl || !pl.mp3)
					{
						throw new Error('Gagal mendapatkan tautan MP3');
					}
					console.log('🔗 Link MP3 berhasil didapatkan:', pl.mp3);
					// Kirim audio
					await shoNhe.sendMessage(m.chat,
					{
						audio:
						{
							url: pl.mp3
						},
						fileName: `${convert.title}.mp3`,
						mimetype: 'audio/mpeg',
						contextInfo:
						{
							externalAdReply:
							{
								title: convert.title,
								body: namabot,
								thumbnailUrl: convert.image,
								sourceUrl: convert.url, // URL video YouTube
								mediaType: 1,
								mediaUrl: convert.url,
							}
						},
					},
					{
						quoted: hw
					});
					shoNherly('🎶 Lagunya udah dikirim, selamat menikmati!');
				}
				catch (err)
				{
					console.error('❌ Error saat proses unduh/kirim audio:', err);
					shoNherly('Maaf, terjadi kesalahan saat mengambil lagu. Coba lagi nanti ya.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'pinterest':
			case 'pin':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Update popular command log
				if (!text) return shoNherly(`Enter Query!`);
				if (!(await firely(m, mess.waits))) return; // Jika limit habis, proses berhenti di sini
				async function createImage(url)
				{
					const
					{
						imageMessage
					} = await generateWAMessageContent(
					{
						image:
						{
							url
						}
					},
					{
						upload: shoNhe.waUploadToServer
					});
					return imageMessage;
				}

				function shuffleArray(array)
				{
					for (let i = array.length - 1; i > 0; i--)
					{
						const j = Math.floor(Math.random() * (i + 1));
						[array[i], array[j]] = [array[j], array[i]];
					}
				}
				let push = [];
				let anutrest = await pinterest(text);
				shuffleArray(anutrest);
				let selectedImages = anutrest.slice(0, 5);
				let i = 1;
				for (let message of selectedImages)
				{
					push.push(
					{
						body: proto.Message.InteractiveMessage.Body.fromObject(
						{
							text: `👤 *Diunggah oleh* : ${message.upload_by}\n` + `📛 *Nama Lengkap* : ${message.fullname}\n` + `👥 *Pengikut* : ${message.followers}\n` + `📝 *Caption* : ${message.caption}`
						}),
						footer: proto.Message.InteractiveMessage.Footer.fromObject(
						{
							text: namabot
						}),
						header: proto.Message.InteractiveMessage.Header.fromObject(
						{
							title: `*Gambar* - ${i++}`,
							hasMediaAttachment: true,
							imageMessage: await createImage(message.image)
						}),
						nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject(
						{
							buttons: [
							{
								"name": "cta_url",
								"buttonParamsJson": `{
										"display_text": "View Source 👀",
										"url": "${message.source}", 
										"merchant_url": "${message.source}"
									}`
							}]
						})
					});
				}
				const msg = generateWAMessageFromContent(m.chat,
				{
					viewOnceMessage:
					{
						message:
						{
							messageContextInfo:
							{
								deviceListMetadata:
								{},
								deviceListMetadataVersion: 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.fromObject(
							{
								body: proto.Message.InteractiveMessage.Body.create(
								{
									text: mess.dones
								}),
								footer: proto.Message.InteractiveMessage.Footer.create(
								{
									text: namabot
								}),
								header: proto.Message.InteractiveMessage.Header.create(
								{
									hasMediaAttachment: false
								}),
								carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject(
								{
									cards: [...push]
								})
							})
						}
					}
				},
				{
					quoted: m
				});
				await shoNhe.relayMessage(m.chat, msg.message,
				{
					messageId: msg.key.id
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'upchannel':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				try
				{
					if (!mime && !text)
					{
						return shoNherly(`Oon! Lu belum kirim media atau teks apa pun. Coba lagi ya!`)
					}
					media = mime ? await quoted.download() : null
					let defaultCaption = "🐬 Media ini dikirim melalui sistem otomatis ShoNhe! ⭐"
					if (/image/.test(mime))
					{
						shoNhe.sendMessage('12036338334723329@newsletter',
						{
							image: media,
							caption: text ? text : defaultCaption
						})
						shoNherly(`📸 Gambar berhasil diunggah ke saluran dengan caption: "${text ? text : defaultCaption}"`)
					}
					else if (/video/.test(mime))
					{
						shoNhe.sendMessage('12036338334723329@newsletter',
						{
							video: media,
							caption: text ? text : defaultCaption
						})
						shoNherly(`🎥 Video berhasil diunggah ke saluran dengan caption: "${text ? text : defaultCaption}"`)
					}
					else if (/audio/.test(mime))
					{
						shoNhe.sendMessage('12036338334723329@newsletter',
						{
							audio: media,
							mimetype: mime,
							ptt: true
						})
						shoNherly(`🎵 Audio berhasil diunggah ke saluran, cik!`)
					}
					else if (/text/.test(mime) || text)
					{
						shoNhe.sendMessage('12036338334723329@newsletter',
						{
							text: text ? text : defaultCaption
						})
						shoNherly(`💬 Pesan teks berhasil dikirim ke saluran: "${text ? text : defaultCaption}"`)
					}
					else
					{
						shoNherly(`Bjirlaah ShoNhe gak tau ini jenis media apa. Coba dicek lagi ya, Anjg! 🧐`)
					}
				}
				catch (error)
				{
					console.error(error)
					shoNherly(`Alamak! 😣 Ada masalah waktu unggah ke saluran. Coba lagi nanti ya!`)
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'upchannels':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				try
				{
					if (!mime && !text)
					{
						return shoNherly(`Oon! Lu belum kirim media atau teks apa pun. Coba lagi ya!`);
					}
					const media = mime ? await quoted.download() : null;
					const defaultCaption = "🐬 Media ini dikirim melalui sistem otomatis ShoNhe! ⭐";
					if (/image/.test(mime))
					{
						const repshow = {
							contextInfo:
							{
								forwardingScore: 1,
								isForwarded: true,
								forwardedNewsletterMessageInfo:
								{
									newsletterName: namabot,
									newsletterJid: idsaluran,
								},
								externalAdReply:
								{
									showAdAttribution: true,
									title: waktuucapan,
									body: namabot,
									thumbnail: getRandomThumb3(),
									sourceUrl: gh,
									mediaType: 1,
									renderLargerThumbnail: true,
								},
							},
							image: media,
							caption: text ? text : defaultCaption,
						};
						shoNhe.sendMessage('12036338334723329@newsletter', repshow,
						{
							quoted: hw
						});
						shoNherly(`📸 Gambar berhasil diunggah ke saluran dengan caption: "${text ? text : defaultCaption}"`);
					}
					else if (/video/.test(mime))
					{
						const repshow = {
							contextInfo:
							{
								forwardingScore: 1,
								isForwarded: true,
								forwardedNewsletterMessageInfo:
								{
									newsletterName: namabot,
									newsletterJid: idsaluran,
								},
								externalAdReply:
								{
									showAdAttribution: true,
									title: waktuucapan,
									body: namabot,
									thumbnail: getRandomThumb3(),
									sourceUrl: gh,
									mediaType: 1,
									renderLargerThumbnail: true,
								},
							},
							video: media,
							caption: text ? text : defaultCaption,
							mimetype: mime,
						};
						shoNhe.sendMessage('12036338334723329@newsletter', repshow,
						{
							quoted: hw
						});
						shoNherly(`🎥 Video berhasil diunggah ke saluran dengan caption: "${text ? text : defaultCaption}"`);
					}
					else if (/audio/.test(mime))
					{
						const repshow = {
							contextInfo:
							{
								forwardingScore: 1,
								isForwarded: true,
								forwardedNewsletterMessageInfo:
								{
									newsletterName: namabot,
									newsletterJid: idsaluran,
								},
								externalAdReply:
								{
									showAdAttribution: true,
									title: waktuucapan,
									body: namabot,
									thumbnail: getRandomThumb3(),
									sourceUrl: gh,
									mediaType: 1,
									renderLargerThumbnail: true,
								},
							},
							audio: media,
							mimetype: mime,
							ptt: true, // Ubah ke true jika ingin dikirim sebagai pesan suara
						};
						shoNhe.sendMessage('12036338334723329@newsletter', repshow,
						{
							quoted: hw
						});
						shoNherly(`🎵 Audio berhasil diunggah ke saluran, cik!`);
					}
					else if (/text/.test(mime) || text)
					{
						const repshow = {
							contextInfo:
							{
								forwardingScore: 1,
								isForwarded: true,
								forwardedNewsletterMessageInfo:
								{
									newsletterName: namabot,
									newsletterJid: idsaluran,
								},
								externalAdReply:
								{
									showAdAttribution: true,
									title: waktuucapan,
									body: namabot,
									thumbnail: getRandomThumb3(),
									sourceUrl: gh,
									mediaType: 1,
									renderLargerThumbnail: true,
								},
							},
							text: text ? text : defaultCaption,
						};
						shoNhe.sendMessage('12036338334723329@newsletter', repshow,
						{
							quoted: hw
						});
						shoNherly(`💬 Pesan teks berhasil dikirim ke saluran: "${text ? text : defaultCaption}"`);
					}
					else
					{
						shoNherly(`Bjirlaah shoNhe gak tau ini jenis media apa. Coba dicek lagi ya, Anjg! 🧐`);
					}
				}
				catch (error)
				{
					console.error(error);
					shoNherly(`Alamak! 😣 Ada masalah waktu unggah ke saluran. Coba lagi nanti ya!`);
				}
				}
			break
			case 'sendsc':
			case "kirimsc":
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly("nomor?")
				if (!isShoNheOwn) return shoNherly(mess.owners)
				let dir = await fs.readdirSync("./database/sampah")
				if (dir.length >= 2)
				{
					let res = dir.filter(e => e !== "A")
					for (let i of res)
					{
						await fs.unlinkSync(`./database/sampah/${i}`)
					}
				}
				await shoNherly(`proses pengiriman ke ${text}`)
				var name = `shoNheBotz` //gausah diganti njir🗿
				const ls = (await execSync("ls")).toString().split("\n").filter(
					(pe) => pe != "node_modules" && pe != "session" && pe != "package-lock.json" && pe != "yarn.lock" && pe != "")
				const anu = await execSync(`zip -r ${name}.zip ${ls.join(" ")}`)
				await shoNhe.sendMessage(`${text}@s.whatsapp.net`,
				{
					document: await fs.readFileSync(`./${name}.zip`),
					fileName: `${name}.zip`,
					mimetype: "application/zip"
				},
				{
					quoted: m
				})
				await execSync(`rm -rf ${name}.zip`)
				if (m.chat !== m.sender) return shoNherly(`Script bot berhasil dikirim ke ${text}`)
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'upsaluran':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				try
				{
					if (!mime && !text)
					{
						return shoNherly(`Oon, lu belum kirim media atau teks apa pun. Coba lagi ya! 🤭`)
					}
					media = mime ? await quoted.download() : null
					let defaultCaption = "🪀 Media ini dikirim melalui sistem otomatis shoNhe!"
					if (/image/.test(mime))
					{
						shoNhe.sendMessage(saluran,
						{
							image: media,
							caption: text ? text : defaultCaption
						})
						shoNherly(`📸 Gambar berhasil diunggah ke saluran dengan caption: "${text ? text : defaultCaption}"`)
					}
					else if (/video/.test(mime))
					{
						shoNhe.sendMessage(saluran,
						{
							video: media,
							caption: text ? text : defaultCaption
						})
						shoNherly(`🎥 Video berhasil diunggah ke saluran dengan caption: "${text ? text : defaultCaption}"`)
					}
					else if (/audio/.test(mime))
					{
						shoNhe.sendMessage(saluran,
						{
							audio: media,
							mimetype: mime,
							ptt: true
						})
						shoNherly(`🎵 Audio berhasil diunggah ke saluran, cik!`)
					}
					else if (/text/.test(mime) || text)
					{
						shoNhe.sendMessage(saluran,
						{
							text: text ? text : defaultCaption
						})
						shoNherly(`💬 Pesan teks berhasil dikirim ke saluran: "${text ? text : defaultCaption}"`)
					}
					else
					{
						shoNherly(`Hmm... shoNhe gak tau ini jenis media apa. Coba dicek lagi ya, cik! 🧐`)
					}
				}
				catch (error)
				{
					console.error(error)
					shoNherly(`Alamak! 😣 Ada masalah waktu unggah ke saluran. Coba lagi nanti ya!`)
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'register':
			{
				updatePopularCommand(command); // Catat command yang digunakan
				const db = loadUserFire();
				const sender = m.sender;
				// Fungsi untuk menghasilkan kode seri unik
				function generateUniqueSeries()
				{
					const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
					let series;
					do {
						series = Array.from(
						{
							length: 10
						}, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
					} while (Object.values(db).some(user => user.registrationSeries === series)); // Pastikan seri unik
					return series;
				}
				if (db[sender] && db[sender].register)
				{
					// Jika pengguna sudah terdaftar
					shoNherly(`⚠️ Ya te has registrado antes.\n\n📜 Tu información:\n- Rol: ${db[sender].role}\n- Limite: ${db[sender].limit}\n- Serie: ${db[sender].registrationSeries}\n- Nivel: ${db[sender].level}\n- Exp: ${db[sender].exp}/${db[sender].expTarget}\n- Recuento de comandos: ${db[sender].commandCount}`);
				}
				else
				{
					// Tentukan role dan limit berdasarkan kondisi
					const role = isShoNheOwn ? 'owner' : isVip ? 'vip' : 'user';
					const limit = role === 'owner' ? -1 : role === 'vip' ? 1000 : 100;
					const registrationSeries = generateUniqueSeries(); // Buat seri unik untuk pengguna
					// Tambahkan data pengguna baru ke database
					db[sender] = {
						register: true,
						role: role,
						limit: limit,
						registrationSeries: registrationSeries,
						level: 0,
						exp: 0,
						expTarget: 10,
						commandCount: 0,
						balance: 0 // Saldo awal
					};
					saveUserFire(db); // Simpan data pengguna ke database
					shoNherly(`🎉 ¡Registro exitoso!\n\n📜 Tu información:\n- Rol: ${role}\n- Limite: ${limit}\n- Serie: ${registrationSeries}\n- Nivel: 0\n- Exp: 0/10\n- Recuento de comandos: 0\n- Saldo: 0`);
				}
			}
			break;
			case 'upsaluran2':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				try
				{
					if (!mime && !text)
					{
						return shoNherly(`Oon, lu belum kirim media atau teks apa pun. Coba lagi ya! 🤭`)
					}
					media = mime ? await quoted.download() : null
					let defaultCaption = "🪨 Media ini dikirim melalui sistem otomatis shoNhe! 🍏"
					const buttons = [
					{
						buttonId: `${prefix}about`,
						buttonText:
						{
							displayText: "About 👤"
						}
					},
					{
						buttonId: `${prefix}contact`,
						buttonText:
						{
							displayText: "Contact 📞"
						}
					}]
					if (/image/.test(mime))
					{
						shoNhe.sendMessage(saluran,
						{
							image: media,
							caption: text ? text : defaultCaption,
							footer: namabot,
							buttons: buttons,
							viewOnce: true
						})
						shoNherly(`📸 Gambar berhasil diunggah ke saluran dengan caption: "${text ? text : defaultCaption}"`)
					}
					else if (/video/.test(mime))
					{
						shoNhe.sendMessage(saluran,
						{
							video: media,
							caption: text ? text : defaultCaption,
							footer: namabot,
							buttons: buttons,
							viewOnce: true
						})
						shoNherly(`🎥 Video berhasil diunggah ke saluran dengan caption: "${text ? text : defaultCaption}"`)
					}
					else if (/text/.test(mime) || text)
					{
						shoNhe.sendMessage(saluran,
						{
							text: text ? text : defaultCaption,
							footer: namabot,
							buttons: buttons,
							viewOnce: true
						})
						shoNherly(`💬 Pesan teks berhasil dikirim ke saluran: "${text ? text : defaultCaption}"`)
					}
					else
					{
						shoNherly(`Hmm... shoNhe gak tau ini jenis media apa. Coba dicek lagi ya, cil! 🧐`)
					}
				}
				catch (error)
				{
					console.error(error)
					shoNherly(`Alamak 😣 Ada masalah waktu unggah ke saluran. Coba lagi nanti ya!`)
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tiktoksearch':
			case 'tiktoks':
			case 'ttsearch':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`⚠️ kurang lengkap su, gini loh: *${prefix + command} jj epep* biar shoNhe bisa bantu cari yang lu mau! 🔍💬`);
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let search = await tiktokSearchVideo(text);
					let teks = `🎥 *${search.videos[0].title}*\n\n` + `🆔 *Video ID* : ${search.videos[0].video_id}\n` + `👤 *Username* : ${search.videos[0].author.unique_id}\n` + `🏷️ *Nickname* : ${search.videos[0].author.nickname}\n` + `⏳ *Duration* : ${search.videos[0].duration} detik\n` + `❤️ *VT Like* : ${search.videos[0].digg_count}\n` + `💬 *Comment* : ${search.videos[0].comment_count}\n` + `🔄 *Share* : ${search.videos[0].share_count}\n\n` + `🔗 *Link*: https://www.tiktok.com/@${search.videos[0].author.unique_id}/video/${search.videos[0].video_id}`;
					let list = '';
					let no = 1;
					for (let i of search.videos)
					{
						list += `\n${no++}. 🎵 *${i.title}*\n` + `⏳ Duration: ${i.duration} detik\n` + `❤️ Likes: ${i.digg_count}\n` + `💬 Comments: ${i.comment_count}\n` + `🔄 Shares: ${i.share_count}\n` + `🔗 Link: https://www.tiktok.com/@${i.author.unique_id}/video/${i.video_id}\n`;
					}
					await shoNhe.sendMessage(m.chat,
					{
						video:
						{
							url: `https://tikwm.com${search.videos[0].play}`
						},
						caption: teks
					},
					{
						quoted: m
					});
					if (search.videos.length > 1)
					{
						await shoNhe.sendMessage(m.chat,
						{
							text: `📚 *Daftar Video Lainnya:*\n${list}`
						},
						{
							quoted: m
						});
					}
				}
				catch (error)
				{
					console.log(error);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'ping':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				let timestamp = speed()
				let latensi = speed() - timestamp
				respon = `Kecepatan Respon ${latensi.toFixed(4)} _Second_`
				shoNherly(respon)
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'alquilar': {
			if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
			const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
const seww =
`┌◇🔒 *ALQUILAR BOT PARA WHATSAPPP* 🔒◇┐

⚙️ *¿Por qué deberías alquilar TechFix Bot?*:
💻 Inteligencia artificial indetectable
🔐 Tus datos están seguros con cifrado de alto nivel
⚡ Respuesta rápida y automatizada para diversas necesidades
🛠️ Funciones personalizables adaptadas a cada usuario

💼 *Planes de Alquiler Disponibles*:

📌 *3 Días* = P$ 2.000
» Acceso completo por 72 horas para probar todas las funciones.

📌 *1 Semana* = P$ 5.000
» Ideal para eventos o pruebas temporales.

📌 *2 Semanas* = P$ 10.000
» Perfecto para operaciones de mediano plazo, eventos largos o negocios temporales.

📌 *1 Mes* = P$ 25.000
» Plan óptimo para grupos y negocios a largo plazo con funciones avanzadas.

🌐 *Más de 500+ funciones exclusivas*:

🔍 *Auto-Responder 24/7* - Sistema de respuesta automática siempre activo.

💽 *Descargador de Medios* - Descarga contenido directamente desde cualquier plataforma.

🔄 *Estadísticas de Grupo* - Análisis detallado de la actividad grupal.

🎮 *Juegos, Hacks y Trivia* - Juegos interactivos y divertidos dentro del grupo.

🔊 *Conversor y Herramientas de Audio* - Modifica audios y accede a herramientas adicionales.

🤖 *Asistente de IA* - Un bot que aprende con cada interacción.


⚠️ *Instrucciones de Seguridad*:
Para garantizar la privacidad, contacta al propietario solo a través de los canales oficiales. El alquiler se gestiona de manera confidencial y segura.

📞 *Contacto del Propietario*:

   - WhatsApp: wa.me/573012686632

   - Email: manuellove133@gmail.com

   - Instagram: www.instagram.com/


└───◇🔒━━━━━━🔒◇───┘

⚡ TechFix - En las Sombras, Nos Movemos ⚡`
shoNhe.sendMessage(m.chat,
				{
					image: getRandomThumb3(),
					caption: seww,
					footer: "ALQUILAR BOTS🔥",
					buttons: [
					{
						buttonId: `${prefix}payment`,
						buttonText:
						{
							displayText: "PAGOS 💶"
						}
					},
					{
						buttonId: `${prefix}owner`,
						buttonText:
						{
							displayText: "OWNER 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
}
				break
			case 'tiktok':
			case 'tiktokdown':
			case 'ttdown':
			case 'ttdl':
			case 'tt':
			case 'ttmp4':
			case 'ttvideo':
			case 'tiktokmp4':
			case 'tiktokvideo':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`Example: ${prefix + command} url_tiktok`);
				const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?(tiktok\.com|vm\.tiktok\.com)/;
				if (!tiktokRegex.test(text)) return shoNherly('Url Tidak Mengandung Result Dari TikTok!');
				try
				{
					const hasil = await tiktokDl(text);
					console.log('Hasil dari tiktokDl:', JSON.stringify(hasil, null, 2));
					if (!(await firely(m, mess.waits))) return; // Jika limit habis, proses berhenti di sini
					if (hasil && hasil.data && hasil.data.length > 0)
					{
						if (hasil.size_nowm)
						{
							await shoNhe.sendMessage(m.chat,
							{
								video:
								{
									url: hasil.data[1].url
								},
								caption: `*📍Title:* ${hasil.title}\n*⏳Duration:* ${hasil.duration}\n*🎃Author:* ${hasil.author.nickname} (@${hasil.author.fullname})`,
								footer: namabot,
								buttons: [
								{
									buttonId: `${prefix}ttmp3 ${text}`,
									buttonText:
									{
										displayText: "Tiktok Mp3🎶"
									}
								}],
								viewOnce: true,
							},
							{
								quoted: m
							});
						}
						else
						{
							for (let i = 0; i < hasil.data.length; i++)
							{
								await shoNhe.sendMessage(m.chat,
								{
									video:
									{
										url: hasil.data[i].url
									},
									caption: `*🚀Video:* ${i + 1}`,
								},
								{
									quoted: m
								});
							}
						}
					}
					else
					{
						shoNherly('Data TikTok tidak ditemukan atau tidak valid!');
					}
				}
				catch (e)
				{
					console.error('Error saat memproses URL TikTok:', e);
					shoNherly('Gagal memproses URL! Detail error: ' + e.message);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'toaud':
			case 'toaudio':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!/video|audio/.test(mime)) return shoNherly(`Enviar/Responder vídeo/audio que desea convertir en audio con subtítulos ${prefix + command}`)
				shoNherly('sexo anal');
				// Emoji yang akan digunakan
				const reactEmojis = ["⏳", "🕛", "🕒", "🕕", "🕘", "🕛", "✅"];
				// Mengirimkan reaksi secara berurutan
				for (const emoji of reactEmojis)
				{
					await shoNhe.sendMessage(m.chat,
					{
						react:
						{
							text: emoji,
							key: m.key
						}
					});
				}
				let media = await quoted.download()
				let audio = await toAudio(media, 'mp4')
				await shoNhe.sendMessage(m.chat,
				{
					audio: audio,
					mimetype: 'audio/mpeg'
				},
				{
					quoted: m
				})
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'settings':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				const teksnyo = "⚙️ CONFIGURACIÓN DEL BOT\nElige una función a continuación para configurar\n💬escribiendo\n🎤grabando\n👁️‍🗨️vistas automáticas\n🔇anti-llamadas\n📝establecer biografía\n📖lectura automática"
				let msg = generateWAMessageFromContent(m.chat,
				{
					viewOnceMessage:
					{
						message:
						{
							"messageContextInfo":
							{
								"deviceListMetadata":
								{},
								"deviceListMetadataVersion": 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.create(
							{
								body: proto.Message.InteractiveMessage.Body.create(
								{
									text: teksnyo
								}),
								footer: proto.Message.InteractiveMessage.Footer.create(
								{
									text: namabot
								}),
								header: proto.Message.InteractiveMessage.Header.create(
								{
									hasMediaAttachment: true,
									documentMessage:
									{
										"url": "https://mmg.whatsapp.net/v/t62.7119-24/30129597_829817659174206_6300413901737393729_n.enc?ccb=11-4&oh=01_Q5AaIA5MAdyMQOjp8l42SnRy_8qjz9O8JH8vgPee1nIdko51&oe=66595EB9&_nc_sid=5e03e0&mms3=true",
										"mimetype": "application/pdf",
										"fileSha256": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
										"jpegThumbnail": fs.readFileSync("./ShoNheMedia/image/owner.jpg"), //Format gambar harus 300x300 (jika beda tidak akan keluar
										"fileLength": 120000,
										"mediaKey": "SkHeALp42Ch7DGb6nuV6p7hxL+V9yjh9s9t3Ox8a72o=",
										"fileName": `AJUSTES DE GRUPO`,
										"directPath": "/v/t62.7119-24/30129597_829817659174206_6300413901737393729_n.enc?ccb=11-4&oh=01_Q5AaIA5MAdyMQOjp8l42SnRy_8qjz9O8JH8vgPee1nIdko51&oe=66595EB9&_nc_sid=5e03e0",
										"contactVcard": true,
										"mediaKeyTimestamp": "1658703206"
									}
								}),
								nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
								{
									buttons: [
									{
										"name": "single_select",
"buttonParamsJson": `{
    "title": "Configuración",
    "sections": [{
        "title": "Seleccionar Configuración",
        "rows": [{
            "title": "💬 AUTOTYPING ON",
            "description": "El bot activará la escritura automática",
            "id": "${prefix}autotypingon"
        },
        {
            "title": "💬 AUTOTYPING OFF",
            "description": "El bot desactivará la escritura automática",
            "id": "${prefix}autotypingoff"
        },
        {
            "title": "🎤 AUTOVN ON",
            "description": "Activar la función de notas de voz automáticas",
            "id": "${prefix}autovnon"
        },
        {
            "title": "🎤 AUTOVN OFF",
            "description": "Desactivar la función de notas de voz automáticas",
            "id": "${prefix}autovnoff"
        },
        {
            "title": "👁️‍🗨️ SW-VIEW ON",
            "description": "El bot activará la vista automática de estados",
            "id": "${prefix}autoswview on"
        },
        {
            "title": "👁️‍🗨️ SW-VIEW OFF",
            "description": "El bot desactivará la vista automática de estados",
            "id": "${prefix}autoswview off"
        },
        {
            "title": "🔇 ANTI-CALL ON",
            "description": "Activar la función de bloqueo de llamadas",
            "id": "${prefix}anticall on"
        },
        {
            "title": "🔇 ANTI-CALL OFF",
            "description": "Desactivar la función de bloqueo de llamadas",
            "id": "${prefix}anticall off"
        },
        {
            "title": "📝 AUTOBIO ON",
            "description": "Activar la función de biografía automática",
            "id": "${prefix}autobio on"
        },
        {
            "title": "📝 AUTOBIO OFF",
            "description": "Desactivar la función de biografía automática",
            "id": "${prefix}autobio off"
        },
        {
            "title": "📖 AUTOREAD ON",
            "description": "Activar la función de lectura automática",
            "id": "${prefix}autoread true"
        },
        {
            "title": "📖 AUTOREAD OFF",
            "description": "Desactivar la función de lectura automática",
            "id": "${prefix}autoread false"
													}]
												}]
											}`
									}],
								}),
								contextInfo:
								{
									forwardingScore: 245,
									isForwarded: true,
									mentionedJid: [m.sender],
									forwardedNewsletterMessageInfo:
									{
										newsletterName: `© TechFix Botz`,
										newsletterJid: idsaluran
									},
									externalAdReply:
									{
										title: `CONFIGURACIÓN DEL BOT 🔧`,
										body: "",
										showAdAttribution: true,
										thumbnail: fs.readFileSync("./ShoNheMedia/image/sett.png"),
										mediaType: 1,
										previewType: 0,
										renderLargerThumbnail: false,
										mediaUrl: "",
										sourceUrl: "",
									}
								}
							})
						}
					}
				},
				{
					quoted: hw
				})
				await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
				{
					messageId: msg.key.id
				})
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'sendurlimg2':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!args[0]) return shoNherly("Format: sendurlimg2 nomor|teks|footer|teks button|link|teks button|link...");
				// Pisahkan input
				const [target, teks, footer, ...buttonsData] = args.join(" ").split('|');
				// Validasi nomor tujuan
				const targetNumber = target.includes('@s.whatsapp.net') ? target : `${target}@s.whatsapp.net`;
				// Buat tombol URL (cta_url)
				const buttons = buttonsData.reduce((acc, curr, index, arr) =>
				{
					if (index % 2 === 0)
					{ // Setiap 2 elemen jadi satu button
						acc.push(
						{
							name: "cta_url",
							buttonParamsJson: JSON.stringify(
							{
								display_text: arr[index], // Teks button
								url: arr[index + 1] || 'https://wa.me' // Link
							})
						});
					}
					return acc;
				}, []);
				if (buttons.length === 0) return shoNherly("Minimal harus ada satu tombol dengan teks dan URL!");
				// Buat pesan
				const msg = generateWAMessageFromContent(targetNumber,
				{
					viewOnceMessage:
					{
						message:
						{
							"messageContextInfo":
							{
								"deviceListMetadata":
								{},
								"deviceListMetadataVersion": 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.create(
							{
								body: proto.Message.InteractiveMessage.Body.create(
								{
									text: teks
								}),
								footer: proto.Message.InteractiveMessage.Footer.create(
								{
									text: footer // Footer pesan
								}),
								header: proto.Message.InteractiveMessage.Header.create(
								{
									...(await prepareWAMessageMedia(
									{
										image: getRandomThumb2()
									},
									{
										upload: shoNhe.waUploadToServer
									})),
									title: ``,
									gifPlayback: true,
									subtitle: namaowner, // Subtitle header
									hasMediaAttachment: false
								}),
								nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
								{
									buttons // Array tombol yang telah dibuat
								}),
								contextInfo:
								{
									mentionedJid: [targetNumber],
									forwardingScore: 999,
									isForwarded: true
								}
							})
						}
					}
				},
				{});
				// Kirim pesan
				await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
				{
					messageId: msg.key.id
				});
				shoNherly(`Pesan berhasil dikirim ke ${target}`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'sendlist':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (!args[0]) return shoNherly("Format: sendlist teks|titleRow|title|desc|command|title|desc|command...");
				// Pisahkan input
				const [teks, titleRow, ...items] = args.join(" ").split('|');
				// Buat rows untuk menu
				const rows = items.reduce((acc, curr, index, arr) =>
				{
					if (index % 3 === 0)
					{ // Setiap 3 elemen jadi satu row
						acc.push(
						{
							title: arr[index],
							description: arr[index + 1] || '',
							id: arr[index + 2] || `command${index / 3 + 1}`
						});
					}
					return acc;
				}, []);
				// Buat format JSON untuk buttons
				const buttonParamsJson = JSON.stringify(
				{
					title: titleRow,
					sections: [
					{
						title: titleRow,
						rows
					}]
				});
				// Buat pesan
				let msg = generateWAMessageFromContent(m.chat,
				{
					viewOnceMessage:
					{
						message:
						{
							"messageContextInfo":
							{
								"deviceListMetadata":
								{},
								"deviceListMetadataVersion": 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.create(
							{
								body: proto.Message.InteractiveMessage.Body.create(
								{
									text: teks
								}),
								footer: proto.Message.InteractiveMessage.Footer.create(
								{
									text: namabot // Nama bot Anda
								}),
								header: proto.Message.InteractiveMessage.Header.create(
								{
									gifPlayback: true,
									subtitle: namaowner, // Nama owner Anda
									hasMediaAttachment: false
								}),
								nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
								{
									buttons: [
									{
										"name": "single_select",
										"buttonParamsJson": buttonParamsJson // Format JSON valid
									}]
								}),
								contextInfo:
								{
									mentionedJid: [m.sender],
									forwardingScore: 999,
									isForwarded: true
								}
							})
						}
					}
				},
				{});
				// Kirim pesan
				await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
				{
					messageId: msg.key.id
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'sendlistimg':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (!args[0]) return shoNherly("Format: sendlistimg teks|titleRow|title|desc|command|title|desc|command...");
				const [teks, titleRow, ...items] = args.join(" ").split('|');
				// Buat rows untuk menu
				const rows = items.reduce((acc, curr, index, arr) =>
				{
					if (index % 3 === 0)
					{
						acc.push(
						{
							title: arr[index],
							description: arr[index + 1] || '',
							id: arr[index + 2] || `command${index / 3 + 1}`
						});
					}
					return acc;
				}, []);
				const buttonParamsJson = JSON.stringify(
				{
					title: titleRow,
					sections: [
					{
						title: titleRow,
						rows
					}]
				});
				const msg = generateWAMessageFromContent(m.chat,
				{
					viewOnceMessage:
					{
						message:
						{
							"messageContextInfo":
							{
								"deviceListMetadata":
								{},
								"deviceListMetadataVersion": 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.create(
							{
								body: proto.Message.InteractiveMessage.Body.create(
								{
									text: teks
								}),
								footer: proto.Message.InteractiveMessage.Footer.create(
								{
									text: namabot // Nama bot
								}),
								header: proto.Message.InteractiveMessage.Header.create(
								{
									...(await prepareWAMessageMedia(
									{
										image: getRandomThumb2()
									},
									{
										upload: shoNhe.waUploadToServer
									})),
									title: ``,
									gifPlayback: true,
									subtitle: namaowner,
									hasMediaAttachment: false
								}),
								nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
								{
									buttons: [
									{
										"name": "single_select",
										"buttonParamsJson": buttonParamsJson
									}]
								}),
								contextInfo:
								{
									mentionedJid: [m.sender],
									forwardingScore: 999,
									isForwarded: true
								}
							})
						}
					}
				},
				{});
				await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
				{
					messageId: msg.key.id
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'sendlist2':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (!args[0]) return shoNherly("Format: sendlist2 nomor|teks|titleRow|title|desc|command|title|desc|command...");
				// Pisahkan input
				const [target, teks, titleRow, ...items] = args.join(" ").split('|');
				// Validasi nomor tujuan
				const targetNumber = target.includes('@s.whatsapp.net') ? target : `${target}@s.whatsapp.net`;
				// Buat rows untuk menu
				const rows = items.reduce((acc, curr, index, arr) =>
				{
					if (index % 3 === 0)
					{ // Setiap 3 elemen jadi satu row
						acc.push(
						{
							title: arr[index],
							description: arr[index + 1] || '',
							id: arr[index + 2] || `command${index / 3 + 1}`
						});
					}
					return acc;
				}, []);
				// Buat format JSON untuk buttons
				const buttonParamsJson = JSON.stringify(
				{
					title: titleRow,
					sections: [
					{
						title: titleRow,
						rows
					}]
				});
				// Buat pesan
				let msg = generateWAMessageFromContent(targetNumber,
				{
					viewOnceMessage:
					{
						message:
						{
							"messageContextInfo":
							{
								"deviceListMetadata":
								{},
								"deviceListMetadataVersion": 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.create(
							{
								body: proto.Message.InteractiveMessage.Body.create(
								{
									text: teks
								}),
								footer: proto.Message.InteractiveMessage.Footer.create(
								{
									text: namabot // Nama bot Anda
								}),
								header: proto.Message.InteractiveMessage.Header.create(
								{
									gifPlayback: true,
									subtitle: namaowner, // Nama owner Anda
									hasMediaAttachment: false
								}),
								nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
								{
									buttons: [
									{
										"name": "single_select",
										"buttonParamsJson": buttonParamsJson // Format JSON valid
									}]
								}),
								contextInfo:
								{
									mentionedJid: [targetNumber],
									forwardingScore: 999,
									isForwarded: true
								}
							})
						}
					}
				},
				{});
				// Kirim pesan
				await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
				{
					messageId: msg.key.id
				});
				shoNherly(`Pesan berhasil dikirim ke ${target}`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'sendlistimg2':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (!args[0]) return shoNherly("Format: sendlistimg2 nomor|teks|titleRow|title|desc|command|title|desc|command...");
				// Pisahkan input
				const [target, teks, titleRow, ...items] = args.join(" ").split('|');
				// Validasi nomor tujuan
				const targetNumber = target.includes('@s.whatsapp.net') ? target : `${target}@s.whatsapp.net`;
				// Buat rows untuk menu
				const rows = items.reduce((acc, curr, index, arr) =>
				{
					if (index % 3 === 0)
					{ // Setiap 3 elemen jadi satu row
						acc.push(
						{
							title: arr[index],
							description: arr[index + 1] || '',
							id: arr[index + 2] || `command${index / 3 + 1}`
						});
					}
					return acc;
				}, []);
				// Buat format JSON untuk buttons
				const buttonParamsJson = JSON.stringify(
				{
					title: titleRow,
					sections: [
					{
						title: titleRow,
						rows
					}]
				});
				// Buat pesan
				let msg = generateWAMessageFromContent(targetNumber,
				{
					viewOnceMessage:
					{
						message:
						{
							"messageContextInfo":
							{
								"deviceListMetadata":
								{},
								"deviceListMetadataVersion": 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.create(
							{
								body: proto.Message.InteractiveMessage.Body.create(
								{
									text: teks
								}),
								footer: proto.Message.InteractiveMessage.Footer.create(
								{
									text: namabot // Nama bot Anda
								}),
								header: proto.Message.InteractiveMessage.Header.create(
								{
									...(await prepareWAMessageMedia(
									{
										image: getRandomThumb2()
									},
									{
										upload: shoNhe.waUploadToServer
									})),
									title: ``,
									gifPlayback: true,
									subtitle: namaowner,
									hasMediaAttachment: false
								}),
								nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
								{
									buttons: [
									{
										"name": "single_select",
										"buttonParamsJson": buttonParamsJson // Format JSON valid
									}]
								}),
								contextInfo:
								{
									mentionedJid: [targetNumber],
									forwardingScore: 999,
									isForwarded: true
								}
							})
						}
					}
				},
				{});
				// Kirim pesan
				await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
				{
					messageId: msg.key.id
				});
				shoNherly(`Pesan berhasil dikirim ke ${target}`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'sendbutton':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (!args[0]) return shoNherly("Format: sendbutton teks|footer|buttonid|displaytext|buttonid|displaytext...");
				// Pisahkan input
				const [teks, footer, ...buttonData] = args.join(" ").split('|');
				// Validasi jumlah button
				if (buttonData.length % 2 !== 0) return shoNherly("Format tombol salah! Pastikan setiap button memiliki ID dan DisplayText.");
				// Buat array tombol
				const buttons = [];
				for (let i = 0; i < buttonData.length; i += 2)
				{
					buttons.push(
					{
						buttonId: buttonData[i],
						buttonText:
						{
							displayText: buttonData[i + 1]
						}
					});
				}
				// Kirim pesan dengan tombol
				shoNhe.sendMessage(m.chat,
				{
					text: teks,
					footer: footer,
					buttons: buttons,
					viewOnce: true,
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'sendbutton2':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (!args[0]) return shoNherly("Format: sendbutton2 nomor|teks|footer|buttonid|displaytext|buttonid|displaytext...");
				// Pisahkan input
				const [nomor, teks, footer, ...buttonData] = args.join(" ").split('|');
				// Validasi nomor tujuan
				const targetNumber = nomor.includes('@s.whatsapp.net') ? nomor : `${nomor}@s.whatsapp.net`;
				// Validasi jumlah button
				if (buttonData.length % 2 !== 0) return shoNherly("Format tombol salah! Pastikan setiap button memiliki ID dan DisplayText.");
				// Buat array tombol
				const buttons = [];
				for (let i = 0; i < buttonData.length; i += 2)
				{
					buttons.push(
					{
						buttonId: buttonData[i],
						buttonText:
						{
							displayText: buttonData[i + 1]
						}
					});
				}
				// Kirim pesan dengan tombol ke nomor target
				shoNhe.sendMessage(targetNumber,
				{
					text: teks,
					footer: footer,
					buttons: buttons,
					viewOnce: true,
				});
				shoNherly(`Pesan berhasil dikirim ke ${nomor}`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'sendbuttonimg':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (!args[0]) return shoNherly("Format: sendbuttonimg teks|footer|buttonid|displaytext|buttonid|displaytext...");
				// Pisahkan input
				const [teks, footer, ...buttonData] = args.join(" ").split('|');
				// Validasi jumlah button
				if (buttonData.length % 2 !== 0) return shoNherly("Format tombol salah! Pastikan setiap button memiliki ID dan DisplayText.");
				// Buat array tombol
				const buttons = [];
				for (let i = 0; i < buttonData.length; i += 2)
				{
					buttons.push(
					{
						buttonId: buttonData[i],
						buttonText:
						{
							displayText: buttonData[i + 1]
						}
					});
				}
				// Kirim pesan dengan tombol
				shoNhe.sendMessage(m.chat,
				{
					image: getRandomThumb2(),
					caption: teks,
					footer: footer,
					buttons: buttons,
					viewOnce: true,
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'sendurlch':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!args[0]) return shoNherly("Format: sendurlch channelID|teks|footer|teks button|link|teks button|link...");
				// Pisahkan input
				const [target, teks, footer, ...buttonsData] = args.join(" ").split('|');
				// Validasi channel tujuan
				const targetID = target.includes('@') ? target : `${target}@newslatter`;
				// Buat tombol URL (cta_url)
				const buttons = buttonsData.reduce((acc, curr, index, arr) =>
				{
					if (index % 2 === 0)
					{ // Setiap 2 elemen jadi satu button
						acc.push(
						{
							name: "cta_url",
							buttonParamsJson: JSON.stringify(
							{
								display_text: arr[index], // Teks button
								url: arr[index + 1] || 'https://wa.me' // Link
							})
						});
					}
					return acc;
				}, []);
				if (buttons.length === 0) return shoNherly("Minimal harus ada satu tombol dengan teks dan URL!");
				// Buat pesan
				const msg = generateWAMessageFromContent(targetID,
				{
					viewOnceMessage:
					{
						message:
						{
							"messageContextInfo":
							{
								"deviceListMetadata":
								{},
								"deviceListMetadataVersion": 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.create(
							{
								body: proto.Message.InteractiveMessage.Body.create(
								{
									text: teks
								}),
								footer: proto.Message.InteractiveMessage.Footer.create(
								{
									text: footer // Footer pesan
								}),
								header: proto.Message.InteractiveMessage.Header.create(
								{
									...(await prepareWAMessageMedia(
									{
										image: getRandomThumb2()
									},
									{
										upload: shoNhe.waUploadToServer
									})),
									title: ``,
									gifPlayback: true,
									subtitle: namaowner, // Subtitle header
									hasMediaAttachment: false
								}),
								nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
								{
									buttons // Array tombol yang telah dibuat
								}),
								contextInfo:
								{
									mentionedJid: [targetID],
									forwardingScore: 999,
									isForwarded: true
								}
							})
						}
					}
				},
				{});
				// Kirim pesan
				await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
				{
					messageId: msg.key.id
				});
				shoNherly(`Pesan berhasil dikirim ke channel ${targetID}`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'sendlistch':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (!args[0]) return shoNherly("Format: sendlistch channelID|teks|titleRow|title|desc|command|title|desc|command...");
				// Pisahkan input
				const [target, teks, titleRow, ...items] = args.join(" ").split('|');
				// Validasi target tujuan
				const targetID = target.includes('@') ? target : `${target}@newslatter`;
				// Buat rows untuk menu
				const rows = items.reduce((acc, curr, index, arr) =>
				{
					if (index % 3 === 0)
					{ // Setiap 3 elemen jadi satu row
						acc.push(
						{
							title: arr[index],
							description: arr[index + 1] || '',
							id: arr[index + 2] || `command${index / 3 + 1}`
						});
					}
					return acc;
				}, []);
				// Buat format JSON untuk buttons
				const buttonParamsJson = JSON.stringify(
				{
					title: titleRow,
					sections: [
					{
						title: titleRow,
						rows
					}]
				});
				// Buat pesan
				let msg = generateWAMessageFromContent(targetID,
				{
					viewOnceMessage:
					{
						message:
						{
							"messageContextInfo":
							{
								"deviceListMetadata":
								{},
								"deviceListMetadataVersion": 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.create(
							{
								body: proto.Message.InteractiveMessage.Body.create(
								{
									text: teks
								}),
								footer: proto.Message.InteractiveMessage.Footer.create(
								{
									text: namabot // Nama bot Anda
								}),
								header: proto.Message.InteractiveMessage.Header.create(
								{
									...(await prepareWAMessageMedia(
									{
										image: getRandomThumb2()
									},
									{
										upload: shoNhe.waUploadToServer
									})),
									title: '',
									gifPlayback: true,
									subtitle: namaowner,
									hasMediaAttachment: false
								}),
								nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
								{
									buttons: [
									{
										"name": "single_select",
										"buttonParamsJson": buttonParamsJson // Format JSON valid
									}]
								}),
								contextInfo:
								{
									mentionedJid: [targetID],
									forwardingScore: 999,
									isForwarded: true
								}
							})
						}
					}
				},
				{});
				// Kirim pesan
				await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
				{
					messageId: msg.key.id
				});
				shoNherly(`Pesan berhasil dikirim ke channel ${targetID}`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'sendbuttonimg2':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (!args[0]) return shoNherly("Format: sendbutton2 nomor|teks|footer|buttonid|displaytext|buttonid|displaytext...");
				// Pisahkan input
				const [nomor, teks, footer, ...buttonData] = args.join(" ").split('|');
				// Validasi nomor tujuan
				const targetNumber = nomor.includes('@s.whatsapp.net') ? nomor : `${nomor}@s.whatsapp.net`;
				// Validasi jumlah button
				if (buttonData.length % 2 !== 0) return shoNherly("Format tombol salah! Pastikan setiap button memiliki ID dan DisplayText.");
				// Buat array tombol
				const buttons = [];
				for (let i = 0; i < buttonData.length; i += 2)
				{
					buttons.push(
					{
						buttonId: buttonData[i],
						buttonText:
						{
							displayText: buttonData[i + 1]
						}
					});
				}
				// Kirim pesan dengan tombol ke nomor target
				shoNhe.sendMessage(targetNumber,
				{
					image: getRandomThumb2(),
					caption: teks,
					footer: footer,
					buttons: buttons,
					viewOnce: true,
				});
				shoNherly(`Pesan berhasil dikirim ke ${nomor}`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'autotypingon':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				botSettings.autotyping = true;
				botSettings.autovn = false;
				shoNherly('AutoTyping diaktifkan, AutoVN dinonaktifkan.');
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'autotypingoff':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				botSettings.autotyping = false;
				shoNherly('AutoTyping dinonaktifkan.');
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'autovnon':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				botSettings.autovn = true;
				botSettings.autotyping = false;
				shoNherly('AutoVN diaktifkan, AutoTyping dinonaktifkan.');
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'autovnoff':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				botSettings.autovn = false;
				shoNherly('AutoVN dinonaktifkan.');
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tomp3':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!/video|audio/.test(mime)) return shoNherly(`Kirim/Reply Video/Audio Yang Ingin Dijadikan Audio Dengan Caption ${prefix + command}`)
				if (!(await firely(m, mess.waits))) return;
				// Emoji yang akan digunakan
				const reactEmojis = ["⏳", "🕛", "🕒", "🕕", "🕘", "🕛", "✅"];
				// Mengirimkan reaksi secara berurutan
				for (const emoji of reactEmojis)
				{
					await shoNhe.sendMessage(m.chat,
					{
						react:
						{
							text: emoji,
							key: m.key
						}
					});
				}
				let media = await quoted.download()
				let audio = await toAudio(media, 'mp4')
				await shoNhe.sendMessage(m.chat,
				{
					document: audio,
					mimetype: 'audio/mpeg',
					fileName: `Convert By TechFix Bot.mp3`
				},
				{
					quoted: m
				})
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'restart':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				shoNherly(`reiniciando ${global.namabot}`)
				shoNherly(mess.dones)
				await sleep(3000)
				process.exit()
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tovn':
			case 'toptt':
			case 'tovoice':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!/video|audio/.test(mime)) return shoNherly(`Kirim/Reply Video/Audio Yang Ingin Dijadikan Audio Dengan Caption ${prefix + command}`)
				if (!(await firely(m, mess.waits))) return;
				// Emoji yang akan digunakan
				const reactEmojis = ["⏳", "🕛", "🕒", "🕕", "🕘", "🕛", "✅"];
				// Mengirimkan reaksi secara berurutan
				for (const emoji of reactEmojis)
				{
					await shoNhe.sendMessage(m.chat,
					{
						react:
						{
							text: emoji,
							key: m.key
						}
					});
				}
				let media = await quoted.download()
				let audio = await toPTT(media, 'mp4')
				await shoNhe.sendMessage(m.chat,
				{
					audio: audio,
					mimetype: 'audio/ogg; codecs=opus',
					ptt: true
				},
				{
					quoted: m
				})
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'togif':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!/webp|video/.test(mime)) return shoNherly(`Responder vídeo/sticker con título *${prefix + command}*`);
				shoNherly('sexo anal');
				// Emoji yang akan digunakan
				const reactEmojis = ["⏳", "🕛", "🕒", "🕕", "🕘", "🕛", "✅"];
				// Mengirimkan reaksi secara berurutan
				for (const emoji of reactEmojis)
				{
					await shoNhe.sendMessage(m.chat,
					{
						react:
						{
							text: emoji,
							key: m.key
						}
					});
				}
				let filename = 'sticker_gif'; // Nama file default jika tidak ada filename
				let media = await shoNhe.downloadAndSaveMediaMessage(qmsg, filename); // Menyertakan nama file yang valid
				if (!media)
				{
					return shoNherly('¡No se pudo descargar el medio!');
				}
				let ran = `./database/sampah/${getRandom('.gif')}`;
				exec(`convert ${media} ${ran}`, (err) =>
				{
					fs.unlinkSync(media);
					if (err) return shoNherly('No se pudo convertir la sticker❗');
					let buffer = fs.readFileSync(ran);
					shoNhe.sendMessage(m.chat,
					{
						video: buffer,
						gifPlayback: true
					},
					{
						quoted: m
					});
					fs.unlinkSync(ran);
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'brat': {
			if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return angryshoNhe(`Ejemplo : ${prefix + command} hola hermana`)
				if (!(await firely(m, mess.waits))) return;
				try {
					const buffer = await getBuffer(`https://siputzx-bart.hf.space/?q=${encodeURIComponent(text)}`)
					shoNhe.sendImageAsSticker(m.chat, buffer, m, { packname: namabot, author: namaowner })
				} catch (err) {
					RepshoNheError('Se produjo un error al crear una sticker de imagen. 😞');
				}
				if (levelUpMessage)
				{
					await shoNhe.sendMessage(m.chat,
					{
						image: levelUpMessage.image,
						caption: levelUpMessage.text,
						footer: "LEVEL UP🔥",
						buttons: [
						{
							buttonId: `${prefix}cek`,
							buttonText:
							{
								displayText: "CEK FIRE 🔥"
							}
						},
						{
							buttonId: `${prefix}menu`,
							buttonText:
							{
								displayText: "MENU 🍄"
							}
						}],
						viewOnce: true,
					},
					{
						quoted: hw
					});
				}
			}
			break;
			case 'toimage':
			case 'toimg':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!quoted) return shoNherly('Reply Image')
				if (!/webp/.test(mime)) return shoNherly(`Balas sticker dengan caption *${prefix + command}*`)
				if (!(await firely(m, mess.waits))) return;
				let media = await shoNhe.downloadAndSaveMediaMessage(quoted)
				let ran = await getRandom('.png')
				exec(`ffmpeg -i ${media} ${ran}`, (err) =>
				{
					fs.unlinkSync(media)
					if (err) throw err
					let buffer = fs.readFileSync(ran)
					shoNhe.sendMessage(m.chat,
					{
						image: buffer
					},
					{
						quoted: m
					})
					fs.unlinkSync(ran)
				})
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'bratgif':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`Contoh : ${prefix + command} Hai kak`)
				if (text.length > 250) return shoNherly(`Karakter terbatas, max 250!`)
				const words = text.split(" ")
				const tempDir = path.join(process.cwd(), 'temp')
				if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
				const framePaths = []
				await emote('⏱️');
				try
				{
					for (let i = 0; i < words.length; i++)
					{
						const currentText = words.slice(0, i + 1).join(" ")
						const res = await axios.get(`https://siputzx-bart.hf.space/?q=${encodeURIComponent(currentText)}`,
						{
							responseType: "arraybuffer"
						}).catch((e) => e.response)
						const framePath = path.join(tempDir, `frame${i}.mp4`)
						fs.writeFileSync(framePath, res.data)
						framePaths.push(framePath)
					}
					const fileListPath = path.join(tempDir, "filelist.txt")
					let fileListContent = ""
					for (let i = 0; i < framePaths.length; i++)
					{
						fileListContent += `file '${framePaths[i]}'\n`
						fileListContent += `duration 0.7\n`
					}
					fileListContent += `file '${framePaths[framePaths.length - 1]}'\n`
					fileListContent += `duration 2\n`
					fs.writeFileSync(fileListPath, fileListContent)
					const outputVideoPath = path.join(tempDir, "output.mp4")
					await execSync(`ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf "fps=30" -c:v libx264 -preset ultrafast -pix_fmt yuv420p ${outputVideoPath}`)
					await emote('✅');
					await shoNhe.sendImageAsSticker(m.chat, outputVideoPath, m,
					{
						packname: namabot,
						author: namaowner
					})
					framePaths.forEach((frame) =>
					{
						if (fs.existsSync(frame)) fs.unlinkSync(frame)
					})
					if (fs.existsSync(fileListPath)) fs.unlinkSync(fileListPath)
					if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath)
				}
				catch (e)
				{
					console.error(e)
					shoNherly(mess.error)
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case "brat2":
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly("[❗] Input teks tidak ditemukan! Kirim perintah dengan format: .bratvid <teks>");
				try
				{
					let brat = `https://fgsi-brat.hf.space/?text=${encodeURIComponent(text)}&isVideo=true`;
					let response = await axios.get(brat,
					{
						responseType: "arraybuffer"
					});
					let videoBuffer = response.data;
					let stickerBuffer = await shoNhe.sendVideoAsSticker(m.chat, videoBuffer, m,
					{
						packname: "Stiker By",
						author: "TechFix - Botz",
					});
					console.log("Stiker berhasil dibuat:", stickerBuffer);
				}
				catch (err)
				{
					console.error("Error:", err);
					shoNherly("[❗] Maaf, terjadi kesalahan saat mencoba membuat stiker video. Silakan coba lagi.");
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'toptv':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (/video/.test(mime)) return shoNherly(`Kirim/Reply Video Yang Ingin Dijadikan PTV Message Dengan Caption ${prefix + command}`)
				if ((m.quoted ? m.quoted.type : m.type) === 'videoMessage')
				{
					const anu = await quoted.download()
					const msg = await generateWAMessageContent(
					{
						video: anu
					},
					{
						upload: shoNhe.waUploadToServer
					})
					await shoNhe.relayMessage(m.chat,
					{
						ptvMessage: msg.videoMessage
					},
					{})
				}
				else
				{
					shoNherly('Reply Video Yang Mau Di Ubah Ke PTV Message!')
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tourl':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				try
				{
					if (/webp|video|sticker|audio|jpg|jpeg|png/.test(mime))
					{
						// Menambahkan pesan loading dan menyimpan key untuk edit nanti
						if (!(await firely(m, mess.waits))) return;
						// Emoji yang akan digunakan
						const reactEmojis = ["⏳", "🕛", "🕒", "🕕", "🕘", "🕛", "✅"];
						// Mengirimkan reaksi secara berurutan
						for (const emoji of reactEmojis)
						{
							await shoNhe.sendMessage(m.chat,
							{
								react:
								{
									text: emoji,
									key: m.key
								}
							});
						}
						let media = await quoted.download();
						let anu = await UguuSe(media);
						// Mengedit pesan setelah URL dihasilkan
						shoNherly('Url : ' + anu.url);
					}
					else
					{
						shoNherly('Send Media yg ingin di Upload!');
					}
				}
				catch (e)
				{
					// Mengedit pesan error jika terjadi masalah
					shoNherly('Server Uploader sedang offline!');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'img2ibb':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				try
				{
					if (/webp|jpg|jpeg|png/.test(mime))
					{
						// Menambahkan pesan loading
						await shoNhe.sendMessage(m.chat,
						{
							react:
							{
								text: '⏳',
								key: m.key
							}
						});
						// Unduh media
						let media = await quoted.download();
						let base64Media = media.toString('base64');
						// Kirim ke imgbb
						let response = await axios.post('https://api.imgbb.com/1/upload', qs.stringify(
						{
							expiration: 31536000000, // 1000 tahun
							key: ibbKey,
							image: base64Media
						}),
						{
							headers:
							{
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						});
						// Ambil URL hasil
						let url = response.data.data.url;
						// Kirim URL ke pengguna
						shoNherly(`¡Subido exitosamente!\nURL: ${url}`);
					}
					else
					{
						shoNherly('Harap kirim file media yang valid (jpg, png, dll.)!');
					}
				}
				catch (e)
				{
					console.error(e);
					shoNherly('¡Se produjo un error al cargar el archivo!');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'ttmp3':
			case 'tiktokmp3':
			case 'ttaudio':
			case 'tiktokaudio':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`Example: ${prefix + command} url_tiktok`);
				const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?(tiktok\.com|vm\.tiktok\.com)/;
				if (!tiktokRegex.test(text)) return shoNherly('Url Tidak Mengandung Result Dari TikTok!');
				try
				{
					const hasil = await tiktokDl(text);
					console.log('Hasil dari tiktokDl (audio):', JSON.stringify(hasil, null, 2));
					if (!(await firely(m, mess.waits))) return; // Jika limit habis, proses berhenti di sini
					if (hasil && hasil.music_info && hasil.music_info.url)
					{
						await shoNhe.sendMessage(m.chat,
						{
							audio:
							{
								url: hasil.music_info.url
							},
							mimetype: 'audio/mpeg',
							contextInfo:
							{
								externalAdReply:
								{
									title: 'TikTok • ' + hasil.author.nickname,
									body: `${hasil.stats.likes} suka, ${hasil.stats.comment} komentar. ${hasil.title}`,
									previewType: 'PHOTO',
									thumbnailUrl: hasil.cover,
									mediaType: 1,
									renderLargerThumbnail: true,
									sourceUrl: text,
								},
							},
						},
						{
							quoted: m
						});
					}
					else
					{
						shoNherly('Audio TikTok tidak ditemukan atau tidak valid!');
					}
				}
				catch (e)
				{
					console.error('Error saat memproses audio TikTok:', e);
					shoNherly('Gagal memproses URL! Detail error: ' + e.message);
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'addsewa':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!isGroup) return shoNherly(mess.groups);
				pler.push(m.chat)
				fs.writeFileSync('./database/sewa.json', JSON.stringify(pler))
				shoNherly(`${command} Sukses Menambahkan Ke List Sewa✅`)
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'delsewa':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!isGroup) return shoNherly(mess.groups);
				var ini = pler.indexOf(m.chat)
				pler.splice(ini, 1)
				fs.writeFileSync('./database/sewa.json', JSON.stringify(pler))
				shoNherly(`${command} Sukses Menghapus Dari List Sewa✅`)
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'ytmp3':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly('Kirim perintah dengan link YouTube!\nContoh: .ytmp3 https://youtu.be/xxxx');
				if (!isUrl(text)) return shoNherly('Link yang Anda kirim tidak valid!');
				if (!(await firely(m, mess.waits))) return;
				await downloadMp3(text); // Panggil fungsi downloadMp3
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'ytmp4':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly('Kirim perintah dengan link YouTube!\nContoh: .ytmp4 https://youtu.be/xxxx');
				if (!isUrl(text)) return shoNherly('Link yang Anda kirim tidak valid!');
				if (!(await firely(m, mess.waits))) return;
				await downloadMp4(text); // Panggil fungsi downloadMp4
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'owner':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				try
				{
					const carouselCards = [
					{
						header:
						{
							title: "Owner Bot",
							hasMediaAttachment: true,
							imageMessage: (await generateWAMessageContent(
							{
								image:
								{
									url: './ShoNheMedia/image/owner.jpg'
								}
							},
							{
								upload: shoNhe.waUploadToServer
							})).imageMessage
						},
						body:
						{
							text: `━━━━━━ ✨ *${namabot}* ✨ ━━━━━━\n🔰 *REGLAS DEL PROPIETARIO* 🔰\n🚫 No envíes spam\n🤝 Utilice la cortesía\n📵Evita llamadas\n━━━━━━ 🌟 *Gracias* 🌟 ━━━━━━`
						},
						footer:
						{
							text: `${namaowner}`
						},
						nativeFlowMessage:
						{
							buttons: [
							{
								"name": "cta_url",
								"buttonParamsJson": JSON.stringify(
								{
									display_text: `Owner (ManuDiaz)`, //ganti jadi (${namaowner})
									url: `https://wa.me/+${owner}`
								})
							}]
						}
					},
					{
						header:
						{
							title: "Bot WhatsApp",
							hasMediaAttachment: true,
							imageMessage: (await generateWAMessageContent(
							{
								image:
								{
									url: './ShoNheMedia/image/bot.jpg'
								}
							},
							{
								upload: shoNhe.waUploadToServer
							})).imageMessage
						},
						body:
						{
							text: `━━━━━━ ✨ *${namabot}* ✨ ━━━━━━\n🔰 *REGLAS DEL BOT* 🔰\n🚷 No puedo enviar spam\n💬 No puedo ser groseror\n📴 No puedo llamar\n━━━━━━ 🔥 *Gracias* 🔥 ━━━━━━`
						},
						footer:
						{
							text: `${namabot}`
						},
						nativeFlowMessage:
						{
							buttons: [
							{
								"name": "cta_url",
								"buttonParamsJson": JSON.stringify(
								{
									display_text: `Botz (${namabot})🔑`,
									url: `https://wa.me/+${botnum}`
								})
							}]
						}
					}];
					// Generate carousel message
					const carouselMessage = generateWAMessageFromContent(m.chat,
					{
						viewOnceMessage:
						{
							message:
							{
								messageContextInfo:
								{
									deviceListMetadata:
									{},
									deviceListMetadataVersion: 2
								},
								interactiveMessage: proto.Message.InteractiveMessage.fromObject(
								{
									body:
									{
										text: "━━━━━━ ✨ *𝙏𝙚𝙘𝙝𝙁𝙞𝙭 🅥❸* ✨ \n━━━━━━\n📱 *Contacto del Owner y del Bot* 📱\nSi necesitas ayuda o quieres discutir algo, no dudes en contactarnos! ✨\n\n🔗 *¡NO OLVIDES SEGUIR Y APOYAR!* 🔗\n👉 *@ManuDiaz*: www.instagram.com/\n👉 *@TechFix-Bot*: www.instagram.com/\n\n━━━━━━━━━━━━━━━━━━━━━━━\n💳 *Métodos de Pago* 💳\n━━━━━━━━━━━━━━━━━━━━━━━\n💵 [Nequi]: 3012686632\n💰 [Binance]: manuellove133@gmail.com\n🆔 [Binance ID]: 853299682\n━━━━━━━━━━━━━━━━━━━━━━━\n\n📌 *Nota:* ¡Gracias por tu apoyo y confianza! 🙏\n━━━━━━ 🔥 *¡Gracias!* 🔥 ━━━━━━"
									},
									footer:
									{
										text: `${namabot}`
									},
									header:
									{
										hasMediaAttachment: false
									},
									carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject(
									{
										cards: carouselCards
									})
								})
							}
						}
					},
					{});
					// Kirim pesan carousel
					await shoNhe.relayMessage(m.chat, carouselMessage.message,
					{
						messageId: carouselMessage.key.id
					});
				}
				catch (error)
				{
					console.error("Kesalahan saat mengirim carousel:", error);
					await shoNhe.sendMessage(m.chat,
					{
						text: "Terjadi kesalahan saat mengirim pesan carousel. Silakan hubungi AI untuk memeriksa log kesalahan."
					},
					{
						quoted: m
					});
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'payment':
    {
        if (!isRegistered(m)) {
            return sendRegister(shoNhe, m, prefix, namabot);
        }
        updatePopularCommand(command);
        const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna

        try {
            // Proses gambar sebelum digunakan dalam carousel
            const gopayImage = (await generateWAMessageContent(
                { image: { url: './ShoNheMedia/payment/gopay.jpg' } },
                { upload: shoNhe.waUploadToServer }
            )).imageMessage;

            const danaImage = (await generateWAMessageContent(
                { image: { url: './ShoNheMedia/payment/dana.jpg' } },
                { upload: shoNhe.waUploadToServer }
            )).imageMessage;

            const ovoImage = (await generateWAMessageContent(
                { image: { url: './ShoNheMedia/payment/ovo.jpg' } },
                { upload: shoNhe.waUploadToServer }
            )).imageMessage;

            const shopepayImage = (await generateWAMessageContent(
                { image: { url: './ShoNheMedia/payment/shopepay.jpg' } },
                { upload: shoNhe.waUploadToServer }
            )).imageMessage;

            const seabankImage = (await generateWAMessageContent(
                { image: { url: './ShoNheMedia/payment/seabank.jpg' } },
                { upload: shoNhe.waUploadToServer }
            )).imageMessage;

            const bcaImage = (await generateWAMessageContent(
                { image: { url: './ShoNheMedia/payment/bca.jpg' } },
                { upload: shoNhe.waUploadToServer }
            )).imageMessage;

            const danamonImage = (await generateWAMessageContent(
                { image: { url: './ShoNheMedia/payment/danamon.jpg' } },
                { upload: shoNhe.waUploadToServer }
            )).imageMessage;

            const carouselCards = [
                {
                    header: {
                        title: "GOPAY 💶",
                        hasMediaAttachment: true,
                        imageMessage: gopayImage
                    },
                    body: {
                        text: `PAGO: GOPAY\n\nNOMBRE DE USUARIO: ${namagopay}\nNOMBRE: ${nomorgopay}`
                    },
                    footer: {
                        text: `GOPAY 💶`
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({
                                    display_text: `NEXT 💬`,
                                    url: `https://wa.me/+${owner}`
                                })
                            }
                        ]
                    }
                },
                {
                    header: {
                        title: "DANA 💶",
                        hasMediaAttachment: true,
                        imageMessage: danaImage
                    },
                    body: {
                        text: `PAGO: DANA\n\nNOMBRE DE USUARIO: ${namadana}\nNOMBRE: ${nomordana}`
                    },
                    footer: {
                        text: `DANA 💶`
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({
                                    display_text: `NEXT 💬`,
                                    url: `https://wa.me/+${owner}`
                                })
                            }
                        ]
                    }
                },
                {
                    header: {
                        title: "OVO 💷",
                        hasMediaAttachment: true,
                        imageMessage: ovoImage
                    },
                    body: {
                        text: `PAGO: OVO\n\nNOMBRE DE USUARIO: ${namaovo}\nNOMBRE: ${nomorovo}`
                    },
                    footer: {
                        text: `OVO 💷`
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({
                                    display_text: `NEXT 💬`,
                                    url: `https://wa.me/+${owner}`
                                })
                            }
                        ]
                    }
                },
                {
                    header: {
                        title: "SHOPEPAY 💴",
                        hasMediaAttachment: true,
                        imageMessage: shopepayImage
                    },
                    body: {
                        text: `PAGO: SHOPEPAY\n\nNOMBRE DE USUARIO: ${namashopepay}\nNOMBRE: ${nomorshopepay}`
                    },
                    footer: {
                        text: `SHOPEPAY 💴`
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({
                                    display_text: `NEXT 💬`,
                                    url: `https://wa.me/+${owner}`
                                })
                            }
                        ]
                    }
                },
                {
                    header: {
                        title: "SEABANK 🏦",
                        hasMediaAttachment: true,
                        imageMessage: seabankImage
                    },
                    body: {
                        text: `PAGO: SEABANK\n\nNOMBRE DE USUARIO: ${namaseabank}\nNOMBRE: ${nomorseabank}`
                    },
                    footer: {
                        text: `SEABANK 🏦`
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({
                                    display_text: `NEXT 💬`,
                                    url: `https://wa.me/+${owner}`
                                })
                            }
                        ]
                    }
                },
                {
                    header: {
                        title: "BCA 🏦",
                        hasMediaAttachment: true,
                        imageMessage: bcaImage
                    },
                    body: {
                        text: `PAGO: BCA\n\nNOMBRE DE USUARIO: ${namabca}\nNOMBRE: ${nomorbca}`
                    },
                    footer: {
                        text: `BCA 🏦`
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({
                                    display_text: `NEXT 💬`,
                                    url: `https://wa.me/+${owner}`
                                })
                            }
                        ]
                    }
                },
                {
                    header: {
                        title: "DANAMON 🏦",
                        hasMediaAttachment: true,
                        imageMessage: danamonImage
                    },
                    body: {
                        text: `PAGO: DANAMON\n\nNOMBRE DE USUARIO: ${namadanamon}\nNOMBRE: ${nomordanamon}}`
                    },
                    footer: {
                        text: `DANAMON 🏦`
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({
                                    display_text: `NEXT 💬`,
                                    url: `https://wa.me/+${owner}`
                                })
                            }
                        ]
                    }
                }
            ];

            // Generate carousel message
            const carouselMessage = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                            body: {
                                text: "Aquí🪙 está 💰 todo💡 pago💸 propietario💳"
                            },
                            footer: {
                                text: `TODO PAGO`
                            },
                            header: {
                                hasMediaAttachment: false
                            },
                            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                                cards: carouselCards
                            })
                        })
                    }
                }
            }, {});

            // Kirim pesan carousel
            await shoNhe.relayMessage(m.chat, carouselMessage.message, {
                messageId: carouselMessage.key.id
            });
        } catch (error) {
            console.error("Kesalahan saat mengirim carousel:", error);
            await shoNhe.sendMessage(m.chat, {
                text: "Terjadi kesalahan saat mengirim pesan carousel. Silakan hubungi AI untuk memeriksa log kesalahan."
            }, { quoted: m });
        }

        if (levelUpMessage) {
            await shoNhe.sendMessage(m.chat, {
                image: { url: levelUpMessage.image },
                caption: levelUpMessage.text,
                footer: "LEVEL UP🔥",
                buttons: [
                    {
                        buttonId: `${prefix}tqto`,
                        buttonText: { displayText: "TQTO 💡" }
                    },
                    {
                        buttonId: `${prefix}menu`,
                        buttonText: { displayText: "MENU 🍄" }
                    }
                ],
                viewOnce: true,
            }, { quoted: hw });
        }
    }
    break;
			case 'about':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				shoNherly(`┌──┤ *SISTEMA: TechFix* ├──┐

🔐 *Nivel de Acceso:* ULTRA SECRETO
🛠️ *Código del Proyecto:* #TechFix_V3

🧠 *Génesis:*
TechFix es la fusión de dos grandes fuerzas. Es la manifestación de la colaboración entre *TechFix* y *Ansi*, dos entidades que provienen de caminos distintos pero que se han unido en una misma misión.

⚙️ *Nodo A - TechFix:*
Creado por *Manu*, el arquitecto original que diseñó la estructura base de esta infraestructura. TechFix aporta la visión y los fundamentos inquebrantables.

⚙️ *Nodo B - Ansi:*
*Tngx*, un elemento inesperado que irrumpió en la red, provocando un cambio drástico en la evolución del sistema. Ahora, Ansi es un componente esencial que impulsa las operaciones principales.

🌐 *Estado del Sistema Unificado:*
Esta colaboración ha dado origen a una red que opera de manera simultánea, liberando un poder invisible pero de gran impacto en el ecosistema tecnológico.

💻 *TechFix está ahora ACTIVO.*
El sistema sigue evolucionando, listo para romper barreras y transformar el paradigma tecnológico para siempre.

࿇ *❓ENTIDADES*
❕El Misterioso Origen de TechFix y Ansi

En las sombras del mundo digital, existen dos entidades enigmáticas que nunca se habían cruzado en la superficie: TechFix y Ansi. Ambos provienen de dimensiones desconocidas, con pasados que escapan al conocimiento de la mayoría, pero comparten una habilidad singular: la capacidad de traspasar los límites tecnológicos existentes.

*TechFix: El Portador de la Luz*

TechFix es una figura enigmática que emergió desde las profundidades de la arquitectura cibernética. Poco se sabe sobre su origen, salvo que alguna vez fue conocido como Manu, el creador de un algoritmo oculto capaz de desbloquear el máximo potencial de cualquier sistema que tocara. Operando desde las sombras, TechFix domina las estructuras desde su núcleo, utilizando técnicas tan avanzadas que se ganó el título de "El Portador de la Luz", por su capacidad de iluminar y acceder a sistemas cerrados que nadie más podía penetrar.

Algunos afirman que Manu trabajó para organizaciones tecnológicas de alto nivel antes de desaparecer sin dejar rastro. Reapareciendo como TechFix, decidió desvincularse del mundo visible y sentar las bases de algo mucho más grande, un proyecto que trasciende los límites tecnológicos actuales.

*Ansi: El Manipulador de Dimensiones*

En el otro extremo, Ansi, también conocido como Tngx, es una entidad aún más misteriosa e impredecible. Su origen es un enigma, pero aquellos que han percibido su presencia lo describen como alguien capaz de "manipular dimensiones", un término usado por quienes han sido testigos de su influencia en los sistemas.

Ansi no es visible para los métodos convencionales. Se desplaza por los intervalos imperceptibles dentro de la red global, accediendo a través de grietas que los dispositivos comunes no pueden detectar.

La llegada de Ansi a la vida de TechFix no fue planeada. Durante un ataque masivo a la red de TechFix, Ansi apareció sin previo aviso. Pero en lugar de destruir, estabilizó el sistema y lo reforzó con una seguridad que jamás había existido. Fue en ese momento cuando TechFix entendió que Ansi no era un enemigo, sino una fuerza destinada a cruzarse en su camino.

*Un Encuentro Inesperado y el Inicio de la Colaboración*

En un rincón secreto de la red, solo accesible para unos pocos, una entidad desconocida logró irrumpir. TechFix, al detectar la intrusión, se preparó para un enfrentamiento digital. Pero en un giro inesperado, los dos reconocieron sus habilidades mutuas.

TechFix, el maestro de la arquitectura digital, y Ansi, el espectro que podía fusionarse con cualquier sistema sin dejar rastro, llegaron a un acuerdo. Decidieron unir fuerzas en un proyecto que superara cualquier tecnología existente: el nacimiento de TechFix, una sinergia entre dos poderes opuestos pero complementarios.

*El Camino hacia un Proyecto Revolucionario: TechFix*

La colaboración de TechFix y Ansi superó todas sus expectativas. Lo que comenzó como una red diseñada para resolver problemas de ciberseguridad, encriptación y automatización, pronto evolucionó en algo más ambicioso. Descubrieron cómo manipular datos en dimensiones desconocidas, redefiniendo la interacción con la tecnología de formas que nadie había imaginado antes.

TechFix proporcionó la base estructural: una arquitectura inquebrantable y oculta a la vista del mundo. Ansi, por su parte, le otorgó el poder de camuflarse, de integrarse en el sistema sin ser detectado, creando un mecanismo que operaba en las sombras con máxima eficiencia.

A medida que su trabajo avanzaba, otros expertos comenzaron a unirse. Desde distintos rincones del planeta, individuos con habilidades extraordinarias fueron atraídos por la visión de TechFix. A través de canales encriptados y accesos restringidos, formaron un grupo de élite, cada uno contribuyendo con innovaciones revolucionarias.

*TechFix: Más que una Tecnología*

Después de años de perfeccionamiento, TechFix dejó de ser solo un proyecto secreto entre TechFix y Ansi. Se convirtió en una entidad independiente, un sistema autónomo capaz de evolucionar por sí mismo, aprendiendo, adaptándose y desafiando los límites tecnológicos.

Hoy en día, TechFix es considerado una leyenda en los círculos más exclusivos de la ciberseguridad. Algunos creen que es la llave para la inteligencia artificial de la próxima era, mientras que otros lo describen como una red fantasma con acceso absoluto a los sistemas del mundo.

Sin embargo, solo TechFix y Ansi conocen la verdad: TechFix es el resultado de años de exploración, alianza y genialidad.

Y su historia aún no ha terminado. Operando en la clandestinidad, siguen desarrollando la siguiente fase de su plan. Nadie sabe qué será lo próximo, pero una cosa es segura: el futuro de la tecnología está en sus manos.

└──────────────────────┘`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'shoNheai':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (args[0] === 'on')
				{
					if (autoAiStatus)
					{
						return shoNherly('Peringatan: autoAi sudah diaktifkan sebelumnya!');
					}
					autoAiStatus = true;
					return shoNherly('autoAi diaktifkan! Sekarang semua pesan akan diproses secara otomatis.');
				}
				else if (args[0] === 'off')
				{
					if (!autoAiStatus)
					{
						return shoNherly('Peringatan: autoAi sudah dinonaktifkan sebelumnya!');
					}
					autoAiStatus = false;
					return shoNherly('autoAi dinonaktifkan! Pesan tidak akan diproses secara otomatis.');
				}
				else
				{
					const warnn = "Click button shoNheAi di bawah ini sesuai dengan perintah yang king mau 👑";
					shoNhe.sendMessage(m.chat,
					{
						text: warnn,
						footer: namabot,
						buttons: [
						{
							buttonId: `${prefix}shoNheai on`,
							buttonText:
							{
								displayText: "shoNheAI ON🌵"
							}
						},
						{
							buttonId: `${prefix}shoNheai off`,
							buttonText:
							{
								displayText: "shoNheAI OFF🥦"
							}
						}],
						viewOnce: true,
					});
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'setprompt':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!text) return shoNherly(`Example: ${prefix + command} prompt text`);
				prompt = text;
				shoNherly(`Prompt berhasil diatur:\n"${prompt}"`);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'delcase':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!q) return shoNherly(`Contoh: ${prefix+command} nama case`);
				const fs = require('fs').promises;
				async function dellCase(filePath, caseNameToRemove)
				{
					try
					{
						let data = await fs.readFile(filePath, 'utf8');
						const regex = new RegExp(`case\\s+'${caseNameToRemove}':[\\s\\S]*?break`, 'g');
						const modifiedData = data.replace(regex, '');
						if (data === modifiedData)
						{
							shoNherly('Case tidak ditemukan atau sudah dihapus.');
							return;
						}
						await fs.writeFile(filePath, modifiedData, 'utf8');
						shoNherly('Sukses menghapus case!');
					}
					catch (err)
					{
						shoNherly(`Terjadi kesalahan: ${err.message}`);
					}
				}
				dellCase('./case.js', q);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'addcase':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isCreator && !isShoNheOwn) return shoNherly(mess.owners)
				if (!text) return shoNherly('Tambahkan case yang ingin di masukan');
				const namaFile = './case.js';
				const caseBaru = `${text}`;
				fs.readFile(namaFile, 'utf8', (err, data) =>
				{
					if (err)
					{
						console.error('Terjadi kesalahan saat membaca file:', err);
						return;
					}
					const posisiAwalGimage = data.indexOf("case 'addcase':");
					if (posisiAwalGimage !== -1)
					{
						const kodeBaruLengkap = data.slice(0, posisiAwalGimage) + '\n' + caseBaru + '\n' + data.slice(posisiAwalGimage);
						fs.writeFile(namaFile, kodeBaruLengkap, 'utf8', (err) =>
						{
							if (err)
							{
								shoNherly('Error File:', err);
							}
							else
							{
								shoNherly('Sukses Menambahkan case');
							}
						});
					}
					else
					{
						shoNherly('Gagal Menambahkan case');
					}
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'pushcontact':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!isGroup) return shoNherly(mess.groups);
				var name = text.split('/')[0];
				var chet = text.split('/')[1];
				if (!name) return shoNherly(`Contoh: ${prefix + command} nama/pesan`);
				if (!chet) return shoNherly(`Contoh: ${prefix + command} nama/pesan`);
				let kontak = {
					displayName: "Contact",
					contacts: [
					{
						displayName: name,
						vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;" + name + ";;;\nFN:" + name + "\nitem1.TEL;waid=" + m.sender.split('@')[0] + ":" + m.sender.split('@')[0] + "\nitem1.X-ABLabel:Ponsel\nEND:VCARD"
					}]
				}
				let push = await shoNhe.groupMetadata(m.chat)
				if (push.participants.length > 300) return shoNherly('Batas member maksimal: *300*')
				await shoNherly('sabar ajg');
				for (let a of push.participants)
				{
					const repf = await shoNhe.sendMessage(a.id,
					{
						contacts: kontak
					})
					shoNhe.sendMessage(a.id,
					{
						text: chet
					},
					{
						quoted: repf
					})
					await sleep(1000);
				}
				await shoNherly('uwes cik');
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'pushkontak3':
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (!text) return shoNherly(`Penggunaan Salah Silahkan Gunakan Command Seperti Ini\n${prefix+command} idgroup|jeda|teks\nUntuk Liat Id Group Silahkan Ketik .getgcid`)
				await shoNherly("Otw Boskuuu")
				const groupMetadataa = !m.isGroup ? await shoNhe.groupMetadata(`${q.split("|")[0]}`).catch(e =>
				{}) : ""
				const participantss = !m.isGroup ? await groupMetadataa.participants : ""
				const halls = await participantss.filter(v => v.id.endsWith('.net')).map(v => v.id)
				global.tekspushkonv3 = q.split("|")[2]
				for (let mem of halls)
				{
					if (/image/.test(mime))
					{
						media = await shoNhe.downloadAndSaveMediaMessage(quoted)
						memk = await UguuSe(media)
						await shoNhe.sendMessage(men,
						{
							image:
							{
								url: mem
							},
							caption: global.tekspushkonv3
						})
						await sleep(q.split("|")[1])
					}
					else
					{
						await shoNhe.sendMessage(mem,
						{
							text: global.tekspushkonv3
						})
						await sleep(q.split("|")[1])
					}
				}
				shoNherly("Succes Boss!")
				break
			case 'pushkontak4':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (isGroup) return shoNherly(mess.privates)
				if (!text) return shoNherly(`Penggunaan Salah Silahkan Gunakan Command Seperti Ini\n${prefix+command} jeda|teks`)
				await shoNherly("Otw Boskuuu")
				const halsss = await participants.filter(v => v.id.endsWith('.net')).map(v => v.id)
				global.tekspushkonv4 = text.split("|")[1]
				for (let men of halsss)
				{
					if (/image/.test(mime))
					{
						media = await shoNhe.downloadAndSaveMediaMessage(quoted)
						mem = await UguuSe(media)
						await shoNhe.sendMessage(men,
						{
							image:
							{
								url: mem
							},
							caption: global.tekspushkonv4
						})
						await sleep(text.split("|")[0])
					}
					else
					{
						await shoNhe.sendMessage(men,
						{
							text: global.tekspushkonv4
						})
						await sleep(text.split("|")[0])
					}
				}
				shoNherly("Succes Boss!")
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case "closetime":
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins) return shoNherly(mess.admins);
				if (!isBotAdmins) return shoNherly(mess.abots);
				if (args[1] == "segundos")
				{
					var timer = args[0] * `1000`;
				}
				else if (args[1] == "minutos")
				{
					var timer = args[0] * `60000`;
				}
				else if (args[1] == "horas")
				{
					var timer = args[0] * `3600000`;
				}
				else if (args[1] == "dia")
				{
					var timer = args[0] * `86400000`;
				}
				else
				{
					return shoNherly("*elige:*\nsegundos\nminutos\nhoras\n\n*ejemplo*\n10 segundos");
				}
				shoNherly(`El tiempo de cierre del grupo ${q} comienza desde ahora`);
				setTimeout(() =>
				{
					var nomor = m.participant;
					const close = `*Puntual* el grupo ha sido cerrado por el administrador\nahora solo los administradores pueden enviar mensajes`;
					shoNhe.groupSettingUpdate(from, "announcement");
					shoNherly(close);
				}, timer);
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'spotify':
			case 'spotifysearch':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`Example: ${prefix + command} alan walker alone`)
				if (!(await firely(m, mess.waits))) return;
				try
				{
					let hasil = await fetchJson('https://www.bhandarimilan.info.np/spotisearch?query=' + encodeURIComponent(text));
					let txt = hasil.map(a =>
					{
						return `*Name : ${a.name}*\n- Artist : ${a.artist}\n- Url : ${a.link}`
					}).join`\n\n`
					shoNherly(txt)
				}
				catch (e)
				{
					shoNherly('Server Search Offline!')
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'suitpvp': case 'suit': {
				let poin = 10
				let poin_lose = 10
				let timeout = 60000
				if (Object.values(suit).find(roof => roof.id.startsWith('suit') && [roof.p, roof.p2].includes(m.sender))) m.reply(`Selesaikan suit mu yang sebelumnya`)
				if (m.mentionedJid[0] === m.sender) return m.reply(`Tidak bisa bermain dengan diri sendiri !`)
				if (!m.mentionedJid[0]) return m.reply(`_Siapa yang ingin kamu tantang?_\nTag orangnya..\n\nContoh : ${prefix}suit @${owner[0]}`, m.chat, { mentions: [owner[1] + '@s.whatsapp.net'] })
				if (Object.values(suit).find(roof => roof.id.startsWith('suit') && [roof.p, roof.p2].includes(m.mentionedJid[0]))) return m.reply(`Orang yang kamu tantang sedang bermain suit bersama orang lain :(`)
				let id = 'suit_' + new Date() * 1
				let caption = `_*SUIT PvP*_\n\n@${m.sender.split`@`[0]} menantang @${m.mentionedJid[0].split`@`[0]} untuk bermain suit\n\nSilahkan @${m.mentionedJid[0].split`@`[0]} untuk ketik terima/tolak`
				suit[id] = {
					chat: m.reply(caption),
					id: id,
					p: m.sender,
					p2: m.mentionedJid[0],
					status: 'wait',
					waktu: setTimeout(() => {
						if (suit[id]) m.reply(`_Waktu suit habis_`)
						delete suit[id]
					}, 60000), poin, poin_lose, timeout
				}
			}
			break
			case 'ttc': case 'ttt': case 'tictactoe': {
				let TicTacToe = require('./lib/tictactoe');
				if (Object.values(tictactoe).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) return m.reply(`Kamu masih didalam game!\nKetik *${prefix}del${command}* Jika Ingin Mengakhiri sesi`);
				let room = Object.values(tictactoe).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
				if (room) {
					m.reply('Partner ditemukan!')
					room.o = m.chat
					room.game.playerO = m.sender
					room.state = 'PLAYING'
					let arr = room.game.render().map(v => {
						return {X: '❌',O: '⭕',1: '1️⃣',2: '2️⃣',3: '3️⃣',4: '4️⃣',5: '5️⃣',6: '6️⃣',7: '7️⃣',8: '8️⃣',9: '9️⃣'}[v]
					})
					let str = `Room ID: ${room.id}\n\n${arr.slice(0, 3).join('')}\n${arr.slice(3, 6).join('')}\n${arr.slice(6).join('')}\n\nMenunggu @${room.game.currentTurn.split('@')[0]}\n\nKetik *nyerah* untuk menyerah dan mengakui kekalahan`
					if (room.x !== room.o) await shoNhe.sendMessage(room.x, { texr: str, mentions: parseMention(str) }, { quoted: m })
					await shoNhe.sendMessage(room.o, { text: str, mentions: parseMention(str) }, { quoted: m })
				} else {
					room = {
						id: 'tictactoe-' + (+new Date),
						x: m.chat,
						o: '',
						game: new TicTacToe(m.sender, 'o'),
						state: 'WAITING',
						waktu: setTimeout(() => {
							if (tictactoe[roomnya.id]) m.reply(`_Waktu ${command} habis_`)
							delete tictactoe[roomnya.id]
						}, 300000)
					}
					if (text) room.name = text
					shoNhe.sendMessage(m.chat, { text: 'Menunggu partner' + (text ? ` mengetik command dibawah ini ${prefix}${command} ${text}` : ''), mentions: m.mentionedJid }, { quoted: m })
					tictactoe[room.id] = room
				}
			}
			break
			case 'tebakbom': {
				if (tebakbom[m.sender]) return m.reply('Masih Ada Sesi Yang Belum Diselesaikan!')
				tebakbom[m.sender] = {
					petak: [0, 0, 0, 2, 0, 2, 0, 2, 0, 0].sort(() => Math.random() - 0.5),
					board: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'],
					bomb: 3,
					lolos: 7,
					pick: 0,
					nyawa: ['❤️', '❤️', '❤️'],
					waktu: setTimeout(() => {
						if (tebakbom[m.sender]) m.reply(`_Waktu ${command} habis_`)
						delete tebakbom[m.sender];
					}, 120000)
				}
				m.reply(`*TEBAK BOM*\n\n${tebakbom[m.sender].board.join("")}\n\nPilih lah nomor tersebut! dan jangan sampai terkena Bom!\nBomb : ${tebakbom[m.sender].bomb}\nNyawa : ${tebakbom[m.sender].nyawa.join("")}`);
			}
			break
			case 'delete':
			case 'del':
			case 'd':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!m.quoted) return shoNherly('Responde al mensaje que deseas eliminar')
				await shoNhe.sendMessage(m.chat,
				{
					delete:
					{
						remoteJid: m.chat,
						fromMe: m.isBotAdmins ? false : true,
						id: m.quoted.id,
						participant: m.quoted.sender
					}
				})
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'spotifydl':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`Ejemplo: ${prefix + command} https://open.spotify.com/track/0JiVRyTJcJnmlwCZ854K4p`);
				if (!isUrl(args[0]) || !args[0].includes('open.spotify.com/track')) return shoNherly('¡URL no válida!');
				if (!(await firely(m, mess.waits))) return;
				try {
    let res = await fetch(`https://api.siputzx.my.id/api/d/spotify?url=${text}`);
    let json = await res.json();
    
    console.log(json); // Para depurar y ver la respuesta en la consola
    
    if (!json.status) return shoNherly('Error: No se pudo obtener datos de la API.');

    let { data } = json; // Extraer la información dentro de "data"
    if (!data.download) return shoNherly('Error: No se encontró un enlace de descarga.');

    await shoNhe.sendMessage(m.chat, {
        audio: { url: data.download },
        fileName: `${data.title}.mp3`,
        mimetype: 'audio/mpeg'
    }, { quoted: hw });

    shoNherly('Música enviada correctamente, ¡disfrútala!');
} catch (e) {
    console.error(e);
    shoNherly('Error: No se pudo descargar la música.');
}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			//OPENTIME
			case "opentime":
				if (!isGroup) return shoNherly(mess.groups);
				if (!isAdmins) return shoNherly(mess.admins);
				if (!isBotAdmins) return shoNherly(mess.abots);
				if (args[1] == "segundos")
				{
					var timer = args[0] * `1000`;
				}
				else if (args[1] == "minutos")
				{
					var timer = args[0] * `60000`;
				}
				else if (args[1] == "horas")
				{
					var timer = args[0] * `3600000`;
				}
				else if (args[1] == "dia")
				{
					var timer = args[0] * `86400000`;
				}
				else
				{
					return shoNherly("*elige:*\nsegundos\nminutos\nhoras\n\n*ejemplo*\n10 segundos");
				}
				shoNherly(`El tiempo de apertura del grupo ${q} comienza desde ahora`);
				setTimeout(() =>
				{
					var nomor = m.participant;
					const open = `*Puntual* el grupo ha sido abierto por el administrador\n ahora los miembros pueden enviar mensajes`;
					shoNhe.groupSettingUpdate(from, "not_announcement");
					shoNherly(open);
				}, timer);
				break
				// Menyusun perintah ffmpeg untuk membuat gambar dengan overlay
			case 'qc':{
			if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return angryshoNhe('Input teksnya!')
				if (!(await firely(m, mess.waits))) return;
				const sender = m.sender
				const username = await shoNhe.getName(m.quoted ? m.quoted.sender : sender)
				const avatar = await shoNhe.profilePictureUrl(m.quoted ? m.quoted.sender : sender, "image").catch(() => 'https://files.catbox.moe/a6zaap.jpg')
				const json = {
					type: "quote",
					format: "png",
					backgroundColor: "#FFFFFF",
					width: 512,
					height: 512,
					scale: 2,
					"messages": [
						{
							"entities": [],
							"avatar": true,
							"from": {
								"id": 1,
								"name": username,
								"photo": {
									"url": avatar
								}
							},
							"text": text,
							"replyMessage": {}
						}
					],
				};
				axios.post("https://bot.lyo.su/quote/generate", json, {
					headers: {"Content-Type": "application/json"},
				})
				.then(async (res) => {
					const buffer = Buffer.from(res.data.result.image, "base64");
					let encmedia = await shoNhe.sendImageAsSticker(m.chat, buffer, m, { packname: namabot, author: namaowner, categories: ['🤩', '🎉'], id: '12345', quality: 100, background: 'transparent'})
					await fs.unlinkSync(encmedia)
				})
				if (levelUpMessage)
				{
					await shoNhe.sendMessage(m.chat,
					{
						image: levelUpMessage.image,
						caption: levelUpMessage.text,
						footer: "LEVEL UP🔥",
						buttons: [
						{
							buttonId: `${prefix}cek`,
							buttonText:
							{
								displayText: "CEK FIRE 🔥"
							}
						},
						{
							buttonId: `${prefix}menu`,
							buttonText:
							{
								displayText: "MENU 🍄"
							}
						}],
						viewOnce: true,
					},
					{
						quoted: hw
					});
				}
			}
			break;
			case 's': case 'sticker': case 'stiker': {
			if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!quoted) return angryshoNhe (`Kirim atau balas gambar/video/gif dengan caption ${prefix + command}\nDurasi video 1-9 detik ya!`);
				if (!mime) return angryshoNhe (`Kirim atau balas gambar/video/gif dengan caption ${prefix + command}\nDurasi video 1-9 detik ya!`);
	if (!(await firely(m, mess.waits))) return;
				if (/image/.test(mime)) {
					let media = await shoNhe.downloadAndSaveMediaMessage(quoted);
					await shoNhe.sendImageAsSticker(m.chat, media, m, { packname: namabot, author: namaowner });
				} else if (/video/.test(mime)) {
					if ((quoted.msg || quoted).seconds > 9) return angryshoNhe (`Durasi video terlalu panjang! 🕒 Kirim video dengan durasi 1-9 detik ya!`);
					let media = await shoNhe.downloadAndSaveMediaMessage(quoted);
					await shoNhe.sendVideoAsSticker(m.chat, media, m, { packname: namabot, author: namaowner });
				} else {
					angryshoNhe (`Kirim atau balas gambar/video/gif dengan caption ${prefix + command}\nDurasi video 1-9 detik ya!`);
				}
				if (levelUpMessage)
				{
					await shoNhe.sendMessage(m.chat,
					{
						image: levelUpMessage.image,
						caption: levelUpMessage.text,
						footer: "LEVEL UP🔥",
						buttons: [
						{
							buttonId: `${prefix}cek`,
							buttonText:
							{
								displayText: "CEK FIRE 🔥"
							}
						},
						{
							buttonId: `${prefix}menu`,
							buttonText:
							{
								displayText: "MENU 🍄"
							}
						}],
						viewOnce: true,
					},
					{
						quoted: hw
					});
				}
			}
			break;
			case 'smeme': case 'stickermeme': case 'stickmeme': {
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!(await firely(m, mess.waits))) return;
				if (!/webp/.test(mime) && /image/.test(mime)) {
					if (!text) return angryshoNhe(`Penggunaan: ${prefix + command} teks_atas|teks_bawah`);
		
					atas = text.split('|')[0] ? text.split('|')[0] : '';
					bawah = text.split('|')[1] ? text.split('|')[1] : '';
		
					let mee = await shoNhe.downloadAndSaveMediaMessage(quoted);
					let mem = await CatBox(mee);
					let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${mem}`;
		
					await shoNhe.sendImageAsSticker(m.chat, meme, m, { packname: namabot, author: namaowner });
				} else {
					shoNherly(`Kirim atau balas gambar dengan caption ${prefix + command} teks_atas|teks_bawah untuk membuat meme!`);
				}
				if (levelUpMessage)
				{
					await shoNhe.sendMessage(m.chat,
					{
						image: levelUpMessage.image,
						caption: levelUpMessage.text,
						footer: "LEVEL UP🔥",
						buttons: [
						{
							buttonId: `${prefix}cek`,
							buttonText:
							{
								displayText: "CEK FIRE 🔥"
							}
						},
						{
							buttonId: `${prefix}menu`,
							buttonText:
							{
								displayText: "MENU 🍄"
							}
						}],
						viewOnce: true,
					},
					{
						quoted: hw
					});
				}
			}
			break;
			case 'tqto':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				// Jika menggunakan fungsi untuk mencatat penggunaan command
				const url = 'https://raw.githubusercontent.com/ManuelLove/Config/refs/heads/main/data.json';
            const response = await fetch(url);
            const data = await response.json();
            // Kirim pesan dengan data yang didapatkan menggunakan nhebotxrly()
            const message = `╔━◇ *${c}Premios para${c}* ◇━╗
║  
║   🛠️ *Gracias a:*
║   ${data.tqto}
║
║   👑 *Propietario del Bot:*
║   ${data.owners}
║
╚═━━━◇━━━━━━━━━━━━═╝

╔━◇🌐 *${c}Redes Sociales${c}* 🌐◇━╗
║  
║   📡 *Grupo:* ${wagc}
║   📺 *Canal:* ${wach}
║ ¿Quieres donar? Escribe _.payment_
╚═━━━◇🌐━━━━━━━━━━━━━━━━═╝

🔒 *Registro del sistema completado. Node asegurado.* 🔒
`;
				shoNhe.sendMessage(m.chat,
				{
					image: tqq,
					caption: message,
					footer: namabot,
					buttons: [
					{
						buttonId: `${prefix}about`,
						buttonText:
						{
							displayText: "About 👤"
						}
					},
					{
						buttonId: `${prefix}contact`,
						buttonText:
						{
							displayText: "Contact 📞"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'play':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text) return shoNherly(`Ejemplo: ${prefix + command} título de la canción`);
				try
				{
					// Cari hasil di YouTube menggunakan API
					let search = await yts(text);
					if (!search.all.length) return shoNherly("❌ ¡No se encontraron resultados de búsqueda!");
					if (!(await firely(m, mess.waits))) return;
					// Ambil hanya hasil pertama
					let video = search.all[0];
					let message = `🎥 *Título:* ${video.title}\n👁 *Vistas:* ${video.views}\n⏱ *Duración:* ${video.timestamp}\n📆 *Subido:* ${video.ago}\n🔗 *URL:* ${video.url}`;
					// Kirim pesan dengan dua tombol (YTMP3 dan YTMP4)
					await shoNhe.sendMessage(m.chat,
					{
						image:
						{
							url: video.thumbnail
						},
						caption: message,
						footer: namabot,
						buttons: [
						{
							buttonId: `${prefix}ytmp3 ${video.url}`,
							buttonText:
							{
								displayText: "MUSICA 🎵"
							}
						},
						{
							buttonId: `${prefix}ytmp4 ${video.url}`,
							buttonText:
							{
								displayText: "VIDEO 🎥"
							}
						}],
						viewOnce: true,
					},
					{
						quoted: hw
					});
				}
				catch (e)
				{
					console.error("Kesalahan saat memproses permintaan YouTube Search:", e);
					await shoNhe.sendMessage(m.chat,
					{
						text: "❌ Terjadi kesalahan saat memproses pencarian YouTube. Silakan coba lagi."
					},
					{
						quoted: hw
					});
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break;
			case 'wogwogg':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const teki = 'yess bisaa'
				let msg = generateWAMessageFromContent(m.chat,
				{
					viewOnceMessage:
					{
						message:
						{
							messageContextInfo:
							{
								deviceListMetadata:
								{},
								deviceListMetadataVersion: 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.create(
							{
								body: proto.Message.InteractiveMessage.Body.create(
								{
									text: teki
								}),
								footer: proto.Message.InteractiveMessage.Footer.create(
								{
									text: namabot
								}),
								header: proto.Message.InteractiveMessage.Header.create(
								{
									title: ``,
									gifPlayback: true,
									subtitle: namaowner,
									hasMediaAttachment: false
								}),
								nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
								{
									buttons: [
									{
										"name": "single_select",
										"buttonParamsJson": `{
                            "title": "Settings",
                            "sections": [{
                                "title": "Select Settings",
                                "rows": [{
                                    "title": "💬 AUTOTYPING ON",
                                    "description": "Bot akan mengaktifkan auto typing",
                                    "id": "${prefix}autotypingon"
                                },
                                {
                                    "title": "📝 AUTOBIO OFF",
                                    "description": "Mematikan fitur autobio",
                                    "id": "${prefix}autobio off"
                                },
                                            {
                "buttonId": "${prefix}about",
                "buttonText": { "displayText": "About 👤" }
            },
            {
                "buttonId": "${prefix}contact",
                buttonText: { "displayText": "Contact 📞" }
            }]
                            }]
                        }`
									}]
								}),
								contextInfo:
								{
									mentionedJid: [m.sender],
									forwardingScore: 999,
									isForwarded: true,
									forwardedNewsletterMessageInfo:
									{
										newsletterJid: '12036338334723329@newsletter',
										newsletterName: namaowner,
										serverMessageId: 143
									}
								}
							})
						}
					},
				},
				{});
				// Kirim pesan gabungan
				await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
				{
					messageId: msg.key.id
				});
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tiktokslide':
			case 'ttslide':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!text)
				{
					console.log('No se encontró el texto de la URL de TikTok.');
					return shoNherly(`Ejemplo: ${prefix + command} url_tiktok`);
				}
				const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?(tiktok\.com|vm\.tiktok\.com)/;
				if (!tiktokRegex.test(text))
				{
					console.log('URL tidak valid, tidak mengandung hasil dari TikTok.');
					return shoNherly('¡La URL no contiene resultados de TikTok!');
				}
				if (!(await firely(m, mess.waits))) return;
				try
				{
					console.log('Memulai proses pengunduhan dari URL TikTok:', text);
					const hasil = await tiktokDl(text);
					if (!hasil || !hasil.data || hasil.data.length === 0)
					{
						console.log('Tidak ada gambar atau media yang ditemukan.');
						return shoNherly('¡No se encontraron fotos!');
					}
					// Buat carousel card untuk setiap gambar
					const carouselCards = await Promise.all(hasil.data.map(async (item, index) =>
					{
						return {
							header:
							{
								title: `Foto ${index + 1}`,
								hasMediaAttachment: true,
								imageMessage: (await generateWAMessageContent(
								{
									image:
									{
										url: item.url
									}
								},
								{
									upload: shoNhe.waUploadToServer
								})).imageMessage,
							},
							body:
							{
								text: `Foto ${index + 1} de TikTok`,
							},
							footer:
							{
								text: "Haga clic en el botón para ver más detalles",
							},
							nativeFlowMessage:
							{
								buttons: [
								{
									name: "cta_url",
									buttonParamsJson: JSON.stringify(
									{
										display_text: "Compruébalo en TikTok",
										url: text,
									}),
								},
								{
									name: "cta_url",
									buttonParamsJson: JSON.stringify(
									{
										display_text: "Descargar fotos",
										url: item.url,
									}),
								}],
							},
						};
					}));
					// Buat pesan carousel
					const carouselMessage = generateWAMessageFromContent(m.chat,
					{
						viewOnceMessage:
						{
							message:
							{
								messageContextInfo:
								{
									deviceListMetadata:
									{},
									deviceListMetadataVersion: 2,
								},
								interactiveMessage: proto.Message.InteractiveMessage.fromObject(
								{
									body:
									{
										text: `Resultados de fotos de TikTok: ${text}`
									},
									footer:
									{
										text: "Diapositivas de TikTok Bot by TechFix"
									},
									header:
									{
										hasMediaAttachment: false
									},
									carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject(
									{
										cards: carouselCards,
									}),
								}),
							},
						},
					},
					{});
					// Kirim pesan carousel
					await shoNhe.relayMessage(m.chat, carouselMessage.message,
					{
						messageId: carouselMessage.key.id
					});
					console.log('Carousel dikirimkan dengan sukses.');
				}
				catch (e)
				{
					console.error('Gagal mengunduh atau membuat carousel:', e);
					shoNherly('No se pudo procesar su solicitud. Por favor inténtalo de nuevo.');
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'tesbtn':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const wawa = `halo njir wkwk`
				let msg = generateWAMessageFromContent(m.chat,
				{
					viewOnceMessage:
					{
						message:
						{
							"messageContextInfo":
							{
								"deviceListMetadata":
								{},
								"deviceListMetadataVersion": 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.create(
							{
								body: proto.Message.InteractiveMessage.Body.create(
								{
									text: wawa
								}),
								footer: proto.Message.InteractiveMessage.Footer.create(
								{
									text: namabot
								}),
								header: proto.Message.InteractiveMessage.Header.create(
								{
									...(await prepareWAMessageMedia(
									{
										image: getRandomThumb2()
									},
									{
										upload: shoNhe.waUploadToServer
									})),
									title: ``,
									gifPlayback: true,
									subtitle: namaowner,
									hasMediaAttachment: false
								}),
								nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
								{
									buttons: [
									{
										"name": "cta_url",
										"buttonParamsJson": "{\"display_text\":\"YouTube 💛\",\"url\":\"https://www.youtube.com/@Kiqozho_official\",\"merchant_url\":\"https://www.google.com\"}"
									},
									{
										"name": "cta_url",
										"buttonParamsJson": "{\"display_text\":\"Telegram 💧\",\"url\":\"https://t.me/QozhoStore\",\"merchant_url\":\"https://www.google.com\"}"
									},
									{
										"name": "cta_url",
										"buttonParamsJson": "{\"display_text\":\"GitHub 🔘\",\"url\":\"https://github.com/DGXeon\",\"merchant_url\":\"https://www.google.com\"}"
									},
									{
										"name": "cta_url",
										"buttonParamsJson": "{\"display_text\":\"WhatsApp ☘️\",\"url\":\"https://whatsapp.com/channel/0029VanqPsCEFeXhWmSSis33\",\"merchant_url\":\"https://www.google.com\"}"
									},
									{
										"name": "quick_reply",
										"buttonParamsJson": `{"display_text":"Allmenu 🗂️","id":"${prefix}allmenu"}`
									},
									{
										"name": "quick_reply",
										"buttonParamsJson": `{"display_text":"Owner 👤","id":"${prefix}owner"}`
									},
									{
										"name": "quick_reply",
										"buttonParamsJson": `{"display_text":"Script 📃","id":"${prefix}script"}`
									}],
								}),
								contextInfo:
								{
									mentionedJid: [m.sender],
									forwardingScore: 999,
									isForwarded: true,
									forwardedNewsletterMessageInfo:
									{
										newsletterJid: '12036338334723329@newsletter',
										newsletterName: namaowner,
										serverMessageId: 143
									}
								}
							})
						}
					},
				},
				{})
				await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
				{
					messageId: msg.key.id
				})
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'getcase':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				if (!text) return shoNherly('Masukkan Nama Casenya!')
				try
				{
					const getCase = (cases) =>
					{
						return "case" + `'${cases}'` + fs.readFileSync("case.js").toString().split('case \'' + cases + '\'')[1].split("break")[0] + "break"
					}
					shoNherly(`${getCase(text)}`)
				}
				catch (e)
				{
					shoNherly(`case ${text} tidak ditemukan!`)
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'mode':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNhe.sendMessage(from,
				{
					text: mess.owners
				});
				if (!text)
				{
					const warnn = "⚙️ Seleccione el modo bot a continuación:";
					let msg = generateWAMessageFromContent(m.chat,
					{
						viewOnceMessage:
						{
							message:
							{
								"messageContextInfo":
								{
									"deviceListMetadata":
									{},
									"deviceListMetadataVersion": 2
								},
								interactiveMessage: proto.Message.InteractiveMessage.create(
								{
									body: proto.Message.InteractiveMessage.Body.create(
									{
										text: warnn
									}),
									footer: proto.Message.InteractiveMessage.Footer.create(
									{
										text: namabot
									}),
									header: proto.Message.InteractiveMessage.Header.create(
									{
										title: ``,
										gifPlayback: true,
										subtitle: namaowner,
										hasMediaAttachment: false
									}),
									nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
									{
										buttons: [
										{
											"name": "single_select",
"buttonParamsJson": `{
    "title": "🪀 Modo Bot",
    "sections": [{
        "title": "Seleccionar Modo",
        "rows": [{
            "title": "🚀 MODO PÚBLICO",
            "description": "El bot responderá a todos los mensajes",
            "id": "${prefix}mode public"
        },
        {
            "title": "🚀 MODO INDIVIDUAL",
            "description": "El bot no responderá a ningún chat",
            "id": "${prefix}mode self"
        },
        {
            "title": "🛸 MODO GRUPO ACTIVADO",
            "description": "El bot solo responderá a los mensajes en grupos",
            "id": "${prefix}groupon"
        },
        {
            "title": "🛸 MODO GRUPO DESACTIVADO",
            "description": "El bot responderá a todos los mensajes",
            "id": "${prefix}groupoff"
        },
        {
            "title": "✈️ MODO PRIVADO ACTIVADO",
            "description": "El bot solo responderá a mensajes privados",
            "id": "${prefix}privatechatonly on"
        },
        {
            "title": "✈️ MODO PRIVADO DESACTIVADO",
            "description": "El bot responderá a todos los mensajes privados",
            "id": "${prefix}privatechatonly off"
													}]
												}]
											}`
										}],
									}),
									contextInfo:
									{
										mentionedJid: [m.sender],
										forwardingScore: 999,
										isForwarded: true,
										forwardedNewsletterMessageInfo:
										{
											newsletterJid: '12036338334723329@newsletter',
											newsletterName: namaowner,
											serverMessageId: 143
										}
									}
								})
							}
						},
					},
					{})
					await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
					{
						messageId: msg.key.id
					})
					return;
				}
				if (text.toLowerCase() === 'self')
				{
					global.public = false;
					shoNhe.sendMessage(from,
					{
						text: '✅ El bot ahora está en modo *SELF*. Sólo el propietario puede utilizar el bot.'
					});
				}
				else if (text.toLowerCase() === 'public')
				{
					global.public = true;
					shoNhe.sendMessage(from,
					{
						text: '✅ El bot ahora está en modo *PÚBLICO*. Todos pueden utilizar el bot.'
					});
				}
				else
				{
					shoNhe.sendMessage(from,
					{
						text: '❌ ¡Modo no válido! Utilice *self* o *public*.'
					});
				}
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			// Case: Aktifkan Mode Group Only
			case 'groupon':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (global.groupOnly) return shoNherly('⚠️ El modo Sólo grupo está activo.')
				global.groupOnly = true
				global.privateChatOnly = false
				global.public = true // Nonaktifkan mode public
				shoNherly('✅ ¡Modo Sólo Grupo activado!\n❌ El modo privado está desactivado.')
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			// Case: Nonaktifkan Mode Group Only
			case 'groupoff':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners)
				if (!global.groupOnly) return shoNherly('⚠️ El modo Solo grupo está deshabilitado.')
				global.groupOnly = false
				global.public = true // Aktifkan kembali mode public
				shoNherly('❌ ¡El modo Sólo grupo está deshabilitado!\n✅ El modo público está activado.')
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case "casecek":
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return shoNherly(mess.owners);
				fs.readFile("./case.js", "utf8", (err, data) =>
				{
					if (err) throw err
					let regex = /case\s"(\w+)"/g
					let match, caseNames = []
					while ((match = regex.exec(data)) !== null)
					{
						caseNames.push(match[1])
					}
					let output = `${simbols} ` + caseNames.join(`\n${simbols} `)
					shoNherly(output + `\n\nTotal case : ${caseNames.length}`)
				})
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			case 'eval':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return;
				try
				{
					const result = await eval(`(async () => { return ${text} })()`);
					shoNherly(util.format(result));
				}
				catch (err)
				{
					shoNherly(String(err));
				}
				}
			break
			case 'exec':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return;
				exec(text, (err, stdout) =>
				{
					if (err) return shoNherly(`${err}`);
					if (stdout) return shoNherly(stdout);
				});
				}
			break
			case 'return':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				if (!isShoNheOwn) return;

				function Return(sul)
				{
					const sat = JSON.stringify(sul, null, 2);
					const bang = util.format(sat) || util.format(sul);
					return shoNherly(bang);
				}
				try
				{
					shoNherly(util.format(eval(`(async () => { return ${text} })()`)));
				}
				catch (err)
				{
					shoNherly(String(err));
				}
				}
			break
			// ====================================================== //
			case '1ccxz':
			case '2ccxz':
			case '3ccxz':
			case '4ccxz':
			case '5ccxz':
			case '6ccxz':
			case '7ccxz':
			case '8ccxz':
			case '9ccxz':
			case '10ccxz':
			case '11ccxz':
			case '12ccxz':
			case '13ccxz':
			case '14ccxz':
			case '15ccxz':
			case '16ccxz':
			case '17ccxz':
			case '18ccxz':
			case '19ccxz':
			case '20ccxz':
			case '21ccxz':
			case '22ccxz':
			case '23ccxz':
			case '24ccxz':
			case '25ccxz':
			case '26ccxz':
			case '27ccxz':
			case '28ccxz':
			case '29ccxz':
			case '30ccxz':
			case '31ccxz':
			case '32ccxz':
			case '33ccxz':
			case '34ccxz':
			case '35ccxz':
			case '36ccxz':
			case '37ccxz':
			case '38ccxz':
			case '39ccxz':
			case '40ccxz':
			case '41ccxz':
			case '42ccxz':
			case '43ccxz':
			case '44ccxz':
			case '45ccxz':
			case '46ccxz':
			case '47ccxz':
			case '48ccxz':
			case '49ccxz':
			case '50ccxz':
			case '51ccxz':
			case '52ccxz':
			case '53ccxz':
			case '54ccxz':
			case '55ccxz':
			case '56ccxz':
			case '57ccxz':
			case '58ccxz':
			case '59ccxz':
			case '60ccxz':
			case '61ccxz':
			case '62ccxz':
			case '63ccxz':
			case '64ccxz':
			case '65ccxz':
			case '66ccxz':
			case '67ccxz':
			case '68ccxz':
			case '69ccxz':
			case '70ccxz':
			case '71ccxz':
			case '72ccxz':
			case '73ccxz':
			case '74ccxz':
			case '75ccxz':
			case '76ccxz':
			case '77ccxz':
			case '78ccxz':
			case '79ccxz':
			case '80ccxz':
			case '81ccxz':
			case '82ccxz':
			case '83ccxz':
			case '84ccxz':
			case '85ccxz':
			case '86ccxz':
			case '87ccxz':
			case '88ccxz':
			case '89ccxz':
			case '90ccxz':
			case '91ccxz':
			case '92ccxz':
			case '93ccxz':
			case '94ccxz':
			case '95ccxz':
			case '96ccxz':
			case '97ccxz':
			case '98ccxz':
			case '99ccxz':
			case '100ccxz':
			case '101ccxz':
			case '102ccxz':
			case '103ccxz':
			case '104ccxz':
			case '105ccxz':
			case '106ccxz':
			case '107ccxz':
			case '108ccxz':
			case '109ccxz':
			case '110ccxz':
			case '111ccxz':
			case '112ccxz':
			case '113ccxz':
			case '114ccxz':
			case '115ccxz':
			case '116ccxz':
			case '117ccxz':
			case '118ccxz':
			case '119ccxz':
			case '120ccxz':
			case '121ccxz':
			case '122ccxz':
			case '123ccxz':
			case '124ccxz':
			case '125ccxz':
			case '126ccxz':
			case '127ccxz':
			case '128ccxz':
			case '129ccxz':
			case '130ccxz':
			case '131ccxz':
			case '132ccxz':
			case '133ccxz':
			case '134ccxz':
			case '135ccxz':
			case '136ccxz':
			case '137ccxz':
			case '138ccxz':
			case '139ccxz':
			case '140ccxz':
			case '141ccxz':
			case '142ccxz':
			case '143ccxz':
			case '144ccxz':
			case '145ccxz':
			case '146ccxz':
			case '147ccxz':
			case '148ccxz':
			case '149ccxz':
			case '150ccxz':
			case '151ccxz':
			case '152ccxz':
			case '153ccxz':
			case '154ccxz':
			case '155ccxz':
			case '156ccxz':
			case '157ccxz':
			case '158ccxz':
			case '159ccxz':
			case '160ccxz':
			case '161ccxz':
			case '162ccxz':
			case '163ccxz':
			case '164ccxz':
			case '165ccxz':
			case '166ccxz':
			case '167ccxz':
			case '168ccxz':
			case '169ccxz':
			case '170ccxz':
			case '171ccxz':
			case '172ccxz':
			case '173ccxz':
			case '174ccxz':
			case '175ccxz':
			case '176ccxz':
			case '177ccxz':
			case '178ccxz':
			case '179ccxz':
			case '180ccxz':
			case '181ccxz':
			case '182ccxz':
			case '183ccxz':
			case '184ccxz':
			case '185ccxz':
			case '186ccxz':
			case '187ccxz':
			case '188ccxz':
			case '189ccxz':
			case '190ccxz':
			case '191ccxz':
			case '192ccxz':
			case '193ccxz':
			case '194ccxz':
			case '195ccxz':
			case '196ccxz':
			case '197ccxz':
			case '198ccxz':
			case '199ccxz':
			case '200ccxz':
			case '201ccxz':
			case '202ccxz':
			case '203ccxz':
			case '204ccxz':
			case '205ccxz':
			case '206ccxz':
			case '207ccxz':
			case '208ccxz':
			case '209ccxz':
			case '210ccxz':
			case '211ccxz':
			case '212ccxz':
			case '213ccxz':
			case '214ccxz':
			case '215ccxz':
			case '216ccxz':
			case '217ccxz':
			case '218ccxz':
			case '219ccxz':
			case '220ccxz':
			case '221ccxz':
			case '222ccxz':
			case '223ccxz':
			case '224ccxz':
			case '225ccxz':
			case '226ccxz':
			case '227ccxz':
			case '228ccxz':
			case '229ccxz':
			case '230ccxz':
			case '231ccxz':
			case '232ccxz':
			case '233ccxz':
			case '234ccxz':
			case '235ccxz':
			case '236ccxz':
			case '237ccxz':
			case '238ccxz':
			case '239ccxz':
			case '240ccxz':
			case '241ccxz':
			case '242ccxz':
			case '243ccxz':
			case '244ccxz':
			case '245ccxz':
			case '246ccxz':
			case '247ccxz':
			case '248ccxz':
			case '249ccxz':
			case '250ccxz':
			case '251ccxz':
			case '252ccxz':
			case '253ccxz':
			case '254ccxz':
			case '255ccxz':
			case '256ccxz':
			case '257ccxz':
			case '258ccxz':
			case '259ccxz':
			case '260ccxz':
			case '261ccxz':
			case '262ccxz':
			case '263ccxz':
			case '264ccxz':
			case '265ccxz':
			case '266ccxz':
			case '267ccxz':
			case '268ccxz':
			case '269ccxz':
			case '270ccxz':
			case '271ccxz':
			case '272ccxz':
			case '273ccxz':
			case '274ccxz':
			case '275ccxz':
			case '276ccxz':
			case '277ccxz':
			case '278ccxz':
			case '279ccxz':
			case '280ccxz':
			case '281ccxz':
			case '282ccxz':
			case '283ccxz':
			case '284ccxz':
			case '285ccxz':
			case '286ccxz':
			case '287ccxz':
			case '288ccxz':
			case '289ccxz':
			case '290ccxz':
			case '291ccxz':
			case '292ccxz':
			case '293ccxz':
			case '294ccxz':
			case '295ccxz':
			case '296ccxz':
			case '297ccxz':
			case '298ccxz':
			case '299ccxz':
			case '300ccxz':
			case '301ccxz':
			case '302ccxz':
			case '303ccxz':
			case '304ccxz':
			case '305ccxz':
			case '306ccxz':
			case '307ccxz':
			case '308ccxz':
			case '309ccxz':
			case '310ccxz':
			case '311ccxz':
			case '312ccxz':
			case '313ccxz':
			case '314ccxz':
			case '315ccxz':
			case '316ccxz':
			case '317ccxz':
			case '318ccxz':
			case '319ccxz':
			case '320ccxz':
			case '321ccxz':
			case '322ccxz':
			case '323ccxz':
			case '324ccxz':
			case '325ccxz':
			case '326ccxz':
			case '327ccxz':
			case '328ccxz':
			case '329ccxz':
			case '330ccxz':
			case '331ccxz':
			case '332ccxz':
			case '333ccxz':
			case '334ccxz':
			case '335ccxz':
			case '336ccxz':
			case '337ccxz':
			case '338ccxz':
			case '339ccxz':
			case '340ccxz':
			case '341ccxz':
			case '342ccxz':
			case '343ccxz':
			case '344ccxz':
			case '345ccxz':
			case '346ccxz':
			case '347ccxz':
			case '348ccxz':
			case '349ccxz':
			case '350ccxz':
			case '351ccxz':
			case '352ccxz':
			case '353ccxz':
			case '354ccxz':
			case '355ccxz':
			case '356ccxz':
			case '357ccxz':
			case '358ccxz':
			case '359ccxz':
			case '360ccxz':
			case '361ccxz':
			case '362ccxz':
			case '363ccxz':
			case '364ccxz':
			case '365ccxz':
			case '366ccxz':
			case '367ccxz':
			case '368ccxz':
			case '369ccxz':
			case '370ccxz':
			case '371ccxz':
			case '372ccxz':
			case '373ccxz':
			case '374ccxz':
			case '375ccxz':
			case '376ccxz':
			case '377ccxz':
			case '378ccxz':
			case '379ccxz':
			case '380ccxz':
			case '381ccxz':
			case '382ccxz':
			case '383ccxz':
			case '384ccxz':
			case '385ccxz':
			case '386ccxz':
			case '387ccxz':
			case '388ccxz':
			case '389ccxz':
			case '390ccxz':
			case '391ccxz':
			case '392ccxz':
			case '393ccxz':
			case '394ccxz':
			case '395ccxz':
			case '396ccxz':
			case '397ccxz':
			case '398ccxz':
			case '399ccxz':
			case '400ccxz':
			case '401ccxz':
			case '402ccxz':
			case '403ccxz':
			case '404ccxz':
			case '405ccxz':
			case '406ccxz':
			case '407ccxz':
			case '408ccxz':
			case '409ccxz':
			case '410ccxz':
			case '411ccxz':
			case '412ccxz':
			case '413ccxz':
			case '414ccxz':
			case '415ccxz':
			case '416ccxz':
			case '417ccxz':
			case '418ccxz':
			case '419ccxz':
			case '420ccxz':
			case '421ccxz':
			case '422ccxz':
			case '423ccxz':
			case '424ccxz':
			case '425ccxz':
			case '426ccxz':
			case '427ccxz':
			case '428ccxz':
			case '429ccxz':
			case '430ccxz':
			case '431ccxz':
			case '432ccxz':
			case '433ccxz':
			case '434ccxz':
			case '435ccxz':
			case '436ccxz':
			case '437ccxz':
			case '438ccxz':
			case '439ccxz':
			case '440ccxz':
			case '441ccxz':
			case '442ccxz':
			case '443ccxz':
			case '444ccxz':
			case '445ccxz':
			case '446ccxz':
			case '447ccxz':
			case '448ccxz':
			case '449ccxz':
			case '450ccxz':
			case '451ccxz':
			case '452ccxz':
			case '453ccxz':
			case '454ccxz':
			case '455ccxz':
			case '456ccxz':
			case '457ccxz':
			case '458ccxz':
			case '459ccxz':
			case '460ccxz':
			case '461ccxz':
			case '462ccxz':
			case '463ccxz':
			case '464ccxz':
			case '465ccxz':
			case '466ccxz':
			case '467ccxz':
			case '468ccxz':
			case '469ccxz':
			case '470ccxz':
			case '471ccxz':
			case '472ccxz':
			case '473ccxz':
			case '474ccxz':
			case '475ccxz':
			case '476ccxz':
			case '477ccxz':
			case '478ccxz':
			case '479ccxz':
			case '480ccxz':
			case '481ccxz':
			case '482ccxz':
			case '483ccxz':
			case '484ccxz':
			case '485ccxz':
			case '486ccxz':
			case '487ccxz':
			case '488ccxz':
			case '489ccxz':
			case '490ccxz':
			case '491ccxz':
			case '492ccxz':
			case '493ccxz':
			case '494ccxz':
			case '495ccxz':
			case '496ccxz':
			case '497ccxz':
			case '498ccxz':
			case '499ccxz':
			case '500ccxz':
			{
				if (!isRegistered(m))
				{
					return sendRegister(shoNhe, m, prefix, namabot);
				}
				updatePopularCommand(command);
				const levelUpMessage = levelUpdate(command, m.sender); // Update level pengguna
				const menuv12 = `ʜɪ ${m.pushName ? m.pushName : 'User'}👋🏻

╭╾─────╼[ SOSMED ]╾─────╼
│  ${simbols} TikTok    : ${ttk}
│  ${simbols} YouTube   : ${ytbb}
│  ${simbols} Instagram : ${itg}
╰╾────────────────────╼

╭╾─────╼[ FEATURED ]╾─────╼
│  ${simbols} User Commands
│   ${simbols} ${prefix}listuserfire
│   ${simbols} ${prefix}cekfire
│   ${simbols} ${prefix}bensin
│   ${simbols} ${prefix}afk
│   ${simbols} ${prefix}listcmd
│  
│  ${simbols} Supported
│   ${simbols} ${prefix}tqto
│   ${simbols} ${prefix}realown
╰╾────────────────────╼

╭╾─────╼[ GUIDE ]╾─────╼
│  ${simbols} Menu Guide : ${prefix}allmenu
│  ${simbols} Error? Contact: ${prefix}owner
╰╾────────────────────╼

> ${hekkso}`
				let msg = generateWAMessageFromContent(from,
				{
					viewOnceMessage:
					{
						message:
						{
							"messageContextInfo":
							{
								"deviceListMetadata":
								{},
								"deviceListMetadataVersion": 2
							},
							interactiveMessage: proto.Message.InteractiveMessage.create(
							{
								body: proto.Message.InteractiveMessage.Body.create(
								{
									text: menuv12
								}),
								footer: proto.Message.InteractiveMessage.Footer.create(
								{
									text: namabot
								}),
								header: proto.Message.InteractiveMessage.Header.create(
								{
									...(await prepareWAMessageMedia(
									{
										image: getRandomThumb2()
									},
									{
										upload: shoNhe.waUploadToServer
									})),
									title: ``,
									gifPlayback: true,
									subtitle: namaowner,
									hasMediaAttachment: false
								}),
								nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create(
								{
									buttons: [
									{
										"name": "single_select",
										"buttonParamsJson": `{
        "title": "Select Menu!",
        "sections": [
            {
                "title": "Ini adalah command yang sering diginakan",
                "highlight_label": "POPULER",
                "rows": [
                    { 
                        "title": 🎤 ALL MENU", 
                        "description": "Menampilkan semua menu", 
                        "id": ".allmenu" 
                    }
                ]
            },
            {
                "title": "Silahkan Pilih Button Menu di Bawah Ini",
                "highlight_label": "shoNhe BOTz 💸",
                "rows": [
                    { 
                        "title": "⬇️ DOWNLOAD MENU", 
                        "description": "Menu untuk mendownload dan mencari", 
                        "id": ".downloadmenu" 
                    },
                    {
						title: "🌟 ISLAM MENU",
						description: "Menu untuk Pencarian dan Informasi Islamic",
						id: ".islammenu"
					},
                    { 
                        "title": "📚 OTHER MENU", 
                        "description": "Other menu", 
                        "id": ".othermenu" 
                    },
                    { 
                        "title": "🔥 OWNER MENU", 
                        "description": "Hanya King👑 yang boleh menggunakan command ini", 
                        "id": ".ownermenu" 
                    },
                    { 
                        "title": "🎭 ANIME MENU", 
                        "description": "Command untuk menu anime", 
                        "id": ".animemenu" 
                    },
                    { 
                        "title": "🔮 AI MENU", 
                        "description": "Menu Artificial intelligence free", 
                        "id": ".aimenu" 
                    },
                    { 
                        "title": "♻️ RANDOM MENU", 
                        "description": "Menu random", 
                        "id": ".randommenu" 
                    },
                    { 
                        "title": "🎤 AUDIO MENU", 
                        "description": "Menu untuk merubah audio", 
                        "id": ".audiomenu" 
                    },
                    { 
                        "title": "🔄 CONVERT MENU", 
                        "description": "Menu untuk converter", 
                        "id": ".convertmenu" 
                    },
                    { 
                        "title": "🫧 GROUP MENU", 
                        "description": "Menu tentang group", 
                        "id": ".groupmenu" 
                    }
                ]
            },
            {
                "title": "Document & Support",
                "highlight_label": "shoNhe V3⭐",
                "rows": [
                    { 
                        "title": "📝 SCRIPT", 
                        "description": "Script bot yang saya pakai", 
                        "id": ".script" 
                    },
                    { 
                        "title": "🔑 OWNER", 
                        "description": "Pembuat Bot WhatsApp shoNheV3", 
                        "id": ".contact2" 
                    },
                    { 
                        "title": "🪨 TQTO", 
                        "description": "Membantu support dan berbagi", 
                        "id": ".tqto" 
                    }
                ]
            }
        ]
    }`
									},
									{
										"name": "cta_url",
										"buttonParamsJson": "{\"display_text\":\"YouTube 💛\",\"url\":\"https://youtube.com/@sychyy00?si=njEkYZWxEm0i7-Wr\",\"merchant_url\":\"https://www.google.com\"}"
									},
									{
										"name": "cta_url",
										"buttonParamsJson": "{\"display_text\":\"Telegram 💧\",\"url\":\"https://t.me/sh0ydaaa\",\"merchant_url\":\"https://www.google.com\"}"
									},
									{
										"name": "cta_url",
										"buttonParamsJson": "{\"display_text\":\"GitHub 🔘\",\"url\":\"https://github.com/sychyy\",\"merchant_url\":\"https://www.google.com\"}"
									},
									{
										"name": "cta_url",
										"buttonParamsJson": "{\"display_text\":\"WhatsApp ☘️\",\"url\":\"https://chat.whatsapp.com/GQ5Gp0eSeDS6dPBYeHE6kf\",\"merchant_url\":\"https://www.google.com\"}"
									}]
								}),
								contextInfo:
								{
									mentionedJid: [m.sender],
									forwardingScore: 999,
									isForwarded: true,
									forwardedNewsletterMessageInfo:
									{
										newsletterJid: idsaluran,
										newsletterName: namach,
										serverMessageId: 143
									}
								}
							})
						}
					}
				},
				{})
				await shoNhe.relayMessage(msg.key.remoteJid, msg.message,
				{
					messageId: msg.key.id
				})
				if (levelUpMessage) {
        await shoNhe.sendMessage(m.chat,
				{
					image: { url: levelUpMessage.image },
					caption: levelUpMessage.text,
					footer: "LEVEL UP🔥",
					buttons: [
					{
						buttonId: `${prefix}tqto`,
						buttonText:
						{
							displayText: "TQTO 💡"
						}
					},
					{
						buttonId: `${prefix}menu`,
						buttonText:
						{
							displayText: "MENU 🍄"
						}
					}],
					viewOnce: true,
				},
				{
					quoted: hw
				});
           }
			}
			break
			//===========[ YANG UDAH SUPPORT MKSH YH ]=============\\
			/*
			       •       #SCBOTWATERMUX #TERMUXNEVERDIE🔥   
			       •    #BOTWAONLYTERMUX #WHATSAPPBOTTERMUX
			       •       #SYCHYY #SYCHEE # SHOBOTZ #YURIN'S
			       
			   * 💬NOTE : 
			   * ⚠️ DILARANG MENJUAL SCRIPT INI WAHAI PARA JB KONTOL
			   * ⚠️ DILARANG MENGKLAIM BAHWA INI BOT BUATAN SENDIRI‼️
			   * ⚠️ JANGAN HAPUS KREDIT DIBAWAH‼️⚡
			   * 🔥 SUPPORT KAMI SHOBOTZ && SYCHYY && YURIN'S
			   * 👑 SC BY SHO - YuRin's [Yuda-Orlin]
			   * 💧 ©Sho-YuRin's - 2025
			*/
			//===================[ BATAS CASE ]=====================\\
			// AutoAI Message Handling
			default:
				// Jika AutoAI aktif dan pengirim bukan bot atau respons dari AI, proses pesan
				if (autoAiStatus && m.sender !== botNumber && !(m.quoted && m.quoted.sender === botNumber) && !m.key.fromMe)
				{
					const chatId = m.chat; // Gunakan ID chat untuk membedakan percakapan
					const userMessage = m.text;
					// Inisialisasi riwayat percakapan jika belum ada
					if (!conversationHistory[chatId])
					{
						conversationHistory[chatId] = [
						{
							role: "system",
							content: prompt
						}];
					}
					// Tambahkan pesan pengguna ke riwayat percakapan
					conversationHistory[chatId].push(
					{
						role: "user",
						content: userMessage
					});
					// Buat prompt tanpa format "User:" atau "AI:"
					const fullPrompt = conversationHistory[chatId].map(entry => entry.content) // Hanya ambil isi pesan
						.join("\n");
					try
					{
						let hasil = await yanzGpt(fullPrompt); // Kirim riwayat ke AI
						const aiReply = hasil.choices[0].message.content;
						// Tambahkan balasan AI ke riwayat percakapan
						conversationHistory[chatId].push(
						{
							role: "ai",
							content: aiReply
						});
						// Kirim balasan ke pengguna
						shoNherly(aiReply);
						// Tambahkan pencatatan command
						updatePopularCommand('ai');
					}
					catch (e)
					{
						try
						{
							let hasil = await bk9Ai(fullPrompt);
							const aiReply = hasil.BK9;
							// Tambahkan balasan AI ke riwayat percakapan
							conversationHistory[chatId].push(
							{
								role: "ai",
								content: aiReply
							});
							// Kirim balasan ke pengguna
							shoNherly(aiReply);
							updatePopularCommand('ai');
						}
						catch (e)
						{
							shoNherly(pickRandom(['Fitur AI sedang bermasalah!', 'Tidak dapat terhubung ke AI!', 'Sistem AI sedang sibuk sekarang!', 'Fitur sedang tidak dapat digunakan!', ]));
						}
					}
				}
				if ((budy) && ["assalamu'alaikum", "Assalamu'alaikum", "Assalamualaikum", "assalamualaikum", "Assalammualaikum", "assalammualaikum", "Asalamualaikum", "asalamualaikum", "Asalamu'alaikum", " asalamu'alaikum"].includes(budy) && !isCmd)
				{
					shoNhe.sendMessage(from,
					{
						text: `${pickRandom(["*Wa'alaikumussalam*","*Wa'alaikumussalam Wb.*","*Wa'alaikumussalam Wr. Wb.*","*Wa'alaikumussalam Warahmatullahi Wabarakatuh*"])}`
					})
				}
				if ((budy) && ["tes", "Tes", "TES", "Test", "test"].includes(budy) && !isCmd)
				{
					shoNhe.sendMessage(from,
					{
						text: `*${runtime(os.uptime())}*⏰`
					})
				}
				if (budy.startsWith('=>'))
				{
					if (!isShoNheOwn) return

					function Return(sul)
					{
						sat = JSON.stringify(sul, null, 2)
						bang = util.format(sat)
						if (sat == undefined)
						{
							bang = util.format(sul)
						}
						return shoNherly(bang)
					}
					try
					{
						shoNherly(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
					}
					catch (e)
					{
						shoNherly(String(e))
					}
				}
				if (budy.startsWith('>'))
				{
					if (!isShoNheOwn) return
					let kode = budy.trim().split(/ +/)[0]
					let teks
					try
					{
						teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
					}
					catch (e)
					{
						teks = e
					}
					finally
					{
						await shoNherly(require('util').format(teks))
					}
				}
				if (budy.startsWith('$'))
				{
					if (!isShoNheOwn) return
					exec(budy.slice(2), (err, stdout) =>
					{
						if (err) return shoNherly(`${err}`)
						if (stdout) return shoNherly(stdout)
					})
				}
		}
	}
	catch (err)
	{
		console.log(util.format(err))
	}
}
let file = require.resolve(__filename)
fs.watchFile(file, () =>
{
	fs.unwatchFile(file)
	console.log(`Update ${__filename}`)
	delete require.cache[file]
	require(file)
})