$._UIGoToArticle = $.UIGoToArticle;

var $tempPage;
var $nextPage;

var movePage = function() {
  if (!$tempPage) {
    $tempPage = $('<div>').attr('id', 'temp-page').appendTo('body');
  }

  if (!$nextPage) {
    $nextPage = $('#next-page');
  }

  $tempPage.empty().append($('.current'));
  $nextPage.removeClass('visible');
}

$.UIGo = function() {
  var goingForward = $.navigationDirection === 'back' ? false : true;

  var current = $('article.current');
  var currentNav = current.prev();

  var destination = $('#next-page').find('article');
  var destinationNav = $('#next-page').find('nav');

  var currentToolbar;
  var destinationToolbar;

  var classForRemovedPage = goingForward ? 'previous' : 'next';
  var classForAddedPage = goingForward ? 'next' : 'previous';
  var navigationClass = 'next previous';

  // navigation pub/sub removed for now

  // $.publish('chui/navigate/leave', current[0].id);
  // $.UINavigationHistory.push(destinationID);
  // $.publish('chui/navigate/enter', destination[0].id);

  current.css({
    scrollTop: 0
  });

  destination.css({
    scrollTop: 0
  });

  $nextPage.children().addClass(classForAddedPage);

  $nextPage.addClass('visible');

  currentToolbar = current.next().hazClass('toolbar');
  destinationToolbar = destination.next().hazClass('toolbar');
  current.removeClass('current').addClass(classForRemovedPage);
  currentNav.removeClass('current').addClass(classForRemovedPage);
  currentToolbar.removeClass('current').addClass(classForRemovedPage);

  destination.removeClass(navigationClass).addClass('current');
  destinationNav.removeClass(navigationClass).addClass('current');
  destinationToolbar.removeClass(navigationClass).addClass('current');

  // destination.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
  //   console.log('animation ended, removing');
  //   $('.next, .previous').remove();
  // });

  $.navigationDirection = null;
};

Router.onBeforeAction(function() {
  movePage();
});

Router.onAfterAction(function() {
  Meteor.defer(function() {
    // Template still remains unrendered at the moment (sometimes rendered, sometimes not)
    Meteor.defer(function() {
      /*
        We need to run $.UIGo function after template renders to dom
        Currently this seems very unreliable and ugly but
        it is the quickest solution that seems deterministic enough to do our job
      */
      $.UIGo();
    });
  });
});

$._UIGoBack = $.UIGoBack;

$.UIGoToArticle = function(destination) {
  $.navigationDirection = 'forward';

  Router.go(destination);
}

$.UIGoBack = function(destination) {
  $.navigationDirection = 'back';

  if (destination) {
    Router.go(destination);
  }
}


Meteor.startup(function() {
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