const jwt = require('jsonwebtoken');

const JWT_SECRET = 'kido-farms-super-secret-12345';
const payload = {
    id: 'admin-id-mock',
    name: 'Antigravity Auditor',
    email: 'admin@kidofarms.com',
    role: 'admin',
    permissions: ['global_data_command', 'users', 'finance', 'inventory', 'promos', 'content', 'orders']
};

const token = jwt.sign(payload, JWT_SECRET);
console.log('TOKEN_START');
console.log(token);
console.log('TOKEN_END');
