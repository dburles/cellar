Routes = {
  main: {
    name: 'main',
    action() {
      BlazeLayout.render('layout', {main: 'main'});
    }
  },
  drinkNow: {
    name: 'drinkNow',
    action() {
      BlazeLayout.render('layout', {main: 'drinkNow'});
    }
  },
  archive: {
    name: 'archive',
    action() {
      BlazeLayout.render('layout', {main: 'archive'});
    }
  },
  add: {
    name: 'add',
    action() {
      BlazeLayout.render('layout', {main: 'add'});
    }
  },
  edit: {
    name: 'edit',
    action() {
      BlazeLayout.render('layout', {main: 'edit'});
    }
  },
  view: {
    name: 'view',
    action() {
      BlazeLayout.render('layout', {main: 'view'});
    }
  }
};

FlowRouter.map(route => {
  route('/', Routes.main);
  route('/drink-now', Routes.drinkNow);
  route('/archive', Routes.archive);
  route('/add', Routes.add);
  route('/edit/:_id', Routes.edit);
  route('/view/:_id', Routes.view);
});

FlowRouter.goBack = function() {
  history.back();
};
