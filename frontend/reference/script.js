async function chat() {
  const userInput = document.getElementById('userInput').value;

  if (!userInput) {
    alert('Please enter a message.');
    return;
  }

  try {
    const response = await fetch('/api/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userInput }),
    });

    if (!response.ok || !response.body) {
      throw response;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const output = document.getElementById('responseText');

    output.textContent = 'Waiting...';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      output.textContent += decoder.decode(value, { stream: true });
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('responseText').textContent =
      'Error connecting to server.';
  }
}

async function generate() {
  const userInput = document.getElementById('userInput').value;

  if (!userInput) {
    alert('Please enter a message.');
    return;
  }

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userInput }),
    });

    if (!response.ok || !response.body) {
      throw response;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const output = document.getElementById('responseText');

    output.textContent = 'Waiting...';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      output.textContent += decoder.decode(value, { stream: true });
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('responseText').textContent =
      'Error connecting to server.';
  }
}
