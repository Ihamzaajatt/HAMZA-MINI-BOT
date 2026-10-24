const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
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
    auth: state,
    browser: ["HAMZA-MINI-BOT", "Chrome", "1.0.0"]
  })

  if (!sock.authState.creds.registered) {
    let number = config.ownerNumber.replace(/[^0-9]/g, "")
    setTimeout(async () => {
      try {
        let code = await sock.requestPairingCode(number)
        console.log(`PAIR CODE FOR ${number}: ${code}`)
      } catch (e) {
        console.log("Pair Failed:", e.message)
      }
    }, 3000)
  }

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("messages.upsert", async ({ messages }) => {
    let m = messages[0]
    if (!m.message) return
    let body = m.message.conversation || m.message.extendedTextMessage?.text || ""
    m.body = body

    if (body.startsWith(".pair")) {
      let num = body.split(" ")[1]?.replace(/[^0-9]/g, "")
      if (!num) return sock.sendMessage(m.key.remoteJid, { text: "❌ Number do! Ex: .pair 923001234567" })
      try {
        let code = await sock.requestPairingCode(num)
        await sock.sendMessage(m.key.remoteJid, { text: `🔥 HAMZA-MINI-BOT PAIR CODE\n\nNumber: ${num}\nCode: ${code}\n\nWhatsApp > Linked Devices > Link with Phone Number` })
      } catch (e) {
        await sock.sendMessage(m.key.remoteJid, { text: "❌ Pair failed! 92 ke sath sahi number likho" })
      }
      return
    }

    fs.readdirSync("./plugins").forEach(async (file) => {
      try {
        let plugin = require(`./plugins/${file}`)
        if (typeof plugin === "function") {
          await plugin(sock, m, body.split(" ").slice(1), config)
        }
      } catch {}
    })
  })

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === "close") {
      let reason = lastDisconnect?.error?.output?.statusCode
      if (reason !== DisconnectReason.loggedOut) startBot()
    } else if (connection === "open") {
      console.log("HAMZA-MINI-BOT CONNECTED")
      await sock.sendMessage(sock.user.id, { text: "🔴 HAMZA-MINI-BOT CONNECTED - 11 Features Active ❤️" })
    }
  })
}

startBot()
require("http").createServer((_, res) => res.end("HAMZA-MINI-BOT RUNNING")).listen(process.env.PORT || 3000)
