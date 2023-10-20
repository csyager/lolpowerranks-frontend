import './Filter.css';

import {useState, useEffect} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faFilter } from '@fortawesome/free-solid-svg-icons';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import {useAccordionButton} from 'react-bootstrap/AccordionButton'
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';


function FilterForm(props) {

    // TODO:  source this data from the API, instead of hardcoding
    let teams = [
        {
          "team_name": "test-team-1",
          "team_code": "TT1"
        }, 
        {
          "team_name": "test-team-2",
          "team_code": "TT2"
        },
        {
          "team_name": "test-team-3",
          "team_code": "TT3"
        }
    ];

    let tournaments = [
        {
          "tournament_id": "test-tournament-1",
          "tournament_name": "test tournament 1"
        }, 
        {
          "tournament_id": "test-tournament-2",
          "tournament_name": "test tournament 2"
        },
        {
          "tournament_id": "test-tournament-3",
          "tournament_name": "test tournament 3"
        }
    ];

    // currently visible set of tournaments, based on name-filtering
    const [filteredTournaments, setFilteredTournaments] = useState([]);
    // currently visible set of teams, based on name-filtering
    const [filteredTeams, setFilteredTeams] = useState([]);

    // currently visible team dropdown entries
    const [filteredTeamsDropdownEntries, setFilteredTeamsDropdownEntries] = useState([]);

    // currently visible tournament dropdown entries
    const [filteredTournamentsDropdownEntries, setFilteredTournamentsDropdownEntries] = useState([]);

    // currently visible badges
    const [badges, setBadges] = useState([]);

    // currently selected tournament
    const [selectedTournament, setSelectedTournament] = useState(null);

    // currently selected teams
    const [selectedTeams, setSelectedTeams] = useState([]);

    // when true, tournament dropdown should be visible
    const [showTournamentDropdown, setShowTournamentDropdown] = useState(false);
    // when true, teams dropdown should be visible
    const [showTeamsDropdown, setShowTeamsDropdown] = useState(false);

    // updates selected tournament state, to track which touranment has been selected.
    function updateSelectedTournament(tournamentId) {
        console.log("updating selected tournament with tournament " + tournamentId);
        if (tournamentId != null) {
            const tournament = tournaments.find((element) => element.tournament_id === tournamentId);
            setSelectedTournament(tournament);
        } else {
            setSelectedTournament(null);
        }
        
    }

    useEffect(() => {
        if (selectedTournament != null) {
            props.setRankingHeader(selectedTournament.tournament_name);
        } else {
            props.setRankingHeader("Global");
        }
    })

    // updates selected teams state, to track which teams have been selected
    function updateSelectedTeams(team) {
        if (!selectedTeams.includes(team.team_code)) {
            setSelectedTeams([...selectedTeams, team.team_code]);      
        } else {
            setSelectedTeams(selectedTeams.filter(elem => elem !== team.team_code));     
        }
    }

    // filters tournament list by the text input provided
    function filterTournaments(event) {
        // close the teams dropdown
        setShowTeamsDropdown(false);
        if (event.target.value === "") {
            setShowTournamentDropdown(false);
        } else {
            setShowTournamentDropdown(true);
        }
        let filteredTournaments = [];
        tournaments.map((tournament) => {
            if (tournament.tournament_name.includes(event.target.value)) {
                filteredTournaments.push(tournament.tournament_id);
            }
        });
        setFilteredTournaments(filteredTournaments);
    }

    useEffect(() => {
        let filteredTournamentsDropdownEntries = [];
        tournaments.forEach(tournament => {
            if (filteredTournaments.includes(tournament.tournament_id)) {
                filteredTournamentsDropdownEntries.push(
                    <Dropdown.Item key={tournament.tournament_id} eventKey={tournament.tournament_id} onClick={() => updateSelectedTournament(tournament.tournament_id)}>
                        {tournament.tournament_name}
                    </Dropdown.Item>
                );
            }
        })
        setFilteredTournamentsDropdownEntries(filteredTournamentsDropdownEntries);
    }, [filteredTournaments]);

    // filters the team list by the text input provided
    function filterTeams(event) {
        // close the tournaments dropdown
        setShowTournamentDropdown(false);
        if (event.target.value === "") {
            setShowTeamsDropdown(false);
        } else {
            setShowTeamsDropdown(true);
        }
        let filteredTeams = []
        teams.map((team) => {
            if (team.team_name.includes(event.target.value)) {
                filteredTeams.push(team.team_code);
            }
        });
        setFilteredTeams(filteredTeams);
    }

    // adds badges showing which teams are currently selected
    useEffect(() => {
        let badges = [];
        teams.forEach(team => {
            if (selectedTeams.includes(team.team_code)) {
                badges.push(
                    <Badge bg="success" key={team.team_code} className="me-3 mb-3" id={team.team_code + "-badge"} >{team.team_name}</Badge>
                )
            }
        })
        setBadges(badges);
    }, [selectedTeams])

    // controls the dropdown entries that appear based on the team filter input
    // also adds a checkbox by the selected teams
    useEffect(() => {
        let filteredTeamsDropdownEntries = [];
        teams.forEach(team => {
            if (filteredTeams.includes(team.team_code)) {
                if (selectedTeams.includes(team.team_code)) {
                    filteredTeamsDropdownEntries.push(
                        <Dropdown.Item key={team.team_code} eventKey={team.team_code} id={team.team_code + "-dropdown"} onClick={() => updateSelectedTeams(team)}>
                            <FontAwesomeIcon icon={faCheck} className="me-2" id={team.team_code + "-check"} />{team.team_name}
                        </Dropdown.Item>
                    );
                } else {
                    filteredTeamsDropdownEntries.push(
                        <Dropdown.Item key={team.team_code} eventKey={team.team_code} id={team.team_code + "-dropdown"} onClick={() => updateSelectedTeams(team)}>
                            {team.team_name}
                        </Dropdown.Item>
                    );
                }
                
            } 
        });
        setFilteredTeamsDropdownEntries(filteredTeamsDropdownEntries);

    }, [filteredTeams, selectedTeams])

    
    // closes the tournaments dropdown when the close button is pressed
    function closeTournamentsDropdown() {
        setShowTournamentDropdown(false);
    }

    // closes the teams dropdown when the close button is pressed
    function closeTeamsDropdown() {
        setShowTeamsDropdown(false);
    }

    function clearFilters() {
        setSelectedTeams([]);
        setSelectedTournament(null);
    }

    return (
        <Form>
            <Form.Group className="mb-3" controlId="formTournament">
                <Form.Label>Tournament</Form.Label>
                <Form.Control type="text" placeholder="Tournament name" onChange={filterTournaments}/>
                <Dropdown.Menu show={showTournamentDropdown}>
                    <Dropdown.Header>Select tournaments</Dropdown.Header>
                    {filteredTournamentsDropdownEntries}
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="close" onClick={closeTournamentsDropdown} className="dropdown-close-button">Close</Dropdown.Item>
                </Dropdown.Menu>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTeams">
                <Form.Label>Teams</Form.Label>
                <div>{badges}</div>
                <Form.Control type="text" placeholder="Teams" onClick={filterTeams} onChange={filterTeams}/>
                <Dropdown.Menu show={showTeamsDropdown}>
                    <Dropdown.Header>Select teams</Dropdown.Header>
                    {filteredTeamsDropdownEntries}
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="close" onClick={closeTeamsDropdown} className="dropdown-close-button">Close</Dropdown.Item>
                </Dropdown.Menu>
                <Form.Text className="text-muted">
                    Select any number of teams to get rankings.
                </Form.Text>
            </Form.Group>
            <Button variant="danger" className="me-2" onClick={clearFilters}>
                Clear Filters
            </Button>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}


function FilterButton({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () => {

    });

    return (
        <Button variant="primary" onClick={decoratedOnClick}>{children}</Button>
    );
}

function Filter(props) {
    return (
        <Accordion flush>
            <Card className="mb-3">
                <Card.Header>
                    <FilterButton eventKey="0"><FontAwesomeIcon icon={faFilter} className="me-2"/> Filter</FilterButton>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <FilterForm {...props}/>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default Filter;