import { FieldValues, useForm } from "@pankod/refine-react-hook-form";
import { Helmet } from "react-helmet";

import FormEarning from "components/common/FormEarning";

const CreateEarnings = () => {
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
  } = useForm();
  const onFinishHandler = async (data: FieldValues) => {
    await onFinish(data);
  };
  return (
    <div>
      <Helmet>
        <title>Create an Earning</title>
      </Helmet>
      <FormEarning
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

export default CreateEarnings;
