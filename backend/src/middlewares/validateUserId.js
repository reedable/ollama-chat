export default async function (req, res, next) {
  const { userId } = req.body;

  if (!userId) {
    //FIXME return res.status(401).end();
    req.user = { userId: 'demo' };
  }

  //TODO Validate userId

  next();
}
