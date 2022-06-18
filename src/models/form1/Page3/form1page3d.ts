import { prop } from '@typegoose/typegoose';

export default class Form1Page3d {
  @prop({ type: Boolean, required: true })
  public isComplete!: boolean;

  @prop({ type: String, required: true })
  public name!: string;

  @prop({ type: String })
  public doseUsed?: string;

  @prop({ type: String })
  public routeUsed?: string;

  @prop({ type: String })
  public frequency?: string;

  @prop({ type: Date, required: true })
  public dateStarted!: Date;

  @prop({ type: Date })
  public dateStopped?: Date;

  @prop({ type: String })
  public Indication?: string;
}
