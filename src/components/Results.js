import ListGroup from 'react-bootstrap/ListGroup';

function Results(props) {
    let resultsList = props.results;
    const elementsList = resultsList.map((entry) => {
        return (
            <ListGroup.Item key={entry.team_code} className="d-flex justify-content-between align-items-start">
                <div className="me-3"><b>{entry.team_rank}</b></div>
                <div className="ms-2 me-auto">{entry.team_name}</div>
                <div>{entry.team_code}</div>
            </ListGroup.Item>
        );
    });
    return (
        <ListGroup>
            <ListGroup.Item>
                <h2>Results</h2>
            </ListGroup.Item>
            {elementsList}
        </ListGroup>
    );
}

export default Results;