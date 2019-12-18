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
  const homeBody = document.querySelector('.home-body')
  const userBody = document.querySelector('.user-body')
  userBody.classList.add('hidden')
  homeBody.classList.remove('hidden')

}

//log in form display functionality
function showLogIn() {
  logInForm = document.querySelector('.log-in-form-body')
  logInForm.classList.remove('hidden')
}

function hideParent() {
  this.parentNode.parentNode.parentNode.classList.add('hidden')
}





async function updatePagetoUser(token){
  //updates index.html to the user page
  this.console.log('updating page to user')

  //hiding create and log in
  lgf = document.querySelector('.log-in-form-body')
  lgf.classList.add('hidden')
  cuf = document.querySelector('.create-form-body')
  cuf.classList.add('hidden')

  //updating the login/logout button
  const logInOutButton = document.querySelector('.log-in-or-out')
  logInOutButton.classList.remove('log-in-sign-up')
  logInOutButton.classList.add('log-out')
  logInOutButton.innerText = 'log out'

  //setting correct log-out event listeners
  logInOutButton.removeEventListener('click', showLogIn)
  logInOutButton.addEventListener('click', deleteToken)

  //updating the body
  const homeBody = document.querySelector('.home-body')
  const userBody = document.querySelector('.user-body')
  fetchUserData(token).then( () => {
    homeBody.classList.add('hidden')
    userBody.classList.remove('hidden')  
  })
}

function buildTabs(activities){
  const tabBody = document.querySelector('.tab-body')
  while(tabBody.children.length > 1) {tabBody.removeChild(tabBody.lastChild)}

  if (activities != null) {
    activities.forEach(activity => {
      const tabDiv = document.createElement('div')
      tabDiv.classList.add('tab-button')
      tabDiv.innerText = activity.title
      tabBody.appendChild(tabDiv)
    });
  }

  tabBody.classList.remove('hidden')
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
  buildTabs(activities)

  return 

//   //building the html structure for activities - goals - time allocations
//   const parentList = document.createElement('ol')
//   parentList.classList.add('activity-list')
  
//   // (this is going to be soooo inefficient **fix on back end later)
//   activities.forEach(activity => {
//     const activityLI = document.createElement('li')
//     const goalsOL = document.createElement('ol')
//     activityLI.innerText = activity.title
//     activityLI.classList.add('activity')
//     goalsOL.classList.add('goal-list')
//     activityLI.appendChild(goalsOL)
//     parentList.appendChild(activityLI)

//     //adding goals the respective activities
//     let activityID = activity.id 
//     goals.forEach(goal => {
//       if (goal.activity == activityID) {
//         const goalLI = document.createElement('li')
//         const TAOL = document.createElement('ol')
//         goalLI.innerText = goal.title
//         goalLI.classList.add('goal')
//         TAOL.classList.add('time-allocation-list')
//         goalLI.appendChild(TAOL)
//         goalsOL.appendChild(goalLI)

//         // adding time allocations to the respective goals
//         let goalID = goal.id
//         timeallocations.forEach(timeAll => {
//           if (timeAll.goal == goalID){
//             const TALI = document.createElement('li')
//             TALI.innerText = timeAll.title
//             TALI.classList.add('time-allocation')
//             TAOL.appendChild(TALI)
//           }
//         })
//       }
//     })
//  });
//   return parentList
}



// login and log out handeling
function manageLogIn(event){
  event.preventDefault()
  let userName = document.getElementById('username').value
  let password = document.getElementById('password').value
  getAndCacheToken(userName, password)
}


function manageCreateUser(event) {
  //removing log in form
  logInForm = document.querySelector('.log-in-form-body')
  logInForm.classList.add('hidden')

  //adding create user form
  createUserForm = document.querySelector('.create-form-body')
  createUserForm.classList.remove('hidden')
}

async function createUser(event){
  event.preventDefault()
  let name = JSON.stringify(document.getElementById('create-name').value).split(' ')
  let firstName = name[0]
  let lastName = (name[1]) ? name[1]: ''
  let userName = document.getElementById('create-username').value
  let password = document.getElementById('create-password').value
  const errorMessage = document.querySelector('.create-error')

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

  if (response.status != 201){
    errorMessage.classList.remove('hidden')
  }
  else{
    errorMessage.classList.add('hidden')
    getAndCacheToken(userName, password)
  }
}

async function getAndCacheToken (userName, password) {
  /*
    Call back function on click of the 'log in' button. The function
      1. submits a request to the api for a token with the user's credentials
      2. recieves and stores the token in a cookie
      3. calls the page update function with the user's token
  */
  const errorMessage = document.querySelector('.log-in-error')
  const response = await fetch('http://127.0.0.1:8000/api/getToken/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: `${userName}`,
      password: `${password}`,
  })})
  if (response.status != 200){
    errorMessage.classList.remove('hidden')
  }
  else {
    errorMessage.classList.add('hidden')
    const token = await response.json() 
    document.cookie = `token=${token.token}`
    updatePagetoUser(token.token)
  }
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
  
  //setting home event listeners
  lgsb = document.querySelector('.log-in-submit-button')
  lgsb.addEventListener('click', manageLogIn)
  ceb = document.querySelector('.create-account-button')
  ceb.addEventListener('click', manageCreateUser)
  csb = document.querySelector('.create-submit-button')
  csb.addEventListener('click', createUser)
  closeLogIn = document.querySelector('.close-log-in')
  closeCreate = document.querySelector('.close-create')
  closeLogIn.addEventListener('click', hideParent)
  closeCreate.addEventListener('click', hideParent)

  //active working area
  const tabBody = document.querySelector('.tab-body')
  tabBody.addEventListener('click', manageTabClick)

  setHTMLOnPageLoad()
}






// active working space

async function addNewActivity(defaultTab){
  const formTab = document.createElement('div')
  const innerHtml = '<form class="new-activity-form"><input type="text" name="new-activity"></form><span class="close-new-tab">x</span>'
  formTab.classList.add('tab-button')
  formTab.innerHTML = innerHtml
  
  const newActivityForm = await formTab.firstChild
  newActivityForm.addEventListener('submit', newActivitySubmit)
  defaultTab.insertAdjacentElement('afterend', formTab)
}

function newActivitySubmit(event){
  event.preventDefault()
  const submittedTab = event.srcElement
  const activityName = submittedTab.firstChild.value
  if (activityName == "") {
    closeTab(submittedTab.parentNode)
  }
  else {
    closeTab(submittedTab.parentNode)
    const newTab = document.createElement('div')
    const defaultTab = document.getElementById('default')
    newTab.innerText = activityName
    newTab.classList.add('tab-button')
    defaultTab.insertAdjacentElement('afterend', newTab)
    updateDBActivities(activityName)
  }

}

async function updateDBActivities(activityName){
  const token = document.cookie.split(';').filter((item) => item.trim().startsWith('token='))[0].split('=')[1]

  const response = await fetch('http://127.0.0.1:8000/api/activities/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
    body: JSON.stringify({
      title: `${activityName}`,
      activity_type: [1],
  })})
  if (response.status != 201){
    console.log('screwed up adding an activity to the db status = ' + response.status)
  }
}

function closeTab(element) {
  element.parentNode.removeChild(element)
}

function manageTabClick(event){
  const clickedTab = event.target
  if (clickedTab.id == 'default'){
    addNewActivity(clickedTab)
  }
  else if (clickedTab.classList.contains('tab-button')){
    console.log('highlight and load ' + clickedTab.innerText)
  }
  else if (clickedTab.classList.contains('close-new-tab')){
    closeTab(clickedTab.parentNode)
  }
}
