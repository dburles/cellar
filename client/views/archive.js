Template.archive.onCreated(function() {
  this.subscribe('archive');
});

Template.archive.helpers({
  wines() {
    if (Session.get('search')) {
      return Wines.search(Session.get('search'), { qty: 0 });
    }
    return Wines.find({ qty: 0 }, { sort: { ref: -1 }});
  }
});
