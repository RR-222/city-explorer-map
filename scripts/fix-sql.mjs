import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const file = resolve(process.cwd(), 'data/all-import.sql');
let sql = readFileSync(file, 'utf-8');

const oldBlock = `-- 补充 flowers 表缺失的列
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS intro text;
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS source_url text;`;

const newBlock = `-- 补充 flowers 表缺失的列
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS intro text;
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS flowers text[] DEFAULT '{}';
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}';`;

if (sql.includes(oldBlock)) {
  sql = sql.replace(oldBlock, newBlock);
  writeFileSync(file, sql, 'utf-8');
  console.log('Fixed: added flowers and photos columns');
} else {
  console.log('Old block not found, checking current state...');
  // Just add the missing ALTER before DELETE FROM flowers
  sql = sql.replace(
    'DELETE FROM flowers;',
    "ALTER TABLE flowers ADD COLUMN IF NOT EXISTS flowers text[] DEFAULT '{}';\nALTER TABLE flowers ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}';\n\nDELETE FROM flowers;"
  );
  writeFileSync(file, sql, 'utf-8');
  console.log('Fixed: added columns before DELETE');
}
