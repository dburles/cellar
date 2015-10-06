Template.main.helpers({
  wines() {
    if (Session.get('search')) {
      return Wines.search(Session.get('search'));
    }
    return Wines.find({ qty: { $gt: 0 }}, { sort: { ref: -1 }});
  }
});
