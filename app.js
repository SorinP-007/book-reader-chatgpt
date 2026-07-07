const form = document.querySelector("#bookForm");
const bookInput = document.querySelector("#book");
const authorInput = document.querySelector("#author");
const apiKeyInput = document.querySelector("#apiKey");
const button = document.querySelector("#submitButton");
const result = document.querySelector("#result");
const copyButton = document.querySelector("#copyButton");
const model = "gpt-4.1-mini";
const canUseLocalServer = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

function buildPrompt(book, author) {
  const titleLine = author
    ? `Based on the book **"${book}"** by **${author}**`
    : `Based on the book **"${book}"**`;

  return `Act as a thoughtful, insightful reader and storyteller with a deep understanding of literature and human behavior.

${titleLine}, provide a rich, engaging, and well-structured response that blends clarity, storytelling, and practical wisdom.

Please include the following:

1. **A concise yet vivid less then half-page summary** of the book, capturing its essence, tone, and key message.

2. **Five core ideas** from the book, clearly explained and distilled into memorable insights.

3. **Six detailed examples** from the book that illustrate key themes or lessons. Add enough context to make them relatable and meaningful.

4. **Three possible future trends or outcomes** (personal or societal) inspired by the ideas in the book.

5. **Two practical ideas I can personally apply immediately** in my life based on the book.

6. **Two simple, engaging ideas I could share with friends over a beer**, phrased in a conversational and memorable way.

7. **One surprising or philosophical idea** from the book - something counterintuitive or not commonly noticed.

8. **Two anecdotes from the book** (if available), told briefly but vividly to capture their emotional or reflective impact.

9. **Two light, clever jokes or humorous moments** inspired by or found in the book (if applicable), aligned with its tone.

Style requirements:
- Warm, engaging, slightly storytelling tone
- Clear, memorable, easy-to-retell ideas
- Balanced between insight and practicality
- Feels like a mix of wisdom, conversation, and inspiration

Make the response feel impressive, original, and contest-worthy.`;
}

function setResult(text, mode = "normal") {
  result.textContent = text;
  result.classList.toggle("empty", mode === "empty");
  result.classList.toggle("error", mode === "error");
}

async function generateWithBrowserKey(book, author, apiKey) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: buildPrompt(book, author),
      temperature: 0.8
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "OpenAI a returnat o eroare.");
  }

  return data.output_text || "";
}

async function generateWithLocalServer(book, author) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ book, author })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Nu am putut genera raspunsul.");
  }

  return data.text || "";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const book = bookInput.value.trim();
  const author = authorInput.value.trim();
  const apiKey = apiKeyInput.value.trim();

  if (!book) {
    setResult("Scrie mai intai titlul cartii.", "error");
    bookInput.focus();
    return;
  }

  button.disabled = true;
  button.classList.add("loading");
  setResult("Se construieste raspunsul...", "empty");

  try {
    if (!apiKey && !canUseLocalServer) {
      throw new Error("Adauga cheia OpenAI in Setari OpenAI pentru varianta publicata pe GitHub Pages.");
    }

    const text = apiKey
      ? await generateWithBrowserKey(book, author, apiKey)
      : await generateWithLocalServer(book, author);

    setResult(text || "Nu a venit niciun raspuns de la model.");
  } catch (error) {
    setResult(error.message, "error");
  } finally {
    button.disabled = false;
    button.classList.remove("loading");
  }
});

copyButton.addEventListener("click", async () => {
  const text = result.textContent.trim();
  if (!text || result.classList.contains("empty")) return;

  await navigator.clipboard.writeText(text);
  copyButton.textContent = "Copiat";
  window.setTimeout(() => {
    copyButton.textContent = "Copiaza";
  }, 1200);
});
