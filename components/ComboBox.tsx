import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";

interface ComboBoxProps {
    name: string,
    inputsList: any,
    selected: any,
    setSelected: any,
    minWidth?: any
}

export default function ComboBox({ name, inputsList, selected, setSelected, minWidth }: ComboBoxProps) {

    if (!minWidth) {
        minWidth = 100;
    }

    const mapMenuItems = () => {
        const menuItems: any = [];
        for (let i = 0; i < inputsList.length; i++) {
            menuItems.push(
                <MenuItem value={inputsList[i]} key={i}>{inputsList[i]}</MenuItem>
            )
        }
        return menuItems;
    }

    return (
        <FormControl variant="outlined">
            <InputLabel
                htmlFor={name + "-select-box"}
            >
                {name}
            </InputLabel>
            <Select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                input={
                    <OutlinedInput
                        sx={{ minWidth: minWidth }}
                        name={name}
                        id={name + "-select-box"}
                    />
                }
            >
                {mapMenuItems()}
            </Select>
        </FormControl>
    );
}