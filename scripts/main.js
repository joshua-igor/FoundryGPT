import {chatGPTRequest} from './openai.js'
Hooks.once('init', function() {
  console.log('FoundryGPT | Initializing');

  // Register module settings
  game.settings.register('foundry-gpt', 'apiKey', {
    name: 'ChatGPT API Key',
    hint: `API Key for the OpenAI API. See more at <a href="platform.openai.com/account/api-keys">`,
    scope: 'world',
    config: true,
    type: String,
    default: '',
  });
  game.settings.register('foundry-gpt', 'playersCanUse', {
    name: 'Allow Players to Use FoundryGPT',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

//   // Register a custom keybinding for showing the text input dialog
// game.keybindings.register('foundry-gpt', "showGPTInputDialog", {
//   name: 'Show FoundryGPT Input Dialog',
//   hint: "When pressing this keybinding a FoundryGPT dialog box will open.",
//   onDown: () => { createTextInputDialog() },
//   restricted: !game.settings.get('foundry-gpt', 'playersCanUse')
// }
// );

// // Create a function that will create a text input dialog
// function createTextInputDialog() {
//   const characterName = game.user.character ? game.user.character.name : 'GM';
//   let content = `
//     <form>
//       <div class="form-group">
//         <label for="text-input">Enter your promnpt:</label><p>
//         <input id="text-input" name="text-input" type="text"/>
//       </div>
//     </form>
//   `;

//   // Define the dialog buttons
//   let buttons = {
//     submit: {
//       icon: "<i class='fas fa-check'></i>",
//       label: "Submit",
//       callback: (html) => {
//         // Get the text input value
//         let message = html.find('[name="text-input"]').val();
//         // Call the chatGPTRequest function with the message
//         chatGPTRequest(message, characterName);
//       }
//     },
//     cancel: {
//       icon: "<i class='fas fa-times'></i>",
//       label: "Cancel"
//     }
//   };

//   // Create a new dialog instance
//   let dialog = new Dialog({
//     title: "FoundryGPT",
//     content: content,
//     buttons: buttons,
//     default: "text-input"
//   });

//   // Render the dialog to the UI
//   dialog.render(true);
// }
});

//
//
//

Hooks.once('ready', async function() {

// game.keybindings.set('foundry-gpt', "showGPTInputDialog", [
//   {
//     key: "Space",
//     modifiers: [ "SHIFT" ]
//   }
// ]);

  // If no API key is set, prompt the user to input it
  if (!game.settings.get('foundry-gpt', 'apiKey')) {
    const input = await new Promise(resolve => {
      new Dialog({
        title: 'ChatGPT API Key',
        content: `<p>Please enter your ChatGPT API key:</p><div class="form-group"><label>API Key</label><input name="apiKey" type="password" data-dtype="String"></div>`,
        buttons: {
          ok: {
            label: 'Save',
            callback: (html) => {
              resolve(html.find('[name="apiKey"]').val());
            }
          },
          cancel: {
            label: 'Cancel'          }
        },
        default: 'ok',
        close: () => resolve(null)
      }).render(true);
    });
    if (input) {
      await game.settings.set('foundry-gpt', 'apiKey', input);
    }
  }

});

Hooks.on('chatMessage', function(chatLog, message, chatSpeakerData) {
  console.log("chatSpeakerData: "+JSON.stringify(chatSpeakerData))

  // Check if the message is a chat command and the players are allowed to use the AI assistant
  if ((message.startsWith('/ai') || message.startsWith('/gpt')) && ((game.settings.get('foundry-gpt', 'playersCanUse') || game.user.isGM))) {
    // Get the API Key from the module settings and get the author of the message
    const apiKey = game.settings.get('foundry-gpt', 'apiKey');
    const speaker = game.users.get(chatSpeakerData.user);
    let gmID;

    // Define "author"
    let author = {
      "name" : speaker.name,
      "alias" : chatSpeakerData.speaker.alias,
      "role" : "",
      "user" : speaker
    }

    // Check if the author is a GM, if they are, define gmID as their IDm set their name as "GM" and their role as "Gamemaster"
    // if they are not, set the correct GM ID and set the author with their details and their role as "Player".
    if (speaker.isGM) {
      gmID = author.id;
      author.role = "Gamemaster"
    }else{
      gmID = game.users.find(u => u.isGM).id;
      author.role = "Player"
    }

    // Set context of the message
    let context = {
      location : "CHAT",
      systemName : game.system.id,
      author : author
    }

    // Call the chatGPTRequest function with the message and context variables
    chatGPTRequest(apiKey, gmID, message, context);
    return false;
  }
})