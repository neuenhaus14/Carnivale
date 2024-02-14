import mongoose from 'mongoose';

import { ATLAS_URI } from '../config'

const validateEmail = function(email : string) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

mongoose
  .connect(ATLAS_URI)
  .then(() => console.log('ATLAS database connected!'))
  .catch((err) => console.log(err));

const mailSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [validateEmail, 'Please fill a valid email address'],
  }},
  { timestamps: true }
)

const mailListSubscriber = mongoose.model('sub', mailSubscriberSchema)

export {
  mailListSubscriber
};

