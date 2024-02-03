import {Autocomplete, Chip, TextField} from "@mui/material";


const Multiselector =
(
    {
        title = 'Wartości',
        options = [
            {id: 1, name: 'Wartość 1',color: '#ff0000'},
            {id: 2, name: 'Wartość 2',color: '#00ff00'},
        ],
        selected = [],
        onChange = () => {},
        renderTags = (value, getTagProps) =>
            value.map((option, index) => (
                <Chip  variant="outlined" label={option} {...getTagProps({ index })}
                      sx={{
                          backgroundColor: '#FACC2C',
                      }}
                />
            ))

    }
) => {

    const handleSelect = (event, values) => {
        onChange(values);
    }

    return <Autocomplete
        multiple
        id="tags-standard"
        options={options}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        value={selected}
        renderTags={renderTags}
        onChange={handleSelect}
        renderInput={(params) => (
            <TextField
                {...params}
                variant="standard"
                label={title}
            />
        )}
    />
}

export default Multiselector;