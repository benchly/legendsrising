import { Container } from 'aurelia-framework';
import { Rest } from 'aurelia-api';
import { PersistenceUnit } from './persistence-unit';
import { Entity } from './entity';

export class EntityManager {
  /**
   * Construct a new EntityManager for an entity.
   *
   * @param {PersistenceUnit} persistenceUnit
   * @param {Container} container
   * @param {Rest} api
   * @param {Entity} entityClass
   */
  constructor(private persistenceUnit: PersistenceUnit,
              private container: Container,
              private api: Rest,
              private entityClass: Entity) {
  }

  /**
   * Returns a new entity.
   */
  getEntity() {
    const instance = this.container.get(this.entityClass);
    instance.setResource(this.entityClass.getResource());
    return instance;
  }

  /**
   * Performs a query and populates entities based on the returned data.
   *
   * @param {{}|number|string} [criteria] - Criteria to add to the query. A plain string/number will be used as relative path.
   * @param {boolean} [raw] - Set to true to get a plain object instead of entities.
   * @return {Promise<Entity|[Entity]>}
   */
  find(criteria?: {} | number | string, raw?: boolean) {
    return this.findResource(this.entityClass.getResource(), criteria, raw);
  }

  /**
   * Performs a query for a single resource and populates an entity based on the returned data.
   *
   * @param {string} identifier - Identifier for the requested resource.
   * @param {{}|number|string} criteria - Criteria to add to the query. A plain string/number will be used as relative path.
   * @param {boolean} [raw] - Set to true to get a plain object instead of entities.
   * @returns {Promise.<Entity|Entity[]>}
   */
  findOne(identifier: string | number, criteria: {} | number | string, raw?: boolean) {
    if (typeof identifier === 'string' || typeof identifier === 'number') {
      return this.findResource(this.entityClass.getResource() + '/' + identifier, criteria, raw, true);
    }
  }

  /**
   * Performs a query on `resource` and populates entities based on the returned data.
   *
   * @param {string} resource - The resource to query
   * @param {{}|number|string} criteria - Criteria to add to the query. A plain string/number will be used as relative path.
   * @param {boolean} [raw] - Set to true to get a plain object instead of entities.
   * @param {boolean} [single] - Set to true to get a single entity instead of a collection.
   * @return {Promise<Entity|[Entity]>}
   */
  findResource(resource: string, criteria: {} | number | string, raw?: boolean, single?: boolean) {
    let result;
    if (single && typeof criteria === 'number') {
      result = this.api.findOne(resource, criteria);
    } else {
      result = this.api.find(resource, criteria);
    }

    if (raw) {
      return result;
    }

    return result
      .then(response => {
        return this.populateEntities(response);
      });
  }

  /**
   * Populate entity of this manager with data returned from API.
   *
   * @param {{}|[]} data - The data returned from the API.
   * @returns {Entity[]}
   */
  populateEntities(data: {} | any[]) {
    if (!data) {
      return [];
    }

    if (!Array.isArray(data)) {
      return this.populateEntity(data);
    }

    const entities = [];
    data.forEach(entityData => {
      entities.push(this.populateEntity(entityData));
    });
    return entities;
  }

  /**
   * Populate an entity with the given data.
   *
   * @param {{}} data
   */
  populateEntity(data: {}) {
    const entity = this.getEntity();
    const entityAssociations = entity.getAssociations();
    const entityData = {};
    for (let key in data) {
      const value = data[key];

      if (entityAssociations[key] && typeof value === 'object') {
        // TODO: those entities are not observable right now!
        const associationEntityManager = this.persistenceUnit.getEntityManager(entityAssociations[key]);
        entityData[key] = associationEntityManager.populateEntity(value);
        continue;
      }

      entityData[key] = value;
    }
    Object.assign(entity, entityData);
    return entity;
  }
}
