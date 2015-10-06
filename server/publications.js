// Meteor.publish('allWines', function() {
//   return Wines.find({ owner: this.userId });
// });

Meteor.publish('wines', function() {
  if (! this.userId) {
    return this.stop();
  }

  return Wines.find({
    qty: { $gt: 0 },
    owner: this.userId
  }, { sort: { ref: -1 }});
});

Meteor.publish('archive', function() {
  if (! this.userId) {
    return this.stop();
  }

  return Wines.find({
    qty: 0,
    owner: this.userId
  }, { sort: { ref: -1 }});
});

Meteor.publish('drinkNow', function() {
  if (! this.userId) {
    return this.stop();
  }

  return Wines.find({
    qty: { $gt: 0 },
    drink_by: { $lte: new Date().getFullYear() },
    owner: this.userId
  }, {
    sort: { ref: -1 }
  });
});

Meteor.publish('wine', function(_id) {
  check(_id, String);
  if (! this.userId) {
    return this.stop();
  }

  return Wines.find({
    _id: _id,
    owner: this.userId
  });
});

Meteor.publish('wineries', function(search) {
  check(search, String);

  if (! this.userId) {
    return this.stop();
  }

  if (! search) {
    return this.stop();
  }

  return Wineries.search(search);
});

Meteor.publish('regions', function(search) {
  check(search, String);

  if (! this.userId) {
    return this.stop();
  }

  if (! search) {
    return this.stop();
  }

  return Regions.search(search);
});

Meteor.publish('varieties', function(search) {
  check(search, String);

  if (! this.userId) {
    return this.stop();
  }

  if (! search) {
    return this.stop();
  }

  return Varieties.search(search);
});
