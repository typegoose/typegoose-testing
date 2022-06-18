import { prop } from '@typegoose/typegoose';

const options = [
  'Congenital-anomaly',
  'Life Threatening',
  'Hospitalized/Prolonged',
  'Disability',
  'Required intervention to Prevent permanent impairment/damage',
  'Death',
  'Other (Mention below)',
];
const options2 = ['Recovered', 'Recovering', 'Not recovered', 'Fatal', 'Recovered with sequelae', 'Unknown'];

export default class Form1Page3e {
  @prop({ type: Boolean, required: true })
  public isComplete!: boolean;

  @prop({ type: Boolean })
  public applicability?: boolean;

  @prop({ type: String })
  public AMCReportNumber?: string;

  @prop({ type: String })
  public worldwideUniqueNumber?: string;

  @prop({ type: String })
  public relevantTestData?: string;

  @prop({ type: String })
  public relevantMedicalHistory?: string;

  @prop({ type: Boolean })
  public seriousReaction?: boolean;

  @prop({ type: String, enum: options })
  public seriousLevel?: string[];

  @prop({ type: Date })
  public dateOfDeath?: Date;

  @prop({ type: String })
  public otherDetails?: string;

  @prop({ type: String, enum: options2 })
  public outcome?: string;
}
