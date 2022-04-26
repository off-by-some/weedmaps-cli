"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints_1 = require("./src/endpoints");
const file_1 = require("./src/file");
const WEEDMAPS_CATEGORIES = [
    "vape-pens",
    "flower",
    'concentrates',
    'edibles',
    'cbd',
    'gear',
    'cultivation',
    'topicals',
];
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
}
function fetchProductsForCategory(category) {
    return __awaiter(this, void 0, void 0, function* () {
        const products = new endpoints_1.Products;
        const addSearch = (items) => items.map(item => (Object.assign(Object.assign({}, item), { SEARCH_CATEGORY: category })));
        let response = yield products.get([category]);
        yield (0, file_1.save)('./products.json', addSearch(response.body.data.products));
        while (!products.exhausted) {
            response = yield response.nextPage();
            const products = addSearch(response.body.data.products);
            yield (0, file_1.save)('./products.json', products);
            yield sleep(2);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const category of WEEDMAPS_CATEGORIES) {
            yield fetchProductsForCategory(category);
        }
    });
}
main();
//# sourceMappingURL=index.js.map