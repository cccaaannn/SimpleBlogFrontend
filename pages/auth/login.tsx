import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Zoom from '@mui/material/Zoom';
import { useRouter } from 'next/router';
import { Storage } from '../../utils/storage';
import { useEffect, useState } from 'react';
import { LocalStorageKeys } from '../../types/enums/local-storage-keys';
import Copyright from '../../components/Copyright';
import { Alert, AlertColor } from '@mui/material';
import { ApiUtils } from '../../utils/api-utils';


export default function Login() {

	const theme = createTheme();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info" as AlertColor);
	const [rememberMe, setRememberMe] = useState(false);

	useEffect(() => {
		const rememberMeUsername: string | null = Storage.get(LocalStorageKeys.REMEMBER_ME);
		if (rememberMeUsername != null) {
			setUsername(rememberMeUsername);
			setRememberMe(true);
		}
	}, [])


	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (username.trim() == "" || password.trim() == "") {
			setAlertType("error")
			setAlertMessage("Please fill empty fields");
			return;
		}

		const body = JSON.stringify({
			username: username,
			password: password
		});

		const response = await fetch(`${ApiUtils.getApiUrl()}/auth/login`, {
			method: "post",
			body: body,
			headers: {
				"Content-Type": "application/json"
			},
		});

		const jsonData = await response.json();
		console.log(jsonData);

		if (jsonData.status) {
			if (rememberMe) {
				Storage.set(LocalStorageKeys.REMEMBER_ME, username);
			}
			else {
				Storage.clear(LocalStorageKeys.REMEMBER_ME);
			}

			setAlertType("success")
			setAlertMessage("Welcome")

			Storage.set(LocalStorageKeys.TOKEN, jsonData.data.token);
			router.push('/home');
		}
		else {
			setAlertType("error")
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
						Login
					</Typography>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						<FormControlLabel
							control={<Checkbox onClick={() => setRememberMe(!rememberMe)} checked={rememberMe} color="primary" />}
							label="Remember me"
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
							Login
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="/auth/forgot-password" variant="body2">
									Can not login?
								</Link>
							</Grid>
							<Grid item>
								<Link href="/auth/sign-up" variant="body2">
									{"Don't have an account? Sign Up"}
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