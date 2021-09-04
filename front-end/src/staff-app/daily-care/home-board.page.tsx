import React, { useState, useEffect } from "react";
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component";
import { StateList } from "staff-app/components/roll-state/roll-state-list.component"

const buildReport = (students: Person[]) => {
  const result: StateList[] = [
    { type: "all", count: students.length },
    { type: "present", count: 0 },
    { type: "late", count: 0 },
    { type: "absent", count: 0 },
  ];
  students.forEach(({ status }) => {
    if (status) {
      const idx = result.findIndex(({ type }) => type === status);
      result[idx].count++;
    }
  });
  return result;
};

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false);
  const [students, setStudents] = useState<Person[]>([]);
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" });

  const [ saveStudents ] = useApi<{ students: Person[] }>({ url: "save-roll" });


  useEffect(() => {
    void getStudents()
  }, [getStudents]);

  useEffect(() => {
    if (data) {
      setStudents(data.students);
    }
  }, [data]);

  const onToolbarAction = (action: ToolbarAction, value = '') => {
    if (action === "roll") {
      setIsRollMode(true)
    } else if (action === "sort") {
      const newStudents = [...students];
      newStudents.sort(function (a, b) {
        return a.first_name.localeCompare(b.first_name);
      });
      setStudents(newStudents)
    } else if (action === "search") {
      if (!value && data?.students) {
        setStudents([...data.students]);
      } else {
        const filteredStudents = students.filter(
          student => student.first_name.toLowerCase().includes(value.toLowerCase())
        );
        setStudents(filteredStudents);
      }
    } else if (action === "reset") {
      if (data && data.students) {
        setStudents([...data.students]);
      } 
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false);
    } else if (action === "complete") {
      const transformedStudents = students.map(({ id, status }) => ({
        student_id: id,
        roll_state: status || "unmark"
      }));
      saveStudents({
        student_roll_states: transformedStudents
      });
      window.location.href = "http://localhost:3000/staff/activity";
    }
  }

  const handleItemClick = (id: number, status: string) => {
    const updatedStudents = students.map(student => {
      if (student.id === id) {
        return { ...student, status}
      }
      return student;
    });
    updatedStudents.sort((a, _b) => a.status === "present" ? -1 : 1);
    setStudents(updatedStudents);
  };

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
            {students.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} onItemClick={(status: string) =>handleItemClick(s.id, status)} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} list={buildReport(students)} />
    </>
  )
}

type ToolbarAction = "roll" | "sort" | "search" | "reset";
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const { onItemClick } = props;


  return (
    <S.ToolbarContainer>
      <div style={{cursor : 'pointer'}} onClick={() => onItemClick("sort")}>First Name</div>
      {showInput
        ?
        <>
          <input style = {cancelInput} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onItemClick("search", e.target.value)} />
          <i style = {cancelSearch} className="fas fa-times" onClick={() => {
            onItemClick("reset");
            setShowInput(false);
          }}/>
        </>
        :
        <div style={{cursor : 'pointer'}} onClick={() => setShowInput(true)}>Search</div>
      }
      <S.Button style={{cursor : 'pointer'}} onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const cancelSearch:any = {
cursor: 'pointer',
position: 'relative',
right: '55px'
}

const cancelInput:any = {
  position: 'relative',
  left: '70px'
  }

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
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
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
