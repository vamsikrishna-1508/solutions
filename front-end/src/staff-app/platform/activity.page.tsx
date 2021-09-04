import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { Roll } from "shared/models/roll"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Colors } from "shared/styles/colors"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { RollListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { useApi } from "shared/hooks/use-api"

export const ActivityPage: React.FC = () => {
  const [getActivities, data, loadState, error] = useApi<{ roll: Roll[] }>({ url: "get-activities" });
  const rolledData:any = data
  let activityBar:any
  console.log(rolledData)
  useEffect(() => {
    void getActivities()
  }, [getActivities]);


  if (error) return (<CenteredContainer>
  <div>Failed to load</div>
</CenteredContainer>)


  if (loadState === 'loading') return ( <CenteredContainer>
  <FontAwesomeIcon icon="spinner" size="2x" spin />
</CenteredContainer>)


  return <S.Container>
    <h1>Activity Page</h1>
    <>
    {rolledData !== undefined && rolledData.activity.map((r:any) => {
     activityBar =  <S.ToolbarContainer>
     <div> {r.entity.name} </div>
     <div> {r.entity.completed_at} </div>
      </S.ToolbarContainer>
      let avatar = <S.Container>
        {r.entity.student_roll_states !== undefined &&r.entity.student_roll_states.map((stuData:any) => {
          const RollData:any = <RollListTile roll={stuData}/>
          return RollData
        })
        }
      </S.Container>
      return [activityBar, avatar]
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
