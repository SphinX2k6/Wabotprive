/*
██╗███╗░░██╗███████╗██╗███╗░░██╗██╗████████╗██╗░░░██╗
██║████╗░██║██╔════╝██║████╗░██║██║╚══██╔══╝╚██╗░██╔╝
██║██╔██╗██║█████╗░░██║██╔██╗██║██║░░░██║░░░░╚████╔╝░
██║██║╚████║██╔══╝░░██║██║╚████║██║░░░██║░░░░░╚██╔╝░░
██║██║░╚███║██║░░░░░██║██║░╚███║██║░░░██║░░░░░░██║░░░
╚═╝╚═╝░░╚══╝╚═╝░░░░░╚═╝╚═╝░░╚══╝╚═╝░░░╚═╝░░░░░░╚═╝░░░ 
Pᴏssɪʙɪʟɪᴛɪᴇs ᴀʀᴇ ɪɴ ᴏᴜᴛ ɴᴀᴍᴇ 💫
Creator: Ari_Senpai ⚜ || Also thanks to Team Infinity© !
Remove this logo or text your code and bot will be automatically 
removed and all code will be obfusicated! 
Its not a treat, Its a promise from our Team!
*/

const fs = require("fs");

let gg = process.env.MODS;
if (!gg) {
  gg = "917044585369";
}

global.owner = gg.split(",");
global.usePairingCode = true
global.useMobile = false
global.mongodb = "mongodb+srv://arisenpai:vxZEYWkWyRdscX9A@infinity-bot.ursqr7a.mongodb.net/?retryWrites=true&w=majority";
global.mainlogo = fs.readFileSync("./Assets/inflogo.jpg");
global.sessionId = "AriSenpai550318972";
global.prefa = "-";
global.tenorApiKey = "AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c";
global.packname = `Infinity Bot`;
global.author = "by: Team Infinity";
global.port = "25569";
global.openAiAPI = "Put your openai API key here";
global.owner = gg.split(",");
global.autopurge = 'true'
global.crt = false
//
global.wait = '_Please wait, command is processing_....'
global.err = 'An error occured, please report to creator!'
//

module.exports = {
  mongodb: global.mongodb,
};
