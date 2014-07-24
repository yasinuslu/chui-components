var src = "/ios.css";

if ($.isAndroid) {
  src = "/android.css";
} else if ($.isWin) {
  src = "/win.css";
}

// You can write your css like .isAndroid .foo
// You can also include conditionally like this. If you're using cloudflare serving static file isn't that problem anyway

var html = '<link rel="stylesheet" href="' + src + '">';
$(html).appendTo('head');