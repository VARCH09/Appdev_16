let numbers = [];
numbers.push(10);
numbers.push(20);
numbers.push(30);
console.log("After Create:", numbers);
console.log("Read elements:");
numbers.forEach((num, index) => {
console.log(`Index ${index}: ${num}`);
});
numbers[1] = 25;
console.log("After Update:", numbers);
numbers.splice(0, 1);
console.log("After Delete:", numbers);