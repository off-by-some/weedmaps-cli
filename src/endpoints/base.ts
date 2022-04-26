import logger from '../logger';
import axios from "axios";

export class WeedmapsEndpoint {
  HOST                      = "https://api-g.weedmaps.com/"
  MAX_PAGE_SIZE             = 150
  SLUG                      = ""
  BASE_ALLOWED_QUERY_PARAMS = ["page"]
  ALLOWED_QUERY_PARAMS = []

  currentPage:       number;
  totalItemCount:    number;

  constructor() {
    this.currentPage   = 1;
    this.totalItemCount = 0;
  }

  get _pageSize() {
    if (this.totalItemCount === 0) return this.MAX_PAGE_SIZE;

    const amount_consumed = this.MAX_PAGE_SIZE * this.currentPage;
    const amount_left = this.totalItemCount - amount_consumed

    if (amount_left >= this.MAX_PAGE_SIZE) return this.MAX_PAGE_SIZE;
    if (amount_left <= 0)                  return 0

    return amount_left
  }

  get exhausted() {
    return this._pageSize == 0;
  }

  afterResponse(response) {
    throw new Error("Not Implemented");
  }

  async get<T>(params = {}): Promise<T> {
    throw new Error("Not Implemented");
  }

  constructURI(params) {
    const paramsAsString = this.constructQuery(params)
    const uri = `${this.HOST}${this.SLUG}?${paramsAsString}`;
    logger.info(decodeURIComponent(uri));

    return uri
  }

  constructQuery(paramObj): string {
    const params       = { ...paramObj }
    const pageNumber   = params.page ?? this.currentPage;
    const filterParams = this.constructFilterQuery(params.filters)

    delete params.filters;

    const query = new URLSearchParams({
      ...params,
      page: pageNumber.toString(),
      page_size: this._pageSize
    });

    return [ query.toString(), filterParams ].join("&");
  }

  constructFilterQuery(filters={}) {
    return Object
      .entries(filters)
      .map(([type, value]) => encodeURIComponent(`filter[${type}][]=${value}`))
      .join("&")
  }

  incrementPage() {
    this.currentPage = Number(this.currentPage) + 1;
  }

  decrementPage() {
    const nextPageNumber = Number(this.currentPage) - 1;
    if (nextPageNumber <= 0) return;

    this.currentPage = nextPageNumber;
  }


  formatPayload(response, requestParams, lastPageSize) {
    const { data }   = response;
    const nextParams = { ...requestParams, page_size: this._pageSize };
    const prevParams = { ...requestParams, page_size: lastPageSize };

    const nextPage   = async () => {
      this.incrementPage();
      if (this.exhausted) return null;
      return this.fetch(nextParams);
    }

    const previousPage   = async () => {
      this.decrementPage();
      if (this.exhausted) return null;
      return this.fetch(prevParams);
    }

    return { body: data, nextPage, previousPage }
  }

  handleError(err, uri) {
    const errorResponse = err?.response?.data;
    const errorObj      = errorResponse?.errors != null? errorResponse?.errors[0] : errorResponse;
    const msg           = `Fetch for '${decodeURIComponent(uri)}' failed. Recieved status code:'${err.code}'.`

    logger.error(msg);
    if (errorObj) logger.error({error: errorObj});

    throw new Error()
  }

  async fetch(params={}) {
    const uri             = this.constructURI(params);
    const currentPageSize = this._pageSize;
    let res               = null;

    try {
      res = await axios.get(uri)
      this.afterResponse(res);
    } catch (error) {
      this.handleError(error, uri);
    }

    return this.formatPayload(res, params, currentPageSize);
  }
}
