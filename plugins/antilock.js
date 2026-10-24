module.exports = (sock) => {
  sock.ev.on("group-participants.update", async (update) => {
    if (update.action === "demote" || update.action === "promote") {
      console.log("🔒 ADMINLOCK ACTIVE - AntiMod Detected")
      // Auto revert logic
    }
  })
}
