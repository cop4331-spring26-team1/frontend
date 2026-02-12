// Node.js file to test endpoints
import { urlBase, extension } from "../public/js/util.js";

/**
 * @param {string} label - Display name for the test
 * @param {string} filename - The PHP file name (without extension)
 * @param {object} payload - The JSON object to send
 */
async function testEndpoint(label, filename, payload = {}) {
    const url = `${urlBase}/${filename}.${extension}`;
    
    // Default options our API
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };
    
    try {
        const response = await fetch(url, options);
        
        // Security check: Verify if the server actually returned JSON
        const contentType = response.headers.get("content-type");
        let data;
        
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            // If the server crashes or hits a 404, it often returns HTML
            data = await response.text();
        }
        

        
        console.log(`[ ${filename} ] > ${label}`);
        console.log(data);
        console.log("---------");
        return true;
    } catch (err) {
        console.error(`💥 ERROR: [${label}] - Network Failure`);
        console.error(`   Details: ${err.message}`);
        return false;
    }
}

(async () => {
    console.log("🚀 Starting QA & Security Endpoint Tests...");
    console.log(`🔗 Target: ${urlBase}\n`);

    // --- LOGIN TESTS ---
    await testEndpoint('Should login successfully with valid credentials', 'Login', {
        login: 'user',
        password: 'pass'
    });

    await testEndpoint('Should fail when username does not exist', 'Login', {
        login: 'non_existent_user_123',
        password: 'pass'
    });

    await testEndpoint('Should fail when password is incorrect', 'Login', {
        login: 'user',
        password: 'wrong_password'
    });

    // --- REGISTRATION TESTS ---
    await testEndpoint('Should reject registration with a duplicate username', 'Register', {
        firstName: 'Test',
        lastName: 'User',
        username: 'user', // Existing user
        password: 'pass',
    });

    await testEndpoint('Should fail when password field is null (Validation Check)', 'Register', {
        firstName: 'Test',
        lastName: 'User',
        username: 'new_user',
        password: null,
    });

    // --- CONTACT TESTS ---
    await testEndpoint('Should retrieve all user contacts', 'GetAllContact', { userId: 0 });

    // --- SECURITY PROBES ---
    await testEndpoint('Security: Should handle special characters in login (SQLi Probe)', 'Login', {
        login: "' OR '1'='1",
        password: "any"
    });
    
    console.log("\n--- Tests Completed ---");
})();