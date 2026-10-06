import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Post from './api/src/models/post.model.js';

async function update() {
  await mongoose.connect(process.env.MONGO);
  
  const post = await Post.findOne({ slug: { '$regex': /^why-normalization/ } });
  if (!post) {
    console.log('Post not found');
    process.exit(1);
  }

  let newContent = post.content;
  if (!newContent.includes('RESOURCE_EMBED')) {
    post.attachedResources.forEach(id => {
      newContent += `<p>[RESOURCE_EMBED:${id.toString()}]</p>`;
    });
    post.content = newContent;
    await post.save();
    console.log('Updated post content');
  } else {
    console.log('Already updated');
  }
  mongoose.disconnect();
}
update();
