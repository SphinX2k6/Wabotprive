const mineflayer = require('mineflayer');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Starting...');
let bot;

const loginAsync = async () => {
  return new Promise((resolve) => {
    bot.once('login', resolve);
  });
};

const spawnAsync = async () => {
  return new Promise((resolve) => {
    bot.once('spawn', resolve);
  });
};

const deathAsync = async () => {
  return new Promise((resolve) => {
    bot.once('death', resolve);
  });
};

const createBot = async () => {
  bot = mineflayer.createBot({
    host: 'free-de1.zeonnodes.biz.id',
    port: 3019,
    username: 'MarinMC',
    version: false,
  });

  await loginAsync();
  bot.chat('/login botMXAuth');

  await spawnAsync();
  bot.chat('/gm spectator');
  setInterval(antiAfk, 30000)
  await deathAsync();
  bot.chat('Bot > I died, respawning');
  setTimeout(createBot, 5000); // Respawn after 5 seconds

  bot.on('message', (jsonMsg) => {
    console.log(`[MC]>${removeAnsiCodes(jsonMsg.toAnsi())}`);
  });

  bot.on('kicked', (reason, loggedIn) => {
    console.log('Kicked:', reason, loggedIn);
  });

  bot.on('error', (err) => {
    console.log('Error:', err);
  });

  bot.on('end', () => {
    console.log('Bot ended, restarting...');
    setTimeout(createBot, 100000); // Restart after 5 seconds
  });
};

function removeAnsiCodes(text) {
  return text.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
}

  const playerscurrentlyOn = () => {
    return new Promise((resolve, reject) => {
      bot.chat('/playerlist');
      bot.once('message', (jsonMsg) => {
        const cleanText = removeAnsiCodes(jsonMsg.toAnsi());
        resolve(cleanText);
      });
    });
  };

  const verifyNewPlayer = (pID) => {
    return new Promise((resolve, reject) => {
      bot.chat(`/lp user ${pID} parent set villager`);
      bot.once('message', (jsonMsg) => {
        const cleanText = removeAnsiCodes(jsonMsg.toAnsi());
        if (cleanText.includes('could not be found')) {
          resolve('Player has to join the server for once!');
        } else {
          resolve('Player Successfully Verified!');
        }
      });
    });
  };
  const runcmd = (textcmd) => {
    return new Promise((resolve, reject) => {
      bot.chat(`/${textcmd}`);
      bot.once('message', (jsonMsg) => {
        const cleanText = removeAnsiCodes(jsonMsg.toAnsi());
          resolve('cleanText');
      });
    });
  }; // 5 minutes in milliseconds

const antiAfk = () => {
  if (bot.game.gameMode === 'spectator') {
    // Teleport the bot to a different location in spectator mode
    const randomX = Math.floor(Math.random() * 100) + 1;
    const randomZ = Math.floor(Math.random() * 100) + 1;
    bot.chat(`/tp @s ${randomX} 100 ${randomZ}`);
  } else {
    // If not in spectator mode, perform the default jump action
    bot.setControlState('jump', true);
    setTimeout(() => {
      bot.setControlState('jump', false);
    }, 100);
  }
};

module.exports = { createBot, playerscurrentlyOn, verifyNewPlayer, runcmd };

// Start the bot when this module is run directly
if (require.main === module) {
  createBot();
}
