Regions = new Mongo.Collection('regions');

Regions.search = function(searchString) {
  if (_.isEmpty(searchString))
    return;

  var regexp = { $regex: "^" + RegExp.escape(searchString), $options: 'i' };

  return Regions.find({ name: regexp }, { sort: { name: 1 }, limit: 10 });
};
