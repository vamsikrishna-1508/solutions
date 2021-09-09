import React, { useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { Roll } from "shared/models/roll"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Colors } from "shared/styles/colors"
import { Person } from "shared/models/person"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { RollListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { useApi } from "shared/hooks/use-api"

export const ActivityPage: React.FC = () => {
  const [getActivities, data, loadState, error] = useApi<{ roll: Roll[] }>({ url: "get-activities" });
  const [getStudents, Sdata] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" });
  let rolledData:any = data
  let StuData:any =  Sdata


  const getDateText = (students:any) =>{
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var d = new Date(students);
    var day = d.getDay();
    var month = monthNames[d.getMonth()];
    var year = d.getFullYear();
    var hour = d.getHours();
    var min = d.getMinutes();
    var fullDatetime = day + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
    return fullDatetime;
  }

 // if(rolledData !== undefined){    // In case of Latest Date Sort //
 // rolledData.activity.sort(function(a:any, b:any) {
//    return  +new Date(b.date) - +new Date(a.date);
 // })
//}


useEffect(() => {
  void getStudents()
}, [getStudents]);

  useEffect(() => {
    void getActivities()
  }, [getActivities]);

  if(Sdata !== undefined){
    console.log(Sdata);
  }

  if(rolledData !== undefined){
    console.log(Sdata);
  }

  if (error) return (<CenteredContainer>
  <div>Failed to load. Please refresh the page.</div>
</CenteredContainer>)


  if (loadState === 'loading') return ( <CenteredContainer>
  <FontAwesomeIcon icon="spinner" size="2x" spin />
</CenteredContainer>)


  return <S.Container>
    <h1>Activity Page</h1>
    <>
    {rolledData !== undefined && rolledData.activity.map((r:any) => {
     let activityBar = <><br /> <S.ToolbarContainer>
     <div> {r.entity.name} </div>
     <div> {getDateText(r.entity.completed_at)} </div>
      </S.ToolbarContainer>
      </>
      let studentTile = <>
        {r.entity.student_roll_states !== undefined &&r.entity.student_roll_states.map((stuData:any) => {
          const RollData:any = <RollListTile roll={stuData} student={StuData}/>
          return RollData
        })
        }
        </>
      return [activityBar, studentTile]
      })
      }
    </>
  </S.Container>
}

const S = {
  
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
    ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `
  ,
  Content: styled.div`
    flex-grow: 1;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
  `,
    Avatar: styled.div<{ url: string }>`
    width: 60px;
    background-image: url(${({ url }) => url});
    border-top-left-radius: ${BorderRadius.default};
    border-bottom-left-radius: ${BorderRadius.default};
    background-size: cover;
    background-position: 50%;
    align-self: stretch;
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}