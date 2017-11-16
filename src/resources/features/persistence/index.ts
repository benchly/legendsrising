import { FrameworkConfiguration } from 'aurelia-framework';

import { PersistenceUnit } from './persistence-unit';

/**
 * Persistence feature configuration
 *
 * @export
 * @param {FrameworkConfiguration} frameworkConfig
 * @param {function} configure
 */
export function configure(frameworkConfig: FrameworkConfiguration,
                          configure: (persistenceUnit: PersistenceUnit) => void): void {
  // create a new instance of the PersistenceUnit
  const persistenceUnit = frameworkConfig.container.get(PersistenceUnit);

  // configure feature
  if (configure !== undefined && typeof configure === 'function') {
    configure(persistenceUnit);
  }
}

export { PersistenceUnit } from './persistence-unit';
export { EntityManagerFactory } from './entity-manager-factory';
export { EntityManager } from './entity-manager';
export { Entity } from './entity';
