import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert, AlertColor } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';

import Copyright from '../../components/Copyright';
import { ApiUtils } from '../../utils/api-utils';
import { isValidEmail } from '../../utils/email-validation';


export default function SignUp() {

	const theme = createTheme();

	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info" as AlertColor);


	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (username.trim() == "" || password.trim() == "" || !isValidEmail(email)) {
			setAlertType("error" as AlertColor)
			setAlertMessage("Please fill empty fields");
			return;
		}

		const body = JSON.stringify({
			email: email.trim(),
			username: username.trim(),
			password: password.trim()
		});

		const response = await fetch(`${ApiUtils.getApiUrl()}/auth/signUp`, {
			method: "post",
			body: body,
			headers: {
				"Content-Type": "application/json"
			},
		});

		const jsonData = await response.json();
		console.log(jsonData);

		if (jsonData.status) {
			router.push('/auth/login');
		}
		else {
			setAlertType("error" as AlertColor)
			setAlertMessage(jsonData.message)
		}

	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<TextField
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							error={!isValidEmail(email) ? true : false}

							margin="normal"
							required
							fullWidth
							id="email"
							label="email"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							error={username.trim() == "" ? true : false}

							margin="normal"
							required
							fullWidth
							id="username"
							label="username"
							name="username"
							autoComplete="username"
							autoFocus
						/>
						<TextField
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							error={password.trim() == "" ? true : false}

							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="text"
							id="password"
							autoComplete="current-password"
						/>

						<Zoom in={alertMessage == "" ? false : true}>
							<Alert severity={alertType} onClose={() => { setAlertMessage("") }}>{alertMessage}</Alert>
						</Zoom>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign up
						</Button>
						<Grid container>
							<Grid item>
								<Link href="/auth/login" variant="body2">
									{"Already have an account? Login"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</ThemeProvider>
	);
}