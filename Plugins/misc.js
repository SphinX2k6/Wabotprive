const axios = require("axios");
const bot = require("../bot.js");
const base64 = require('base-64');
const { GraphOrg, teleGraph } = require('../System/Uploader.js')
const fetch = require('node-fetch');
const FormData = require('form-data')
const cooldownManager = require('../System/cooldown.js');
const { getGeyserVer } = require('../System/Scrapers.js')


let mergedCommands = ['cmd','why', 'advise', 'ping', 'mcstat', 'verify', 'version','mistreg','truecaller','enhance','ani','igstalk','playeronline','butt'];

module.exports = {
  name: "misc",
  alias: [...mergedCommands],
  cooldown: 5000, // Default cooldown time in milliseconds (1 minute)
  uniquecommands: ['why', 'advise', 'ping', 'mcstat', 'verify', "version",'mistreg','truecaller','enhance','ani','igstalk','playeronline','butt'],
  description: "Commands to vanish boredom",
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
      groupAdmin,
      isAdmin,
    }
  ) => {
    if (cooldownManager.checkCooldown(inputCMD, module.exports.cooldown) > 0) {
      return m.reply(`Command is on cooldown. Please wait ${module.exports.cooldown / 1000} seconds.`);
    }

switch (inputCMD) {

  case 'playeronline':
   let playeron = await bot.playerscurrentlyOn()
    let dataServ = await axios.get(`https://api.mcsrvstat.us/3/bbn.one:30642`)
    //console.log(dataServ.data)
    const players = dataServ.data.players;
        if (players && players.list) {
            const playerNames = players.list.map(player => player.name);
          const formattedPlayerList = playerNames.map((name, index) => `${index + 1}. ${name}`).join('\n');
    //console.log(playerNames)
     let teks = `༺Mist Dragon Server༻\n${playeron}\nPlayer Names: \n${formattedPlayerList}`;
    m.reply(teks)
        }
   break 

case 'verify':
   if ( !isBotAdmin ){return m.reply("You are not permitted to use this cmd")}
   let playerID = text
   let playerverf = await bot.verifyNewPlayer(playerID) 
    m.reply(playerverf)
   break 
        
case 'cmd':
   try {

    await bot.runcmd(text) 
   } catch(e) {m.reply("Failed to process !")}
   break                      
    
case "mistreg":
    //if (!global.owner) return;
    if (!text) {
        return m.reply(`Please send in this format: ${prefix}mistreg <GameTag>|*Optional <Verified>|<PhoneNumber>`);
    }

    const dea = text.split('|');
    if (dea.length < 3) {
        return m.reply(`Required GameTag, Optional Verified Status, and PhoneNumber. Example: GameTag|Verified|PhoneNumber`);
    }

    const name = dea[0].trim();
    const stat = dea[1] ? dea[1].trim() : "verified";
    const number = dea[2].trim();

    if (!name || !number) {
        return m.reply(`GameTag and PhoneNumber are required.`);
    }

    const newData = {
        "Name": name,
        "Stat": stat,
        "number": number
    };
    await updateGithubJsonFile(newData)
    m.reply(`Registration successful for ${name}.`);
    break;
  
    
case 'version':
     try{
       let {javaVersion , bedrockVersionStart , bedrockVersionEnd} = await getGeyserVer()
const verregex = /\d+\.\d+/; 
const opt1 = bedrockVersionStart.match(verregex);
const opt2 = bedrockVersionEnd.match(verregex);       
       teks = `*༺Mist Dragon Server༻*\n\n_Supported Vesion:_\n_Java:${javaVersion}(Can play with lower version till 1.15.2)_\n_Bedrock:${bedrockVersionStart}-${bedrockVersionEnd}_\n______________\n*According this You should download:*\nLink 1:https://mcpe-planet.com/downloads/minecraft-pe-${opt1}/${bedrockVersionStart}/\nLink 2:https://mcpe-planet.com/downloads/minecraft-pe-${opt2}/${bedrockVersionEnd}/`
       m.reply(teks)
     } catch(e) { console.log(e) } 
break
    
      case 'why':
      case 'Why':
      case 'why?':
        const { data } = await axios.get('https://nekos.life/api/v2/why');
        m.reply('```' + data.why + '```');
        break;

      case 'ping':
        const start = new Date().getTime();
        await m.reply("```Ping!```");
        const end = new Date().getTime();
        m.reply("*Pong!*\n ```" + (end - start) + "``` *ms*");
        break;

      case 'advise':
        await axios
          .get(`https://api.adviceslip.com/advice`)
          .then((response) => {
            const text = '```Advice for you:' + response.data.slip.advice + '```';
            m.reply(text);
          })
          .catch((err) => {
            m.reply(`🔍 Error: ${err}`);
          });
        break;

      case 'mcstat':
        const timeStart = Date.now();
        const infoip = (await axios.get(`https://api.mcsrvstat.us/2/free-de1.zeonnodes.biz.id:3019`)).data;

        m.reply(`======${(Date.now()) - timeStart}ms=====
          🗺️Java: free-de1.zeonnodes.biz.id:3019
          🏳️Bedrock: free-de1.zeonnodes.biz.id:3019
          🎊Port: 3019
          🕋Server Status: ${infoip.online}
          ⛱️Version: ${infoip.version}
        `);
        break;

  
  case 'igstalk':
    if (!text) {
      m.reply(`Give me a username to search!`)
    }
const fg = require('api-dylux')
    try {
    let res = await fg.igStalk(text)
    let te = `
┌──「 *STALKING* 
▢ *🔖Name:* ${res.name} 
▢ *🔖Username:* ${res.username}
▢ *👥Followers:* ${res.followersH}
▢ *🫂Following:* ${res.followingH}
▢ *📌Bio:* ${res.description}
▢ *🏝️Posts:* ${res.postsH}
▢ *🔗 Link* : https://instagram.com/${res.username.replace(/^@/, '')}
└────────────`
      await Infinity.sendMessage(
          m.from,
          {
            image: {url: res.profilePic},
            caption: te,
          },
          { quoted: m }
        );
      } catch(e) {
        m.reply(`✳️ Revisa que el nombre de usuario sea de *Instagram*`+e)
      }

  break
    
case 'ani':
  if (!/image/g.test(mime)) {
    throw '*⚠️ Respond To An Image*';
  }
  m.reply('*Please Wait, I Am Converting Image To Anime✅*');
  const iml = await quoted.download();
  const image = await teleGraph(iml);
  //console.log("Link:" +image)
const url = 'https://api.itsrose.life/image/animeMe?apikey=Rk-c4d655dcf7cbcf283f80f0e8';
const headers = {
  'accept': 'application/json',
  'Content-Type': 'application/json'
};

const rqdata = {
  init_image: image,
  style: 'anime'
};
axios.post(url, rqdata, { headers })
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  break;

case 'butt':  
 const {spawn} = require('child_process');      
if(global.owner) {
 const dat = spawn('python3', ['main.py']);
 dat.stdout.on('data', function (data) {
  console.log('Pipe data from python script ...'+data);
  //dataToSend = data.toString();
  //console.log(dataToSend)
 });
} else { return }
break      

    }
  }
};

async function updateGithubJsonFile(newContent) {
  const owner = 'SphinX2k6';
  const repo = 'mistdrag-datacenter';
  const path = 'player.json';
  const pat = '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';

  const headers = {
    Authorization: `Bearer ${pat}`,
    'Content-Type': 'application/json',
  };

  try {
    // Get the existing JSON data from GitHub
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, { headers });
    const existingDataString = Buffer.from(response.data.content, 'base64').toString('utf-8');
    const existingData = JSON.parse(existingDataString);
    const dataArray = Array.isArray(existingData) ? existingData : [];

    const isContentAlreadyRegistered = dataArray.some(item => item.ID === newContent.ID);

    if (isContentAlreadyRegistered) {
      return m.reply('Provided data already registered');
    }

    const newId = dataArray.length + 1;
    newContent.ID = String(newId);
    dataArray.push(newContent);
    const updatedContent = JSON.stringify(dataArray, null, 4);
    const data = {
      message: "Update JSON file",
      content: base64.encode(updatedContent),
      sha: response.data.sha,
    };

    await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, data, { headers });

    return 'ok';
  } catch (error) {
    console.error(`Error occurred: ${error.message}`);
  }
}


