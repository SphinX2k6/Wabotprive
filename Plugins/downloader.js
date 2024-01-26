const axios = require("axios");
const fetch = require('node-fetch');
const fs = require('fs');
const { execSync } = require('child_process')
const cheerio = require('cheerio');
const { tiktokdl, snapsave, instagramdl } = require("@bochilteam/scraper")
const {instagram} = require("@xct007/frieren-scraper");
const cooldownManager = require('../System/cooldown.js');
const { animeVideo, fbIgdl, animeVideo2, savefrom, InfFb, mediafireDl, fbdown, ytshorts} = require('../System/Scrapers.js')
let turl = require("turl");

let mergedCommands = [
  'yts',
  "igdl",
  "instadl",
  "fbdl",
  "facebookdl",
  "mediafiredl",
  "mediafire",
  "amv",
  "soundcloud",
];

module.exports = {
  name: "downloader",
  alias: [...mergedCommands],
  cooldown: 10000,
  uniquecommands: ["igdl", "fbdl", "mediafiredl","soundcloud","amv",'yts',],
  description: "All file dowloader commands",
  start: async (Infinity, m, { inputCMD, text, doReact, prefix, pushName }) => {
    
 if (cooldownManager.checkCooldown(inputCMD, module.exports.cooldown) > 0) {
      return m.reply(`Command is on cooldown. Please wait ${module.exports.cooldown / 1000} seconds.`);
    }
    
switch (inputCMD) {

case "yts":
if (!text) return m.reply(`Please provide a valid YT Story link !\n\nExample: *${prefix}yts https://www.youtube.com/shorts/HFmfuU7y5Xo*`) 
m.reply(`*Please wait your video is downloading*`)  
try {
  let ytsh = await ytshorts(text)
  //console.log(ytsh)
 let tekkig = `
${ytsh[0].title}\n━━━━━•───────────── ${ytsh[0].duration}\n          ⇆ㅤ◁ㅤ ❚❚ㅤ ▷ㅤ↻\n\n*By: Ari_Senpai_01*`
   Infinity.sendMessage(
            m.from,
            {
              video: { url: ytsh[0].url },
              caption: tekkig,
            },
            { quoted: m }
          );   
} catch(e) {
  m.reply(`Sorry Failed to download video!`+e)
}
break;    
        
case "igdl":
if (!text) return m.reply(`Please provide a valid instagram Reel/Video link !\n\nExample: *${prefix}igdl https://www.instagram.com/p/CP7Y4Y8J8ZU/*`)     
m.reply(`*Please wait your video is downloading*`)  
try {
  let igvd1 = await snapsave(text)
  //console.log(igvd1.url)
  let tekkig = `
━━━━━•───────────── 00:02\n          ⇆ㅤ◁ㅤ ❚❚ㅤ ▷ㅤ↻\n\n*By: Ari_Senpai_01*`
   Infinity.sendMessage(
            m.from,
            {
              video: { url: igvd1[0].url },
              caption: tekkig,
            },
            { quoted: m }
          );   
} catch(e) {
  m.reply(`Sorry Failed to download video!`)
}
break;      

  case "amv":
     //await m.reply(wait)
    if (!text) return m.reply(`Invalid Argument \nExample: ${prefix}amv 1 or 2`)
    await m.reply(wait)
    if (text == '1') {
        try {
            let resl = await animeVideo()
            let cap = `Here is the video`
          
 Infinity.sendMessage(
            m.from,
            {
              video: { url: resl.source },
              caption: cap,
            },
            { quoted: m }
          );         
            
        } catch (e) {
            await m.reply(err, e)
        }
    }
    if (text == '2') {
        try {
            let resl = await animeVideo2()
            let cap = `Here is the video`
             Infinity.sendMessage(
            m.from,
            {
              video: { url: resl.source },
              caption: cap,
            },
            { quoted: m }
          ); 
        } catch (e) {
            await m.reply(err, e)
        }
}      
    break
    
      case "mediafiredl":
      case "mediafire":
        if (!text) {
          return m.reply(
            `Please provide a valid Mediafire link !\n\nExample: *${prefix}mediafire put_link*`
          );
        }
        if (!text.includes("mediafire.com")) {
          return m.reply(
            `Please provide a valid Mediafire link !\n\nExample: *${prefix}mediafire put_link*`
          );
        }

        const MDF = await mediafireDl(text);
        if (MDF[0].size.split("MB")[0] >= 100)
          return m.reply("File is too large in size!");

        let txt = `        *『 Mediafire Downloader 』*
        
*🎀 File Name* : ${MDF[0].nama}
*🧩 File Size* : ${MDF[0].size}
*📌 File Format* : ${MDF[0].mime}

Downloading...`;

        await doReact("📥");
        await m.reply(txt);

        Infinity.sendMessage(
          m.from,
          {
            document: { url: MDF[0].url },
            mimetype: MDF[0].mime,
            fileName: MDF[0].nama,
          },
          { quoted: m }
        );
        break;

      case "fbdl":
      case "facebookdl":
  const { getVideoDurationInSeconds } = require('get-video-duration')
  const fg = require('api-dylux');
        if (!text) {
          return m.reply(
            `Please provide a valid Facebook link !\n\nExample: *${prefix}fbdl put_link*`
          );
        }
        if (!text.includes("fb") && !text.includes("facebook")) {
          return m.reply(
            `Please provide a valid Facebook link !\n\nExample: *${prefix}fbdl put_link*`
          );
        }

        await doReact("📥");
        try {
         let fbvid = await fg.fbdl(text)
          if (!fbvid) { m.reply('Failed to fetch video!') }
           let fbdllink = await turl.shorten(fbvid.videoUrl)
          Infinity.sendMessage(
            m.from,
            {
              video: { url: fbvid.videoUrl },
              caption: `Downloaded by: *${botName}* \n\n_*🎀 Powered by: *Ari_Senapi*\n\n_\n_${fbvid.title}_\nDownload Link: ${fbdllink}`,
            },
            { quoted: m }
          );
        } catch(e1) {
      console.log('Error 1 at fbdl:'+ e1)    
  try {        
const res = await fbdown(text)
console.log(res)
   let fbdllink2 = await turl.shorten(res.HD)  
    let tekk = `
━━━━━•─────────────── ∞:∞\n        ⇆ㅤ◁ㅤ ❚❚ㅤ ▷ㅤ↻`
    Infinity.sendMessage(
            m.from,
            {
              video: { url: res.HD },
              caption: tekk,
            },
            { quoted: m }
          ) 
  } catch(e2) {
    console.log('Error 2 at fbdl:'+ e2)
 try{
  let fbvid4 = await savefrom(text)   
  let dllink3 = await turl.shorten(fbvid4.url[0].url)
  if (!fbvid4) { m.reply('Failed to fetch video!') }
Infinity.sendMessage(
            m.from,
            {
              video: { url: fbvid4.url[0].url },
              caption: `*Downloaded by:* *${botName}* \n\n_*🎀 Powered by:*_ *Ari_Senpai*\n\n_*🧩 Downlaod URl:*_ ${dllink3} \n`,
            },
            { quoted: m }
          );   
 } catch(e3) {
   console.log('Error 3 at fbdl:'+ e3)  
try {
  let res = await facebookDl(text)
  let vurl = res?.url?.[0]?.url || res?.url?.[1]?.url || res?.['720p'] || res?.['360p']
  await m.reply('_In progress, please wait..._')
  let tek = `
━━━━━•─────────────── 0.01
       ⇆ㅤ◁ㅤ ❚❚ㅤ ▷ㅤ↻`
	Infinity.sendMessage(m.from, { video: { url: vurl }, caption: res?.meta?.title || tek }, { quoted: m })
} catch(e4) {
  console.log('Error 4 at fbdl:'+ e4)
  try{
const data = await snapsave(text)
    let vidurl = data[5].url

let tek2 = `━━━━━•─────────── 0.01\n     ⇆ㅤ◁ㅤ ❚❚ㅤ ▷ㅤ↻`
	Infinity.sendMessage(m.from, { video: { url:vidurl }, caption: tek2 }, { quoted: m })
console.log(data)
  }catch(e5) {
    console.log('Error 5 at fbdl:'+ e5)
    try {
        
        const cleanedData = text.replace('https://l.facebook.com/l.php?u=', '');
        const data = await fbIgdl(cleanedData);
        console.log(data);

        //const vidurl = cleanedData[5].url;

        const tek2 = `━━━━━•─────────── 0.01\n     ⇆ㅤ◁ㅤ ❚❚ㅤ ▷ㅤ↻`;
        await Infinity.sendMessage(m.from, { video: { url: vidurl }, caption: tek2 }, { quoted: m });
        console.log(cleanedData);
    }catch(e) {
           console.log('noting worked at fbdl'+e)
          await m.reply(
            `Video access denied ! It's private or only owner's friends can view it.`
          );
}}}}}}
break;

case "soundcloud":
if (!text) m.reply(`*[❗𝐈𝐍𝐅𝐎❗] Please put a text to search!*`)
try {
  await doReact('🎧')
let res = await fetch(`https://api.akuari.my.id/search/searchsoundcloud?query=${text}`)
let json2 = await res.json()
let urlSC = await json2.hasil[0].url
let res2 = await fetch(`https://api.akuari.my.id/downloader/scdl?link=${urlSC}`)
let json = await res2.json()
let shortUrl = await (await fetch(`https://tinyurl.com/api-create.php?url=${json.link}`)).text()
let soundcloudt = `❒═══❬ 𝐒𝐎𝐔𝐍𝐃𝐂𝐋𝐎𝐔𝐃 ❭═══╾❒
┬
├‣✨ *𝚃𝚒𝚝𝚕𝚎:* ${json.title}
┴
┬
├‣💚 *𝗗𝗶𝗿𝗲𝗰𝘁 𝗨𝗥𝗟:* ${shortUrl}
┴
┬
├‣ *- 𝘌𝘮𝘦𝘳𝘨𝘦 𝘪𝘯𝘵𝘰 𝘮𝘶𝘴𝘪𝘤...*
┴
┬
├ _﹫BY: Ari_Senpai_
┴`
await Infinity.sendMessage(
          m.from,
          {
            image: { url: json.thumb },
            caption: soundcloudt,
          },
          { quoted: m }
        );    
   Infinity.sendMessage(
       m.from,
     {
       audio: { url: json.link },
       mimetype: "audio/mpeg",
       ptt: true,
     })
                  
} catch (e) {
m.reply('*[❗𝐈𝐍𝐅𝐎❗] Error, Please provide more info! Or the song is invalid!*')
  console.log(e)
}
break
    
      default:
        break;
    }
  },
};

async function facebookDl(url) {
	let res = await fetch('https://fdownloader.net/')
	let $ = cheerio.load(await res.text())
	let token = $('input[name="__RequestVerificationToken"]').attr('value')
	let json = await (await fetch('https://fdownloader.net/api/ajaxSearch', {
		method: 'post',
		headers: {
			cookie: res.headers.get('set-cookie'),
			'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			referer: 'https://fdownloader.net/'
		},
		body: new URLSearchParams(Object.entries({ __RequestVerificationToken: token, q: url }))
	})).json()
	let $$ = cheerio.load(json.data)
  console.log($$)
	let result = {}
	$$('.button.is-success.is-small.download-link-fb').each(function () {
		let quality = $$(this).attr('title').split(' ')[1]
		let link = $$(this).attr('href')
		if (link) result[quality] = link
	})
	return result
  console.log(result)
}