// NodeJS: 16.6.0
// MongoDB: 4.2-bionic (Docker)
import { defaultClasses, getModelForClass, prop, ReturnModelType } from "@typegoose/typegoose"; // @typegoose/typegoose@8.1.1
import { AnyParamConstructor, BeAnObject } from "@typegoose/typegoose/lib/types";
import * as mongoose from "mongoose"; // mongoose@5.13.5

enum AudioModel {
  A = "story-item",
  B = "story-log-item",
  C = "coach-comment",
  D = "coach-summary"
}

class AclBase implements defaultClasses.Base {
  public _id!: mongoose.Types.ObjectId;
  public id!: string;
}

class AudioRecordBase extends AclBase {
  @prop()
  public filePath?: string;

  @prop()
  public audio?: string;

  public get hasAudio() {
    return !!this.audio;
  }
}

class StoryItem extends AudioRecordBase {
  @prop()
  public prompt: string;

  @prop()
  public header: string;
}

class QuestionItem extends AudioRecordBase {
  @prop()
  public question: string;

  @prop()
  public answer: string;
}

class ProposalItem extends AudioRecordBase {
  @prop()
  public person: string;

  @prop()
  public text: string;
}

class DataItem extends AudioRecordBase {
  @prop()
  public data: string;
}

const aItemModel = getModelForClass(StoryItem);
const bItemModel = getModelForClass(QuestionItem);
const cItemModel = getModelForClass(ProposalItem);
const dItemModel = getModelForClass(DataItem);

const audioModelMap1: Record<AudioModel, ReturnModelType<typeof AudioRecordBase, BeAnObject>> = {
  [AudioModel.A]: aItemModel,
  [AudioModel.B]: bItemModel,
  [AudioModel.C]: cItemModel,
  [AudioModel.D]: dItemModel,
};

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verifyMASTER", useCreateIndex: true, useUnifiedTopology: true });

  await mongoose.disconnect();
})();
