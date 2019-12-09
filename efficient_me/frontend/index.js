//Functions to modify page html based on user logged in vs. logged out status
function updatePageHome(){
  //updates index.html to the home page
  this.console.log('updating page to home')

  //updating the login/logout
  const logInOutButton = document.querySelector('.log-in-or-out')
  logInOutButton.classList.remove('log-out')
  logInOutButton.classList.add('log-in-sign-up')
  logInOutButton.innerText = 'log in/sign up'

  //setting correct log-in event listener
  logInOutButton.removeEventListener('click', deleteToken)
  logInOutButton.addEventListener('click', getAndCacheToken)

  //updating the body
  const parentSection = document.querySelector('.body-block-1')
  while (parentSection.firstChild) {parentSection.removeChild(parentSection.firstChild)}
  const homeInnerHtml = '<h2 class="body-block-header">Become Efficient</h2><p class="description">Start your journey to 10,000 hours with <span>Efficient Me</span></p><p class="get-started-button"><a href="userPage">Get Started!</a></p>'
  parentSection.innerHTML = homeInnerHtml
}

async function updatePagetoUser(token){
  //updates index.html to the user page
  this.console.log('updating page to user')

  //updating the login/logout button
  const logInOutButton = document.querySelector('.log-in-or-out')
  logInOutButton.classList.remove('log-in-sign-up')
  logInOutButton.classList.add('log-out')
  logInOutButton.innerText = 'log out'

  //setting correct log-out event listeners
  logInOutButton.removeEventListener('click', getAndCacheToken)
  logInOutButton.addEventListener('click', deleteToken)

  //updating the body
  const parentSection = document.querySelector('.body-block-1')
  while (parentSection.firstChild) {parentSection.removeChild(parentSection.firstChild)}
  const userActivities = await fetchUserData(token)
  const activitiesOL = document.createElement('ol')
  userActivities.forEach(element => {
    let activityLI = document.createElement('li')
    activityLI.innerText = element.title
    activitiesOL.appendChild(activityLI)
  });
  parentSection.appendChild(activitiesOL)
}

function setHTMLOnPageLoad(){
  //runs on page load to set index to the home page or user page
  this.console.log('running setHTMLOnPageLoad')
  const tokenArray = document.cookie.split(';').filter((item) => item.trim().startsWith('token='))
  
  //checks for the existence of the token cookie
  if (tokenArray.length) {
    const token = tokenArray[0].split('=')[1]
    this.console.log('Token exists')
    updatePagetoUser(token)
  }
  else {
    this.console.log('Token does not exist')
    updatePageHome()
  }
}




//Functions to fetch user data
async function fetchUserData(token) {
  const response = await fetch('http://127.0.0.1:8000/api/activities/', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
  })
  const activities = await response.json()
  console.log(activities)
  return await activities
}




// login and log out handeling
async function getAndCacheToken () {
  /*
    Call back function on click of the 'log in' button. The function
      1. submits a request to the api for a token with the user's credentials
      2. recieves and stores the token in a cookie
      3. calls the page update function with the user's token
  */
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
  updatePagetoUser(token.token)
}

function deleteToken() {
  /*
    deleteToken is a callback forwhen the log out button is clicked. The following actions are performed
      1. the cookie containing the user's token is delted
      2. calls the updatePageToIndex function
  */

  document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"

  updatePageHome()
}





window.onload = function () {
  this.console.log('loaded page')
  setHTMLOnPageLoad()
}