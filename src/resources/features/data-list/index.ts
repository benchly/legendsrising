import { PLATFORM } from 'aurelia-pal';

export function configure(config) {
  config.globalResources([
    PLATFORM.moduleName('./data-list'),
    PLATFORM.moduleName('./data-loader')
  ]);
}

export * from './data-list-controller';
