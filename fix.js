import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env') });

const postSchema = new mongoose.Schema({}, { strict: false });
const Post = mongoose.model('Post', postSchema);

async function fix() {
  await mongoose.connect(process.env.MONGO);
  
  // Fix 'dsa' -> 'data-structures-algorithms'
  const res1 = await Post.updateMany({ category: 'dsa' }, { $set: { category: 'data-structures-algorithms' } });
  
  // Fix 'dbms' -> 'database-management-system'
  const res2 = await Post.updateMany({ category: 'dbms' }, { $set: { category: 'database-management-system' } });
  
  console.log('Fixed dsa:', res1.modifiedCount);
  console.log('Fixed dbms:', res2.modifiedCount);
  
  process.exit(0);
}
fix();
