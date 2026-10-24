module.exports = (sock) => {
  sock.ev.on("messages.upsert", async ({ messages }) => {
    let m = messages[0]
    if (m.key.remoteJid === "status@broadcast") {
      await sock.readMessages([m.key])
      console.log("✅ Auto Status Viewed")
    }
  })
}
