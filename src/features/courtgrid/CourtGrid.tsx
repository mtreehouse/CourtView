import "gridjs/dist/theme/mermaid.css";
import { Fab } from '@mui/material';
import { FabInfo } from 'features/common/FabInfo';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import {Mokdong} from './mokdong/Mokdong'

export function CourtGrid() {
  return (
    <div id="courtgridDiv">
      <FabInfo title={"CourtView 이용 안내"}>
        <b>현재 예약 가능한 모든 코트를 보여줍니다.</b><br/><br/>
        <li>
          <b>PC 이용 시</b>
          <div>
            <b>예약 버튼</b> 클릭 후 열리는 새 창에서<br/>
            로그인 후 <b>키보드 F12</b>를 누른 후에<br/>
            <b>Console 창</b>에 <b>CTRL + V</b> 누른 후 <b>Enter</b>.<br/>
            <sup>(자동 복사된 스크립트 실행)</sup><br/>
            휴대폰 인증 후 예약 진행.<br/>
          </div>
        </li><br/>
        <li>
          <b>모바일 이용 시</b><br />
          <div>알림 창 내용 기억 후 직접 선택하여 예약.</div>
        </li>
      </FabInfo>
      <Fab onClick={()=>{window.location.reload();}} color="success" size="small" aria-label="add" id='fabRefresh'>
          <RestartAltOutlinedIcon/>
      </Fab> 
      <div>
        <img id='courtViewLogo' alt='courtView Logo' src={process.env.PUBLIC_URL + "/image/courtview.png"} />
        <h4>{"Mok-dong Court"}</h4>
      </div>
      <Mokdong/>
    </div>
  );
}
