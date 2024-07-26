// NodeJS: 22.2.0
// MongoDB: 5.0 (Docker)
// Typescript 5.3.3
import { DocumentType, Ref, getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@12.5.0
import * as mongoose from 'mongoose'; // mongoose@8.4.1

interface Updateable {
  method1(): boolean;
  lastUpdate?: Date;
}

class User {
  @prop({ required: true, trim: true })
  public email!: string;

  @prop({ trim: true })
  public firstName?: string;

  @prop({ trim: true })
  public lastName?: string;

  @prop()
  public lastUpdate?: Date;

  public method1() {
    return true;
  }
}

export const UserModel = getModelForClass(User);

class Ticket {
  @prop({ required: true, ref: () => User })
  public user!: Ref<User>;

  @prop()
  public dateOpen?: Date;

  @prop({ trim: true })
  public message?: string;

  @prop()
  public lastUpdate?: Date;

  public method1() {
    return false;
  }
}

export const TicketModel = getModelForClass(Ticket);

interface MaybeLastUpdate {
  lastUpdate?: Updateable['lastUpdate'];
}

function genericFunction<T extends MaybeLastUpdate, D extends mongoose.Document & Updateable>(
  updDocData: T,
  dataDoc: D
): T & MaybeLastUpdate {
  if (dataDoc.method1 && typeof dataDoc.method1 === 'function' && dataDoc.method1() && dataDoc.lastUpdate) {
    updDocData.lastUpdate = new Date();
  }

  return updDocData;
}

const userDoc = new UserModel();
const ticketDoc = new TicketModel();

const dataToUpdateForUser = genericFunction<Partial<User>, DocumentType<User>>({ firstName: 'updatedName' }, userDoc);
const dataToUpdateForTicket = genericFunction<Partial<Ticket>, DocumentType<Ticket>>({ message: 'updatedMessage' }, ticketDoc);

console.log('dataToUpdateForUser', dataToUpdateForUser);
console.log('dataToUpdateForTicket', dataToUpdateForTicket);
