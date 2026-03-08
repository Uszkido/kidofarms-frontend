const fetch = require('node-fetch');

async function testSocialLogin() {
    const API_URL = 'http://localhost:5000';
    const testUser = {
        email: 'test-google-user@example.com',
        name: 'Test Google User',
        image: 'https://example.com/image.png'
    };

    try {
        console.log('Testing Social Login Endpoint...');
        const res = await fetch(`${API_URL}/api/auth/social-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        if (!res.ok) {
            const error = await res.json();
            console.error('Test Failed:', error);
            process.exit(1);
        }

        const data = await res.json();
        console.log('Test Passed!');
        console.log('User:', data.user);
        console.log('Token Received:', data.token ? 'Yes' : 'No');
    } catch (error) {
        console.error('Test Error:', error.message);
        console.log('Note: Ensure the backend is running at http://localhost:5000 before running this test.');
    }
}

testSocialLogin();
