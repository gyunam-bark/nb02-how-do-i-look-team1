import { createMethodForm } from './method.form.js';

export const routerContainer = async (jsonPath) => {
  const container = document.createElement('div');
  container.className = 'router-container';

  const res = await fetch(jsonPath);
  const route = await res.json();

  const details = document.createElement('details');
  details.open = false;

  const summary = document.createElement('summary');
  summary.textContent = route.name;

  details.appendChild(summary);

  route.endpoints.forEach((endpoint) => {
    const form = createMethodForm(endpoint);
    details.appendChild(form);
  });

  container.appendChild(details);

  return container;
};
