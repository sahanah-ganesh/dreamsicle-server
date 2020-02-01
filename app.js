const express = require("express")
const bodyParser = require("body-parser")
// take incoming requests make sure they go to correct resolver
// resolvers where you take request and create response
// where eventually fetch data from mongoDB and return
const graphqlHttp = require("express-graphql")
const {
  buildSchema
} = require("graphql")
const mongoose = require("mongoose")
const Dream = require("./models/dream")

const app = express()

app.use(bodyParser.json())

app.use("/graphql", graphqlHttp({
  schema: buildSchema(`
    type Dream {
      _id: ID!
      text: String!
      date: String
    }

    input DreamInput {
      text: String!
      date: String
    }

    type dreamQuery {
      dreams: [Dream!]!
    }

    type dreamMutation {
      createDream(dreamInput: DreamInput): Dream
    }

    schema {
      query: dreamQuery
      mutation: dreamMutation
    }
  `),
  rootValue: {
    dreams: () => {
      // return all blogs unfiltered using Model
      return Dream.find().then(dreams => {
        return dreams
      }).catch(err => {
        throw err
      })
    },
    createDream: (args) => {
      const dream = new Dream({
        text: args.dreamInput.text,
        date: new Date()
      })

      // save new dream using model which saves in MongoDB
      return dream.save().then(result => {
        console.log(result)
        return result
      }).catch(err => {
        console.log(err)
        throw err
      })
    }
  },
  graphiql: true
}))

mongoose.connect(`mongodb+srv://test:testing123@cluster0-mlkex.gcp.mongodb.net/test?retryWrites=true&w=majority
`).then(() => {
  app.listen(5000)
}).catch(err => {
  console.log(err)
})