import { CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, Grid } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import Store from "../Interface/Store";



const DataLoadingModal: FC = () => {
    const store = useContext(Store);

    return <Dialog open={store.dataLoading} >
        <DialogTitle>Just one second</DialogTitle>
        <DialogContent >
            <Grid container spacing={2}>
                <Grid item>
                    <CircularProgress />
                </Grid>
                <Grid item style={{ alignSelf: "center" }}>
                    <DialogContentText>

                        We are fetching required data.
                    </DialogContentText>
                </Grid>
            </Grid>
        </DialogContent>

    </Dialog>;
};
export default observer(DataLoadingModal);
