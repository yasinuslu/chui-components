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
var ADDING = 0,
  REMOVING = 1;


// state map for debugging
var navStateMap = ['going-back', 'going-forward', 'not-navigating'];
var animStateMap = ['adding', 'removing'];

var navDict = new ReactiveDict;
navDict.set('navState', NOT_NAVIGATING);

var tempView;

var viewStateClass = function(comp) {
  return function() {
    var animState = comp.dict.get('animState');
    var isRendered = comp.dict.get('isRendered');
    var navState = navDict.get('navState');

    debugLog(navStateMap[navState], ':', animStateMap[animState], comp.kind, comp.guid);
    if (animState === REMOVING) {
      return navState === GOING_BACK ? 'next' : 'previous';
    } else if (isRendered && navState !== NOT_NAVIGATING || navState === NOT_NAVIGATING) {
      return 'current';
    } else {
      return navState === GOING_FORWARD ? 'next' : 'previous';
    }

    // I hope i got it right, it will be my nightmare if i didn't !!!!
  }
};

var commonInit = function() {
  var self = this;
  self.dict = new ReactiveDict;

  // this is where we get animState without reactivity
  var animState;
  var isRendered = false;
  self.dict.set('isRendered', isRendered);

  self.setAnimState = function(state) {
    if (animState === state) {
      return;
    }
    debugLog('setting animState:', animStateMap[state], self.kind, self.guid);
    animState = state;
    self.dict.set('animState', state);
  };

  self.setAnimState(ADDING);

  self.rendered = function() {
    isRendered = true;
    Meteor.defer(function() {
      self.dict.set('isRendered', isRendered);
    });
  };

  self._computation = Deps.autorun(function() {
    // don't let UI remove our elements, it should wait a little more
    // seems like it's working but there is something weird going on !!!
    var navState = navDict.get('navState');

    if (navState !== NOT_NAVIGATING && isRendered) {
      // we're navigating so this view is doomed !!!
      self.setAnimState(REMOVING);

      // UI.insert(self, tempView.templateInstance.firstNode);

      var $el = $(self.templateInstance.firstNode);
      var $tempPage = $(tempView.templateInstance.firstNode);

      $tempPage.append($el);

      setTimeout(function() {
        navDict.set('navState', NOT_NAVIGATING);
        self.destroy();

        $tempPage.empty();

        self = null;
      }, 300);

      $el
        .on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
          debugLog('animation finished');
          navDict.set('navState', NOT_NAVIGATING);
        })
        .removeClass('current')
        .addClass(self.viewStateClass());
    }
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