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
    }, { sort: { ref: -1 }});

    data.ref = last ? (parseInt(last.ref) + 1) : 1;

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
