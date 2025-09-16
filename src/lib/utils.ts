import { format } from 'date-fns';

export function formattedDate(dateTime: string){
  const dateObject = new Date(dateTime);
  const formattedString = format(dateObject, 'MMM dd, yyyy');
  return formattedString;
};

export function formattedTime(dateTime: string){
      const dateObject = new Date(dateTime);
      const formattedString = format(dateObject, 'HH:mm');
      return formattedString;
};