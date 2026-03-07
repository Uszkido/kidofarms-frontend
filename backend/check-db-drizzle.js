require('dotenv').config();
const { db } = require('./src/db');
db.query.blogPosts.findMany().then(console.log).catch(console.error);
