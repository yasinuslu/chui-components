Template.SegmentedArticle.rendered = function() {
  ////////////////////
  // Segmented Control
  ////////////////////
  $(this.find('.segmented')).UIPanelToggle('#toggle-panels', function() {
    $.noop;
  });

  // Define switches
  var sleepSwitch = {
    id: "sleepSwitch",
    state: "on",
    name: "activity.choice",
    value: "sleep"
  };
  var vacationSwitch = {
    id: "vacationSwitch",
    state: "off",
    name: "activity.choice",
    value: "vacation"
  };
  var breakfastSwitch = {
    id: "breakfastSwitch",
    state: "off",
    name: "activity.choice",
    value: "breakfast"
  };

  // Insert switches into list:
  $('#switches aside').each(function(ctx, idx) {
    var temp;
    if (window.jQuery) {
      temp = ctx;
      ctx = idx;
      idx = temp;
    }
    switch (idx) {
      case 0:
        $(ctx).prepend($.UICreateSwitch(sleepSwitch));
        break;
      case 1:
        $(ctx).prepend($.UICreateSwitch(vacationSwitch));
        break;
      case 2:
        $(ctx).prepend($.UICreateSwitch(breakfastSwitch));
        break;
    }
  })
  // Initialize switches:
  $('.switch').UISwitch();


  // Set response to last checked switch for page load state:
  $('.switch').each(function(ctx, idx) {
    if (window.jQuery) ctx = idx;
    if (ctx.classList.contains('on')) {
      $('#switch-response').html($(ctx).find('input').val());
    }
  });

  // Set switch's checkbox value:
  var handleSwitch = function(_switch) {
    var value = '';
    if (_switch.classList.contains('on')) {
      value = $(_switch).find('input').val();
      $('#switch-response').html(value);
    } else {
      $('#switch-response').empty();
    }
  };
  $.body.on('singletap', '.switch', function() {
    handleSwitch(this);
  });


  ////////////////////
  // Setup Range Input
  ////////////////////
  $('#rangeValue1').html($('#rangeControl1').val());
  $('#rangeControl1').on('input', function() {
    $('#rangeValue1').html($(this).val());
  });

  $('#rangeValue2').html($('#rangeControl2').val());
  $('#rangeControl2').on('input', function() {
    $('#rangeValue2').html($(this).val());
  });

  ////////////////
  // Stepper Setup
  ////////////////
  $('#digits').UIStepper({
    start: 1,
    end: 8,
    defaultValue: 3
  });
};

Template.SelectArticle.rendered = function() {
  //////////////
  // Select List
  //////////////
  if (window.jQuery) {
    if ($('.select li').is('.selected')) {
      $("#select-response").html($('.select li.selected')[0].textContent);
    }
  } else {
    if ($('.select li').is('.selected')[0]) {
      $("#select-response").html($('.select li').is('.selected')[0].textContent);
    }
  }

  // Select list callback:
  $('.list.select').UISelectList({
    selected: 0,
    callback: function() {
      $("#select-response").html($(this).text());
    }
  });
};

Template.DeletableArticle.rendered = function() {
  ///////////////////////
  // Setup Deletable list
  ///////////////////////
  $.UIDeletable({
    list: '#deletables',
    callback: function(item) {
      var text = $(item).siblings('h3').text();
      $('#deletable-response').html('You deleted: <strong>' + text + '</strong>');
    }
  });
};

Template.PopupArticle.rendered = function() {
  ///////////////////
  // Initialize Popup
  ///////////////////
  $("#openPopup").bind("singletap", function() {
    $.UIPopup({
      id: "warning",
      title: 'Attention Viewers!',
      message: 'The performance of "Merchant of Venice", Act 4 scene 1, will begin shortly. Thank you for your patience.',
      cancelButton: 'Skip',
      continueButton: 'Stay',
      callback: function() {
        var popupMessageTarget = document.querySelector('#popupMessageTarget');
        popupMessageTarget.textContent = 'Thanks for staying with us a bit longer.';
        popupMessageTarget.className = "";
        popupMessageTarget.className = "animatePopupMessage";
      }
    });
  });
};

Template.PopoverArticle.rendered = function() {
  //////////////////////
  // Setup for Popovers:
  //////////////////////

  // Content for Popovers:
  var popover1Content = "<ul class='list'><li><h3>Apples</h3></li><li><h3>Oranges</h3></li><li><h3>Bananas</h3></li><li><h3>Pears</h3></li><li><h3>Plums</h3></li><li><h3>Cherries</h3></li><li><h3>Apricots</h3></li><li><h3>Lemons</h3></li><li><h3>Peaches</h3></li><li><h3>Pineapples</h3></li><li><h3>Strawberries</h3></li><li><h3>Guavas</h3></li><li><h3>Grapefruit</h3></li></ul>";

  var popover2Content = "<ul class='list'><li><h3>Cake</h3></li><li><h3>Ice cream</h3></li><li><h3>Pies</h3></li><li><h3>Tiramisu</h3></li><li><h3>Cupcakes</h3></li><li><h3>Donuts</h3></li><li><h3>Cookies</h3></li><li><h3>Cobbler</h3></li><li><h3>Crepes</h3></li><li><h3>Tarts</h3></li><li><h3>Custard</h3></li><li><h3>Pudding</h3></li><li><h3>Fudge</h3></li><li><h3>Turnovers</h3></li><li><h3>Eclairs</h3></li></ul>";

  // Callback for Popovers:
  var fillPopover1 = function(popover) {
    // Populate Popover with content:
    $('.popover').find('section').append(popover1Content);
    popoverEventHandler();
  };

  var fillPopover2 = function(popover) {
    // Populate Popover with content:
    $('.popover').find('section').append(popover2Content);
    popoverEventHandler();
  };

  var popoverEventHandler = function() {
    // Attach event to catch user interaction.
    // Use singletap to allow user to scroll content.
    $('.popover').on('singletap', function(e) {
      var results;
      if (this.id === 'fruitsPopover') {
        results = '#fruitsChoice';
      } else if (this.id === 'desertsPopover') {
        results = '#desertsChoice';
      }
      var listItem;
      if (e.target.nodeName === 'LI') {
        $(results).html(e.target.textContent.trim());
      } else {
        listItem = $(e.target).closest('li')[0];
        $(results).html(listItem.textContent.trim());
      }
      $.UIPopoverClose();
    });
  };

  // Initialize Popover:
  $('#showPopover1').UIPopover({
    id: 'fruitsPopover',
    title: "Fruits",
    callback: fillPopover1
  });
  // Initialize Popover:
  $('#showPopover2').UIPopover({
    id: 'desertsPopover',
    title: "Deserts",
    callback: fillPopover2
  });
};

Template.PagingArticle.rendered = function() {
  ///////////////////////////
  // Setup Horizontal Paging:
  ///////////////////////////
  $.UIPaging();
};

Template.SheetArticle.rendered = function() {
  //////////////
  // Setup Sheet
  //////////////
  $.UISheet();
  $('.sheet').find('section').append('<h2>Available Options</h2>');
  $('.sheet').find('section').append("<ul class='list'></li>");
  var list = $('.sheet .list');
  list.append('<li><a class="button" href="javascript:void(null)">Save</a></li>');
  list.append('<li><a class="button" href="javascript:void(null)">Delete</a></li>');
  list.append('<li><a class="button" href="javascript:void(null)">Cancel</a></li>');
  list.on('singletap', '.button', function() {
    $.UIHideSheet();
  });
  // Initialize button to show sheet:
  $('#showSheet').on('singletap', function() {
    $.UIShowSheet();
  });
  $('#sheetBackButton').on($.eventStart, function() {
    $.UIHideSheet();
  });
};