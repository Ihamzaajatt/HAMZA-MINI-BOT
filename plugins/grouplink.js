module.exports = async (sock, m) => {
  if (m.body === ".grouplink" || m.body === ".link") {
    let code = await sock.groupInviteCode(m.key.remoteJid)
    await sock.sendMessage(m.key.remoteJid, { text: `🔗 *GROUP LINK*\n\nhttps://chat.whatsapp.com/${code}\n\nPowered by HAMZA-MINI-BOT` })
  }
}
