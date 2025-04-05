import { Ollama } from 'ollama';

const { OLLAMA_URI } = process.env;

export default new Ollama({ host: OLLAMA_URI });
