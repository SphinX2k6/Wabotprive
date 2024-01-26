const Jimp = require("jimp");
const { GraphOrg, teleGraph } = require('../System/Uploader.js');
var request = require('request');
const { bufferTopath, sleep } = require('../System/Function2.js');
const { convertToAnime } = require('../System/Scrapers.js');
const canvacord = require("canvacord");
const fs = require("fs");
const axios = require('axios');
const remobg = require("remove.bg");
const cooldownManager = require('../System/cooldown.js');
const { Sticker } = require("wa-sticker-formatter");
const fetch = require('node-fetch');

let mergedCommands = ["blur", "circle", "jail", "removebg", "defuse", "hitler", "enhance"];

module.exports = {
  name: "imgedit",
  uniquecommands: ["blur", "circle", "jail", "removebg", "defuse", "hitler", "enhance"],
  alias: [...mergedCommands],
  cooldown: 10000,
  description: "All Image Editing Commands",
  start: async (Infinity, m, { inputCMD, text, doReact, mime, quoted, prefix, mentionByTag }) => {
      if (cooldownManager.checkCooldown(inputCMD, module.exports.cooldown) > 0) {
        throw new Error(`Command is on cooldown. Please wait ${module.exports.cooldown / 1000} seconds.`);
      }

      switch (inputCMD) {
        case "hitler":
          try {
            let errimg;
            let ppuser;
            let errresult;
            if (m.quoted) {
              errimg = await Infinity.profilePictureUrl(m.quoted.sender, 'image');
              errresult = await canvacord.Canvacord.hitler(errimg);
            } else {
              throw new Error("Please tag someone! or mention a picture!");
            }
            await Infinity.sendMessage(m.from, { image: errresult }, { quoted: m });
          } catch (err) {
            console.error(err);
            m.reply("An error occurred: " + err.message);
          }
          break;

        case "triggered":
          try {
            let triimg;
            let triresult;
            let trippuser;
            if (m.quoted) {
              triimg = await Infinity.profilePictureUrl(m.quoted.sender, 'image');
            } else if (mentionByTag[0]) {
              triimg = await Infinity.profilePictureUrl(mentionByTag[0], 'image');
            } else if (m.sender) {
              trippuser = await Infinity.profilePictureUrl(m.sender, 'image');
            } else {
              throw new Error("Please tag someone! or mention a picture!");
            }
            triresult = await canvacord.Canvacord.trigger(triimg || trippuser);
            let sticker = new Sticker(triresult, {
              pack: `Triggred`,
              author: "Ari_Senpai",
              categories: ['🤩', '🎉'],
              id: '12345',
              quality: 100,
              background: 'transparent'
            });
            const stikk = await sticker.toBuffer();
            Infinity.sendMessage(m.from, { sticker: stikk }, { quoted: m });
          } catch (error) {
            console.error(error);
            m.reply("An error occurred: " + error.message);
          }
          break;

        case "blur":
          try {
            if (!m.quoted && !/image/.test(mime)) {
              await doReact("❔");
              throw new Error("Please tag someone! or mention a picture!");
            }

            let userPfp;
            if (/image/.test(mime)) {
              userPfp = await quoted.download();
            } else if (m.quoted) {
              userPfp = await Infinity.profilePictureUrl(m.quoted.sender, "image");
            } else {
              await doReact("❔");
              throw new Error("Please tag someone! or mention a picture!");
            }
            await doReact("✔️");

            let level = text.split(" ")[1] || 5;
            const img = await Jimp.read(userPfp);
            img.blur(isNaN(level) ? 5 : parseInt(level));

            img.getBuffer(`image/png`, (err, buffer) => {
              if (err) {
                console.error(err);
                throw new Error("An error occurred!");
              } else {
                Infinity.sendMessage(
                  m.from,
                  { image: buffer, caption: `_Created by:_ *${botName}*` },
                  { quoted: m }
                );
              }
            });
          } catch (error) {
            console.error(error);
            m.reply("An error occurred: " + error.message);
          }
          break;

        case "circle":
          try {
            if (/image/.test(mime)) {
              let mediaMess = await quoted.download();
              await doReact("🔘");
              await Jimp.read(mediaMess).then((image) => {
                return image.circle().getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
                  if (err) {
                    console.error(err);
                    throw new Error("An error occurred!");
                  } else {
                    Infinity.sendMessage(
                      m.from,
                      { image: buffer, caption: `_Created by:_ *${botName}*` },
                      { quoted: m }
                    );
                  }
                });
              });
            } else {
              await doReact("❌");
              throw new Error(`Please mention an *image* and type *${prefix}circle* to create a circle image.`);
            }
          } catch (error) {
            console.error(error);
            m.reply("An error occurred: " + error.message);
          }
          break;

        case "jail":
          try {
            if (!m.quoted && !/image/.test(mime)) {
              await doReact("❔");
              throw new Error("Please tag someone! or mention a picture!");
            }

            let userPfp;
            if (/image/.test(mime)) {
              userPfp = await quoted.download();
            } else if (m.quoted) {
              userPfp = await Infinity.profilePictureUrl(m.quoted.sender, "image");
            } else {
              await doReact("❔");
              throw new Error("Please tag someone! or mention a picture!");
            }
            await doReact("🔲");
            const result = await canvacord.canvacord.jail(userPfp, false);

            await Infinity.sendMessage(
              m.from,
              { image: result, caption: "*Sent to Horney jail*\n" },
              { quoted: m }
            );
          } catch (error) {
            console.error(error);
            m.reply("An error occurred: " + error.message);
          }
          break;

        case "removebg":
          try {
            if (!m.quoted || !/image/.test(mime) || /webp/.test(mime)) {
              await doReact("❌");
              throw new Error(`Send/Reply Image With Caption *${prefix}removebg* to remove the background of an image`);
            }

                   let rbgKEYS = [
          "cHLxHkyovvnFKA46bWDoy5ab0",
          "tgrhopqLJG5cz17zr9GFVRSP",
          "dCtKvWzkwn4eAYkxF3jUg95h",
          "FxhCoWrhbjE5rGdQcQXrR6L1",
          "xw2tzRUfTwNpPCqApBk3PMgP",
          "bCnoXofBNXHhwSeWibivduAX",
          "mjU2LCkHRuLgd3k9NK93LsL1",
          "P3SisAFSGsziMmYv3tpkDLQu",
          "V5mjnCXBaT58rHiuZ3pCTop7",
          "UTs581jS1xMJ87biGKtpK6UL",
          "pcmigrMzg2H3nzd85eQ68U8Q",
          "pTF2W31Ntre5Ec97p9fD1Nap",
          "vXJLm54AGNRooqi88NXYUuqJ",
          "8j8rHjhPjaFj9qeJqQJmLJCo",
          "YG1Yx54XvFTeP6jgYoMZ3yra",
          "HFvTxMoL774caaXKXKtDiAbw",
          "wdCwvvbEDeLUvR2XBDCzSWxR",
          "9KgH3vFP23NGQKzUYZhyL16Y",
          "5aCUhqDEKWUgqpSXWCsPDRRM",
          "ciyXBRKUd5mmUEfcraF1WZTN",
          "Bfx67bQNp1Lgash3ataGuDYw",
          "HxdQxBahc9rynzSU8RFdenf8",
          "1RPRXsyt9rWmk3NDeELpc5G2",
          "ogbK8qR76TwPkqWwixd9Wnhi",
          "5CDjT5zPwieCFeHiThsTuEvT",
          "JLzxsmoky8YmqdGM4eBa86wx",
          "SrpQNJ6ssj6toDkcwhA5uxKv",
          "ZCSfHCPEe4RQuBgdy5LbjUxL",
          "PFkSukBFzFStuBKHapALVttj",
          "Rr3sRLQAekVRCAcaGuBTbaxr",
          "BbVBkKMMp59qXLCRoSvtm5Tp",
          "xXuiVxrAS3Qk7Si51UWprQeG",
          "Whr6m2QSkjasePMyMU4orrAU",
          "E4vWPfH3byqwSTkfggPQRqmL",
          "a5n2sDUsvtWEARYcvwaY4EiB",
          "MJmfELQUKrsGxu2R3hUTssKf",
          "TqEXtH2h6nZCFhmCrQ2gcE9J",
          "NedwN3261hZyRAnCVhfzCqJ1",
          "zsCdiRN4wudN7jYAwY1GERvm",
          "8tWCT9HwwvNTCgjRDsSNgsHX",
          "rESyw5wJ1CqpcxR6aMPdB1ha",
          "Je1FxvZB3a6C8JKz13bKhSuS",
          "YEX4hMCDrmS2NaZpnNspWFhf",
          "TC5JudsLRVdgFGqtWFtgrsnX",
          "7gf3ewFyRzLG2z8zL9zhDAeR",
          "gBrCeHBUHctye4fjMoJjFwkR",
          "bEFeCrEUQzAKzaQfMCkMoS1y",
          "sg1Cha6PNzSpaLgYQxiAegNZ",
          "EpRzXpncobaNKATWLppj5v8s",
          "cX3yucYC6KGb9U7ZqetGz91z",
        ];

            await doReact("☯️");
            let rbgKEY = rbgKEYS[Math.floor(Math.random() * rbgKEYS.length)];
            let outputFile = "./System/Cache/removeBgOUT.png";
            let qFile = await Infinity.downloadAndSaveMediaMessage(quoted);

            var bgRempic = await remobg.removeBackgroundFromImageFile({
              path: qFile,
              apiKey: rbgKEY,
              size: "regular",
              type: "auto",
              scale: "100%",
              outputFile,
            });

            await Infinity.sendMessage(
              m.from,
              {
                image: fs.readFileSync(outputFile),
                caption: `_Created by: *${botName}*_`,
              },
              { quoted: m }
            );
            fs.unlinkSync(qFile);
            fs.unlinkSync(outputFile);
          } catch (error) {
            console.error(error);
            m.reply("An error occurred: " + error.message);
          }
          break;

        case "enhance":
      try{
            if (!m.quoted || !/image/.test(mime) || /webp/.test(mime)) { m.reply("please reply with an image")}
     let q1img = await Infinity.downloadAndSaveMediaMessage(quoted);
        let piklink = await GraphOrg(q1img)
     let enhanced = await fetch("https://api.akane.my.id/api/tools/enhance?url=" + piklink )
     console.log(piklink+enhanced)
     try{
        Infinity.sendMessage(m.from, { document : { url : enhanced.result.url }, fileName : 'Result.jpg', mimetype: 'image/jpeg' }, { quoted: m})
     } catch {
       m.reply("Sending image error!\ntrying to send in document form..... ")
       Infinity.sendMessage(m.from, { document: enhanced.url, fileName: "ari_senapi", mimetype: 'image/jpeg', caption: 'Result' }, { quoted: m });
     }
     fs.unlinkSync(q1img)
    } catch (e) {
      m.reply("!Type error:\n" + e)
    }
              
       break;

        default:
          break;
      }
  },
};
