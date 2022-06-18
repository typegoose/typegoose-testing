import { prop, mongoose } from '@typegoose/typegoose';
import Form1Page3a from './Page3/form1page3a';
import Form1Page3b from './Page3/form1page3b';
import Form1Page3c from './Page3/form1page3c';
import Form1Page3d from './Page3/form1page3d';
import Form1Page3e from './Page3/form1page3e';
import Form1Page3f from './Page3/form1page3f';

export default class Form1Page3 {
  _id?: mongoose.Types.ObjectId;

  @prop({ type: Form1Page3a })
  public Form1Page3a?: Form1Page3a;

  @prop({ type: Form1Page3b })
  public Form1Page3b?: Form1Page3b;

  @prop({ type: Form1Page3c })
  public Form1Page3c?: Form1Page3c;

  @prop({ type: Form1Page3d })
  public Form1Page3d?: Form1Page3d[];

  @prop({ type: Form1Page3e })
  public Form1Page3e?: Form1Page3e;

  @prop({ type: Form1Page3f })
  public Form1Page3f?: Form1Page3f;
}
