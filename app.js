(function() {
  var keypressTarget = document.querySelector('#keypressTarget');
  var keypressDisplay = document.querySelector('#keyDisplay');
  var filterList = document.querySelector('#eventToggle');

  function keyStore () {
    var keyEvents = [];

    function get() {
      return keyEvents;
    };

    function add (type, code, time) {
      keyEvents.push({
        type : type,
        code : code,
        time : time
      });

      return get();
    };

    return {
      add : add,
      get : get
    };
  };

  var store = keyStore();

  function intervalBuilder() {
    var handlers = [];

    function map(char) {
      var matches = handlers.filter(function(handler) {
        return handler.range[0] <= char && handler.range[1] >= char;
      });

      if (matches.length === 0) {
        return '';
      }

      return matches[0].mapper(char);
    };

    function addRange(start, stop, mapper) {
      handlers.push({
        range   : [start, stop],
        mapper  : mapper
      });
    };

    function singleValue(value, char) {
      addRange(value, value, function() {
        return char;
      });
    };

    map.addRange = addRange;
    map.singleValue = singleValue;

    return map;
  };

  var charMap = intervalBuilder();

  charMap.singleValue(8,   'Backspace');
  charMap.singleValue(9,   'Tab');
  charMap.singleValue(13,  'Enter');
  charMap.singleValue(16,  'Shift');
  charMap.singleValue(17,  'Ctrl');
  charMap.singleValue(18,  'Left alt');
  charMap.singleValue(20,  'Caps Lock');
  charMap.singleValue(27,  'Esc');
  charMap.singleValue(32,  'Space');
  charMap.singleValue(33,  'Page Up');
  charMap.singleValue(34,  'Page Down');
  charMap.singleValue(35,  'End');
  charMap.singleValue(36,  'Home');
  charMap.singleValue(37,  'Left arrow');
  charMap.singleValue(38,  'Up arrow');
  charMap.singleValue(39,  'Right arrow');
  charMap.singleValue(40,  'Down arrow');
  charMap.singleValue(45,  'Insert');
  charMap.singleValue(46,  'Delete');
  charMap.singleValue(59,  ';');
  charMap.singleValue(61,  '=');
  charMap.singleValue(91,  'Windows key');
  charMap.singleValue(93,  'Select');
  charMap.singleValue(106, 'Numpad *');
  charMap.singleValue(107, 'Numpad +');
  charMap.singleValue(109, 'Numpad -');
  charMap.singleValue(110, 'Numpad .');
  charMap.singleValue(111, 'Numpad /');
  charMap.singleValue(144, 'Num Lock');
  charMap.singleValue(145, 'Scroll Lock');
  charMap.singleValue(163, '#');
  charMap.singleValue(173, '-');
  charMap.singleValue(188, ',');
  charMap.singleValue(190, '.');
  charMap.singleValue(191, '/');
  charMap.singleValue(192, '`');
  charMap.singleValue(219, '[');
  charMap.singleValue(220, '\\');
  charMap.singleValue(221, ']');
  charMap.singleValue(222, '\'');
  charMap.singleValue(225, 'Right alt');

  charMap.addRange(48, 57, String.fromCharCode); // Number row
  charMap.addRange(65, 90, String.fromCharCode); // Letters
  charMap.addRange(96, 105, function(c) { // Numpad numbers
    return 'Numpad ' + (c - 96);
  });
  charMap.addRange(112, 123, function(c) { // Function keys
    return 'F' + (c - 111);
  });

  function renderKeys (events, element, allowedTypes) {

    var codeText = events.slice()
    .filter(function(e) {
      return allowedTypes.indexOf(e.type) !== -1;
    })
    .sort(function(e1, e2) {
      return e2.time - e1.time;
    })
    .map(function(e) {
      var printable = charMap(e.code);

      return printable
      ? e.type + ':' + e.code + ' (' + printable + ')'
      : e.type + ':' + e.code;
    })
    .reduce(function(text, line) {
      return text + '\n' + line;
    }, '')
    .trim();

    element.textContent = codeText;
  };

  function filterTypes(element) {
    var selected = [];
    element.querySelectorAll('input')
    .forEach(function(el) {
      if (el.checked) {
        var value = el.getAttribute('value');
        if (selected.indexOf(value) === -1) {
          selected.push(value);
        }
      }
    });

    return selected;
  };

  function eventListener(type) {

    var filterCheckbox = document.createElement('input');
    filterCheckbox.setAttribute('type', 'checkbox');
    filterCheckbox.setAttribute('value', type);
    filterCheckbox.checked = true;
    filterCheckbox.addEventListener('change', function() {
      renderKeys(store.get(), keypressDisplay, filterTypes(filterList));
    });

    var filterLabel = document.createElement('label');
    filterLabel.textContent = type;

    filterLabel.appendChild(filterCheckbox);
    filterList.appendChild(filterLabel);

    return function(e) {
      renderKeys(store.add(type, e.keyCode, new Date().getTime()), keypressDisplay, filterTypes(filterList));
      e.preventDefault();
      e.stopPropagation();
    };
  };

  keypressTarget.addEventListener('keydown', eventListener('keydown'));
  keypressTarget.addEventListener('keyup', eventListener('keyup'));
})();
