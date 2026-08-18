import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Note: Ensure this is run from the api/ folder or dotenv is pointed to the right path
dotenv.config({ path: path.join(process.cwd(), '..', 'api', '.env') });

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

const formatContent = (markdown) => {
  // Convert basic markdown to HTML for ReactQuill
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    .replace(/\n$/gim, '<br />')
    // Handle code blocks simply
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/`(.*?)`/gim, '<code>$1</code>');
  return html;
};

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO || 'mongodb://localhost:27017/blog-mern'; // fallback if needed
    console.log('Connecting to DB...', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    const filesToSeed = [
      { file: '01_Database_Basics.md', title: 'Database Basics', order: 1 },
      { file: '02_SQL_Basics.md', title: 'SQL Basics', order: 2 },
    ];

    for (const item of filesToSeed) {
      const filePath = path.join(process.cwd(), 'CSE-Notes', 'SQL', item.file);
      const markdown = fs.readFileSync(filePath, 'utf-8');
      const htmlContent = formatContent(markdown);

      const resource = new Resource({
        title: item.title,
        description: `Notes on ${item.title}`,
        category: 'DBMS',
        content: htmlContent,
        order: item.order,
        slug: createSlug(item.title)
      });

      await resource.save();
      console.log(`Seeded: ${item.title}`);
    }

    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
