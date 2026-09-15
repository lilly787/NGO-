// Run: node prisma/set-password.js yourpassword
const bcrypt = require('bcryptjs');
const password = process.argv[2];
if (!password) { console.error('Usage: node prisma/set-password.js <password>'); process.exit(1); }
bcrypt.hash(password, 12).then(hash => {
  const fs = require('fs');
  let env = fs.readFileSync('.env', 'utf8');
  env = env.replace(/ADMIN_PASSWORD_HASH="[^"]*"/, `ADMIN_PASSWORD_HASH="${hash}"`);
  fs.writeFileSync('.env', env);
  console.log('Password set successfully.');
  console.log('Hash written:', hash);
  // Verify
  return bcrypt.compare(password, hash);
}).then(ok => {
  console.log('Verification:', ok ? 'PASS' : 'FAIL');
});
