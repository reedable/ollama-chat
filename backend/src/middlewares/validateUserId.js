import { User } from '../models/Schema.js';

export default async function (req, res, next) {
  let { username } = req.body;

  if (!username) {
    //FIXME return res.status(401).end();
    username = 'demo';
  }

  //TODO Validate userId
  let user = await User.findOne({ username });

  if (!user) {
    // FIXME For now, automatically create a user record
    user = new User({ username, conversations: [] });
  }

  await user.save();

  req.user = user;

  next();
}
