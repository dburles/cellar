Package.describe({
  summary: "Packery"
});

Package.on_use(function (api, where) {
  api.add_files('packery.pkgd.js', 'client');
  api.export('Packery');
});