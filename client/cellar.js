Deps.autorun(function() {
  Meteor.subscribe('wineries', Session.get('winery'));
  Meteor.subscribe('regions', Session.get('region'));
  Meteor.subscribe('varieties', Session.get('variety'));
});

Meteor.startup(function() {
  Meteor.subscribe('wines');
});

View = {
  set: function(template) {
    Session.set('previousView', Session.get('view'));
    Session.set('view', template);
  },
  current: function() {
    return Session.get('view');
  },
  previous: function() {
    return Session.get('previousView');
  }
};

View.set('home');

Template.application.helpers({
  view: function() {
    return Session.get('view') && Template[Session.get('view')]();
  },
  modal: function() {
    return Session.get('promptModal');
  }
});



Template.application.events({
  'click a': function(event, template) {
    var href = event.currentTarget.attributes.href;
    if (href && Template[href.value]) {
      event.preventDefault();
      View.set(href.value);
    }
  }
});

Template.item.events({
  'click a': function(event, template) {
    event.preventDefault();
    Session.set('_id', this._id);
    View.set('edit');
  }
});

Template.edit.helpers({
  wine: function() {
    return Wines.findOne(Session.get('_id'));
  }
});

Deps.autorun(function() {
  var currentView = View.current();
  
  if (! Meteor.user() && ! Meteor.loggingIn())
    View.set('signIn');
  else if (Meteor.user() && currentView === 'signIn')
    View.set('home');

  if (currentView === 'archive')
    Meteor.subscribe('archive');
  if (currentView === 'edit')
    Meteor.subscribe('wine', Session.get('_id'));
});

Template.nav.helpers({
  totalValue: function() {
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
  totalWines: function() {
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

Template.search.events({
  'keyup #search': function() {
    Session.set('search', $('#search').val());
  },
  'click .clear': function() {
    Session.set('search', '');
  }
});

Template.search.helpers({
  search: function() {
    return Session.get('search');
  },
  hasSearch: function() {
    return !!Session.get('search');
  }
});

var winesCursor = function(query) {
  var search = Session.get('search');
  if (search) {
    if (search[0] === '#') {
      query.ref = parseInt(search.substr(1));
    } else {
      var regexp = { $regex: search, $options: 'i' };
      query.$or = [
        { year: regexp },
        { name: regexp },
        { winery: regexp },
        { type: regexp },
        { region: regexp }
      ];
    }
  }
  return Wines.find(query, { sort: { ref: -1 }});
};

Template.home.helpers({
  wines: function() {
    return winesCursor({ qty: { $gt: 0 }});
  }
});

Template.archive.helpers({
  wines: function() {
    return winesCursor({ qty: 0 });
  }
});

Template.form.helpers({
  selectOptionsQty: function() {
    return {
      name: 'qty',
      value: this.qty,
      options: _.map(_.range(25), function(qty) {
        return {
          name: qty,
          value: qty
        };
      })
    };
  },
  selectOptionsRating: function() {
    return {
      name: 'rating',
      value: this.rating,
      options: [
        {
          name: 'None',
          value: 'None'
        }
      ].concat(_.map(_.range(1, 11).reverse(), function(rating) {
        return {
          name: rating,
          value: rating
        };
      }))
    };
  },
  varieties: function() {
    return Varieties.find({ }, { sort: name });
  },
  wineries: function() {
    return Wineries.find({}, { sort: name });
  },
  regions: function() {
    return Regions.find({}, { sort: name });
  }
});

Template.select.helpers({
  decoratedOptions: function() {
    var self = this;
    return _.map(self.options, function(option) {
      option.selected = option.value === parseInt(self.value);
      return option;
    });
  }
});

Template.form.events({
  'keyup input[name="type"]': function(event, template) {
    if (event.target.value.length > 1) {
      return Session.set('variety', e.target.value);
    } else {
      return Session.set('variety', '');
    }
  },
  'keyup input[name="winery"]': function(event, template) {
    if (event.target.value.length > 1) {
      return Session.set('winery', e.target.value);
    } else {
      return Session.set('winery', '');
    }
  },
  'keyup input[name="region"]': function(event, template) {
    if (event.target.value.length > 1) {
      return Session.set('region', e.target.value);
    } else {
      return Session.set('region', '');
    }
  },
  'click .autocomplete-type a': function(event) {
    Session.set('variety', '');
    $('input[name="type"]').val(event.target.text);
  },
  'click .autocomplete-winery a': function(event) {
    Session.set('winery', '');
    $('input[name="winery"]').val(event.target.text);
  },
  'click .autocomplete-region a': function(event) {
    Session.set('region', '');
    $('input[name="region"]').val(event.target.text);
  },
  'click #save': function(event, template) {
    event.preventDefault();
    var data = $('#form').toObject();
    if (!data.year) {
      alert("Year is required");
      return;
    }
    if (this._id) {
      Meteor.call('update', this._id, data);
    } else {
      Meteor.call('create', data);
    }
    View.set('home');
  },
  'click #delete': function(event, template) {
    event.preventDefault();
    Session.set('promptModal', true);
    // if (confirm("Are you sure?")) {
    //   Meteor.call('remove', this._id);
    //   View.set(View.previous());
    // }
  },
  'click #cancel': function(event, template) {
    event.preventDefault();
    View.set(View.previous());
  }
});

Template.promptModal.events({
  'click .delete': function(event) {
    event.preventDefault();
    Wines.remove(Session.get('_id'));
    Session.set('promptModal', false);
    View.set(View.previous());
  },
  'click .cancel': function(event) {
    event.preventDefault();
    Session.set('promptModal', false);
  }
});

Template.form.rendered = function() {
  return window.scrollTo();
};

// Deps.autorun(function() {
//   if () {
//     // hack
//     Meteor.setTimeout(function() {
//       $('.row').packery();
//       Session.set('templateReady', false);
//     }, 0);
//   }
// });

// Template.list.rendered = function() {
//   // hack
//   Meteor.setTimeout(function() {
//     $('.row').packery();
//   }, 0);
// };