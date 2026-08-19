import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import dotenv from 'dotenv';

// Import model relative to the execution root (d:\blog-MERN)
import Resource from './api/src/models/resource.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO || "mongodb+srv://zebra:zebra123@cluster0.abcde.mongodb.net/blog?retryWrites=true&w=majority";

function properCase(str) {
  const acronyms = ['C++', 'OOP', 'OS', 'STL', 'POSIX', 'API', 'TCP', 'UDP', 'I/O', 'UML', 'SOLID', 'CI/CD'];
  return str.split(' ').map(w => {
    if (acronyms.includes(w)) return w;
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');
}

function formatHeading(dirName) {
  // e.g. "PHASE 13 — C++ SYSTEMS PROGRAMMING"
  const match = dirName.match(/^PHASE (\d+)\s*[—\-]\s*(.+)$/i);
  if (!match) return { num: 0, title: dirName };
  const num = parseInt(match[1]);
  const text = properCase(match[2]);
  return { num, title: `${num}. ${text}` };
}

function formatSubtopic(fileName, idx) {
  // e.g. "13.1 Memory layout.md" or "Rate Limiter.md"
  let match = fileName.match(/^\d+\.\d+\s+(.+)\.md$/);
  let baseName = match ? match[1] : fileName.replace(/\.md$/i, '');
  
  const letter = String.fromCharCode(96 + idx);
  return `${letter}. ${baseName}`;
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to DB");

  // Clear existing SD resources
  await Resource.deleteMany({ category: 'System Design' });
  console.log("Cleared old System Design resources");

  const sdDir = path.resolve('C:\\Users\\ysaty\\.gemini\\antigravity-ide\\brain\\87d2b51c-dbb9-4cf2-8a16-8c704247037b\\scratch\\CSE-Notes\\system_design_c++');
  
  const dirs = fs.readdirSync(sdDir).filter(f => f.startsWith('PHASE')).sort((a, b) => {
    const matchA = a.match(/^PHASE (\d+)/i);
    const matchB = b.match(/^PHASE (\d+)/i);
    const numA = matchA ? parseInt(matchA[1]) : 0;
    const numB = matchB ? parseInt(matchB[1]) : 0;
    return numA - numB;
  });

  let orderCount = 1;
  const seenTitles = new Set();

  for (const dir of dirs) {
    const { num: phaseNum, title: headingTitle } = formatHeading(dir);
    console.log(`Processing Heading: ${headingTitle}`);
    
    // Ensure uniqueness for heading
    let finalHeadingTitle = headingTitle;
    let hc = 2;
    while(seenTitles.has(finalHeadingTitle)) {
      finalHeadingTitle = `${headingTitle} ${hc++}`;
    }
    seenTitles.add(finalHeadingTitle);

    const hSlug = finalHeadingTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).slice(-4);
    
    await Resource.create({
      title: finalHeadingTitle,
      description: `System Design Section: ${finalHeadingTitle}`,
      category: 'System Design',
      resourceType: 'Heading',
      slug: hSlug,
      order: orderCount++
    });

    const phasePath = path.join(sdDir, dir);
    // filter and sort files naturally
    const files = fs.readdirSync(phasePath).filter(f => f.endsWith('.md')).sort((a, b) => {
      // Natural sort by number (e.g. 13.1 vs 13.2)
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });

    let subtopicIdx = 1;
    for (const file of files) {
      let subTitle = formatSubtopic(file, subtopicIdx++);
      
      // Ensure uniqueness for subtopic
      let finalSubTitle = subTitle;
      if (seenTitles.has(finalSubTitle)) {
        finalSubTitle = `${subTitle} (Phase ${phaseNum})`;
      }
      let c = 2;
      while(seenTitles.has(finalSubTitle)) {
        finalSubTitle = `${subTitle} (Phase ${phaseNum}) ${c++}`;
      }
      seenTitles.add(finalSubTitle);

      console.log(`  Processing Subtopic: ${finalSubTitle}`);
      
      const mdContent = fs.readFileSync(path.join(phasePath, file), 'utf8');
      const htmlContent = marked.parse(mdContent);

      const sSlug = finalSubTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).slice(-4);

      await Resource.create({
        title: finalSubTitle,
        description: `Notes on ${finalSubTitle}`,
        category: 'System Design',
        resourceType: 'Markdown',
        content: htmlContent,
        slug: sSlug,
        order: orderCount++
      });
    }
  }

  console.log("Successfully seeded System Design Notes!");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
