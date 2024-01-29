import {useState} from "react";
import {Box, Tab, Tabs} from "@mui/material";
import CustomTabPanel from "@/Components/CustomTabPanel/CustomTabPanel";
import styled from "styled-components";
import CategoriesView from "@/Views/Dashboard/Settings/CategoriesView";
import RecipeTagsView from "@/Views/Dashboard/Settings/RecipeTagsView";

const Container = styled.div`
  width: calc(100% - 100px);
  background-color: white;
  min-height: calc(100% - 100px);
  margin: 20px auto;
  padding: 30px;
  border-radius: 10px;

`;


const SettingsView = () => {

    const [tab,setTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };


    return <Container>
        <h2>Ustawienia</h2>
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example" centered={true} >
                    <Tab label="Kategorie"  />
                    <Tab label="Tagi przepisów"  />=
                </Tabs>
            </Box>
            <CustomTabPanel value={tab} index={0}>
                <CategoriesView />
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={1}>
                <RecipeTagsView />
            </CustomTabPanel>
        </Box>


    </Container>
}

export default SettingsView;