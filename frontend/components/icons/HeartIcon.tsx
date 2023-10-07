export interface IHeartIconProps {
   className?: string
   strokeWidth?: number
   fill?: string
}

export function HeartIcon({
   className = '',
   strokeWidth = 1.5,
   fill = 'none',
}: IHeartIconProps) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width="20"
         height="20"
         viewBox="0 0 20 20"
         fill={fill}
         className={`mdl-js ${className}`}
      >
         <path
            d="M2.5 10.0008C0.625 7.50083 1.25 3.75083 4.375 2.50083C7.5 1.25083 9.375 3.75083 10 5.00083C10.625 3.75083 13.125 1.25083 16.25 2.50083C19.375 3.75083 19.375 7.50083 17.5 10.0008C15.625 12.5008 10 17.5008 10 17.5008C10 17.5008 4.375 12.5008 2.5 10.0008Z"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   )
}
