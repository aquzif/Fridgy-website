import {InputAdornment} from "@mui/material";

export default {
    inputs: [
        {
            name: 'physical_activity_coefficient',
            type: 'select',
            lg: 6,
            md: 8,
            xs: 12,
            options: [
                {
                    key: <span>
                        Znikoma aktywność fizyczna<br />
                        <small>brak ćwiczeń i siedzący tryb życia np. praca biurowa</small>
                    </span>,
                    value: 1.2
                },{
                    key: <span>
                        Niska aktywność fizyczna<br />
                        <small>siedzący tryb życia i częste spacery lub 1-2 treningi w tygodniu</small>
                    </span>,
                    value: 1.4
                },{
                    key: <span>
                        Średnia aktywność fizyczna<br />
                        <small>praca fizyczna (np. w sklepie) lub tryb życia siedzący i 3-5 treningi w tygodniu</small>
                    </span>,
                    value: 1.7
                },{
                    key: <span>
                        Wysoka aktywność fizyczna<br />
                        <small>ciężka praca fizyczna (np. na budowie, na magazynie) lub codzienne treningi</small>
                    </span>,
                    value: 1.9
                }
            ],
            label: 'Aktywność fizyczna',
            inputProps: {}
        },{
            name: 'weight',
            type: 'text',
            label: 'Waga',
            inputProps: {
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }
        },{
            name: 'height',
            type: 'text',
            label: 'Wzrost',
            inputProps: {
                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
            }
        },{
            name: 'kg_to_lose_per_week',
            type: 'text',
            label: 'Redukcja (na tydzień)',
            inputProps: {
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }
        },{
            name: 'age',
            type: 'text',
            label: 'Wiek',
            inputProps: {}
        },{
            name: 'gender',
            type: 'select',
            options: [
                {
                    key: 'Mężczyzna',
                    value: 'male'
                },{
                    key: 'Kobieta',
                    value: 'female'
                }
            ],
            label: 'Płeć',
            inputProps: {}
        },{
            name: 'meals_per_day',
            type: 'text',
            label: 'Posiłki dziennie',
            inputProps: {}
        }
    ]
}