import React, { useCallback } from 'react';
import { useUserNewForm } from '../../hooks';
import { UserForm } from './user-form';

export const UserNew: React.FC<{ onSubmit?: () => void }> = ({ onSubmit: onParentSubmit }) => {
  const { onSubmit, register, errors, watch, loading, control } = useUserNewForm();

  const onFormSubmit = useCallback(async (e: React.FormEvent) => {
    await onSubmit(e);
    if (onParentSubmit) {
      onParentSubmit();
    }
  }, [onSubmit, onParentSubmit]);

  return (
    <UserForm
      register={register}
      errors={errors}
      watch={watch}
      onSubmit={onFormSubmit}
      loading={loading}
      control={control}
      withPassword
    />
  )
}
