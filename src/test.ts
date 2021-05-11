// NodeJS: 16.1.0
// MongoDB: 4.2-bionic (Docker)
import { getModelForClass, modelOptions, prop, Ref, setLogLevel } from "@typegoose/typegoose"; // @typegoose/typegoose@8.0.0-beta.5
import * as mongoose from "mongoose"; // mongoose@5.12.7
import { inspect } from "util";
import { schemas } from "@typegoose/typegoose/lib/internal/data";

enum ActivityKind {
  Talk = "TALK",
  None = "NONE"
}

const GuestSchema = new mongoose.Schema({
  dummy: String
});

const ActivitySchema = new mongoose.Schema({
  title: String,
  kind: { required: true, type: String, enum: [ActivityKind.Talk] }
}, { discriminatorKey: "kind" });

const ActivityTalkSchema = new mongoose.Schema({
  speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Guest" }]
});
ActivityTalkSchema.add(ActivitySchema);
// skip check because otherwise "add" can not be used
(ActivityTalkSchema.paths.kind as any).options.$skipDiscriminatorCheck = true;

const SponsorSchema = new mongoose.Schema({
  speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Guest" }]
});

const ProgrammeSchema = new mongoose.Schema({
  sponsors: [SponsorSchema],
  activities: [{
    required: true,
    type: ActivitySchema
  }]
});
// @ts-expect-error mongoose does not have typings for "discriminator" without casting beforehand
ProgrammeSchema.path("activities").discriminator("ActivityTalk", ActivityTalkSchema, ActivityKind.Talk);

const GuestModel = mongoose.model("Guest", GuestSchema);
const ProgrammeModel = mongoose.model("Programme", ProgrammeSchema);

// setLogLevel("DEBUG");

// class Guest {
//   @prop()
//   public dummy?: string;
// }

// type AnyActivity = ActivityTalk;

// class Programme {
//   @prop({
//     required: true,
//     type: () => [Activity],
//     discriminators: () => [
//       { type: ActivityTalk, value: ActivityKind.Talk },
//     ]
//   })
//   public activities!: AnyActivity[];

//   @prop({ type: () => [Sponsor] })
//   public sponsors?: Sponsor[];
// }

// @modelOptions({ schemaOptions: { discriminatorKey: "kind" } })
// abstract class Activity {
//   @prop({ required: true, enum: [ActivityKind.Talk], type: String })
//   public kind!: ActivityKind;

//   @prop()
//   public title!: string;
// }

// class ActivityTalk extends Activity {
//   public kind!: ActivityKind.Talk;

//   @prop({ ref: () => Guest })
//   public speakers?: Ref<Guest>[];
// }

// class Sponsor {
//   @prop({ ref: () => Guest })
//   public speakers?: Ref<Guest>[];
// }

// const GuestModel = getModelForClass(Guest);
// const ProgrammeModel = getModelForClass(Programme);

(async () => {
  console.log(inspect(schemas.get("Activity"), false, 5));
  await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verifyMASTER", useCreateIndex: true, useUnifiedTopology: true });

  // seed the database
  const guest1 = await GuestModel.create({ dummy: "1" });
  const guest2 = await GuestModel.create({ dummy: "2" });

  const programme1 = await ProgrammeModel.create({
    sponsors: [
      { speakers: [guest1, guest2] }
    ],
    activities: [
      { title: "hello", kind: ActivityKind.Talk, speakers: [guest1, guest2] }
    ]
  });

  const event = await ProgrammeModel.findOne({ _id: programme1._id }).orFail().exec();
  console.log("found", inspect(event, false, 5, true));
  await event.populate({ path: "activities.speakers" }).execPopulate();

  console.log("populate", inspect(event, false, 5, true));

  await mongoose.disconnect();
})();
