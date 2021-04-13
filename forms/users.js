const forms = require('forms');
// create some shortcuts 
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
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

const registerUserForm = (role) => {
    return forms.create({
        'email': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                label: ['form-label', 'text-primary']
            },
            'validators': [validators.email()]
        }),
        'username': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                label: ['form-label', 'text-primary']
            }
        }),
        'role_id': fields.string({
            'label': 'Profile',
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                label: ['form-label', 'text-primary']
            },
            'widget': widgets.select(role),
            'choices': role
        }),
        'workId': fields.string({
            'label': 'Staff Identification No.',
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                label: ['form-label', 'text-primary']
            }
        }),
        'password': fields.password({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                label: ['form-label', 'text-primary']
            }
        }),
        'confirm_password': fields.password({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                label: ['form-label', 'text-primary']
            },
            'validators': [validators.matchField('password')]
        }),
    })
}

const vendorLoginForm = () => {
    return forms.create({
        'email': fields.string({
            'label':'Email',
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                label: ['form-label', 'text-primary']
            },
            'validators': [validators.email()]
        }),
        'password': fields.password({
            'required':true, 
            'errorAfterField':true,
            'cssClasses':{
                 label: ['form-label', 'text-primary']
            }
        }),
    })
}

module.exports = {
    bootstrapField,
    registerUserForm,
    vendorLoginForm
}