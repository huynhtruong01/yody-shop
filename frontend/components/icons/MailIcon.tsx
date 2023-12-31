import * as React from 'react'

export interface IMailIconProps {
   className?: string
}

export function MailIcon({ className = '' }: IMailIconProps) {
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
            <path d="M18.606 16.0813L24 19.4913V12.5273L18.606 16.0813Z" fill="white" />
            <path d="M8 12.5273V19.4913L13.394 16.0813L8 12.5273Z" fill="white" />
            <path
               d="M23.0003 10.5H9.00027C8.50127 10.5 8.10527 10.872 8.03027 11.351L16.0003 16.602L23.9703 11.351C23.8953 10.872 23.4993 10.5 23.0003 10.5Z"
               fill="white"
            />
            <path
               d="M17.6897 16.6861L16.2747 17.6181C16.1907 17.6731 16.0957 17.7001 15.9997 17.7001C15.9037 17.7001 15.8087 17.6731 15.7247 17.6181L14.3097 16.6851L8.03174 20.6561C8.10874 21.1311 8.50274 21.5001 8.99974 21.5001H22.9997C23.4967 21.5001 23.8907 21.1311 23.9677 20.6561L17.6897 16.6861Z"
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
