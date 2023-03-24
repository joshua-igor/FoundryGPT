// Create the HTTP POST to OpenAI API
export async function chatGPTRequest(apiKey, gmID, message, context) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    // Set the API request body
    let requestBody = JSON.stringify({
      'model': 'gpt-3.5-turbo',
      'messages': [
        {'role': 'user', 'content': `My name is ${context.author.name} I'm playing ${context.systemName} as a ${context.author.role} using FoundryVTT, my character's name is ${context.author.alias}./nWho are you?/n`},
        {'role': 'assistant', 'content': `Hello, ${context.author.name}. My name is FoundryGPT, I am an RPG bot that help players and GMs. I can assist you with rules, character creation, inspiration and other aspects of your game./n`},
        {'role': 'user','content': `${message}/n`}
    ],
      'max_tokens': 100,
      'temperature': 0.5,
      'stop':'/n'
    }); 
    console.log(`RequestHeader: ${headers}`);
    console.log(`RequestBody: ${requestBody}`);

    // Replace either "/ai" or "/gpt" with "FoundryGPT:"
    message = message.replace(/\/ai|\/gpt/, '<div class="tags"><span class="tag tag_transparent"><b>To FoundryGPT:</b></span></div>')
    //Create the chatMessage with the user's prompt
    ChatMessage.create({ "content": message, "speaker": {"actor": context.author.user.id}});
    try {
      let data;
      // Make the API request
      let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: requestBody
      });
      if (response.ok) { // if HTTP-status is 200-299
        // get the response body
        data = await response.json();
      } else {
        alert("HTTP-Error: " + response.status);
      }
      // Parse the API response and send it as a chat message
      console.log(`Response: ${JSON.stringify(data)}`);
      let reply = `${data.choices[0].message.content}`;
      ChatMessage.create({ "content": reply, "speaker": { "actor": gmID, "alias": "FoundryGPT" }});
    } catch (error) {
      console.error(`FoundryGPT | Error making ChatGPT API request: ${error}`);
    }
  }