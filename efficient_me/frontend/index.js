/*
This shit works to post a request for a new user
fetch('http://127.0.0.1:8000/api/createUser/', {
  method: "POST",
  headers: {
      "Content-Type": "application/json"
  },
  body: JSON.stringify({
      username: "admin3",
      email: "admin3@admin3.com",
      password: "adminadmin",
  })
})
.then(res => res.json())
.then(console.log)
*/

// Get token
// fetch('http://127.0.0.1:8000/api/getToken/', {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     username: "admin",
//     password: "admin",
//   })})
//   .then(res => res.json())
//   .then(console.log)


// getting and caching token on login and deleting token on log out
async function getAndCacheToken () {
  const response = await fetch('http://127.0.0.1:8000/api/getToken/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: "admin",
      password: "admin",
    })})
  const token = await response.json()
  
  document.cookie = `token=${token.token}`
}

function deleteToken() {
  console.log('logging out')
  document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
}

window.onload = function () {
  const logInButton = document.querySelector('.log-in-sign-up')
  const logOutButton = document.querySelector('.log-out')

  logOutButton.addEventListener('click', deleteToken)
  logInButton.addEventListener('click', getAndCacheToken)
}



