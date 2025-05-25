const translate = require('./translate');

async function main() {
  try {
    // Test 1: Basic translation to Arabic
    console.log('Test 1: Basic translation to Arabic');
    const result1 = await translate({ text: 'how are you', target: 'ar' });
    console.log('Result:', result1);

    // Test 2: Basic translation to Spanish
    console.log('\nTest 2: Basic translation to Spanish');
    const result2 = await translate({ detect: 'en', text: 'Good morning', target: 'es' });
    console.log('Result:', result2);

    // Test 3: Empty text
    console.log('\nTest 3: Empty text');
    try {
      await translate({ text: '', target: 'ar' });
    } catch (error) {
      console.log('Result:', error.message);
    }

    // Test 4: Invalid target language
    console.log('\nTest 4: Invalid target language');
    try {
      await translate({ text: 'how are you', target: 'xyz' });
    } catch (error) {
      console.log('Result:', error.message);
    }

    // Test 5: Long text
    console.log('\nTest 5: Long text');
    const longText = 'This is a very long sentence to test if the translation package can handle extended text inputs without breaking.';
    const result5 = await translate({ text: longText, target: 'fr' });
    console.log('Result:', result5);

    // Test 6: Special characters
    console.log('\nTest 6: Special characters');
    const specialText = 'Hello! @#$% How are you? 😊';
    const result6 = await translate({ text: specialText, target: 'hi' });
    console.log('Result:', result6);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();