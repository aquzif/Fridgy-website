import {useFormik} from "formik";
import LoginFormSchema from "@/Schemas/LoginFormSchema";
import {useState} from "react";
import AuthAPI from "@/API/AuthAPI";
import toast from "react-hot-toast";
import store from "@/Store/store";
import {login} from "@/Store/Reducers/AuthReducer";
import styled from "styled-components";
import backgroundImage from "@/Assets/login-bg.jpg";




const Background = styled.div`
    background-image: url(${backgroundImage});
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    @media (max-width: 768px) {
        background-image: none;
        background-color: #2B2B2B;
    }
`;

const Container = styled.div`
    width: 300px;
    height: 100vh;
    padding: 0px 50px;
    background-color: #2B2B2B;

    //100vw width on mobile
    @media (max-width: 768px) {
        margin-left: auto;
        margin-right: auto;
    }
`;

const Title = styled.p`
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    padding-top: 120px;
    color: #FACC2C;
`;

const Input = styled.input`
    width: calc(100% - 40px);
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 0 20px;
    margin-top: 20px;
    background-color: white;

    &[error] {
        border-color: red;
    }
`;

const InputLabel = styled.span`

`;

const SubmitButton = styled.button`
    padding: 10px 30px;
    border-radius: 20px;
    margin-left: auto;
    margin-right: auto;
    display: block;
    margin-top: 20px;
    border: 1px solid #079000;
    background-color: #079000;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
`;


const LoginView = () => {

    const [isLogining, setIsLogining] = useState(false);

    const tryLogin = async (values) => {
        let result = await AuthAPI.login(values.email,values.password);

        if(result.status === 401) {
            throw new Error('Invalid credentials');
        }

        store.dispatch(login(result.data));

    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginFormSchema,
        onSubmit: async values => {
            setIsLogining(true);

            await toast.promise(tryLogin(values), {
                loading: 'Logowanie...',
                success: 'Zalogowano pomyślnie',
                error: 'Błędne dane logowania',
            }).catch((err) => {
                console.log(err);
                setIsLogining(false);
            });


        }
    });

    return (
        <Background>
            <Container>
                <Title>
                    Witaj w fridgy!
                </Title>
                <form onSubmit={formik.handleSubmit}>
                    <Input
                        type={'text'}
                        name={'email'}
                        placeholder={'email'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    <InputLabel>{formik.touched.email && formik.errors.email}</InputLabel>
                    <Input
                        type={'password'}
                        name={'password'}
                        placeholder={'Password'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    <InputLabel>{formik.touched.password && formik.errors.password}</InputLabel>
                    <SubmitButton type="submit">Zaloguj</SubmitButton>
                </form>
            </Container>
        </Background>
    );

    return (
        <>
            <div className="bg-img">
                <form onSubmit={formik.handleSubmit}>
                    <input
                        type={'text'}
                        name={'email'}
                        placeholder={'email'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    /> <br/>
                    <span>{formik.touched.email && formik.errors.email}</span> <br/>
                    <input
                        type={'password'}
                        name={'password'}
                        placeholder={'Password'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    /> <br/>
                    <span>{formik.touched.password && formik.errors.password}</span> <br/>
                    <button disabled={isLogining} type="submit" >Login</button>
                </form>
            </div>
        </>
    )

}

export default LoginView;
