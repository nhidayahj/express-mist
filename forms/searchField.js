const forms = require('forms');

const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

/*
var bootstrapField = function (name, object){
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const searchFields = (sizes, tags) => {
    return forms.create({
        'name':fields.string({
            label:'Essential Oil',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            }
        }),
        'min_cost':fields.string({
            label:'Product Name',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            },
            validators:[validators.integer()]
        }),
        'max_cost':fields.string({
            label:'Product Name',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            },
            validators:[validators.integer()]
        }), 
        'tags':fields.string({
            label:'Product Name',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            }, 
            widget:widgets.multipleSelect(tags),
            choices:tags
        }),
        'sizes':fields.string({
            label:'Bottle Size',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            }, 
            widget:widgets.multipleSelect(sizes),
            choices:sizes
        })
    })
}
*/

const searchFields = (product) => [
    
]

module.exports = {bootstrapField, searchFields}