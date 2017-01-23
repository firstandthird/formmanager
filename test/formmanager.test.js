import FormManager from '../lib/formmanager';

import { test } from 'tape';

const init = () => {
  const container = document.createElement('div');
  container.id = 'formmanager';
  document.body.appendChild(container);
};

init();

// const page = window.phantom.page;

test('implementation', assert => {
  assert.equal(typeof FormManager, 'function', 'FormManager class exists');
  assert.end();
});

test('form creation', assert => {
  const form = new FormManager({
    fields: [
      {
        type: 'text',
        className: 'testinput1'
      }
    ]
  });

  const container = document.getElementById('formmanager');

  form.render(container);
});
