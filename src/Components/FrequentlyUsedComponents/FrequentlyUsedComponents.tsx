import CloseIcon from '@mui/icons-material/Close';
import { Typography } from "@mui/material";

export const courseTitle = (courseType: string) => {
    if(courseType == 'CSC'){
      return 'Core CS';
    }else if(courseType == 'CSB'){
      return 'Basic CS';
    }else if(courseType == 'CSA'){
      return 'Advanced CS';
    }else if(courseType == 'CSR'){
      return 'Related CS';
    }else if(courseType == 'CS'){
      return 'All CS';
    }else{
      return null;
    }
}

export const ModalTitleBar = (modalTitle: string|number, textColor: string , onClose: () => void) => {
    return(
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography id="Courses Under Category" variant="h6" component="h2" style={{ color: textColor }}> {modalTitle} </Typography>
            <button onClick={onClose} style={{ color: textColor, border: 'none', background: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}> <b>Close</b><CloseIcon style={{ marginLeft: '5px' }} /> </button>
        </div>
    );
}

export default null;