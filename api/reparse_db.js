import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
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

const filesMap = {
  1: '01_Database_Basics.md',
  2: '02_SQL_Basics.md',
  3: '03_Filtering.md',
  4: '04_Aggregate_Functions.md',
  5: '05_GROUP_BY.md',
  6: '06_Joins.md',
  7: '07_Nested_Queries.md',
  8: '08_Set_Operators.md',
  9: '09_SQL_Functions.md',
  10: '10_DML.md',
  11: '11_DDL.md',
  12: '12_TCL.md',
  13: '13_Views.md',
  14: '14_Indexes.md',
  15: '15_Constraints.md',
  16: '16_Transactions.md',
  17: '17_Normalization.md',
  18: '18_Relational_Algebra_to_SQL.md',
  19: '19_Window_Functions.md',
  20: '20_Interview_Queries.md',
  21: '21_SQL_Execution_Order.md',
};

const run = async () => {
  try {
    const mongoUri = process.env.MONGO || 'mongodb://localhost:27017/blog-mern';
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    const resources = await Resource.find({ category: 'DBMS' }).sort({ order: 1 });

    for (let resource of resources) {
      const fileName = filesMap[resource.order];
      if (!fileName) continue;

      const filePath = `C:\\Users\\ysaty\\.gemini\\antigravity-ide\\brain\\87d2b51c-dbb9-4cf2-8a16-8c704247037b\\scratch\\CSE-Notes\\SQL\\${fileName}`;
      if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        continue;
      }

      const markdown = fs.readFileSync(filePath, 'utf-8');
      const htmlContent = marked.parse(markdown);

      // Extract original title without the numbering if it already has one
      let originalTitle = resource.title.replace(/^\d+\.\s*/, '');
      const newTitle = `${resource.order}. ${originalTitle}`;

      await Resource.findByIdAndUpdate(resource._id, {
        $set: {
          title: newTitle,
          content: htmlContent
        }
      });
      console.log(`Updated: ${newTitle}`);
    }

    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
