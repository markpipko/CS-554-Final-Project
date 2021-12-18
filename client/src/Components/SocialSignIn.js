import React from "react";
import { doSocialSignIn } from "../firebase/FirebaseFunctions";

const SocialSignIn = () => {
	const socialSignOn = async (provider) => {
		try {
			await doSocialSignIn(provider);
		} catch (error) {
			console.log(error);
			// alert(error);
		}
	};
	return (
		<div>
			<input
				type="image"
				src="/imgs/btn_google_signin.png"
				alt="google signin"
				onClick={() => socialSignOn("google")}
			/>
			{/* <input
				type="image"
				onClick={() => socialSignOn("facebook")}
				alt="facebook signin"
				src="/imgs/facebook_signin.png"
			/> */}
		</div>
	);
};

export default SocialSignIn;
