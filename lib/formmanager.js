import FormBuilder from '@firstandthird/formbuilder';
import FormModule from './formmodule';
import Bequest from 'bequest';

export default class FormManager {
  constructor(options) {
    this.options = Object.assign({
      extraProps: {},
      fields: []
    }, options);

    if (typeof this.options.extraProps === 'string') {
      throw new Error('`extraProps` should be an object');
    }

    this.options.extraProps['data-module'] = 'FormManager';

    if (!this.options.fields.length) {
      throw new Error('Empty form');
    }

    this.options.fields.forEach(field => {
      if (!field.extraProps) {
        field.extraProps = {};
      }

      if (typeof field.extraProps === 'string') {
        throw new Error('`extraProps` should be an object');
      }

      if (field.type === 'button' && (!field.buttonType || field.buttonType === 'submit')) {
        field.extraProps['data-name'] = 'submit';
        field.extraProps['data-action'] = 'submit';
      } else {
        field.extraProps['data-name'] = 'input';
        field.extraProps['data-action'] = 'change';
        field.extraProps['data-action-type'] = 'input';
      }
    });

    this.formBuilder = new FormBuilder(this.options);
  }

  render(el) {
    this.formEl = el;
    const formContent = this.formBuilder.toHTML();
    this.formEl.innerHTML = formContent;
    FormModule.discover();
    this.form = FormModule.getInstance(this.formEl.childNodes[0]);
    this.form.submitCallback = this.submit;
    this.form.change = this.inputChange;
  }

  loadRemoteData(url, cb) {
    Bequest.request(url, (err, response) => {
      if (err) {
        return this.showError(err);
      }

      cb(response.data);
    });
  }

  populateForm(data) {
    if (typeof data === 'string') {
      return this.loadRemoteData(data, this.populateForm);
    }

    this.form.populate(data);
  }

  // These are meant to be overridden
  showError() {} // params: error
  submit() {} // params: error, response, data
  inputChange() {} // params: element, event, options
}
