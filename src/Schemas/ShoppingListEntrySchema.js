import * as Yup from 'yup';

const ShoppingListEntrySchema = Yup.object().shape({
    product_name: Yup.string()
        .required('Pole wymagane')
        .matches(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s,.-]+$/, 'Nazwa zawiera niedozwolone znaki'),
    type: Yup.string().required('Pole wymagane'),
    unit_id: Yup.number().when('type', {
        is: 'raw_product',
        then: () => Yup.number().required('Pole wymagane'),
        otherwise: () => Yup.number().notRequired()
    }),
    amount: Yup.number().when('type', {
        is: 'raw_product',
        then: () => Yup.number()
            .required('Pole wymagane')
            .integer('tylko liczby całkowite')
            .min(1, 'Wartość musi być większa od 0')
            .max(1000000, 'Nieprawidłowa wartość'),
        otherwise: () => Yup.number().notRequired()
    }),
});

export default ShoppingListEntrySchema;
