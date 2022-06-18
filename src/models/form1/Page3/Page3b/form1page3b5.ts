import { prop } from '@typegoose/typegoose';

const options = ['Predictable', 'Not Predictable'];
const options2 = ['Age', 'Gender', 'Genetic', 'Inter-current disease', 'Multiple Drug Therapy', 'Other'];

export default class Form1Page3b5 {
  @prop({ type: Boolean, required: true })
  public isComplete!: boolean;

  @prop({ type: String, enum: options })
  public predictability?: string;

  @prop({ type: String, enum: options2 })
  public predisposingFactors?: string[];

  @prop({ type: String })
  public others?: string;
}
