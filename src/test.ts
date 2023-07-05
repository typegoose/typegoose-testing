// NodeJS: 20.2.0
// MongoDB: 5.0 (Docker)
// Typescript 4.9.5
import { getModelForClass, isDocument, prop, Ref } from '@typegoose/typegoose'; // @typegoose/typegoose@11.3.0
import { isNullOrUndefined } from '@typegoose/typegoose/lib/internal/utils';
import * as mongoose from 'mongoose'; // mongoose@7.3.1

class User {
  @prop()
  public name?: string;
}

type UserInfo = Pick<User, keyof User>;

class Category {
  @prop({ required: true })
  name!: string;

  @prop({ ref: () => User, required: true })
  manager!: Ref<User>;
}

const CategoryModel = getModelForClass(Category);

interface CategoryDetail {
  name: string;
  manager: UserInfo;
}

async function getCategoryDetail(categoryId: string): Promise<CategoryDetail> {
  const category = await CategoryModel.findById(categoryId).select('-subscribers').populate('manager');

  if (isNullOrUndefined(category)) {
    throw new Error('Category does not exist');
  }

  // typescript error: Type 'ObjectId' has no properties in common with type 'UserInfo'
  // as expected
  const t1: UserInfo = category.manager;

  if (!isDocument(category.manager)) {
    throw new Error('Unable to populate category manager');
  }

  // no typescript error
  // as expected
  const t2: UserInfo = category.manager;

  // typescript error: "Type 'ObjectId' has no properties in common with type 'UserInfo'."
  // not as expected
  const t3: CategoryDetail = category;

  return category.toObject();
}
