Handlebars.registerHelper('currentView', function(view) {
  return View.current() === view;
});