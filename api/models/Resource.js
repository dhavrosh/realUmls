import mongoose from 'mongoose';
import { resources } from '../constants'

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true }
});

const Resource = mongoose.model('Resource', ResourceSchema);

function initializeResources() {
  [
    resources.chat,
    resources.diagram,
  ].forEach(resource => {
    const resourceObj = { title: resource };
    const options = { upsert: true };

    Resource.findOneAndUpdate(resourceObj, resourceObj, options, err => {
      err && console.log(`Resources initialization failed: ${err}`);
    });
  });
}

initializeResources();

export default Resource;