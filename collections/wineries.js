Wineries = new Mongo.Collection('wineries');

Wineries.search = function(searchString) {
  if (_.isEmpty(searchString))
    return;

  var regexp = { $regex: "^" + RegExp.escape(searchString), $options: 'i' };

  return Wineries.find({ name: regexp }, { sort: { name: 1 }, limit: 10 });
};
