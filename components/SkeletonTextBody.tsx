import { Skeleton } from "@mui/material";


interface SkeletonTextBodyProps {
    lineCount: number
}

export default function SkeletonTextBody({ lineCount }: SkeletonTextBodyProps) {

    const getSkeletonBody = () => {
        const lines: any[] = [];
        for (let i = 0; i < lineCount; i++) {
            if (i % 3 == 0 && i != 0) {
                lines.push(
                    <Skeleton animation="wave" height={10} width="60%" style={{ marginBottom: 20 }} />
                )
            }
            else {
                lines.push(
                    <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
                )
            }
        }
        return lines;
    }

    return (
        <>
            {getSkeletonBody()}
        </>
    );
}