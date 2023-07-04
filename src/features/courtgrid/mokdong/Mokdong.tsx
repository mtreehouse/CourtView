import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import {getMonthTimeState} from 'features/courtgrid/courtAPI'
import {PlaceState, DateState} from 'models'
import {DateTime} from 'ts-luxon'
import { Grid } from "gridjs-react";
import { html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import styles from 'features/courtgrid/CourtGrid.module.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { showLoading } from '../../../app/slices/spinnerSlice';
import Button from '@mui/material/Button';
import SportsTennisOutlinedIcon from '@mui/icons-material/SportsTennisOutlined';
import {EXPAND_BTN_TXT} from 'const'

export function Mokdong() {
  const [dataDate, setDataDate] = useState<DateState>({});
  const [dateColumn, setDateColumn] = useState<Array<string>>();
  const [expanded, setExpanded] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState(Array<number>);

  const dispatch = useDispatch();

  function accordionOnclick(index: number) {
    if (expandedAccordions.includes(index))
      setExpandedAccordions(
        expandedAccordions.filter((number) => number !== index)
      );
    else setExpandedAccordions([...expandedAccordions, index]);
  }

  function collapseAll() {
    setExpandedAccordions([]);
  }
  
  function expandAll() {
    const newArray = new Array<number>();
    dateColumn?.forEach((d, index) => newArray.push(index));
    setExpandedAccordions(newArray);
  }

  function expandOnclick(isExpanded: Boolean) {
    setExpanded(!isExpanded);
    if(isExpanded) collapseAll();
    else expandAll();
  }
  
  useEffect(()=>{
    const getPlaceState = async () => {
      dispatch(showLoading(true));
      const placeState: PlaceState[] = await getMonthTimeState();
      let dateState: DateState = {};

      placeState.forEach((e: PlaceState) => {
        const weekday = DateTime.fromISO(e.date, {locale:"kr"}).toFormat("EEE");
        const dateweek = `${DateTime.fromISO(e.date).toFormat('yyyy-MM-dd')} (${weekday})`;
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
    const place_cd = row[3].data;
    const time_no = `${row[4].data};${row[5].data};${row[6].data.replace(':', '')};${row[7].data.replace(':', '')};1`;
    const rent_date = row[8].data;

    function isMobile() {return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);}

    if(isMobile()) {
      alert(`
        날짜 : ${rent_date}
        시간 : ${row[0].data}
        장소 : ${row[1].data}
        위 내용으로 예약하십시오.
      `);
    }
    
    var url = "/fmcs/4?prev_proc=login&" + 
      new URLSearchParams({
        "action": "write",
        "comcd": "YCS04",
        "part_cd": "02",
        "place_cd": place_cd,
        "time_no": time_no, 
        "rent_type": "1001",
        "rent_date": rent_date
      }).toString();
    const scriptString: string = `
      var popup = window.open("https://www.ycs.or.kr/fmcs/4", "_blank");    
      var url = "${url}"
      setTimeout(()=>{
        popup.send_post(url);
        setTimeout(()=>{
          var popDoc = $(popup.document);
          var name = popDoc.find("#mem_nm").val();
          var phone = popDoc.find("#mobile_tel").val();    
          popDoc.find("#team_nm").val(name);    
          popDoc.find("#team_yn2").prop("checked", true);
          popDoc.find("#users").val(4);
          popDoc.find("#tel").val(phone);
          popDoc.find("#purpose").val("건강 증진");    
          popDoc.find("#agree_use1").prop("checked", true);
          popDoc.scrollTop(popDoc.height());
          
          var option = "width = 1265, height = 870, top = 100, left = 200, location = no";
          var macroWin = window.open("/macro_block?phoneNumber=" + phone, "macro", option);
          setTimeout(()=>{
            var macroDoc = $(macroWin.document);
              setTimeout(()=>{
                macroDoc.find("#message_inactive").click();
                macroDoc.find("#phone_number").val(phone.replaceAll("-",""));
              }, 3000);
          }, 300);
        }, 100);
      }, 300);  
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
          <Button
            color="success"
            size="small"
            variant="outlined"
            startIcon={<SportsTennisOutlinedIcon />}
            style={{display:'none'}}
          />
      <div className='t-r w-100'>
        <Button onClick={()=>{}}>시간 내림차순</Button>
        <Button onClick={(e)=>{expandOnclick(expanded);}}>{expanded ? EXPAND_BTN_TXT.COLLAPESE : EXPAND_BTN_TXT.EXPAND}</Button>
      </div>
      {dateColumn?.map((key, index) => (
        <Accordion 
          onChange={() => accordionOnclick(index)}
          expanded={expandedAccordions.includes(index)}
          key={index}>
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
                    name: "시간",
                    data: (row: any) => `${row.start_time} ~ ${row.end_time}`,
                    sort: true,
                  },
                  {
                    name: "장소",
                    data: (row: any) => `코트-${row.place_cd.padStart(2, 0)}`,
                    sort: true,
                  },
                  {
                    name: "예약",
                    formatter: (_: any, row: any) => html(`<div><button class="MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSuccess MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButton-root MuiButton-outlined MuiButton-outlinedSuccess MuiButton-sizeSmall MuiButton-outlinedSizeSmall css-1k9gzqu-MuiButtonBase-root-MuiButton-root" tabindex="0" type="button"><span class="MuiButton-startIcon MuiButton-iconSizeSmall css-y6rp3m-MuiButton-startIcon"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SportsTennisOutlinedIcon"><path d="M19.52 2.49C17.18.15 12.9.62 9.97 3.55c-1.6 1.6-2.52 3.87-2.54 5.46-.02 1.58.26 3.89-1.35 5.5l-4.24 4.24 1.42 1.42 4.24-4.24c1.61-1.61 3.92-1.33 5.5-1.35s3.86-.94 5.46-2.54c2.92-2.93 3.4-7.21 1.06-9.55zm-9.2 9.19c-1.53-1.53-1.05-4.61 1.06-6.72s5.18-2.59 6.72-1.06c1.53 1.53 1.05 4.61-1.06 6.72s-5.18 2.59-6.72 1.06zM18 17c.53 0 1.04.21 1.41.59.78.78.78 2.05 0 2.83-.37.37-.88.58-1.41.58s-1.04-.21-1.41-.59c-.78-.78-.78-2.05 0-2.83.37-.37.88-.58 1.41-.58m0-2c-1.02 0-2.05.39-2.83 1.17-1.56 1.56-1.56 4.09 0 5.66.78.78 1.81 1.17 2.83 1.17s2.05-.39 2.83-1.17c1.56-1.56 1.56-4.09 0-5.66C20.05 15.39 19.02 15 18 15z"></path></svg></span><span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span></button></div>`),
                    attributes: (cell: any, row: any, column: any) => {
                      return {
                          className: "gridjs-td select-column",
                          'onClick': ()=>{
                              copy(row._cells);
                          }
                      }
                    },
                  },
                  {
                    id: "place_cd",
                    hidden: true,
                  },
                  {
                    id: "time_no",
                    hidden: true,
                  },
                  {
                    id: "time_nm",
                    hidden: true,
                  },
                  {
                    id: "start_time",
                    hidden: true,
                  },
                  {
                    id: "end_time",
                    hidden: true,
                  },
                  {
                    id: "date",
                    hidden: true,
                  },
                ]}
              ></Grid>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
  </div>  );
}
