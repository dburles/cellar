Template.home.helpers({
  wines: function() {
    if (Session.get('search'))
      return Wines.search(Session.get('search'));
    else
      return Wines.find({ qty: { $gt: 0 }}, { sort: { ref: -1 }});
  }
});