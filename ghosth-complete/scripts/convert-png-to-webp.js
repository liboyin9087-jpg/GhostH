import { readdir, mkdir } from 'fs/promises';
import { join, dirname, relative, parse } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directories to process
const TARGET_DIRS = [
  'public/images/scenes',
  'public/images/hotspots'
];

const WEBP_QUALITY = 80;

/**
 * Recursively find all PNG files in a directory
 */
async function findPngFiles(dir, baseDir, results = []) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip webp directories
        if (entry.name !== 'webp') {
          await findPngFiles(fullPath, baseDir, results);
        }
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
        results.push({
          sourcePath: fullPath,
          relativePath: relative(baseDir, fullPath)
        });
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return results;
}

/**
 * Convert a PNG file to WebP format
 */
async function convertToWebp(sourcePath, targetPath) {
  try {
    // Ensure target directory exists
    await mkdir(dirname(targetPath), { recursive: true });
    
    // Convert PNG to WebP
    await sharp(sourcePath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(targetPath);
    
    return true;
  } catch (error) {
    console.error(`Error converting ${sourcePath}:`, error.message);
    return false;
  }
}

/**
 * Main conversion function
 */
async function convertPngToWebp() {
  const projectRoot = join(__dirname, '..');
  
  console.log('🔍 Starting PNG to WebP conversion...\n');
  
  let totalConverted = 0;
  let totalFailed = 0;
  
  for (const targetDir of TARGET_DIRS) {
    const fullTargetDir = join(projectRoot, targetDir);
    console.log(`📁 Processing: ${targetDir}`);
    
    // Find all PNG files
    const pngFiles = await findPngFiles(fullTargetDir, fullTargetDir);
    
    if (pngFiles.length === 0) {
      console.log(`   No PNG files found\n`);
      continue;
    }
    
    console.log(`   Found ${pngFiles.length} PNG file(s)`);
    
    // Convert each PNG file
    for (const { sourcePath, relativePath } of pngFiles) {
      const parsedPath = parse(relativePath);
      const relativeDir = parsedPath.dir || '.';
      const webpFilename = `${parsedPath.name}.webp`;
      
      // Create webp subdirectory path
      const webpTargetPath = join(fullTargetDir, 'webp', relativeDir, webpFilename);
      
      console.log(`   Converting: ${relativePath} → webp/${relativeDir}/${webpFilename}`);
      
      const success = await convertToWebp(sourcePath, webpTargetPath);
      
      if (success) {
        totalConverted++;
      } else {
        totalFailed++;
      }
    }
    
    console.log('');
  }
  
  console.log('✅ Conversion complete!');
  console.log(`   Converted: ${totalConverted} files`);
  if (totalFailed > 0) {
    console.log(`   Failed: ${totalFailed} files`);
  }
}

// Run the conversion
convertPngToWebp().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
