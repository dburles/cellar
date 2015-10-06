Template.drinkNow.onCreated(function() {
  this.subscribe('drinkNow');
});

Template.drinkNow.helpers({
  wines() {
    if (Session.get('search')) {
      return Wines.search(Session.get('search'), { qty: { $gt: 0 }, drink_by: { $lte: new Date().getFullYear() }});
    }
    return Wines.find({ qty: { $gt: 0 }, drink_by: { $lte: new Date().getFullYear() }}, { sort: { ref: -1 }});
  }
});
