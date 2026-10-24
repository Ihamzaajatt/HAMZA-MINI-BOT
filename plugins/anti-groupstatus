module.exports = (sock) => {
  sock.ev.on("messages.upsert", async ({ messages }) => {
    let m = messages[0]
    if (m.message?.groupStatusMentionMessage) {
      console.log("Anti-GroupStatus Active")
    }
  })
}
