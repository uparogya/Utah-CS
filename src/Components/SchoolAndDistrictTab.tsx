import { FC, useState } from "react";
import SchoolTable from "./SchoolComponent/SchoolTable";
import DistrictTable from "./DistrictComponent/DistrictTable";
import { Container, Tab, Tabs} from '@mui/material';
import { observer } from "mobx-react-lite";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <>{children}</>}
        </div>
    );
}

const SchoolAndDistrictTab: FC = () => {

    const [tabVal, setTabVal] = useState(0);

    const tabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabVal(newValue);
    };

    return (
        <Container>
            <Tabs value={tabVal} variant='scrollable' onChange={tabChange}>
                <Tab label='District List' />
                <Tab label='Schools in Selected Districts' />
            </Tabs>
            <TabPanel value={tabVal} index={0}>
                <DistrictTable />
            </TabPanel>
            <TabPanel value={tabVal} index={1}>
                <SchoolTable />
            </TabPanel>
        </Container>
    );
};

export default observer(SchoolAndDistrictTab);