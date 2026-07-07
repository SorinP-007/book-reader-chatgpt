# Book Reader ChatGPT

O pagina simpla care primeste titlul unei carti si autorul, apoi cere OpenAI un raspuns structurat pe baza promptului tau.

## GitHub Pages

Poti publica folderul ca pagina statica. Pe GitHub Pages, utilizatorul introduce cheia OpenAI in zona "Setari OpenAI", apoi apasa butonul.

Important: pentru o pagina publica, cheia introdusa in browser nu este o varianta sigura pentru multi utilizatori. Pentru folosire privata sau demo rapid este ok; pentru productie, foloseste varianta cu server.

## Pornire locala cu server

In PowerShell:

```powershell
$env:OPENAI_API_KEY="cheia-ta-openai"
node server.js
```

Apoi deschide:

```text
http://localhost:3000
```

Optional, poti alege alt model:

```powershell
$env:OPENAI_MODEL="gpt-4.1-mini"
```
