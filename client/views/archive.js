Template.archive.helpers({
  wines: function() {
    if (Session.get('search'))
      return Wines.search(Session.get('search'), { qty: 0 });
    else
      return Wines.find({ qty: 0 }, { sort: { ref: -1 }});
  }
});