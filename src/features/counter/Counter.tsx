import React, { useMemo, useState, useEffect } from 'react';
import { DateTime } from 'ts-luxon'
import styles from './Counter.module.css';

export function Counter() {

  type DateState = {
    [key: string]: any
  };

  type PlaceState = {
    "comcd": String,
    "part_cd": String,
    "place_cd": String,
    "date": string,     //string
    "weekday": String,
    "time_nm": String,
    "start_time": String,
    "end_time": String,
    "rent_no": String,
    "time_no": String,
    "use_yn": String
  };

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
      let placeState: PlaceState[] = [];
      let dateState: DateState = {};
      const today = DateTime.now().toFormat('yyyyMMdd');

      for (let index = 1; index <= 2; index++) {
        await fetch(`/rest/facilities/place_month_time_state_list?company_code=YCS04&part_code=02&base_date=${today}&place_code=${index}`)
        .then(r=>r.json()).then(function(stateList) {
          const openMonthState = stateList.filter((s:PlaceState) => s.use_yn==="N");
          placeState.push(...openMonthState);

        })  
      };

      placeState.forEach((e: PlaceState) => {
        dateState[e.date] ? dateState[e.date].push(e) : dateState[e.date] = [e];
      });

      console.log("placeState", placeState);
      console.log("dateState", dateState);

      setDataPlace(dateState["20230613"]);
      setDataDate(dateState);
      setDataColumn(Object.keys(dateState));
  
    };

    getPlaceState();

  }, []);


  return (
    <div>
      <div className={styles.row}>

      </div>
    </div>
  );
}
