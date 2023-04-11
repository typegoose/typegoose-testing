// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'; // @typegoose/typegoose@11.0.0
import * as mongoose from 'mongoose'; // mongoose@7.0.3
import { Schema, Types } from 'mongoose';

export enum AlertMessageType {
  primary = 'primary',
  info = 'info',
  danger = 'danger',
  warning = 'warning',
}

export enum ContentType {
  htmlBlock = 'html-block',
  header = 'header',
  codeBlock = 'code-block',
  alertMessage = 'alert-message',
}

@modelOptions({
  schemaOptions: {
    discriminatorKey: 'type',
    _id: false,
    id: false,
  },
})
export class PageSectionContent {
  @prop({ required: true, type: Schema.Types.ObjectId })
  public _id!: Types.ObjectId;

  @prop({ type: Schema.Types.String, required: true })
  public type!: ContentType;

  @prop({ type: Schema.Types.Boolean, required: true, default: true })
  public isActive!: boolean;
}

export class AlertMessageContent extends PageSectionContent {
  @prop({ type: String, required: false })
  public iconPath?: string;

  @prop({ type: String, required: true })
  public alertType!: AlertMessageType;

  @prop({ type: String, required: false })
  public title?: string;

  @prop({ type: String, required: true })
  public message!: string;
}

export class HtmlBlockContent extends PageSectionContent {
  @prop({ type: String, required: false })
  public title?: string;

  @prop({ required: true, type: String })
  public content!: string;
}

export class CodeBlockContent extends PageSectionContent {
  @prop({ required: true, type: String })
  public code!: string;
}

export class HeaderContent extends PageSectionContent {
  @prop({ type: String, required: true })
  public title?: string;
}

export class PageSection {
  @prop({ required: true, type: String })
  public title!: string;

  // @prop({ required: true, ref: () => Page })
  // public page!: Ref<Page>;

  // @prop({ required: false, ref: () => SubPage })
  // public subPage?: Ref<SubPage>;

  @prop({
    required: true,
    type: PageSectionContent,
    discriminators: () => [
      {
        type: HtmlBlockContent,
        value: ContentType.htmlBlock,
      },
      {
        type: HeaderContent,
        value: ContentType.header,
      },
      {
        type: CodeBlockContent,
        value: ContentType.codeBlock,
      },
      {
        type: AlertMessageContent,
        value: ContentType.alertMessage,
      },
    ],
    default: [],
  })
  public contents!: PageSectionContent[];

  @prop({ type: Boolean, required: true, default: true })
  public isActive!: boolean;
}

export const PageSectionModel = getModelForClass(PageSection);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const data = {
    title: 'Eaque magnam illo consequatur laboriosam vel natus minima deserunt.',
    contents: [
      {
        _id: new Types.ObjectId('6434984567b1da87aab5f10d'),
        type: 'header',
        title: 'Aliquid asperiores incidunt eligendi.',
        isActive: false,
      },
    ],
    isActive: false,
    page: new Types.ObjectId('6434984567b1da87aab5f106'),
  };

  const res = await PageSectionModel.create(data);

  console.log(res);

  await mongoose.disconnect();
})();
