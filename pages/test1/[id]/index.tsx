import { ApiUtils } from "../../../utils/api-utils";


const Test1 = ({ postProp }: any) => {
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
