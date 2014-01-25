Wines = new Meteor.Collection('wines');

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

Wines.search = function(search, query) {
  if (! query)
    query = {};
  if (! _.isEmpty(search)) {
    if (search[0] === '#') {
      query.ref = parseInt(search.substr(1));
    } else {
      var regexp = { $regex: RegExp.escape(search), $options: 'i' };
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
