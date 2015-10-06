Template.nav.helpers({
  totalWines: function() {
    return _.reduce(Wines.find({ qty: { $gt: 0 }})
      .map(function(doc) { return doc.qty; }),
        function(memo, num) { return memo + num; }, 0);
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
  }
});

Template.nav.events({
  'click .js-sign-out': function() {
    Meteor.logout();
  }
});
