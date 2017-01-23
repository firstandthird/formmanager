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

    this.formBuilder = new FormBuilder({
      fields: this.options.fields
    });
  }

  render(el) {
    this.formEl = el;
    const formContent = this.formBuilder.toHTML();
    this.formEl.innerHTML = formContent;
    FormModule.discover();
    this.form = FormModule.getInstance(el);
    this.form.submitCallback = this.submit;
    this.form.change = this.inputChange;
  }

  showError(error) {
    // @TODO: Show error on page
    console.error(error); // eslint-disable-line no-console
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

  submit(err, response, postData) {
    // @TODO: show success/error message
    console.log(err, response, postData); // eslint-disable-line no-console
  }

  inputChange(el, evt, options) {
    console.log(el, evt, options); // eslint-disable-line no-console
  }
}
