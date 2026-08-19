import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import dotenv from 'dotenv';

// Import model relative to the execution root (d:\blog-MERN)
import Resource from './api/src/models/resource.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO || "mongodb+srv://zebra:zebra123@cluster0.abcde.mongodb.net/blog?retryWrites=true&w=majority";

function formatHeading(dirName) {
  const match = dirName.match(/^phase(\d+)\.(.+)$/);
  if (!match) return dirName;
  const num = match[1];
  const title = match[2].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return `${num}. ${title}`;
}

function formatSubtopic(fileName) {
  const match = fileName.match(/^\d+\.(\d+)\.(.+)\.md$/);
  if (!match) return fileName;
  const num = parseInt(match[1]);
  // 1->a, 2->b, ... 26->z
  const letter = String.fromCharCode(96 + num);
  const title = match[2].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return `${letter}. ${title}`;
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to DB");

  // Clear existing OS resources
  await Resource.deleteMany({ category: 'Operating System' });
  console.log("Cleared old Operating System resources");

  const osDir = path.resolve('C:\\Users\\ysaty\\.gemini\\antigravity-ide\\brain\\87d2b51c-dbb9-4cf2-8a16-8c704247037b\\scratch\\CSE-Notes\\operating_system');
  
  const dirs = fs.readdirSync(osDir).filter(f => f.startsWith('phase')).sort((a, b) => {
    const matchA = a.match(/^phase(\d+)/);
    const matchB = b.match(/^phase(\d+)/);
    const numA = matchA ? parseInt(matchA[1]) : 0;
    const numB = matchB ? parseInt(matchB[1]) : 0;
    return numA - numB;
  });

  let orderCount = 1;

  for (const dir of dirs) {
    const headingTitle = formatHeading(dir);
    console.log(`Processing Heading: ${headingTitle}`);
    
    const hSlug = headingTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).slice(-4);
    
    await Resource.create({
      title: headingTitle,
      description: `Operating System Section: ${headingTitle}`,
      category: 'Operating System',
      resourceType: 'Heading',
      slug: hSlug,
      order: orderCount++
    });

    const phasePath = path.join(osDir, dir);
    const files = fs.readdirSync(phasePath).filter(f => f.endsWith('.md')).sort((a, b) => {
      const matchA = a.match(/^\d+\.(\d+)/);
      const matchB = b.match(/^\d+\.(\d+)/);
      const numA = matchA ? parseInt(matchA[1]) : 0;
      const numB = matchB ? parseInt(matchB[1]) : 0;
      return numA - numB;
    });

    for (const file of files) {
      const subTitle = formatSubtopic(file);
      console.log(`  Processing Subtopic: ${subTitle}`);
      
      const mdContent = fs.readFileSync(path.join(phasePath, file), 'utf8');
      const htmlContent = marked.parse(mdContent);

      const sSlug = subTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).slice(-4);

      await Resource.create({
        title: subTitle,
        description: `Notes on ${subTitle}`,
        category: 'Operating System',
        resourceType: 'Markdown',
        content: htmlContent,
        slug: sSlug,
        order: orderCount++
      });
    }
  }

  console.log("Successfully seeded OS Notes!");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
