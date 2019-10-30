import { arrayProp, index, modelOptions, pre, prop, getModelForClass } from "@typegoose/typegoose";

import { BaseSchema } from "./BaseSchema";

enum PortalUserRoles {
    PARTNER,
    SOMETHING
}

enum PortalUserStatus {
    ENABLED,
    DISABLED
}

@index({ email: 1 }, { unique: true })
@pre("save", () => void 0)
@pre("save", () => void 0)
@modelOptions({ schemaOptions: { collection: "portalusers" } })
export class PortalUserSchema extends BaseSchema {
    @arrayProp({ items: String, enum: PortalUserRoles, default: [PortalUserRoles.PARTNER] })
    public roles: PortalUserRoles[] = [PortalUserRoles.PARTNER];

    @prop({ required: true })
    public firstName!: string;

    @prop({ required: true })
    public lastName!: string;

    @prop({ required: true })
    public email!: string;

    @prop({ required: true })
    public password!: string;

    @prop({ default: null })
    public passwordResetExpires?: Date | null;

    @prop({ default: null })
    public passwordResetToken?: string | null;

    @prop({ default: PortalUserStatus.ENABLED })
    public status?: number = PortalUserStatus.ENABLED;
}

export const PortalUserModel = getModelForClass(PortalUserSchema);
