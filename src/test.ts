// NodeJS: 18.8.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.4
// import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@9.12.1
import * as mongoose from 'mongoose'; // mongoose@6.6.3

mongoose.set('strict', 'throw');

const options = { discriminatorKey: 'kind' };

const EventSchema = new mongoose.Schema({ name: String, kind: String, animals: { kind: String, world: String } }, options);

const Event = mongoose.model('Event', EventSchema);

const ClickedLinkEvent = Event.discriminator('ClickedLink', new mongoose.Schema({ url: String }, options));

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const eventDoc = await Event.findByIdAndUpdate(
    { _id: new mongoose.Types.ObjectId() },
    {
      $set: {
        name: 'name',
        // error "Can't modify discriminator key "kind" on discriminator model", even though its a different "kind"
        animals: { kind: 'kind', world: 'world' },
      },
    },
    {}
  );

  console.log(eventDoc);

  await mongoose.disconnect();
})();
