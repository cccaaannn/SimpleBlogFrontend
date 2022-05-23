import { Divider, ListItemText, MenuItem, MenuList, Paper, Skeleton, Typography } from "@mui/material";
import { CategoryArr } from "../types/enums/Category";

interface CategoriesMenuProps {
    selected: any,
    setSelected: any,
    loading: boolean
}

export default function CategoriesMenu({ selected, setSelected, loading  }: CategoriesMenuProps) {

    const mapCategories = () => {
        const categoryList = [];

        for (let i = 0; i < CategoryArr.length; i++) {
            categoryList.push(
                <MenuItem selected={selected == CategoryArr[i] ? true : false} onClick={(e: any) => setSelected(CategoryArr[i])} key={i}>
                    {loading ?
                        <Skeleton animation="wave" height={10} width="60%" style={{ marginBottom: 6 }} />
                        :
                        <ListItemText>{CategoryArr[i]}</ListItemText>}
                </MenuItem>
            )
            if (i == 0) {
                categoryList.push(<Divider key={-2} />);
            }
        }

        return categoryList;
    }

    return (
        <Paper sx={{ width: 300, maxWidth: '100%' }}>
            <Typography align="center" sx={{ pt: 1, pb: 1, fontWeight: 'bold' }}>
                Categories
            </Typography>
            <Divider key={-1} />
            <MenuList>
                {mapCategories()}
            </MenuList>
        </Paper>
    );
}