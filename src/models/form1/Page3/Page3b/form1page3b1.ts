import { prop } from '@typegoose/typegoose';

const options = ['Yes', 'No', "Don't Know"];

export default class Form1Page3b1 {
  @prop({ type: Boolean, required: true })
  public isComplete!: boolean;

  @prop({ type: String, enum: options })
  public areTherePreviousConclusionReportsOnThisReaction?: string;

  @prop({ type: String, enum: options })
  public didTheAdverseEventAppearAfterTheSuspectDrugWasAdministered?: string;

  @prop({ type: String, enum: options })
  public didTheARImproveWhenTheDrugWasDiscontinuedOrASpecificAntagonistWasAdministered?: string;

  @prop({ type: String, enum: options })
  public didTheARReappearWhenDrugWasReadministered?: string;

  @prop({ type: String, enum: options })
  public areThereAlternateCausesThatCouldSolelyHaveCausedTheReaction?: string;

  @prop({ type: String, enum: options })
  public didTheReactionReappearWhenAPlaceboWasGiven?: string;

  @prop({ type: String, enum: options })
  public wasTheDrugDetectedInTheBloodInAConcentrationKnownToBeToxic?: string;

  @prop({ type: String, enum: options })
  public wasTheReactionMoreSevereWhenTheDoseWasIncreasedOrLessSevereWhenTheDoseWasDecreased?: string;

  @prop({ type: String, enum: options })
  public didThePatientHaveASimilarReactionToTheSameOrSimilarDrugsInAnyPreviousExposure?: string;

  @prop({ type: String, enum: options })
  public wasTheAdverseEventConfirmedByObjectiveEvidence?: string;
}
