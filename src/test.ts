// NodeJS: 16.6.1
// MongoDB: 4.2-bionic (Docker)
// import { defaultClasses, getModelForClass, prop, ReturnModelType } from "@typegoose/typegoose"; // @typegoose/typegoose@8.1.1
// import { AnyParamConstructor, BeAnObject } from "@typegoose/typegoose/lib/types";
import * as mongoose from "mongoose"; // mongoose@6.0.0-rc1

// enum AudioModel {
//   A = "story-item",
//   B = "story-log-item",
//   C = "coach-comment",
//   D = "coach-summary"
// }

// class AclBase implements defaultClasses.Base {
//   public _id!: mongoose.Types.ObjectId;
//   public id!: string;
// }

// class AudioRecordBase extends AclBase {
//   @prop()
//   public filePath?: string;

//   @prop()
//   public audio?: string;

//   public get hasAudio() {
//     return !!this.audio;
//   }
// }

// class StoryItem extends AudioRecordBase {
//   @prop()
//   public prompt: string;

//   @prop()
//   public header: string;
// }

// class QuestionItem extends AudioRecordBase {
//   @prop()
//   public question: string;

//   @prop()
//   public answer: string;
// }

// class ProposalItem extends AudioRecordBase {
//   @prop()
//   public person: string;

//   @prop()
//   public text: string;
// }

// class DataItem extends AudioRecordBase {
//   @prop()
//   public data: string;
// }

// const aItemModel = getModelForClass(StoryItem);
// const bItemModel = getModelForClass(QuestionItem);
// const cItemModel = getModelForClass(ProposalItem);
// const dItemModel = getModelForClass(DataItem);

// const audioModelMap1: Record<AudioModel, ReturnModelType<typeof AudioRecordBase, BeAnObject>> = {
//   [AudioModel.A]: aItemModel,
//   [AudioModel.B]: bItemModel,
//   [AudioModel.C]: cItemModel,
//   [AudioModel.D]: dItemModel,
// };

// mongoose only

type DocumentType<T> = T extends { _id: unknown; }
  ? mongoose.Document<T["_id"]> & T
  : mongoose.Document<any> & T;

type ModelType<T> = mongoose.Model<DocumentType<T>>;

interface IBase {
  _id: mongoose.Types.ObjectId;
  id: string;

  prop1: string;
  prop2: string;
}

interface IModel1 extends IBase {
  property1: number;
  property2: number;
}

interface IModel2 extends IBase {
  property3: string;
}

const BaseSchema: mongoose.Schema<DocumentType<IBase>, ModelType<IBase>> = new mongoose.Schema({ prop1: String, prop2: String });

const Model1Schema: mongoose.Schema<DocumentType<IModel1>, ModelType<IModel1>> = BaseSchema.clone() as any;
Model1Schema.add({ property1: Number, property2: Number });

const Model2Schema: mongoose.Schema<DocumentType<IModel2>, ModelType<IModel2>> = BaseSchema.clone() as any;
Model2Schema.add({ property3: String });

const Model1 = mongoose.model<DocumentType<IModel1>, ModelType<IModel1>>("m1", Model1Schema);
const Model2 = mongoose.model<DocumentType<IModel2>, ModelType<IModel2>>("m2", Model2Schema);

const someCache: Record<string, ModelType<IBase>> = {
  A: Model1, // error in in pre-6.0
  B: Model2 // error in in pre-6.0
};

const someMap: Map<string, ModelType<IBase>> = new Map();
someMap.set("A", Model1); // error in in pre-6.0
someMap.set("B", Model2); // error in in pre-6.0
