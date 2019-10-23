// NodeJS: 12.11.1
// MongoDB: 4.2-bionic (Docker)
import { DocumentType, getModelForClass, index, pre, prop, Ref } from "@typegoose/typegoose"; // @typegoose/typegoose@6.1.0-7
import * as _ from "lodash";
import * as mongoose from "mongoose"; // mongoose@5.7.6
import { createUnionType, Field, ObjectType } from "type-graphql";
import { isNullOrUndefined } from "util";

@ObjectType()
export class CreatedTypegoose {
    @Field()
    public readonly _id!: mongoose.Schema.Types.ObjectId;

    @Field()
    @prop({ index: true, default: 0 })
    public editedDate?: number;

    @Field()
    @prop({ index: true, default: 0 })
    public createdDate?: number;

    @Field((type) => User)
    @prop({ index: true, ref: "User", default: new mongoose.Types.ObjectId() })
    public createdUser?: Ref<User>;

    // @Field((type) => Business)
    // @prop({ index: true, ref: "Business", default: () => HttpContext("business") })
    // public createdBusiness: Ref<Business>;
}

@ObjectType()
@pre<Job>("save", PreSaveNote)
export class Job extends CreatedTypegoose { }

@ObjectType()
// @index({ center: "2dsphere" })
// @index({ addressString: "text" })
// @index({ addressId: 1, createdBusiness: 1 }, { unique: true })
@pre<Property>("save", PreSaveNote)
export class Property extends CreatedTypegoose { }

@ObjectType()
@pre<Supplier>("save", PreSaveNote)
export class Supplier extends CreatedTypegoose { }

@ObjectType()
// @index({ name: "text", surname: "text", email: "text" })
@pre<Contact>("save", PreSaveNote)
export class Contact extends CreatedTypegoose { }

class User {
    @prop()
    public firstName?: string;

    @prop()
    public lastName?: string;
}

class Note { }

class SomeClass {
    @Field((type) => NoteEnityUnion)
    @prop({ required: true, refPath: "entityRef" })
    public entity!: Ref<Property | Contact | Supplier | User>;
}

// class BusinessProperty { }

const UserModel = getModelForClass(User);
const NoteModel = getModelForClass(Note);
const ContactModel = getModelForClass(Contact);
const SupplierModel = getModelForClass(Supplier);
const PropertyModel = getModelForClass(Property);
const JobModel = getModelForClass(Job);

export async function PreSaveNote(this: DocumentType<CreatedTypegoose>) {
    // const { user, business } = httpContext.get("state");
    const { user, business } = { user: this.createdUser || new mongoose.Types.ObjectId(), business: new mongoose.Types.ObjectId() };
    if (!user) return;

    const found = await UserModel.findById(user).exec();

    if (isNullOrUndefined(found)) {
        throw new Error("found is null or undefined");
    }

    const { firstName, lastName } = found;

    const modifiedPaths = this.modifiedPaths();
    const isNewDoc = modifiedPaths.includes("createdUser");
    // this.editedDate = UnixSeconds(); // because idk what "UnixSeconds" is
    this.editedDate = 1;

    const input: Partial<Note> = {
        createdUser: user,
        createdBusiness: business,
        entity: this._id,
        entityRef: (this.constructor as any).modelName,
        body: isNewDoc ? `Created by ${firstName} ${lastName}` : `'${modifiedPaths.map((res) => _.startCase(res)).join(", ")}', Updated by ${firstName} ${lastName}`
    };

    await NoteModel.create({ ...input });
}

export const NoteEnityUnion = createUnionType({
    name: "NoteEnityUnion",
    types: () => [Property, /* BusinessProperty, */ Supplier, User],
    resolveType: (value) => {
        if ("contactType" in value) return Contact;
        if ("buildingType" in value) return Property;
        if ("supplierType" in value) return Supplier;
        if ("firstName" in value) return User;
        // if ("property" in value && "addressString" in value) return BusinessProperty;
        return undefined;
    }
});

(async () => {
    await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verify26", useCreateIndex: true, useUnifiedTopology: true });

    const user = await UserModel.create({ firstName: "SomeOne", lastName: "else" } as User);

    const someSupply = await SupplierModel.create({ createdUser: user, createdDate: 1 } as Partial<Supplier>);
    console.log(someSupply);

    const someContact = await ContactModel.create({ createdUser: user } as Partial<Contact>);
    console.log(someContact);

    await mongoose.disconnect();
})();
