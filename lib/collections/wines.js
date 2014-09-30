Wines = new Mongo.Collection('wines');

Wines.allow({
  insert: function(userId, doc) {
    return userId && doc.owner === userId;
  },
  update: function(userId, doc) {
    return userId === doc.owner;
  },
  remove: function(userId, doc) {
    return userId === doc.owner;
  },
  fetch: ['owner']
});

Wines.search = function(searchString, query) {
  if (! query)
    query = {};
  if (! _.isEmpty(searchString)) {
    if (searchString[0] === '#') {
      query.ref = parseInt(searchString.substr(1));
    } else {
      var regexp = { $regex: RegExp.escape(searchString), $options: 'i' };
      query.$or = [
        { year: regexp },
        { name: regexp },
        { winery: regexp },
        { type: regexp },
        { region: regexp }
      ];
    }
    return Wines.find(query, { sort: { ref: -1 }});
  }
};
