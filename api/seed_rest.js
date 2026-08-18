import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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

const formatContent = (markdown) => {
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
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/`(.*?)`/gim, '<code>$1</code>');
  return html;
};

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO || 'mongodb://localhost:27017/blog-mern';
    console.log('Connecting to DB...', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    const filesToSeed = [
      { file: '03_Filtering.md', title: 'Filtering', order: 3 },
      { file: '04_Aggregate_Functions.md', title: 'Aggregate Functions', order: 4 },
      { file: '05_GROUP_BY.md', title: 'GROUP BY', order: 5 },
      { file: '06_Joins.md', title: 'Joins', order: 6 },
      { file: '07_Nested_Queries.md', title: 'Nested Queries', order: 7 },
      { file: '08_Set_Operators.md', title: 'Set Operators', order: 8 },
      { file: '09_SQL_Functions.md', title: 'SQL Functions', order: 9 },
      { file: '10_DML.md', title: 'DML', order: 10 },
      { file: '11_DDL.md', title: 'DDL', order: 11 },
      { file: '12_TCL.md', title: 'TCL', order: 12 },
      { file: '13_Views.md', title: 'Views', order: 13 },
      { file: '14_Indexes.md', title: 'Indexes', order: 14 },
      { file: '15_Constraints.md', title: 'Constraints', order: 15 },
      { file: '16_Transactions.md', title: 'Transactions', order: 16 },
      { file: '17_Normalization.md', title: 'Normalization', order: 17 },
      { file: '18_Relational_Algebra_to_SQL.md', title: 'Relational Algebra to SQL', order: 18 },
      { file: '19_Window_Functions.md', title: 'Window Functions', order: 19 },
      { file: '20_Interview_Queries.md', title: 'Interview Queries', order: 20 },
      { file: '21_SQL_Execution_Order.md', title: 'SQL Execution Order', order: 21 },
    ];

    for (const item of filesToSeed) {
      const filePath = `C:\\Users\\ysaty\\.gemini\\antigravity-ide\\brain\\87d2b51c-dbb9-4cf2-8a16-8c704247037b\\scratch\\CSE-Notes\\SQL\\${item.file}`;
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
