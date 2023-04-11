// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import { DocumentType, getModelForClass, prop, Ref } from '@typegoose/typegoose'; // @typegoose/typegoose@11.0.0
import * as mongoose from 'mongoose'; // mongoose@7.0.3

class Vendor {
  _id!: mongoose.Types.ObjectId;

  @prop()
  disabled?: boolean;

  @prop({
    ref: () => Invoice,
    foreignField: 'vendorId',
    localField: '_id',
  })
  public invoices?: Ref<Invoice>[];

  public getInvoices(): Promise<DocumentType<Invoice>[]> {
    const vendorId = this._id;
    const invoiceModel = getModelForClass(Invoice);

    return invoiceModel.find({ vendorId }).exec();
  }
}

class Invoice {
  @prop({ required: true })
  created!: Date;

  @prop({
    ref: () => Vendor,
    required: true,
    foreignField: '_id',
    localField: 'vendorId',
    justOne: true,
  })
  public vendor!: Ref<Vendor>;

  @prop({ required: true })
  public vendorId!: string;
}

const VendorModel = getModelForClass(Vendor, {
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
});

const InvoiceModel = getModelForClass(Invoice, {
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
});

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  await mongoose.connect('mongodb://localhost:27017/', { dbName: 'migration-to-typegoose' });

  const vendor = await VendorModel.create({
    disabled: false,
  });

  const invoice = await InvoiceModel.create({
    created: new Date(),
  });

  const queriedVendor1 = await VendorModel.findOne().populate<{ invoices: Invoice[] }>('invoices');

  console.log('queriedVendor1', queriedVendor1);
  console.log('await queriedVendor1?.getInvoices()', await queriedVendor1?.getInvoices());

  await mongoose.disconnect();
})();
