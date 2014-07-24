Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound',
  templateNameConverter: 'upperCamelCase',
  routeControllerNameConverter: 'upperCamelCase'
});

Router.map(function() {
  this.route('main', {
    path: '/'
  });

  this.route('segmented-article');
  this.route('select-article');
  this.route('deletable-article');
  this.route('popup-article');
  this.route('popover-article');
  this.route('sheet-article');
  this.route('paging-article');
});