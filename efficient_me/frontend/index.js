//home page functions
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




// user page construction and ux handeling
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

function buildTabs(userData){
  /*
   on page load, user tabs are constructed
  */
  const tabBody = document.querySelector('.tab-body')
  while(tabBody.children.length > 1) {tabBody.removeChild(tabBody.lastChild)}

  if (userData != null) {
    //constructing each overarching tab
    userData.forEach(activity => {
      const tabDiv = document.createElement('div')
      tabDiv.classList.add('tab-button')
      tabDiv.innerText = activity.title
      tabDiv.id = activity.id
      tabBody.appendChild(tabDiv)

      // constructing the goal cards and new goal form
      const goalBody = document.createElement('div')
      goalBody.classList.add('hidden')
      goalBody.classList.add('goal-body')
      goalBody.id = `goal-body-for-${activity.id}`

      // const goalForm = buildGoalForm(activity)
      const goals = activity.goal_set
      if (goals.length > 0) {
        goals.forEach(goal => {
          const goalCard = buildGoal(goal)
          goalBody.appendChild(goalCard)          
        })
      }
      tabBody.insertAdjacentElement('afterend',goalBody)
    });
  }

  tabBody.classList.remove('hidden')
}

function buildGoal(goal){
  /*
    returns a card for the passed goal. The card has the hidden time allocations as well
  */

  //creating goal card elements and appending
  const TAandGoalContainer = document.createElement('div')
  const goalContainer = document.createElement('div')
  const title = document.createElement('h3')
  const deadline = document.createElement('time')
  const description = document.createElement('p')
  const hours = document.createElement('div')
  const expandButton = document.createElement('a')
  const collapseButton = document.createElement('a')
  goalContainer.appendChild(title)
  goalContainer.appendChild(hours)
  goalContainer.appendChild(description)
  goalContainer.appendChild(deadline)
  goalContainer.appendChild(expandButton)
  goalContainer.appendChild(collapseButton)
  TAandGoalContainer.appendChild(goalContainer)

  //adding style classes
  goalContainer.classList.add('card')
  title.classList.add('goal-title')
  hours.classList.add('goal-hours')
  deadline.classList.add('goal-deadline')
  description.classList.add('goal-description')
  expandButton.classList.add('goal-expand-button')
  collapseButton.classList.add('goal-collapse-button')
  collapseButton.classList.add('hidden')
  TAandGoalContainer.classList.add('ta-goal-container')

  //adding goal details to respective elements
  title.innerText = goal.title
  description.innerText = goal.description
  hours.innerText = goal.hours_required
  deadline.setAttribute('datetime', goal.deadline)
  deadline.innerText = goal.deadline
  expandButton.setAttribute('href', `#/`)
  expandButton.innerText = '<+>'
  collapseButton.innerText = '<->'
  collapseButton.setAttribute('href', '#/')

  //builds paginated time allocations with a new form at top
  const TAlist = buildTAs(goal.timeallocation_set, goal.id)
  TAandGoalContainer.appendChild(TAlist)

  return TAandGoalContainer
}

function buildTAs(TAs, goalID){
  /*
  takes a JSON list of time allocations and builds and returns a structured list 
  */
  const TAlistOverall = document.createElement('div')
  TAlistOverall.id = `${goalID}-TA-box`
  TAlistOverall.classList.add('TA-list-box')

  TAs.forEach(time => {

    // creating the overall elements
    const TAelement = document.createElement('div')
    const title = document.createElement('h4')
    const description = document.createElement('p')
    const dateComplete = document.createElement('time')
    const hours = document.createElement('div')

    // adding specific details
    TAelement.classList.add('TAelement')
    title.classList.add('TAtitle')
    description.classList.add('TAdescription')
    dateComplete.classList.add('dateComplete')
    hours.classList.add('TAhours')
    title.innerText = time.title
    description.innerText = time.description
    dateComplete.setAttribute('datetime', time.date_complete)
    dateComplete.innerText = time.date_complete
    hours.innerHTML = time.time_speant

    //constructing the element
    TAelement.appendChild(title)
    TAelement.appendChild(description)
    TAelement.appendChild(dateComplete)
    TAelement.appendChild(hours)
    TAlistOverall.appendChild(TAelement)
  })

  return TAlistOverall
}

function buildGoalForm(activity){
  /*
    constructs and hides a new goal form for each activity tab
  */
}

async function addNewActivity(defaultTab){
  /*
    adds a form in a tab adjacent to the add button and the apropriate event listeners to submit or close it
  */
  const formTab = document.createElement('div')
  const innerHtml = '<form class="new-activity-form"><input type="text" name="new-activity"></form><span class="close-new-tab">x</span>'
  formTab.classList.add('tab-button')
  formTab.innerHTML = innerHtml
  
  const newActivityForm = await formTab.firstChild
  newActivityForm.addEventListener('submit', newActivitySubmit)
  defaultTab.insertAdjacentElement('afterend', formTab)
}

function newActivitySubmit(event){
  /*
    on submission of a new activity tab.  The tab is created, selected, and stored in the db

    *** still needs invalid submission handeling
  */
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
    highlightNewTab(newTab)
    defaultTab.insertAdjacentElement('afterend', newTab)
    updateDBActivities(activityName)
  }

}

function closeTab(element) {
  element.parentNode.removeChild(element)
}

function highlightNewTab(clickedTab) {
  /*
    1. removes highlight class from all tabs and highlight the new tab
    2. hides all goals and unhides the selected tabs goals
  */
  const tabs = document.querySelectorAll(".tab-button")
  tabs.forEach(tab => tab.classList.remove("highlight-tab"))
  clickedTab.classList.add('highlight-tab')

  //hiding all goal-bodies
  goalBodies = document.querySelectorAll('.goal-body')
  goalBodies.forEach(body => {body.classList.add('hidden')})

  //unhiding selected tab's goals
  const activityID = clickedTab.id
  const clickedGoalBody = document.getElementById(`goal-body-for-${activityID}`)
  clickedGoalBody.classList.remove('hidden')
}


function showGoals(clickedTab){
  /*
    hides all goal bodies and undhides the body of the passed in tab
  */
}

function manageTabClick(event){
  /*
    on click of a tab, calls the apropriate function based on the content of the clicked tab
      if the (+) tab is clicked - new acitivty functions are called
      if any existing tab is called, the tab is highlighted and the apropriate body is displayed
  */
  const clickedTab = event.target
  if (clickedTab.id == 'default'){
    addNewActivity(clickedTab)
    
  }
  else if (clickedTab.classList.contains('tab-button')){
    highlightNewTab(clickedTab)
    showGoals(clickedTab)
  }
  else if (clickedTab.classList.contains('close-new-tab')){
    closeTab(clickedTab.parentNode)
  }
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
  const userData = await fetch('http://127.0.0.1:8000/api/userPage/', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
  })

  const userDataJSON = await userData.json()

  buildTabs(userDataJSON) //builds the user page with the retrieved JSON

  return 
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

async function updateDBActivities(activityName){
  /*
    adds a new activity to the db
  */
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
  lgsb = document.querySelector('.log-in-submit-button') //log in submit form
  lgsb.addEventListener('click', manageLogIn)
  ceb = document.querySelector('.create-account-button') //create account form load
  ceb.addEventListener('click', manageCreateUser)
  csb = document.querySelector('.create-submit-button') // create account submit
  csb.addEventListener('click', createUser)
  closeLogIn = document.querySelector('.close-log-in')
  closeCreate = document.querySelector('.close-create')
  closeLogIn.addEventListener('click', hideParent)
  closeCreate.addEventListener('click', hideParent)
  const tabBody = document.querySelector('.tab-body') // opens proper tab
  tabBody.addEventListener('click', manageTabClick)

  // handles goal expansion
  const userBody = document.querySelector('.user-body')
  userBody.addEventListener('click', handleUserBodyClick)

  setHTMLOnPageLoad()
}






// active working space
function handleUserBodyClick(event) {
  /*
    if else tree for clicks on the user body. Handels the following cases
      1. expanding and collapsing user time allocations for a given goal
  */
  const clickedElement = event.target
  
  if (clickedElement.classList.contains('goal-expand-button')){
    // expanding a goal to show its time allocations, hiding the expand button, unhiding the collapse button
    const parentGoalContianer = clickedElement.closest('.ta-goal-container')
    const timeAllocationList = parentGoalContianer.querySelector('.TA-list-box')
    timeAllocationList.classList.add('expand')
    clickedElement.classList.add('hidden')

    //unhiding the collapse button
    const collapseButton = parentGoalContianer.querySelector('.goal-collapse-button')
    collapseButton.classList.remove('hidden')
  }
  else if (clickedElement.classList.contains('goal-collapse-button')){
    // collapsing the time allocation list, showing the expand button, hiding the collapse button
    const parentGoalContianer = clickedElement.closest('.ta-goal-container')
    const timeAllocationList = parentGoalContianer.querySelector('.TA-list-box')
    timeAllocationList.classList.remove('expand')
    clickedElement.classList.add('hidden')

    //hiding the collapse button
    const expandButton = parentGoalContianer.querySelector('.goal-expand-button')
    expandButton.classList.remove('hidden')
  }
}
