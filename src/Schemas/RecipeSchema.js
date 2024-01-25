import * as Yup from 'yup';


const RecipeSchema = Yup.object().shape({
    name: Yup.string().required('Pole wymangane')
        .trim()
        .min(3, 'Nazwa musi mieć minimum 3 znaki')
        .max(30, 'Nazwa może mieć maksymalnie 30 znaków'),
    prepare_time: Yup.number().required('Pole wymangane')
        .min(0, 'Wartość nie może być ujemna')
        .max(120, 'Wartość nie może być większa niż 120'),
    serving_amount: Yup.number().required('Pole wymangane')
        .min(0, 'Wartość nie może być ujemna')
        .max(10, 'Wartość nie może być większa niż 10'),


    //.matches(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s,.-]+$/, 'Nazwa zawiera niedozwolone znaki'),

});

export default RecipeSchema;