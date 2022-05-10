import type { NextPage } from 'next'

import React, { useEffect } from "react";
import Router from 'next/router'


const Home: NextPage = () => {

	useEffect(() => {
		Router.push('/home')
	});

	return (
		<>
		</>
	)
}

export default Home
