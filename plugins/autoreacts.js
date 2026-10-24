module.exports = (sock) => {
  const hearts = ["❤️", "💖", "💘", "💝", "💓", "💞", "💕", "❤️‍🔥", "♥️", "🖤", "❤️‍🩹"]

  sock.ev.on("messages.upsert", async ({ messages }) => {
    let m = messages[0]
    if (!m.message) return
    if (m.key.fromMe) return
    if (m.key.remoteJid === "status@broadcast") return

    try {
      let randomHeart = hearts[Math.floor(Math.random() * hearts.length)]
      
      await sock.sendMessage(m.key.remoteJid, {
        react: {
          text: randomHeart,
          key: m.key
        }
      })
      
      console.log(`❤️ Auto React: ${randomHeart}`)
    } catch (e) {
      console.log("React Failed")
    }
  })
}

console.log("❤️ AUTO HEART REACT LOADED - HAMZA-MINI-BOT")
