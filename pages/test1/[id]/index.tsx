import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LocalStorageKeys } from "../../../types/enums/local-storage-keys";
import { ApiUtils } from "../../../utils/api-utils";
import { Storage } from '../../../utils/storage';


const Test1 = ({ postProp }: any) => {
    const router = useRouter();
    const paths = router.asPath.split("/");;
    const postId = paths[paths.length - 1];

    const [post, setPost] = useState(postProp);

    const fetchData = async () => {
        const token = Storage.get(LocalStorageKeys.TOKEN) || "";
        console.log("CLR");
        
        const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getById/${postId}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const jsonData: any = await res.json();
        console.log(jsonData);

        setPost(jsonData.data);
    }

    useEffect(() => {
        if (post == null) {
            fetchData();
        }
    }, [])

    return (
        <div>
             <p key={1}>{postProp._id}</p>
        </div>
    )
}

export const getServerSideProps = async (context: any) => {
    const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getById/${context.params.id}`)
    const jsonData: any = await res.json();
    console.log(res);
    console.log(jsonData);
    return {
        props: {
            postProp: jsonData.data
        },
    }
}

export default Test1
