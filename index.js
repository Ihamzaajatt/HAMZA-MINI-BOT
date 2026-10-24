const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys")
const P = require("pino")
const fs = require("fs")
const config = require("./config")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session")
    const { version } = await fetchLatestBaileysVersion()
    
    const sock = makeWASocket({
        version,
        logger: P({ level: "silent" }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" }))
        },
        browser: ["HAMZA-MINI-BOT", "Chrome", "1.0.0"]
    })

    // ✅ PAIR CODE LOGIN
    if (!sock.authState.creds.registered) {
        const number = "923XXXXXXXXX" // Yahan apna WhatsApp number dalo 92 ke sath
        setTimeout(async () => {
            let code = await sock.requestPairingCode(number)
            console.log(`\n🔥 HAMZA-MINI-BOT PAIR CODE: ${code} 🔥\n`)
        }, 3000)
    }

    sock.ev.on("creds.update", saveCreds)
    
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
            if (shouldReconnect) startBot()
        } else if (connection === "open") {
            console.log("✅ HAMZA-MINI-BOT Connected! - 10 Features Active")
        }
    })

    // Load Plugins
    const pluginFolder = "./plugins"
    if (fs.existsSync(pluginFolder)) {
        const files = fs.readdirSync(pluginFolder).filter(f => f.endsWith(".js"))
        for (let file of files) {
            try {
                const plugin = require(`${pluginFolder}/${file}`)
                if (typeof plugin === "function") {
                    // Plugin will handle its own events
                }
            } catch (e) { console.log(`Plugin Error ${file}: ${e.message}`) }
        }
    }
}

startBot()
