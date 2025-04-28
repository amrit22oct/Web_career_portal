export const formatDate = (dateString) => {
   const options = { year: 'numeric', month: 'long', day: 'numeric' };
   const date = new Date(dateString);
   return date.toLocaleDateString(undefined, options); 
   // Example output: "April 27, 2025"
 };
 