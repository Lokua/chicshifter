/* eslint-disable */

const author = {
  firstName: String,
  lastName: String
}

const image = {
  src: String,
  title: String,
  caption: String,
  credits: [{
    type: String,
    author: author,
  }]
}
