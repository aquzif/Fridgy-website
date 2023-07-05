import * as Yup from 'yup';

const ShoppingListEntrySchema = Yup.object().shape({
    product_name: Yup.string()
        .required('Pole wymagane')
        .matches(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s,.-]+$/, 'Nazwa zawiera niedozwolone znaki'),
    unit_name: Yup.string()
        .required('Pole wymagane')
        .matches(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s,.-]+$/, 'Nazwa zawiera niedozwolone znaki'),
    amount: Yup.number()
        .required('Pole wymagane')
});

export default ShoppingListEntrySchema;