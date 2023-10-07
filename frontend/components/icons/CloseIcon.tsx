export interface ICloseIconProps {
   className?: string
}

export function CloseIcon({ className = '' }: ICloseIconProps) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
         strokeWidth={2}
         stroke="currentColor"
         className={`w-6 h-6 ${className}`}
      >
         <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
   )
}
