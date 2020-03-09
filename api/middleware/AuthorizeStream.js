// Authorize request stream 
// Add necessary stream data to request
// If necessary can also create new streams on-the-fly here
const AuthorizeStream = (req, res, next) => {
  next();
};

module.exports = AuthorizeStream;
