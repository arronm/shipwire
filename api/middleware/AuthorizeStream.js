const AuthorizeStream = (req, res, next) => {
  // has valid stream
  try {
    const stream = await db('stream').get(req.body.stream);
    if (!stream) return res.status(500).json({
      message: 'Invalid stream',
    });

    next();
  } catch (error) {
    const err = await log.err(error);
    res.status(500).json(err);
  }
};

module.exports = AuthorizeStream;
