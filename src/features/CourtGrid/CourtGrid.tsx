import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import {getMonthTimeState} from 'features/courtgrid/courtAPI'
import {PlaceState, DateState} from 'models'
import {DateTime} from 'ts-luxon'
import { Grid, _ } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import styles from 'features/courtgrid/CourtGrid.module.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { showLoading } from './spinnerSlice';
import Button from '@mui/material/Button';
import SportsTennisOutlinedIcon from '@mui/icons-material/SportsTennisOutlined';

export function CourtGrid() {
  const [dataDate, setDataDate] = useState<DateState>({});
  const [dateColumn, setDateColumn] = useState<Array<string>>();
  const dispatch = useDispatch();

  useEffect(()=>{
    const getPlaceState = async () => {
      dispatch(showLoading(true));
      const placeState: PlaceState[] = await getMonthTimeState();
      let dateState: DateState = {};

      placeState.forEach((e: PlaceState) => {
        const weekday = DateTime.fromISO(e.date, {locale:"kr"}).toFormat("EEE");
        const dateweek = `${e.date} (${weekday})`;
        dateState[dateweek] ? dateState[dateweek].push(e) : dateState[dateweek] = [e];

      });

      const dateOrderState: any = {};
        Object.keys(dateState).sort().forEach((key: any)=>{
          dateState[key].sort((a: any, b: any) => (
            a.start_time > b.start_time ? 1 : -1
          ));
          dateOrderState[key] = dateState[key];

      });

      setDataDate(dateOrderState);
      setDateColumn(Object.keys(dateOrderState));
      dispatch(showLoading(false));
      
    };

    getPlaceState();

  }, [dispatch]);

  function copy(row: any){
    console.log(row);
    const place_cd = row[3].data;
    const time_no = `${row[4].data};${row[5].data};${row[6].data.replace(':', '')};${row[7].data.replace(':', '')};1`;
    const rent_date = row[8].data;

    const scriptString: string = `
      var data = new URLSearchParams({
        "action": "write",
        "comcd": "YCS04",
        "part_cd": "02",
        "place_cd": "${place_cd}",
        "time_no": "${time_no}", 
        "rent_type": "1001",
        "rent_date": "${rent_date}"
      }).toString();
      $.ajax({
        type: "POST",
        url: '/fmcs/4',
        data: data,
        success: function(data)
        {
          var popup = window.open("", "_blank");
            popup.document.write(data);
            setTimeout(()=>{
              var popDoc = $(popup.document);
              var name = popDoc.find("#mem_nm").val();
              popDoc.find("#team_nm").val(name);    
              popDoc.find("#team_yn2").prop("checked", true);
              popDoc.find("#users").val(4);    
              popDoc.find("#purpose").val("건강 증진");    
              popDoc.find("#agree_use1").prop("checked", true);
            
            }, 300);
            
        }
      });
    `;  

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(scriptString);
    } else {
        // Use the 'out of viewport hidden text area' trick
        const textArea = document.createElement("textarea");
        textArea.value = scriptString;
            
        // Move textarea out of the viewport so it's not visible
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
            
        document.body.prepend(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (error) {
            console.error(error);
        } finally {
            textArea.remove();
        }
    };

    setTimeout(() => {
      window.open("https://www.ycs.or.kr/fmcs/4", '_blank');
    }, 500);
  }

  return (
    <div>

      <div>
      {
        dateColumn?.map((key, index) => (
          <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{key}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={styles.gridDiv}>
                  <Grid
                    data={dataDate[key]}
                    columns={[
                      {
                        name: '시간',
                        data: (row: any) => `${row.start_time} ~ ${row.end_time}`,
                        sort: true
                      },
                      {
                        name: '장소',
                        data: (row: any) => `코트-${row.place_cd.padStart(2, 0)}`
                      },
                      { 
                        name: '예약',
                        formatter: (cell: any, row: any) => _(
                          <Button color="success" size="small" variant="outlined" onClick={()=>{copy(row._cells)}} startIcon={<SportsTennisOutlinedIcon/>} > </Button>
                        ),
                      },
                      {
                        id: 'place_cd',
                        hidden: true
                      },
                      {
                        id: 'time_no',
                        hidden: true
                      },
                      {
                        id: 'time_nm',
                        hidden: true
                      },
                      {
                        id: 'start_time',
                        hidden: true
                      },
                      {
                        id: 'end_time',
                        hidden: true
                      },
                      {
                        id: 'date',
                        hidden: true
                      },
                    ]}
                  >
                  </Grid>
                </div>
              </AccordionDetails>
          </Accordion>
        ))
      }
      </div>
    </div>
  );
}
