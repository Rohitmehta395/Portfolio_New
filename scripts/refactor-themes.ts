import fs from 'fs';
import path from 'path';

const TARGET_DIRS = [
  path.join(__dirname, '../app/(site)'),
  path.join(__dirname, '../features'),
];

const REPLACEMENTS: Record<string, string> = {
  'bg-black': 'bg-background',
  'bg-white': 'bg-foreground',
  'bg-neutral-950': 'bg-card',
  'bg-neutral-900': 'bg-muted',
  'bg-neutral-800': 'bg-secondary',
  'text-white': 'text-foreground',
  'text-black': 'text-background',
  'text-neutral-400': 'text-muted-foreground',
  'text-neutral-300': 'text-secondary-foreground',
  'border-neutral-900': 'border-border',
  'border-neutral-800': 'border-border',
  'hover:bg-neutral-800': 'hover:bg-secondary',
  'hover:text-white': 'hover:text-foreground',
  'hover:text-black': 'hover:text-background',
  'hover:bg-white': 'hover:bg-foreground',
  'hover:bg-neutral-900': 'hover:bg-muted',
  'border-neutral-700': 'border-muted-foreground',
};

function getFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function processFiles() {
  let changedFilesCount = 0;

  for (const dir of TARGET_DIRS) {
    const files = getFiles(dir);
    
    for (const file of files) {
      // Skip the admin layout/css if it accidentally gets caught, 
      // though our target dirs are app/(site) and features
      if (file.includes('admin.css')) continue;
      
      let content = fs.readFileSync(file, 'utf-8');
      let originalContent = content;

      for (const [oldClass, newClass] of Object.entries(REPLACEMENTS)) {
        // Replace with word boundaries to avoid matching prefixes
        // e.g. text-white doesn't match text-white/50 (wait, what about opacity /50?)
        // If there's an opacity modifier, the \b boundary handles it, but let's be careful.
        // Actually, Tailwind v4 allows bg-background/50 just fine.
        
        // We need to replace class names but keep modifiers if any.
        // A simple string replace regex with \b:
        const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
        content = content.replace(regex, newClass);
      }

      if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf-8');
        changedFilesCount++;
        console.log(`Updated: ${path.relative(process.cwd(), file)}`);
      }
    }
  }

  console.log(`\nRefactoring complete. Modified ${changedFilesCount} files.`);
}

processFiles();
