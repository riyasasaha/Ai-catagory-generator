const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const genAI = new GoogleGenerativeAI('AIzaSyDJ6QBeHLSMkMv6Hexv_BTmEsgzWNoAjWk');
async function test() {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hello');
        fs.writeFileSync('output.json', JSON.stringify({ success: true, text: result.response.text() }));
        console.log("DONE!");
    } catch (e) {
        fs.writeFileSync('output.json', JSON.stringify({ success: false, error: e.message }));
        console.log("DONE W/ ERROR!");
    }
}
test();
