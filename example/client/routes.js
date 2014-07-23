Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound',
  templateNameConverter: 'upperCamelCase',
  routeControllerNameConverter: 'upperCamelCase'
});

Router.map(function() {
  this.route('first', {
    path: '/'
  });

  this.route('second', {
    path: '/second'
  });

  this.route('third', {
    path: '/third'
  });
});