import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

dotenv.config({ path: 'd:\\blog-MERN\\.env' });

const resourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  resourceType: { type: String, default: 'PDF' },
  fileUrl: String,
  content: { type: String, default: '' },
  slug: { type: String, unique: true, sparse: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);

const createSlug = (title) => {
  const baseSlug = title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
  return `${baseSlug}-${Math.random().toString(36).slice(-4)}`;
};

const dsaDir = 'C:\\Users\\ysaty\\.gemini\\antigravity-ide\\brain\\87d2b51c-dbb9-4cf2-8a16-8c704247037b\\scratch\\dsa';

// Helper to recursively get all readmes and standard cpps
const extractContentFromDir = (dirPath) => {
  let contentBlocks = [];
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  // Sort entries so we process them in alphabetical order
  entries.sort((a, b) => a.name.localeCompare(b.name));

  for (let entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      contentBlocks = contentBlocks.concat(extractContentFromDir(fullPath));
    } else if (entry.isFile()) {
      if (entry.name.toLowerCase() === 'readme.md') {
        const text = fs.readFileSync(fullPath, 'utf-8');
        // Truncate to just the main context (cut off at complexity or common mistakes)
        let cutIndex = text.indexOf('## 4.');
        if (cutIndex === -1) cutIndex = text.indexOf('## 5.');
        if (cutIndex === -1) cutIndex = text.indexOf('## 6.');
        if (cutIndex === -1) cutIndex = text.indexOf('# Mistakes');
        
        let context = cutIndex !== -1 ? text.substring(0, cutIndex) : text;
        contentBlocks.push(context.trim());
      } else if (entry.name.toLowerCase().includes('standard') && entry.name.endsWith('.cpp')) {
        const code = fs.readFileSync(fullPath, 'utf-8');
        contentBlocks.push(`\n\n### Implementation\n\`\`\`cpp\n${code}\n\`\`\`\n\n`);
      }
    }
  }
  
  return contentBlocks;
};

const formatTitle = (folderName) => {
  // e.g. "01.cpp_foundation_stl_complexity" -> "1. Cpp Foundation Stl Complexity"
  let parts = folderName.split('.');
  if (parts.length < 2) return folderName;
  
  const orderNum = parseInt(parts[0], 10);
  let name = parts.slice(1).join(' ').replace(/_/g, ' ');
  // Title case
  name = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return `${orderNum}. ${name}`;
};

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO || 'mongodb://localhost:27017/blog-mern';
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    // Delete existing DSA resources to start fresh
    await Resource.deleteMany({ category: 'DSA' });
    console.log('Cleared existing DSA resources');

    const mainFolders = fs.readdirSync(dsaDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => /^\d{2}\./.test(name)); // Only match "01.", "02.", etc.

    // Sort to ensure 1 to 30
    mainFolders.sort((a, b) => parseInt(a.substring(0, 2)) - parseInt(b.substring(0, 2)));

    // Keep only up to 30
    const foldersToProcess = mainFolders.slice(0, 30);

    for (let folder of foldersToProcess) {
      const folderPath = path.join(dsaDir, folder);
      const title = formatTitle(folder);
      const order = parseInt(folder.substring(0, 2), 10);
      
      console.log(`Processing ${title}...`);
      
      const blocks = extractContentFromDir(folderPath);
      let markdownContent = blocks.join('\n\n---\n\n');
      
      if (!markdownContent) {
        markdownContent = 'Content coming soon.';
      }
      
      const htmlContent = marked.parse(markdownContent);
      
      const resource = new Resource({
        title: title,
        description: `DSA Notes on ${title.split('. ')[1]}`,
        category: 'DSA',
        content: htmlContent,
        order: order,
        slug: createSlug(title)
      });

      await resource.save();
      console.log(`Seeded: ${title}`);
    }

    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
