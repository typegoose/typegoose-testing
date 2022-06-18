import { prop, mongoose } from '@typegoose/typegoose';

// const availableActions = ["Dose reduced", "Dose increased", "Drug withdrawn", "Dose not changed", "Not applicable", "Unknown"]
// const availableActions2 = ["No rechallenge", "Recurrence of symptoms", "No occurance of symptomps", "Unknown"]

export class Form1Page3aData {
  _id?: mongoose.Types.ObjectId;

  @prop({ type: Number, required: true, unique: true })
  public identifier!: number;

  @prop({ type: String, required: true })
  public nameOfDrug!: string;

  @prop({ type: String })
  public manufacturer?: string;

  @prop({ type: String })
  public BatchNo_LotNo?: string;

  @prop({ type: String })
  public expDate?: string;

  @prop({ type: Number })
  public doseUsed?: number;

  @prop({ type: String })
  public routeUsed?: string;

  @prop({ type: String })
  public ip_op?: string;

  @prop({ type: String })
  public unit?: string;

  @prop({ type: String })
  public frequency?: string;

  @prop({ type: String, required: true })
  public dateStarted!: string;

  @prop({ type: String })
  public dateStopped?: string;

  @prop({ type: String })
  public indication?: string;

  @prop({ type: String })
  public actionTaken?: string;

  @prop({ type: String })
  public dechallenge?: string;

  @prop({ type: String })
  public rechallenge?: string;

  @prop({ type: String })
  public reactionCategorization?: string;

  @prop({ type: String })
  public doseAfterReintroduction?: string;
}

export default class Form1Page3a {
  _id?: mongoose.Types.ObjectId;

  @prop({ type: Boolean, default: false })
  public isComplete?: boolean;

  @prop({ type: () => Form1Page3aData })
  public drugDetails?: Form1Page3aData[];
}
