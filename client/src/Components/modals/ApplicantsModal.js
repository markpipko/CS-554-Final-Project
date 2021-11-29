import { Modal, Button, Table } from "react-bootstrap";

function ApplicantsModal(props) {

    return(
        <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
			<Modal.Header closeButton>
				<Modal.Title>Applicants</Modal.Title>
			</Modal.Header>
			<Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Resume</th>
                        </tr>
                    </thead>
                    <tbody>                       
                        {props.modalApplicants.map((applicant) => {
                            return (
                                <tr>
                                    <td>{applicant.name}</td>
                                    <td>{applicant.email}</td>
                                    <td>{applicant.resume}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={props.onHide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
    )
}

export default ApplicantsModal