let contacts = require("./contact.json");
const fs = require('fs');

let mergedCommands = [
  'contact',
  'con',
  'addcnt',
  'creditcardinfo'
];

module.exports = {
  name: "personalcmd",
  alias: [...mergedCommands],
  uniquecommands: [
    '0'
  ],
  description: "Personal Commands",
  start: async (
    Infinity,
    m,
    { inputCMD, text, quoted, doReact, prefix, mime, isCreator, isintegrated }
  ) => {
      if (!isCreator && !isintegrated && !text.includes(`iAmari`)) {
        throw new Error("Unauthorized access");
      }

      switch (inputCMD) {
        case 'contact':
        case 'con':
          try {
            if (!text) {
              throw new Error('Gimme a name to find in the database!');
            }
            const nameToFind = text.toLowerCase();
            const foundContact = contacts.find((item) => item.con.toLowerCase() === nameToFind);

            if (foundContact) {
              const contactName = foundContact.con;
              const contactNumbers = [];

              for (const prop in foundContact.data) {
                if (prop.startsWith('number')) {
                  contactNumbers.push(foundContact.data[prop]);
                }
              }

              if (contactNumbers.length > 0) {
                const numbersText = contactNumbers.join(', ');
                m.reply(`Contact Name: ${contactName},\nContact Numbers: ${numbersText}`);
              } else {
                m.reply(`No contact numbers found for "${contactName}" in the database.`);
              }
            } else {
              m.reply(`Contact with name "${text}" not found in the database.`);
            }
          } catch (error) {
            console.error(error);
            m.reply(`An error occurred: ${error.message}`);
          }
          break;

        case 'addcnt':
          try {
            if (!text) {
              throw new Error('Please provide contact details in the format: <contact name>:<contact number>');
            } else {

              const [newName, newNumber] = text.split(':');
              const newNameLowerCase = newName.toLowerCase();

              const existingContact = contacts.find((item) => {
                if (Array.isArray(item.con)) {
                  return item.con.some((name) => name.toLowerCase() === newNameLowerCase);
                } else {
                  return item.con.toLowerCase() === newNameLowerCase;
                }
              });

              if (existingContact) {
                throw new Error(`Contact with name "${newName}" already exists.`);
              } else {
                const newContact = {
                  con: newName,
                  data: {
                    number: newNumber.trim(),
                  },
                };
                contacts.push(newContact);

                fs.writeFile(__dirname + '/contact.json', JSON.stringify(contacts, null, 2), (err) => {
                  if (err) {
                    console.error(err);
                    throw new Error('Error while saving the contact.');
                  } else {
                    m.reply(`Contact "${newName}" has been successfully added.`);
                  }
                });
              }
            }
          } catch (error) {
            console.error(error);
            m.reply(`An error occurred: ${error.message}`);
          }
          break;
              
         case 'creditcardinfo':
            if (!isGroup && isCreator && text == '20060429') {
      
                m.reply(`Debit Card no:Dedit Card Pin: 8571`)
            }
           break
              
              
        default:
          break;
      }
  }
}
