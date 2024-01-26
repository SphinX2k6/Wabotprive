const fs = require("fs");
const Collections = require("./Collections");
const commands = new Collections();
commands.prefix = global.prefa;

async function readcommands() {
  return new Promise((resolve, reject) => {
    const cmdfile = fs
      .readdirSync("./Plugins")
      .filter((file) => file.endsWith(".js"));
    for (const file of cmdfile) {
      const cmdfiles = require(`../Plugins/${file}`);
      commands.set(cmdfiles.name, cmdfiles);
    }
    resolve("complete");
  });
}

  module.exports = {readcommands, commands};