import { Modal, Button } from "react-bootstrap";

function IndeedApplyModal(props) {
	const handleApply = (url) => {
		if (
			window.confirm(
				"This will take you to the job listing on Indeed. Do you wish to proceed?"
			)
		) {
			window.open(url);
		}
	};

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title>{props.modaljob.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{props.modaljob.company}
				<br />
				{props.modaljob.location}
				<br />
				{props.modaljob.summary}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={props.onHide}>
					Close
				</Button>
				<div>
					{/* To see the full job listing on Indeed: <br /> */}
					<Button
						variant="primary"
						onClick={() => handleApply(props.modaljob.url)}
					>
						Apply
					</Button>
				</div>
			</Modal.Footer>
		</Modal>
	);
}

export default IndeedApplyModal;
