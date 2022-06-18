import { prop, mongoose } from '@typegoose/typegoose';

export default class Form1Page2 {
  _id?: mongoose.Types.ObjectId;

  @prop({ type: Boolean, required: true, default: false })
  public isComplete!: boolean;

  @prop({ type: String, required: true })
  public dateOfReactionStarted!: string;

  @prop({ type: String })
  public dateOfRecovery?: string;

  @prop({ type: String, required: true })
  public reactionDescription!: string;
}
