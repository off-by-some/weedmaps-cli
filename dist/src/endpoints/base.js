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
exports.WeedmapsEndpoint = void 0;
const logger_1 = __importDefault(require("../logger"));
const axios_1 = __importDefault(require("axios"));
class WeedmapsEndpoint {
    constructor() {
        this.HOST = "https://api-g.weedmaps.com/";
        this.MAX_PAGE_SIZE = 150;
        this.SLUG = "";
        this.BASE_ALLOWED_QUERY_PARAMS = ["page"];
        this.ALLOWED_QUERY_PARAMS = [];
        this.currentPage = 1;
        this.totalItemCount = 0;
    }
    get _pageSize() {
        if (this.totalItemCount === 0)
            return this.MAX_PAGE_SIZE;
        const amount_consumed = this.MAX_PAGE_SIZE * this.currentPage;
        const amount_left = this.totalItemCount - amount_consumed;
        if (amount_left >= this.MAX_PAGE_SIZE)
            return this.MAX_PAGE_SIZE;
        if (amount_left <= 0)
            return 0;
        return amount_left;
    }
    get exhausted() {
        return this._pageSize == 0;
    }
    afterResponse(response) {
        throw new Error("Not Implemented");
    }
    get(params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not Implemented");
        });
    }
    constructURI(params) {
        const paramsAsString = this.constructQuery(params);
        const uri = `${this.HOST}${this.SLUG}?${paramsAsString}`;
        logger_1.default.info(decodeURIComponent(uri));
        return uri;
    }
    constructQuery(paramObj) {
        var _a;
        const params = Object.assign({}, paramObj);
        const pageNumber = (_a = params.page) !== null && _a !== void 0 ? _a : this.currentPage;
        const filterParams = this.constructFilterQuery(params.filters);
        delete params.filters;
        const query = new URLSearchParams(Object.assign(Object.assign({}, params), { page: pageNumber.toString(), page_size: this._pageSize }));
        return [query.toString(), filterParams].join("&");
    }
    constructFilterQuery(filters = {}) {
        return Object
            .entries(filters)
            .map(([type, value]) => encodeURIComponent(`filter[${type}][]=${value}`))
            .join("&");
    }
    incrementPage() {
        this.currentPage = Number(this.currentPage) + 1;
    }
    decrementPage() {
        const nextPageNumber = Number(this.currentPage) - 1;
        if (nextPageNumber <= 0)
            return;
        this.currentPage = nextPageNumber;
    }
    formatPayload(response, requestParams, lastPageSize) {
        const { data } = response;
        const nextParams = Object.assign(Object.assign({}, requestParams), { page_size: this._pageSize });
        const prevParams = Object.assign(Object.assign({}, requestParams), { page_size: lastPageSize });
        const nextPage = () => __awaiter(this, void 0, void 0, function* () {
            this.incrementPage();
            if (this.exhausted)
                return null;
            return this.fetch(nextParams);
        });
        const previousPage = () => __awaiter(this, void 0, void 0, function* () {
            this.decrementPage();
            if (this.exhausted)
                return null;
            return this.fetch(prevParams);
        });
        return { body: data, nextPage, previousPage };
    }
    handleError(err, uri) {
        var _a;
        const errorResponse = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data;
        const errorObj = (errorResponse === null || errorResponse === void 0 ? void 0 : errorResponse.errors) != null ? errorResponse === null || errorResponse === void 0 ? void 0 : errorResponse.errors[0] : errorResponse;
        const msg = `Fetch for '${decodeURIComponent(uri)}' failed. Recieved status code:'${err.code}'.`;
        logger_1.default.error(msg);
        if (errorObj)
            logger_1.default.error({ error: errorObj });
        throw new Error();
    }
    fetch(params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = this.constructURI(params);
            const currentPageSize = this._pageSize;
            let res = null;
            try {
                res = yield axios_1.default.get(uri);
                this.afterResponse(res);
            }
            catch (error) {
                this.handleError(error, uri);
            }
            return this.formatPayload(res, params, currentPageSize);
        });
    }
}
exports.WeedmapsEndpoint = WeedmapsEndpoint;
//# sourceMappingURL=base.js.map