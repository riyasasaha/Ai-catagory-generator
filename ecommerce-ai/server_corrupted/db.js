const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.json');

const initDB = () => {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({ Products: [], AI_Logs: [] }, null, 2));
        console.log('Created JSON Database.');
    } else {
        console.log('Connected to JSON database.');
    }
};

const getDB = () => {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
};

const saveDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

const db = {
    run: (query, params, callback) => {
        try {
            const data = getDB();
            if (query.includes('INSERT INTO AI_Logs')) {
                const id = data.AI_Logs.length + 1;
                data.AI_Logs.push({
                    id,
                    timestamp: new Date().toISOString(),
                    system_prompt: params[0],
                    user_input: params[1],
                    raw_ai_response: params[2],
                    status_code: params[3]
                });
                saveDB(data);
                if (callback) callback.call({ lastID: id }, null);
            } else if (query.includes('INSERT INTO Products')) {
                const id = data.Products.length + 1;
                data.Products.push({
                    id,
                    name: params[0],
                    description: params[1],
                    primary_category: params[2],
                    sub_category: params[3],
                    seo_tags: params[4],
                    sustainability_filters: params[5]
                });
                saveDB(data);
                if (callback) callback.call({ lastID: id }, null);
            }
        } catch (err) {
            if (callback) callback(err);
        }
    },
    all: (query, params, callback) => {
        try {
            const data = getDB();
            if (query.includes('SELECT * FROM AI_Logs')) {
                // Return latest 50
                const logs = data.AI_Logs.slice().reverse().slice(0, 50);
                callback(null, logs);
            } else {
                callback(null, []);
            }
        } catch (err) {
            callback(err);
        }
    }
};

module.exports = { db, initDB };
