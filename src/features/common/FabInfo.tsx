import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import { Fab } from '@mui/material';

interface FabInfoProps {
    onClick: ()=>void;
}

export function FabInfo(props: FabInfoProps) {
    
    return (
        <Fab onClick={props.onClick} color="primary" size="small" aria-label="add" id='fabInfo'>
            <QuestionMarkOutlinedIcon/>
        </Fab>
    )

}