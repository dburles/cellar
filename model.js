Wines = new Meteor.Collection('wines');
Wineries = new Meteor.Collection('wineries');
Regions = new Meteor.Collection('regions');
Varieties = new Meteor.Collection('varieties');

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

Meteor.methods({
  'create': function(data) {
    data.added = (new Date()).getTime();
    data.modified = (new Date()).getTime();
    data.owner = this.userId;
    data.qty = parseInt(data.qty, 10);
    data.year = parseInt(data.year, 10);
    data.rating = parseInt(data.rating, 10);
    var last = Wines.findOne({
      owner: this.userId
    }, {
      sort: {
        ref: -1
      }
    });
    if (last) {
      data.ref = parseInt(last.ref) + 1;
    } else {
      data.ref = 1;
    }
    return Wines.insert(data);
  },
  'update': function(wineId, data) {
    data.modified = (new Date()).getTime();
    data.qty = parseInt(data.qty, 10);
    data.year = parseInt(data.year, 10);
    data.rating = parseInt(data.rating, 10);
    return Wines.update(wineId, { $set: data });
  },
  'remove': function(wineId) {
    return Wines.remove(wineId);
  }
});
