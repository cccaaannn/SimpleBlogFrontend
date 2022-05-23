import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";

interface ComboBoxProps {
    name: string,
    inputsList: any,
    selected: any,
    setSelected: any,
    sx?: any
}

export default function ComboBox({ name, inputsList, selected, setSelected, sx }: ComboBoxProps) {

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
        <FormControl variant="outlined" sx={ sx ? sx: { display: 'flex'  }}>
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