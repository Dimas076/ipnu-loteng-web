const fs = require('fs');
const path = require('path');

function fixBgPrimary(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixBgPrimary(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Find all classNames containing bg-primary and ensure they have text-on-primary
      // We will simply replace `bg-primary` with `bg-primary text-on-primary`
      // But we need to make sure we don't duplicate `text-on-primary` or overwrite existing `text-white` without removing them first
      
      let modified = false;
      content = content.replace(/className=(["'])(.*?)\1/g, (match, quote, classes) => {
        if (classes.includes('bg-primary') && !classes.includes('bg-primary-') && !classes.includes('text-on-primary') && !classes.includes('text-white')) {
          modified = true;
          // also remove any existing text-xxx classes that might conflict
          let newClasses = classes.replace(/text-([a-zA-Z0-9-]+)/g, '').replace(/\s+/g, ' ').trim();
          return `className=${quote}${newClasses} text-on-primary${quote}`;
        }
        return match;
      });

      if (modified) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

fixBgPrimary(path.join(process.cwd(), 'src'));
console.log('Fixed contrast for bg-primary elements');
