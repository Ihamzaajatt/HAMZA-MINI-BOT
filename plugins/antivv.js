module.exports = (sock) => {
  sock.ev.on("messages.upsert", async ({ messages }) => {
    let m = messages[0]
    if (m.message?.viewOnceMessageV2) {
      let msg = m.message.viewOnceMessageV2.message
      await sock.sendMessage(m.key.remoteJid, { text: "🔓 *ANTI-VV REVEALED*", ...msg }, { quoted: m })
    }
  })
}
