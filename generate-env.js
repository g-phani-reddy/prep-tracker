const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const envPath = path.join(projectRoot, '.env');
const outPath = path.join(projectRoot, 'prep-tracker', 'env.js');

if (!fs.existsSync(envPath)) {
  console.error('.env file not found in project root. Create one with SUPABASE_URL and SUPABASE_KEY.');
  process.exit(1);
}

const raw = fs.readFileSync(envPath, 'utf8');
const env = raw.split(/\r?\n/).reduce((acc, line) => {
  const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if (!match) return acc;
  let value = match[2].trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  acc[match[1]] = value;
  return acc;
}, {});

const content = `window.__ENV__ = {
  SUPABASE_URL: ${JSON.stringify(env.SUPABASE_URL || '')},
  SUPABASE_KEY: ${JSON.stringify(env.SUPABASE_KEY || '')}
};\n`;
fs.writeFileSync(outPath, content, 'utf8');
console.log(`Generated ${path.relative(projectRoot, outPath)}`);
