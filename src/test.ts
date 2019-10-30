// NodeJS: 12.13.0
// MongoDB: 4.2-bionic (Docker)
// import { getModelForClass, prop } from "@typegoose/typegoose"; // @typegoose/typegoose@6.0.4
import * as mongoose from "mongoose"; // mongoose@5.7.6
import { OrganizationModel } from "./OrganizationSchema";
import { PortalUserModel } from "./PortalUsersSchema";

(async () => {
    await mongoose.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true, dbName: "verifyMASTER", useCreateIndex: true, useUnifiedTopology: true });

    console.log("OrgModel", (OrganizationModel.schema as any).options); // { collection: "organizations" }
    console.log("PortalUser", (PortalUserModel.schema as any).options); // { collection: "portalusers" }

    await mongoose.disconnect();
})();
