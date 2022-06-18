import { prop, mongoose } from '@typegoose/typegoose';

export default class Form1Page1 {
  _id?: mongoose.Types.ObjectId;

  @prop({ type: Boolean, default: false })
  public isComplete?: boolean;

  @prop({ type: String, required: true })
  public patientInitials!: string;

  @prop({ type: String })
  public DateOfBirth?: string;

  @prop({ type: String, required: true })
  public ageOfOnset!: string;

  @prop({ type: String })
  public gender?: string;

  @prop({ type: Number })
  public weight?: number;

  @prop({ type: String })
  public patientID?: string;

  @prop({ type: String })
  public ip_op?: string;

  @prop({ type: String })
  public unit?: string;

  @prop({ type: String })
  public reasonForTakingMedication?: string;

  @prop({ type: String })
  public medicineAdvised?: string;

  @prop({ type: String })
  public knownAllergies?: string;

  @prop({ type: String })
  public socialHistory?: string;
}
