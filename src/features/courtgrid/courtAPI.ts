import {URL_YCS, URL_MONTH_TIME} from 'const'
import {DateTime} from 'ts-luxon'
import {PlaceState} from 'models'

export async function getMonthTimeState() {
  return new Promise<PlaceState[]>(async (resolve) =>{
    let placeState: PlaceState[] = [];
    const today = DateTime.now().toFormat('yyyyMMdd');
  
    for (let index = 1; index <= 18; index++) {
      /* 
        company_code : 센터
        part_code : 시설
        place_code : 코트 번호
        base_date : 20230615
        rent_type: 1001
        mem_no: 00234246
      */
      await fetch(`${URL_MONTH_TIME}?company_code=YCS04&part_code=02&base_date=${today}&place_code=${index}`)
      .then(r=>r.json()).then(function(stateList) {
        const openMonthState = stateList.filter((s:PlaceState) => {
          if(s.use_yn==="N") {
            if(s.date === today) return s.start_time > DateTime.now().toFormat('HH:mm');
            return true;
          } else return false;
        });
        placeState.push(...openMonthState);
  
      })
      if(index === 18) resolve(placeState);
    };
  });
  
}
