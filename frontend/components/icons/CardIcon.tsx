export interface ICardIconProps {
   className?: string
}

export function CardIcon({ className = '' }: ICardIconProps) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width="36"
         height="36"
         viewBox="0 0 36 36"
         fill="none"
         className={`mdl-js ${className}`}
      >
         <path
            d="M27.06 20.325C26.43 20.94 26.07 21.825 26.16 22.77C26.295 24.39 27.78 25.575 29.4 25.575H32.25V27.36C32.25 30.465 29.715 33 26.61 33H11.445C11.91 32.61 12.315 32.13 12.63 31.59C13.185 30.69 13.5 29.625 13.5 28.5C13.5 25.185 10.815 22.5 7.5 22.5C6.09 22.5 4.785 22.995 3.75 23.82V17.265C3.75 14.16 6.28499 11.625 9.38999 11.625H26.61C29.715 11.625 32.25 14.16 32.25 17.265V19.425H29.22C28.38 19.425 27.615 19.755 27.06 20.325Z"
            stroke="#292D32"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M3.75 18.615V11.76C3.75 9.97503 4.84499 8.38497 6.50999 7.75497L18.42 3.25497C20.28 2.54997 22.275 3.93001 22.275 5.92501V11.625"
            stroke="#292D32"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M33.8382 20.9557V24.0458C33.8382 24.8708 33.1782 25.5457 32.3382 25.5757H29.3982C27.7782 25.5757 26.2932 24.3908 26.1582 22.7708C26.0682 21.8258 26.4282 20.9407 27.0582 20.3257C27.6132 19.7557 28.3782 19.4258 29.2182 19.4258H32.3382C33.1782 19.4558 33.8382 20.1307 33.8382 20.9557Z"
            fill="#FCAF17"
            stroke="#292D32"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M10.5 18H21"
            stroke="#292D32"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M13.5 28.5C13.5 29.625 13.185 30.69 12.63 31.59C12.315 32.13 11.91 32.61 11.445 33C10.395 33.945 9.015 34.5 7.5 34.5C5.31 34.5 3.405 33.33 2.37 31.59C1.815 30.69 1.5 29.625 1.5 28.5C1.5 26.61 2.37 24.915 3.75 23.82C4.785 22.995 6.09 22.5 7.5 22.5C10.815 22.5 13.5 25.185 13.5 28.5Z"
            fill="#FCAF17"
            stroke="#292D32"
            strokeWidth="1.8"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M5.16211 28.4993L6.64709 29.9843L9.8421 27.0293"
            stroke="#292D32"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   )
}
