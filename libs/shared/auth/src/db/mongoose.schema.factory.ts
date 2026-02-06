import { Type } from '@nestjs/common';
import { SchemaFactory } from '@nestjs/mongoose';

export function MongooseSchemaFactory<TClass = any>(target: Type<TClass>): any {
  return SchemaFactory.createForClass(target).set('toObject', {
    transform: (doc, ret) => {
      delete ret._id;
      return { ...ret, id: doc._id.toString() };
    },
    versionKey: false,
  });
}
