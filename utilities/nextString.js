const heapsPermute = require('heaps-permute');

function  nextCombination(str) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const length = characters.length;

  // Convert the input string to an array of characters
  let arr = str.split('');

  // Find the rightmost character that can be incremented
  let i = arr.length - 1;
  while (i >= 0 && characters.indexOf(arr[i]) === length - 1) {
    i--;
  }

  // If no such character is found, the combination is the last one
  if (i === -1) {
    return null;
  }

  // Increment the character at position i
  arr[i] = characters[characters.indexOf(arr[i]) + 1];

  // Reset characters to the right of i to the smallest values
  for (let j = i + 1; j < arr.length; j++) {
    arr[j] = characters[0];
  }

  return arr.join('');
}
module.exports=nextCombination;