import type { NextPage } from 'next'

import React, { useEffect } from "react";
import Router from 'next/router'


const Home: NextPage = () => {

	useEffect(() => {
		Router.push('/home')
	});

	return (<></>)
}

export async function getServerSideProps(context: any) {
	return {
		redirect: {
			permanent: true,
			destination: "/home"
		}
	}
}

export default Home
