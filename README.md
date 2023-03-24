# FoundryGPT (WIP)
This is a highly early FoundryVTT module to provide ChatGPT-like features inside FoundryVTT while being aware of context.

You first have to provide the module with your API Key, you can find it at https://platform.openai.com/account/api-keys

You can set the API Key on Foundry's Configuration, but the module also asks for you everytime you open Foundry and do not have a key set.

To ask something from FoundryGPT you just have to type "/ai" or "/gpt" on the chatbox and send the message. FoundryGPT will send a message shortly afterwards with the reply, the time it tkaes depends on OpenAI's servers.

For now, the replies are hard coded to stop at 100 tokens (~35 words). I will add a configuration to allow the GM to choose how long they want the replies to be.
