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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products = void 0;
const logger_1 = __importDefault(require("../logger"));
const base_1 = require("./base");
class Products extends base_1.WeedmapsEndpoint {
    constructor() {
        super();
        this.SLUG = "discovery/v1/products";
        this.ALLOWED_QUERY_PARAMS = [];
    }
    afterResponse(response) {
        const { total_products_count: totalItemCount } = response.data.meta;
        if (this.totalItemCount === 0) {
            logger_1.default.info(`Discovered ${totalItemCount} items to proces in total`);
            this.totalItemCount = totalItemCount;
        }
        ;
        logger_1.default.info(`Retrieved ${this.MAX_PAGE_SIZE * this.currentPage} / ${this.totalItemCount}`);
    }
    get(categories = []) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetch({ filters: { 'any_categories': categories } });
        });
    }
}
exports.Products = Products;
//# sourceMappingURL=products.js.map