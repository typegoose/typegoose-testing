// NodeJS: 21.6.2
// MongoDB: 5.0 (Docker)
// Typescript 5.3.3
import { Ref, getModelForClass, modelOptions, prop, setLogLevel } from '@typegoose/typegoose'; // @typegoose/typegoose@12.4.0
import { DecoratorKeys } from '@typegoose/typegoose/lib/internal/constants';
import { DecoratedPropertyMetadataMap } from '@typegoose/typegoose/lib/types';
// import * as mongoose from 'mongoose'; // mongoose@8.3.3

setLogLevel('DEBUG');

class Father {
  @prop({ required: true })
  fatherId!: string;
}

class Mother {
  @prop({ required: true })
  motherId!: string;
}

class FatherReference {
  @prop({
    ref: () => Father,
    localField: 'fatherId',
    foreignField: 'fatherId',
    justOne: true,
  })
  father?: Ref<Father>;
}

class MotherReference {
  @prop({
    ref: () => Mother,
    localField: 'motherId',
    foreignField: 'motherId',
    justOne: true,
  })
  mother?: Ref<Mother>;
}

@modelOptions({ schemaOptions: { collection: 'children' } })
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class Children {
  @prop({ required: true, type: () => String })
  name!: string;
}

function applyMixins(target: any, sources: any[]): void {
  for (const source of sources) {
    for (const name of Object.getOwnPropertyNames(source.prototype)) {
      // dont copy over the constructor, as that would change the "target" class itself to be that of "source"
      // and so later apply reflect metadata on "source" instead of "target"
      if (name === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(source.prototype, name);

      if (descriptor) {
        Object.defineProperty(target.prototype, name, descriptor);
      }
    }

    // Copy and merge metadata, with special handling for Typegoose's @prop metadata
    const keys = Reflect.getMetadataKeys(source.prototype) as string[];
    for (const key of keys) {
      if (key == DecoratorKeys.PropCache) {
        // no mapping needed, as the above gurantees this exists
        const source_metadata: DecoratedPropertyMetadataMap = Reflect.getMetadata(DecoratorKeys.PropCache, source.prototype);

        const target_map: DecoratedPropertyMetadataMap = Reflect.getOwnMetadata(DecoratorKeys.PropCache, target.prototype) ?? new Map();

        console.log('TEST', source_metadata, target_map);

        for (const [source_key, source_value] of source_metadata) {
          // modify target as the references are not chainable anymore
          const clone = {
            ...source_value,
            target: target.prototype,
          };

          // TODO: maybe dont overwrite, but merge options instead?
          // TODO: maybe the mixins should not overwrite existing keys on this class
          target_map.set(source_key, clone);

          // also define "emitDecoratorMetadata" decorator key, needs to be done here as class keys dont exist on the constructor / prototype and so would need to be figured out
          // there also does not exist any way to get all property keys, at least i am not aware of a way
          const type_value = Reflect.getMetadata(DecoratorKeys.Type, source.prototype, source_key);

          if (type_value !== undefined) {
            Reflect.defineMetadata(DecoratorKeys.Type, type_value, target.prototype, source_key);
          }
        }

        Reflect.defineMetadata(DecoratorKeys.PropCache, target_map, target.prototype);
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface Children extends FatherReference, MotherReference {}
applyMixins(Children, [FatherReference, MotherReference]);

console.log('FINAL', Reflect.getMetadata(DecoratorKeys.PropCache, Children.prototype));

const ChildrenModel = getModelForClass(Children);
console.debug(ChildrenModel.schema);
