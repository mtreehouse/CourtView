import React, { useMemo, useState, useEffect } from 'react';
import {getMonthTimeState} from 'features/grid/courtAPI'
import {PlaceState, DateState} from 'models'
import {DateTime} from 'ts-luxon'
import { JsonToTable } from "react-json-to-table";

export function Grid() {
  const [dataDate, setDataDate] = useState<DateState>();
  const [dataColumn, setDataColumn] = useState<DateState>();

  
  /* 
    company_code: YCS04 // 센터
    part_code: 02 // 시설
    place_code: 18 //코트 번호
    base_date: 20230615
    rent_type: 1001
    mem_no: 00234246
   */
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
          
          dateState[key].sort((a: any, b: any) => {
            delete a.comcd;
            delete a.part_cd;
            delete b.comcd;
            delete b.part_cd;
            return (a.start_time > b.start_time ? 1 : -1)
          });
          dateOrderState[key] = dateState[key];
      });

      // console.log("placeState", placeState);
      console.log("dateState", dateState);

      setDataDate(dateOrderState);

    };

    getPlaceState();

  }, []);


  return (
    <div>
      <div>
        <JsonToTable json={dataDate} />
      </div>
    </div>
  );
}
