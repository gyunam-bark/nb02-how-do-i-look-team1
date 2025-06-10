const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  let current = obj;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      current[key] = current[key] || {};
      current = current[key];
    }
  });
};

const flattenFields = (obj, prefix = '') => {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenFields(value, path));
    } else {
      result[path] = value;
    }
  }
  return result;
};

const createInput = (name, type, group) => {
  const input = document.createElement('input');
  input.name = name;
  input.placeholder = `${group}: ${name}`;
  input.dataset.type = group;
  input.type =
    {
      number: 'number',
      email: 'email',
      image: 'file',
      string: 'text',
    }[type] || 'text';
  return input;
};

const collectFormData = (inputs) => {
  const params = {},
    query = {},
    body = {},
    formData = new FormData();
  let hasFile = false;

  for (const input of inputs) {
    const value = input.value.trim();
    if (value === '' && input.type !== 'file') {
      continue;
    }

    const name = input.name;
    const group = input.dataset.type;
    const parseValue = () => (input.type === 'number' ? Number(value) : value);

    if (group === 'params') {
      params[name] = value;
    } else if (group === 'query') {
      query[name] = value;
    } else if (group === 'body') {
      if (input.type === 'file' && input.files.length > 0) {
        hasFile = true;
        formData.append(name, input.files[0]);
      } else if (['tags', 'images', 'imageUrls'].includes(name)) {
        const values = value.split(',').map((v) => v.trim());
        hasFile ? values.forEach((v) => formData.append(name, v)) : setNestedValue(body, name, values);
      } else {
        hasFile ? formData.append(name, parseValue()) : setNestedValue(body, name, parseValue());
      }
    }
  }

  return { params, query, body, formData, hasFile };
};

const handleFormSubmit = async (event, endpoint, inputs, responseDiv) => {
  event.preventDefault();

  const { params, query, body, formData, hasFile } = collectFormData(inputs);

  let path = endpoint.path.replace(/:([a-zA-Z]+)/g, (_, key) => params[key] || '');
  const queryString = new URLSearchParams(query).toString();
  if (queryString) path += `?${queryString}`;

  if (endpoint.download) {
    const fullUrl = new URL(path, window.location.origin).toString();
    window.open(fullUrl, '_blank');
    responseDiv.textContent = 'request download complete';
    return;
  }

  const headers = {
    ...(hasFile ? {} : { 'Content-Type': 'application/json' }),
  };

  try {
    const res = await axios({
      method: endpoint.method.toLowerCase(),
      url: path,
      headers,
      data: ['POST', 'PATCH', 'PUT', 'DELETE'].includes(endpoint.method) ? (hasFile ? formData : body) : undefined,
    });

    responseDiv.textContent = JSON.stringify(res.data, null, 2);
  } catch (err) {
    const message = err.response?.data || err.message;
    responseDiv.textContent = `error: ${JSON.stringify(message, null, 2)}`;
  }
};

export const createMethodForm = (endpoint) => {
  const form = document.createElement('form');
  form.className = 'endpoint';
  form.dataset.method = endpoint.method;
  form.dataset.path = endpoint.path;

  const title = document.createElement('strong');
  title.textContent = `${endpoint.method} ${endpoint.path}`;
  title.className = 'title';
  form.appendChild(title);

  const responseDiv = document.createElement('div');
  responseDiv.className = 'response';

  const inputs = [];

  ['params', 'query', 'body'].forEach((group) => {
    const fields = endpoint[group];
    if (!fields) return;

    const flatFields = flattenFields(fields);
    for (const [name, type] of Object.entries(flatFields)) {
      const input = createInput(name, type, group);
      form.appendChild(input);
      inputs.push(input);
    }
  });

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'submit';
  form.appendChild(button);
  form.appendChild(responseDiv);

  form.addEventListener('submit', (event) => handleFormSubmit(event, endpoint, inputs, responseDiv));

  return form;
};
