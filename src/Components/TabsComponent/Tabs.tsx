import FolderTabs from '@mui/material/Tabs';
import FolderTab from '@mui/material/Tab';
import { FC, ChangeEvent, useState, useContext } from "react";
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import { CourseCategoryColor } from "../../Preset/Colors";
import Store from '../../Interface/Store';

interface TabsComponentProps {
    tabVal: any;
    tabChange: (event: ChangeEvent<{}>, newValue: number) => void;
}

const TabsComponent: FC<TabsComponentProps> = ({ tabVal, tabChange }) => {
    const store = useContext(Store);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleListItemClick = (index: number) => {
        const syntheticEvent: any = {
            target: document.createElement('div'),
            preventDefault: () => {},
            stopPropagation: () => {},
        };
        tabChange(syntheticEvent, index);
        setIsSidebarOpen(false);
      };

  return (
    <div>
    <div style={{ display: 'flex', flexDirection: 'row',justifyContent: 'space-between'}}>
      <Hidden mdUp>
        <h3 style={{color: CourseCategoryColor[store.currentShownCSType]}}>
        {
            tabVal === 0 ? (
                <span>Overview</span>
            ) : tabVal === 1 ? (
                <span>District & School Data</span>
            ) : tabVal === 2 ? (
                <span>Statewide Trends</span>
            ) : tabVal === 3 ? (
                <span>Course Data</span>
            ) : tabVal === 4 ? (
                <span>Course Categories</span>
            ) : (
                <span></span>
            )
        }
      </h3>
      <IconButton onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
      </Hidden>
    </div>

      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      >
        <List>
          {/* Sidebar items */}
          <ListItem onClick={() => handleListItemClick(0)} style={{margin:'5px'}}>
            <ListItemText primary="Overview" />
          </ListItem>

          <ListItem onClick={() => handleListItemClick(1)} style={{margin:'5px'}}>
            <ListItemText primary="District & School Data" />
          </ListItem>

          <ListItem onClick={() => handleListItemClick(2)} style={{margin:'5px'}}>
            <ListItemText primary="Statewide Trends" />
          </ListItem>

          <ListItem onClick={() => handleListItemClick(3)} style={{margin:'5px'}}>
            <ListItemText primary="Course Data" />
          </ListItem>

          <ListItem onClick={() => handleListItemClick(4)} style={{margin:'5px'}}>
            <ListItemText primary="Course Categories" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>

      <Hidden mdDown>
      <FolderTabs value={tabVal} variant="scrollable" onChange={tabChange}>
        <FolderTab
          label="Overview"
          className={tabVal === 0 ? 'selectedTab' : 'unselectedTab'}
          style={{ fontSize: '18px', backgroundColor: tabVal === 0 ? 'lightgray' : 'white', borderTopRightRadius: '20px', borderTopLeftRadius: '20px' }}
        />
        <FolderTab
          label="District & School Data"
          className={tabVal === 1 ? 'selectedTab' : 'unselectedTab'}
          style={{ fontSize: '18px', backgroundColor: tabVal === 1 ? 'lightgray' : 'white', borderTopRightRadius: '20px', borderTopLeftRadius: '20px' }}
        />
        <FolderTab
          label="Statewide Trends"
          className={tabVal === 2 ? 'selectedTab' : 'unselectedTab'}
          style={{ fontSize: '18px', backgroundColor: tabVal === 2 ? 'lightgray' : 'white', borderTopRightRadius: '20px', borderTopLeftRadius: '20px' }}
        />
        <FolderTab
          label="Course Data"
          className={tabVal === 3 ? 'selectedTab' : 'unselectedTab'}
          style={{ fontSize: '18px', backgroundColor: tabVal === 3 ? 'lightgray' : 'white', borderTopRightRadius: '20px', borderTopLeftRadius: '20px' }}
        />
        <FolderTab
          label="Course Categories"
          className={tabVal === 4 ? 'selectedTab' : 'unselectedTab'}
          style={{ fontSize: '18px', backgroundColor: tabVal === 4 ? 'lightgray' : 'white', borderTopRightRadius: '20px', borderTopLeftRadius: '20px' }}
        />
      </FolderTabs>
      </Hidden>
    </div>
  );
};

export default TabsComponent;