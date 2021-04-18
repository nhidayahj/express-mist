const forms = require('forms');

const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const ordersDataLayer = require('../dal/orders');

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


const searchDiffuserFields = (categories, tags) => {
    return forms.create({
        'diffuser_name':fields.string({
            label:'Product Name',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            }
        }),
        'min_cost':fields.string({
            label:'Minimum cost',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            },
            validators:[validators.integer()]
        }),
        'max_cost':fields.string({
            label:'Maximum Cost',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            },
            validators:[validators.integer()]
        }), 
        'category_id':fields.string({
            label:'Category',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            }, 
            widget:widgets.select(categories),
            choices:categories
        }),
        'tags':fields.string({
            label:'Diffuser Tags',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            }, 
            widget:widgets.multipleSelect(tags),
            choices:tags
        })
    })
}

const searchOilFields = (sizes, tags) => {
    return forms.create({
        'name':fields.string({
            label:'Product Name',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            }
        }),
        'min_cost':fields.string({
            label:'Minimum cost',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            },
            validators:[validators.integer()]
        }),
        'max_cost':fields.string({
            label:'Maximum Cost',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            },
            validators:[validators.integer()]
        }), 
        'sizes':fields.string({
            label:'Bottle Size (in mL)',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            }, 
            widget:widgets.select(sizes),
            choices:sizes
        }),
        'tags':fields.string({
            label:'Tags',
            required:false,
            errorAfterField:true, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            }, 
            widget:widgets.multipleSelect(tags),
            choices:tags
        })
    })
}

// const searchFields = (product) => {

// }

const orderSearchFields = () => {
    return forms.create({
        'order_id':fields.string({
            label:'Order ID',
            required:false,
            errorAfterField:false, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            },
            validators:[validators.integer()]
        }),
        'payment_status':fields.string({
            label:'Payment Status',
            required:false,
            errorAfterField:false, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            }
        }),
        'order_status':fields.string({
            label:'Order Status',
            required:false,
            errorAfterField:false, 
            cssClasses: {
                label:['form-label', 'text-primary'],
            }
        })
    })
}

module.exports = {bootstrapField, searchDiffuserFields,searchOilFields,orderSearchFields}