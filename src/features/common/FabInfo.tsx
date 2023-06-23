import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import { Fab } from '@mui/material';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
interface FabInfoProps {
    title?: string;
    children?: React.ReactNode;
}

export function FabInfo({title, children}: FabInfoProps) {
    const [open, setOpen] = React.useState(false);

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <div>
            <Fab onClick={handleOpen} color="primary" size="small" aria-label="add" id='fabInfo'>
                <QuestionMarkOutlinedIcon/>
            </Fab>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {children}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
        
    )

}