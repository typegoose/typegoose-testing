import { prop } from '@typegoose/typegoose';
import Form1Page3b1 from './Page3b/form1page3b1';
import Form1Page3b2 from './Page3b/form1page3b2';
import Form1Page3b3 from './Page3b/form1page3b3';
import Form1Page3b4 from './Page3b/form1page3b4';
import Form1Page3b5 from './Page3b/form1page3b5';

export default class Form1Page3b {
  @prop({ type: Boolean, required: true })
  public isComplete!: boolean;

  @prop({ type: Form1Page3b1 })
  public form1page3b1?: Form1Page3b1;

  @prop({ type: Form1Page3b2 })
  public form1page3b2?: Form1Page3b2;

  @prop({ type: Form1Page3b3 })
  public form1page3b3?: Form1Page3b3;

  @prop({ type: Form1Page3b4 })
  public form1page3b4?: Form1Page3b4;

  @prop({ type: Form1Page3b5 })
  public form1page3b5?: Form1Page3b5;
}
