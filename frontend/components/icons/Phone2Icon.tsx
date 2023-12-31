export interface IPhone2IconProps {
   className?: string
}

export function Phone2Icon({ className = '' }: IPhone2IconProps) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width="32"
         height="32"
         viewBox="0 0 32 32"
         fill="none"
         className={`w-6 h-6 ${className}`}
      >
         <circle
            cx="16"
            cy="16"
            r="15.625"
            fill="currentColor"
            stroke="white"
            strokeWidth="0.75"
         />
         <g clipPath="url(#clip0)">
            <path
               d="M23.6894 20.7226L21.9156 19.54L20.3388 18.4889C20.0345 18.2865 19.6255 18.3528 19.4008 18.6412L18.4251 19.8955C18.2155 20.1677 17.8385 20.246 17.538 20.0795C16.8759 19.7113 16.093 19.3645 14.3656 17.6349C12.6382 15.9053 12.2892 15.1246 11.9209 14.4625C11.7545 14.162 11.8327 13.7849 12.1049 13.5754L13.3593 12.5997C13.6476 12.375 13.714 11.9661 13.5115 11.6617L12.4928 10.1335L11.2779 8.31112C11.0711 8.00094 10.6572 7.90781 10.3375 8.09953L8.9364 8.94008C8.55775 9.16317 8.27941 9.52342 8.15903 9.94613C7.77588 11.3431 7.69863 14.4247 12.6373 19.3634C17.576 24.3021 20.6574 24.2246 22.0543 23.8414C22.477 23.7211 22.8373 23.4427 23.0604 23.064L23.9009 21.663C24.0927 21.3433 23.9995 20.9293 23.6894 20.7226Z"
               fill="white"
            />
         </g>
         <defs>
            <clipPath id="clip0">
               <rect width="16" height="16" fill="white" transform="translate(8 8)" />
            </clipPath>
         </defs>
      </svg>
   )
}
