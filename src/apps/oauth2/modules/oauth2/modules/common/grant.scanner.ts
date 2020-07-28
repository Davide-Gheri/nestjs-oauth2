import { ModuleRef, NestContainer } from '@nestjs/core';
import { GRANT_TYPE_METADATA } from './constants';
import { GrantInterface } from './grant.interface';

export class GrantScanner {
  private getModules(modulesContainer: Map<any, any>): any[] {
    return [...modulesContainer.values()];
  }

  public scan(
    moduleRef: ModuleRef,
  ): Map<string, GrantInterface> {
    const map = new Map();
    const container: NestContainer = (moduleRef as any).container;
    const modules = this.getModules(
      container.getModules(),
    );
    modules.forEach(m => {
      m._providers.forEach(p => {
        const { metatype, name } = p;

        if (typeof metatype !== 'function') {
          return;
        }
        if (!p.instance) {
          return;
        }

        const dataSourceMetadata = Reflect.getMetadata(
          GRANT_TYPE_METADATA,
          p.instance.constructor,
        );
        if (!dataSourceMetadata) {
          return;
        }
        p.instance.constructor.prototype.getIdentifier = () => dataSourceMetadata;
        map.set(name, moduleRef.get(name, { strict: false }));
      });
    });

    return map;
  }
}
