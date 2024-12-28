import * as Yup from 'yup';


const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Pole wymangane')
        .trim()
        .min(3, 'Nazwa musi mieć minimum 3 znaki')
        .max(50, 'Nazwa może mieć maksymalnie 50 znaków'),
    nutrition_energy_kcal: Yup.number().required('Pole wymangane')
        .min(0, 'Wartość nie może być ujemna')
        .max(10000, 'Wartość nie może być większa niż 10000'),
    nutrition_energy_kj: Yup.number().required('Pole wymangane')
        .min(0, 'Wartość nie może być ujemna')
        .max(10000, 'Wartość nie może być większa niż 10000'),
    nutrition_protein: Yup.number().required('Pole wymangane')
        .min(0, 'Wartość nie może być ujemna')
        .max(10000, 'Wartość nie może być większa niż 10000'),
    nutrition_carbs: Yup.number().required('Pole wymangane')
        .min(0, 'Wartość nie może być ujemna')
        .max(10000, 'Wartość nie może być większa niż 10000'),
    nutrition_fat: Yup.number().required('Pole wymangane')
        .min(0, 'Wartość nie może być ujemna')
        .max(10000, 'Wartość nie może być większa niż 10000'),
    nutrition_sugar: Yup.number().required('Pole wymangane')
        .min(0, 'Wartość nie może być ujemna')
        .max(10000, 'Wartość nie może być większa niż 10000'),
    nutrition_salt: Yup.number().required('Pole wymangane')
        .min(0, 'Wartość nie może być ujemna')
        .max(10000, 'Wartość nie może być większa niż 10000'),
    //.matches(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s,.-]+$/, 'Nazwa zawiera niedozwolone znaki'),

});

export default ProductSchema;