const Promise = require('bluebird');
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const Photo = mongoose.model('Photo');
const Visit = mongoose.model('Visit');

const isRecopyNeeded = visit => !visit.isImmediate && visit.configuration.recopy;

const createPhotoTasks = Promise.coroutine(function* (job) {
  const { photoId, visitId } = job.data;


  // -------------------------

  module.exports = (app) => {
    app.delete('/v3/photos/:id', wrap(function* (req, res) {
      yield photoDeleter(req.params.id);
      res.status(204).send();
    }));
  };