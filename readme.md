# googl_translate

A Node.js package to translate text into multiple languages using Google Translate.

## 📦 Installation

```bash
npm install googl_translate
```

## 🚀 Usage

```javascript
const translate = require("googl_translate");

async function test() {
  const result = await translate({ text: "Hello", target: "es" });
  console.log(result); // Output: { detect: 'success', translated_text: 'Hola' }
}

//The result will be in json format detect - tells us if the given text is in the language as given in detect it will be always success for auto

test();
```

```javascript
const translate = require('googl_translate');

async function test() {
  const result = await translate({ detect:"invalid": text: 'Hello', target: 'es' });
  console.log(result); // Output: { detect: 'fail', translated_text: 'Hola' }
  console.log(result.translated_text); // Output: Hola
}

//Even though detect fails but the language will still be translated into target language

test();
```

## ⚙️ Parameters

The `translate` function takes the following parameters as an object:

```javascript
translate({ detect, text, target });
```

- **detect** _(optional)_ — Source language code (e.g., `"en"` for English). Defaults to `"auto"`, which automatically detects the input language.
- **text** _(required)_ — The text you want to translate.
- **target** _(required)_ — The language code for the desired output language (e.g., `"ar"` for Arabic).

### Example:

```javascript
const result = await translate({
  detect: "en",
  text: "hello",
  target: "fr",
});
console.log(result); // Output: bonjour
```

## 📘 Notes

- Language codes follow the [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) standard (e.g., `"en"`, `"fr"`, `"es"`, `"ar"`).
- Internet connection is required since it uses Google Translate API behind the scenes.
