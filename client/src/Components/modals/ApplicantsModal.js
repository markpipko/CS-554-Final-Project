import { Modal, Button, Table } from "react-bootstrap";

function ApplicantsModal(props) {
	return (
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
						{props.modalapplicants ? (
							props.modalapplicants.map((applicant, index) => {
								return (
									<tr key={index}>
										<td>{applicant.name}</td>
										<td>{applicant.email}</td>
										<td>
											{applicant.resume ? (
												<a href={applicant.resume}>Resume</a>
											) : (
												<div>None provided</div>
											)}
										</td>
										<td>
											<Button className="statusButtons" variant="success">
												Accept
											</Button>
											<Button className="statusButtons" variant="danger">
												Reject
											</Button>
										</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td>No applicants</td>
								<td>N/A</td>
								<td>N/A</td>
							</tr>
						)}
					</tbody>
				</Table>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={props.onHide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default ApplicantsModal;
