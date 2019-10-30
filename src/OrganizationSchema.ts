import { modelOptions, prop, Ref, index, pre, getModelForClass } from "@typegoose/typegoose";

import { BaseSchema } from "./BaseSchema";

@index("parent", { sparse: true })
@pre("save", () => void 0)
@modelOptions({ schemaOptions: { collection: "organizations" } })
export class OrganizationSchema extends BaseSchema {
    @prop({ required: true })
    public name!: string;

    @prop({ default: null, ref: "organization" })
    public parent?: Ref<OrganizationSchema> | null;

    @prop({ default: 0 })
    public readonly childCount?: number;
}

export const OrganizationModel = getModelForClass(OrganizationSchema);
