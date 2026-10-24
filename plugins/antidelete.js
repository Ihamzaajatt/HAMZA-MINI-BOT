module.exports = (sock) => {
  sock.ev.on("messages.update", async (updates) => {
    for (let update of updates) {
      if (update.update.message === null) {
        await sock.sendMessage(update.key.remoteJid, { text: "🔴 *ANTI-DELETE* 🔴\nKisi ne message delete kiya!" })
      }
    }
  })
}
