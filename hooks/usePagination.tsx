// react
import { useState, useEffect } from "react";

const usePagination = (allData: any) => {    
    const [pageCount, setPageCount] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [activeData, setActiveData] = useState([] as any[]);
 
    useEffect(() => {
        if (allData != null) {
            const pages = Math.ceil(allData.length / pageSize);
            setPageCount(pages)

            const data = allData.slice((selectedPage - 1) * pageSize, selectedPage * pageSize);
            setActiveData(data)
        }
    }, [allData, selectedPage, pageSize])


    return [activeData, pageCount, selectedPage, setSelectedPage, pageSize, setPageSize] as const;
}

export default usePagination;