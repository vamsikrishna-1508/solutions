export interface Roll {
  id: number
  name: string
  completed_at: Date
  student_roll_states: { student_id: number; roll_state: RolllStateType, name: string }[]
}

export interface RollInput {
  student_roll_states: { student_id: number; roll_state: RolllStateType }[]
}


export type RolllStateType = "unmark" | "present" | "absent" | "late"
