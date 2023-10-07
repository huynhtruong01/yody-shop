export interface IAddressIconProps {
   className?: string
}

export function AddressIcon({ className = '' }: IAddressIconProps) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width="20"
         height="20"
         viewBox="0 0 20 20"
         fill="none"
         className={`mdl-js ${className}`}
      >
         <path
            d="M9.8777 19.451L9.87769 19.451C9.74691 19.3127 8.07591 17.5314 6.44083 15.2064C5.62325 14.0439 4.82199 12.7557 4.22677 11.477C3.62843 10.1915 3.25635 8.95348 3.25635 7.88105C3.25635 4.38684 6.25731 1.5 9.99959 1.5C13.7418 1.5 16.7428 4.38683 16.7428 7.88105C16.7428 8.95348 16.3708 10.1915 15.7724 11.477C15.1772 12.7557 14.3759 14.0439 13.5584 15.2064C11.9233 17.5314 10.2523 19.3127 10.1215 19.451L10.1215 19.451C10.0938 19.4803 10.0511 19.5 9.9996 19.5C9.9482 19.5 9.90548 19.4804 9.8777 19.451ZM9.62538 18.763L9.9996 19.1853L10.3738 18.763C11.4757 17.5195 12.9791 15.6676 14.2105 13.711C15.4263 11.779 16.4384 9.65114 16.4385 7.88109C16.4385 4.4701 13.526 1.73916 9.99959 1.73916C6.47319 1.73916 3.56072 4.4701 3.56072 7.88113C3.56072 9.65111 4.573 11.7792 5.78891 13.7113C7.0203 15.6679 8.52379 17.5199 9.62538 18.763Z"
            fill="currentColor"
            stroke="currentColor"
         />
         <path
            d="M6.85547 7.88392C6.85547 6.27493 8.24191 4.92188 9.99968 4.92188C11.7574 4.92188 13.1439 6.27493 13.1439 7.88392C13.1439 9.49292 11.7574 10.846 9.99968 10.846C8.24194 10.846 6.85547 9.49291 6.85547 7.88392ZM7.15984 7.88392C7.15984 9.40963 8.45777 10.6068 9.99968 10.6068C11.5415 10.6068 12.8395 9.40964 12.8395 7.88392C12.8395 6.35821 11.5415 5.16103 9.99968 5.16103C8.45781 5.16103 7.15984 6.35821 7.15984 7.88392Z"
            fill="currentColor"
            stroke="currentColor"
         />
      </svg>
   )
}