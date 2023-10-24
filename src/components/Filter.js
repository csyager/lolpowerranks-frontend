import './Filter.css';

import {useState, useEffect} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faFilter } from '@fortawesome/free-solid-svg-icons';

import ClipLoader from 'react-spinners/ClipLoader';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import {useAccordionButton} from 'react-bootstrap/AccordionButton'
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';

import { BACKEND_URL } from '../Constants';

function StageSelection(props) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        fetch(BACKEND_URL + "tournaments/" + props.tournament.tournament_id + "/stages")
            .then(response => response.json())
            .then(data => { console.log(data); return data; })
            .then(data => {
                let options = [];
                data.stages.forEach(stage => {
                    options.push(
                        <option key={stage.stage_slug} value={stage.stage_slug}>{stage.stage_name}</option>
                    )
                });
                setOptions(options);
            })
    }, [])

    return (
        <Form.Group className="mb-3" controlId="stage-selection">
            <Form.Label>Stage Selection</Form.Label>
            <Form.Control as="select" onChange={(e) => {console.log(e); props.setSelectedStage(e.nativeEvent.target.value);}}>
                <option value="">Select a stage</option>
                <option value="">All stages</option>
                {options}
            </Form.Control>
            <Form.Text className="text-muted">
                Optionally select a stage, to filter tournament results by stage.
            </Form.Text>
        </Form.Group>
    );
}



function FilterForm(props) {

    const [loadingTeams, setLoadingTeams] = useState(true);
    const [loadingTournaments, setLoadingTournaments] = useState(true);
    const [teams, setTeams] = useState([]);
    const [tournaments, setTournaments] = useState([]);

    // on component load, send request to backend for teams.
    useEffect(() => {
        fetch(BACKEND_URL + "teams")
            .then(response => response.json())
            .then(data => { console.log(data); return data; })
            .then(data => setTeams(data.teams))
            .then(setLoadingTeams(false));
        
        fetch(BACKEND_URL + "tournaments")
            .then(response => response.json())
            .then(data => { console.log(data); return data; })
            .then(data => setTournaments(data.tournaments))
            .then(setLoadingTournaments(false));
    }, [])

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

    const [tournamentBadge, setTournamentBadge] = useState(null);

    // currently selected tournament
    const [selectedTournament, setSelectedTournament] = useState(null);

    // currently selected teams
    const [selectedTeams, setSelectedTeams] = useState([]);

    // currently selected stage
    const [selectedStage, setSelectedStage] = useState(null);

    // when true, tournament dropdown should be visible
    const [showTournamentDropdown, setShowTournamentDropdown] = useState(false);
    // when true, teams dropdown should be visible
    const [showTeamsDropdown, setShowTeamsDropdown] = useState(false);

    // when true, tournament filter should be inactive
    const [tournamentFilterDisabled, setTournamentFilterDisabled] = useState(false);
    // when true, team filter should be inactive
    const [teamFilterDisabled, setTeamFilterDisabled] = useState(false);

    //tournament form value
    const [tournamentInputValue, setTournamentInputValue] = useState("");
    // team input value
    const [teamInputValue, setTeamInputValue] = useState("");

    // stage selection input
    const [stageInput, setStageInput] = useState(null);

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
            // props.setRankingHeader(selectedTournament.tournament_name);
            setTournamentBadge(
                <Badge bg="success" key={selectedTournament.tournament_name} className="me-3 mb-3" >{selectedTournament.tournament_name}</Badge>
            )
            setTeamFilterDisabled(true);
            setStageInput(<StageSelection tournament={selectedTournament} setSelectedStage={setSelectedStage}/>)
        } else {
            props.setRankingHeader("Global");
            setTeamFilterDisabled(false);
            setTournamentBadge(null);
            setStageInput(null);
        }
    }, [selectedTournament])

    // updates selected teams state, to track which teams have been selected
    function updateSelectedTeams(team) {
        if (!selectedTeams.includes(team.team_id)) {
            setSelectedTeams([...selectedTeams, team.team_id]);      
        } else {
            setSelectedTeams(selectedTeams.filter(elem => elem !== team.team_id));     
        }
    }

    // filters tournament list by the text input provided
    function filterTournaments(event) {
        // close the teams dropdown
        setShowTeamsDropdown(false);
        setTournamentInputValue(event.target.value);
        if (event.target.value === "") {
            setShowTournamentDropdown(false);
        } else {
            setShowTournamentDropdown(true);
        }
        let count = 0;
        let filteredTournaments = tournaments.filter(tournament => {
            if (count < 10) {
                if (tournament.tournament_name.toLowerCase().includes(event.target.value.toLowerCase())){
                    count++;
                    return true;
                }
            }
            return false;
        }).map(tournament => {
            return tournament.tournament_id;
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
        setTeamInputValue(event.target.value);
        if (event.target.value === "") {
            setShowTeamsDropdown(false);
        } else {
            setShowTeamsDropdown(true);
        }
        let count = 0;
        let filteredTeams = teams.filter(team => {
            if (count < 10) {
                if (team.team_name.toLowerCase().includes(event.target.value.toLowerCase())){
                    count++;
                    return true;
                }
            }
            return false;
        }).map(team => {
            return team.team_id;
        });
        setFilteredTeams(filteredTeams);
    }

    // adds badges showing which teams are currently selected
    useEffect(() => {
        setSelectedTournament(null);
        if (selectedTeams.length > 0) {
            setTournamentFilterDisabled(true);
        } else {
            setTournamentFilterDisabled(false);
        }
       
        let badges = [];
        teams.forEach(team => {
            if (selectedTeams.includes(team.team_id)) {
                badges.push(
                    <Badge bg="success" key={team.team_id} className="me-3 mb-3" id={team.team_id + "-badge"} >{team.team_name}</Badge>
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
            if (filteredTeams.includes(team.team_id)) {
                if (selectedTeams.includes(team.team_id)) {
                    filteredTeamsDropdownEntries.push(
                        <Dropdown.Item key={team.team_id} eventKey={team.team_id} id={team.team_id + "-dropdown"} onClick={() => updateSelectedTeams(team)}>
                            <FontAwesomeIcon icon={faCheck} className="me-2" id={team.team_id + "-check"} />{team.team_name}
                        </Dropdown.Item>
                    );
                } else {
                    filteredTeamsDropdownEntries.push(
                        <Dropdown.Item key={team.team_id} eventKey={team.team_id} id={team.team_id + "-dropdown"} onClick={() => updateSelectedTeams(team)}>
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
        setTeamInputValue("");
        setTournamentInputValue("");
        props.setQueryTeams([]);
        props.setQueryTournament(null);
    }

    function applyFilter() {
        if (selectedTeams.length > 0) {
            props.setQueryTeams(selectedTeams);
            props.setQueryTournament(null);
            props.setRankingHeader("Global");
        } else if (selectedTournament != null) {
            props.setQueryTournament(selectedTournament.tournament_id);
            props.setQueryTeams([]);
            props.setRankingHeader(selectedTournament.tournament_name);
            props.setQueryStage(selectedStage);
        }
    }

    if (loadingTeams || loadingTournaments) {
        return <ClipLoader />
    } else {
        return (
            <Form>
                <Form.Group className="mb-3" controlId="formTournament">
                    <Form.Label>Tournament</Form.Label>
                    <div>{tournamentBadge}</div>
                    <Form.Control type="text" placeholder="Tournament name" onChange={filterTournaments} disabled={tournamentFilterDisabled} value={tournamentInputValue}/>
                    <Dropdown.Menu show={showTournamentDropdown}>
                        <Dropdown.Header>Select tournaments</Dropdown.Header>
                        {filteredTournamentsDropdownEntries}
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="close" onClick={closeTournamentsDropdown} className="dropdown-close-button">Close</Dropdown.Item>
                    </Dropdown.Menu>
                    <Form.Text className="text-muted">
                        Select a tournament to get rankings for that tournament.
                    </Form.Text>
                </Form.Group>
                {stageInput}
                <Form.Group className="mb-3" controlId="formTeams">
                    <Form.Label>Teams</Form.Label>
                    <div>{badges}</div>
                    <Form.Control type="text" placeholder="Teams" onClick={filterTeams} onChange={filterTeams} disabled={teamFilterDisabled} value={teamInputValue}/>
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
                <Button variant="primary" onClick={applyFilter}>
                    Apply Filter
                </Button>
            </Form>
        )
    }

    
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
                    <FilterButton eventKey="0"><FontAwesomeIcon icon={faFilter} className="me-2"/> Filters</FilterButton>
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