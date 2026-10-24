module.exports = async (sock, m, args) => {
  if (!m.key.remoteJid.endsWith("@g.us")) return
  let cmd = m.body.split(" ")[0].toLowerCase()
  if (cmd === ".kick") {
    let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    if (user) await sock.groupParticipantsUpdate(m.key.remoteJid, [user], "remove")
  }
  if (cmd === ".promote") {
    let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    if (user) await sock.groupParticipantsUpdate(m.key.remoteJid, [user], "promote")
  }
  if (cmd === ".demote") {
    let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    if (user) await sock.groupParticipantsUpdate(m.key.remoteJid, [user], "demote")
  }
  if (cmd === ".tagall") {
    let groupMetadata = await sock.groupMetadata(m.key.remoteJid)
    let members = groupMetadata.participants.map(a => a.id)
    await sock.sendMessage(m.key.remoteJid, { text: "🔥 HAMZA-MINI-BOT TAGALL 🔥", mentions: members })
  }
}
