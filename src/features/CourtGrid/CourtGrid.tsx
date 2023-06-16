import React, { useState, useEffect } from 'react';
import {getMonthTimeState} from 'features/CourtGrid/courtAPI'
import {PlaceState, DateState} from 'models'
import {DateTime} from 'ts-luxon'
import { Grid } from "gridjs-react";
import { h } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import styles from 'features/CourtGrid/CourtGrid.module.css';

export function CourtGrid() {
  const [dataDate, setDataDate] = useState<DateState>({});
  const [dateColumn, setDateColumn] = useState<Array<string>>();

  useEffect(()=>{
    const getPlaceState = async () => {
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
      
      console.log("dateState", dateState);

    };

    getPlaceState();

  }, []);

  function copy(row: any){
    console.log(row);
    const place_cd = row[3].data;
    const time_no = encodeURIComponent(`${row[4].data};${row[5].data};${row[6].data.replace(':', '')};${row[7].data.replace(':', '')};1`);
    const rent_type = "1001";
    const rent_date = row[8].data;

    const scriptString: string = `
      var url = "/fmcs/4";
      var arr_elem = {
          "action": "write",
          "comcd": "YCS04",
          "part_cd": "02",
          "place_cd": "${place_cd}",
          "time_no": "${time_no}", 
          "rent_type": "${rent_type}",
          "rent_date": "${rent_date}"
      };
      
      var form = $('<form id="form_send_post_'+ (new Date()).getTime() +'" method="post" action="" style="position: absolute;width:0;height:0;overflow:hidden;font-size:0;"></form>');
      form.attr('action', url);
      $(document.body).append(form);
      
      for(key in arr_elem)
      {
        var input = $('<input type="hidden" name="" value=""/>');
        input.attr('name', key);
        input.val(decodeURIComponent(arr_elem[key]));
        form.append(input);
      }
      
      form.submit();    
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
          <div className={styles.gridDiv}>
            <div className={styles.dateTitle}>{key}</div>
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
                  data: (row: any) => `코트-${row.place_cd}`
                },
                { 
                  name: '예약',
                  formatter: (cell: any, row: any) => {
                    return h('button', {
                      className: 'py-2 mb-4 px-4 border rounded-md text-white bg-blue-600',
                      onClick: (...args2: any) => {
                        copy(row._cells);
                      }
                    }, '복사');
                  }
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
        ))
      }
      </div>
    </div>
  );
}
