// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.4
import { getModelForClass, prop } from '@typegoose/typegoose'; // @typegoose/typegoose@10.0.0
import * as mongoose from 'mongoose'; // mongoose@6.8.0

mongoose.set('strictQuery', true); // deprecation warning since 6.8.0

// was not provided, so it is just a example of what could be inferred
enum FormWorkflowTaskContentType {
  TEXT_FORM_FIELD = 'text',
  NUMBER_FORM_FIELD = 'number',
}

// was not provided, so it is just a example of what could be inferred
enum WorkflowTaskType {
  test = '0',
}

class FormContent {
  @prop({ required: false, type: String })
  public label?: string;

  @prop({ required: false, type: String })
  public message?: string;

  @prop({ required: false, type: String })
  public description?: string;

  @prop({ required: true, type: String })
  public type!: FormWorkflowTaskContentType;
}

class TextFormFieldContent extends FormContent {
  @prop({ required: false, type: String })
  public defaultValue?: string;
}

// was unused
// class EmailFormFieldContent extends FormContent {
//   @prop({ required: false, type: String })
//   public defaultValue?: string;
// }

class NumberFormFieldContent extends FormContent {
  @prop({ required: false, type: String })
  public defaultValue?: string;
}

// was unused
// class MultiSelectFieldContent extends FormContent {
//   @prop({ required: false, type: String, default: [] })
//   public defaultValue?: string[];
// }

class WorkflowTask {
  @prop({ required: false, type: String })
  public title?: string;

  @prop({ required: false, type: String })
  public description?: string;

  @prop({ required: true, type: String })
  public type!: WorkflowTaskType;

  @prop({
    required: true,
    type: FormContent,
    discriminators: () => [
      {
        type: TextFormFieldContent,
        value: FormWorkflowTaskContentType.TEXT_FORM_FIELD,
      },
      {
        type: NumberFormFieldContent,
        value: FormWorkflowTaskContentType.NUMBER_FORM_FIELD,
      },
    ],
    default: [],
  })
  public formContents!: FormContent[];
}

class Workflow {
  @prop({ required: true, type: Date, default: new Date() })
  public createdAt!: Date;

  @prop({ required: true, type: () => [WorkflowTask] })
  public tasks!: WorkflowTask[];
}

const WorkflowModel = getModelForClass(Workflow);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const doc = await WorkflowModel.create({
    createdAt: new Date(),
    tasks: [],
  });

  console.log(doc);

  await mongoose.disconnect();
})();
