import { useRouter } from 'next/router'

import { ReactNode, useEffect, useState } from 'react'

import { SecuredPaths } from '../utils/secured-paths';
import { AuthUtils } from '../utils/auth-utils';
import { Roles } from '../types/enums/Roles';


export default function Guard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(true);

    useEffect(() => {
        // on initial load - run auth check 
        authCheck(router.pathname);

        // on route change start - hide page content by setting authorized to false  
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const authCheck = (url: any): void => {
        const paths: string[] = url.split("/");
        const isLoggedIn: boolean = AuthUtils.isLoggedIn();

        // Just domain
        if (paths.length == 0) {
            setAuthorized(true);
            return;
        }

        // Not logged in
        if (!isLoggedIn && (SecuredPaths.MEMBER_ONLY_PATHS.includes(paths[1]) || SecuredPaths.ADMIN_ONLY_PATHS.includes(paths[1]))) {
            setAuthorized(false);
            router.replace('/auth/login');
        }
        // Logged in
        else if (isLoggedIn && SecuredPaths.PUBLIC_ONLY_PATHS.includes(paths[1])) {
            setAuthorized(false);
            router.replace('/home');
        }
        // Not admin
        else if (AuthUtils.isRole(Roles.USER) && SecuredPaths.ADMIN_ONLY_PATHS.includes(paths[1])) {
            setAuthorized(false);
            router.replace('/home');
        }
        else {
            setAuthorized(true);
        }
    }

    return (<>{authorized && children}</>)

}
