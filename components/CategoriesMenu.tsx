import { Divider, ListItemText, MenuItem, MenuList, Paper } from "@mui/material";
import { CategoryArr } from "../types/enums/Category";

interface CategoriesMenuProps {
    selected: any,
    setSelected: any
}

export default function CategoriesMenu({ selected, setSelected }: CategoriesMenuProps) {

    const mapCategories = () => {
        const categoryList = [];

        for (let i = 0; i < CategoryArr.length; i++) {
            categoryList.push(
                <MenuItem selected={selected == i ? true : false} onClick={(e: any) => setSelected(i)} key={i}>
                    <ListItemText>{CategoryArr[i]}</ListItemText>
                </MenuItem>
            )
            if (i == 0) {
                categoryList.push(<Divider key={-1} />);
            }
        }

        return categoryList;
    }

    return (
        <Paper sx={{ width: 300, maxWidth: '100%' }}>
            <MenuList>
                {mapCategories()}
            </MenuList>
        </Paper>
    );
}