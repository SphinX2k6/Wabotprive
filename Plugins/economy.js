const fs = require('fs')
const Jimp = require("jimp");
const moment = require("moment-timezone");
let mergedCommands = [
  "daily",
  "bank"
];

module.exports = {
  name: "eco-management",
  alias: [...mergedCommands],
  uniquecommands: [
    "daily",
    "bank"
  ],
  description: "Econoly has been settled",
  start: async (
    Infinity,
    m,
    {
      inputCMD,
      text,
      prefix,
      doReact,
      args,
      itsMe,
      pushName,
      participants,
      metadata,
      mentionByTag,
      mime,
      isMedia,
      quoted,
      botNumber,
      isBotAdmin,
    }
  ) => {
    switch (inputCMD) {
            
   case "bank":
    try {
        const user = m.sender;
        const userGroup = metadata.subject; // Change this based on your logic to determine the group
        let userData = readUserData();

        // Check if the user and the user's group exist in the data
        if (userData[user]?.[userGroup]) {
            const totalCoins = userData[user][userGroup]?.coins || 0;
            const lastRewardedTime = userData[user][userGroup]?.lastRewardedTime || "N/A";
            await m.reply(`*User:* *${pushName}*💰 *Current Balance (${userGroup}):* ${totalCoins} Infinity-Coins\n🤖 *By:* Ari_Senpai 🎇`);
        } else {
            await m.reply(`You have not claimed coins in the specified group.`);
        }

    } catch (e) {
        await m.reply("An error occurred while processing your request. Please try again later.");
        console.error(e);
    }
    break;
         
            
   case "daily":
    try {
        const user = m.sender;
        let userData = readUserData();
        
// Specify the user group (change this based on your logic)
const userGroup = metadata.subject;
const lastRewardedTime = userData[user]?.[userGroup]?.lastRewardedTime;

if (lastRewardedTime) {
    const lastRewardedDate = new Date(lastRewardedTime);
    const currentDate = new Date();
    // Calculate the time difference in hours
    const timeDifferenceMilliseconds = currentDate - lastRewardedDate;
    const timeDifferenceHours = timeDifferenceMilliseconds / (1000 * 60 * 60);

    // If less than 24 hours have passed, inform the user and exit
    if (timeDifferenceHours < 24) {
        const remainingHours = Math.ceil(24 - timeDifferenceHours);
        await m.reply(`You have already claimed your daily coins in ${userGroup} group. Please wait for ${remainingHours} hours.`);
        return;
    }
}


        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function claimDailyCoins() {
            const currentDate = new Date();
            const dayOfMonth = currentDate.getDate();
            const seed = dayOfMonth;
            const minCoins = 5;
            const maxCoins = 500;
            const randomCoins = getRandomNumber(minCoins, maxCoins);

            // Create or update the user's group
           // const userGroup = metadata.subject; // Change this based on your logic to determine the group
            userData[user] = userData[user] || {};
            userData[user][userGroup] = {
                coins: (userData[user]?.[userGroup]?.coins || 0) + randomCoins,
                lastRewardedTime: currentDate.toISOString(),
            };

            writeUserData(userData);
            //return `You received ${randomCoins} *Infinity* coins today in ${userGroup} group. BotBY: Ari_Senpai`;
            return `*${userGroup}*\n*User:* 🚹*${pushName}*\n*💲Claimed :* *${randomCoins}* Infinity-Coins\n*If u want bounce coins type bounce command !*`
        }

        const dailyCoinsMessage = claimDailyCoins();
        await m.reply(dailyCoinsMessage);

    } catch (e) {
        await m.reply("An error occurred while processing your request. Please try again later.");
        console.error(e);
    }
    break;  
            
      default:
        break;
    }
  },
};

// Function to read user data from the JSON file
function readUserData() {
    try {
        const data = fs.readFileSync('userdata.json');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist or there is an error reading it, return an empty object
        return {};
    }
}
function writeUserData(userData) {
    fs.writeFileSync('userdata.json', JSON.stringify(userData, null, 2));
}