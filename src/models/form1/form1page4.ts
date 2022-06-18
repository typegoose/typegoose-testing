import { prop } from '@typegoose/typegoose';

export default class Form1Page4 {
  @prop({ type: Boolean, required: true })
  public isComplete!: boolean;

  @prop({ type: String, required: true })
  public name!: string;

  @prop({ type: String })
  public idNumber?: string;

  @prop({ type: String })
  public pin?: string;

  @prop({ type: String, required: true })
  public email!: string;

  @prop({ type: Number, required: true })
  public telephoneNumber!: number;

  @prop({ type: String })
  public profAddress?: string;

  @prop({ type: String })
  public occupation?: string;

  @prop({ type: String })
  public department?: string;

  @prop({ type: Date })
  public dateOfThisReport?: Date;

  @prop({ type: String })
  public references?: string;

  @prop({ type: String })
  public reportersComment?: string;
}
