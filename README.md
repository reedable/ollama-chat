# ollama-server

An HTTP server/client with Ollama backend.

## Getting started

### Prerequisites

- Homebrew
- Node.js
- NPM
- Ollama
- deepseek-r1:1.5b

### Install and run Ollama

```
brew install ollama
ollama serve
ollama pull deepseek-r1:1.5b
```

By default, the Ollama server listens on port 11434. You can change this by
setting the environment variable `OLLAMA_HOST`.

Learn more at [Ollama FAQ](https://github.com/ollama/ollama/blob/main/docs/faq.md)

### Install and run MongoDB

```
brew tap mongodb/brew
brew update
brew install mongodb-community@8.0
brew services start mongodb/brew/mongodb-community
```

By default, the MongoDB server listens on port 27017.

## Start the frontend and backend servers

Run the following command:

```
npm run start
```

## Access the UI

Visit:

http://localhost:8080
