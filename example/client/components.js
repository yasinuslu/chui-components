/*
  We can implement three components like following:
  - CHUI_Nav
  - CHUI_Article
  - CHUI_Toolbar

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

  Create tempPage component and

*/

var DEBUG = true;

var debugLog = function( /* same as console.log */ ) {
  if (!DEBUG) return;
  console.log.apply(console, arguments);
};

// global navigation navState
var GOING_BACK = 0,
  GOING_FORWARD = 1,
  NOT_NAVIGATING = 2;

// component's life cycle
var RENDERING = 0,
  RENDERED = 1,
  REMOVING = 2;


// state map for debugging
var navStateMap = ['going-back', 'going-forward', 'not-navigating'];
var renderStateMap = ['rendering', 'rendered', 'removing'];

var navDict = new ReactiveDict;
navDict.set('navState', NOT_NAVIGATING);

var tempView;

var viewStateClass = function(comp) {
  return function() {
    var renderState = comp.dict.get('renderState');
    var navState = navDict.get('navState');

    // TODO: find a better logic for readability
    debugLog(navStateMap[navState], ':', renderStateMap[renderState], comp.kind, comp.guid);
    // if (navState === NOT_NAVIGATING) {
    //   // we're not navigating currently
    //   return 'current';
    // } else if (navState === GOING_FORWARD) {
    //   // we're going forward
    //   if (renderState === RENDERING) {
    //     // this view will be next view
    //     return 'next';
    //   } else {
    //     // we're removing this view it's our previous view
    //     return 'previous';
    //   }
    // } else {
    //   // we're going back
    //   if (renderState === RENDERING) {
    //     // we just rendered this but user thinks it's our old view so it's coming from previous
    //     return 'previous';
    //   } else {
    //     return 'next';
    //   }
    // }

    if(renderState === RENDERED || navState === NOT_NAVIGATING) {
      return 'current';
    } else if(renderState === RENDERING) {
      return navState === GOING_FORWARD ? 'previous' : 'next';
    } else if(renderState === REMOVING) {
      return navState === GOING_BACK ? 'next' : 'previous';
    }

    // I hope i got it right, it will be my nightmare if i didn't !!!!
  }
};

var commonInit = function() {
  var self = this;
  self.dict = new ReactiveDict;

  // this is where we get renderState without reactivity
  var renderState;

  var setRenderState = function(state) {
    debugLog('setting renderState:', renderStateMap[state], self.kind, self.guid);
    renderState = state;
    self.dict.set('renderState', state);
  };

  setRenderState(RENDERING);

  self.rendered = function() {
    setRenderState(RENDERED);
  };

  self._computation = Deps.autorun(function() {
    // don't let UI remove our elements, it should wait a little more
    // seems like it's working but there is something weird going on !!!
    var navState = navDict.get('navState');

    if (navState !== NOT_NAVIGATING && renderState === RENDERED) {
      // we're navigating so this view is doomed !!!
      setRenderState(REMOVING);

      UI.insert(self, tempView.templateInstance.firstNode);
      var $el = $(self.templateInstance.firstNode);
      var $tempPage = $(tempView.templateInstance.firstNode);

      $tempPage.append($el);

      $el
        .on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
          debugLog('animation finished');
        })
        .removeClass('current')
        .addClass(self.viewStateClass());
    }

    Deps.onInvalidate(function() {
      debugLog('invalidate:', self.kind, self.guid);




      // TODO: destroy component after webkit animation finished
    });
  });

  // generate our viewStateClass fn with this comp
  // currently this is the fastest solution i came up to solve common components problem
  // without writing render function myself
  self.viewStateClass = viewStateClass(self);
};

var commonDestroy = function() {
  debugLog('destroyed: ', self.kind, self.guid);

  if (self._computation) {
    self._computation.stop();
  }
}

Template.CHUI_Article = Template.CHUI_Article.extend({
  init: function() {
    var self = this;

    commonInit.call(self);

    this.destroyed = function() {
      commonDestroy.call(self);
    }
  },

  destroy: function() {
    debugLog('destroyed');
  }
});

Template.CHUI_Nav = Template.CHUI_Nav.extend({
  init: function() {
    var self = this;

    commonInit.call(self);

    this.destroyed = function() {
      commonDestroy.call(self);
    }
  },

  destroy: function() {
    debugLog('destroyed');
  }
});

Template.CHUI_Toolbar = Template.CHUI_Toolbar.extend({
  init: function() {
    var self = this;

    // TODO figure out a better way to do this

    commonInit.call(self);

    this.destroyed = function() {
      commonDestroy.call(self);
    }
  },

  destroy: function() {
    debugLog('destroyed');
  }
});

// Override CHUI's functions to let iron router know we're navigating

$._UIGoToArticle = $.UIGoToArticle;
$._UIGoBack = $.UIGoBack;

$.UIGoToArticle = function(destination) {
  navDict.set('navState', GOING_FORWARD);
  Router.go(destination);
}

$.UIGoBack = function(destination) {
  if (destination) {
    navDict.set('navState', GOING_BACK);
    Router.go(destination);
  }
}

// expose for now
// TODO: dont forget to remove this
CHUIComp = {
  navDict: navDict
};

Template.CHUI_Temp.rendered = function() {
  // when we have rendered fn Meteor UI sets firstNode on templateInstance
};

Meteor.startup(function() {
  // render temp view
  CHUIComp.tempView = tempView = UI.render(Template.CHUI_Temp);

  UI.insert(tempView, document.body);

  ////////////////////////////////
  // Handle navigation list items:
  ////////////////////////////////
  $('body').off('singletap doubletap', 'li');

  $('body').on('singletap doubletap', '[data-goto]', function() {
    $.UIGoToArticle($(this).data('goto'));
  });

  $('body').off('singletap', 'a.back');

  $('body').on('singletap', 'a.back', function() {
    var $el = $(this);
    var back = $el.data('back');
    if (back) {
      $.UIGoBack(back);
    }
  });

});



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


//           debugLog('blockkk');
//           return self.__content;
//         };
//       });
//     };
//   }
// });

// Template.RoutingHelper = RoutingHelper;