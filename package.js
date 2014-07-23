Package.describe({
  summary: "Latest Chocolate Chip UI with conditional platform css"
});

Package.on_use(function(api, where) {
  api.use([
    'jquery',
    'chui-latest'
  ], 'client');
});