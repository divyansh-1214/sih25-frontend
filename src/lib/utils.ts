import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// interface PersonDetails {
//   name: string;
//   aadhar: string;
// }

// interface User {
//   name: string;
//   aadhar: string;
//   numberOfPersons: number;
//   personsDetails: PersonDetails[];
//   address: string;
//   garbagePickerReviewReference?: string;
//   phoneNumber: string;
//   password: string;
//   email: string;
// }