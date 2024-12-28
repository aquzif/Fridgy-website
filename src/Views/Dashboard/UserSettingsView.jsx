import {Container} from "@/Components/Common/Common";
import {useEffect, useState} from "react";
import UserAPI from "@/API/UserAPI";
import {FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import FAB from "@/Components/FAB/FAB";
import {Save} from "@mui/icons-material";
import {useFormik} from "formik";
import SettingsInputs from "@/Config/SettingsInputs";
import ArrayUtils from "@/Utils/ArrayUtils";
import UserSchema from "@/Schemas/UserSchema";
import toast from "react-hot-toast";


const UserSettingsView = () => {

    const [user,setUser] = useState(null);

    useEffect(() => {
        load();
    },[]);

    const load = async () => {
        try {
            const response = await UserAPI.getUser();
            setUser(response.data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if(user !== null) {
            console.log(user);
            formik.setFieldValue('weight',user.weight);
            formik.setFieldValue('height',user.height);
            formik.setFieldValue('kg_to_lose_per_week',user.kg_to_lose_per_week);
            formik.setFieldValue('age',user.age);
            formik.setFieldValue('gender',user.gender)
            formik.setFieldValue('physical_activity_coefficient',parseFloat(user.physical_activity_coefficient));
            formik.setFieldValue('meals_per_day',user.meals_per_day);
        }
    },[user]);

    const formik = useFormik({
        initialValues: {
            weight: 0,
            height: 0,
            kg_to_lose_per_week: 0,
            age: 0,
            gender: 'male',
            physical_activity_coefficient: 1.2,
            meals_per_day: 1,
        },
        validationSchema: UserSchema,
        validateOnChange: true,
        onSubmit: async (values) => {
            await toast.promise(UserAPI.updateUser(values), {
                loading: 'Zapisywanie...',
                success: 'Zapisano!',
                error: 'Wystąpił błąd!'
            })
        }
    });

    return <Container>
        <h2 style={{paddingBottom: '10px'}} >Ustawienia</h2>
        <FAB
            icon={<Save />}
            onClick={formik.handleSubmit}
        />
        <Grid container spacing={3}>
            {
                SettingsInputs.inputs.map((input,index) => {
                    return <Grid item xs={input?.xs ||6} md={input?.md ||4} lg={input?.lg ||3}>
                        <FormControl fullWidth>
                            {input.type === 'text' &&<TextField
                                variant="standard"
                                id={input.name}
                                error={formik.touched[input.name] && formik.errors[input.name] !== undefined}
                                helperText={formik.touched[input.name] && formik.errors[input.name]}
                                name={input.name}
                                value={formik.values[input.name]}
                                onChange={formik.handleChange}
                                label={input.label}
                                InputProps={input.inputProps}
                            />}
                            {input.type === 'select' && <>
                                <InputLabel variant="standard" id={input.name+'_label'} >{input.label}</InputLabel>
                                <Select
                                    variant="standard"
                                    labelId={input.name}
                                    id={input.name}
                                    name={input.name}
                                    value={formik.values[input.name]}
                                    label={input.label}
                                    onChange={formik.handleChange}
                                >
                                    {
                                        input.options.map(
                                            (option,index) =>
                                                 <MenuItem value={option.value}>{option.key}</MenuItem>
                                            )

                                    }
                                </Select>
                            </>}
                        </FormControl>
                    </Grid>
                })
            }
        </Grid>
    </Container>
}

export default UserSettingsView