import {URL_MONTH_TIME} from 'const'
import { DateTime } from 'ts-luxon'
import {DateState, PlaceState} from 'models'

export async function getMonthTimeState() {
  return new Promise<PlaceState[]>(async (resolve) =>{
    let placeState: PlaceState[] = [];
    const today = DateTime.now().toFormat('yyyyMMdd');
  
    for (let index = 1; index <= 18; index++) {
      await fetch(`${URL_MONTH_TIME}?company_code=YCS04&part_code=02&base_date=${today}&place_code=${index}`)
      .then(r=>r.json()).then(function(stateList) {
        const openMonthState = stateList.filter((s:PlaceState) => s.use_yn==="N");
        placeState.push(...openMonthState);
  
      })
      if(index === 18) resolve(placeState);
    };
  });
  
}
