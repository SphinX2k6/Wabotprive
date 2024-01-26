const { checkWelcome } = require('./MongoDB/MongoDb_Core');
const axios = require('axios');
// exx = https://api.popcat.xyz/welcomecard?background=https://telegra.ph/file/3134758d5f68a11cd81f5.png&text1=Mist+Dragon&text2=Welcome+To+Pop+Cat+Community&text3=Member+219&avatar=https://cdn.discordapp.com/embed/avatars/0.png

module.exports = async (Infinity, anu) => {
  try {
    let metadata = await Infinity.groupMetadata(anu.id);
    let participants = anu.participants;
    let desc = metadata.desc;
    if (desc == undefined) desc = "No Description";

    for (let num of participants) {
      try {
        ppuser = await Infinity.profilePictureUrl(num, "image");
      } catch {
        ppuser = "https://i.pinimg.com/564x/8f/fb/7d/8ffb7d72b9c67562187afa2c6ace6764.jpg";
      }

      if (anu.action == "add") {
        const WELstatus = await checkWelcome(anu.id);
        let WAuserName = num;
        console.log(
          `\n+${WAuserName.split("@")[0]} Joined/Got Added in: ${
            metadata.subject
          }\n`
        );
        Infinitytext = `
Hello @${WAuserName.split("@")[0]} Senpai,

Welcome to *${metadata.subject}*.

*🧣 Group Description 🧣*

${desc}

*Thank You.*
  `;
 // let advJoin = `https://api.popcat.xyz/welcomecard?background=https://telegra.ph/file/3134758d5f68a11cd81f5.png&text1=${WAuserName.split("@")[0]}&text2=Welcome+To+${metadata.subject}&text3=By: Ari_Senpai&avatar=${ppuser}`
 // console.log(advJoin)
        if (WELstatus) {
          await Infinity.sendMessage(anu.id, {
            image: { url: ppuser },
            caption: Infinitytext,
            mentions: [num],
          });
        }
      } else if (anu.action == "remove") {
        const WELstatus = await checkWelcome(anu.id);
        let WAuserName = num;
        console.log(
          `\n+${WAuserName.split("@")[0]} Left/Got Removed from: ${
            metadata.subject
          }\n`
        );
        Infinitytext = `
  @${WAuserName.split("@")[0]} Senpai left the group.
  `;
        if (WELstatus) {
          await Infinity.sendMessage(anu.id, {
            image: { url: ppuser },
            caption: Infinitytext,
            mentions: [num],
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};
