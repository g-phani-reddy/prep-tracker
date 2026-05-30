const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const envPath = path.join(projectRoot, '.env');
const outPath = path.join(projectRoot, 'prep-tracker', 'env.js');

if (!fs.existsSync(envPath)) {
  console.error('.env file not found in project root. Create one with SUPABASE_URL and SUPABASE_KEY.');
  process.exit(1);
}

const env = {
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || ''
};

if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found in project root. Create one with SUPABASE_URL and SUPABASE_KEY.');
    process.exit(1);
  }

  const raw = fs.readFileSync(envPath, 'utf8');
  raw.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) return;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!env[match[1]]) env[match[1]] = value;
  });
}

if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_KEY must be set in .env or as environment variables.');
  process.exit(1);
}

const content = `window.__ENV__ = {
  SUPABASE_URL: ${JSON.stringify(env.SUPABASE_URL)},
  SUPABASE_KEY: ${JSON.stringify(env.SUPABASE_KEY)}
};\n`;
fs.writeFileSync(outPath, content, 'utf8');
console.log(`Generated ${path.relative(projectRoot, outPath)}`);
