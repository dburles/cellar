Template.nav.helpers({
  totalWines: function() {
    var total = 0;
    Wines.find({
      qty: {
        $gt: 0
      }
    }).forEach(function(wine) {
      var qty = parseInt(wine.qty);
      if (qty !== 'NaN' && qty) {
        total += qty;
      }
    });
    return total;
  },
  totalValue: function() {
    var total = 0;
    Wines.find({
      qty: {
        $gt: 0
      }
    }).forEach(function(wine) {
      var price = parseInt(wine.price) * wine.qty;
      if (price !== 'NaN' && price) {
        total += price;
      }
    });
    return accounting.formatMoney(total);
  },
  canSearch: function() {
    return View.current() === 'home' || View.current() === 'archive';
  }
});

Template.nav.events({
  'click .toggle-search': function(event) {
    event.preventDefault();
    Session.set('toggleSearch', !Session.get('toggleSearch') ? true : false);
  },
  'click .sign-out': function() {
    Meteor.logout();
  }
});
