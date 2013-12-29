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
  if (search) {
    return Wineries.find({
      name: {
        $regex: '^' + search,
        $options: 'i'
      }
    }, {
      limit: 10
    });
  }
});

Meteor.publish('regions', function(search) {
  if (search) {
    return Regions.find({
      name: {
        $regex: '^' + search,
        $options: 'i'
      }
    }, {
      limit: 10
    });
  }
});

Meteor.publish('varieties', function(search) {
  if (search) {
    return Varieties.find({
      name: {
        $regex: '^' + search,
        $options: 'i'
      }
    }, {
      limit: 10
    });
  }
});
