import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import LoginForm from '../../components/forms/LoginForm';


export default function Login() {
	return (
		<GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
			<LoginForm />
		</GoogleReCaptchaProvider>
	);
}