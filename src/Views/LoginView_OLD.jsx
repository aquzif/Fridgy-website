import styled from "styled-components";
import backgroundImage from "../Assets/login-bg.jpg";
import LoginFormSchema from "../Schemas/LoginFormSchema";


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
`;

const Container = styled.div`
    width: 300px;
    height: 100vh;
    padding: 0px 50px;
    background-color: #2B2B2B;
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


const LoginView_OLD = () => {

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
        validationSchema: LoginFormSchema,
    });

    return (
        <Background>
            <Container>
                <Title>
                    Witaj w fridgy
                </Title>
                <Input
                    type="text"
                    placeholder="Email"
                    error={formik.touched.email && formik.errors.email}
                />
                <InputLabel>{formik.touched.email && formik.errors.email}</InputLabel>
                <Input
                    type="password"
                    placeholder="Hasło"
                    error={formik.touched.password && formik.errors.password}
                />
                <InputLabel>{formik.touched.password && formik.errors.password}</InputLabel>
                <SubmitButton type="submit">Zaloguj</SubmitButton>
            </Container>
        </Background>
    );
}

export default LoginView_OLD;
