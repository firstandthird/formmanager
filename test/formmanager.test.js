import FormManager from '../lib/formmanager';

import test from 'tape-rollup';
import simulant from 'simulant';

const init = () => {
  const container = document.createElement('div');
  container.id = 'formmanager';
  document.body.appendChild(container);
};

init();

test('implementation', t => {
  t.plan(1);
  t.equal(typeof FormManager, 'function', 'FormManager class exists');
});

test('form creation', t => {
  t.plan(1);

  const form = new FormManager({
    fields: [
      {
        type: 'text',
        className: 'testinput1',
        id: 'testinput'
      }
    ]
  });

  const container = document.getElementById('formmanager');

  form.render(container);

  t.ok(container.querySelectorAll('[data-module]').length > 0, 'Form created');
});

test('populate form', t => {
  t.plan(1);

  const form = new FormManager({
    fields: [
      {
        type: 'text',
        className: 'testinput1',
        id: 'testinput'
      }
    ]
  });

  const container = document.getElementById('formmanager');

  form.render(container);
  form.populateForm({
    testinput: '1234'
  });

  t.equal(container.querySelector('.testinput1').value, '1234', 'Form populated');
});

test('input change event', t => {
  t.plan(1);
  t.timeoutAfter(1000);

  class InputTest extends FormManager {
    inputChange(...args) {
      t.pass('Input event called');
    }
  }

  const form = new InputTest({
    fields: [
      {
        type: 'text',
        className: 'testinput1',
        id: 'testinput'
      }
    ]
  });

  const container = document.getElementById('formmanager');

  form.render(container);

  simulant.fire(container.querySelector('.testinput1'), 'input');
});

test('submit form', t => {
  t.plan(1);
  t.timeoutAfter(1000);

  class SubmitTest extends FormManager {
    submit() {
      t.pass('Submit event called');
    }
  }

  const form = new SubmitTest({
    action: '/doesntexist',
    fields: [
      {
        type: 'text',
        className: 'testinput1',
        id: 'testinput'
      },
      {
        type: 'button',
        className: 'submitinput'
      }
    ]
  });

  const container = document.getElementById('formmanager');

  form.render(container);

  simulant.fire(container.querySelector('.submitinput'), 'click');
});
