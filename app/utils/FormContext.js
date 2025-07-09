// FormContext.js
import { createContext, useState } from 'react';

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    firstname: '',
    lastname: '',
    address: '',
    nic: '',
    birthDate: '',
    licenseId: '',
    licenceExpiry: '',
    licenseFront: '',
    licenseBack: '',
  });

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};
