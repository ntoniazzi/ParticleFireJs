
/**
 * @type DOMDocument
 */
var doc;

var buildInput = function (key, config) {
    var input, label, div;
        
    var id = "input-" + key;
    div = doc.createElement('div');

    label = doc.createElement('label');
    label.for = id;
    label.appendChild(doc.createTextNode(config.label));
    div.appendChild(label);

    switch (config.type) {
        case "slider":
            input = doc.createElement('input');
            input.type = "range";
            input.min = config.min | 0.0;
            input.max = config.max | 1.0;
            input.step = config.step;
            input.value = config.get ? config.get() : config.value;
            div.appendChild(input);

            var span = doc.createElement('span');
            div.appendChild(span);
            break;

        case "checkbox":
            input = doc.createElement('input');
            input.type = "checkbox";
            input.checked = config.get ? config.get() : config.value;
            div.appendChild(input);
            break;

        case "color":
            input = doc.createElement('input');
            input.type = "color";
            input.value = config.get ? config.get() : config.value;
            div.appendChild(input);
            break;

        case "select":
            input = doc.createElement("select");
            input.value = config.get ? config.get() : config.value;
            div.appendChild(input);
            break;
    }

    if (config.cssClass) {
        input.classList.add(config.cssClass);
    }

    input.dataset.config = key;
    input.id = id;

    config.input = input;

    return div;
};

var buildForm = function (fieldsets, options, form) {
    doc = form.ownerDocument;
    
    // render fieldsets
    fieldsets.forEach(function (fieldset) {
        var ui = doc.createElement("fieldset");
        form.appendChild(ui);

        if (fieldset.legend) {
            var legend = doc.createElement("legend");
            legend.appendChild(doc.createTextNode(fieldset.legend));
            ui.appendChild(legend);
        }
        
        fieldset.options.forEach(function (name) {
            if (!options[name]) {
                return;
            }
            
            var inputUi = buildInput(name, options[name]);
            ui.appendChild(inputUi);
        });
    });
    
    // render other inputs
    Object.entries(options).forEach(function (item) {
        var [key, config] = item;
        
        if (config.input) {
            return;
        }
        
        var inputUi = buildInput(key, config);
        form.appendChild(inputUi);
    });
    
    // event loop
    form.addEventListener('change', function (event) {
        var input = event.target;
        var key = input.dataset.config;
        var config = options[key];
        if (undefined === config) {
            throw 'Invalid option key ' + key;
        }

        var type = input.type;
        var value;
        
        if (type === 'checkbox') {
            value = input.checked;
        } else if (type === 'select') {
            value = input.options[input.selectedIndex].value;
        } else if (type === 'slider') {
            value = input.value | 0;
        } else {
            value = input.value;
        }
        
        if (config.set) {
            config.set(value);
        } else {
            config.value = value;
        }
    }, false);
};

export { buildForm }
