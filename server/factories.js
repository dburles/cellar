Factories.user = new Factory(Meteor.users, {
  emails: [{
    address: Fake.word().toLowerCase() + '@' + Fake.word().toLowerCase() + '.com',
    verified: false
  }],
  services: {
    password: {
      srp: SRP.generateVerifier('test')
    }
  }
});

Factories.wine = new Factory(Wines, {
  owner: function() { return Factories.user.create(); },
  added: function() { return Date.now(); },
  modified: function() { return Date.now(); },
  ref: function() {
    // XXX should be in after insert hook
    var last = Wines.findOne({
      owner: this.owner
    }, {
      sort: {
        ref: -1
      }
    });

    return last ? parseInt(last.ref) + 1 : 1;
  },
  region: function() {
    var regions = Regions.find().fetch();
    return regions[_.random(0, regions.length - 1)].name;
  },
  name: function() { return Fake.word(); },
  year: function() { return _.random(2000, 2014); },
  type: function() {
    var varieties = Varieties.find().fetch();
    return varieties[_.random(0, varieties.length - 1)].name;
  },
  'drink_by': function() { return _.random(2014, 2030); },
  // purchased: function() { return _.random(2000, 2014); },
  price: function() { return _.random(5, 100); },
  rating: function() { return _.random(1, 10); },
  notes: function() { return Fake.paragraph(5); },
  winery: function() {
    var wineries = Wineries.find().fetch();
    return wineries[_.random(0, wineries.length - 1)].name;
  },
  qty: function() { return _.random(0, 13); }
});

// {
//   "owner" : "bcqhbabvf7qda9G5N",
//   "added" : 1364719565844,
//   "modified" : 1364719565844,
//   "ref" : 76,
//   "region" : "Barossa Valley",
//   "name" : "The Scribbler",
//   "year" : 2007,
//   "type" : "Red",
//   "drink_by" : 2014,
//   "purchased" : "2009-06-00",
//   "price" : 19,
//   "rating" : 0,
//   "notes" : "Purchased from Maxi Foods-FTG",
//   "description" : "Cabernet (63%/Shiraz37%)",
//   "winery" : "Yalumba",
//   "qty" : 1,
//   "_id" : "2A4fCoToRdh9S8QbY"
// }
