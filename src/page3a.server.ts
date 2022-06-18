import Forms1Model from './models/form1.model';

const addToForm = async (user: string, formID: string, formInput: any) => {
  try {
    console.log(user, formID, formInput);
    const form1Pointer = await Forms1Model.findOne({ user: user, _id: formID });

    if (form1Pointer) {
      if (!form1Pointer.form1Page3) {
        // creating empty object is Page3 does not exist
        form1Pointer.form1Page3 = {};
      }
      if (!form1Pointer.form1Page3.Form1Page3a) {
        // creating empty object is Page3a does not exist
        form1Pointer.form1Page3.Form1Page3a = {};
      }

      form1Pointer.form1Page3.Form1Page3a = { isComplete: true, drugDetails: formInput.drugDetails };
      console.log('Forms1Model.form1Page3.Form1Page3a', Forms1Model.schema.path('form1Page3.Form1Page3a'));

      await form1Pointer
        .save()
        .then(() => {
          console.log('Form 1 page 3 updated');
        })
        .catch((error) => {
          console.log(error);
        });

      console.log('finished', form1Pointer);

      return 'Form 1 Page 3a modified successfully';
    }

    return 'Form 1 does not exist';
  } catch (error) {
    console.log('error addToForm');
    console.log(error);

    return error;
  }
};

async function getForm(user: string, formID: string) {
  try {
    const form1Pointer = await Forms1Model.findOne({ user: user, _id: formID });

    if (form1Pointer) {
      const data = form1Pointer.form1Page3;

      return data?.Form1Page3a?.drugDetails;
    }

    return 'Form 1 Page 3a does not exist';
  } catch (error) {
    //
  }
}

export { addToForm, getForm };
