const forms = require('forms');
// create some shortcuts 
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

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

const createProductForm = (categories, tags) => {
    return forms.create({
        'diffuser_name':fields.string({
            label:'Product Name',
            required:true,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            }
        }), 
        'description':fields.string({
            required:true,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary']
            },
            widget:widgets.textarea()
        }),
        'stock':fields.string({
            label:'Stock count',
            required:true,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary']
            }, 
            validators:[validators.integer()]
        }),
        'cost':fields.string({
            label:'Cost (in cents)',
            required:true,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary']
            }, 
            validators:[validators.integer()]
        }), 
        'category_id':fields.string({
            label:'Category',
            required:true,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary']
            }, 
            widget:widgets.select(categories),
            choices: categories
        }), 
        'tags':fields.string({
            label:'Tags',
            required:true,
            errorAfterField:true,
            cssClasses:{
                label:['form-label', 'text-primary']
            }, 
            widget: widgets.multipleSelect(tags),
            choices:tags
        }),
        'image_url':fields.string({
            required:true,
            errorAfterField:true,
            cssClasses:{
                label:['form-label', 'text-primary']
            },
            widget:widgets.hidden()
        })
        
    })
}

const createOilForm = (sizes, tags) => {
    return forms.create({
        'name':fields.string({
            label:'Product Name',
            required:true,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            }
        }),
        'description':fields.string({
            label:'Item Description',
            required:true,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            },
            widget:widgets.textarea()
        }),
        'stock':fields.string({
            label:'Stock',
            required:true,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            },
            validators:[validators.integer()]
        }),
        'cost':fields.string({
            label:'Cost (in cents)',
            required:true,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            },
            validators:[validators.integer()]
        }),
        'sizes':fields.string({
            label:'Bottle Size (in mL)',
            required:true,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            }, 
            widget:widgets.multipleSelect(sizes),
            choices:sizes
        }),
        'tags':fields.string({
            label:'Tags',
            required:true,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            },
            widget:widgets.multipleSelect(tags),
            choices:tags
        }),
        'image_url':fields.string({
            required:true,
            errorAfterField:true,
            cssClasses:{
                label:['form-label', 'text-primary']
            },
            widget:widgets.hidden()
        })
              
    })
}

module.exports = {bootstrapField, createProductForm, createOilForm};