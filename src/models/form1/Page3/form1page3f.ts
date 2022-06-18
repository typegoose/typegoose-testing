import { prop } from '@typegoose/typegoose';

const options = ['Fatal', 'Recovery', 'Continuing', 'Unknown', 'Other'];

export default class Form1Page3f {
  @prop({ type: Boolean, required: true })
  public isComplete!: boolean;

  @prop({ type: String, enum: options })
  public outcome?: string;
}
