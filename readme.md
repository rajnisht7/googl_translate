   A Node.js package to translate text to multiple languages using Google Translate.
   
   ## Installation
   ```bash
   npm install googl_translate
   ```
   
   ## Usage
   ```javascript
   const translate = require('googl_translate');
   
   async function test() {
     const result = await translate({ text: 'how are you', target: 'ar' });
     console.log(result); // Output: كيف حالك
   }
   
   test();
   ```