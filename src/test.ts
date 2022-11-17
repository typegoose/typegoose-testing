// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.4
import * as mongoose from 'mongoose'; // mongoose@6.7.2

const eventSchema = new mongoose.Schema(
  {
    time: Date,
  },
  { discriminatorKey: 'kind' }
);
eventSchema.pre('validate', function testv() {
  console.log('validate', this.constructor.name, this.modelName);
});

const clickedLinkEvent = eventSchema.clone();
clickedLinkEvent.add({ url: String });

const signedUpEvent = eventSchema.clone();
signedUpEvent.add({ user: String });

console.log('TEST0', (eventSchema as any).s.hooks._pres);

const EventModel = mongoose.model('Event', eventSchema);
const ClickedLinkEventModel = EventModel.discriminator('ClickedLinkEvent', clickedLinkEvent, { mergeHooks: true, mergePlugins: false });

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const events = await Promise.all([
    EventModel.create({ time: new Date(Date.now()), url: 'google.com' }),
    ClickedLinkEventModel.create({ time: Date.now(), url: 'google.com' }),
  ]);

  console.log('TEST1', (EventModel.schema as any).s.hooks._pres);
  console.log('TEST2', (ClickedLinkEventModel.schema as any).s.hooks._pres);

  await mongoose.disconnect();
})();
