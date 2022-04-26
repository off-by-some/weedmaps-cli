import logger from "../logger";
import { WeedmapsEndpoint } from "./base";

export class Products extends WeedmapsEndpoint {
  SLUG = "discovery/v1/products"
  ALLOWED_QUERY_PARAMS = []

  constructor() {
    super();
  }

  afterResponse(response) {
    const { total_products_count: totalItemCount } = response.data.meta;

    if (this.totalItemCount === 0) {
      logger.info(`Discovered ${totalItemCount} items to proces in total`);
      this.totalItemCount = totalItemCount;
    };

    logger.info(`Retrieved ${this.MAX_PAGE_SIZE * this.currentPage} / ${this.totalItemCount}`);
  }

  async get(categories=[]): Promise<any> {
    return this.fetch({ filters: { 'any_categories': categories } });
  }
}