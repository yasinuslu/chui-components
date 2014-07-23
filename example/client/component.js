/*
  We can implement three components like following:
  - CHUI.Nav
  - CHUI.Article
  - CHUI.Toolbar

  And we will have a helper that gets following classes based on animation:
  - previous
  - current
  - next

  This way we won't have to modify yield's before rendering
  we will know which class to use before any one of our components renders

  Limitations:
  - User should always use {{#CHUI.Article}} Article contents {{/CHUI.Article}}
    - we will use <article {{viewStateClass}}></article> tag


  Issues:
  - How can we


  I was gonna leave these here and deal with it later, it seems doable so i'll try now

*/




// var RoutingHelper = Template._RoutingHelper.extend({
//   init: function() {
//     var self = this;
//     var content = self.__content;

//     // var $el = $('<div>');

//     var findComponentOfKind = function(kind, comp) {
//       while (comp) {
//         if (comp.kind === kind)
//           return comp;
//         comp = comp.parent;
//       }
//       return null;
//     };

//     var layout = findComponentOfKind('Layout', self);

//     // self.rendered = function() {
//     //
//     //   var inst = content.render();

//     //   UI.insert(inst, $el[0]);

//     //   debugger
//     // };

//     self.contentBlock = function() {
//       return UI.block(function() {
//         return function() {
//           var regions = layout._regions;
//           regions.get('main');


//           console.log('blockkk');
//           return self.__content;
//         };
//       });
//     };
//   }
// });

// Template.RoutingHelper = RoutingHelper;