import * as Yup from 'yup';


const ShoppingListSchema = Yup.object().shape({
    name: Yup.string().required('Pole wymangane')
        .trim()
        .min(3, 'Nazwa musi mieć minimum 3 znaki')
        .max(30, 'Nazwa może mieć maksymalnie 30 znaków')
    //.matches(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s,.-]+$/, 'Nazwa zawiera niedozwolone znaki'),

});

export default ShoppingListSchema;