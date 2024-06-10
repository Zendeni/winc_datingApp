'use strict';
const inputPrompt = require("prompt-sync")();
const mockData = require('./mockData.js').data;

// Initialize an empty object to store profile data
const profile = {};

// Define an array of prompts and validation functions for each property
const prompts = [
  { prompt: "What is your first name? ", key: "first_name", validation: input => input.trim() !== "" },
  { prompt: "What is your last name? ", key: "last_name", validation: input => input.trim() !== "" },
  { prompt: "How old are you? ", key: "age", validation: input => !isNaN(input) && Number(input) >= 18 },
  { prompt: "What is your gender? (M/F/X) ", key: "gender", validation: input => ['M', 'F', 'X'].includes(input.toUpperCase()) },
  { prompt: "What gender are you interested in? (M/F/X)", key: "gender_interest", validation: input => ['M', 'F', 'X'].includes(input.toUpperCase()) },
  { prompt: "What is your location? (rural/city) ", key: "location", validation: input => ['rural', 'city'].includes(input.toLowerCase()) },
  { prompt: "What is the minimum age you are interested in? ", key: "min_age_interest", validation: input => !isNaN(input) && Number(input) >= 18 },
  { prompt: "What is the maximum age you are interested in? ", key: "max_age_interest", validation: input => !isNaN(input) && Number(input) >= 18 },
];

// Loop through each prompt and validate user input
for (const { prompt, key, validation } of prompts) {
  let input;
  do {
    input = inputPrompt(prompt);
    if (key === "age" && Number(input) < 18) {
      console.log("You must be at least 18 years old to use this service.");
    }
  } while (!validation(input) || (key === "age" && Number(input) < 18));

  if (key.includes("age")) {
    profile[key] = Number(input);
  } else {
    profile[key] = input.trim();
  }
}

// Ensure maximum age interest is greater than minimum age interest
while (profile.min_age_interest >= profile.max_age_interest) {
  profile.max_age_interest = Number(inputPrompt("Please enter a maximum age greater than the minimum age."));
}

// Initialize an array to store matches
const matches = [];

// Iterate over mock data to find matches
for (const person of mockData) {
  const ageMatch = profile.age >= person.min_age_interest && profile.age <= person.max_age_interest;
  const theirAgeMatch = person.age >= profile.min_age_interest && person.age <= profile.max_age_interest;
  const genderMatch = person.gender_interest === profile.gender;
  const theirGenderMatch = profile.gender_interest === person.gender;
  const locationMatch = person.location === profile.location;

  if (ageMatch && theirAgeMatch && genderMatch && theirGenderMatch && locationMatch) {
    matches.push(person);
  }
}

// Display matches
console.log(`You have ${matches.length} match(es).`);
matches.forEach(match => {
  console.log(`Name: ${match.first_name} ${match.last_name}, Age: ${match.age}, Location: ${match.location}`);
});

console.log("Profile Data:", profile);
