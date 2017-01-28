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

  function renderKeys (events, element, allowedTypes) {
    var codeText = events.slice()
    .filter(function(e) {
      return allowedTypes.indexOf(e.type) !== -1;
    })
    .sort(function(e1, e2) {
      return e2.time - e1.time;
    })
    .map(function(e) {
      var printable = String.fromCharCode(e.code);
      return e.type + ':' + e.code + ' (' + printable + ')'
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
