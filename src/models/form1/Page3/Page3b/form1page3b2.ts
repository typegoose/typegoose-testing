import { prop } from '@typegoose/typegoose';

const options = ['Certain', 'Probably/Likely', 'Possible', 'Unlikely', 'Conditional/Unclassified', 'Un-accessable/Un-classifiable'];

export default class Form1Page3b2 {
  @prop({ type: Boolean, required: true })
  public isComplete!: boolean;

  @prop({ type: String, enum: options })
  public WHOProbabilityScaleValue?: string;
}
