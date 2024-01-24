import * as Yup from 'yup';


const ProductUnitSchema = Yup.object().shape({
    name: Yup.string().required('Pole wymangane')
        .trim()
        .min(1, 'Nazwa musi mieć minimum 3 znaki')
        .max(10, 'Nazwa może mieć maksymalnie 30 znaków'),
    grams_per_unit: Yup.number().required('Pole wymangane')
        .min(0, 'Wartość nie może być ujemna')
        .max(10000, 'Wartość nie może być większa niż 10000'),
    //.matches(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s,.-]+$/, 'Nazwa zawiera niedozwolone znaki'),

});

export default ProductUnitSchema;