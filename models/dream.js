const mongoose = require("mongoose")

const Schema = mongoose.Schema

const dreamSchema = new Schema({

  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model("Dream", dreamSchema)