import Moleculer from 'moleculer';
import { Service, Action, Method } from 'moleculer-decorators';

import { ProductsOpenapi, ProductsValidation } from '../utilities/mixins';
import { MpError } from '../utilities/adapters';
import { Product } from '../utilities/types';

@Service({
  name: 'products',
  mixins: [ProductsValidation, ProductsOpenapi],
})
export default class ProductsService extends Moleculer.Service {
  @Action({
    rest: 'POST /',
    auth: [],
    cache: {},
  })
  create(ctx: Moleculer.Context<Product>): Promise<Product> {
    return this.adapter
      .insert(this.createProductSanitize(ctx.params))
      .then((res: Product) => {
        return this.normalizeId(res);
      })
      .catch((err: Moleculer.GenericObject) => {
        if (err.name === 'MoleculerError') {
          throw new MpError('Products Service', err.message, err.code);
        }
        if (err.name === 'MongoError' && err.code === 11000) {
          throw new MpError('Products Service', 'Duplicate Id!', 422);
        }
        throw new MpError('Products Service', String(err), 500);
      });
  }

  /**
   * Convert object _id to id
   *
   * @param {({_id: string})} obj
   * @returns
   */
  normalizeId(obj: any): Moleculer.GenericObject {
    const newObj = {
      code: obj._id,
      ...obj,
    };
    delete newObj._id;
    return newObj;
  }

  /**
   * Sanitizes Product entry data
   *
   * @param {*} params
   * @returns Product
   */
  createProductSanitize(params: Product): Product {
    const product: Product = {
      name: params.name,
      category: params.category,
      price: params.price,
    };
    return product;
  }
}
