// NodeJS: 16.7.0
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@8.2.0
import * as mongoose from 'mongoose'; // mongoose@5.13.8

class Class1 {
  @prop()
  public username?: string;
}
const Model1 = getModelForClass(Class1);

class Class2 {
  @prop()
  public another?: string;
}
const Model2 = getModelForClass(Class2);

// this does not error in 4.2.4
// this does not error in 4.3.5
// this does not error in 4.4.2
{
  const doc = new Model1();

  const test = doc as Class2;
}
// this does not error in 4.2.4
// this does not error in 4.3.5
// this does not error in 4.4.2
{
  const doc = new Model1();

  const test = doc as Class2 | null;
}
// this *does* error in 4.2.4
// this does not error in 4.3.5
// this *does* error in 4.4.2
{
  const doc = new Model1();

  const test = doc as number | null;
}
// this *does* error in 4.2.4
// this does not error in 4.3.5
// this *does* error in 4.4.2
{
  const doc = new Model1();

  const test = doc as null;
}
