const express = require("express");
const graphqlHttp = require("express-graphql");
const schema = require("./graphql/schema/");
const resolvers = require("./graphql/resolvers/");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@react-graphql-rjtrh.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(4000, () =>
      console.log("Server is running on port 4000 \nConnected to DB...")
    );
  })
  .catch((err) => console.error(err.message));

/*
{
  _id: 1,
  title: "Organize code base",
  description: "Learn GraphQl",
  price: 40.50,
  date: "10/05/2020"
}
*/

app.use(
  "/graphql",
  // ! - Non nullable
  // input - input is used to define input parameters list
  // for type
  graphqlHttp({
    schema,
    rootValue: resolvers,
    graphiql: true,
  })
);
