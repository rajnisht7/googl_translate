const puppeteer = require('puppeteer');

async function translate({ detect = 'auto', text, target }) {
  if (!text || !target) {
    throw new Error('Text and target language are required');
  }

  const encodedText = encodeURIComponent(text);
  const url = `https://translate.google.com/?sl=${encodeURIComponent(detect)}&tl=${encodeURIComponent(target)}&text=${encodedText}&op=translate`;

  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Try multiple selectors
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
        // Scrape all matching elements and combine their text
        const texts = await page.$$eval(selector, els => els.map(el => el.textContent.trim()).filter(text => text && text !== 'Test'));
        if (texts.length > 0) {
          translatedText = texts.join(' ');
          break; // Found valid translation, exit loop
        }
      } catch (err) {
        console.log(`Selector ${selector} failed: ${err.message}`);
      }
    }

    if (!translatedText || translatedText === 'Test') {
      throw new Error(`Translation not found. Tried selectors: ${selectors.join(', ')}`);
    }

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = translate;