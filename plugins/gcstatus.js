module.exports = async (sock, m) => {
  if (m.body === ".gcstatus" || m.body === ".groupinfo") {
    let metadata = await sock.groupMetadata(m.key.remoteJid)
    let text = `🔴 *GC STATUS - HAMZA-MINI-BOT* 🔴\n\n*Name:* ${metadata.subject}\n*Members:* ${metadata.participants.length}\n*Owner:* ${metadata.owner}\n*ID:* ${metadata.id}\n\n_10 Features Active_`
    await sock.sendMessage(m.key.remoteJid, { text })
  }
}
