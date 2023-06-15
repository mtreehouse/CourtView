import React, { useMemo, useState, useEffect } from 'react';
import {getMonthTimeState} from 'features/grid/courtAPI'
import {PlaceState, DateState} from 'models'
import {DateTime} from 'ts-luxon'

export function Grid() {
  const [dataPlace, setDataPlace] = useState<PlaceState[]>([]);
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

      // console.log("placeState", placeState);
      console.log("dateState", dateState);

      setDataPlace(dateState["20230613"]);
      setDataDate(dateState);
      setDataColumn(Object.keys(dateState));
  
    };

    getPlaceState();

  }, []);


  return (
    <div>
      <div>

      </div>
    </div>
  );
}
