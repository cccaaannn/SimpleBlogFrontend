import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import SignUpForm from '../../components/forms/SignUpForm';


export default function SignUp() {
	return (
		<GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
			<SignUpForm />
		</GoogleReCaptchaProvider>
	);
}