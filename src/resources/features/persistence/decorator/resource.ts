import { metadata } from 'aurelia-metadata';

/**
 * Sets the 'resource' metadata on the entity.
 *
 * @param {string} resource - The name of the resource
 * @return {function}
 * @decorator
 */
export function resource(resource) {
  return function (target) {
    const object: any = metadata.getOrCreateOwn(metadata.paramTypes, Map, target, target.name);
    object.set('resource', resource || target.name.toLowerCase());
  };
}
