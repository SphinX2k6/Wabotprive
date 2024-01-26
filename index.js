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
require("./Configurations");
const {createBot} = require("./bot")
const {
  default: infConnect,
  DisconnectReason,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
  useMultiFileAuthState,
  makeInMemoryStore,
  PHONENUMBER_MCC,
  jidDecode,
} = require("1infbaileysjs");
var qrcode = require('qrcode');
const fs = require("fs");
const fetch = require("node-fetch")
const figlet = require("figlet");
const { join } = require("path");
const got = require("got");
const pino = require("pino");
const path = require("path");
const FileType = require("file-type");
const { Boom } = require("@hapi/boom");
const { serialize, WAConnection } = require("./System/whatsapp.js");
const axios = require("axios");
const { smsg, getBuffer, getSizeMedia } = require("./System/Function2");
const express = require("express");
const app = express();
const PORT = global.port;
const welcomeLeft = require("./System/Welcome.js");
const { readcommands, commands } = require("./System/ReadCommands.js");
commands.prefix = global.prefa;
const mongoose = require("mongoose");
const {
  getPluginURLs, // -------------------- GET ALL PLUGIN DATA FROM DATABASE
} = require("./System/MongoDB/MongoDb_Core.js");

const chalk = require("chalk");
const store = makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store",
  }),
});
store.readFromFile('./System/store/inf-store.json')
setInterval(() => {
    store.writeToFile('./System/store/inf-store.json');
  }, 30 * 1000);

let qr_gen = "invalid";
let status;
if (global.autopurge == 'true') {
console.log('[ 💫 ] Auto Purgesession Activated')
setInterval(async () => {
    await purgeSession()
    await rmCache()
console.log(chalk.cyanBright(`\n▣────────[ AUTOPURGESESSIONS ]───────────···\n│\n▣─❧ FILES DELETED ✅\n│\n▣────────────────────────────────────···\n`))
}, 3600000)
}
const startInfinity = async () => {
  try {
    await mongoose.connect(mongodb);
   console.log('Establishing secure connection to MongoDB')
   console.log("✅ Connection established with MongoDB!");
  } catch (err) {
    console.log('Please check if your MongoDB URI is correct. Error:'+err);
    return;
  }

  const { saveCreds, state } = await useMultiFileAuthState('./authinf');
  console.log(
    figlet.textSync("Infinity-UT", {
      font: "Standard",
      horizontalLayout: "default",
      vertivalLayout: "default",
      width: 70,
      whitespaceBreak: true,
    })
  );
  console.log(`\n`);

  await installPlugin();

  const { version, isLatest } = await fetchLatestBaileysVersion();

  const Infinity = infConnect({
    logger: pino({ level: "silent" }),
    printQRInTerminal: false, //enable it if unable to qcan qr on website
    browser: ["Infinity", "Safari", "1.0.0"],
    auth: state,
    version,
  });

  store.bind(Infinity.ev);

  Infinity.public = true;

  async function installPlugin() {
    console.log(chalk.yellow("Checking for Plugins...\n"));
    let plugins = [];
    try {
      plugins = await getPluginURLs();
    } catch (err) {
      console.log(
        chalk.redBright(
          "Error connecting to MongoDB ! Please re-check MongoDB URL or try again after some minutes !\n"
        )
      );
      console.log(err);
    }

    if (!plugins.length || plugins.length == 0) {
      console.log(
        chalk.redBright("No Extra Plugins Installed ! Starting Infinity...\n")
      );
    } else {
      console.log(
        chalk.greenBright(plugins.length + " Plugins found ! Installing...\n")
      );
      for (let i = 0; i < plugins.length; i++) {
        pluginUrl = plugins[i];
        var { body, statusCode } = await got(pluginUrl);
        if (statusCode == 200) {
          try {
            var folderName = "Plugins";
            var fileName = path.basename(pluginUrl);

            var filePath = path.join(folderName, fileName);
            fs.writeFileSync(filePath, body);
          } catch (error) {
            console.log("Error:", error);
          }
        }
      }
      console.log(
        chalk.greenBright(
          "All Plugins Installed Successfully ! Starting Infinity...\n"
        )
      );
    }
  }


  Infinity.ev.on("creds.update", saveCreds);
  Infinity.serializeM = (m) => smsg(Infinity, m, store);
  Infinity.ev.on("connection.update", async (update) => {
    const { lastDisconnect, connection, qr } = update;
    if (connection) {
      console.info(`[ 💫 ] Server Status => ${connection}`);
      if (connection === 'open') {
        console.log('[ 💫 ] Loading up plugins....')
        const loaded = await readcommands();
        if (loaded === "complete") {
        console.log("[ 💫 ] Command reading completed successfully.");
        console.log("Creating Bot...")
        createBot()
          /*  if (global.crt === true) {
        createBot()
                }*/
    }
  }
}

    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(
          `[ 💫 ] Bad Session File, Please Delete Session and Scan Again.\n`
        );
        process.exit();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("[ 💫 ] Connection closed, reconnecting....\n");
        startInfinity();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("[ 💫 ] Connection Lost from Server, reconnecting...\n");
        startInfinity();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(
          "[ 💫 ] Connection Replaced, Another New Session Opened, Please Close Current Session First!\n"
        );
        process.exit();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(
          `[ 💫 ] Device Logged Out, Please Delete Session and Scan Again.\n`
        );
        process.exit();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("[ 💫 ] Server Restarting...\n");
        startInfinity();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("[ 💫 ] Connection Timed Out, Trying to Reconnect...\n");
        startInfinity();
      } else {
        console.log(
          `[ 💫 ] Server Disconnected: "It's either safe disconnect or WhatsApp Account got banned !\n"`
        );
      }
    }
    if (qr) {
      qr_gen = qr;
    }
  });

  Infinity.ev.on("group-participants.update", async (m) => {
    welcomeLeft(Infinity, m);
  });

  Infinity.ev.on("messages.upsert", async (chatUpdate) => {
    m = serialize(Infinity, chatUpdate.messages[0]);

    if (!m.message) return;
    if (m.key && m.key.remoteJid == "status@broadcast") return;
    if (m.key.id.startsWith("BAE5") && m.key.id.length == 16) return;

    require("./Core.js")(Infinity, m, commands, chatUpdate);
  });

  Infinity.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      );
    } else return jid;
  };

  Infinity.ev.on("contacts.update", (update) => {
    for (let contact of update) {
      let id = Infinity.decodeJid(contact.id);
      if (store && store.contacts)
        store.contacts[id] = {
          id,
          name: contact.notify,
        };
    }
  });

  Infinity.downloadAndSaveMediaMessage = async (
    message,
    filename,
    attachExtension = true
  ) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    let randnmae = await Math.floor(Math.random() * 100000000);
    trueFileName = attachExtension ? randnmae + "." + type.ext : randnmae;
    // save to file
    await fs.writeFileSync(`./System/Cache/${trueFileName}`, buffer);
    return `./System/Cache/${trueFileName}`;
  };

/**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} mime 
     * @param {*} options 
     * @returns 
     */
   Infinity.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await Infinity.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })
    }
  
  Infinity.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    return buffer;
  };

  Infinity.parseMention = async (text) => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net"
    );
  };

  Infinity.sendText = (jid, text, quoted = "", options) =>
    Infinity.sendMessage(
      jid,
      {
        text: text,
        ...options,
      },
      {
        quoted,
      }
    );

  Infinity.getFile = async (PATH, save) => {
    let res;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
      ? Buffer.from(PATH.split`,`[1], "base64")
      : /^https?:\/\//.test(PATH)
      ? await (res = await getBuffer(PATH))
      : fs.existsSync(PATH)
      ? ((filename = PATH), fs.readFileSync(PATH))
      : typeof PATH === "string"
      ? PATH
      : Buffer.alloc(0);

    let type = (await FileType.fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    filename = path.join(
      __filename,
      "./src/" + new Date() * 1 + "." + type.ext
    );
    if (data && save) fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      size: await getSizeMedia(data),
      ...type,
      data,
    };
  };

  Infinity.setStatus = (status) => {
    Infinity.query({
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "set",
        xmlns: "status",
      },
      content: [
        {
          tag: "status",
          attrs: {},
          content: Buffer.from(status, "utf-8"),
        },
      ],
    });
    return status;
  };
/**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} filename
     * @param {*} caption
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
  Infinity.sendFile = async (jid, PATH, fileName, quoted = {}, options = {}) => {
    let types = await Infinity.getFile(PATH, true);
    let { filename, size, ext, mime, data } = types;
    let type = "",
      mimetype = mime,
      pathFile = filename;
    if (options.asDocument) type = "document";
    if (options.asSticker || /webp/.test(mime)) {
      let { writeExif } = require("./System/Function.js");
      let media = {
        mimetype: mime,
        data,
      };
      pathFile = await writeExif(media, {
        packname: global.packname,
        author: global.packname,
        categories: options.categories ? options.categories : [],
      });
      await fs.promises.unlink(filename);
      type = "sticker";
      mimetype = "image/webp";
    } else if (/image/.test(mime)) type = "image";
    else if (/video/.test(mime)) type = "video";
    else if (/audio/.test(mime)) type = "audio";
    else type = "document";
    await Infinity.sendMessage(
      jid,
      {
        [type]: {
          url: pathFile,
        },
        mimetype,
        fileName,
        ...options,
      },
      {
        quoted,
        ...options,
      }
    );
    return fs.promises.unlink(pathFile);
  };
};

startInfinity();

app.use("/app", express.static(join(__dirname, "Frontend")));
res.sendStatus(200);
app.get("/qr", async (req, res) => {
  const { session } = req.query;
  /*if (!session)
    return void res
      .status(404)
      .setHeader("Content-Type", "text/plain")
      .send("Please Provide the session ID that you set for authentication !")
      .end();
  if (sessionId !== session)
    return void res
      .status(404)
      .setHeader("Content-Type", "text/plain")
      .send("Invalid session ID ! Please check your session ID !")
      .end();
  if (status == "open")
    return void res
      .status(404)
      .setHeader("Content-Type", "text/plain")
      .send("Session is already in use !")
      .end(); */
const qrCodeBuffer = await qrcode.toBuffer(qr_gen);
    res.setHeader("content-type", "image/png");
    res.send(qrCodeBuffer);
});

app.listen(PORT);    


function purgeSession() {
    let prekey = []
    let directorio = fs.readdirSync("./authinf")
    let filesFolderPreKeys = directorio.filter(file => {
        return file.startsWith('pre-key-')
    })
    prekey = [...prekey, ...filesFolderPreKeys]
    filesFolderPreKeys.forEach(files => {
    fs.unlinkSync(`./authinf/${files}`)
})
}
function rmCache() {
    fs.readdirSync("./System/Cache").forEach((file) => {
      const filePath = path.join("./System/Cache", file);
      fs.unlinkSync(filePath);
    });
    fs.readdirSync("./src").forEach((file) => {
      const filePath2 = path.join("./src", file);
      fs.unlinkSync(filePath2);
    })
};
