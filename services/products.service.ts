import moleculer from 'moleculer';
import { Service, Action, Event, Method } from 'moleculer-decorators';

import { ProductsDB } from '../mixins';
import { ProductsOpenapi } from '../mixins/openapi';
import { ProductsValidation } from '../mixins/validation';

@Service({
  name: 'products',
  mixins: [ProductsDB, ProductsValidation, ProductsOpenapi],
})
export default class Products extends moleculer.Service {
  /**
   * Actions
   */
  @Action()
  create() {}
}
