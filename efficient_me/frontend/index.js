// dependencies
const Chart = require('chart.js')

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
      const newTab = buildTab(activity)
      
      // appending the tab after the default tab
      const defaultTab = document.getElementById('default')
      defaultTab.insertAdjacentElement('afterend', newTab)
    });
  }
  
  tabBody.classList.remove('hidden')
}

function buildTab(activity) {
  const tabDiv = document.createElement('div')
  tabDiv.classList.add('tab-button')
  tabDiv.innerText = activity.title
  tabDiv.id = activity.id
  
  // constructing the goal cards and new goal form
  const goalBody = document.createElement('div')
  goalBody.classList.add('hidden')
  goalBody.classList.add('goal-body')
  goalBody.id = `goal-body-for-${activity.id}`
  
  // adding goal user interaction functionality (delete, add) buttons
  const deleteTabButton = document.createElement('a')
  const addGoalButton = document.createElement('a')
  deleteTabButton.classList.add('button', 'delete-tab-button')
  addGoalButton.classList.add('button', 'addGoalButton')
  deleteTabButton.id = `delete-activity-${activity.id}`
  deleteTabButton.addEventListener('click', handleDeleteRequest)
  addGoalButton.innerText = 'add new goal'
  deleteTabButton.innerText = 'delete'
  goalBody.appendChild(addGoalButton)
  goalBody.appendChild(deleteTabButton)
  
  // building and appending a goal form
  const goalForm = buildGoalForm(activity.id)
  goalForm.classList.add('hidden')
  goalBody.appendChild(goalForm)
  
  // unhide goal form event listener
  addGoalButton.addEventListener('click', event => {
    goalForm.classList.remove('hidden')
  })
  
  // const goalForm = buildGoalForm(activity)
  const goals = activity.goal_set
  if (goals.length > 0) {
    goals.forEach(goal => {
      const goalCard = buildGoal(goal)
      goalBody.appendChild(goalCard)          
    })
  }

  // building the chart
  const chart = buildChart(activity)
  
  // building the tab data
  const userBody = document.querySelector('.create-user-content')
  userBody.appendChild(goalBody)

  return tabDiv
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
  const deleteButton = document.createElement('a')
  goalContainer.appendChild(title)
  goalContainer.appendChild(deleteButton)
  goalContainer.appendChild(hours)
  goalContainer.appendChild(description)
  goalContainer.appendChild(deadline)
  goalContainer.appendChild(expandButton)
  goalContainer.appendChild(collapseButton)
  TAandGoalContainer.appendChild(goalContainer)

  //adding style classes
  goalContainer.classList.add('card')
  goalContainer.id = `goal-${goal.id}`
  title.classList.add('goal-title')
  hours.classList.add('goal-hours')
  deadline.classList.add('goal-deadline')
  description.classList.add('goal-description')
  expandButton.classList.add('goal-expand-button', 'button')
  collapseButton.classList.add('goal-collapse-button', 'button')
  deleteButton.classList.add('goal-delete-button', 'button')
  collapseButton.classList.add('hidden')
  TAandGoalContainer.classList.add(`ta-goal-container`)
  TAandGoalContainer.id = `container-${goal.id}`

  //adding event listeners
  deleteButton.addEventListener('click', handleDeleteRequest)
  TAandGoalContainer.addEventListener('click', handleGoalClickGraphing)

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
  deleteButton.innerText = 'delete'
  deleteButton.setAttribute('href', '#/')
  deleteButton.id = `delete-goal-${goal.id}`

  //builds paginated time allocations with a new form at top
  const TAlist = buildTAList(goal.timeallocation_set, goal.id)
  TAandGoalContainer.appendChild(TAlist)
  
  return TAandGoalContainer
}


function buildGoalForm(activityID){
  /*
    constructs and hides a new goal form
  */

  //constructing the form
  const formContainer = document.createElement('div')
  formContainer.id = `goal-form-container-${activityID}`
  formContainer.classList.add('goal-form', 'ta-goal-container')
  const goalForm = document.createElement('form')
  goalForm.id = activityID
  goalForm.innerHTML = `<form><label for="goal-title-input-${activityID}">Title</label><input type="text" id="goal-title-input-${activityID}"><label for="goal-description-input-${activityID}">Description</label><input type="text" id="goal-description-input-${activityID}"><label for="goal-hours-input-${activityID}">Hours required</label><input type="text" id="goal-hours-input-${activityID}"><label for="goal-deadline-input-${activityID}">Deadline</label><input type="date" id="goal-deadline-input-${activityID}"><button type="submit" >Add</button></form>`
  formContainer.appendChild(goalForm)
  
  // adding submit form event listener
  goalForm.addEventListener('submit', newGoalSubmit)

  return formContainer
}


function buildTAList(TAs, goalID){
  /*
  takes a JSON list of time allocations and builds and returns a structured list 
  */
  const TAlistOverall = document.createElement('div')
  TAlistOverall.id = `${goalID}-TA-box`
  TAlistOverall.classList.add('TA-list-box')

  // obtaining and appending a TA form
  const TAform = buildTAform(goalID)
  TAlistOverall.appendChild(TAform)

  TAs.forEach(time => {

    const TAelement = buildTA(time)
    TAlistOverall.appendChild(TAelement)
  })

  return TAlistOverall
}


function buildTA(time) {
  // constructs a signle time allocation

  // creating the overall elements
  const TAelement = document.createElement('div')
  const title = document.createElement('h4')
  const description = document.createElement('p')
  const dateComplete = document.createElement('time')
  const hours = document.createElement('div')
  const TADeleteButton = document.createElement('a')

  // adding specific details
  TAelement.classList.add('TAelement')
  TAelement.id = `ta-${time.id}`
  title.classList.add('TAtitle')
  description.classList.add('TAdescription')
  dateComplete.classList.add('dateComplete')
  hours.classList.add('TAhours')
  title.innerText = time.title
  description.innerText = time.description
  dateComplete.setAttribute('datetime', time.date_completed)
  dateComplete.innerText = time.date_completed
  hours.innerHTML = time.time_speant
  TADeleteButton.innerText= 'delete'  
  TADeleteButton.setAttribute('href', '#/')
  TADeleteButton.id = `delete-ta-${time.id}`

  //adding event listeners
  TADeleteButton.addEventListener('click', handleDeleteRequest)

  //constructing the element
  TAelement.appendChild(title)
  TAelement.appendChild(TADeleteButton)
  TAelement.appendChild(description)
  TAelement.appendChild(dateComplete)
  TAelement.appendChild(hours)

  return TAelement
}


function buildTAform(goalID) {
  /*
    constructs a time allocation form to be added to each goal
      the goal's id is passed in to be used in the input IDs.
  */

  //constructing the new form
  const taBorder = document.createElement('div')
  taBorder.classList.add('TAelement','TA-form')
  const taForm = document.createElement('form')
  taForm.innerHTML = `<h4>Log time</h4><label for="ta-title-input-${goalID}">Title</label><input type="text" id="ta-title-input-${goalID}"><label for="ta-description-input-${goalID}">Description</label><input type="text" id="ta-description-input-${goalID}"><label for="ta-hours-input-${goalID}">Time speant</label><input type="text" id="ta-hours-input-${goalID}"><label for="ta-deadline-input-${goalID}">Date</label><input type="date" id="ta-deadline-input-${goalID}"><button type="submit">Add</button>`
  taBorder.appendChild(taForm)

  //adding event listener to catch the submit
  taForm.id = `ta-form-${goalID}`
  taForm.addEventListener('submit', newTASubmit)
  

  return taBorder
}


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


async function addNewActivity(defaultTab){
  /*
    adds a form in a tab adjacent to the add button and the apropriate event listeners to submit or close it
  */
  const formTab = document.createElement('div')
  formTab.id = 'form-tab'
  const innerHtml = '<form class="new-activity-form"><input type="text" name="new-activity"></form><span class="close-new-tab">x</span>'
  formTab.classList.add('tab-button')
  formTab.innerHTML = innerHtml
  
  const newActivityForm = await formTab.firstChild
  newActivityForm.addEventListener('submit', newActivitySubmit)
  defaultTab.insertAdjacentElement('afterend', formTab)
}


function buildChart(activity){
  /*
    constructs a cumuluative sum chart from the overall activity data, where goals are grouped by color
  */
}




/*
  Section of JS - interacting with the DB
*/

async function newGoalSubmit(event){
  /*
    On submit of a goal form.  Sends an update post request to the API
  */
  event.preventDefault()

  const token = document.cookie.split(';').filter((item) => item.trim().startsWith('token='))[0].split('=')[1]

  //collecting form information
  console.log(event.target)
  const activityID = event.target.id
  const title = event.target.querySelector(`#goal-title-input-${activityID}`).value
  const description = event.target.querySelector(`#goal-description-input-${activityID}`).value
  const hours = event.target.querySelector(`#goal-hours-input-${activityID}`).value
  const dateTime = event.target.querySelector(`#goal-deadline-input-${activityID}`).value
  console.log(activityID, title, description, hours, dateTime)

  //sending requests
  const response = await fetch('http://127.0.0.1:8000/api/goals/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
    body: JSON.stringify({
      title: `${title}`,
      description: `${description}`,
      activity: `${activityID}`,
      deadline: `${dateTime}`,
      hours_required: `${hours}`
  })})
  if (response.status != 201){
    console.log('screwed up adding a goal to the db status = ' + response.status)
  }
  else {

    // creating a new goal card
    const newGoal = await response.json()
    const newGoalCard = buildGoal(newGoal)

    // appending after the goal form
    const goalForm = document.getElementById(`goal-form-container-${activityID}`)
    goalForm.insertAdjacentElement('afterend',newGoalCard)
    console.log('updated db')
  }
}

async function newTASubmit(event){
  event.preventDefault()
  const token = document.cookie.split(';').filter((item) => item.trim().startsWith('token='))[0].split('=')[1]

  //collecting form information
  console.log(event.target)
  const goalID = event.target.id.split('-')[2]
  const title = event.target.querySelector(`#ta-title-input-${goalID}`).value
  const description = event.target.querySelector(`#ta-description-input-${goalID}`).value
  const hours = event.target.querySelector(`#ta-hours-input-${goalID}`).value
  const dateTime = event.target.querySelector(`#ta-deadline-input-${goalID}`).value
  console.log(goalID, title, description, hours, dateTime)

  //sending requests
  const response = await fetch('http://127.0.0.1:8000/api/timeallocations/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
    body: JSON.stringify({
      title: `${title}`,
      description: `${description}`,
      goal: `${goalID}`,
      date_completed: `${dateTime}`,
      time_speant: `${hours}`
  })})
  if (response.status != 201){
    console.log('screwed up adding a time allocation to the db status = ' + response.status)
  }
  else {
    // creating new time log
    const newTA = await response.json()
    const newTAElem = buildTA(newTA)

    // finding location to append new time log
    const taForm = document.getElementById(`${goalID}-TA-box`).querySelector('.TA-form')
    taForm.insertAdjacentElement('afterend', newTAElem)

    console.log('updated db')
  }
}


function newActivitySubmit(event){
  /*
    on submission of a new activity tab.  The tab is created, selected, and stored in the db

    *** to do - submission errors, better new event handeling (highlight first tab?)
  */
  console.log('submitting')
  event.preventDefault()
  const submittedTab = event.srcElement
  const activityName = submittedTab.firstChild.value
  if (activityName == "") {
    closeTab(submittedTab.parentNode)
  }
  else {
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
  buildChartDatasets(userDataJSON) //adding chart data to local storage
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
  else {
    //obtaining a new tab element
    const newActivity = await response.json()
    const newTab = buildTab(newActivity)

    // appending to the tab body
    const defaultTab = document.getElementById('default')
    defaultTab.insertAdjacentElement('afterend', newTab)

    // highlighting the new tab
    const formTab = document.getElementById('form-tab')
    formTab.classList.add('hidden')
    formTab.value = ""
    highlightNewTab(newTab)

  }
  
}


function handleDeleteRequest(event) {
  /*
    prompts the user to ensure that they wish to delete the element passed in
  */

  // find the target based on the click event
  const target = event.target.id.split('-')

  //unhide delete pop up
  const popup = document.getElementById('delete-popup')
  popup.classList.remove('hidden')
  
  //set event listener with existing target passed in
  const deleteChoiceForm = document.getElementById('delete-popup-form')
  deleteChoiceForm.addEventListener('submit', handleDeletePopupSubmission(target))

}


function handleDeletePopupSubmission(target) {
  return async function removeMe(event) {
    /*
    removes the target goal/TA/activity if the user submits "yes". Else, hides the form
    */
   
   event.preventDefault()
   const token = document.cookie.split(';').filter((item) => item.trim().startsWith('token='))[0].split('=')[1]

    // remove the delete event listener
    this.removeEventListener('submit', removeMe)

    //obtaining the value submitted by the user
    const value = event.target.elements.delete.value

    if (value == "yes"){
      // if yes, call the apropriate delete db function, hide the element. If no, hide popup
      let targetType = target[1]
      const targetID = target[2]

      // correcting target type to correspond to API url and hiding apropriate element
      switch(targetType){
        case "activity":
          targetType = "activities"
          const deletedActivity = document.getElementById(`${targetID}`)
          deletedActivity.classList.add('hidden')
          break
        case "goal":
          targetType = "goals"
          const deletedGoal = document.getElementById(`goal-${targetID}`).parentNode
          deletedGoal.classList.add('hidden')
          break
        case "ta":
          targetType = "timeallocations"
          const deletedTA = document.getElementById(`ta-${targetID}`)
          deletedTA.classList.add('hidden')
          break
      }

      // sending the request to the API
      const response = await fetch(`http://127.0.0.1:8000/api/${targetType}/${targetID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      }})
      if (response.status != 204){
        console.log('screwed up adding a goal to the db status = ' + response.status)
      }
      else {
        console.log('updated db')
      }
    }

    // hiding the popup
    const popup = document.getElementById(`delete-popup`)
    popup.classList.add('hidden')
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

function buildChartDatasets(userData) {
  /* 
    Takes in an activity or goal
      - activity: builds dataset for cumulative sum graph for all time speant on all goals in an activity
      - goal: builds dataset for cumulative sum graph for all time speant on a goal
  */

  // initializing dictionaries to be cached
  let goalData = []
  let activityData = []
  let activityCumSum = 0
  let goalCumSum = 0
  
  // looping through each activity
  for (let i = 0; i < userData.length; i++){
    const activity = userData[i]
    const goalSet = activity.goal_set

    //reseting 
    activityCumSum = 0
    activityData = []
    
    // looping through each goal to sum up time allocations and build goal
    if (goalSet.length > 0){
      for (let j = 0; j < goalSet.length; j++){
        const goal = goalSet[j]
        const taSet = goal.timeallocation_set
        console.log(taSet)
        //reseting goal
        goalCumSum = 0
        goalData = []

        //looping through each time allocation to sum up time
        if (taSet.length > 0){
          for (let k = 0; k < taSet.length; k++){
            const time = taSet[k]
            activityCumSum += time.time_speant*1
            goalCumSum += time.time_speant*1
            
            //adding x, y pair
            const date = new Date(...time.date_completed.split('-'))
            activityData.push({
              x: date,
              y: activityCumSum
            })
            goalData.push({
              x: date,
              y: goalCumSum
            })
          }
        }

        // appending to goal local storage dict
        localStorage.setItem(`goal-${goal.id}-data`, JSON.stringify(goalData))
      }
    }

    // appending to activity local storage dict
    localStorage.setItem(`activity-${activity.id}-data`, JSON.stringify(activityData))
  }
}

function handleGoalClickGraphing(event) {
  /*
    Displays the correct chart on click of a goal body
  */
  console.log(event)
  
}