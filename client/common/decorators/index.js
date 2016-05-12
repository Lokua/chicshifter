/*!
 *  class decorator signature
 *  -------------------------
 *  function decorator(target) {
 *    target.staticMethod = () => {}
 *    target.prototype.instanceMethod = () => {}
 *  }
 *
 *  method signature
 *  ----------------
 *  // target is class prototype, not instance
 *  function decorator(target, key, descriptor) {
 *    descriptor.enumerable = false
 *  }
 *
 *  NOTE: do not return anything from decorator (fucks up hmr)
 */

export injectLogger from './injectLogger'
export shallowUpdate from './shallowUpdate'
