//student profile
export async function profile() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const json = await response.json()
    if (json.token) {
      return json
    } else {
      console.log(json)

      return json
    }
  } catch (e) {
    return { success: false, message: e }
  }
}

type Props = {
  email: string
  oldPassword: string
  newPassword: string
}

export async function changePassword({ email, oldPassword, newPassword }: Props) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: oldPassword,
        newPassword: newPassword
      })
    })
    const json = await response.json()
    if (json.token) {
      return json
    } else {
      console.log(json)

      return json
    }
  } catch (e) {
    return { success: false, message: e }
  }
}

//faculty profile

export async function facultyProfile() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const json = await response.json()
    if (json.token) {
      return json
    } else {
      console.log(json)

      return json
    }
  } catch (e) {
    return { success: false, message: e }
  }
}

type editFacultyProfileProps = {
  name: string
  department: string
  designation: string
  maxProjects: number
  phoneNumber: string
}

//edit profile for faculty only
export async function editFacultyProfile({
  name,
  department,
  designation,
  maxProjects,
  phoneNumber
}: editFacultyProfileProps) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/profile`, {
      method: 'PUT',
      body: JSON.stringify({
        name: name,
        department: department,
        designation: designation,
        maxProjects: maxProjects,
        phoneNumber: phoneNumber
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const json = await response.json()
    if (json.token) {
      return json
    } else {
      console.log(json)

      return json
    }
  } catch (e) {
    return { success: false, message: e }
  }
}

type changeFacultyPasswordProps = {
  email: string
  oldPassword: string
  newPassword: string
}

//change faculty password
export async function changeFacultyPassword({ email, oldPassword, newPassword }: changeFacultyPasswordProps) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`, {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: oldPassword,
        newPassword: newPassword
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()
    if (json.token) {
      return json
    } else {
      console.log(json)

      return json
    }
  } catch (e) {
    return { success: false, message: e }
  }
}
