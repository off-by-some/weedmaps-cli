import { Products } from "./src/endpoints";
import { save } from "./src/file";
import logger from "./src/logger";

const WEEDMAPS_CATEGORIES = [
  "vape-pens",
  "flower",
  'concentrates',
  'edibles',
  'cbd',
  'gear',
  'cultivation',
  'topicals',
]

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms * 1000));
}

async function fetchProductsForCategory(category) {
  const products  = new Products;
  const addSearch = (items) => items.map(item => ({ ...item, SEARCH_CATEGORY: category }));
  let response    = await products.get([category]);

  await save('./products.json', addSearch(response.body.data.products))

  while (!products.exhausted) {
    response       = await response.nextPage();
    const products = addSearch(response.body.data.products);

    await save('./products.json', products)
    await sleep(2)
  }
}

async function main() {
  for (const category of WEEDMAPS_CATEGORIES) {
    await fetchProductsForCategory(category);
  }
}

main();
