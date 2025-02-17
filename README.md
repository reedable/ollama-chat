# ollama-chat

A web UI with an Ollama backend.

## Getting started

This project requires the following third-party software and a model.

- MongoDB (optional)
- Ollama

This project is being tested with `deepseek-R1:7B` and `mistral`. Both are 7B models, and my MacBook Pro M1 (32GB RAM) is capable of running them at a reasonable speed. DeepSeek performs a little bit better at solving puzzles (i.e., reasoning), but Mistral produces more natural and coherent responses.

- deepseek-R1:7b
- mistral

Note: There are concerns around DeepSeek app’s privacy practices and censorship in their model. This project does not depend on the DeepSeek app. There is no need to download their app. About the censorship: Every model is biased in some way. Please keep in mind the model trainers’ bias in its output.

### Prerequisites

- Homebrew
- Node.js
- NPM

### Install and run Ollama with DeepSeek

Ollama is an open-source framework for running large language models (LLMs) locally on your machine without relying on cloud-based APIs. It allows you to load and run AI models, supporting features like streaming responses via HTTP. Ollama is sessionless by default; each API call to ollama.chat does not maintain conversation history.

```
brew install ollama
ollama serve
ollama pull mistral
```

The Ollama server listens on port 11434. You can change this by setting the environment variable `OLLAMA_HOST`.

Learn more at [Ollama FAQ](https://github.com/ollama/ollama/blob/main/docs/faq.md)

### Install and run MongoDB

MongoDB is a NoSQL database that stores data in JSON-like documents. In this project, we use it to store and retrieve conversation history for maintaining chat context.

```
brew tap mongodb/brew
brew update
brew install mongodb-community@8.0
brew services start mongodb/brew/mongodb-community
```

The MongoDB server listens on port 27017.

## Set up .env

ollama-chat server uses `.env` to manage its environmental variables. Define your own environmental variables to run the server. Here's an example.

```
cat <<EOD >> backend/.env
PORT=3000
MODEL_NAME=mistral
EOD
```

## Start the frontend and backend servers

Run the following command:

```
npm run start
```

## Access the UI

Visit:

http://localhost:8080

### Sample conversations

#### DeepSeek-R1

DeepSeek with 7B parameters demonstrates better reasoning capabilities, though its response is noticeably slow.

<picture>
  <source
    srcset="docs/images/puzzle-deepseek-R1-7b-dark.png"
    media="(prefers-color-scheme: dark)">
  <img
    src="docs/images/puzzle-deepseek-R1-7b-light.png"
    style="box-shadow: 0.25rem .25rem 1rem rgba(0,0,0,0.3); border-radius: 0.5rem;"
    width="300"
    alt="User prompt: 'A man walks into the kitchen with a bowl of soup. He puts the bowl in the microwave, but before it is heated, he leaves the kitchen. A woman walks in, finds the man’s bowl of soup in the microwave, takes it out, and puts it in the fridge. She then walks out of the kitchen. Now, the man walks in, looking for his soup. Where would he look first?' DeepSeek's response: 'The man should look into the fridge first.  Step-by-step explanation: 1. The man initially places his bowl of soup in the microwave before leaving. 2. Upon return, he checks where his soup is and finds it has been moved by a woman who removed it from the microwave and placed it in the fridge. 3. Therefore, when searching for his soup, the logical next step after checking the microwave (where it was last left) is to look into the fridge. Answer: The man would first look into the fridge where he had taken the bowl of soup out of the microwave by the woman.'">
</picture>

#### Mistral

Mistral responded immediately, though its answer shows its lack of reasoning capability.

<picture>
  <source
    srcset="docs/images/puzzle-mistral-dark.png"
    media="(prefers-color-scheme: dark)">
  <img
    src="docs/images/puzzle-mistral-light.png"
    style="box-shadow: 0.25rem .25rem 1rem rgba(0,0,0,0.3); border-radius: 0.5rem;"
    width="300"
    alt="User prompt: 'A man walks into the kitchen with a bowl of soup. He puts the bowl in the microwave, but before it is heated, he leaves the kitchen. A woman walks in, finds the man’s bowl of soup in the microwave, takes it out, and puts it in the fridge. She then walks out of the kitchen. Now, the man walks in, looking for his soup. Where would he look first?' Mistral's response: 'The man would look first in the refrigerator, as that is where the woman put the bowl of soup after taking it out of the microwave.'">
</picture>
