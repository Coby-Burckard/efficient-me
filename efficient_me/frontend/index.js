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
  logInOutButton.addEventListener('click', showLogIn)

  //updating the body
  const parentSection = document.querySelector('.body-block-1')
  while (parentSection.firstChild) {parentSection.removeChild(parentSection.firstChild)}
  const homeInnerHtml = '<h2 class="body-block-header">Become Efficient</h2><p class="description">Start your journey to 10,000 hours with <span>Efficient Me</span></p><p class="get-started-button"><a href="userPage">Get Started!</a></p>'
  parentSection.innerHTML = homeInnerHtml
}

//log in form display functionality
function showLogIn() {
  logInForm = document.querySelector('.log-in-form-body')
  logInForm.classList.remove('lgf-hidden')
}

async function updatePagetoUser(token){
  //updates index.html to the user page
  this.console.log('updating page to user')

  //hiding create and log in
  lgf = document.querySelector('.log-in-form-body')
  lgf.classList.add('lgf-hidden')
  cuf = document.querySelector('.create-form-body')
  cuf.classList.add('create-hidden')

  //updating the login/logout button
  const logInOutButton = document.querySelector('.log-in-or-out')
  logInOutButton.classList.remove('log-in-sign-up')
  logInOutButton.classList.add('log-out')
  logInOutButton.innerText = 'log out'

  //setting correct log-out event listeners
  logInOutButton.removeEventListener('click', showLogIn)
  logInOutButton.addEventListener('click', deleteToken)

  //updating the body
  const parentSection = document.querySelector('.body-block-1')
  while (parentSection.firstChild) {parentSection.removeChild(parentSection.firstChild)}
  const userInfo = await fetchUserData(token)
  parentSection.appendChild(userInfo)
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
  const activityResponse = await fetch('http://127.0.0.1:8000/api/activities/', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
  })
  const goalResponse = await fetch('http://127.0.0.1:8000/api/goals/', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
  })
  const TAResponse = await fetch('http://127.0.0.1:8000/api/timeallocations/', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
  })
  const activities = await activityResponse.json()
  const goals = await goalResponse.json()
  const timeallocations = await TAResponse.json()

  console.log(activities, goals, timeallocations)

  //building the html structure for activities - goals - time allocations
  const parentList = document.createElement('ol')
  parentList.classList.add('activity-list')
  
  // (this is going to be soooo inefficient **fix on back end later)
  activities.forEach(activity => {
    const activityLI = document.createElement('li')
    const goalsOL = document.createElement('ol')
    activityLI.innerText = activity.title
    activityLI.classList.add('activity')
    goalsOL.classList.add('goal-list')
    activityLI.appendChild(goalsOL)
    parentList.appendChild(activityLI)

    //adding goals the respective activities
    let activityID = activity.id 
    goals.forEach(goal => {
      if (goal.activity == activityID) {
        const goalLI = document.createElement('li')
        const TAOL = document.createElement('ol')
        goalLI.innerText = goal.title
        goalLI.classList.add('goal')
        TAOL.classList.add('time-allocation-list')
        goalLI.appendChild(TAOL)
        goalsOL.appendChild(goalLI)

        // adding time allocations to the respective goals
        let goalID = goal.id
        timeallocations.forEach(timeAll => {
          if (timeAll.goal == goalID){
            const TALI = document.createElement('li')
            TALI.innerText = timeAll.title
            TALI.classList.add('time-allocation')
            TAOL.appendChild(TALI)
          }
        })
      }
    })
 });
  return parentList
}




// login and log out handeling
function manageLogIn(event){
  event.preventDefault()
  userName = document.getElementById('username').value
  password = document.getElementById('password').value
  logInForm = document.querySelector('.log-in-form-body')
  getAndCacheToken(userName, password)
}

function manageCreateUser() {

  //removing log in form
  logInForm = document.querySelector('.log-in-form-body')
  logInForm.classList.add('lgf-hidden')

  //adding create user form
  createUserForm = document.querySelector('.create-form-body')
  createUserForm.classList.remove('create-hidden')
}

async function createUser(event){
  event.preventDefault()

  name = JSON.stringify(document.getElementById('create-name').value).split(' ')
  firstName = name[0]
  lastName = (name[1]) ? name[1]: ''
  userName = document.getElementById('create-username').value
  password = document.getElementById('create-password').value

  const response = await fetch('http://127.0.0.1:8000/api/createUser/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      first_name: `${firstName}`,
      last_name: `${lastName}`,
      username: `${userName}`,
      password: `${password}`,
  })})
  
  getAndCacheToken(userName, password)
}

async function getAndCacheToken (userName, password) {
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
      username: `${userName}`,
      password: `${password}`,
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






//Onload handeling
window.onload = function () {
  this.console.log('loaded page')
  
  //setting event listeners
  lgsb = document.querySelector('.log-in-submit-button')
  lgsb.addEventListener('click', manageLogIn)
  ceb = document.querySelector('.create-account-button')
  ceb.addEventListener('click', manageCreateUser)
  csb = document.querySelector('.create-submit-button')
  csb.addEventListener('click', createUser)

  setHTMLOnPageLoad()
}