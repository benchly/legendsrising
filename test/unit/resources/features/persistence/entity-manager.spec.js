import {Container} from 'aurelia-framework';
import {Rest, Config} from 'aurelia-api';
import {PersistenceUnit} from '../../../../../src/resources/features/persistence/persistence-unit';
import {EntityManager} from '../../../../../src/resources/features/persistence/entity-manager';
import {FaqEntity} from './fixtures/faq-entity';

let baseUrls = {
  api: 'http://localhost:3000/'
};

describe('EntityManager', () => {
  let sut;

  beforeEach(() => {
    let container = new Container();
    let config = new Config();
    config.registerEndpoint('api', configure => {
      configure.withBaseUrl(baseUrls.api);
    });
    config.setDefaultEndpoint('api');

    sut = new EntityManager(container.get(PersistenceUnit), container, config.getEndpoint(), FaqEntity);
  });

  describe('.getEntity()', () => {
    it('Should return a new `FaqEntity` instance.', () => {
      let entity = sut.getEntity();
      expect(entity instanceof FaqEntity).toBe(true);
      expect(entity.getResource()).toBe('faqs');
    });
  });

  describe('.find()', () => {
    it('Should create and return an array of `FaqEntity`.', done => {
      sut.find()
        .then(entities => {
          expect(typeof entities).toBe('object');
          for (let entity of entities) {
            expect(entity instanceof FaqEntity).toBe(true);
          }
          done();
        });
    });
  })
});