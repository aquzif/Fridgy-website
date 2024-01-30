import * as Yup from 'yup';


const UserSchema = Yup.object().shape({
    weight: Yup.number().required('Waga jest wymagana')
            .min(1, 'Waga musi być większa od 0')
            .max(500, 'Waga musi być mniejsza od 500')
            .integer('Waga musi być liczbą całkowitą'),
    height: Yup.number().required('Wzrost jest wymagany')
            .min(80, 'Wzrost musi być większy od 80')
            .max(300, 'Wzrost musi być mniejszy od 300')
            .integer('Wzrost musi być liczbą całkowitą'),
    kg_to_lose_per_week: Yup.number().required('Redukcja jest wymagana')
            .min(0, 'Redukcja musi być większa od 0')
            .max(1, 'Redukcja musi być mniejsza od 1'),
    age: Yup.number().required('Wiek jest wymagany')
            .min(16, 'Wiek musi być większy od 16')
            .max(120, 'Wiek musi być mniejszy od 120'),
    meals_per_day: Yup.number().required('Posiłki dziennie są wymagane')
            .min(1, 'Posiłki dziennie muszą być większe od 0')
            .max(5,'Posiłki dziennie muszą być mniejsze od 5')

});


export default UserSchema;

