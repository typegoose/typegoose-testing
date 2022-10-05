// NodeJS: 18.8.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.4
import * as mongoose from 'mongoose'; // mongoose@6.6.4

mongoose.set('runValidators', true); // without this option it does not occur

const countrySchema = new mongoose.Schema({ title: String });

const areasSubSchema = new mongoose.Schema({ country: [countrySchema] });

const WorldSchema = new mongoose.Schema({
  areas: areasSubSchema,
});

const WorldModel = mongoose.model('World', new mongoose.Schema({ title: String }));
const EarthModel = WorldModel.discriminator('Earth', WorldSchema);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const data = {
    areas: {
      country: [
        {
          title: 'titlec',
        },
      ],
    },
  };
  const eventDoc = await EarthModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId() }, data);

  console.log(eventDoc);

  await mongoose.disconnect();
})();
