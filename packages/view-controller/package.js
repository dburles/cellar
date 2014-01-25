Package.describe({
  summary: 'Simple view controller'
});

Package.on_use(function(api) {
  api.use('underscore');
  api.add_files('view-controller.js', 'client');
  api.export('View');
});