const puppeteer = require('puppeteer');

async function translate(...args) {

    let detect = 'auto', text, target;

  
  // Check argument format
  if (args.length === 1 && typeof args[0] === 'object') {
    ({ detect = 'auto', text, target } = args[0]);
  } else if (args.length === 2) {
    [text, target] = args;
    detect = 'auto'; // Default detect to 'auto' for two arguments
  } else if (args.length === 3) {
    [detect, text, target] = args;
  } else {
    throw new Error('Invalid arguments: Provide { detect, text, target }, (detect, text, target), or (text, target)');
  }

  
  if (!text || !target) {
    throw new Error('Text and target language are required');
  }

  const encodedText = encodeURIComponent(text);
  let result = { detect: 'success', translated_text: '' };
  let url = `https://translate.google.com/?sl=${encodeURIComponent(detect)}&tl=${encodeURIComponent(target)}&text=${encodedText}&op=translate`;

  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Get detected source language
    let detectedLanguage = '';
    try {
      detectedLanguage = await page.$eval('[data-language-code][aria-selected="true"]', el => el.getAttribute('data-language-code') || 'auto');
    } catch (err) {
      detectedLanguage = 'unknown';
    }

    const selectors = [
      'span.ryNqvb',
      'span[jsname="V67aGc"].VfPpkd-vQzf8d',
      'div.HwtZe span',
      'span[class*="translation"]'
    ];

    let translatedText = null;
    for (const selector of selectors) {
      try {
        await page.waitForSelector(selector, { timeout: 10000 });
        const texts = await page.$$eval(selector, els => els.map(el => el.textContent.trim()).filter(text => text && text !== 'Test'));
        if (texts.length > 0) {
          translatedText = texts.join(' ');
          break;
        }
      } catch (err) {
        // Silently continue to next selector
      }
    }

    // Check if provided detect language matches and translation is valid
    if (detect !== 'auto' && detectedLanguage !== detect) {
      result.detect = 'fail';
      url = `https://translate.google.com/?sl=auto&tl=${encodeURIComponent(target)}&text=${encodedText}&op=translate`;
      await page.goto(url, { waitUntil: 'networkidle2' });

      translatedText = null;
      for (const selector of selectors) {
        try {
          await page.waitForSelector(selector, { timeout: 10000 });
          const texts = await page.$$eval(selector, els => els.map(el => el.textContent.trim()).filter(text => text && text !== 'Test'));
          if (texts.length > 0) {
            translatedText = texts.join(' ');
            break;
          }
        } catch (err) {
          // Silently continue to next selector
        }
      }
    } else if (!translatedText || translatedText === text && detect !== target) {
      result.detect = 'fail';
      url = `https://translate.google.com/?sl=auto&tl=${encodeURIComponent(target)}&text=${encodedText}&op=translate`;
      await page.goto(url, { waitUntil: 'networkidle2' });

      translatedText = null;
      for (const selector of selectors) {
        try {
          await page.waitForSelector(selector, { timeout: 10000 });
          const texts = await page.$$eval(selector, els => els.map(el => el.textContent.trim()).filter(text => text && text !== 'Test'));
          if (texts.length > 0) {
            translatedText = texts.join(' ');
            break;
          }
        } catch (err) {
          // Silently continue to next selector
        }
      }
    }

    if (!translatedText || translatedText === 'Test') {
      throw new Error(`Translation not found. Tried selectors: ${selectors.join(', ')}`);
    }

    result.translated_text = translatedText;
    return result;
  } catch (error) {
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = translate;