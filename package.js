Package.describe({
  summary: "Seamless ChocolateChip-UI integration for meteor"
});

Package.on_use(function(api, where) {
  api.use([
    'templating',
    'ui',
    'jquery',
    'chui-latest',
    'reactive-dict'
  ], 'client');

  api.add_files('lib/components.html', 'client');
  api.add_files('lib/components.js', 'client');
});