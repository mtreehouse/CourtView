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
                  formatter: (...args1: any) => {
                    return h('button', {
                      className: 'py-2 mb-4 px-4 border rounded-md text-white bg-blue-600',
                      onClick: (...args2: any) => {
                        console.log("//////////////args1");
                        console.log(JSON.stringify(args1));
                        console.log("//////////////args2");
                        console.log(JSON.stringify(args2))
                        window.open("http://www.naver.com", '_blank');
                      }
                    }, '선택');
                  }
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
