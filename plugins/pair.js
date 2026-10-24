// HAMZA-MINI-BOT - PUBLIC PAIR CODE SYSTEM
module.exports = async (sock, m, args, config) => {
    if (m.body.startsWith(".pair")) {
        let number = args[0]?.replace(/[^0-9]/g, "")
        if (!number) return sock.sendMessage(m.key.remoteJid, { text: "❌ *Number do!*\n\nExample: `.pair 923001234567`" })
        
        try {
            let code = await sock.requestPairingCode(number)
            await sock.sendMessage(m.key.remoteJid, { 
                text: `🔥 *HAMZA-MINI-BOT PUBLIC PAIR CODE* 🔥\n\n*Number:* ${number}\n*Code:* ${code}\n\n1. WhatsApp > Linked Devices > Link with Phone Number\n2. Ye code dalo\n\n*10 Features Active ✅*\n_Powered by HAMZA JUTT_` 
            })
        } catch (e) {
            await sock.sendMessage(m.key.remoteJid, { text: "❌ Pair failed! Number sahi likho 92 ke sath" })
        }
    }
}
