import { Modal, Button, Table } from "react-bootstrap";
import React, { useState } from "react";
import ApplicantTable from "./ApplicantTable";
function ApplicantsModal(props) {
	const [error, setError] = useState(false);

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title>Applicants </Modal.Title>
			</Modal.Header>
			{error ? (
				<div className="applicationError">
					Applicant could not be accepted/rejected. Please try again.
				</div>
			) : (
				<div></div>
			)}
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
									<ApplicantTable
										index={index}
										applicant={applicant}
										setError={setError}
										key={index}
									/>
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
