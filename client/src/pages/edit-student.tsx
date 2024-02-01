import { useGetIdentity } from '@pankod/refine-core';
import { FieldValues, useForm } from '@pankod/refine-react-hook-form';

import FormStudent from 'components/common/FormStudent';

const CreateStudent = () => {
  const { data: user } = useGetIdentity();
  const { refineCore: { onFinish, formLoading }, register, handleSubmit } = useForm();
  
  const onFinishHandler = async (data: FieldValues) => {
    
    await onFinish({ ...data, email: user?.email })
  };

  return (
    <FormStudent 
      type="Edit"
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      onFinishHandler={onFinishHandler}
    />
  )
}
export default CreateStudent;