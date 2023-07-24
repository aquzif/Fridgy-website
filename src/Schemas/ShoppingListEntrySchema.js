import * as Yup from 'yup';

const ShoppingListEntrySchema = Yup.object().shape({
    product_name: Yup.string()
        .required('Pole wymagane')
        .matches(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s,.-]+$/, 'Nazwa zawiera niedozwolone znaki'),
    unit_id: Yup.number()
        .required('Pole wymagane'),
    amount: Yup.number()
        .required('Pole wymagane')
        .integer('tylko liczby całkowite')
        .min(1, 'Wartość musi być większa od 0')
        .max(1000000, 'Nieprawidłowa wartość'),
});

export default ShoppingListEntrySchema;
