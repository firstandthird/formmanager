import Domodule from 'domodule';
import FormObj from 'formobj';
import Bequest from 'bequest';

export default class FormModule extends Domodule {
  constructor(el) {
    super(el);

    this.obj = new FormObj(el);
  }

  get url() {
    return this.el.getAttribute('action');
  }

  get method() {
    return this.el.getAttribute('method');
  }

  populate(data) {
    this.obj.deserialize(data);
  }

  submit() {
    const data = this.obj.getJSON();

    Bequest.request(this.url, this.method, data, this.submitCallback);
  }

  submitCallback() { }
}

Domodule.register(FormModule);