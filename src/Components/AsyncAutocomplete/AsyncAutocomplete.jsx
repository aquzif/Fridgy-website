import {Autocomplete, createFilterOptions, TextField} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, {useEffect, useState} from "react";
import useDebounce from "../../Hooks/useDebounce";
import {ray} from "node-ray/web";

const filter = createFilterOptions();



const AsyncAutocompleter = (
    {
        disabled = false,
        onSelect = () => {},
        allowCustomValues = false,
        label = '',
        onSearch,
        minSearchLength = 3,
        error='',
        filterOptions = null
    }
) => {

    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [options, setOptions] = useState([]);
    const debouncedSearchValue = useDebounce(searchValue, 500);

    if(!filterOptions)
        filterOptions =  (options, params) => {
            const filtered = options;

            if (allowCustomValues && params.inputValue !== '') {
                filtered.push({
                    inputValue: params.inputValue,
                    new: true,
                    name: params.inputValue,
                });
            }
            return filtered;
        }

    useEffect(() => {
        search();
    },[debouncedSearchValue]);

    const search = async () => {
        if(minSearchLength < 3) return;
        setIsSearching(true);

        let result = await onSearch(debouncedSearchValue);

        setIsSearching(false);
        setOptions(result || []);
    }


    const handleSelect = (event, newValue) => {
        onSelect(newValue);
    }

    return <Autocomplete
        disabled={disabled}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={handleSelect}
        options={options}
        variant="standard"
        freeSolo
        renderOption={(props, option) => <li {...props}>
            {
                option.new ? <i>{option.name}</i> : option.name
            }</li>}
        getOptionLabel={(option) => option.name || ''}
        filterOptions={filterOptions}
        renderInput={(params) => (
            <TextField
                variant={'standard'}
                {...params}
                error={error !== ''}
                helperText={error}
                label={label}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <>
                            {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                        </>
                    ),
                }}
            />
        )}
    />
}

export default AsyncAutocompleter;
