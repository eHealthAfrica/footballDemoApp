let BASE_URL = 'http://api.football-data.org/v1/'
let ACTIONS = Object.freeze({
  'SHOW_COMPETITIONS': 1,
  'SHOW_TEAMS': 2,
  'SHOW_FIXTURES': 3
})

$(document).ready(function () {
  setupCard('competitionsCard', 'Competitions', ACTIONS.SHOW_COMPETITIONS)
  setupCard('fixturesCard', 'Fixtures', ACTIONS.SHOW_FIXTURES)
})

function setupCard (id, title, action) {
  let card = document.getElementById(id)
  card.addEventListener('click', () => openModal(title, action))
}

function openModal (title, action) {
  $('#modal').modal('toggle')
  document.getElementById('modalTitle').innerHTML = title
  handleAction(action)
}

function handleAction (action) {
  switch (action) {
    case ACTIONS.SHOW_COMPETITIONS:
      showCompetitions()
      break
    case ACTIONS.SHOW_TEAMS:
      showTeams()
      break
    case ACTIONS.SHOW_FIXTURES:
      showFixtures()
      break
    default:
      alert('Action not supported')
  }
}

function showCompetitions () {
  showData('competitions/?season=2017', 'data', createCompetitionInfoCard)
}

function showTeams (id) {
  document.getElementById('modalTitle').innerHTML = `Teams`
  showData(`competitions/${id}/teams`, 'teams', createTeamInfoCard)
}

function showFixtures () {
  showData('fixtures/', 'fixtures', createFixtureInfoCard)
}

function showData (endpoint, property, createFn) {
  clearList()
  showLoadingIndicator()

  request(endpoint)
  .then(function (response) {
    let items = response[property] !== undefined ? response[property] : response.data[property]
    let list = document.getElementById('items')

    for (let item of items) {
      let itemElement = document.createElement('div')
      // itemElement.innerHTML = createFixtureInfoCard(item)
      itemElement.innerHTML = createFn(item)

      list.appendChild(itemElement)
    }

    hideLoadingIndicator()
  }).catch((error) => handleError(error))
}

function createCompetitionInfoCard (competition) {
  return `
    <div class="col-sm-3">
      <div class="card" style="width: 18rem; margin-bottom: 10px;" onClick="showTeams(${competition.id})">
        <div class="card-body">
          <h5 class="card-title">${competition.caption}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${competition.league}</h6>
        </div>
      </div>
    </div>`
}

function createFixtureInfoCard (fixture) {
  return `
    <div class="col-sm-3">
      <div class="card" style="width: 18rem; margin-bottom: 10px;">
        <div class="card-body">
          <h5 class="card-title">${moment(fixture.date).format('MMMM Do YYYY, h:mm a')}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Matchday ${fixture.matchday}</h6>
          <p class="card-text">
            <b>${fixture.homeTeamName}</b> <br>
            <h1>VS</h1>
            <b>${fixture.awayTeamName}</b> <br>
          </p>
        </div>
      </div>
    </div>`
}

function createTeamInfoCard (team) {
  return `
    <div class="col-sm-3">
      <div class="card" style="width: 18rem; margin-bottom: 10px;">
        <div class="card-body">
          <img src="${team.crestUrl}" style="height: 200px; width: 200px" alt="${team.name}">
          <h5 class="card-title">${team.name}</h5>
        </div>
      </div>
    </div>`
}

function clearList () {
  document.getElementById('items').innerHTML = ''
}

function hideLoadingIndicator () {
  let indicator = document.getElementById('modalLoadingIndicator')
  indicator.style.display = 'none'
}

function showLoadingIndicator () {
  let indicator = document.getElementById('modalLoadingIndicator')
  indicator.style.display = 'block'
}

function request (endpoint) {
  return axios({
    url: BASE_URL + endpoint,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'X-Auth-Token': 'd3de6ad724294f7782c57f2e9fda5aab'
    }
  })
}

function handleError (error) {
  $('#modal').modal('hide')
  console.log(error)
  alert('Oops something went wrong. Please try again later :(')
}
