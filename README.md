# graphql-express-demo
A Node JS/ Express JS GraphQL application to understand the basics of GraphQL, like : query, mutation, query-selector, types etc.

Steps to run the application:

1. Install the packages with command : npm install

2. Run the application with specified port number : 8081

3. firstGraphQL javascript file is the basic file where we can understand to run the application with express-js and graphql settings. 

4. server.js file is having complete code, where we are having three entities: books, authors and publishers.

5. We are querying and mutating the data within this small application.

6. Run the application on url : http://localhost:8081/graphql

7. Query the entities as below:
	
{
	books {
	name
	  author {
	  name
	  }
	publisher {
	  name
	  }
	}
}

8. Mutatae the data with below query example:

mutation {
  addBook (name: "let me test", authorId : 2, publisherId :3) {
		name: name
    authorId: authorId
    publisherId:publisherId
	}
}