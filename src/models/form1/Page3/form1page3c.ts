import { prop } from '@typegoose/typegoose';

const options = ['Specific', 'Symptomatic', 'None'];

export default class Form1Page3c {
  @prop({ type: Boolean, required: true })
  public isComplete!: boolean;

  @prop({ type: String, enum: options })
  public predisposingFactors?: string[];

  @prop({ type: String })
  public treatmentDetails?: string;
}
