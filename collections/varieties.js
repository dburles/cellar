Varieties = new Meteor.Collection('varieties');

Varieties.search = function(searchString) {
  if (_.isEmpty(searchString))
    return;

  var regexp = { $regex: "^" + RegExp.escape(searchString), $options: 'i' };

  return Varieties.find({ name: regexp }, { sort: { name: 1 }, limit: 10 });
};
