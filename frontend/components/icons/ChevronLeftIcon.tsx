export interface IChevronLeftIconProps {
   className?: string
}

export function ChevronLeftIcon({ className = '' }: IChevronLeftIconProps) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
         strokeWidth={2}
         stroke="currentColor"
         className={`w-6 h-6 ${className}`}
      >
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
         />
      </svg>
   )
}
