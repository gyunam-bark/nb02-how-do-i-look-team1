import { routerContainer } from './source/router.container.js';

const app = document.getElementById('app');

const main = async () => {
  app.appendChild(await routerContainer('./json/tag-routes.json'));
  app.appendChild(await routerContainer('./json/ranking-routes.json'));
  app.appendChild(await routerContainer('./json/image-routes.json'));
};

main();
