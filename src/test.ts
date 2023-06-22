// NodeJS: 19.9.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import { Ref, getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@11.2.0
import * as mongoose from 'mongoose'; // mongoose@7.2.1
import { inspect } from 'node:util'; // using inspect because console.log is not deep enough for the results

class User {
  @prop()
  public name?: string;
}

class Listing {
  @prop()
  public name?: string;

  @prop({ ref: () => User })
  public owner!: Ref<User>;
}

class Reservation {
  @prop({ ref: () => User })
  public reservee!: Ref<User>;

  @prop({ ref: () => Listing })
  public listing!: Ref<Listing>;

  @prop()
  public name?: string;
}

const UserModel = getModelForClass(User);
const ListingModel = getModelForClass(Listing);
const ReservationModel = getModelForClass(Reservation);

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  await mongoose.connection.dropDatabase();

  // initial data

  const owner1 = await UserModel.create({ name: 'owner1' });
  const owner2 = await UserModel.create({ name: 'owner2' });

  const user1 = await UserModel.create({ name: 'user1' });

  const wantedListing = await ListingModel.create({ name: 'wantedListing', owner: owner1 });
  const anotherListingOtheruser1 = await ListingModel.create({ name: 'anotherOtherUser1', owner: owner2 });
  const anotherListingSameuser1 = await ListingModel.create({ name: 'anotherSameUser1', owner: owner1 });

  const wantedReservation = await ReservationModel.create({ reservee: user1, listing: wantedListing, name: 'wantedReservation' });
  const anotherReservationOtherUser = await ReservationModel.create({
    reservee: owner2,
    listing: anotherListingOtheruser1,
    name: 'anotherOtherUser1',
  });

  // initial data end

  // first query "Listing" collection for the user
  const doubleListings = await ListingModel.find({ owner: owner1 }).orFail();
  // then query "Reservation" based on the results from "Listing"
  const doubleReservations = await ReservationModel.find({ listing: doubleListings.map((v) => v._id) })
    .populate('listing')
    .orFail();

  const doubleObject = doubleReservations.map((v) => v.toObject());

  console.log('found double-query data:', inspect(doubleReservations, false, 10, true));

  // the same as the double-query version (actually 3 thanks to populate), just with one aggregate query
  const aggregateResult = await ReservationModel.aggregate([
    // perform a search on the Listing collection
    {
      $lookup: {
        from: ListingModel.collection.name,
        // store the current documents "listing" property for use inside pipeline
        let: { listingid: '$listing' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  // find Listing's where the owner is of the wanted owner
                  { $eq: ['$owner', owner1._id] },
                  // also limit found Listing's to the one from the current Reservation
                  { $eq: ['$_id', '$$listingid'] },
                ],
              },
            },
          },
        ],
        // store result as the "listing" property (overwrite original from Reservation)
        // change this value if you dont want the "listing" to be populated along with the "unwind"
        as: 'listing',
      },
    },
    {
      // create a new document for each element in the array "listing"
      // this is safe because the expected result from "$lookup" is only 1 document
      $unwind: '$listing',
    },
  ]).exec();

  console.log('found aggregate data:', inspect(aggregateResult, false, 10, true));

  console.log('matches?', JSON.stringify(doubleObject) === JSON.stringify(aggregateResult));

  await mongoose.disconnect();
}

main();
