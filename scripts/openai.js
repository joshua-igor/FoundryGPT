// Create the HTTP POST to OpenAI API
export async function chatGPTRequest(apiKey, gmID, finalPrompt) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    // Set the API request body
    let requestBody = JSON.stringify({
      'model': 'gpt-3.5-turbo',
      'messages': finalPrompt,
      'max_tokens': 200,
      'temperature': 0.5,
      'stop':'/n'
    });
    console.log(`RequestHeader: ${headers}`);
    console.log(`RequestBody: ${requestBody}`);

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