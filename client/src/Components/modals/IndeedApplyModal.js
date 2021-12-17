import { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
import { newApplicationUpload } from "../../firebase/FirebaseFunctions";
import { Modal, Box, Typography, Button } from "@mui/material";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 800,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

function IndeedApplyModal(props) {
	const { currentUser } = useContext(AuthContext);

	const handleApply = async (url) => {
		if (!url) {
			return;
		}
		if (
			window.confirm(
				"This will take you to the job listing on Indeed. Do you wish to proceed?"
			)
		) {
			window.open(url);
			await newApplicationUpload(currentUser.uid, props.modaljob);
		}
	};

	return (
		<Modal open={props.show} onClose={props.onHide}>
			<Box sx={style}>
				<Typography variant="h6" component="h2">
					{props.modaljob.title}
				</Typography>
				<Typography sx={{ mt: 2 }}>
					Company: {props.modaljob.company}
				</Typography>
				<Typography sx={{ mt: 2 }}>
					Location: {props.modaljob.location}
				</Typography>
				<Typography sx={{ mt: 2 }}>
					Summary: {props.modaljob.summary}
				</Typography>
				<br />
				<Button
					variant="contained"
					onClick={() => handleApply(props.modaljob.url)}
				>
					Apply
				</Button>
				<Button onClick={props.onHide}>Close</Button>
			</Box>
		</Modal>
	);
}

export default IndeedApplyModal;
