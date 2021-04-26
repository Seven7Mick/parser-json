document.addEventListener('DOMContentLoaded', () => {
  // vars
  const innerFile = document.querySelector('#input-file');
  const btnClear = document.querySelector('.parse-form__button_clear');

  const parseInner = document.querySelector('.parse-inner');

  innerFile.addEventListener('change', changeValueProduct);
  // Чтение файла
  function changeValueProduct() {
    const file = this.files[0];
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
      const jsonData = JSON.parse(reader.result);

      parseJson(jsonData);
      checkedLengthForm();
      setMaskToInput();
    }
  }
  // functions
  function parseJson(json) {
    const { name, fields, references, buttons } = json;

    const form = createForm();

    const title = createFormTitile(name);
    form.appendChild(title);

    const inputs = fields.map((field, index) => createField(field, index));
    form.append(...inputs);

    // parse references
    if (references) {
      const ref = createReference(references);
      form.appendChild(ref);
    }

    if (buttons) {
      const btn = buttons.map((buttons) => createButton(buttons));
      form.append(...btn)
    }

    parseInner.appendChild(form);
  }

  // components
  // form
  function createForm() {
    const form = document.createElement('form');
    form.className = 'form';

    return form;
  }

  // title
  function createFormTitile(titleText) {
    const title = document.createElement('h3');

    title.className = 'form__title';
    title.innerText = (`${titleText} form`).toUpperCase();

    return title;
  }

  // fieldset
  function createField(fieldData, index) {
    const { label, input } = fieldData;

    const fieldset = document.createElement('fieldset');
    fieldset.className = 'form__fieldset';

    if (label) {
      const inputLabel = document.createElement('label');

      inputLabel.className = 'form__fieldset-label';
      inputLabel.innerText = label;
      inputLabel.htmlFor = 'input_' + index;

      fieldset.appendChild(inputLabel);
    }

    if (input.technologies) {

      const multiSelect = document.createElement('select');

      multiSelect.className = 'form__fieldset-multiple';
      multiSelect.multiple = input.multiple;
      multiSelect.required = input.required;

      input.technologies.forEach(el => {
        const option = document.createElement('option');

        option.value = el;
        option.innerText = el;

        multiSelect.appendChild(option);
      })

      fieldset.appendChild(multiSelect);

    } else {
      const inputField = document.createElement('input');

      inputField.className = 'form__fieldset-input';
      if (input.colors) {
        inputField.classList.add('form__fieldset-input_color');
        inputField.value = input.colors[Math.floor(Math.random() * input.colors.length)];
      }

      if (input.filetype) {
        const acceptFormat = "." + input.filetype.join(',.');
        inputField.accept = acceptFormat;
      }

      inputField.id = 'input_' + index;

      for (let [key, value] of Object.entries(input)) {
        inputField[key] = value;

        if (input.mask) {
          // меняем тип на text для создания маски через jq mask
          inputField.type = 'text';
          inputField.dataset.mask = input.mask;
        }
      }

      fieldset.appendChild(inputField);
    }

    return fieldset;
  };

  // Create References
  function createReference(references) {
    const refWrapper = document.createElement('fieldset');
    refWrapper.className = 'form__fieldset form__fieldset_type_reference';

    for (let ref of references) {
      if (ref.input) {
        const createInputOfRef = document.createElement('input');

        createInputOfRef.className = 'form__ref-input';
        createInputOfRef.type = ref.input.type;
        createInputOfRef.checked = ref.input.checked;

        refWrapper.appendChild(createInputOfRef);

      } else {
        const textWithoutRef = ref['text without ref'];
        const p = textWithoutRef ? document.createElement('p') : null;

        if (textWithoutRef) {
          const span = document.createElement('span');

          span.className = 'form__reference-span';
          span.innerText = ref['text without ref'] + ' ';

          p.appendChild(span);
        }

        const link = document.createElement('a');

        link.className = 'form__reference-link';
        link.href = ref.ref;
        link.innerText = ref.text;

        if (p) {
          p.appendChild(link);
          refWrapper.appendChild(p);

        } else {
          refWrapper.appendChild(link);
        }
      }

    }
    return refWrapper
  }

  // Create Button
  function createButton(buttons) {
    const createBtn = document.createElement('button');

    createBtn.className = 'button'
    createBtn.innerText = buttons.text;

    return createBtn
  }

  // Mask jquery
  function setMaskToInput() {
    const maskedInputs = $('[data-mask]');

    maskedInputs.each(function () {
      const mask = $(this).data('mask');
      $(this).mask(`${mask}`);
    })
  }

  // Button Clear
  
  btnClear.addEventListener('click', () => {
    while (parseInner.firstChild) {
      parseInner.removeChild(parseInner.firstChild)
    }
    checkedLengthForm();
  })

  // Checked length form
  const checkedLengthForm = () => {
    parseInner.children.length !== 0 
    ? btnClear.style.display = 'block' 
    : btnClear.style.display = 'none'
  }
  
})