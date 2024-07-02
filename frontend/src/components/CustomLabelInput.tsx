import React from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { cn } from '../utils/cn'

interface labelInput {
  label: string,
  placeholder: string,
  type?: string,
  onChange: Function
}
const CustomLabelInput = ({label, placeholder, type="text", onChange} : labelInput) => {
  return (
    <LabelInputContainer>
    <Label htmlFor={placeholder}>{label}</Label>
    <Input className='z-50' onChange={(e)=>onChange(label,e)} id={placeholder} placeholder={placeholder} type={type} />
  </LabelInputContainer>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default CustomLabelInput