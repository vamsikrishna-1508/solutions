import React from "react"
import styled from "styled-components"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Images } from "assets/images"
import { Colors } from "shared/styles/colors"
import { Person, PersonHelper } from "shared/models/person"
import { RollInput } from "shared/models/roll"
import { RollerStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { RollStateSwitcher } from "staff-app/components/roll-state/roll-state-switcher.component"

interface Props {
  isRollMode?: boolean
  student: Person,
  onItemClick?: (status: string) => void;
}
export const StudentListTile: React.FC<Props> = ({ isRollMode, student, onItemClick }) => {
  return (
    <S.Container>
      <S.Avatar url={Images.avatar}></S.Avatar>
      <S.Content>
        <div>{PersonHelper.getFullName(student)}</div>
      </S.Content>
      {isRollMode && (
        <S.Roll>
          <RollStateSwitcher onStateChange={(status) => onItemClick && onItemClick(status)}/>
        </S.Roll>
      )}
    </S.Container>
  )
}

interface rollProps {
  roll: RollInput,
  size?: number
}

export const RollListTile: React.FC<rollProps> = ({ roll, size = 40, }) => {
  let rollesData:any = roll
  return (
    <S.Container>
      <S.Avatar url={Images.avatar}></S.Avatar>
      <S.Content>{rollesData.student_id}</S.Content>
      <RollerStateIcon type={rollesData.roll_state} size={size} />
    </S.Container>
  )
}


const S = {
  Container: styled.div`
    margin-top: ${Spacing.u3};
    padding-right: ${Spacing.u2};
    display: flex;
    height: 60px;
    border-radius: ${BorderRadius.default};
    background-color: #fff;
    box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }
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
  Content: styled.div`
    flex-grow: 1;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
  `,
  Roll: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u4};
  `,
}
