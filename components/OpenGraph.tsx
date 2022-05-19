interface OpenGraphProps {
    url: string,
    title: string,
    description: string,
    image: string
}

export default function OpenGraph({ url, title, description, image }: OpenGraphProps) {
    return (
        <>
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title && title != null ? title : ""} />
            <meta property="og:description" content={description && description != null ? description : ""} />
            <meta property="og:image" content={image && image != null ? image : ""} />
        </>
    );
}