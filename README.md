# Functional TypeScript Notes

Here are my notes and learnings around writing functional code in typescript.

I mainly use the `@effect-ts` library as it a new library that offers very neat functions that address common issues that developers face. `@effect-ts` is aiming to be the successor to the other popular library `@fp-ts` which largely implements the same ideas and is partly implemented by the same people.

When going over the notes please check the type signatures as these will aid you in understanding how the data is being transformed.

Important: to read easily read the comments enable text soft wrap in your editor (option + z)

## Learning Resources

Here is a very nice talk about functional programming and the resulting architecture it leads to.

https://www.youtube.com/watch?v=US8QG9I1XW0

Since `@fp-ts` is so similar here is a good visual resource to begin understanding the base concepts:

https://www.youtube.com/watch?v=WsKEIFirdVc&list=PLUMXrUa_EuePN94nJ2hAui5nWDj8RO3lH

Here is the author of the library showcasing plenty of pain points and how to solve them with the effect-ts library

https://www.youtube.com/watch?v=zrNr3JVUc8I

Here is a blog entry about what some of those pattern equate to in the category theory world

https://www.adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html

## Running the code
while running the code for the notes is not too interesting here is how you would do it.

you may need to add console logs to the execution of some functions to see results or attach a debugger


```
npm install

npm run part1
```

Note: Running in interactive mode is not working for some reason
