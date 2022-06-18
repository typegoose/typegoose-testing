import { prop } from '@typegoose/typegoose';

const options = ['Yes', 'No'];
const options2 = ['Definitely Preventable', 'Probably Preventable', 'Not Preventable'];

export default class Form1Page3b4 {
  @prop({ type: Boolean, required: true })
  public isComplete!: boolean;

  @prop({ type: String, enum: options })
  public wasThereAHistoryOfAllergyOrPreviousReactionsToTheDrug?: string;

  @prop({ type: String, enum: options })
  public wasTheDrugInvolvedInappropriateForThePatientSClinicalCondition?: string;

  @prop({ type: String, enum: options })
  public wasTheDoseRouteOrFrequencyOfAdministrationInappropriateForThePatientSAgeWeightOrDiseaseState?: string;

  @prop({ type: String, enum: options })
  public wasAToxicSerumDrugConcentrationOrLaboratoryMonitoringTestDocumented?: string;

  @prop({ type: String, enum: options })
  public wasThereAKnownTreatmentForTheAdverseDrugReaction?: string;

  @prop({ type: String, enum: options })
  public wasRequiredTherapeuticDrugMonitoringOrOtherNecessaryLabTestsNotPerformed?: string;

  @prop({ type: String, enum: options })
  public wasADrugInteractionInvolvedInTheAdr?: string;

  @prop({ type: String, enum: options2 })
  public finalResult?: string;
}
