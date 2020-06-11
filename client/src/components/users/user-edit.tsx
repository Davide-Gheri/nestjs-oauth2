import React from 'react';
import { UserDataFragment } from '../../generated/graphql';
import { UserForm } from './user-form';
import { useUserUpdateForm } from '../../hooks';

export const UserEdit: React.FC<{ user: UserDataFragment }> = ({ user }) => {
 const { onSubmit, loading, watch, errors, register, control } = useUserUpdateForm(user);

 return (
   <UserForm
     register={register}
     errors={errors}
     watch={watch}
     onSubmit={onSubmit}
     loading={loading}
     control={control}
   />
 )
}
