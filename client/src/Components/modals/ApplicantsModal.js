// import { Modal, Button, Table } from "react-bootstrap";
import React, { useState } from "react";
import ApplicantTable from "./ApplicantTable";
import {
	Modal,
	Box,
	Typography,
	Button,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	Paper,
	TableBody,
} from "@mui/material";
import { tableCellClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 1000,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

function ApplicantsModal(props) {
	const [error, setError] = useState(false);

	return (
		<Modal aria-labelledby={props.id} open={props.show} onClose={props.onHide}>
			<Box sx={style}>
				<Typography id={props.id} variant="h6" component="h2">
					Applicants
				</Typography>
				{error ? (
					<div className="applicationError">
						Applicant could not be accepted/rejected. Please try again.
					</div>
				) : (
					<div></div>
				)}
				<TableContainer component={Paper}>
					<Table aria-label="applicant-table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Name</StyledTableCell>
								<StyledTableCell>Email</StyledTableCell>
								<StyledTableCell>Link to Resume</StyledTableCell>
								<StyledTableCell>Decision</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{props.modalapplicants && props.modalapplicants.length > 0 ? (
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
								<TableRow>
									<TableCell>No applicants</TableCell>
									<TableCell>N/A</TableCell>
									<TableCell>N/A</TableCell>
									<TableCell>N/A</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<br />
				<Button onClick={props.onHide}>Close</Button>
			</Box>
		</Modal>
	);
}

export default ApplicantsModal;
