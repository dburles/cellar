Meteor.publish('allWines', function() {
  return Wines.find({ owner: this.userId });
});

Meteor.publish('wines', function() {
  return Wines.find({
    qty: {
      $gt: 0
    },
    owner: this.userId
  });
});

Meteor.publish('archive', function() {
  return Wines.find({
    qty: 0,
    owner: this.userId
  });
});

Meteor.publish('wine', function(_id) {
  check(_id, String);
  return Wines.find({
    _id: _id,
    owner: this.userId
  });
});

Meteor.publish('wineries', function(search) {
  if (! search)
    return this.ready();
  
  return Wineries.search(search);
});

Meteor.publish('regions', function(search) {
  if (! search)
    return this.ready();

  return Regions.search(search);
});

Meteor.publish('varieties', function(search) {
  if (! search)
    return this.ready();
  
  return Varieties.search(search);
});
