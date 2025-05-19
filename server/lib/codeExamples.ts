import { Language } from "@/types";

// Define example code files with language-specific samples
export const examples = [
  {
    id: "js-hello-world",
    name: "Hello World.js",
    language: "javascript" as Language,
    content: `// Welcome to CodeLearn!
// This is a simple JavaScript example

function greet(name) {
  return "Hello, " + name + "!";
}

// Try calling the function
console.log(greet("Learner"));

// Let's do a simple calculation
let sum = 0;
for (let i = 1; i <= 10; i++) {
  sum += i;
}

console.log("The sum of numbers from 1 to 10 is: " + sum);

// Try changing this code and clicking 'Run'!`
  },
  {
    id: "js-calculator",
    name: "Simple Calculator.js",
    language: "javascript" as Language,
    content: `// Simple Calculator in JavaScript

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Error: Division by zero!";
  }
  return a / b;
}

// Let's test our calculator
console.log("Addition: 5 + 3 =", add(5, 3));
console.log("Subtraction: 10 - 4 =", subtract(10, 4));
console.log("Multiplication: 6 * 7 =", multiply(6, 7));
console.log("Division: 15 / 3 =", divide(15, 3));
console.log("Division by zero:", divide(8, 0));`
  },
  {
    id: "py-guessing",
    name: "Number Guessing.py",
    language: "python" as Language,
    content: `# Number Guessing Game in Python
import random

# Generate a random number between 1 and 100
secret_number = random.randint(1, 100)
attempts = 0
max_attempts = 7

print("Welcome to the Number Guessing Game!")
print(f"I'm thinking of a number between 1 and 100. You have {max_attempts} attempts.")

# In a real game, this would be a loop with user input
# For this example, let's simulate a few guesses
guesses = [50, 75, 60, 65, 63]

for guess in guesses:
    attempts += 1
    
    print(f"Attempt {attempts}: You guessed {guess}")
    
    if guess < secret_number:
        print("Too low! Try a higher number.")
    elif guess > secret_number:
        print("Too high! Try a lower number.")
    else:
        print(f"Congratulations! You've guessed the number {secret_number} in {attempts} attempts!")
        break
        
    if attempts >= max_attempts:
        print(f"Game over! You've used all {max_attempts} attempts.")
        print(f"The secret number was {secret_number}.")
        break

print("Thanks for playing!")
`
  },
  {
    id: "java-loop",
    name: "Simple Loop.java",
    language: "java" as Language,
    content: `// Simple Java program with a loop

public class SimpleLoop {
    public static void main(String[] args) {
        System.out.println("Counting from 1 to 5:");
        
        for (int i = 1; i <= 5; i++) {
            System.out.println("Number: " + i);
        }
        
        System.out.println("Loop finished!");
        
        // Let's calculate the factorial of 5
        int factorial = 1;
        for (int i = 1; i <= 5; i++) {
            factorial *= i;
        }
        
        System.out.println("Factorial of 5 is: " + factorial);
    }
}`
  }
];