import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  url: String,
  code: String,
});

export default mongoose.model('Song', songSchema);
