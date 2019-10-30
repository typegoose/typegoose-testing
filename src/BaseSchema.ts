import { modelOptions, mongoose } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class BaseSchema {
    public readonly _id!: mongoose.Types.ObjectId;

    public readonly createdAt!: Date;

    public readonly updatedAt!: Date;
}
