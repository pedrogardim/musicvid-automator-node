import Song from '../models/SongModel.js';

export const addSong = async (req, res) => {
  const response = Song.create({ title: 'Test' });
  res.send(response);
};

export const getSong = async (req, res) => {
  res.send('Hello World!');
};

export const searchSong = async (req, res) => {
  res.send('Hello World!');
};
