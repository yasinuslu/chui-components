# CHUI Components

---
Finally there is a Mobile UI Framework that plays nicely with meteor after a few tweaks. This package aims to implement those tweaks. Currently there isn't any known important issues. You're welcome to open issues.

A components collection that seamlessly integrates [ChocolateChip-UI](http://chocolatechip-ui.com/) with meteor.

#### http://chui-components.meteor.com/

It's not all, try with different devices (Android, iOS, Windows) to see the real magic of ChocolateChip-UI.
	
---
## Installation

```
mrt add chui-components
```

Components in this package is designed and tested for Iron Router, if you just want to use chui's routing than you probably won't need this package.

## Getting Started
Easiest way would be going through the source code of [example](https://github.com/yasinuslu/chui-components/tree/master/example)

You can use following components:

###CHUI_Nav:

```html
{{#CHUI_Nav}}
  <a data-back="{{pathFor 'first'}}" class='button back'>First</a>
  <h1>Second Page</h1>
{{/CHUI_Nav}}
```

####`back` class and `data-back` values is important if you want back animation. Currently we still use forward animation on history.back()

###CHUI_Article:

```html
{{#CHUI_Article}}
  <section>
    <ul class='list'>
      <li data-goto="{{pathFor 'third'}}" class="nav"><a>Third</a></li>
    </ul>
  </section>
{{/CHUI_Article}}
```


###CHUI_Toolbar:

```html
{{#CHUI_Toolbar}}
  <a class="button foo"></a>
  <a class="button bar"></a>
{{/CHUI_Toolbar}}
```


You can continue developing your application with Meteor and Iron Router just like always without worrying about chui integration.
