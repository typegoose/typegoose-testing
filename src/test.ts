// NodeJS: 18.10.0
// MongoDB: 5.0 (Docker)
// Typescript 4.8.4
import { getModelForClass, Prop, prop, PropType, Ref } from '@typegoose/typegoose'; // @typegoose/typegoose@9.13.0
import * as mongoose from 'mongoose'; // mongoose@6.7.3

class User {
  @Prop()
  name?: string;
}

class Exam {
  @Prop()
  name?: string;

  @Prop({ ref: () => Exam }, PropType.ARRAY)
  examReq?: Ref<Exam>[];
}

class UserExam {
  @Prop({ ref: () => User })
  userId: Ref<User>;

  @Prop({ ref: () => Exam })
  examId: Ref<Exam>;
}

const UserModel = getModelForClass(User);
const ExamModel = getModelForClass(Exam);
const UserExamModel = getModelForClass(UserExam);

(async () => {
  await mongoose.connect(`mongodb://localhost:27017/`, {
    dbName: 'verifyMASTER',
  });

  const baseExam = await ExamModel.create({ name: 'base' });
  const refExam = await ExamModel.create({ name: 'ref', examReq: baseExam });
  const user = await UserModel.create({ name: 'user' });
  const userExam = await UserExamModel.create({ userId: user, examId: refExam });

  mongoose.set('debug', true);
  const found = await UserExamModel.findById(userExam).populate(/* ('examId.examReq') */ { path: 'examId', populate: { path: 'examReq' } });

  console.log('found', found);

  await mongoose.disconnect();
})();
