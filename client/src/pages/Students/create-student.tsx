import { useGetIdentity } from "@pankod/refine-core";
import { FieldValues, useForm } from "@pankod/refine-react-hook-form";
import { Helmet } from "react-helmet";

import FormStudent from "components/common/FormStudent";

const CreateStudent = () => {
  const { data: user } = useGetIdentity();
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
  } = useForm();

  const onFinishHandler = async (data: FieldValues) => {
    await onFinish({ ...data, email: user?.email });
  };

  return (
    <div>
      <Helmet>
        <title>Create Student</title>
      </Helmet>
      <FormStudent
        type="Create"
        register={register}
        onFinish={onFinish}
        formLoading={formLoading}
        handleSubmit={handleSubmit}
        onFinishHandler={onFinishHandler}
      />
    </div>
  );
};
export default CreateStudent;
