let antilink = {}
module.exports = async (sock, m) => {
  let jid = m.key.remoteJid
  if (jid.endsWith("@g.us") && antilink[jid]) {
    if (m.body.includes("https://chat.whatsapp.com")) {
      await sock.sendMessage(jid, { text: "🚫 Link Not Allowed!" })
      await sock.groupParticipantsUpdate(jid, [m.key.participant], "remove")
    }
  }
  if (m.body === ".antilink on") antilink[jid] = true
  if (m.body === ".antilink off") antilink[jid] = false
}
