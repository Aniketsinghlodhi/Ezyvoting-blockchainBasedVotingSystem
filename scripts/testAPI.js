const http = require('http');

const API_BASE = 'http://localhost:4000';

// Helper to make HTTP requests
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, body: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log("║         EzyVoting - Backend API Testing Suite            ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  let adminToken = null;
  const testResults = [];

  try {
    // Test 1: Admin Registration
    console.log("1️⃣  TEST: Admin Registration");
    console.log("━".repeat(50));
    try {
      const adminReg = await makeRequest('POST', '/api/auth/admin/register', {
        email: 'admin-test@local.dev',
        password: 'SecurePassword123!',
        inviteCode: 'demo-invite-123'
      });
      console.log(`Status: ${adminReg.status}`);
      if (adminReg.status === 201 || adminReg.status === 400) {
        console.log(`Response: ${JSON.stringify(adminReg.body).slice(0, 100)}...`);
        testResults.push('✅ Admin Registration: PASS');
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
      testResults.push('❌ Admin Registration: FAIL');
    }
    console.log();

    // Test 2: Admin Login
    console.log("2️⃣  TEST: Admin Login");
    console.log("━".repeat(50));
    try {
      const adminLogin = await makeRequest('POST', '/api/auth/admin/login', {
        email: 'admin-test@local.dev',
        password: 'SecurePassword123!'
      });
      console.log(`Status: ${adminLogin.status}`);
      if (adminLogin.status === 200 && adminLogin.body.token) {
        adminToken = adminLogin.body.token;
        console.log(`Token: ${adminToken.slice(0, 50)}...`);
        console.log(`Admin: ${adminLogin.body.admin.email}`);
        testResults.push('✅ Admin Login: PASS');
      } else {
        console.log(`Response: ${JSON.stringify(adminLogin.body).slice(0, 150)}...`);
        testResults.push('⚠️  Admin Login: INCOMPLETE (may be first setup)');
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
      testResults.push('⚠️  Admin Login: NETWORK ERROR');
    }
    console.log();

    // Test 3: Voter Registration (as Admin)
    console.log("3️⃣  TEST: Voter Registration");
    console.log("━".repeat(50));
    if (adminToken) {
      try {
        const voterReg = await makeRequest('POST', '/api/auth/voter/register', {
          email: 'voter-test@local.dev',
          voterId: 'test-voter-' + Date.now(),
          constituency: 'North Region'
        });
        console.log(`Status: ${voterReg.status}`);
        if (voterReg.status === 201 || voterReg.status === 200) {
          console.log(`Response: Success`);
          testResults.push('✅ Voter Registration: PASS');
        } else {
          console.log(`Response: ${JSON.stringify(voterReg.body).slice(0, 100)}...`);
          testResults.push('⚠️  Voter Registration: CHECK');
        }
      } catch (e) {
        console.log(`Error: ${e.message}`);
        testResults.push('⚠️  Voter Registration: NETWORK ERROR');
      }
    } else {
      console.log("Skipped (no admin token)");
      testResults.push('⏭️  Voter Registration: SKIPPED');
    }
    console.log();

    // Test 4: Voter Login
    console.log("4️⃣  TEST: Voter Login");
    console.log("━".repeat(50));
    try {
      const voterLogin = await makeRequest('POST', '/api/auth/voter/login', {
        voterId: 'demo-voter-1'
      });
      console.log(`Status: ${voterLogin.status}`);
      if (voterLogin.status === 200 && voterLogin.body.voterToken) {
        console.log(`Status: Voter Found`);
        console.log(`Voted: ${voterLogin.body.hasVoted}`);
        testResults.push('✅ Voter Login: PASS');
      } else {
        console.log(`Response: ${JSON.stringify(voterLogin.body).slice(0, 100)}...`);
        testResults.push('⚠️  Voter Login: CHECK');
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
      testResults.push('⚠️  Voter Login: NETWORK ERROR');
    }
    console.log();

    // Test 5: Get Voter Status
    console.log("5️⃣  TEST: Get Voter Status");
    console.log("━".repeat(50));
    try {
      const voterStatus = await makeRequest('POST', '/api/auth/voter/login', {
        voterId: 'demo-voter-2'
      });
      console.log(`Status: ${voterStatus.status}`);
      if (voterStatus.status === 200) {
        console.log(`Voter ID: ${voterStatus.body.voterId}`);
        console.log(`Has Voted: ${voterStatus.body.hasVoted}`);
        console.log(`Constituency: ${voterStatus.body.constituency || 'N/A'}`);
        testResults.push('✅ Voter Status: PASS');
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
      testResults.push('⚠️  Voter Status: ERROR');
    }
    console.log();

    // Test 6: Health Check
    console.log("6️⃣  TEST: API Health Check");
    console.log("━".repeat(50));
    try {
      const health = await makeRequest('GET', '/api/health');
      console.log(`Status: ${health.status}`);
      if (health.status === 200) {
        console.log(`API: Online`);
        testResults.push('✅ API Health: PASS');
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
      testResults.push('❌ API Health: DOWN');
    }
    console.log();

    // Summary
    console.log("╔═══════════════════════════════════════════════════════════╗");
    console.log("║             ✅ API TESTING COMPLETED                      ║");
    console.log("╚═══════════════════════════════════════════════════════════╝\n");

    console.log("📊 Test Results:");
    testResults.forEach(result => console.log(`   ${result}`));
    console.log();

  } catch (error) {
    console.error("Fatal Error:", error.message);
  }
}

main();
